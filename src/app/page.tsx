"use client";

import { ActionGrid } from '@/components/cashier/ActionGrid';
import { Image as ImageIcon } from 'lucide-react';

export default function CashierPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Top Branding Section com Espaço para Imagem Personalizada */}
      <div className="relative bg-card/40 p-8 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-8">
            {/* Espaço para Imagem Personalizada Grande */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden bg-muted/10 border-4 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 shadow-inner">
              <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
              <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest text-center px-4">
                Sua Imagem Personalizada Aqui
              </p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="h-1 bg-muted/20 w-32 mb-4 rounded-full" />
              <div className="h-12 bg-muted/10 w-64 md:w-80 rounded-2xl mb-2" />
              <div className="h-4 bg-muted/5 w-48 rounded-lg" />
            </div>
          </div>
          
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
      
      <div className="mt-12 text-center text-muted-foreground/10 text-[10px] font-bold uppercase tracking-[0.3em]">
        Professional Cashier Management System
      </div>
    </div>
  );
}
