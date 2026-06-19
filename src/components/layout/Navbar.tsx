
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Zap, Wifi, WifiOff, ShoppingBag, UtensilsCrossed, PackageSearch, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

const DEFAULT_LOGO = "https://gitlab.com/rhillenr-create/teste-iptv/-/raw/6a0cd7fe4b63fecad5f17a1eca98207bff5faa39/delicias_do_para.png";

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
    { href: '/menu', label: 'Cardápio', icon: ShoppingBag },
    { href: '/kitchen', label: 'Cozinha', icon: UtensilsCrossed },
    { href: '/admin/orders', label: 'Pedidos', icon: PackageSearch },
    { href: '/movements', label: 'Histórico', icon: ReceiptText },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/settings', label: 'Ajustes', icon: SettingsIcon },
  ];

  if (!mounted) return null;

  const currentLogo = brand?.logoUrl || DEFAULT_LOGO;

  return (
    <nav className="border-b bg-card/60 backdrop-blur-2xl sticky top-0 z-50 no-print border-white/5">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-14 h-12 overflow-hidden rounded-xl bg-background p-1 border border-accent/20 shadow-lg group-hover:scale-105 transition-all flex items-center justify-center">
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
          <span className="hidden lg:inline-block text-lg font-headline font-black text-white uppercase tracking-tighter whitespace-nowrap neon-text">
            AÇAITERIA <span className="text-accent">DELICIAS</span>
          </span>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-bold transition-all',
                  isActive
                    ? 'text-accent bg-accent/10 border border-accent/30 shadow-[0_0_15px_rgba(104,255,54,0.1)]'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive && 'animate-pulse')} />
                <span className="hidden xl:inline uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
