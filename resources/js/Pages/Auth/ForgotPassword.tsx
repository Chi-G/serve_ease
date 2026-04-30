import React, { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout 
            title="Reset Password" 
            subtitle="Enter your official email to receive recovery instructions."
        >
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-8 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-600 ring-1 ring-emerald-600/10">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-8">
                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="Official Email" className="text-slate-900 font-bold ml-1 text-xs uppercase tracking-widest" />
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
                            className="block w-full pl-12 pr-4 py-4 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2 ml-1" />
                </div>

                <div className="space-y-4">
                    <PrimaryButton 
                        className="w-full justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50" 
                        disabled={processing}
                    >
                        Send Reset Link
                        <Send size={18} />
                    </PrimaryButton>

                    <Link
                        href={route('login')}
                        className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors group uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Back to Login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
