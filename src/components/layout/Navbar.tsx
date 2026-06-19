
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Zap, 
  ShoppingBag, 
  UtensilsCrossed, 
  PackageSearch, 
  Settings as SettingsIcon,
  ArrowLeftRight,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { useDoc, useFirestore, useUser, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';

const DEFAULT_LOGO = "https://gitlab.com/rhillenr-create/teste-iptv/-/raw/main/delicias_do_para.png";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const db = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  // Só busca dados se houver um usuário autenticado (evita erros de permissão na tela de login)
  const brandRef = useMemo(() => (db && user ? doc(db, 'settings', 'brand') : null), [db, user]);
  const { data: brand } = useDoc<any>(brandRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const cashierItems = [
    { href: '/', label: 'Caixa', icon: Zap },
    { href: '/movements', label: 'Histórico', icon: ReceiptText },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/settings', label: 'Ajustes', icon: SettingsIcon },
  ];

  const deliveryItems = [
    { href: '/admin/orders', label: 'Pedidos', icon: PackageSearch },
    { href: '/kitchen', label: 'Cozinha', icon: UtensilsCrossed },
    { href: '/admin/products', label: 'Cardápio/Produtos', icon: ShoppingBag },
  ];

  if (!mounted) return null;

  const isDeliveryPath = pathname.startsWith('/admin') || pathname === '/kitchen';
  const isMenuPath = pathname === '/menu';
  const isLoginPath = pathname === '/login';
  
  if (isMenuPath || isLoginPath) {
    return (
      <nav className="border-b bg-card/60 backdrop-blur-2xl sticky top-0 z-50 no-print border-white/5">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href={isMenuPath ? "#" : "/"} className="relative w-16 h-14">
            <Image
              src={brand?.logoUrl || DEFAULT_LOGO}
              alt="Logo"
              fill
              className="object-contain"
              unoptimized
            />
          </Link>
          {isMenuPath && (
             <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">Cardápio Online</span>
               <span className="text-[8px] text-white/40 uppercase tracking-tighter">Delícias do Pará</span>
             </div>
          )}
        </div>
      </nav>
    );
  }

  const currentItems = isDeliveryPath ? deliveryItems : cashierItems;
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
              />
            </div>
          </Link>
          <div className="hidden lg:flex flex-col">
            <span className="text-sm font-black text-white uppercase tracking-tighter leading-none">
              {brand?.name || 'AÇAITERIA'}
            </span>
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
              {isDeliveryPath ? 'SISTEMA DELIVERY' : 'GESTÃO DE CAIXA'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {currentItems.map((item) => {
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
          
          <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />
          
          <div className="flex items-center gap-2">
            <Link href={isDeliveryPath ? '/' : '/admin/orders'}>
              <Button variant="ghost" className="rounded-full text-[10px] font-black uppercase tracking-widest gap-2 text-white/40 hover:text-accent p-2 md:px-4">
                <ArrowLeftRight className="w-4 h-4" />
                <span className="hidden md:inline">
                  {isDeliveryPath ? 'IR PARA CAIXA' : 'IR PARA DELIVERY'}
                </span>
              </Button>
            </Link>

            {user && !user.isAnonymous && (
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="rounded-full w-10 h-10 p-0 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
