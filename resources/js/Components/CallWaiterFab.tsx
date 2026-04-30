import React, { useState } from 'react';
import { BellRing, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface CallWaiterFabProps {
  tableId: string;
}

export default function CallWaiterFab({ tableId }: CallWaiterFabProps) {
    const [status, setStatus] = useState<'idle' | 'calling' | 'sent'>('idle');

    const handleCall = async () => {
        setStatus('calling');
        
        try {
            await axios.post('/api/service-requests', {
                table_id: tableId,
                request_type: 'waiter_call'
            });
            setStatus('sent');
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('Failed to call waiter:', error);
            setStatus('idle');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <button
                onClick={handleCall}
                disabled={status !== 'idle'}
                className={cn(
                    "relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95 group",
                    status === 'idle' && "bg-[#FF5C00] text-white hover:opacity-90",
                    status === 'calling' && "bg-muted text-white cursor-wait",
                    status === 'sent' && "bg-green-500 text-white"
                )}
            >
                {status === 'idle' && (
                    <span className="absolute inset-0 rounded-full bg-[#FF5C00]/40 animate-ping -z-10" />
                )}

                {status === 'idle' && (
                    <>
                        <BellRing className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        <span className="absolute -top-12 right-0 bg-card border border-border text-foreground text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            Call Waiter
                        </span>
                    </>
                )}

                {status === 'calling' && (
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                    </div>
                )}

                {status === 'sent' && (
                    <Check className="w-6 h-6 animate-in zoom-in duration-300" />
                )}
            </button>
            
            {status === 'sent' && (
                <div className="absolute -top-12 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-lg whitespace-nowrap animate-in slide-in-from-bottom-2">
                    Waiter is coming!
                </div>
            )}
        </div>
    );
}
