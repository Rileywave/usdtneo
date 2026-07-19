import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function NgnTransfer() {
  const navigate = useNavigate();
  const location = useLocation();
  const tier = location.state?.tier;
  const { data: settings } = trpc.settings.getAll.useQuery();
  const utils = trpc.useUtils();

  const [proofImage, setProofImage] = useState('');
  const [payerName, setPayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUpgrade = trpc.upgrade.create.useMutation({
    onSuccess: () => {
      alert('Upgrade request submitted! We will review your payment shortly.');
      utils.upgrade.myUpgrades.invalidate();
      navigate('/dashboard');
    },
    onError: (err) => alert(err.message),
  });

  if (!tier) {
    navigate('/dashboard/upgrade');
    return null;
  }

  const bankName = settings?.bank_name || 'Paga';
  const accountName = settings?.bank_account_name || 'Joseph Nnanna';
  const accountNumber = settings?.bank_account_number || '0051857178';
  const transferRemark = 'USDT NEO Upgrade';

  const handleSubmit = () => {
    if (!proofImage) {
      alert('Please upload a payment screenshot');
      return;
    }
    setIsSubmitting(true);
    createUpgrade.mutate({
      tierId: tier.id,
      amountUsd: tier.priceUsd,
      amountLocal: tier.priceNgn,
      currency: 'NGN',
      paymentMethod: 'bank_transfer',
      proofImage,
      payerName: payerName || undefined,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen pt-4 px-4 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard/payment-method', { state: { tier } })} className="p-2 rounded-full glass-card">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>NGN Bank Transfer</h1>
      </div>

      {/* Amount */}
      <div className="glass-card p-4 mb-4 text-center">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Upgrade to Tier {tier.level}</p>
        <p className="text-2xl font-bold gradient-text mt-1">
          ₦{parseFloat(tier.priceNgn).toLocaleString()}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Amount to Pay
        </p>
      </div>

      {/* Bank Details */}
      <div className="glass-card p-4 mb-4 space-y-3">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Bank Details</h3>

        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Account Name</p>
          <div className="bg-white/50 rounded-xl p-3 mt-1 flex items-center justify-between">
            <span className="text-sm font-medium">{accountName}</span>
          </div>
        </div>

        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Account Number</p>
          <div className="bg-white/50 rounded-xl p-3 mt-1 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--accent-teal)]">{accountNumber}</span>
            <button onClick={() => copyToClipboard(accountNumber)}>
              <Copy size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Bank Name</p>
          <div className="bg-white/50 rounded-xl p-3 mt-1">
            <span className="text-sm font-medium">{bankName}</span>
          </div>
        </div>

        <div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Transfer Remark/Narration</p>
          <div className="bg-white/50 rounded-xl p-3 mt-1 flex items-center justify-between">
            <span className="text-sm font-medium">{transferRemark}</span>
            <button onClick={() => copyToClipboard(transferRemark)}>
              <Copy size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Screenshot */}
      <div className="glass-card p-4 mb-4">
        <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
          Upload Payment Screenshot <span className="text-red-500">*</span>
        </h3>
        <div
          className="border-2 border-dashed border-[var(--accent-teal)]/30 rounded-xl p-6 text-center cursor-pointer"
          onClick={() => {
            const url = prompt('Enter image URL (for demo):');
            if (url) setProofImage(url);
          }}
        >
          {proofImage ? (
            <img src={proofImage} alt="Proof" className="w-full h-32 object-cover rounded-lg" />
          ) : (
            <>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[var(--accent-teal)]/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Tap to upload screenshot</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>PNG, JPG up to 5MB</p>
            </>
          )}
        </div>
      </div>

      {/* Payer Name */}
      <div className="glass-card p-4 mb-4">
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Payer Name / Reference (optional)</p>
        <input
          type="text"
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          placeholder="e.g. John Doe"
          className="w-full bg-white/50 rounded-xl p-3 text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full gradient-primary text-white font-semibold py-4 rounded-2xl shadow-button disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Confirm Payment'}
      </button>
    </div>
  );
}
