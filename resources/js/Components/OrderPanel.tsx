import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { 
    Plus, 
    Minus, 
    X, 
    Trash2, 
    Printer, 
    FileText, 
    FileDown, 
    Ban, 
    ShoppingCart, 
    User, 
    LayoutGrid, 
    ChevronDown,
    Zap,
    RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
    imageUrl: string;
}

interface OrderPanelProps {
    cart?: CartItem[];
    tables?: any[];
    waiters?: any[];
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
    onSuccess?: () => void;
}

export default function OrderPanel({ 
    cart = [], 
    tables = [], 
    waiters = [], 
    onUpdateQuantity, 
    onRemove,
    onSuccess 
}: OrderPanelProps) {
    const [orderType, setOrderType] = useState<'dine_in' | 'take_away' | 'delivery'>('dine_in');
    const [selectedTable, setSelectedTable] = useState<string | number>('');
    const [customerName, setCustomerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subTotal * 0.18;
    const total = subTotal + tax;

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        if (orderType === 'dine_in' && !selectedTable) {
            toast.error('Please select a table');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(route('pos.orders.store'), {
                table_id: selectedTable || tables[0]?.id,
                items: cart,
                customer_name: customerName || 'Walk-in Guest',
                order_type: orderType,
            });

            if (response.data.success) {
                toast.success('Order placed successfully!');
                onSuccess?.();
                setCustomerName('');
                setSelectedTable('');
            }
        } catch (error: any) {
            console.error('POS Order Error:', error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full h-full bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col overflow-hidden relative">
            
            {/* Header Area */}
            <div className="p-6 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="font-black text-slate text-xl tracking-tight flex items-center gap-2">
                            <ShoppingCart className="text-primary" size={20} />
                            Active Order
                        </h2>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                        POS-{Math.floor(Math.random() * 9000 + 1000)}
                    </div>
                </div>

                {/* Order Type Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    {(['dine_in', 'take_away', 'delivery'] as const).map((type) => (
                        <button 
                            key={type}
                            onClick={() => setOrderType(type)}
                            className={cn(
                                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                orderType === type 
                                    ? "bg-white text-primary shadow-sm scale-[1.02]" 
                                    : "text-muted-foreground hover:text-slate"
                            )}
                        >
                            {type.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Table & Customer Inputs */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative group">
                        <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
                        <select 
                            value={selectedTable}
                            onChange={(e) => setSelectedTable(e.target.value)}
                            className="bg-gray-50/50 border-gray-100 text-slate text-sm font-bold rounded-xl focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-3 transition-all outline-none"
                        >
                            <option value="">Select Table</option>
                            {tables.map(table => (
                                <option key={table.id} value={table.id}>Table {table.table_num}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={16} />
                        <input 
                            type="text" 
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="bg-gray-50/50 border-gray-100 text-slate text-sm font-bold rounded-xl focus:ring-primary focus:border-primary block w-full pl-10 pr-4 py-3 transition-all outline-none" 
                            placeholder="Guest Name"
                        />
                    </div>
                </div>
            </div>

            {/* Cart List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-100">
                {cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={item.id} className="group flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-50 hover:border-primary/20 hover:shadow-lg hover:shadow-gray-100/50 transition-all">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 shadow-inner">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-slate leading-tight truncate">{item.name}</h4>
                                <p className="text-[10px] font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-slate transition-all active:scale-90"
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="text-xs font-black w-8 text-center">{item.quantity}</span>
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center bg-slate text-white rounded-lg transition-all hover:bg-black active:scale-90"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30">
                        <ShoppingCart size={48} className="mb-4" />
                        <p className="font-bold text-sm uppercase tracking-widest">Cart is empty</p>
                    </div>
                )}
            </div>

            {/* Footer Summary */}
            <div className="p-6 bg-slate text-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-white/60 text-xs font-bold uppercase tracking-widest">
                        <span>Sub Total</span>
                        <span className="text-white">${subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/60 text-xs font-bold uppercase tracking-widest">
                        <span>Tax (18%)</span>
                        <span className="text-white">${tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className="text-lg font-black tracking-tight">Total Amount</span>
                        <span className="text-2xl font-black text-white tracking-tighter">${total.toFixed(2)}</span>
                    </div>
                </div>

                <button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || cart.length === 0}
                    className={cn(
                        "w-full py-4 bg-primary hover:bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95",
                        (isSubmitting || cart.length === 0) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isSubmitting ? (
                        <RefreshCw className="animate-spin" size={18} />
                    ) : (
                        <>
                            <Zap size={18} fill="currentColor" />
                            Confirm & Place Order
                        </>
                    )}
                </button>

                <div className="grid grid-cols-3 gap-2 mt-4">
                    <button className="flex flex-col items-center gap-1.5 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
                        <Printer size={16} className="text-white/60 group-hover:text-white" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter text-white/40 group-hover:text-white/60">Print</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group">
                        <FileText size={16} className="text-white/60 group-hover:text-white" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter text-white/40 group-hover:text-white/60">Invoice</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 py-3 bg-rose-500/20 hover:bg-rose-500/30 rounded-xl transition-all group">
                        <Trash2 size={16} className="text-rose-400 group-hover:text-rose-300" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter text-rose-400 group-hover:text-rose-300">Clear</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
