import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Bell, 
    Clock, 
    CheckCircle2, 
    LogOut, 
    UtensilsCrossed, 
    User, 
    HandHelping,
    MessageSquare,
    CreditCard,
    Wallet
} from 'lucide-react';
import { toast } from 'sonner';

interface ServiceRequest {
    id: number;
    table_id: number;
    guest_name: string;
    customer_name?: string;
    request_type: string;
    type: string;
    message: string;
    status: string;
    created_at: string;
}

interface Order {
    id: number;
    order_number: string;
    queue_number: string;
    table_id: number;
    table?: { table_num: string };
    status: string;
    items: any[];
    total_price: string | number;
    created_at: string;
    updated_at: string;
}

interface WaiterDashboardProps {
    requests: ServiceRequest[];
    readyOrders: Order[];
    allOrders: Order[];
}

export default function WaiterDashboard({ requests, readyOrders, allOrders }: WaiterDashboardProps) {
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        // Listen for Guest Requests
        window.Echo.channel('service-requests')
            .listen('CallWaiterReceived', (e: any) => {
                router.reload({ only: ['requests', 'readyOrders'] });
            });

        // Listen for Kitchen Pickups (Order Status Changes)
        window.Echo.channel('orders')
            .listen('OrderStatusUpdated', (e: any) => {
                router.reload({ only: ['requests', 'readyOrders'] });
            });

        return () => {
            window.Echo.leave('service-requests');
            window.Echo.leave('orders');
            clearInterval(interval);
        };
    }, []);

    const getElapsedMinutes = (createdAt: string) => {
        const timestamp = new Date(createdAt).getTime();
        return Math.floor((currentTime - timestamp) / 60000);
    };

    const getAlertColor = (createdAt: string) => {
        const elapsed = getElapsedMinutes(createdAt);
        if (elapsed >= 10) return '#EF4444';
        if (elapsed >= 5) return '#FFA500'; 
        return '#FF5C00';  
    };

    const handleResolveRequest = (id: number) => {
        router.post(route('waiter.requests.resolve', id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Request resolved'),
        });
    };

    const handleMarkServed = (id: number) => {
        router.post(route('waiter.orders.serve', id), { status: 'served' }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Order marked as served'),
        });
    };

    const handleMarkPaid = (id: number) => {
        router.post(route('waiter.orders.paid', id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Order verified and sent to kitchen'),
        });
    };

    const pendingOrders = allOrders.filter(o => o.status === 'pending');

    return (
        <div className="min-h-screen bg-[#121212] text-white p-4 sm:p-6 font-sans antialiased overflow-hidden flex flex-col">
            <Head title="Service Display System" />

            {/* KDS Style Header - Mobile Optimized */}
            <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
                        Service <span className="text-primary">Display System</span>
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.15em] font-bold">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Live Floor Operations & Table Alerts
                    </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 bg-white/[0.03] md:bg-transparent p-4 md:p-0 rounded-2xl border border-white/5 md:border-none">
                    <div className="text-left md:text-right">
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black leading-none mb-1">Active Alerts</p>
                        <p className="text-2xl md:text-4xl font-black text-white leading-none">{requests.length + readyOrders.length + pendingOrders.length}</p>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="p-3 md:p-4 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 rounded-xl md:rounded-2xl border border-white/5 transition-all shadow-2xl"
                    >
                        <LogOut size={20} className="md:w-6 md:h-6" />
                    </Link>
                </div>
            </div>

            {/* Main Operational Board - Improved Grid spacing */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 overflow-hidden">
                
                {/* COLUMN 1: GUEST REQUESTS */}
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="mb-3 md:mb-4 flex items-center justify-between bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 md:gap-3">
                            <Bell className="text-primary" size={18} />
                            <h2 className="text-base md:text-xl font-black uppercase tracking-wider">Guest Requests</h2>
                        </div>
                        <span className="px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-primary text-white text-xs md:text-sm font-black">
                            {requests.length}
                        </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 scrollbar-hide pr-1">
                        {requests.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center bg-white/[0.01] rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-white/5 py-12 md:py-20 text-white/20">
                                <HandHelping size={48} className="md:w-16 md:h-16 mb-4 opacity-20" />
                                <p className="text-xs md:text-sm font-bold uppercase tracking-widest">No active alerts</p>
                            </div>
                        ) : (
                            requests.map((request) => {
                                const color = getAlertColor(request.created_at);
                                const elapsed = getElapsedMinutes(request.created_at);
                                return (
                                    <div 
                                        key={request.id}
                                        className="bg-[#1A1A1A] border-2 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 space-y-3 md:space-y-4 transition-all"
                                        style={{ borderColor: color }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>
                                                    <MessageSquare size={18} className="md:w-6 md:h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter leading-tight" style={{ color }}>
                                                        {request.request_type || request.type}
                                                    </p>
                                                    <p className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-widest">Table {request.table_id}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 font-black text-base md:text-xl" style={{ color }}>
                                                <Clock size={16} className="md:w-5 md:h-5" />
                                                {elapsed}m
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white/[0.03] rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/5">
                                            <p className="text-sm md:text-lg font-medium text-white italic leading-snug">
                                                "{request.message || 'Needs assistance'}"
                                            </p>
                                            <p className="text-[9px] md:text-[10px] mt-2 text-white/30 uppercase font-black tracking-widest">
                                                Guest: {request.customer_name || request.guest_name || 'Walk-in'}
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => handleResolveRequest(request.id)}
                                            className="w-full py-3 md:py-4 rounded-xl text-white text-xs md:text-base font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                                            style={{ backgroundColor: color }}
                                        >
                                            <CheckCircle2 size={16} className="md:w-5 md:h-5" />
                                            Acknowledge
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* COLUMN 2: PENDING PAYMENTS */}
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="mb-3 md:mb-4 flex items-center justify-between bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 md:gap-3">
                            <CreditCard className="text-orange-500" size={18} />
                            <h2 className="text-base md:text-xl font-black uppercase tracking-wider">Pending Payments</h2>
                        </div>
                        <span className="px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-orange-500 text-white text-xs md:text-sm font-black">
                            {pendingOrders.length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 scrollbar-hide pr-1">
                        {pendingOrders.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center bg-white/[0.01] rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-white/5 py-12 md:py-20 text-white/20">
                                <Wallet size={48} className="md:w-16 md:h-16 mb-4 opacity-20" />
                                <p className="text-xs md:text-sm font-bold uppercase tracking-widest">All settled</p>
                            </div>
                        ) : (
                            pendingOrders.map((order) => {
                                const elapsed = getElapsedMinutes(order.created_at);
                                return (
                                    <div 
                                        key={order.id}
                                        className="bg-[#1A1A1A] border-2 border-orange-500 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 space-y-3 md:space-y-4 transition-all shadow-lg shadow-orange-500/10"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-orange-500 text-white shadow-lg">
                                                    <CreditCard size={18} className="md:w-6 md:h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter leading-tight text-orange-500">
                                                        VERIFY PAYMENT
                                                    </p>
                                                    <p className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-widest">
                                                        Table {order.table?.table_num || order.table_id} • ₦{Number(order.total_price).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 font-black text-base md:text-xl text-orange-500">
                                                <Clock size={16} className="md:w-5 md:h-5" />
                                                {elapsed}m
                                            </div>
                                        </div>

                                        <div className="bg-orange-500/10 rounded-xl md:rounded-2xl p-3 md:p-4 border border-orange-500/20">
                                            <p className="text-xs md:text-sm font-bold text-white/80">
                                                Order #{order.queue_number || order.order_number?.slice(-4)} • {order.items?.length || 0} items
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => handleMarkPaid(order.id)}
                                            className="w-full py-3 md:py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs md:text-base font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20"
                                        >
                                            <CheckCircle2 size={16} className="md:w-5 md:h-5" />
                                            Confirm Payment
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* COLUMN 3: KITCHEN PICKUPS */}
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="mb-3 md:mb-4 flex items-center justify-between bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2 md:gap-3">
                            <UtensilsCrossed className="text-emerald-500" size={18} />
                            <h2 className="text-base md:text-xl font-black uppercase tracking-wider">Kitchen Pickups</h2>
                        </div>
                        <span className="px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-emerald-500 text-white text-xs md:text-sm font-black">
                            {readyOrders.length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 scrollbar-hide pr-1">
                        {readyOrders.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center bg-white/[0.01] rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-white/5 py-12 md:py-20 text-white/20">
                                <UtensilsCrossed size={48} className="md:w-16 md:h-16 mb-4 opacity-20" />
                                <p className="text-xs md:text-sm font-bold uppercase tracking-widest">Waiting for kitchen...</p>
                            </div>
                        ) : (
                            readyOrders.map((order) => {
                                const elapsed = getElapsedMinutes(order.updated_at || order.created_at);
                                return (
                                    <div 
                                        key={order.id}
                                        className="bg-[#1A1A1A] border-2 border-emerald-500 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 space-y-3 md:space-y-4 transition-all shadow-lg shadow-emerald-500/10"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-emerald-500 text-white shadow-lg">
                                                    <UtensilsCrossed size={18} className="md:w-6 md:h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter leading-tight text-emerald-500">
                                                        READY FOR TABLE
                                                    </p>
                                                    <p className="text-[10px] md:text-sm font-bold text-white/40 uppercase tracking-widest">
                                                        Table {order.table?.table_num || order.table_id} • #{order.order_number?.slice(-4)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 font-black text-base md:text-xl text-emerald-500">
                                                <Clock size={16} className="md:w-5 md:h-5" />
                                                {elapsed}m
                                            </div>
                                        </div>

                                        <div className="bg-emerald-500/10 rounded-xl md:rounded-2xl p-3 md:p-4 border border-emerald-500/20">
                                            <div className="space-y-2">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-xs md:text-sm font-bold">
                                                        <span className="text-white">{item.quantity}x {item.product?.name || item.name}</span>
                                                        {item.notes && <span className="text-[9px] md:text-[10px] text-emerald-400 italic">Note: {item.notes}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => handleMarkServed(order.id)}
                                            className="w-full py-3 md:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs md:text-base font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
                                        >
                                            <CheckCircle2 size={16} className="md:w-5 md:h-5" />
                                            Mark Served
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* KDS Style Footer Legend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <h3 className="text-[10px] mb-3 font-black uppercase text-white/40 tracking-[0.2em]">Response Time Indicators</h3>
                    <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5C00' }} />
                            <span>0-4 min (Optimal)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFA500' }} />
                            <span>5-9 min (Warning)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#EF4444' }} />
                            <span>10+ min (Critical)</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <h3 className="text-[10px] mb-3 font-black uppercase text-white/40 tracking-[0.2em]">Service Protocol</h3>
                    <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-white/60">
                        <div className="flex items-center gap-2">
                            <Bell size={14} className="text-primary" />
                            <span>Respond to alerts immediately</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <UtensilsCrossed size={14} className="text-emerald-500" />
                            <span>Deliver food while hot</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
