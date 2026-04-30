import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductModal } from './ProductModal';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { CartItem } from '@/types';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  stock_status: 'instock' | 'oos';
  description?: string;
}

interface MenuProps {
  products: MenuItem[];
  categories: string[];
  addToCart: (item: Omit<CartItem, 'customerName'>) => void;
}

const ITEMS_PER_PAGE = 12;

export function Menu({ products, categories, addToCart }: MenuProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const displayCategories = ['All', ...categories];

  const filteredItems = products.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="pb-24">
      <div className="sticky top-[73px] z-40 bg-[#0A0A0A] border-b border-border">
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {displayCategories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className="px-4 py-2 rounded-full whitespace-nowrap transition-all"
                style={{
                  backgroundColor: selectedCategory === category ? '#FF5C00' : '#2A2A2A',
                  color: selectedCategory === category ? '#ffffff' : '#A0A0A0'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {paginatedItems.map(item => (
            <button
              key={item.id}
              onClick={() => item.stock_status === 'instock' && setSelectedItem(item)}
              disabled={item.stock_status !== 'instock'}
              className="relative overflow-hidden rounded-2xl bg-card border border-border transition-transform active:scale-95 disabled:opacity-50"
            >
              <div className="aspect-square">
                <ImageWithFallback 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="absolute top-2 right-2">
                {item.stock_status === 'instock' ? (
                  <span className="px-2 py-1 rounded-full text-xs bg-green-500 text-white">
                    Fresh
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-500 text-white">
                    Sold Out
                  </span>
                )}
              </div>

              <div className="p-3 text-left">
                <h3 className="mb-1 font-semibold line-clamp-1">{item.name}</h3>
                <p className="text-sm font-bold" style={{ color: '#FF5C00' }}>₦{Number(item.price).toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-secondary disabled:opacity-50 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      backgroundColor: currentPage === page ? '#FF5C00' : '#2A2A2A',
                      width: currentPage === page ? '24px' : '8px'
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-secondary disabled:opacity-50 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
            </p>
          </div>
        )}
      </div>

      {selectedItem && (
        <ProductModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}
