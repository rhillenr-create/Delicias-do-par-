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
  Zap, 
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white">Luminous Analytics</h1>
          <p className="text-muted-foreground">Visão geral do desempenho financeiro da sua açaíteria.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total PIX" value={stats.PIX} icon={Smartphone} color="text-primary" />
        <StatCard title="Total Cartões" value={stats.CREDITO + stats.DEBITO} icon={CreditCard} color="text-indigo-400" />
        <StatCard title="Total Delivery" value={stats.DELIVERY} icon={Truck} color="text-primary" />
        <StatCard title="Total Dinheiro" value={stats.DINHEIRO} icon={Banknote} color="text-accent" />
        <StatCard title="Total Entradas" value={stats.totalIn} icon={TrendingUp} color="text-accent" highlight />
        <StatCard title="Total Saídas" value={stats.totalOut} icon={TrendingDown} color="text-destructive" />
        <StatCard title="Lucro Final" value={stats.net} icon={Wallet} color="text-accent" large />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-muted shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Distribuição de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'white' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-muted shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                   itemStyle={{ color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-xs text-muted-foreground uppercase font-bold">Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-xs text-muted-foreground uppercase font-bold">Saídas</span>
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
    <Card className={`bg-card border-muted shadow-lg hover:border-primary/50 transition-colors ${large ? 'lg:col-span-2' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <p className={`font-headline font-bold truncate ${large ? 'text-4xl' : 'text-2xl'} ${highlight ? 'text-accent' : 'text-white'}`}>
          R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </CardContent>
    </Card>
  );
}
