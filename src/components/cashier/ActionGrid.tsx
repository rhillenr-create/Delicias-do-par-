"use client";

import { MovementType } from '@/lib/types';
import { 
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
  { type: 'PIX', label: 'PIX', icon: Smartphone, color: 'bg-[#9333EA]' }, // Purple
  { type: 'CREDITO', label: 'CARTÃO CRÉDITO', icon: CreditCard, color: 'bg-[#3b82f6]' }, // Blue
  { type: 'DEBITO', label: 'CARTÃO DÉBITO', icon: CreditCard, color: 'bg-[#1d4ed8]' }, // Dark Blue
  { type: 'DELIVERY', label: 'DELIVERY', icon: Truck, color: 'bg-[#A855F7]' }, // Lighter Purple
  { type: 'DINHEIRO', label: 'DINHEIRO', icon: Banknote, color: 'bg-[#4ade80]' }, // Lime Green
  { type: 'WITHDRAWAL', label: 'SANGRIA', icon: ArrowUpCircle, color: 'bg-[#7f1d1d]' }, // Maroon
  { type: 'DESPESAS', label: 'DESPESAS', icon: ArrowDownCircle, color: 'bg-[#ea580c]' }, // Orange
];

export function ActionGrid() {
  const [selectedType, setSelectedType] = useState<MovementType | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.type}
            onClick={() => setSelectedType(action.type)}
            className={`${action.color} relative overflow-hidden group h-40 md:h-44 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all active:scale-95 hover:brightness-110 shadow-xl border border-white/10`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon className="w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-md" />
            <span className="font-headline font-bold text-xs md:text-sm text-white tracking-widest uppercase text-center px-2">
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
