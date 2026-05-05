import React from 'react';
import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    type = 'info'
}) => {
    if (!isOpen) return null;

    const typeConfig = {
        danger: {
            button: 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20',
            icon: 'text-red-500 bg-red-500/10',
            iconComp: AlertTriangle,
            border: 'border-red-500/20'
        },
        warning: {
            button: 'bg-[#FF5C00] hover:bg-[#FF5C00]/90 text-white shadow-[#FF5C00]/20',
            icon: 'text-[#FF5C00] bg-[#FF5C00]/10',
            iconComp: AlertCircle,
            border: 'border-[#FF5C00]/20'
        },
        info: {
            button: 'bg-white hover:bg-white/90 text-black shadow-white/10',
            icon: 'text-white bg-white/10',
            iconComp: Info,
            border: 'border-white/20'
        }
    };

    const config = typeConfig[type];
    const Icon = config.iconComp;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className={cn(
                "bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300",
                config.border
            )}>
                <div className="p-8">
                    <div className="flex items-start justify-between mb-8">
                        <div className={cn("p-4 rounded-2xl", config.icon)}>
                            <Icon className="w-8 h-8" />
                        </div>
                        <button 
                            onClick={onCancel}
                            className="p-3 text-white/20 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <h3 className="text-3xl font-black italic tracking-tighter text-white mb-4 uppercase leading-none">
                        {title}
                    </h3>
                    <p className="text-white/40 font-bold text-sm leading-relaxed tracking-tight uppercase">
                        {message}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 p-8 pt-0">
                    <button
                        onClick={onCancel}
                        className="w-full sm:flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white/40 bg-white/5 hover:bg-white/10 hover:text-white border border-white/5 transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={cn(
                            "w-full sm:flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95",
                            config.button
                        )}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
