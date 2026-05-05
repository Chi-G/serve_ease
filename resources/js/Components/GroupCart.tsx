import { Trash2, ArrowLeft, ShoppingBag, Users, CheckCircle2 } from 'lucide-react';
import type { CartItem } from '@/types';

interface GroupCartProps {
  cart: CartItem[];
  customerNames: string[];
  currentCustomerName: string;
  currentCustomerIndex: number;
  removeFromCart: (itemId: string | number) => void;
  onContinue: () => void;
  onBackToMenu: () => void;
  resetGroupOrder: () => void;
  isLastCustomer: boolean;
}

export function GroupCart({
  cart,
  customerNames,
  currentCustomerName,
  currentCustomerIndex,
  removeFromCart,
  onContinue,
  onBackToMenu,
  resetGroupOrder,
  isLastCustomer
}: GroupCartProps) {
  const grandTotal = Math.round(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;

  // Group ALL items by customer name
  const groupedByCustomer = customerNames.reduce((acc, name) => {
    acc[name] = cart.filter(item => item.customerName === name);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset everything? All names and selections will be cleared.')) {
        resetGroupOrder();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-32">
      <div className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBackToMenu} 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-white uppercase">Table Cart</h1>
                <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Group Order Overview</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                <button 
                    onClick={handleReset}
                    className="text-[10px] font-black text-destructive uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                    Reset Order
                </button>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-[#FF5C00] uppercase tracking-widest">Total Bill</span>
                    <span className="text-xl font-black text-white">₦{grandTotal.toLocaleString()}</span>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {customerNames.map((name, idx) => {
                const isCurrent = name === currentCustomerName;
                const hasItems = groupedByCustomer[name].length > 0;
                return (
                    <div 
                        key={name}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all flex-shrink-0 ${
                            isCurrent 
                            ? 'bg-[#FF5C00] border-[#FF5C00] text-white' 
                            : 'bg-white/5 border-white/10 text-white/60'
                        }`}
                    >
                        <span className="text-xs font-bold whitespace-nowrap">{name}</span>
                        {hasItems && <CheckCircle2 size={12} className={isCurrent ? 'text-white' : 'text-[#FF5C00]'} />}
                    </div>
                );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-10">
        {customerNames.map((name) => {
          const items = groupedByCustomer[name];
          const isMe = name === currentCustomerName;
          const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

          if (items.length === 0) return null;

          return (
            <div key={name} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-6 rounded-full ${isMe ? 'bg-[#FF5C00]' : 'bg-white/20'}`} />
                    <h2 className={`text-sm font-black uppercase tracking-[0.2em] ${isMe ? 'text-white' : 'text-white/60'}`}>
                        {name}'s Selection
                    </h2>
                </div>
                <span className="text-xs font-bold text-white/40">₦{subtotal.toLocaleString()}</span>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`relative flex gap-4 p-4 rounded-3xl border transition-all ${
                        isMe 
                        ? 'bg-white/5 border-white/10 shadow-xl' 
                        : 'bg-white/[0.02] border-white/5 opacity-80'
                    }`}
                  >
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      {item.quantity > 1 && (
                        <div className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-[#FF5C00] flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                            {item.quantity}x
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-black text-white tracking-tight">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] px-3 py-1 rounded-full bg-white/5 text-white/60 font-black uppercase tracking-widest border border-white/5">
                                {item.serviceType === 'eat-in' ? '🍽️ Eat-in' : '🥡 Take-away'}
                            </span>
                            {item.notes && (
                                <span className="text-[10px] text-[#FF5C00] font-black uppercase tracking-widest truncate max-w-[100px]">
                                    {item.notes}
                                </span>
                            )}
                        </div>
                      </div>
                      
                      <p className="text-lg font-black text-[#FF5C00] tracking-tight">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 h-fit rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all self-center"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {cart.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
              <ShoppingBag className="text-white/20" size={48} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Cart is empty</h2>
            <p className="text-white/40 text-sm max-w-[240px]">Seems like no one has picked anything yet. Head back to the menu!</p>
            <button 
                onClick={onBackToMenu}
                className="mt-8 w-full py-4 rounded-2xl bg-[#FF5C00] text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-[#FF5C00]/20 transition-all active:scale-95"
            >
                Return to Menu
            </button>
            <button 
                onClick={handleReset}
                className="mt-3 w-full py-4 rounded-2xl bg-white/5 text-white/60 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95 border border-white/5"
            >
                Start Afresh (Reset All)
            </button>
          </div>
        )}

        {cart.length > 0 && (
          <div className="pt-10 space-y-4">
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#FF5C00] to-[#FF8C00] shadow-2xl shadow-[#FF5C00]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 flex justify-between items-end mb-6">
                    <div>
                        <p className="text-xs font-black text-white/60 uppercase tracking-[0.3em] mb-2">Total Order Bill</p>
                        <h3 className="text-4xl font-black text-white tracking-tighter">₦{grandTotal.toLocaleString()}</h3>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                            <Users size={16} className="text-white/60" />
                            <span className="text-sm font-black text-white">{customerNames.length} Guests</span>
                        </div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{cart.length} Total Items</p>
                    </div>
                </div>

                <div className="relative z-10 p-4 rounded-2xl bg-black/10 border border-white/10 backdrop-blur-sm">
                    <p className="text-[10px] font-black text-white/80 leading-relaxed uppercase tracking-widest text-center">
                        Reviewing entire table's selection before checkout
                    </p>
                </div>
            </div>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0A0A0A]/80 backdrop-blur-2xl border-t border-white/5 z-50">
          <button
            onClick={onContinue}
            className="w-full py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#FF5C00]/40 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
            style={{ backgroundColor: '#FF5C00' }}
          >
            <span className="text-sm">{isLastCustomer ? 'Finalize & Place Order' : `Next Person's Order`}</span>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <Users size={20} className="text-white" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
