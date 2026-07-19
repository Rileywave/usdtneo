const postgres = require('postgres');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

async function pushSchema() {
  console.log('Connecting to database...');
  const client = postgres(databaseUrl, { prepare: false, max: 1 });

  console.log('Creating enums...');
  const enums = [
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN CREATE TYPE user_role AS ENUM ('user', 'admin'); END IF; END $$;`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN CREATE TYPE user_status AS ENUM ('active', 'suspended'); END IF; END $$;`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'currency') THEN CREATE TYPE currency AS ENUM ('NGN', 'USDT'); END IF; END $$;`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN CREATE TYPE payment_method AS ENUM ('bank_transfer', 'usdt'); END IF; END $$;`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'upgrade_status') THEN CREATE TYPE upgrade_status AS ENUM ('pending', 'approved', 'rejected'); END IF; END $$;`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'withdrawal_status') THEN CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'paid', 'rejected'); END IF; END $$;`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'referral_source') THEN CREATE TYPE referral_source AS ENUM ('upgrade', 'mining'); END IF; END $$;`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN CREATE TYPE notification_type AS ENUM ('upgrade', 'withdrawal', 'mining', 'referral', 'system'); END IF; END $$;`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_status') THEN CREATE TYPE notification_status AS ENUM ('unread', 'read'); END IF; END $$;`,
  ];
  for (const q of enums) { try { await client.unsafe(q); } catch (e) { /* exists */ } }

  console.log('Creating tables...');
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, "unionId" VARCHAR(255) UNIQUE, name VARCHAR(255), username VARCHAR(100) UNIQUE, email VARCHAR(320) UNIQUE, password VARCHAR(255), avatar TEXT, role user_role DEFAULT 'user' NOT NULL, status user_status DEFAULT 'active' NOT NULL, referral_code VARCHAR(20) UNIQUE, referred_by BIGINT, balance DECIMAL(18,8) DEFAULT '0' NOT NULL, total_mined DECIMAL(18,8) DEFAULT '0' NOT NULL, total_withdrawn DECIMAL(18,8) DEFAULT '0' NOT NULL, current_tier_id BIGINT, mines_today INTEGER DEFAULT 0 NOT NULL, last_mine_at TIMESTAMP, "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL, "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL, "lastSignInAt" TIMESTAMP DEFAULT NOW() NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS tiers (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, level INTEGER NOT NULL UNIQUE, period INTEGER NOT NULL, earn_per_day DECIMAL(18,8) NOT NULL, price_usd DECIMAL(18,2) NOT NULL, price_ngn DECIMAL(18,2) NOT NULL, price_ghs DECIMAL(18,2) DEFAULT '0' NOT NULL, mines_per_day INTEGER DEFAULT 1 NOT NULL, is_active BOOLEAN DEFAULT true NOT NULL, created_at TIMESTAMP DEFAULT NOW() NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS upgrade_requests (id SERIAL PRIMARY KEY, user_id BIGINT NOT NULL, tier_id BIGINT NOT NULL, amount_usd DECIMAL(18,2) NOT NULL, amount_local DECIMAL(18,2) NOT NULL, currency currency NOT NULL, payment_method payment_method NOT NULL, status upgrade_status DEFAULT 'pending' NOT NULL, proof_image TEXT, tx_hash VARCHAR(255), created_at TIMESTAMP DEFAULT NOW() NOT NULL, updated_at TIMESTAMP DEFAULT NOW() NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS wallet_bindings (id SERIAL PRIMARY KEY, user_id BIGINT NOT NULL, bank_name VARCHAR(100), bank_account_name VARCHAR(200), bank_account_number VARCHAR(50), usdt_address VARCHAR(200), usdt_network VARCHAR(20), created_at TIMESTAMP DEFAULT NOW() NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS withdrawals (id SERIAL PRIMARY KEY, user_id BIGINT NOT NULL, amount DECIMAL(18,8) NOT NULL, fee DECIMAL(18,8) DEFAULT '0' NOT NULL, currency currency NOT NULL, destination VARCHAR(50) NOT NULL, address VARCHAR(255), status withdrawal_status DEFAULT 'pending' NOT NULL, created_at TIMESTAMP DEFAULT NOW() NOT NULL, updated_at TIMESTAMP DEFAULT NOW() NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS mining_history (id SERIAL PRIMARY KEY, user_id BIGINT NOT NULL, tier_id BIGINT NOT NULL, amount DECIMAL(18,8) NOT NULL, created_at TIMESTAMP DEFAULT NOW() NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS referral_earnings (id SERIAL PRIMARY KEY, user_id BIGINT NOT NULL, referred_user_id BIGINT NOT NULL, amount DECIMAL(18,8) NOT NULL, tier INTEGER NOT NULL, source referral_source NOT NULL, created_at TIMESTAMP DEFAULT NOW() NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS settings (id SERIAL PRIMARY KEY, key VARCHAR(100) NOT NULL UNIQUE, value TEXT NOT NULL, updated_at TIMESTAMP DEFAULT NOW() NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS admin_logs (id SERIAL PRIMARY KEY, admin_id BIGINT, action VARCHAR(100) NOT NULL, target VARCHAR(50), target_id BIGINT, details TEXT, created_at TIMESTAMP DEFAULT NOW() NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, user_id BIGINT NOT NULL, type notification_type NOT NULL, title VARCHAR(200) NOT NULL, message TEXT NOT NULL, status notification_status DEFAULT 'unread' NOT NULL, created_at TIMESTAMP DEFAULT NOW() NOT NULL)`,
  ];
  for (const sql of tables) {
    try { await client.unsafe(sql); console.log('Table OK'); }
    catch (e) { console.log('Table note:', e.message ? e.message.slice(0, 100) : 'ok'); }
  }

  console.log('Schema push complete!');
  await client.end();
}

pushSchema().catch((err) => { console.error('Failed:', err); process.exit(1); });
