import { z } from "zod";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { createRouter, publicQuery } from "../middleware.js";
import { findUserByEmailOrUsername, createLocalUser, getUserById } from "../queries/users-ext.js";
import { env } from "../lib/env.js";

const JWT_ALG = "HS256";

async function signLocalToken(userId: number): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT({ userId, type: "local" })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("1 year")
    .sign(secret);
}

export async function verifyLocalToken(token: string): Promise<{ userId: number } | null> {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
      clockTolerance: 60,
    });
    if (payload.type !== "local" || !payload.userId) return null;
    return { userId: payload.userId as number };
  } catch {
    return null;
  }
}

function generateReferralCode(): string {
  return "NEO" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        fullName: z.string().min(1),
        username: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        referralCode: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if username or email already exists
      const existing = await findUserByEmailOrUsername(input.username);
      if (existing && existing.email === input.email) {
        throw new Error("Email already taken");
      }

      const existingEmail = await findUserByEmailOrUsername(input.email);
      if (existingEmail) {
        throw new Error("Email already taken");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Handle referral
      let referredBy: number | undefined;
      if (input.referralCode) {
        const { getReferrerByCode } = await import("../queries/users-ext.js");
        const referrer = await getReferrerByCode(input.referralCode);
        if (referrer && referrer.id !== undefined) {
          referredBy = referrer.id as number;
        }
      }

      // Create user in Firestore
      const userId = await createLocalUser({
        name: input.fullName,
        username: input.username,
        email: input.email,
        password: hashedPassword,
        referralCode: generateReferralCode(),
        referredBy,
      });

      const token = await signLocalToken(userId);
      return { success: true, token };
    }),

  login: publicQuery
    .input(
      z.object({
        emailOrUsername: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const user = await findUserByEmailOrUsername(input.emailOrUsername);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      if (!user.password) {
        throw new Error("This account uses OAuth login");
      }

      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) {
        throw new Error("Invalid credentials");
      }

      // Update last sign in
      const { updateUser } = await import("../queries/users-ext.js");
      await updateUser(user.id as number, { lastSignInAt: new Date() });

      const token = await signLocalToken(user.id as number);
      return { success: true, token };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("x-local-auth-token");
    if (!authHeader) return null;

    const claim = await verifyLocalToken(authHeader);
    if (!claim) return null;

    return getUserById(claim.userId);
  }),
});
