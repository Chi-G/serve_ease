import { useState } from 'react';
import { ArrowLeft, CreditCard, Building2, Copy, Check, ShieldCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import type { CartItem } from '@/types';

interface CheckoutProps {
  cart: CartItem[];
  customerNames: string[];
  onPayment: (method: 'card' | 'transfer', email?: string) => void;
  onBack: () => void;
}

export function Checkout({ cart, customerNames, onPayment, onBack }: CheckoutProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'transfer' | null>(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const accountNumber = '0123456789';
  const bankName = 'ServeEase Bank';

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loyaltyPoints = Math.floor(total / 100);

  const groupedByCustomer = cart.reduce((acc, item) => {
    if (!acc[item.customerName]) {
      acc[item.customerName] = [];
    }
    acc[item.customerName].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={onBack} className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black tracking-tight uppercase">Checkout</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-card rounded-3xl border border-border p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ShieldCheck size={120} />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Total Amount Due</p>
          <p className="text-6xl font-black mb-6 tracking-tighter" style={{ color: '#FF5C00' }}>
            ₦{total.toLocaleString()}
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {Object.entries(groupedByCustomer).map(([name, items]) => {
              const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
              return (
                <div key={name} className="px-3 py-1.5 rounded-xl bg-secondary/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="text-muted-foreground">{name}:</span>
                  <span style={{ color: '#FF5C00' }}>₦{subtotal.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20">
            <span className="text-xs font-black uppercase tracking-widest">Earn {loyaltyPoints} Points</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Receipt Email</h2>
            <span className="text-[10px] font-bold text-[#FF5C00] uppercase tracking-tighter bg-[#FF5C00]/10 px-2 py-0.5 rounded-full">Required</span>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#FF5C00] transition-colors">
              <Mail size={20} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-card border-2 border-border focus:border-[#FF5C00] rounded-2xl py-4 pl-12 pr-4 font-bold transition-all outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Payment Method</h2>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => setSelectedMethod('card')}
              className="group w-full p-4 rounded-3xl border-2 transition-all flex items-center gap-4 text-left"
              style={{
                borderColor: selectedMethod === 'card' ? '#FF5C00' : 'rgba(255,255,255,0.05)',
                backgroundColor: selectedMethod === 'card' ? 'rgba(255, 92, 0, 0.05)' : 'transparent'
              }}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedMethod === 'card' ? 'scale-110' : ''}`}
                style={{ backgroundColor: selectedMethod === 'card' ? '#FF5C00' : 'rgba(255,255,255,0.05)' }}
              >
                <CreditCard size={28} className={selectedMethod === 'card' ? 'text-white' : 'text-muted-foreground'} />
              </div>
              <div className="flex-1">
                <p className="font-black text-lg">Card / USSD</p>
                <p className="text-sm text-muted-foreground">Instant activation & receipt</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-[#FF5C00]' : 'border-muted'}`}>
                {selectedMethod === 'card' && <div className="w-3 h-3 rounded-full bg-[#FF5C00]" />}
              </div>
            </button>

            <button
              onClick={() => setSelectedMethod('transfer')}
              className="group w-full p-4 rounded-3xl border-2 transition-all flex items-center gap-4 text-left"
              style={{
                borderColor: selectedMethod === 'transfer' ? '#FF5C00' : 'rgba(255,255,255,0.05)',
                backgroundColor: selectedMethod === 'transfer' ? 'rgba(255, 92, 0, 0.05)' : 'transparent'
              }}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedMethod === 'transfer' ? 'scale-110' : ''}`}
                style={{ backgroundColor: selectedMethod === 'transfer' ? '#FF5C00' : 'rgba(255,255,255,0.05)' }}
              >
                <Building2 size={28} className={selectedMethod === 'transfer' ? 'text-white' : 'text-muted-foreground'} />
              </div>
              <div className="flex-1">
                <p className="font-black text-lg">Bank Transfer</p>
                <p className="text-sm text-muted-foreground">Manual verification required</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'transfer' ? 'border-[#FF5C00]' : 'border-muted'}`}>
                {selectedMethod === 'transfer' && <div className="w-3 h-3 rounded-full bg-[#FF5C00]" />}
              </div>
            </button>
          </div>
        </div>

        {selectedMethod === 'transfer' && (
          <div className="bg-card rounded-3xl border border-border p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 bg-[#FF5C00] rounded-full" />
                <h3 className="font-black uppercase tracking-widest text-sm">Transfer Instructions</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Bank Name</p>
                <p className="font-bold text-sm">{bankName}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Account Name</p>
                <p className="font-bold text-sm uppercase">ServeEase Solutions</p>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-2xl relative overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Account Number</p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-black tracking-widest" style={{ color: '#FF5C00' }}>{accountNumber}</p>
                <button
                  onClick={handleCopy}
                  className="p-3 rounded-xl bg-[#FF5C00]/10 text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition-all"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 h-fit">
                <ShieldCheck size={18} />
              </div>
              <p className="text-xs leading-relaxed text-blue-100/70 font-medium">
                Please make the transfer of <span className="text-white font-bold">₦{total.toLocaleString()}</span> then click "Verify" below. A waiter will confirm your payment shortly.
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedMethod && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border z-50">
          <button
            onClick={() => {
              if (selectedMethod === 'card' && !email) {
                toast.error('Please enter your email for the receipt.');
                return;
              }
              onPayment(selectedMethod, email);
            }}
            disabled={selectedMethod === 'card' && !email}
            className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-[#FF5C00]/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
            style={{ backgroundColor: '#FF5C00' }}
          >
            <span>{selectedMethod === 'card' ? 'Pay Now' : 'I Have Transferred'}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </button>
        </div>
      )}
    </div>
  );
}
