import { Head, router } from '@inertiajs/react';
import { KitchenDisplay } from '@/Components/KitchenDisplay';
import { toast } from 'sonner';
import type { Order } from '@/types';

interface KDSIndexProps {
  orders: Order[];
}

export default function KDSIndex({ orders }: KDSIndexProps) {
  const handleUpdateOrder = (orderId: number, updates: Partial<Order>) => {
    // Play a subtle success sound (Professional standard for KDS feedback)
    const audio = new Audio('/sounds/is-ready.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});

    // Only send the status to avoid complex data structures in patch request
    const payload = updates.status ? { status: updates.status } : updates;
    
    router.patch(route('kitchen.orders.update', orderId), payload as any, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(`Order #${orderId} updated successfully`, {
          description: `Status changed to ${updates.status?.toUpperCase()}`,
          position: 'top-right',
        });
      }
    });
  };

  return (
    <>
      <Head title="Kitchen Display System" />
      <KitchenDisplay orders={orders} onUpdateOrder={handleUpdateOrder} />
    </>
  );
}
