import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Users, 
    UtensilsCrossed, 
    Table as TableIcon, 
    DollarSign, 
    TrendingUp, 
    Activity,
    Plus,
    Trash2,
    QrCode as QrCodeIcon,
    ChevronRight,
    ChevronLeft,
    ArrowUpRight,
    UserPlus,
    Settings,
    LogOut,
    Search,
    Edit3,
    Check
} from 'lucide-react';

import QRCode from "react-qr-code";
const QRCodeComponent = (QRCode as any).default || QRCode;
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Product {
    id: number;
    name: string;
    price: string | number;
    category: string;
    stock_status: string;
}

interface Table {
    id: number;
    table_num: string;
    uuid: string;
    status: string;
}

interface Stats {
    revenue_today: number;
    revenue_month: number;
    active_orders: number;
    total_orders_today: number;
    staff_count: number;
    table_count: number;
}

export default function SuperDashboard({ stats, users, products, categories, tables }: { 
    stats: Stats; 
    users: User[]; 
    products: Product[]; 
    categories: string[]; 
    tables: Table[] 
}) {
    const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'menu' | 'tables'>('overview');
    
    // Pagination State
    const [menuPage, setMenuPage] = useState(1);
    const [tablePage, setTablePage] = useState(1);
    const MENU_PAGE_SIZE = 6;
    const TABLE_PAGE_SIZE = 3;
    
    // User Form
    const { data: userData, setData: setUserData, post: postUser, reset: resetUser, processing: userProcessing } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'waiter'
    });

    // Table Form
    const { data: tableData, setData: setTableData, post: postTable, reset: resetTable } = useForm({
        table_num: ''
    });

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        postUser(route('admin.users.store'), {
            onSuccess: () => {
                toast.success('Staff member added');
                resetUser();
            }
        });
    };

    const handleAddTable = (e: React.FormEvent) => {
        e.preventDefault();
        postTable(route('admin.tables.store'), {
            onSuccess: () => {
                toast.success('Table added');
                resetTable();
            }
        });
    };

    const deleteUser = (id: number) => {
        if (confirm('Are you sure you want to remove this staff member?')) {
            useForm().delete(route('admin.users.destroy', id), {
                onSuccess: () => toast.success('Staff removed')
            });
        }
    };

    const deleteTable = (id: number) => {
        if (confirm('Remove this table configuration?')) {
            useForm().delete(route('admin.tables.destroy', id), {
                onSuccess: () => toast.success('Table removed')
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans antialiased">
            <Head title="Super Admin Dashboard" />

            {/* Tactical Sidebar */}
            <aside className="w-20 lg:w-72 bg-[#0A0A0A] border-r border-white/5 flex flex-col shrink-0 transition-all duration-300">
                <div className="p-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                        <UtensilsCrossed className="text-white" size={20} />
                    </div>
                    <span className="hidden lg:block font-black tracking-tighter text-xl uppercase italic">ServeEase <span className="text-primary">Elite</span></span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                            activeTab === 'overview' ? "bg-primary text-white shadow-xl shadow-primary/10" : "text-white/40 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <LayoutDashboard size={22} />
                        <span className="hidden lg:block font-bold text-sm uppercase tracking-widest">Overview</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('staff')}
                        className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                            activeTab === 'staff' ? "bg-primary text-white shadow-xl shadow-primary/10" : "text-white/40 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <Users size={22} />
                        <span className="hidden lg:block font-bold text-sm uppercase tracking-widest">Staffing</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('menu')}
                        className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                            activeTab === 'menu' ? "bg-primary text-white shadow-xl shadow-primary/10" : "text-white/40 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <UtensilsCrossed size={22} />
                        <span className="hidden lg:block font-bold text-sm uppercase tracking-widest">Menu Engineering</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('tables')}
                        className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                            activeTab === 'tables' ? "bg-primary text-white shadow-xl shadow-primary/10" : "text-white/40 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <TableIcon size={22} />
                        <span className="hidden lg:block font-bold text-sm uppercase tracking-widest">Tables & QR</span>
                    </button>
                </nav>

                <div className="p-4 mt-auto border-t border-white/5">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                        <LogOut size={22} />
                        <span className="hidden lg:block font-bold text-sm uppercase tracking-widest">Terminal Exit</span>
                    </Link>
                </div>
            </aside>

            {/* Main Command View */}
            <main className="flex-1 overflow-y-auto relative">
                <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-12">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="bg-primary/20 p-2 rounded-lg">
                                    <Activity className="text-primary" size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Executive Oversight</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic text-white leading-none">
                                Super <span className="text-primary">Admin</span>
                            </h1>
                            <p className="text-sm text-white/40 font-bold uppercase tracking-widest">
                                High-level business intelligence & operational control.
                            </p>
                        </div>

                        <div className="flex items-center gap-6 bg-[#0A0A0A] p-4 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Current Market</p>
                                <p className="text-xl font-black italic text-green-500">+12.4% <span className="text-[10px] not-italic text-white/40 font-bold">vs yesterday</span></p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                <TrendingUp className="text-white/20" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        
                        {activeTab === 'overview' && (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: "Today's Revenue", val: `$${stats.revenue_today.toLocaleString()}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
                                        { label: "Active Orders", val: stats.active_orders, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
                                        { label: "Total Staff", val: stats.staff_count, icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" },
                                        { label: "Configured Tables", val: stats.table_count, icon: TableIcon, color: "text-purple-500", bg: "bg-purple-500/10" }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] space-y-4 hover:border-white/10 transition-all relative overflow-hidden group">
                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.bg, stat.color)}>
                                                <stat.icon size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{stat.label}</p>
                                                <p className="text-4xl font-black tracking-tighter italic leading-none mt-1">{stat.val}</p>
                                            </div>
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowUpRight size={20} className="text-white/20" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Financial Performance Chart (Simplified) */}
                                <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-8 lg:p-12 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-[120px]" />
                                    <div className="relative z-10 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Financial <span className="text-primary">Performance</span></h3>
                                            <div className="flex gap-2">
                                                <button className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">Monthly</button>
                                                <button className="px-4 py-2 bg-primary rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">Weekly</button>
                                            </div>
                                        </div>
                                        <div className="h-64 flex items-end gap-2 md:gap-4 px-2">
                                            {[40, 65, 45, 90, 75, 55, 80, 95, 70, 85, 100, 60].map((h, i) => (
                                                <div key={i} className="flex-1 bg-white/[0.03] rounded-t-2xl relative group">
                                                    <div 
                                                        className="absolute bottom-0 left-0 right-0 bg-primary/20 rounded-t-2xl group-hover:bg-primary transition-all duration-500" 
                                                        style={{ height: `${h}%` }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest px-2">
                                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'staff' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Add Staff Form */}
                                <div className="lg:col-span-1 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 space-y-8 h-fit sticky top-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                                            <UserPlus size={20} />
                                        </div>
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Recruit <span className="text-amber-500">Staff</span></h3>
                                    </div>
                                    <form onSubmit={handleAddUser} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Full Name</label>
                                            <input 
                                                value={userData.name}
                                                onChange={e => setUserData('name', e.target.value)}
                                                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-4 text-sm font-bold focus:border-amber-500 transition-all outline-none" 
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">System Email</label>
                                            <input 
                                                type="email"
                                                value={userData.email}
                                                onChange={e => setUserData('email', e.target.value)}
                                                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-4 text-sm font-bold focus:border-amber-500 transition-all outline-none" 
                                                placeholder="john@serveease.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Temporary Password</label>
                                            <input 
                                                type="password"
                                                value={userData.password}
                                                onChange={e => setUserData('password', e.target.value)}
                                                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-4 text-sm font-bold focus:border-amber-500 transition-all outline-none" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Operational Role</label>
                                            <select 
                                                value={userData.role}
                                                onChange={e => setUserData('role', e.target.value)}
                                                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-4 text-sm font-bold focus:border-amber-500 transition-all outline-none appearance-none"
                                            >
                                                <option value="waiter">Service Captain (Waiter)</option>
                                                <option value="kitchen">Kitchen Staff</option>
                                                <option value="chef">Executive Chef</option>
                                                <option value="manager">Restaurant Manager</option>
                                                <option value="admin">Super Admin</option>
                                            </select>
                                        </div>
                                        <button 
                                            disabled={userProcessing}
                                            className="w-full bg-amber-500 text-black p-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            {userProcessing ? 'Provisioning...' : 'Provision Account'}
                                        </button>
                                    </form>
                                </div>

                                {/* Staff List */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center justify-between bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <Users className="text-white/20" size={24} />
                                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Active <span className="text-white/40">Squad</span></h3>
                                        </div>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                            <input className="pl-12 pr-6 py-3 bg-black/40 border border-white/5 rounded-xl text-xs font-bold" placeholder="Find member..." />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {users.map(user => (
                                            <div key={user.id} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl flex items-center gap-6 group hover:border-amber-500/20 transition-all">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 font-black text-xl italic uppercase">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black uppercase italic tracking-tight truncate">{user.name}</h4>
                                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest truncate">{user.email}</p>
                                                    <span className={cn(
                                                        "inline-block mt-2 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest",
                                                        user.role === 'admin' ? "bg-red-500/10 text-red-500" : "bg-white/5 text-white/40"
                                                    )}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => deleteUser(user.id)}
                                                    className="p-3 text-white/10 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'menu' && (
                            <div className="space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <UtensilsCrossed className="text-primary" size={24} />
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Master <span className="text-primary">Catalog</span></h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {categories.map(cat => (
                                            <button key={cat} className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Product Name</th>
                                                <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Category</th>
                                                <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Price</th>
                                                <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Status</th>
                                                <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.slice((menuPage - 1) * MENU_PAGE_SIZE, menuPage * MENU_PAGE_SIZE).map(product => (
                                                <tr key={product.id} className="border-b border-white/[0.02] group hover:bg-white/[0.01] transition-colors">
                                                    <td className="p-6 font-black uppercase italic tracking-tight">{product.name}</td>
                                                    <td className="p-6 text-xs font-bold text-white/40 uppercase tracking-widest">{product.category}</td>
                                                    <td className="p-6 font-black text-primary italic tracking-tighter">${product.price}</td>
                                                    <td className="p-6">
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                            product.stock_status === 'instock' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                        )}>
                                                            {product.stock_status}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <button className="p-3 text-white/10 hover:text-primary transition-colors">
                                                            <Edit3 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {/* Pagination Controls */}
                                    <div className="p-6 border-t border-white/5 flex items-center justify-between bg-black/20">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                            Showing <span className="text-white">{(menuPage - 1) * MENU_PAGE_SIZE + 1}</span> to <span className="text-white">{Math.min(menuPage * MENU_PAGE_SIZE, products.length)}</span> of <span className="text-white">{products.length}</span> entries
                                        </p>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setMenuPage(p => Math.max(1, p - 1))}
                                                disabled={menuPage === 1}
                                                className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white disabled:opacity-20 transition-all"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                                                <span className="text-xs font-black text-primary">{menuPage}</span>
                                            </div>
                                            <button 
                                                onClick={() => setMenuPage(p => Math.min(Math.ceil(products.length / MENU_PAGE_SIZE), p + 1))}
                                                disabled={menuPage >= Math.ceil(products.length / MENU_PAGE_SIZE)}
                                                className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white disabled:opacity-20 transition-all"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tables' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Table Config Form */}
                                <div className="lg:col-span-1 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 space-y-8 h-fit sticky top-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500">
                                            <TableIcon size={20} />
                                        </div>
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Deploy <span className="text-purple-500">Table</span></h3>
                                    </div>
                                    <form onSubmit={handleAddTable} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Table Identifier</label>
                                            <input 
                                                value={tableData.table_num}
                                                onChange={e => setTableData('table_num', e.target.value)}
                                                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl p-4 text-sm font-bold focus:border-purple-500 transition-all outline-none" 
                                                placeholder="e.g. Table 05"
                                            />
                                            <p className="text-[9px] text-white/20 font-bold uppercase mt-2">A unique UUID will be generated automatically upon deployment.</p>
                                        </div>
                                        <button className="w-full bg-purple-500 text-white p-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                                            Deploy Now
                                        </button>
                                    </form>
                                </div>

                                {/* Table Grid with QRs */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {tables.slice((tablePage - 1) * TABLE_PAGE_SIZE, tablePage * TABLE_PAGE_SIZE).map(table => (
                                            <div key={table.id} className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 space-y-8 relative group hover:border-purple-500/20 transition-all shadow-2xl">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Station ID</p>
                                                        <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white mt-1">{table.table_num}</h4>
                                                    </div>
                                                    <button 
                                                        onClick={() => deleteTable(table.id)}
                                                        className="p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-center p-6 bg-white rounded-[2rem] shadow-inner">
                                                        <QRCodeComponent 
                                                            value={`${window.location.origin}/order/${table.uuid}`}
                                                            size={160}
                                                            level="H"
                                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                        />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between text-[9px] font-black text-white/20 uppercase tracking-widest">
                                                        <span>Signal Protocol</span>
                                                        <span className="text-purple-500">HTTPS Secure</span>
                                                    </div>
                                                    <p className="text-[9px] font-bold text-white/40 break-all bg-black/40 p-3 rounded-xl border border-white/5 uppercase tracking-tighter leading-relaxed">
                                                        UUID: {table.uuid}
                                                    </p>
                                                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                                                        <QrCodeIcon className="w-4 h-4" />
                                                        Download QR Packet
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Pagination for Tables */}
                                    <div className="flex items-center justify-between bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                            Page <span className="text-white">{tablePage}</span> of <span className="text-white">{Math.ceil(tables.length / TABLE_PAGE_SIZE)}</span>
                                        </p>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setTablePage(p => Math.max(1, p - 1))}
                                                disabled={tablePage === 1}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-20 transition-all"
                                            >
                                                <ChevronLeft size={14} />
                                                Prev
                                            </button>
                                            <button 
                                                onClick={() => setTablePage(p => Math.min(Math.ceil(tables.length / TABLE_PAGE_SIZE), p + 1))}
                                                disabled={tablePage >= Math.ceil(tables.length / TABLE_PAGE_SIZE)}
                                                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-purple-500 hover:bg-purple-500/30 disabled:opacity-20 transition-all"
                                            >
                                                Next
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </main>
        </div>
    );
}
