'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Zap, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

const DEFAULT_LOGO = "https://gitlab.com/rhillenr-create/teste-iptv/-/raw/main/delicias_do_para.png";

export function Navbar() {
  const pathname = usePathname();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  const brandRef = useMemo(() => (db ? doc(db, 'settings', 'brand') : null), [db]);
  const { data: brand } = useDoc<any>(brandRef);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const navItems = [
    { href: '/', label: 'Caixa', icon: Zap },
    { href: '/movements', label: 'Movimentação', icon: ReceiptText },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  if (!mounted) return null;

  const currentLogo = brand?.logoUrl || DEFAULT_LOGO;

  return (
    <nav className="border-b bg-card/60 backdrop-blur-2xl sticky top-0 z-50 no-print border-white/5">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-4 group shrink-0">
            <div className="relative w-16 h-14 md:w-20 md:h-16 overflow-hidden rounded-2xl bg-background p-1 border-2 border-accent shadow-[0_0_20px_rgba(104,255,54,0.15)] group-hover:scale-105 transition-all flex items-center justify-center">
              <Image
                src={currentLogo}
                alt="Logo"
                fill
                className="object-contain"
                unoptimized
                data-ai-hint="acai brand"
              />
            </div>
          </Link>
          <span className="hidden md:inline-block text-xl font-headline font-black text-white uppercase tracking-tighter whitespace-nowrap neon-text">
            AÇAITERIA <span className="text-accent">DELICIAS DO PARA</span>
          </span>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-full text-[10px] md:text-xs font-bold transition-all',
                  isActive
                    ? 'text-accent bg-accent/10 border border-accent/30 shadow-[0_0_15px_rgba(104,255,54,0.1)]'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive && 'animate-pulse')} />
                <span className="hidden sm:inline uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
          
          <div className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-full text-[9px] md:text-[10px] font-black tracking-widest border transition-all",
            isOnline 
              ? "text-accent bg-accent/5 border-accent/20" 
              : "text-destructive bg-destructive/5 border-destructive/20"
          )}>
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">SISTEMA ONLINE</span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">OFFLINE</span>
                <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}