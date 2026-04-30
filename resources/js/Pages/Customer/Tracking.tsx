import { Head, router } from '@inertiajs/react';
import CustomerLayout, { useGroupOrder, GroupOrderProvider } from '@/Layouts/CustomerLayout';
import { OrderTracking } from '@/Components/OrderTracking';

function TrackingContent() {
  const { currentOrder, setCurrentOrder } = useGroupOrder();

  const handlePlaceNewOrder = () => {
    localStorage.removeItem('cart');
    localStorage.removeItem('customerNames');
    localStorage.removeItem('currentOrder');
    router.visit(route('welcome'));
  };

  const handleAddMoreItems = () => {
    router.visit(route('menu.index'));
  };

  if (!currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No active order</h2>
        <button
          onClick={() => router.visit(route('menu.index'))}
          className="px-6 py-3 bg-primary text-white rounded-xl"
          style={{ backgroundColor: '#FF5C00' }}
        >
          Go to Menu
        </button>
      </div>
    );
  }

  return (
    <>
      <Head title="Track Order" />
      <OrderTracking
        order={currentOrder}
        onPlaceNewOrder={handlePlaceNewOrder}
        onAddMoreItems={handleAddMoreItems}
        onCallWaiter={() => alert('Waiter called!')}
        onUpdateStatus={(status) => setCurrentOrder({ ...currentOrder, status })}
        onCancelOrder={() => {
          router.post(route('orders.cancel', currentOrder.id), {}, {
            onFinish: () => {
                // Definitively clear local memory regardless of server response
                setCurrentOrder(null);
                localStorage.removeItem('currentOrder');
                localStorage.removeItem('cart');
                localStorage.removeItem('customerNames');
                router.visit(route('menu.index'), { replace: true });
            }
          });
        }}
      />
    </>
  );
}

export default function TrackingPage() {
  return (
    <CustomerLayout>
      <TrackingContent />
    </CustomerLayout>
  );
}
