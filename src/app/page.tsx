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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="relative bg-card/40 p-10 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col items-center justify-center gap-10 relative z-10">
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-2xl h-[300px] md:h-[500px] rounded-[2rem] overflow-hidden bg-background/50 border-4 border-accent shadow-[0_0_50px_rgba(104,255,54,0.2)] p-6 flex items-center justify-center">
              {brand.logoUrl ? (
                <Image 
                  src={brand.logoUrl} 
                  alt="Brand Logo" 
                  fill 
                  className="object-contain p-4"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <ImageIcon className="w-24 h-24 text-muted-foreground opacity-20" />
                  <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Sua Logo Aqui</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground/60 font-black">SISTEMA DE GESTÃO</span>
            <div className="bg-black/60 border border-white/10 px-10 py-6 rounded-3xl flex items-center gap-6 shadow-2xl backdrop-blur-md">
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
