
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Navbar() {
  const pathname = usePathname();
  const logo = PlaceHolderImages.find(img => img.id === 'brand-logo');

  const navItems = [
    { href: '/', label: 'Caixa', icon: Zap },
    { href: '/movements', label: 'Movimentação', icon: ReceiptText },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 no-print">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-16 h-12 overflow-hidden rounded-xl bg-white p-1 border-2 border-accent/20 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(104,255,54,0.1)]">
            {logo && (
              <Image 
                src={logo.imageUrl} 
                alt={logo.description} 
                fill 
                className="object-contain"
                data-ai-hint={logo.imageHint}
              />
            )}
          </div>
          <div className="flex flex-col -space-y-1">
             <span className="text-accent font-black text-xl italic tracking-tighter">AÇAÍ</span>
             <span className="text-[10px] text-white font-bold uppercase tracking-widest">DELÍCIAS DO PARÁ</span>
          </div>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
                  isActive 
                    ? "text-accent bg-accent/10 border border-accent/30 shadow-[0_0_10px_rgba(104,255,54,0.1)]" 
                    : "text-muted-foreground hover:text-white hover:bg-muted"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "animate-pulse")} />
                <span className="hidden sm:inline uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
