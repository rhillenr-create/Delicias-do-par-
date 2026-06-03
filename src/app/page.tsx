"use client";

import { ActionGrid } from '@/components/cashier/ActionGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

export default function CashierPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-white flex items-center gap-3">
            <Zap className="text-accent w-8 h-8" />
            Frente de Caixa
          </h1>
          <p className="text-muted-foreground mt-1">Selecione uma modalidade para iniciar o registro.</p>
        </div>
        
        <div className="bg-card border border-primary/20 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Status do Sistema</p>
            <p className="text-accent font-bold">Operacional (Online)</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#39FF14]" />
        </div>
      </div>

      <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-0">
          <ActionGrid />
        </CardContent>
      </Card>
      
      <div className="mt-12 text-center text-muted-foreground text-sm opacity-50">
        AçaíLume Pro v1.0 • Made with Neon Precision
      </div>
    </div>
  );
}