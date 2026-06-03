"use client";

import { MovementType } from '@/lib/types';
import { 
  Zap, 
  CreditCard, 
  Smartphone, 
  Truck, 
  Banknote, 
  ArrowDownCircle, 
  ArrowUpCircle 
} from 'lucide-react';
import { MovementDialog } from './MovementDialog';
import { useState } from 'react';

const ACTIONS: { type: MovementType; label: string; icon: any; color: string }[] = [
  { type: 'PIX', label: 'PIX', icon: Smartphone, color: 'bg-primary' },
  { type: 'CREDITO', label: 'Cartão Crédito', icon: CreditCard, color: 'bg-indigo-600' },
  { type: 'DEBITO', label: 'Cartão Débito', icon: CreditCard, color: 'bg-indigo-800' },
  { type: 'DELIVERY', label: 'Delivery', icon: Truck, color: 'bg-primary' },
  { type: 'DINHEIRO', label: 'Dinheiro', icon: Banknote, color: 'bg-accent' },
  { type: 'WITHDRAWAL', label: 'Sangria', icon: ArrowUpCircle, color: 'bg-destructive' },
  { type: 'DESPESAS', label: 'Despesas', icon: ArrowDownCircle, color: 'bg-orange-600' },
];

export function ActionGrid() {
  const [selectedType, setSelectedType] = useState<MovementType | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.type}
            onClick={() => setSelectedType(action.type)}
            className={`${action.color} relative overflow-hidden group h-32 md:h-40 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 hover:brightness-110 shadow-lg border border-white/10`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-md" />
            <span className="font-headline font-bold text-sm md:text-lg text-white tracking-wide uppercase">
              {action.label}
            </span>
          </button>
        );
      })}

      <MovementDialog 
        type={selectedType} 
        onClose={() => setSelectedType(null)} 
      />
    </div>
  );
}
