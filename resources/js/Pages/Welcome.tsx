import { Head, router } from '@inertiajs/react';
import { WelcomeScreen } from '@/Components/WelcomeScreen';

import { useEffect } from 'react';

interface WelcomeProps {
  tableNumber: number;
  tableUuid: string;
}

export default function Welcome({ tableNumber, tableUuid }: WelcomeProps) {
  useEffect(() => {
    localStorage.setItem('tableUuid', tableUuid);
    const params = new URLSearchParams(window.location.search);
    const isCancelled = params.get('cancelled') === 'true';
    
    const savedNames = localStorage.getItem('customerNames');
    const savedTable = localStorage.getItem('tableNumber');
    
    // If we already have a session for THIS table AND it's not a fresh cancellation, go straight to menu
    if (!isCancelled && savedNames && savedTable === tableNumber.toString()) {
      router.visit(route('menu.index'));
    }
  }, [tableNumber]);

  const initialNames = (() => {
    const saved = localStorage.getItem('customerNames');
    return saved ? JSON.parse(saved) : [];
  })();

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
        initialNames={initialNames}
      />
    </>
  );
}
