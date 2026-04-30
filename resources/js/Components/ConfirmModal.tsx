import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

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

    const typeClasses = {
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white',
        info: 'bg-primary hover:bg-primary/90 text-white'
    };

    const iconClasses = {
        danger: 'text-red-600 bg-red-50',
        warning: 'text-amber-500 bg-amber-50',
        info: 'text-primary bg-primary/10'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${iconClasses[type]}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <button 
                            onClick={onCancel}
                            className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{message}</p>
                </div>

                <div className="flex items-center gap-3 p-6 bg-secondary/30">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-foreground bg-white border border-border hover:bg-secondary transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm ${typeClasses[type]}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
