"use client";

import { ActionGrid } from '@/components/cashier/ActionGrid';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getBrandSettings } from '@/lib/db';
import { ImageIcon } from 'lucide-react';

export default function CashierPage() {
  const [brand, setBrand] = useState({ name: '', logoUrl: '' });

  useEffect(() => {
    const loadBrand = () => setBrand(getBrandSettings());
    loadBrand();
    window.addEventListener('brandUpdated', loadBrand);
    return () => window.removeEventListener('brandUpdated', loadBrand);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="relative bg-card/40 p-8 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40 md:w-64 md:h-52 rounded-3xl overflow-hidden bg-background border-4 border-accent shadow-[0_0_30px_rgba(104,255,54,0.3)] p-3 flex items-center justify-center">
              {brand.logoUrl ? (
                <Image 
                  src={brand.logoUrl} 
                  alt="Brand Logo" 
                  fill 
                  className="object-contain"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-16 h-16 text-muted-foreground opacity-20" />
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Adicione seu logo</span>
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase line-clamp-2">
                {brand.name || 'SISTEMA'}
              </h2>
              <div className="h-2 bg-accent w-32 mt-4 rounded-full shadow-[0_0_15px_#4ade80]" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 font-bold">ESTADO DO CAIXA</span>
            <div className="bg-black/40 border border-white/10 px-8 py-5 rounded-2xl flex items-center gap-4 shadow-inner">
              <p className="text-accent font-black text-xl tracking-widest uppercase">Operacional</p>
              <div className="w-4 h-4 rounded-full bg-accent animate-pulse shadow-[0_0_20px_#4ade80]" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <ActionGrid />
      </div>
    </div>
  );
}
