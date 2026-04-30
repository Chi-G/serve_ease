import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import ServeEaseAppLayout from '@/Layouts/ServeEaseAppLayout';
import MenuCard from '@/Components/MenuCard';
import OrderPanel from '@/Components/OrderPanel';
import { Search, RefreshCw, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    products: any[];
    categories: string[];
    tables: any[];
    waiters: any[];
}

export default function Dashboard({ products, categories, tables, waiters }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [dietaryFilter, setDietaryFilter] = useState({ veg: true, nonVeg: true, egg: true });
    
    const [cart, setCart] = useState<any[]>([]);
    
    // Filtered Products logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            
            // Basic dietary filtering (mock logic as per typical tags)
            const tags = product.tags || [];
            const isVeg = tags.includes('veg');
            const isNonVeg = tags.includes('non_veg');
            
            if (!dietaryFilter.veg && isVeg) return false;
            if (!dietaryFilter.nonVeg && isNonVeg) return false;
            
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory, dietaryFilter]);

    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCart(cart.filter(item => item.id !== productId));
        } else {
            setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
        }
    };

    const handleAddToCart = (product: any) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            handleUpdateQuantity(product.id, existing.quantity + 1);
        } else {
            setCart([...cart, { 
                id: product.id, 
                name: product.name, 
                price: parseFloat(product.price), 
                quantity: 1, 
                imageUrl: product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80' 
            }]);
        }
    };

    const onOrderSuccess = () => {
        setCart([]);
    };

    return (
        <ServeEaseAppLayout>
            <Head title="POS Dashboard" />

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
                
                {/* Left Side - Menus */}
                <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                    
                    {/* Header & Filters */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 shrink-0">
                        <div className="flex items-center gap-6">
                            <h2 className="font-black text-slate text-2xl tracking-tight">Menu Catalog</h2>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate uppercase tracking-widest">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={dietaryFilter.veg}
                                        onChange={(e) => setDietaryFilter({...dietaryFilter, veg: e.target.checked})}
                                        className="rounded-lg border-gray-200 text-emerald-500 focus:ring-emerald-500 w-5 h-5 transition-all" 
                                    />
                                    <span className="group-hover:text-emerald-600">Veg</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={dietaryFilter.nonVeg}
                                        onChange={(e) => setDietaryFilter({...dietaryFilter, nonVeg: e.target.checked})}
                                        className="rounded-lg border-gray-200 text-rose-500 focus:ring-rose-500 w-5 h-5 transition-all" 
                                    />
                                    <span className="group-hover:text-rose-600">Non-Veg</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Find a dish..." 
                                    className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 text-sm focus:ring-primary focus:border-primary w-64 bg-white shadow-sm font-medium"
                                />
                            </div>
                            <button 
                                onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-xl text-slate shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="flex gap-3 pb-4 mb-2 overflow-x-auto shrink-0 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border whitespace-nowrap",
                                selectedCategory === 'All' 
                                    ? "bg-slate text-white border-slate scale-105 shadow-lg" 
                                    : "bg-white text-slate border-gray-100 hover:border-gray-200"
                            )}
                        >
                            All Items
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border whitespace-nowrap",
                                    selectedCategory === cat 
                                        ? "bg-slate text-white border-slate scale-105 shadow-lg" 
                                        : "bg-white text-slate border-gray-100 hover:border-gray-200"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto pr-2 pb-10 scrollbar-thin scrollbar-thumb-gray-200">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                                {filteredProducts.map(product => (
                                    <MenuCard 
                                        key={product.id} 
                                        product={product} 
                                        quantity={cart.find(c => c.id === product.id)?.quantity || 0}
                                        onIncrement={() => handleAddToCart(product)}
                                        onDecrement={() => handleUpdateQuantity(product.id, (cart.find(c => c.id === product.id)?.quantity || 0) - 1)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <Search size={64} className="mb-4" />
                                <h3 className="text-xl font-bold">No items found</h3>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Cart Panel */}
                <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0 h-full">
                    <OrderPanel 
                        cart={cart} 
                        tables={tables}
                        waiters={waiters}
                        onUpdateQuantity={handleUpdateQuantity} 
                        onRemove={(id) => handleUpdateQuantity(id, 0)}
                        onSuccess={onOrderSuccess}
                    />
                </div>
            </div>
        </ServeEaseAppLayout>
    );
}
