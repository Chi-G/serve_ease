import React, { createContext, useContext, useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { Bell, X, CheckCircle2, Timer, Clock, LayoutGrid } from 'lucide-react';
import type { CartItem, Order } from '@/types';
import { WaitTimeBanner } from '@/Components/WaitTimeBanner';

interface GroupOrderContextType {
  cart: CartItem[];
  customerNames: string[];
  currentCustomerName: string;
  currentCustomerIndex: number;
  currentOrder: Order | null;
  setCustomerNames: (names: string[]) => void;
  addToCart: (item: Omit<CartItem, 'customerName'>) => void;
  removeFromCart: (itemId: string | number) => void;
  setCurrentCustomerIndex: (index: number) => void;
  setCurrentOrder: (order: Order | null) => void;
  clearCart: () => void;
  logout: () => void;
  resetGroupOrder: () => void;
  tableNumber: number;
  tableUuid: string;
}

const GroupOrderContext = createContext<GroupOrderContextType | undefined>(undefined);

export const useGroupOrder = () => {
  const context = useContext(GroupOrderContext);
  if (!context) throw new Error('useGroupOrder must be used within a GroupOrderProvider');
  return context;
};

export function GroupOrderProvider({ children }: { children: React.ReactNode }) {
  const [tableNumber, setTableNumber] = useState<number>(() => {
    const saved = localStorage.getItem('tableNumber');
    return saved ? parseInt(saved) : 1;
  });
  const [tableUuid, setTableUuid] = useState<string>(() => {
    const saved = localStorage.getItem('tableUuid');
    return saved || '';
  });
  const [customerNames, setCustomerNames] = useState<string[]>(() => {
    const saved = localStorage.getItem('customerNames');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('currentOrder');
    return saved ? JSON.parse(saved) : null;
  });
  const { currentOrder: sharedOrder, table_uuid: sharedTableUuid } = usePage().props as any;
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState<number>(() => {
    const saved = localStorage.getItem('currentCustomerIndex');
    return saved ? parseInt(saved) : 0;
  });

  // Sync with shared props from Inertia
  useEffect(() => {
    if (sharedOrder) {
      setCurrentOrder(sharedOrder);
      localStorage.setItem('currentOrder', JSON.stringify(sharedOrder));
      setCart([]);
      localStorage.removeItem('cart');
    } else if (sharedOrder === null && currentOrder !== null) {
      // If the server explicitly says there is NO order, clear local state
      setCurrentOrder(null);
      localStorage.removeItem('currentOrder');
    }
  }, [sharedOrder]);

  // Auto-clear currentOrder if it's cancelled or served
  useEffect(() => {
    if (currentOrder && ['cancelled', 'served'].includes(currentOrder.status)) {
      setCurrentOrder(null);
      localStorage.removeItem('currentOrder');
    }
  }, [currentOrder]);

  // Persistence effects
  useEffect(() => { localStorage.setItem('tableNumber', tableNumber.toString()); }, [tableNumber]);
  useEffect(() => { localStorage.setItem('tableUuid', tableUuid); }, [tableUuid]);
  useEffect(() => { localStorage.setItem('customerNames', JSON.stringify(customerNames)); }, [customerNames]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('currentOrder', JSON.stringify(currentOrder)); }, [currentOrder]);
  useEffect(() => { localStorage.setItem('currentCustomerIndex', currentCustomerIndex.toString()); }, [currentCustomerIndex]);

  const addToCart = (item: Omit<CartItem, 'customerName'>) => {
    setCart(prev => [...prev, { ...item, customerName: customerNames[currentCustomerIndex] || 'Guest' }]);
  };

  const removeFromCart = (itemId: string | number) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const logout = () => {
    localStorage.clear();
    setCurrentOrder(null);
    setCart([]);
    setCustomerNames([]);
    window.location.href = '/';
  };

  const resetGroupOrder = () => {
    const uuid = tableUuid || sharedTableUuid || localStorage.getItem('tableUuid');
    setCart([]);
    setCustomerNames([]);
    setCurrentCustomerIndex(0);
    localStorage.removeItem('cart');
    localStorage.removeItem('customerNames');
    localStorage.removeItem('currentCustomerIndex');
    
    if (uuid) {
      router.visit(route('table.welcome', { table: uuid }));
    } else {
      window.location.href = '/';
    }
  };

  const currentCustomerName = customerNames[currentCustomerIndex] || '';

  return (
    <GroupOrderContext.Provider value={{
      cart,
      customerNames,
      currentCustomerName,
      currentCustomerIndex,
      currentOrder,
      setCustomerNames,
      addToCart,
      removeFromCart,
      setCurrentCustomerIndex,
      setCurrentOrder,
      clearCart,
      logout,
      resetGroupOrder,
      tableNumber,
      tableUuid
    }}>
      {children}
    </GroupOrderContext.Provider>
  );
}

const WAITER_OPTIONS = [
  { id: 'water', label: '💧 Need Water' },
  { id: 'cutlery', label: '🍴 Extra Cutlery' },
  { id: 'bill', label: '🧾 Request Bill' },
  { id: 'help', label: '🙋 General Help' },
  { id: 'condiments', label: '🧂 Condiments' },
  { id: 'issue', label: '⚠️ Report Issue' },
];

import { useConfirm } from '@/Contexts/ConfirmContext';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <GroupOrderProvider>
            <CustomerLayoutContent>
                {children}
            </CustomerLayoutContent>
        </GroupOrderProvider>
    );
}

function CustomerLayoutContent({ children }: { children: React.ReactNode }) {
  const { currentOrder, tableNumber, logout, currentCustomerName, customerNames, currentCustomerIndex, setCurrentOrder } = useGroupOrder();
  const confirm = useConfirm();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const { flash } = usePage().props as any;

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  // Listen for real-time status updates
  useEffect(() => {
    if (currentOrder && (window as any).Echo) {
      const channel = (window as any).Echo.channel('orders')
        .listen('.OrderStatusUpdated', (e: any) => {
          if (e.order.id === currentOrder.id) {
            console.log('Order status updated via Echo:', e.order.status);
            setCurrentOrder(e.order);
            
            if (e.order.status === 'ready') {
              const audio = new Audio('/sounds/is-ready.mp3');
              audio.volume = 0.5;
              audio.play().catch(() => {});

              toast.success('Your order is READY!', {
                duration: 10000,
                icon: '🎉'
              });
            }
          }
        });
        
      return () => channel.unsubscribe();
    }
  }, [currentOrder, setCurrentOrder]);

  const handleLeaveTable = async () => {
    const ok = await confirm({
      title: 'Leave Table?',
      message: 'Are you sure you want to leave this table? Your session and current order progress will be cleared.',
      confirmLabel: 'Yes, Leave',
      cancelLabel: 'Stay',
      type: 'danger'
    });
    
    if (ok) {
      logout();
      toast.success('Session cleared. Come back soon!');
    }
  };

  const handleCallWaiterSubmit = () => {
    if (!selectedOption) return;
    
    const selectedLabel = WAITER_OPTIONS.find(opt => opt.id === selectedOption)?.label || selectedOption;
    
    router.post(route('service-requests.store'), {
      table_id: tableNumber,
      customer_name: currentCustomerName,
      request_type: selectedOption,
      message: selectedLabel
    }, {
      onSuccess: () => {
        setIsRequestSent(true);
        setTimeout(() => {
          setShowWaiterModal(false);
          setIsRequestSent(false);
          setSelectedOption(null);
        }, 3000);
      },
      onError: () => {
        toast.error('Could not call waiter. Please try again.');
      }
    });
  };

  const showWaitTimeBanner = currentOrder && currentOrder.status === 'in-kitchen' && !bannerDismissed;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      
      {/* Floating Active Order Badge - Only show for active preparation states */}
      {currentOrder && 
       ['pending', 'paid', 'in-kitchen', 'ready'].includes(currentOrder.status) && 
       !window.location.pathname.includes('/tracking') && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md animate-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => router.visit(route('tracking.index'))}
            className={`w-full p-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border transition-all active:scale-95 group overflow-hidden relative ${
              currentOrder.status === 'ready' 
                ? 'bg-[#4CAF50] border-[#4CAF50]/20 text-white' 
                : 'bg-card/90 backdrop-blur-xl border-border text-foreground'
            }`}
          >
            {currentOrder.status === 'ready' && (
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
            )}
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 ${
              currentOrder.status === 'ready' ? 'bg-white/20' : 'bg-[#FF5C00]/10'
            }`}>
              {currentOrder.status === 'ready' ? (
                <CheckCircle2 size={24} className="text-white" />
              ) : (
                <Timer size={24} className="text-[#FF5C00] animate-spin-slow" />
              )}
            </div>
            
            <div className="flex-1 text-left relative z-10">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                  currentOrder.status === 'ready' ? 'text-white/80' : 'text-[#FF5C00]'
                }`}>
                  {currentOrder.status === 'ready' ? 'PICKUP NOW' : 'IN PREPARATION'}
                </span>
                {currentOrder.status !== 'ready' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
                )}
              </div>
              <p className="font-black text-lg tracking-tight leading-tight mt-0.5">
                {currentOrder.status === 'ready' 
                  ? 'Your Order is READY!' 
                  : `Queue: ${currentOrder.queue_number}`}
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-black/10 border border-white/5 flex items-center gap-2 relative z-10">
               <span className="text-[10px] font-black uppercase tracking-widest">Track</span>
               <LayoutGrid size={14} />
            </div>
          </button>
        </div>
      )}

      <div className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Table {tableNumber}</span>
              <span className="text-muted-foreground/30">•</span>
              <button 
                onClick={handleLeaveTable}
                className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 hover:text-destructive transition-colors"
              >
                Leave Table
              </button>
            </div>
            {customerNames.length > 0 && (
              <p className="text-sm">Ordering for: <span style={{ color: '#FF5C00' }}>{currentCustomerName}</span></p>
            )}
            {customerNames.length > 1 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden w-24">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      backgroundColor: '#FF5C00',
                      width: `${((currentCustomerIndex + 1) / customerNames.length) * 100}%`
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {currentCustomerIndex + 1}/{customerNames.length}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowWaiterModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all active:scale-95 shadow-lg shadow-[#FF5C00]/20"
            style={{ backgroundColor: '#FF5C00' }}
          >
            <Bell size={18} className="text-white" />
            <span className="text-white text-xs font-black uppercase tracking-wider">Call Waiter</span>
          </button>
        </div>
      </div>

      <main>
        {children}
      </main>

      {/* Call Waiter Modal */}
      {showWaiterModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isRequestSent && setShowWaiterModal(false)}
          />
          <div className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
            {isRequestSent ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Request Sent!</h2>
                <p className="text-muted-foreground">A waiter will be with you shortly at Table {tableNumber}.</p>
              </div>
            ) : (
              <>
                <div className="p-8 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">Call Waiter</h2>
                    <p className="text-muted-foreground mt-1">What do you need, Guest?</p>
                  </div>
                  <button 
                    onClick={() => setShowWaiterModal(false)}
                    className="p-2 rounded-full hover:bg-white/5 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="px-8 pb-8 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {WAITER_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOption(option.id)}
                        className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col gap-1 ${
                          selectedOption === option.id 
                            ? 'border-[#FF5C00] bg-[#FF5C00]/5 shadow-inner' 
                            : 'border-border bg-input-background hover:border-[#FF5C00]/50'
                        }`}
                      >
                        <span className="font-bold text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleCallWaiterSubmit}
                    disabled={!selectedOption}
                    className="w-full mt-8 py-5 rounded-2xl text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-[#FF5C00]/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                    style={{ backgroundColor: '#FF5C00' }}
                  >
                    <span>🛎️ Call Waiter Now</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
