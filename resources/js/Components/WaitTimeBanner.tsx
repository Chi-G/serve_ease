import { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import type { Order } from '@/types';

interface WaitTimeBannerProps {
  order: Order;
  onDismiss: () => void;
  onNavigate: () => void;
}

export function WaitTimeBanner({ order, onDismiss, onNavigate }: WaitTimeBannerProps) {
  const calculateRemaining = () => {
    if (!order.created_at || !order.estimatedTime) return 0;
    const startTime = new Date(order.created_at).getTime();
    const now = new Date().getTime();
    const elapsedMinutes = Math.floor((now - startTime) / 60000);
    return Math.max(0, order.estimatedTime - elapsedMinutes);
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 10000); // Check every 10 seconds for better accuracy

    return () => clearInterval(interval);
  }, [order.created_at, order.estimatedTime]);

  const progress = order.estimatedTime ? ((order.estimatedTime - timeRemaining) / order.estimatedTime) * 100 : 0;

  return (
    <div
      className="sticky top-0 z-[100] cursor-pointer"
      onClick={onNavigate}
    >
      <div className="bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{
              background: `linear-gradient(to right, #FF5C00 ${progress}%, transparent ${progress}%)`,
              opacity: 0.1
            }}
          />

          <div className="relative px-4 py-3 flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3">
              <Clock size={20} style={{ color: '#FF5C00' }} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Order {order.tokenNumber || order.queue_number}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20" style={{ color: '#FF5C00' }}>
                    {timeRemaining} min remaining
                  </span>
                </div>
                <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      backgroundColor: '#FF5C00',
                      width: `${progress}%`
                    }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-1 rounded-full hover:bg-secondary transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
