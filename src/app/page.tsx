
"use client";

import { ActionGrid } from '@/components/cashier/ActionGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CashierPage() {
  const logo = PlaceHolderImages.find(img => img.id === 'brand-logo');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30 p-6 rounded-3xl border border-muted">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white p-2 border-4 border-primary shadow-2xl neon-glow">
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
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-white flex items-center gap-3 italic uppercase tracking-tighter">
              Açaí <span className="text-accent">Delícias do Pará</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Sistema de Vendas e Controle de Caixa</p>
          </div>
        </div>
        
        <div className="bg-background border border-primary/20 px-8 py-5 rounded-2xl flex items-center gap-4 shadow-xl self-start md:self-center">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Status</p>
            <p className="text-accent font-bold text-lg">OPERACIONAL</p>
          </div>
          <div className="w-4 h-4 rounded-full bg-accent animate-pulse shadow-[0_0_15px_#39FF14]" />
        </div>
      </div>

      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-0">
          <ActionGrid />
        </CardContent>
      </Card>
      
      <div className="mt-12 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-30">
        Açaí Delícias do Pará • Professional Management System
      </div>
    </div>
  );
}
