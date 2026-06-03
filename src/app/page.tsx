"use client";

import { ActionGrid } from '@/components/cashier/ActionGrid';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CashierPage() {
  const logo = PlaceHolderImages.find(img => img.id === 'brand-logo');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Top Branding Section matching the image */}
      <div className="relative bg-card/40 p-8 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-8">
            {/* Large Prominent Logo Container */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden bg-white p-2 border-4 border-primary/30 shadow-[0_0_30px_rgba(147,51,234,0.3)]">
              {logo && (
                <Image 
                  src={logo.imageUrl} 
                  alt="Logo Açaí Delícias do Pará" 
                  fill
                  className="object-contain p-2"
                  data-ai-hint={logo.imageHint}
                />
              )}
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex flex-col leading-none">
                <span className="text-3xl md:text-4xl font-headline font-black text-white italic uppercase tracking-tighter">
                  AÇAÍ
                </span>
                <span className="text-4xl md:text-6xl font-headline font-black text-accent italic uppercase tracking-tighter -mt-1">
                  DELÍCIAS <span className="text-white">DO</span> PARÁ
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm md:text-base font-medium tracking-wide">
                Sistema de Vendas e Controle de Caixa
              </p>
            </div>
          </div>
          
          {/* Status Indicator exactly as in image */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 font-bold">STATUS</span>
            <div className="bg-black/40 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-inner">
              <p className="text-accent font-black text-lg tracking-widest">OPERACIONAL</p>
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_15px_#4ade80]" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <ActionGrid />
      </div>
      
      <div className="mt-12 text-center text-muted-foreground/30 text-[10px] font-bold uppercase tracking-[0.3em]">
        Açaí Delícias do Pará — Professional Management System
      </div>
    </div>
  );
}
