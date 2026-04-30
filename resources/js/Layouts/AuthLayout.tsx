import { UtensilsCrossed, Sparkles, ChefHat, Zap, ShieldCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';

export default function AuthLayout({ children, title, subtitle }: PropsWithChildren<{ title: string; subtitle?: string }>) {
    return (
        <div className="fixed inset-0 flex h-screen w-full bg-white font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
            {/* Left Side: Modern Professional Design */}
            <div className="relative hidden w-1/2 flex-col justify-between bg-blue-600 p-12 lg:flex overflow-hidden">
                {/* Decorative Background Patterns */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-white/10 blur-[100px]"></div>
                    <div className="absolute -right-20 bottom-20 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[80px]"></div>
                    <div className="absolute top-1/4 left-1/3 h-1 w-1 bg-white ring-[100px] ring-white/5 rounded-full"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl">
                            <UtensilsCrossed className="text-blue-600" size={28} />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white uppercase italic">ServeEase</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-50 ring-1 ring-white/20 mb-8 backdrop-blur-md">
                        <Sparkles size={14} className="text-blue-200" />
                        <span>The Modern Kitchen Standard</span>
                    </div>
                    
                    <h2 className="text-5xl font-extrabold leading-[1.1] text-white">
                        Precision Service. <br />
                        <span className="text-blue-200">Intelligent Dining.</span>
                    </h2>
                    
                    <p className="mt-8 text-lg text-blue-100 leading-relaxed font-medium">
                        Experience the ecosystem designed for high-performance hospitality. Seamlessly manage inventory, staff requests, and customer orders in a unified cloud environment.
                    </p>

                    <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-12">
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-white/10 p-2 ring-1 ring-white/10">
                                <Zap size={18} className="text-blue-200" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Instant Sync</h4>
                                <p className="text-xs text-blue-200 mt-0.5">Real-time KDS updates</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-white/10 p-2 ring-1 ring-white/10">
                                <ShieldCheck size={18} className="text-blue-200" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Secure Data</h4>
                                <p className="text-xs text-blue-200 mt-0.5">Full audit compliance</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/60">
                        &copy; 2024 ServeEase Global. All Rights Reserved.
                    </p>
                    <div className="flex gap-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-200"></div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Forms */}
            <div className="flex w-full flex-col bg-white lg:w-1/2 overflow-y-auto">
                <div className="flex flex-1 flex-col items-center justify-center p-8 lg:p-24">
                    <div className="w-full max-w-md space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black tracking-tight text-slate-900">{title}</h1>
                            {subtitle && (
                                <p className="text-base text-slate-500 font-medium leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        <div className="relative">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
