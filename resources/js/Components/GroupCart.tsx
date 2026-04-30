import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import type { CartItem } from '@/types';

interface GroupCartProps {
  cart: CartItem[];
  customerNames: string[];
  currentCustomerName: string;
  currentCustomerIndex: number;
  removeFromCart: (itemId: string | number) => void;
  onContinue: () => void;
  onBackToMenu: () => void;
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
  isLastCustomer
}: GroupCartProps) {
  const myItems = cart.filter(item => item.customerName === currentCustomerName);
  const othersItems = cart.filter(item => item.customerName !== currentCustomerName);

  const myTotal = myItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const groupedOthers = othersItems.reduce((acc, item) => {
    if (!acc[item.customerName]) {
      acc[item.customerName] = [];
    }
    acc[item.customerName].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <button onClick={onBackToMenu} className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-black tracking-tight uppercase">Group Cart</h1>
          </div>

          {customerNames.length > 1 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                   Reviewing <span className="text-foreground">{currentCustomerName}</span>'s order
                </p>
                <p className="text-xs font-bold text-muted-foreground">
                  {currentCustomerIndex + 1}/{customerNames.length}
                </p>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: '#FF5C00',
                    width: `${((currentCustomerIndex + 1) / customerNames.length) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Selection</h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5C00]/10 text-[#FF5C00]">
                <span className="text-xs font-bold">{currentCustomerName}</span>
            </div>
          </div>

          {myItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="text-muted-foreground" size={32} />
                </div>
                <div>
                    <p className="font-bold">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Add some delicious meals to get started!</p>
                </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {myItems.map(item => (
                <div key={item.id} className="flex gap-4 p-4 hover:bg-muted/20 transition-colors">
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold uppercase">
                            {item.serviceType === 'eat-in' ? '🍽️ Eat-in' : '🥡 Bag'}
                        </span>
                    </div>
                    <p className="text-sm font-bold mt-2" style={{ color: '#FF5C00' }}>
                      ₦{(item.price * item.quantity).toLocaleString()}
                      {item.quantity > 1 && <span className="text-xs text-muted-foreground font-normal ml-1"> ({item.quantity}x)</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 h-fit rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {myItems.length > 0 && (
            <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center">
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Subtotal</span>
              <span className="text-lg font-black" style={{ color: '#FF5C00' }}>₦{myTotal.toLocaleString()}</span>
            </div>
          )}
        </div>

        {Object.keys(groupedOthers).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Other Guests</h2>
            
            <div className="space-y-4">
              {Object.entries(groupedOthers).map(([name, items]) => {
                const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                return (
                  <div key={name} className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="bg-muted/30 px-4 py-2 border-b border-border flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{name}</span>
                        <span className="text-xs font-bold" style={{ color: '#FF5C00' }}>₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x <span className="text-foreground font-medium">{item.name}</span>
                          </span>
                          <span className="font-medium text-xs">₦{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">Table Grand Total</span>
              <span className="text-3xl font-black text-white">
                ₦{grandTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40 font-medium">
              <span>{customerNames.length} {customerNames.length === 1 ? 'Guest' : 'Guests'}</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span>{cart.length} Total Items</span>
            </div>
          </div>
        )}
      </div>

      {myItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border z-50">
          <button
            onClick={onContinue}
            className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-[#FF5C00]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#FF5C00' }}
          >
            <span>{isLastCustomer ? 'Proceed to Checkout' : `Next Person`}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          </button>
        </div>
      )}
    </div>
  );
}
