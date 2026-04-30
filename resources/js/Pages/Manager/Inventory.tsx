import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Package, 
    Eye, 
    EyeOff, 
    AlertTriangle, 
    Search, 
    Info, 
    TrendingUp, 
    DollarSign, 
    Activity,
    Plus,
    Filter,
    LogOut,
    CheckCircle2,
    XCircle,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Product {
    id: number;
    name: string;
    price: string | number;
    image_url: string;
    stock_status: string;
    is_in_showglass: boolean;
    category: string;
}

interface Stats {
    showglass: number;
    oos: number;
    total: number;
    revenue_today: number;
    active_orders: number;
}

export default function ManagerCommandCenter({ products, stats }: { products: Product[]; stats: Stats }) {
    const [inventory, setInventory] = useState(products);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Real-time synchronization
    useEffect(() => {
        if (!window.Echo) return;

        const ordersChannel = window.Echo.channel('orders')
            .listen('OrderStatusUpdated', () => {
                router.reload({ only: ['stats'] });
            });

        const visibilityChannel = window.Echo.channel('inventory-updates')
            .listen('ProductVisibilityChanged', (e: any) => {
                setInventory(prev => prev.map(item => item.id === e.product.id ? e.product : item));
                router.reload({ only: ['stats'] });
            });

        return () => {
            window.Echo.leave('orders');
            window.Echo.leave('inventory-updates');
        };
    }, []);

    const categories = ['All', ...Array.from(new Set(inventory.map(item => item.category).filter(Boolean)))] as string[];

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleStatus = async (id: number, field: 'stock' | 'visibility') => {
        try {
            const endpoint = field === 'stock' 
                ? `/api/products/${id}/toggle-stock` 
                : `/api/products/${id}/toggle-showglass`;
            
            const response = await axios.post(endpoint);
            const updatedProduct = response.data.product;

            setInventory(prev => prev.map(item => item.id === id ? updatedProduct : item));
            toast.success(`Product ${field === 'stock' ? 'stock' : 'visibility'} updated`);
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-6 font-sans antialiased flex flex-col overflow-x-hidden">
            <Head title="Manager Command Center" />

            {/* Premium Header */}
            <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <TrendingUp className="text-primary" size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Operation Intelligence</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white leading-none">
                        Command <span className="text-primary">Center</span>
                    </h1>
                    <p className="text-xs md:text-sm text-white/40 font-bold uppercase tracking-widest max-w-xl">
                        Tactical oversight of your restaurant's digital presence and real-time inventory flow.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">System Status</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                            <span className="text-xs font-black uppercase tracking-widest text-green-500/80">Active</span>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="p-4 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 rounded-2xl border border-white/5 transition-all shadow-2xl group"
                    >
                        <LogOut size={24} className="group-hover:rotate-12 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                <div className="bg-[#141414] border-2 border-white/5 p-6 rounded-[2rem] space-y-4 hover:border-primary/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Today</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Revenue (Today)</p>
                        <p className="text-3xl font-black tracking-tighter italic leading-none mt-1 text-white">${stats.revenue_today.toLocaleString()}</p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                        <ArrowUpRight size={14} />
                        Live Performance
                    </div>
                </div>

                <div className="bg-[#141414] border-2 border-white/5 p-6 rounded-[2rem] space-y-4 hover:border-blue-500/30 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                            <Activity size={24} />
                        </div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">Floor</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Active Orders</p>
                        <p className="text-3xl font-black tracking-tighter italic leading-none mt-1 text-white">{stats.active_orders}</p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-blue-500/60 uppercase tracking-widest">
                        Live Kitchen Load
                    </div>
                </div>

                <div className="bg-[#141414] border-2 border-white/5 p-6 rounded-[2rem] space-y-4 hover:border-amber-500/30 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <Eye size={24} />
                        </div>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">Menu</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Show-Glass Items</p>
                        <p className="text-3xl font-black tracking-tighter italic leading-none mt-1 text-white">{stats.showglass}</p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">
                        Customer Visibility
                    </div>
                </div>

                <div className="bg-[#141414] border-2 border-white/5 p-6 rounded-[2rem] space-y-4 hover:border-red-500/30 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
                            <AlertTriangle size={24} />
                        </div>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full">Stock</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Out of Stock</p>
                        <p className="text-3xl font-black tracking-tighter italic leading-none mt-1 text-white">{stats.oos}</p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-red-500/60 uppercase tracking-widest">
                        Immediate Action Required
                    </div>
                </div>
            </div>

            {/* Inventory Controls Section */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-white/[0.02] p-4 md:p-6 rounded-3xl border border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex items-center gap-3">
                            <Package className="text-primary" size={24} />
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic">Show-Glass <span className="text-primary">Manager</span></h2>
                        </div>
                        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                        activeCategory === cat 
                                            ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                            : "text-white/40 hover:text-white"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search tactical inventory..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3.5 bg-black/40 border-2 border-white/5 rounded-2xl text-sm focus:ring-primary focus:border-primary w-full md:w-80 transition-all font-bold placeholder:text-white/10"
                            />
                        </div>
                        <button className="hidden md:flex items-center gap-2 bg-primary px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                            <Plus size={18} />
                            New Item
                        </button>
                    </div>
                </div>

                {/* Tactical Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-12">
                    {filteredInventory.map((item) => (
                        <div key={item.id} className="bg-[#141414] border-2 border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/20 transition-all flex flex-col h-full shadow-2xl">
                            <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
                                <img 
                                    src={item.image_url || `https://ui-avatars.com/api/?name=${item.name}&background=random`} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60" />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                    <span className="text-primary font-black italic text-lg tracking-tighter">${item.price}</span>
                                </div>
                                <div className="absolute bottom-4 left-6">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{item.category || 'Uncategorized'}</span>
                                    <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none text-white mt-1">{item.name}</h3>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Show-Glass Status</p>
                                        <button 
                                            onClick={() => toggleStatus(item.id, 'visibility')}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all",
                                                item.is_in_showglass 
                                                    ? "bg-primary/10 border-primary/20 text-primary" 
                                                    : "bg-white/5 border-white/5 text-white/30"
                                            )}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">{item.is_in_showglass ? 'Visible' : 'Hidden'}</span>
                                            {item.is_in_showglass ? <Eye size={14} /> : <EyeOff size={14} />}
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Inventory Flow</p>
                                        <button 
                                            onClick={() => toggleStatus(item.id, 'stock')}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all",
                                                item.stock_status === 'instock' 
                                                    ? "bg-green-500/10 border-green-500/20 text-green-500" 
                                                    : "bg-red-500/10 border-red-500/20 text-red-500"
                                            )}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-widest">{item.stock_status === 'instock' ? 'In Stock' : 'Out Stock'}</span>
                                            {item.stock_status === 'instock' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                                            <Info size={14} />
                                        </div>
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest underline underline-offset-4 decoration-white/10">View Analytics</span>
                                    </div>
                                    <button className="p-2 text-white/20 hover:text-white transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tactical Legend Footer */}
            <div className="mt-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pt-12 border-t border-white/5">
                <div className="bg-[#141414] p-6 rounded-[2rem] border border-white/5">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Operational Status</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs font-bold text-white/60">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>System is currently broadcasting to 4 terminals</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-white/60">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Inventory database synchronized across KDS and POS</span>
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-2 bg-primary rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                        <TrendingUp size={32} className="text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter">Real-time Pulse Enabled</h4>
                        <p className="text-white/80 text-sm font-medium leading-relaxed max-w-xl mt-1">
                            Your Manager Command Center is connected to the ServeEase Nerve System. Any changes to product visibility or stock levels are instantly reflected on customer digital menus via WebSockets.
                        </p>
                    </div>
                    <button className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all whitespace-nowrap">
                        Generate Sales Report
                    </button>
                </div>
            </div>
        </div>
    );
}
