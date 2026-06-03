
"use client";

import { useState, useEffect, useMemo } from 'react';
import { getMovements } from '@/lib/db';
import { Movement } from '@/lib/types';
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
import { 
  CreditCard, 
  Smartphone, 
  Truck, 
  Banknote, 
  TrendingUp, 
  TrendingDown, 
  Wallet 
} from 'lucide-react';

export default function DashboardPage() {
  const [movements, setMovements] = useState<Movement[]>([]);

  useEffect(() => {
    const load = () => setMovements(getMovements());
    load();
    window.addEventListener('movementsUpdated', load);
    return () => window.removeEventListener('movementsUpdated', load);
  }, []);

  const stats = useMemo(() => {
    const s = {
      PIX: 0,
      CREDITO: 0,
      DEBITO: 0,
      DELIVERY: 0,
      DINHEIRO: 0,
      DESPESAS: 0,
      WITHDRAWAL: 0,
    };
    
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
      <div className="space-y-1">
        <h1 className="text-2xl font-headline font-bold text-white uppercase tracking-tight">
          AÇAÍ <span className="text-accent">DELÍCIAS DO PARÁ</span>
        </h1>
        <p className="text-xs text-muted-foreground">Visão geral do desempenho financeiro da sua açaíteria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Total PIX" value={stats.PIX} icon={Smartphone} color="text-primary" />
        <StatCard title="Total Cartões" value={stats.CREDITO + stats.DEBITO} icon={CreditCard} color="text-indigo-400" />
        <StatCard title="Total Delivery" value={stats.DELIVERY} icon={Truck} color="text-primary" />
        <StatCard title="Total Dinheiro" value={stats.DINHEIRO} icon={Banknote} color="text-accent" />
        <StatCard title="Total Entradas" value={stats.totalIn} icon={TrendingUp} color="text-accent" highlight />
        <StatCard title="Total Saídas" value={stats.totalOut} icon={TrendingDown} color="text-destructive" />
        <StatCard title="Lucro Final" value={stats.net} icon={Wallet} color="text-accent" large />
      </div>

      <div className="space-y-6">
        <Card className="bg-card/50 border-muted shadow-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-white">Distribuição de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'white', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-muted shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-white">Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center pt-4">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  stroke="none"
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                   itemStyle={{ color: 'white', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Saídas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, highlight, large }: any) {
  return (
    <Card className={`bg-card/40 border-muted/50 shadow-md hover:bg-card/60 transition-all ${large ? 'md:col-span-2' : ''}`}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">{title}</p>
            <p className={`font-headline font-bold ${large ? 'text-3xl' : 'text-xl'} ${highlight ? 'text-accent' : 'text-white'}`}>
              R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`p-2 rounded-lg bg-background/50 border border-white/5 ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
