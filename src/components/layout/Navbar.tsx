"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Caixa', icon: Zap },
    { href: '/movements', label: 'Movimentação', icon: ReceiptText },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 no-print">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-white">
            Açaí<span className="text-primary">Lume</span> <span className="text-accent">Pro</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-muted",
                  isActive 
                    ? "text-accent bg-accent/10 border-b-2 border-accent rounded-b-none" 
                    : "text-muted-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "animate-pulse")} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}