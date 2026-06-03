
"use client";

import { useMemo } from 'react';
import { Movement } from '@/lib/types';
import { useCollection, useDoc, useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Smartphone, 
  Truck, 
  Banknote, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Printer,
  ImageIcon
} from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const db = useFirestore();
  
  const movementsRef = useMemo(() => db ? collection(db, 'movements') : null, [db]);
  const { data: movements = [] } = useCollection<Movement>(movementsRef);

  const brandRef = useMemo(() => db ? doc(db, 'settings', 'brand') : null, [db]);
  const { data: brand = { name: '', logoUrl: '' } } = useDoc<any>(brandRef);

  const stats = useMemo(() => {
    const s = { PIX: 0, CREDITO: 0, DEBITO: 0, DELIVERY: 0, DINHEIRO: 0, DESPESAS: 0, WITHDRAWAL: 0 };
    movements.forEach(m => { 
      if (s.hasOwnProperty(m.type)) {
        s[m.type as keyof typeof s] += m.value; 
      }
    });
    const totalIn = s.PIX + s.CREDITO + s.DEBITO + s.DELIVERY + s.DINHEIRO;
    const totalOut = s.DESPESAS + s.WITHDRAWAL;
    return { ...s, totalIn, totalOut, net: totalIn - totalOut };
  }, [movements]);

  const barData = [
    { name: 'PIX', value: stats.PIX, color: 'hsl(var(--primary))' },
    { name: 'Crédito', value: stats.CREDITO, color: '#4f46e5' },
    { name: 'Débito', value: stats.DEBITO, color: '#3730a3' },
    { name: 'Delivery', value: stats.DELIVERY, color: 'hsl(var(--primary))' },
    { name: 'Dinheiro', value: stats.DINHEIRO, color: 'hsl(var(--accent))' },
  ];

  const pieData = [
    { name: 'Entradas', value: stats.totalIn, color: 'hsl(var(--accent))' },
    { name: 'Saídas', value: stats.totalOut, color: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-20 rounded-xl bg-background p-1 border-2 border-accent shadow-xl overflow-hidden flex items-center justify-center">
            {brand?.logoUrl ? (
              <Image src={brand.logoUrl} alt="Logo" fill className="object-contain" unoptimized />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground opacity-30" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-headline font-bold text-white uppercase tracking-tight">PAINEL FINANCEIRO</h1>
            <p className="text-accent uppercase font-black tracking-widest line-clamp-1">{brand?.name || 'Sistema de Caixa'}</p>
          </div>
        </div>
        <Button onClick={() => window.print()} className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-2xl h-14 px-8 shadow-lg shadow-accent/20">
          <Printer className="w-5 h-5 mr-3" />
          IMPRIMIR RELATÓRIO
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Total PIX" value={stats.PIX} icon={Smartphone} color="text-primary" />
        <StatCard title="Total Cartões" value={stats.CREDITO + stats.DEBITO} icon={CreditCard} color="text-indigo-400" />
        <StatCard title="Total Delivery" value={stats.DELIVERY} icon={Truck} color="text-primary" />
        <StatCard title="Total Dinheiro" value={stats.DINHEIRO} icon={Banknote} color="text-accent" />
        <StatCard title="Total Entradas" value={stats.totalIn} icon={TrendingUp} color="text-accent" highlight />
        <StatCard title="Total Saídas" value={stats.totalOut} icon={TrendingDown} color="text-destructive" />
        <StatCard title="Lucro Líquido" value={stats.net} icon={Wallet} color="text-accent" large />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
        <ChartCard title="Distribuição de Vendas">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={45}>
                {barData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fluxo de Entradas vs Saídas">
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} stroke="none" paddingAngle={10} dataKey="value">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-8 mt-4">
            <LegendItem color="bg-accent" label="Entradas" />
            <LegendItem color="bg-destructive" label="Saídas" />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, highlight, large }: any) {
  return (
    <Card className={`bg-card/40 border-white/5 shadow-md hover:bg-card/60 transition-all ${large ? 'md:col-span-2' : ''} rounded-2xl`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">{title}</p>
            <p className={`font-headline font-bold ${large ? 'text-4xl' : 'text-2xl'} ${highlight ? 'text-accent' : 'text-white'}`}>
              R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <Card className="bg-card/50 border-white/5 shadow-xl overflow-hidden flex flex-col items-center pt-4">
      <CardHeader className="pb-2 w-full">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] w-full pt-4">{children}</CardContent>
    </Card>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{label}</span>
    </div>
  );
}
