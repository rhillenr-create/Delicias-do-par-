
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Zap, Settings, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Navbar() {
  const pathname = usePathname();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  
  const brandRef = useMemo(() => (db ? doc(db, 'settings', 'brand') : null), [db]);
  const { data: brand } = useDoc<any>(brandRef);

  const defaultLogo = useMemo(() => 
    PlaceHolderImages.find(img => img.id === 'brand-logo')?.imageUrl || '', 
  []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/', label: 'Caixa', icon: Zap },
    { href: '/movements', label: 'Movimentação', icon: ReceiptText },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/settings', label: 'Ajustes', icon: Settings },
  ];

  if (!mounted) return null;

  return (
    <nav className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50 no-print border-white/5">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-20 h-16 overflow-hidden rounded-xl bg-background p-1 border-2 border-accent shadow-[0_0_15px_rgba(104,255,54,0.2)] group-hover:scale-105 transition-all flex items-center justify-center">
            <Image
              src={brand?.logoUrl || defaultLogo}
              alt={brand?.name || 'Logo'}
              fill
              className="object-contain"
              unoptimized
              data-ai-hint="acai logo"
            />
          </div>
        </Link>

        <div className="flex items-center gap-1 md:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all',
                  isActive
                    ? 'text-accent bg-accent/10 border border-accent/40 shadow-[0_0_15px_rgba(104,255,54,0.1)]'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive && 'animate-pulse')} />
                <span className="hidden sm:inline uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
