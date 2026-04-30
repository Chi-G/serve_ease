import { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { CartItem, ServiceType } from '@/types';
import type { MenuItem } from './Menu';

interface ProductModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'customerName'>) => void;
}

const AVAILABLE_PROTEINS = [
  { id: 'chicken', name: 'Grilled Chicken', price: 2500, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200' },
  { id: 'beef', name: 'Beef Steak', price: 3500, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=200' },
  { id: 'fish', name: 'Grilled Fish', price: 3000, image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=200' },
];

export function ProductModal({ item, onClose, onAddToCart }: ProductModalProps) {
  const [serviceType, setServiceType] = useState<ServiceType>('eat-in');
  const [quantity, setQuantity] = useState(1);
  const [selectedProteins, setSelectedProteins] = useState<string[]>([]);

  const toggleProtein = (proteinId: string) => {
    setSelectedProteins(prev =>
      prev.includes(proteinId)
        ? prev.filter(id => id !== proteinId)
        : [...prev, proteinId]
    );
  };

  const calculateTotal = () => {
    const basePrice = item.price * quantity;
    const proteinsPrice = selectedProteins.reduce((sum, proteinId) => {
      const protein = AVAILABLE_PROTEINS.find(p => p.id === proteinId);
      return sum + (protein?.price || 0);
    }, 0);
    return basePrice + proteinsPrice;
  };

  const handleAddToCart = () => {
    const selectedProteinsData = selectedProteins.map(id => 
      AVAILABLE_PROTEINS.find(p => p.id === id)
    ).filter(Boolean);

    const proteinNotes = selectedProteinsData.map(p => `+ ${p?.name}`).join(', ');
    const proteinsTotalPrice = selectedProteinsData.reduce((sum, p) => sum + (p?.price || 0), 0);
    
    // Combine base price and protein price for the cart item
    const finalPrice = item.price + (proteinsTotalPrice / quantity);

    onAddToCart({
      id: `${item.id}-${Date.now()}`,
      productId: item.id,
      name: item.name,
      price: finalPrice,
      quantity,
      serviceType,
      image: item.image_url,
      notes: proteinNotes || undefined
    });

    onClose();
  };

  const EXCLUDED_CATEGORIES = ['Drinks', 'Beverages', 'Sides', 'Side Dishes', 'Desserts', 'Appetizers'];
  const showProteinUpsell = !EXCLUDED_CATEGORIES.includes(item.category);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-card rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm z-10"
        >
          <X size={20} />
        </button>

        <div className="aspect-video">
          <ImageWithFallback 
            src={item.image_url} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl mb-1">{item.name}</h2>
            <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
            <p className="text-xl font-bold" style={{ color: '#FF5C00' }}>₦{Number(item.price).toLocaleString()}</p>
          </div>

          <div>
            <label className="block mb-3 font-medium">Service Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setServiceType('eat-in')}
                className="p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2"
                style={{
                  borderColor: serviceType === 'eat-in' ? '#FF5C00' : '#2A2A2A',
                  backgroundColor: serviceType === 'eat-in' ? 'rgba(255, 92, 0, 0.1)' : 'transparent'
                }}
              >
                <span>🍽️</span>
                <span>Eat-in</span>
              </button>
              <button
                onClick={() => setServiceType('take-away')}
                className="p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-2"
                style={{
                  borderColor: serviceType === 'take-away' ? '#FF5C00' : '#2A2A2A',
                  backgroundColor: serviceType === 'take-away' ? 'rgba(255, 92, 0, 0.1)' : 'transparent'
                }}
              >
                <span>🥡</span>
                <span>Take-away</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-3 font-medium">Quantity</label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"
              >
                <Minus size={20} />
              </button>
              <span className="text-2xl w-16 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FF5C00' }}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {showProteinUpsell && (
            <div>
              <label className="block mb-3 font-medium">Add a protein?</label>
              <div className="space-y-3">
                {AVAILABLE_PROTEINS.map(protein => {
                  const isSelected = selectedProteins.includes(protein.id);
                  return (
                    <button
                      key={protein.id}
                      onClick={() => toggleProtein(protein.id)}
                      className="w-full p-3 rounded-2xl border-2 transition-all flex items-center gap-3 relative overflow-hidden"
                      style={{
                        borderColor: isSelected ? '#FF5C00' : '#2A2A2A',
                        backgroundColor: isSelected ? 'rgba(255, 92, 0, 0.1)' : 'transparent'
                      }}
                    >
                      <div className="relative">
                        <ImageWithFallback 
                          src={protein.image} 
                          alt={protein.name} 
                          className="w-16 h-16 rounded-xl object-cover" 
                        />
                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 92, 0, 0.9)' }}>
                            <Check size={32} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{protein.name}</p>
                        <p className="text-sm text-muted-foreground">₦{protein.price.toLocaleString()}</p>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: isSelected ? '#FF5C00' : '#2A2A2A',
                          backgroundColor: isSelected ? '#FF5C00' : 'transparent'
                        }}
                      >
                        {isSelected && (
                          <Check size={16} className="text-white" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full py-4 rounded-2xl text-white font-bold transition-all active:scale-95"
            style={{ backgroundColor: '#FF5C00' }}
          >
            Add to Cart — ₦{calculateTotal().toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}
