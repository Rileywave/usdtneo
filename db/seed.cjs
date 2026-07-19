const postgres = require('postgres');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

async function seed() {
  const client = postgres(databaseUrl, {
    prepare: false,
    max: 1,
    ssl: { rejectUnauthorized: false }
  });

  // Test connection first
  try {
    await client`SELECT 1`;
    console.log('Connected!');
  } catch (e) {
    console.error('Connection failed:', e.message);
    process.exit(1);
  }

  const existingTiers = await client`SELECT COUNT(*) as count FROM tiers`;
  if (parseInt(existingTiers[0].count) === 0) {
    await client`
      INSERT INTO tiers (name, level, period, earn_per_day, price_usd, price_ngn, price_ghs, mines_per_day, is_active) VALUES
        ('Tier 1', 1, 30, '1.00', '0.00', '0.00', '0.00', 1, true),
        ('Tier 2', 2, 30, '1.50', '24.00', '32827.00', '0.00', 1, true),
        ('Tier 3', 3, 30, '2.50', '75.00', '102585.00', '0.00', 1, true),
        ('Tier 4', 4, 30, '5.00', '225.00', '157297.00', '0.00', 2, true),
        ('Tier 5', 5, 30, '12.00', '450.00', '307754.00', '0.00', 2, true),
        ('Tier 6', 6, 30, '30.00', '999.00', '923263.00', '0.00', 3, true),
        ('Tier 7', 7, 30, '75.00', '1999.00', '2734226.00', '0.00', 3, true)
    `;
    console.log('Seeded 7 tiers');
  } else {
    console.log('Tiers already seeded, skipping');
  }

  const existingSettings = await client`SELECT COUNT(*) as count FROM settings`;
  if (parseInt(existingSettings[0].count) === 0) {
    await client`
      INSERT INTO settings (key, value) VALUES
        ('bank_name', 'Paga'),
        ('bank_account_name', 'Joseph Nnanna'),
        ('bank_account_number', '0051857178'),
        ('usdt_address', 'TP4FPSGSPqJ2nutSye825vxYxHW78mUnqY'),
        ('usdt_network', 'TRC20'),
        ('referral_commission_1', '12'),
        ('referral_commission_2', '6'),
        ('referral_commission_3', '3'),
        ('min_withdrawal', '10'),
        ('withdrawal_fee', '1'),
        ('maintenance_mode', 'false'),
        ('announcement', '')
    `;
    console.log('Seeded 12 settings');
  } else {
    console.log('Settings already seeded, skipping');
  }

  console.log('Seed complete!');
  await client.end();
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
