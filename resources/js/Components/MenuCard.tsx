import React from 'react';
import { cn } from '@/lib/utils';
import { Plus, Minus, Info } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number | string;
    category: string;
    tags?: string[];
}

interface MenuCardProps {
    product: Product;
    quantity?: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

export default function MenuCard({ 
    product, 
    quantity = 0, 
    onIncrement, 
    onDecrement 
}: MenuCardProps) {
    // Generate a placeholder image based on category for visualization until real assets arrive
    const imageMap: Record<string, string> = {
        'Sea Food': 'https://images.unsplash.com/photo-1599084929471-165bb0656240?w=400&q=80',
        'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
        'Salads': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
        'Tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
        'Soups': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
        'Sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
        'Beverages': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80',
    };

    const imageUrl = imageMap[product.category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';

    return (
        <div className="bg-surface rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col gap-3 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer group">
            {/* Image Container */}
            <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-100">
                <img 
                    src={imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Promo Badge (Optional based on tags) */}
                {product.tags && product.tags.includes('trending') && (
                    <div className="absolute top-2 left-2 bg-warning text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        Trending
                    </div>
                )}
                {product.tags && product.tags.includes('must_try') && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        Must Try
                    </div>
                )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col flex-1 px-1">
                {/* Category & Diet Badge */}
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted font-medium">{product.category}</span>
                    <div className="flex items-center gap-1 text-[10px] text-muted font-medium">
                        <div className={cn(
                            "w-3 h-3 rounded-sm border flex items-center justify-center p-0.5",
                            product.tags?.includes('veg') ? "border-success" : "border-danger"
                        )}>
                            <div className={cn(
                                "w-full h-full rounded-full",
                                product.tags?.includes('veg') ? "bg-success" : "bg-danger"
                            )} />
                        </div>
                        {product.tags?.includes('veg') ? 'Veg' : 'Non Veg'}
                    </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate text-sm leading-tight mb-3 line-clamp-2">
                    {product.name}
                </h3>

                {/* Price & Controls */}
                <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-slate text-base tracking-tight">
                        ${Number(product.price).toFixed(0)}
                    </span>
                    
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 p-0.5">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDecrement(); }}
                            disabled={quantity === 0}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:bg-white hover:text-slate hover:shadow-sm disabled:opacity-50 transition-all"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-semibold text-sm text-slate">
                            {quantity}
                        </span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onIncrement(); }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:bg-white hover:text-slate hover:shadow-sm transition-all"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
