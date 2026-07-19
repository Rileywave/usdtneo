import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function AdminSettings() {
  const { data: settings, isLoading } = trpc.settings.getAll.useQuery();
  const utils = trpc.useUtils();

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const update = trpc.settings.update.useMutation({
    onSuccess: () => {
      utils.settings.getAll.invalidate();
      alert('Settings saved!');
    },
    onError: (err) => alert(err.message),
  });

  const handleSave = () => {
    update.mutate(form);
  };

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fields = [
    { key: 'bank_name', label: 'Bank Name', placeholder: 'Paga' },
    { key: 'bank_account_name', label: 'Account Name', placeholder: 'Joseph Nnanna' },
    { key: 'bank_account_number', label: 'Account Number', placeholder: '0051857178' },
    { key: 'usdt_address', label: 'USDT Address', placeholder: 'TP4FPSGSPqJ2nutSye825vxYxHW78mUnqY' },
    { key: 'usdt_network', label: 'USDT Network', placeholder: 'TRC20' },
    { key: 'referral_commission_1', label: 'Referral Commission L1 (%)', placeholder: '12' },
    { key: 'referral_commission_2', label: 'Referral Commission L2 (%)', placeholder: '6' },
    { key: 'referral_commission_3', label: 'Referral Commission L3 (%)', placeholder: '3' },
    { key: 'min_withdrawal', label: 'Min Withdrawal (USDT)', placeholder: '10' },
    { key: 'withdrawal_fee', label: 'Withdrawal Fee (USDT)', placeholder: '1' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Platform Settings</h2>

      {isLoading && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>}

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.key} className="glass-card p-3">
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>
              {field.label}
            </label>
            <input
              type="text"
              value={form[field.key] || ''}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-white/50 rounded-xl p-2.5 text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={update.isPending}
        className="w-full gradient-primary text-white font-semibold py-3 rounded-2xl shadow-button mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Save size={16} /> {update.isPending ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
