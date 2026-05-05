import { Head, router } from '@inertiajs/react';
import CustomerLayout, { useGroupOrder, GroupOrderProvider } from '@/Layouts/CustomerLayout';
import { GroupCart } from '@/Components/GroupCart';

function CartContent() {
  const { 
    cart, 
    customerNames, 
    currentCustomerIndex, 
    removeFromCart, 
    setCurrentCustomerIndex,
    currentCustomerName,
    resetGroupOrder
  } = useGroupOrder();

  const handleContinue = () => {
    if (currentCustomerIndex < customerNames.length - 1) {
      setCurrentCustomerIndex(currentCustomerIndex + 1);
      router.visit(route('menu.index'));
    } else {
      router.visit(route('checkout.index'));
    }
  };

  const handleBackToMenu = () => {
    router.visit(route('menu.index'));
  };

  return (
    <CustomerLayout>
      <Head title="Your Cart" />
      <GroupCart
        cart={cart}
        customerNames={customerNames}
        currentCustomerName={currentCustomerName}
        currentCustomerIndex={currentCustomerIndex}
        removeFromCart={removeFromCart}
        onContinue={handleContinue}
        onBackToMenu={handleBackToMenu}
        resetGroupOrder={resetGroupOrder}
        isLastCustomer={currentCustomerIndex === customerNames.length - 1}
      />
    </CustomerLayout>
  );
}

export default function CartPage() {
  return (
    <GroupOrderProvider>
      <CartContent />
    </GroupOrderProvider>
  );
}
