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

const ACTIONS: { type: MovementType; label: string; icon: any; color: string; shadow: string }[] = [
  { type: 'PIX', label: 'PIX', icon: Smartphone, color: 'bg-[#9333EA]', shadow: 'shadow-purple-500/20' },
  { type: 'CREDITO', label: 'CARTÃO CRÉDITO', icon: CreditCard, color: 'bg-[#3b82f6]', shadow: 'shadow-blue-500/20' },
  { type: 'DEBITO', label: 'CARTÃO DÉBITO', icon: CreditCard, color: 'bg-[#1d4ed8]', shadow: 'shadow-blue-700/20' },
  { type: 'DELIVERY', label: 'DELIVERY', icon: Truck, color: 'bg-[#A855F7]', shadow: 'shadow-purple-400/20' },
  { type: 'DINHEIRO', label: 'DINHEIRO', icon: Banknote, color: 'bg-[#4ade80]', shadow: 'shadow-green-500/20' },
  { type: 'WITHDRAWAL', label: 'SANGRIA', icon: ArrowUpCircle, color: 'bg-[#7f1d1d]', shadow: 'shadow-red-900/20' },
  { type: 'DESPESAS', label: 'DESPESAS', icon: ArrowDownCircle, color: 'bg-[#ea580c]', shadow: 'shadow-orange-600/20' },
];

export function ActionGrid() {
  const [selectedType, setSelectedType] = useState<MovementType | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8 max-w-6xl mx-auto px-2">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.type}
            onClick={() => setSelectedType(action.type)}
            className={`${action.color} ${action.shadow} relative overflow-hidden group h-36 md:h-44 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 md:gap-5 transition-all active:scale-95 hover:scale-[1.03] hover:brightness-110 shadow-2xl border-t-2 border-white/20`}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-50" />
            
            {/* Inner Shadow for Depth */}
            <div className="absolute inset-0 shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)]" />
            
            <div className="relative z-10 p-3 md:p-4 rounded-3xl bg-black/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-8 h-8 md:w-12 md:h-12 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" />
            </div>
            
            <span className="relative z-10 font-headline font-black text-[9px] md:text-xs text-white tracking-[0.2em] uppercase text-center px-4 leading-tight">
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