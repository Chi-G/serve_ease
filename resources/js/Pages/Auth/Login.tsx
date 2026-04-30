import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { FormEvent, useState } from 'react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout 
            title="Account Login" 
            subtitle="Access the ServeEase control center with your credentials."
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-8 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-600 ring-1 ring-emerald-600/10">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="Email Address" className="text-slate-900 font-bold ml-1 text-xs uppercase tracking-widest" />
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <Mail size={18} />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            placeholder="admin@serveease.com"
                            value={data.email}
                            className="block w-full pl-12 pr-4 py-4 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all hover:border-slate-300"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2 ml-1" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <InputLabel htmlFor="password" value="Password" className="text-slate-900 font-bold text-xs uppercase tracking-widest" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Forgot?
                            </Link>
                        )}
                    </div>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <Lock size={18} />
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="••••••••"
                            value={data.password}
                            className="block w-full pl-12 pr-12 py-4 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all hover:border-slate-300"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div className="flex items-center px-1">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded-md border-slate-300 text-blue-600 shadow-sm focus:ring-blue-500"
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                            Keep me logged in
                        </span>
                    </label>
                </div>

                <div className="pt-4">
                    <PrimaryButton 
                        className="w-full justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-sm font-black uppercase tracking-[0.1em] text-white shadow-2xl shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50" 
                        disabled={processing}
                    >
                        Enter Dashboard
                        <ArrowRight size={20} />
                    </PrimaryButton>
                </div>

                <div className="text-center pt-8 border-t border-slate-100">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
                        Restricted Access Area <br />
                        <span className="text-slate-300 font-medium normal-case tracking-normal">Authorization is centrally managed by management.</span>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}
