import { Head, Link } from '@inertiajs/react';
import CustomerLayout, { useGroupOrder, GroupOrderProvider } from '@/Layouts/CustomerLayout';
import { Menu, type MenuItem } from '@/Components/Menu';

interface CustomerMenuProps {
  products: MenuItem[];
  categories: string[];
}

function MenuContent({ products, categories }: CustomerMenuProps) {
  const { addToCart, cart, currentCustomerIndex, customerNames } = useGroupOrder();

  const currentCustomerName = customerNames[currentCustomerIndex] || '';
  const currentCustomerItems = cart.filter(item => item.customerName === currentCustomerName);

  return (
    <>
      <Head title="Menu" />
      
      <div className="pb-24">
        <Menu 
          products={products} 
          categories={categories} 
          addToCart={addToCart} 
        />

        {currentCustomerItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-sm border-t border-border z-50">
            <Link
              href={route('cart.index')}
              className="w-full py-4 rounded-2xl text-white font-bold transition-all active:scale-95 flex items-center justify-center"
              style={{ backgroundColor: '#FF5C00' }}
            >
              View Cart ({currentCustomerItems.length} items)
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default function CustomerMenu(props: CustomerMenuProps) {
  return (
    <CustomerLayout>
      <MenuContent {...props} />
    </CustomerLayout>
  );
}
