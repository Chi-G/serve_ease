import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Clock, ChefHat, UtensilsCrossed, Package, ArrowRight } from 'lucide-react';
import type { Order } from '@/types';

interface OrderTrackingProps {
  order: Order;
  onPlaceNewOrder: () => void;
  onAddMoreItems: () => void;
  onCallWaiter: () => void;
  onUpdateStatus: (status: Order['status']) => void;
  onCancelOrder: () => void;
}

import { useConfirm } from '@/Contexts/ConfirmContext';

export function OrderTracking({ order, onPlaceNewOrder, onAddMoreItems, onCallWaiter, onUpdateStatus, onCancelOrder }: OrderTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState<Order['status']>(order.status);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (order.status === 'ready' || order.status === 'served') return 0;
    
    // Calculate elapsed time since order creation
    const startTime = new Date(order.created_at).getTime();
    const now = new Date().getTime();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const totalWaitSeconds = 10 * 60; // 10 minutes
    
    const remaining = totalWaitSeconds - elapsedSeconds;
    return remaining > 0 ? remaining : 0;
  });
  const [showReadyFlash, setShowReadyFlash] = useState(false);
  const confirm = useConfirm();

  // Sync status if prop changes (e.g. from Echo real-time event)
  useEffect(() => {
    setCurrentStatus(order.status);
    if (order.status === 'ready') {
      setTimeRemaining(0);
    }
  }, [order.status]);

  useEffect(() => {
    if (currentStatus === 'in-kitchen' && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Transition to ready once timer expires
            setCurrentStatus('ready');
            onUpdateStatus('ready');
            setShowReadyFlash(true);
            setTimeout(() => setShowReadyFlash(false), 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStatus, timeRemaining, onUpdateStatus]);

  const handleCancelOrderClick = async () => {
    const ok = await confirm({
      title: 'Cancel Order?',
      message: 'Are you sure you want to CANCEL this order? This action cannot be undone and our chefs might have already started your meal.',
      confirmLabel: 'Yes, Cancel',
      cancelLabel: 'Keep Order',
      type: 'danger'
    });

    if (ok) {
      onCancelOrder();
    }
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'pending':
        return '#FFA500';
      case 'in-kitchen':
        return '#FF5C00';
      case 'ready':
        return '#4CAF50';
      default:
        return '#FF5C00';
    }
  };

  const getStatusText = () => {
    switch (currentStatus) {
      case 'pending':
        return 'Verifying Order';
      case 'in-kitchen':
        return 'Chef is Cooking';
      case 'ready':
        return 'Ready to Enjoy!';
      default:
        return 'Processing';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((10 * 60 - timeRemaining) / (10 * 60)) * 100;

  return (
    <div className="min-h-screen bg-background">
      {showReadyFlash && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          <div className="absolute inset-0 bg-[#4CAF50]/20 animate-pulse" />
        </div>
      )}

      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-black tracking-tight uppercase">Order Status</h1>
          <button
            onClick={onCallWaiter}
            className="p-3 rounded-full shadow-lg shadow-[#FF5C00]/20 active:scale-90 transition-all"
            style={{ backgroundColor: '#FF5C00' }}
          >
            <Bell size={20} className="text-white" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {currentStatus === 'ready' ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 rounded-[3rem] bg-card border border-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: '#4CAF50' }} />
            
            <div className="w-40 h-40 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-[#4CAF50]/20 rounded-full animate-ping" />
                <div className="w-32 h-32 rounded-full flex items-center justify-center relative z-10" style={{ backgroundColor: '#4CAF50' }}>
                    <CheckCircle2 size={64} className="text-white" />
                </div>
            </div>

            <h2 className="text-4xl font-black mb-2 tracking-tighter" style={{ color: '#4CAF50' }}>READY!</h2>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Queue Number</p>
            <p className="text-7xl font-black mb-8 tracking-tight" style={{ color: '#FF5C00' }}>{order.queue_number}</p>
            
            <div className="w-full space-y-3">
              <button
                onClick={onCallWaiter}
                className="w-full py-4 rounded-2xl text-white font-bold tracking-wide shadow-lg shadow-[#FF5C00]/20"
                style={{ backgroundColor: '#FF5C00' }}
              >
                Notify Waiter
              </button>
              <button
                onClick={onPlaceNewOrder}
                className="w-full py-4 rounded-2xl bg-secondary font-bold text-sm tracking-wide"
              >
                End Session / New Order
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-[3rem] border border-border p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: getStatusColor() }} />
              
              <div className="relative w-56 h-56 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="100"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r="100"
                    fill="none"
                    stroke={getStatusColor()}
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 100}`}
                    strokeDashoffset={`${2 * Math.PI * 100 * (1 - (currentStatus === 'pending' ? 0.33 : currentStatus === 'in-kitchen' ? 0.33 + (progress / 100) * 0.67 : 1))}`}
                    className="transition-all duration-1000 ease-in-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Queue</p>
                    <p className="text-5xl font-black tracking-tighter" style={{ color: '#FF5C00' }}>
                        {order.queue_number}
                    </p>
                    <div className="mt-2 px-3 py-1 rounded-full bg-muted text-[10px] font-black uppercase tracking-widest">
                        {getStatusText()}
                    </div>
                </div>
              </div>

              {currentStatus === 'in-kitchen' && (
                <div className="mb-8 animate-in fade-in duration-700">
                  <div className="flex items-center justify-center gap-2 mb-2 text-muted-foreground">
                    <Clock size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Estimated Wait</span>
                  </div>
                  <p className="text-4xl font-black tracking-tight" style={{ color: getStatusColor() }}>
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2 relative">
                 <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-muted z-0" />
                 
                 {[
                   { id: 'pending', icon: UtensilsCrossed, label: 'Order' },
                   { id: 'paid', icon: ShieldCheck, label: 'Paid' },
                   { id: 'in-kitchen', icon: ChefHat, label: 'Cooking' },
                   { id: 'ready', icon: Package, label: 'Ready' }
                 ].map((step) => {
                   const isActive = (currentStatus as string) === step.id || (
                     (currentStatus === 'in-kitchen' && (step.id === 'pending' || step.id === 'paid')) ||
                     ((currentStatus as string) === 'ready' && step.id !== 'completed')
                   );
                   const Icon = step.icon;
                   
                   return (
                     <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                        <div 
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110 shadow-lg shadow-primary/20' : 'opacity-40'}`}
                          style={{ backgroundColor: isActive ? getStatusColor() : 'var(--muted)' }}
                        >
                          <Icon size={16} className={isActive ? 'text-white' : 'text-muted-foreground'} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-foreground' : 'text-muted-foreground opacity-40'}`}>
                          {step.label}
                        </span>
                     </div>
                   )
                 })}
              </div>
            </div>

            <div className="bg-card rounded-3xl border border-border overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Order Details</h3>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-secondary">
                    {order.items.length} Items
                </span>
              </div>
              <div className="p-6 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <span className="text-lg">{item.serving_style === 'eat-in' ? '🍽️' : '🥡'}</span>
                        <div>
                            <p className="text-sm font-bold leading-tight">{item.product?.name || 'Item'}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">Guest: {item.customer_name}</p>
                        </div>
                    </div>
                    <span className="text-xs font-black">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-muted/30 border-t border-border flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Paid</span>
                <span className="text-xl font-black" style={{ color: '#FF5C00' }}>₦{order.total_price.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onAddMoreItems}
              className="w-full py-5 rounded-3xl bg-secondary hover:bg-muted transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 group"
            >
              <span>Add More Items</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleCancelOrderClick}
              className="w-full py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-destructive transition-colors"
            >
              Cancel Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ShieldCheck({ size, className }: { size: number, className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
