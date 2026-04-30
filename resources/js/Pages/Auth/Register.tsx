import React, { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout 
            title="Create User" 
            subtitle="Admin-only: Initialize a new staff or manager profile."
        >
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1">
                    <InputLabel htmlFor="name" value="Full Name" className="text-slate-900 font-bold ml-1 text-[10px] uppercase tracking-widest" />
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <User size={16} />
                        </div>
                        <TextInput
                            id="name"
                            name="name"
                            placeholder="Employee Name"
                            value={data.name}
                            className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1 ml-1" />
                </div>

                <div className="space-y-1">
                    <InputLabel htmlFor="email" value="Email" className="text-slate-900 font-bold ml-1 text-[10px] uppercase tracking-widest" />
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <Mail size={16} />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            placeholder="staff@serveease.com"
                            value={data.email}
                            className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1 ml-1" />
                </div>

                <div className="space-y-1">
                    <InputLabel htmlFor="password" value="Password" className="text-slate-900 font-bold ml-1 text-[10px] uppercase tracking-widest" />
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <Lock size={16} />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={data.password}
                            className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1 ml-1" />
                </div>

                <div className="space-y-1">
                    <InputLabel htmlFor="password_confirmation" value="Confirm" className="text-slate-900 font-bold ml-1 text-[10px] uppercase tracking-widest" />
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                            <CheckCircle size={16} />
                        </div>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            placeholder="••••••••"
                            value={data.password_confirmation}
                            className="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1 ml-1" />
                </div>

                <div className="pt-6">
                    <PrimaryButton 
                        className="w-full justify-center gap-2 rounded-2xl bg-blue-600 py-5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50" 
                        disabled={processing}
                    >
                        Register Profile
                        <ArrowRight size={18} />
                    </PrimaryButton>
                </div>

                <div className="text-center pt-6">
                    <Link 
                        href={route('login')} 
                        className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                    >
                        Return to Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
