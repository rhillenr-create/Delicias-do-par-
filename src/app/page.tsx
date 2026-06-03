
"use client";

import { ActionGrid } from '@/components/cashier/ActionGrid';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CashierPage() {
  const logo = PlaceHolderImages.find(img => img.id === 'brand-logo');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Top Branding Section com Logo Oficial */}
      <div className="relative bg-card/40 p-8 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32 md:w-56 md:h-44 rounded-3xl overflow-hidden bg-white border-4 border-accent/20 p-2 shadow-2xl">
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
            
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">
                AÇAÍ <span className="text-accent">DELÍCIAS</span>
              </h2>
              <p className="text-xl md:text-2xl font-bold text-white/80 uppercase tracking-[0.2em] -mt-1">
                DO PARÁ
              </p>
              <div className="h-1 bg-accent w-24 mt-4 rounded-full shadow-[0_0_10px_#4ade80]" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 font-bold">SISTEMA</span>
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
      
      <div className="mt-12 text-center text-muted-foreground/10 text-[10px] font-bold uppercase tracking-[0.3em]">
        Professional Cashier Management System
      </div>
    </div>
  );
}
