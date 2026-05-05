import { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, ShieldCheck, Mail, UserRound, UtensilsCrossed, Zap, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { CartItem } from '@/types';

interface CheckoutProps {
  cart: CartItem[];
  customerNames: string[];
  onPayment: (method: 'online' | 'offline', email?: string) => void;
  onBack: () => void;
}

export function Checkout({ cart, customerNames, onPayment, onBack }: CheckoutProps) {
  const [selectedMethod, setSelectedMethod] = useState<'online' | 'offline' | null>(null);
  const [email, setEmail] = useState('');

  const total = Math.round(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
  const loyaltyPoints = Math.floor(total / 100);

  const groupedByCustomer = cart.reduce((acc, item) => {
    if (!acc[item.customerName]) {
      acc[item.customerName] = [];
    }
    acc[item.customerName].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const paymentMethods = [
    {
      id: 'online' as const,
      title: 'Pay Online',
      description: 'Card, Transfer, OPay, Bank, USSD',
      icon: <Zap className="text-white" size={28} />,
      bgColor: 'bg-orange-500',
      shadowColor: 'shadow-orange-500/20',
      tag: 'Instant',
      details: 'Fastest activation. Automated verification via Paystack.'
    },
    {
      id: 'offline' as const,
      title: 'Pay at Table',
      description: 'Cash or POS Machine',
      icon: <UserRound className="text-white" size={28} />,
      bgColor: 'bg-blue-500',
      shadowColor: 'shadow-blue-500/20',
      tag: 'Call Waiter',
      details: 'A waiter will come to your table with the bill and POS.'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3 px-6 py-5">
          <button onClick={onBack} className="p-2.5 rounded-2xl bg-secondary hover:bg-muted transition-all active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase">Checkout</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">Order Summary & Payment</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-lg mx-auto">
        {/* Order Summary Card */}
        <div className="bg-card rounded-[2.5rem] border border-border p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] pointer-events-none rotate-12">
            <UtensilsCrossed size={200} />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-6">
            <Zap size={14} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">Elite Checkout</span>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3 opacity-60">Total Amount Due</p>
          <p className="text-7xl font-black mb-8 tracking-tighter text-foreground">
            ₦{total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {Object.entries(groupedByCustomer).map(([name, items]) => {
              const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
              return (
                <div key={name} className="px-4 py-2 rounded-2xl bg-secondary/80 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border border-border/50">
                  <span className="text-muted-foreground/60">{name}</span>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-foreground">₦{subtotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <ShieldCheck size={16} className="text-orange-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Earn Points</span>
              <span className="text-sm font-black text-orange-500">+{loyaltyPoints} PTS</span>
            </div>
          </div>
        </div>

        {/* Email Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-muted-foreground" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Receipt Email</h2>
            </div>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">Required</span>
          </div>
          
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for receipt..."
              className="w-full bg-card border-2 border-border focus:border-orange-500 rounded-[1.5rem] py-5 px-6 font-bold transition-all outline-none text-lg shadow-sm"
              required
            />
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 ml-1">
            <CreditCard size={16} className="text-muted-foreground" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Choose Payment Category</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`group relative w-full p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-4 text-left overflow-hidden ${
                  selectedMethod === method.id 
                    ? 'border-orange-500 bg-orange-500/[0.03] ring-4 ring-orange-500/10' 
                    : 'border-border bg-card hover:border-orange-500/50 hover:bg-orange-500/[0.01]'
                }`}
              >
                {/* Background Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-[0.03] transition-colors ${
                  selectedMethod === method.id ? 'bg-orange-500' : 'bg-muted-foreground'
                }`} />

                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-lg ${method.bgColor} ${method.shadowColor} ${
                    selectedMethod === method.id ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-xl tracking-tight uppercase">{method.title}</p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                        selectedMethod === method.id ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {method.tag}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{method.description}</p>
                  </div>
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedMethod === method.id ? 'border-orange-500 bg-orange-500' : 'border-muted'
                  }`}>
                    {selectedMethod === method.id && <Check size={14} className="text-white" strokeWidth={4} />}
                  </div>
                </div>

                {selectedMethod === method.id && (
                  <div className="mt-2 pt-4 border-t border-orange-500/10 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs text-orange-500/80 font-bold leading-relaxed flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-orange-500" />
                      {method.details}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="p-5 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">Elite Protection</p>
            <p className="text-[11px] leading-relaxed text-blue-100/60 font-medium">
              Your transaction is encrypted and protected. Choose your preferred method to complete your order.
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {selectedMethod && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-2xl border-t border-border z-50 animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={() => {
              if (!email) {
                toast.error('Please enter your email for the receipt.');
                return;
              }
              onPayment(selectedMethod, email);
            }}
            className="w-full py-5 rounded-[1.8rem] text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-500/30 transition-all active:scale-[0.98] hover:scale-[1.01] flex items-center justify-center gap-3 relative overflow-hidden group"
            style={{ backgroundColor: '#FF5C00' }}
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
            <span className="relative z-10 text-lg">
              {selectedMethod === 'online' ? 'Proceed to Payment' : 'Complete & Call Waiter'}
            </span>
            <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={24} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
}
