
'use client';

import { ActionGrid } from '@/components/cashier/ActionGrid';
import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export default function CashierPage() {
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="relative bg-card/40 p-8 md:p-10 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />

        <div className="flex flex-col items-center justify-center relative z-10 w-full">
          <div className="bg-black/60 border border-white/10 px-8 py-4 rounded-3xl flex items-center gap-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
              {isOnline ? (
                <>
                  <span className="text-sm font-black text-accent tracking-widest uppercase">SISTEMA ONLINE</span>
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_15px_#4ade80]" />
                  <Wifi className="w-5 h-5 text-accent" />
                </>
              ) : (
                <>
                  <span className="text-sm font-black text-destructive tracking-widest uppercase">SISTEMA OFFLINE</span>
                  <div className="w-3 h-3 rounded-full bg-destructive animate-pulse shadow-[0_0_15px_#ef4444]" />
                  <WifiOff className="w-5 h-5 text-destructive" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <ActionGrid />
      </div>
    </div>
  );
}
