# Deploy USDT NEO (2 Steps)

## Step 1: Add 2 Secrets to GitHub

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://postgres:TecnoSp%40rk4@db.ylxjtqabychmaoznqfiq.supabase.co:5432/postgres` |
| `APP_SECRET` | `usdtneo-secret-key-2026-change-me` |

> The `@` in your password is encoded as `%40` — this is correct.

3. After you add both secrets, push this code to GitHub:

```bash
git add .
git commit -m "Ready for deploy"
git push origin main
```

This will **automatically**:
- Create all database tables in Supabase
- Seed the 7 mining tiers + platform settings

Check progress at: `GitHub repo` → **Actions** tab

---

## Step 2: Connect Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Set:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build:vercel`
   - **Output Directory**: `dist/public`
4. Click **Deploy**

Vercel will auto-deploy every time you push to GitHub.

---

## Make Yourself Admin

1. Register an account on your live site
2. Go to [supabase.com](https://supabase.com) → Your project → **Table Editor** → `users`
3. Find your row → change `role` from `user` to `admin`
4. Refresh your site → **Profile** page → click **Admin Panel**

Done. That's it. 2 steps + 1 admin toggle.
