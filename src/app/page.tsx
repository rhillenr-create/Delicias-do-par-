
"use client";

import { ActionGrid } from '@/components/cashier/ActionGrid';
import Image from 'next/image';
import { useMemo } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ImageIcon } from 'lucide-react';

export default function CashierPage() {
  const db = useFirestore();
  const brandRef = useMemo(() => db ? doc(db, 'settings', 'brand') : null, [db]);
  const { data: brand } = useDoc<any>(brandRef);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="relative bg-card/40 p-8 md:p-12 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 w-full">
          <div className="relative w-48 h-48 md:w-60 md:h-52 rounded-3xl overflow-hidden bg-background border-4 border-accent shadow-[0_0_30px_rgba(104,255,54,0.3)] p-3 flex items-center justify-center shrink-0">
            {brand?.logoUrl ? (
              <Image 
                src={brand.logoUrl} 
                alt="Brand Logo" 
                fill 
                className="object-contain p-2"
                priority
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <ImageIcon className="w-12 h-12 text-muted-foreground opacity-20" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center">Adicione seu logo</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
            <span className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 font-black">SISTEMA DE GESTÃO</span>
            <div className="bg-black/60 border border-white/10 px-8 py-5 rounded-3xl flex items-center gap-6 shadow-2xl backdrop-blur-md">
              <p className="text-accent font-black text-2xl tracking-[0.2em] uppercase">Operacional</p>
              <div className="w-5 h-5 rounded-full bg-accent animate-pulse shadow-[0_0_25px_#4ade80]" />
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
