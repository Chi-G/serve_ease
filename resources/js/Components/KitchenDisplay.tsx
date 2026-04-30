import { useEffect, useState } from 'react';
import { Clock, Play, Check, Package, CheckCircle2, LogOut } from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { Order } from '@/types';

interface KitchenDisplayProps {
  orders: Order[];
  onUpdateOrder: (orderId: number, updates: Partial<Order>) => void;
}

export function KitchenDisplay({ orders, onUpdateOrder }: KitchenDisplayProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getElapsedMinutes = (createdAt: string) => {
    const timestamp = new Date(createdAt).getTime();
    return Math.floor((currentTime - timestamp) / 60000);
  };

  const getOrderColor = (createdAt: string, status: string) => {
    if (status === 'ready') return '#4CAF50';
    const elapsed = getElapsedMinutes(createdAt);
    if (elapsed >= 15) return '#EF4444';
    if (elapsed >= 8) return '#FFA500';
    return '#FF5C00';
  };

  const getStatusBadge = (elapsed: number) => {
    if (elapsed >= 15) {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 animate-pulse">
          OVERDUE
        </span>
      );
    }
    return null;
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const inProgressOrders = orders.filter(o => o.status === 'in-kitchen');
  const readyOrders = orders.filter(o => o.status === 'ready');

  const OrderCard = ({ order }: { order: Order }) => {
    const elapsed = getElapsedMinutes(order.created_at);
    const color = getOrderColor(order.created_at, order.status);
    const isOverdue = elapsed >= 15 && order.status !== 'ready';

    return (
      <div
        className={`rounded-2xl border-2 p-4 space-y-3 transition-all ${isOverdue ? 'animate-pulse' : ''}`}
        style={{
          borderColor: color,
          boxShadow: isOverdue ? `0 0 20px ${color}40` : 'none'
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-2xl font-bold" style={{ color }}>{order.queue_number}</p>
              {getStatusBadge(elapsed)}
            </div>
            <p className="text-sm text-muted-foreground">Table {order.table?.table_num || order.table_id}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color }}>
            <Clock size={16} />
            <span>{elapsed} min</span>
          </div>
        </div>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-2 rounded-lg bg-secondary"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">
                    {item.quantity}x {item.product?.name || 'Unknown Product'}
                  </p>
                  {item.serving_style === 'eat-in' ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">
                      🍽️ PLATE
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'rgba(255, 92, 0, 0.2)', color: '#FF5C00' }}>
                      🥡 BAG
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.customer_name}
                </p>
                {item.notes && (
                  <p className="text-[10px] mt-1 text-red-400 font-medium italic">
                    Note: {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {order.status === 'pending' && (
          <button
            onClick={() => onUpdateOrder(order.id, { status: 'in-kitchen' })}
            className="w-full py-3 rounded-xl text-white transition-all flex items-center justify-center gap-2 font-bold"
            style={{ backgroundColor: color }}
          >
            <Play size={18} />
            <span>Start Prep</span>
          </button>
        )}

        {order.status === 'in-kitchen' && (
          <button
            onClick={() => onUpdateOrder(order.id, { status: 'ready' })}
            className="w-full py-3 rounded-xl text-white transition-all flex items-center justify-center gap-2 font-bold"
            style={{ backgroundColor: color }}
          >
            <Check size={18} />
            <span>Mark Ready</span>
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => onUpdateOrder(order.id, { status: 'completed' })}
            className="w-full py-3 rounded-xl text-white transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 font-bold shadow-lg shadow-green-500/20"
            style={{ backgroundColor: '#4CAF50' }}
          >
            <CheckCircle2 size={18} />
            <span>Mark Served</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl mb-1 sm:mb-2 font-black tracking-tight">Kitchen Display System</h1>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Kitchen Operations
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 bg-card/50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-border sm:border-none">
            <div className="text-left sm:text-right">
                <p className="text-[10px] sm:text-sm text-muted-foreground uppercase tracking-wider font-bold">Active Orders</p>
                <p className="text-xl sm:text-2xl font-black">{orders.length}</p>
            </div>
            <Link
                href={route('logout')}
                method="post"
                as="button"
                className="p-2.5 sm:p-3 bg-card hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-xl border border-border transition-all shadow-sm"
                title="Logout"
            >
                <LogOut size={18} />
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div>
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-muted-foreground">Pending</h2>
            <span className="px-2 sm:px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs sm:text-sm font-bold">
              {pendingOrders.length}
            </span>
          </div>
          <div className="space-y-4">
            {pendingOrders.length === 0 ? (
              <div className="text-center text-muted-foreground py-10 bg-card rounded-2xl border border-border border-dashed text-sm">
                No pending orders
              </div>
            ) : (
              pendingOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-muted-foreground">In Progress</h2>
            <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold" style={{ backgroundColor: 'rgba(255, 92, 0, 0.2)', color: '#FF5C00' }}>
              {inProgressOrders.length}
            </span>
          </div>
          <div className="space-y-4">
            {inProgressOrders.length === 0 ? (
              <div className="text-center text-muted-foreground py-10 bg-card rounded-2xl border border-border border-dashed text-sm">
                No orders in progress
              </div>
            ) : (
              inProgressOrders
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map(order => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-muted-foreground">Ready</h2>
            <span className="px-2 sm:px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs sm:text-sm font-bold">
              {readyOrders.length}
            </span>
          </div>
          <div className="space-y-4">
            {readyOrders.length === 0 ? (
              <div className="text-center text-muted-foreground py-10 bg-card rounded-2xl border border-border border-dashed text-sm">
                No orders ready
              </div>
            ) : (
              readyOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-card rounded-2xl border border-border">
          <h3 className="text-sm mb-3 font-bold uppercase text-muted-foreground tracking-widest">Time Indicators</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5C00' }} />
              <span>0-7 min (Normal)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFA500' }} />
              <span>8-14 min (Caution)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#EF4444' }} />
              <span>15+ min (Overdue)</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-card rounded-2xl border border-border">
          <h3 className="text-sm mb-3 font-bold uppercase text-muted-foreground tracking-widest">Service Type Badges</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold">
                🍽️ PLATE
              </span>
              <span>Eat-in service</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ backgroundColor: 'rgba(255, 92, 0, 0.2)', color: '#FF5C00' }}>
                🥡 BAG
              </span>
              <span>Take-away service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
