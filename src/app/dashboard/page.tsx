
'use client';

import { useMemo, useState, useEffect } from 'react';
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
  Pie,
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
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const DEFAULT_LOGO = "https://gitlab.com/rhillenr-create/teste-iptv/-/raw/main/delicias_do_para.png";

export default function DashboardPage() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  const movementsRef = useMemo(() => (db ? collection(db, 'movements') : null), [db]);
  const { data: movements = [] } = useCollection<Movement>(movementsRef);

  const brandRef = useMemo(() => (db ? doc(db, 'settings', 'brand') : null), [db]);
  const { data: brand } = useDoc<any>(brandRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    const s = { PIX: 0, CREDITO: 0, DEBITO: 0, DELIVERY: 0, DINHEIRO: 0, DESPESAS: 0, WITHDRAWAL: 0 };
    movements.forEach((m) => {
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

  if (!mounted) return null;

  const currentLogo = brand?.logoUrl || DEFAULT_LOGO;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-16 rounded-2xl bg-card border-2 border-white/5 p-2 shadow-xl flex items-center justify-center">
            <Image
              src={currentLogo}
              alt="Logo"
              fill
              className="object-contain p-1"
              unoptimized
              data-ai-hint="acai brand"
            />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-black text-white uppercase tracking-tighter">
              PAINEL <span className="text-accent">DE GESTÃO</span>
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Visão geral do faturamento</p>
          </div>
        </div>
        <Button
          onClick={() => window.print()}
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-black rounded-2xl h-14 px-8 shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Printer className="w-5 h-5 mr-3" />
          GERAR RELATÓRIO
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total PIX" value={stats.PIX} icon={Smartphone} color="text-primary" />
        <StatCard title="Total Cartões" value={stats.CREDITO + stats.DEBITO} icon={CreditCard} color="text-blue-400" />
        <StatCard title="Total Delivery" value={stats.DELIVERY} icon={Truck} color="text-primary" />
        <StatCard title="Total Dinheiro" value={stats.DINHEIRO} icon={Banknote} color="text-accent" />
        
        <div className="md:col-span-2">
          <StatCard title="Total de Entradas" value={stats.totalIn} icon={TrendingUp} color="text-accent" highlight large />
        </div>
        <div className="md:col-span-2">
          <StatCard title="Saldo Líquido em Caixa" value={stats.net} icon={Wallet} color="text-white" highlight large gradient />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
        <ChartCard title="Distribuição por Canal">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.3)"
                fontSize={11}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{
                  backgroundColor: 'rgba(15,10,25,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fluxo de Caixa">
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    stroke="none"
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15,10,25,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-10 mt-2">
              <LegendItem color="bg-accent" label="Entradas" />
              <LegendItem color="bg-destructive" label="Saídas" />
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, highlight, large, gradient }: any) {
  return (
    <Card
      className={cn(
        "glass-card overflow-hidden group transition-all duration-300 hover:scale-[1.02]",
        large ? 'rounded-[2rem]' : 'rounded-3xl',
        gradient ? 'bg-gradient-to-br from-primary/20 via-card/40 to-accent/10 border-accent/20' : ''
      )}
    >
      <CardContent className="p-6 md:p-8 relative">
        {gradient && <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px] -mr-16 -mt-16 rounded-full" />}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              {title}
            </p>
            <p
              className={cn(
                "font-headline font-black leading-none",
                large ? 'text-4xl md:text-5xl' : 'text-2xl',
                highlight ? 'text-white' : 'text-white/90'
              )}
            >
              R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={cn(
            "p-3.5 rounded-2xl bg-white/5 border border-white/5 transition-all group-hover:bg-white/10",
            color
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <Card className="glass-card rounded-[2.5rem] overflow-hidden pt-6 flex flex-col">
      <CardHeader className="px-8 pb-0">
        <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-white/50 flex items-center gap-2">
          <div className="w-1.5 h-4 bg-accent rounded-full" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-8 min-h-[300px]">{children}</CardContent>
    </Card>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn(`w-2.5 h-2.5 rounded-full ${color} shadow-[0_0_10px_currentColor]`)} />
      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
        {label}
      </span>
    </div>
  );
}
