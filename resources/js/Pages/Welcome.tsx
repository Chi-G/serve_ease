import { Head, router } from '@inertiajs/react';
import { WelcomeScreen } from '@/Components/WelcomeScreen';

import { useEffect } from 'react';

interface WelcomeProps {
  tableNumber: number;
}

export default function Welcome({ tableNumber }: WelcomeProps) {
  useEffect(() => {
    const savedNames = localStorage.getItem('customerNames');
    const savedTable = localStorage.getItem('tableNumber');
    
    // If we already have a session for THIS table, go straight to menu
    if (savedNames && savedTable === tableNumber.toString()) {
      router.visit(route('menu.index'));
    }
  }, [tableNumber]);

  const handleNamesSubmit = (names: string[]) => {
    localStorage.setItem('customerNames', JSON.stringify(names));
    localStorage.setItem('tableNumber', tableNumber.toString());
    router.visit(route('menu.index'));
  };

  const handleNavigateToKDS = () => {
    router.visit(route('kitchen.index'));
  };

  return (
    <>
      <Head title="Welcome" />
      <WelcomeScreen 
        tableNumber={tableNumber} 
        onSubmit={handleNamesSubmit} 
        onNavigateToKDS={handleNavigateToKDS} 
      />
    </>
  );
}
