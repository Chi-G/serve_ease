import React, { useEffect, useState, PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingCart, ChefHat, Calendar, Table as TableIcon, Bell, Settings, LogOut, LucideIcon } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

const NavLink = ({ href, active, icon: Icon, children }: PropsWithChildren<{ href: string; active: boolean; icon: LucideIcon }>) => {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                active 
                    ? "bg-blue-50 text-primary" 
                    : "text-muted hover:bg-gray-100 hover:text-slate"
            )}
        >
            <Icon size={18} className={cn(active ? "text-primary" : "text-muted")} />
            {children}
        </Link>
    );
};

export default function ServeEaseAppLayout({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const { url } = usePage();
    const [notifications, setNotifications] = useState<{ id: number; message: string }[]>([]);

    useEffect(() => {
        if (!window.Echo) return;

        console.log('Listening for service requests...');
        const channel = window.Echo.channel('service-requests')
            .listen('CallWaiterReceived', (e: any) => {
                console.log('Notification received:', e);
                const newNotification = {
                    id: Date.now(),
                    message: `Table ${e.serviceRequest.table_id} is calling a waiter!`,
                };
                setNotifications(prev => [newNotification, ...prev]);
                
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
                }, 8000);
            });
            
        return () => channel.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <nav className="bg-surface border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                
                {/* Left - Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="text-primary font-bold text-xl tracking-tighter">SE</span>
                    </div>
                    <span className="font-bold text-xl text-slate tracking-tight">
                        Serve<span className="text-primary">Ease</span>
                    </span>
                </div>

                {/* Center - Main Tabs */}
                <div className="hidden md:flex items-center gap-2">
                    {!url.startsWith('/waiter') && (
                        <NavLink href="/dashboard" active={url.startsWith('/dashboard')} icon={ShoppingCart}>
                            POS
                        </NavLink>
                    )}
                    <NavLink href="/orders" active={url.startsWith('/orders')} icon={LayoutDashboard}>
                        Orders
                    </NavLink>
                    {!url.startsWith('/waiter') && (
                        <>
                            <NavLink href="/kitchen" active={url.startsWith('/kitchen')} icon={ChefHat}>
                                Kitchen
                            </NavLink>
                            <NavLink href="/reservations" active={url.startsWith('/reservations')} icon={Calendar}>
                                Reservation
                            </NavLink>
                            <NavLink href="/tables" active={url.startsWith('/tables')} icon={TableIcon}>
                                Table
                            </NavLink>
                        </>
                    )}
                    <NavLink href="/waiter" active={url.startsWith('/waiter')} icon={Bell}>
                        Service
                    </NavLink>
                </div>

                {/* Right - Profile & Utilities */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ml-2">
                        <img 
                            src={`https://ui-avatars.com/api/?name=Admin&background=1B64F2&color=fff`} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-all shadow-sm"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </Link>
                </div>
            </nav>

            {/* Page Content */}
            <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 overflow-x-hidden">
                {header && (
                    <header className="mb-6">
                        {header}
                    </header>
                )}
                {children}
            </main>
            {/* Notification Toast Stack */}
            <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {notifications.map((n) => (
                    <div 
                        key={n.id}
                        className="bg-slate border-l-4 border-primary text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-full duration-300 pointer-events-auto"
                    >
                        <div className="bg-primary/20 p-2 rounded-full">
                            <Bell className="text-primary animate-ring" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">New Request</span>
                            <p className="font-bold text-sm tracking-tight">{n.message}</p>
                        </div>
                        <button 
                            onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                            className="ml-4 text-white/40 hover:text-white transition-colors"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
