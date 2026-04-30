import { Head, router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import CustomerLayout, { useGroupOrder, GroupOrderProvider } from '@/Layouts/CustomerLayout';
import { Checkout } from '@/Components/Checkout';
import { useConfirm } from '@/Contexts/ConfirmContext';
import type { Order } from '@/types';

function CheckoutContent() {
  const { cart, customerNames, setCurrentOrder, clearCart, tableNumber } = useGroupOrder();
  const confirm = useConfirm();

  const getOrderData = (method: 'card' | 'transfer', queueNum: string, email?: string) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      table_id: tableNumber,
      email: email,
      items: cart.map(item => {
        let dbProductId: number | null = null;
        if (typeof item.productId === 'number' && !isNaN(item.productId)) {
          dbProductId = item.productId;
        } else if (typeof item.id === 'number' && !isNaN(item.id)) {
          dbProductId = item.id;
        } else {
          const parsed = parseInt(String(item.id).split('-')[0]);
          if (!isNaN(parsed)) {
            dbProductId = parsed;
          }
        }
        
        if (!dbProductId) return null;

        return {
          product_id: dbProductId,
          customer_name: item.customerName,
          quantity: item.quantity,
          price: item.price,
          serving_style: item.serviceType,
          notes: item.notes
        };
      }).filter(Boolean),
      total_price: total,
      method: method,
      queue_number: queueNum
    };
  };

  const finalizeOrder = (method: 'card' | 'transfer') => {
    const queueNum = `G-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const orderData = getOrderData(method, queueNum);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (orderData.items.length === 0) {
      toast.error('Your cart items appear to be invalid. Please clear your cart and add them again.');
      return;
    }

    console.log('Sending Order Data:', orderData);

    router.post(route('orders.store'), orderData, {
      onSuccess: () => {
        toast.success('Order placed successfully!');
        const order: Order = {
          id: Date.now(),
          table_id: tableNumber,
          items: cart.map((item, index) => {
            let dbProductId: number | null = null;
            if (typeof item.productId === 'number' && !isNaN(item.productId)) {
              dbProductId = item.productId;
            } else if (typeof item.id === 'number' && !isNaN(item.id)) {
              dbProductId = item.id;
            } else {
              const parsed = parseInt(String(item.id).split('-')[0]);
              if (!isNaN(parsed)) {
                dbProductId = parsed;
              }
            }

            if (!dbProductId) return null;

            return {
              id: index + 1,
              order_id: 0,
              product_id: dbProductId,
              customer_name: item.customerName,
              quantity: item.quantity,
              price: item.price,
              serving_style: item.serviceType,
              notes: item.notes,
              product: {
                id: dbProductId,
                name: item.name,
                image_url: item.image
              }
            };
          }).filter((item): item is NonNullable<typeof item> => item !== null),
          total_price: total,
          status: method === 'card' ? 'in-kitchen' : 'pending',
          queue_number: queueNum,
          tokenNumber: queueNum,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          estimatedTime: 15
        };

        setCurrentOrder(order);
        clearCart();
        const savedOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
        localStorage.setItem('allOrders', JSON.stringify([...savedOrders, order]));
        router.visit(route('tracking.index'));
      },
      onError: (errors) => {
        console.error('Order submission failed:', errors);
        toast.error('Something went wrong while placing your order.');
      }
    });
  };

  const handlePayment = async (method: 'card' | 'transfer', email?: string) => {
    if (method === 'transfer') {
      const ok = await confirm({
        title: 'Confirm Transfer?',
        message: 'Have you completed the bank transfer? A waiter will need to verify this manually before your order is processed.',
        confirmLabel: 'Yes, I have Transferred',
        cancelLabel: 'Not yet',
        type: 'warning'
      });
      if (!ok) return;
    }

    if (method === 'card') {
      const loadingToast = toast.loading('Initializing secure payment...');
      const queueNum = `G-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      const orderData = getOrderData('card', queueNum, email);
      
      (window as any).axios.post(route('payment.initialize'), orderData)
        .then((response: any) => {
          toast.dismiss(loadingToast);
          if (response.data.authorization_url) {
            window.location.href = response.data.authorization_url;
          } else {
            toast.error('Could not get payment URL. Please try again.');
          }
        })
        .catch((err: any) => {
          toast.dismiss(loadingToast);
          console.error('Payment initialization error:', err);
          toast.error('Failed to initialize payment. Please try again or call a waiter.');
        });
    } else {
      finalizeOrder('transfer');
    }
  };

  return (
    <CustomerLayout>
      <Head title="Checkout" />
      <Checkout
        cart={cart}
        customerNames={customerNames}
        onPayment={handlePayment}
        onBack={() => router.visit(route('cart.index'))}
      />
    </CustomerLayout>
  );
}

export default function CheckoutPage() {
  return (
    <GroupOrderProvider>
      <CheckoutContent />
    </GroupOrderProvider>
  );
}
