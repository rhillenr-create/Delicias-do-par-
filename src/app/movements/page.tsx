
"use client";

import { useState, useMemo } from 'react';
import { Movement } from '@/lib/types';
import { deleteMovement } from '@/lib/db';
import { useCollection, useDoc, useFirestore } from '@/firebase';
import { collection, doc, query, orderBy } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Trash2, BrainCircuit, Filter, Clock, Printer, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from 'next/image';

export default function MovementsPage() {
  const db = useFirestore();
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('all');

  const movementsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'movements'), orderBy('timestamp', 'desc'));
  }, [db]);

  const { data: movements = [] } = useCollection<Movement>(movementsQuery);

  const brandRef = useMemo(() => db ? doc(db, 'settings', 'brand') : null, [db]);
  const { data: brand = { name: '', logoUrl: '' } } = useDoc<any>(brandRef);

  const filteredMovements = useMemo(() => {
    const now = new Date();
    return movements.filter(m => {
      const mDate = new Date(m.timestamp);
      const matchesSearch = m.description.toLowerCase().includes(search.toLowerCase()) || 
                           m.type.toLowerCase().includes(search.toLowerCase());
      
      let matchesPeriod = true;
      if (period === 'day') {
        matchesPeriod = format(mDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
      } else if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchesPeriod = mDate >= weekAgo;
      } else if (period === 'month') {
        matchesPeriod = mDate.getMonth() === now.getMonth() && mDate.getFullYear() === now.getFullYear();
      }
      
      return matchesSearch && matchesPeriod;
    });
  }, [movements, search, period]);

  const totals = useMemo(() => filteredMovements.reduce((acc, curr) => {
    if (['DESPESAS', 'WITHDRAWAL'].includes(curr.type)) acc.out += curr.value;
    else acc.in += curr.value;
    return acc;
  }, { in: 0, out: 0 }), [filteredMovements]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-4">
           <div className="relative w-20 h-16 rounded-lg bg-background p-1 border border-accent/20 shadow-lg overflow-hidden flex items-center justify-center">
              {brand?.logoUrl ? (
                <Image src={brand.logoUrl} alt="Logo" fill className="object-contain" unoptimized />
              ) : (
                <ImageIcon className="w-6 h-6 text-muted-foreground opacity-30" />
              )}
           </div>
           <div>
             <h1 className="text-xl font-headline font-bold text-white uppercase tracking-tight">RELATÓRIO DE CAIXA</h1>
             <p className="text-accent uppercase text-[10px] font-black tracking-widest line-clamp-1">{brand?.name || 'Sistema de Caixa'}</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4 bg-card border border-white/5 p-3 rounded-2xl shadow-lg">
          <div className="px-4 border-r border-white/10 text-right">
            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Saldo do Período</p>
            <p className="text-2xl font-bold text-accent">R$ {(totals.in - totals.out).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-xl h-12" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            IMPRIMIR
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 no-print">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Pesquisar movimentação..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-12 rounded-xl bg-card border-muted" />
        </div>
        <div className="md:col-span-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-12 bg-card border-muted rounded-xl">
              <div className="flex items-center gap-2"><Filter className="w-4 h-4 text-primary" /><SelectValue /></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoje</SelectItem>
              <SelectItem value="week">Últimos 7 dias</SelectItem>
              <SelectItem value="month">Mês atual</SelectItem>
              <SelectItem value="all">Todo o histórico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border border-muted rounded-2xl overflow-hidden shadow-2xl no-print">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-muted">
              <TableHead className="w-[180px] text-[10px] font-bold uppercase">Data & Hora</TableHead>
              <TableHead className="text-[10px] font-bold uppercase">Tipo</TableHead>
              <TableHead className="text-[10px] font-bold uppercase">Descrição</TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase">Valor</TableHead>
              <TableHead className="w-[100px] text-center text-[10px] font-bold uppercase">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center italic opacity-50">Nenhum registro encontrado.</TableCell></TableRow>
            ) : (
              filteredMovements.map((m) => (
                <TableRow key={m.id} className="border-muted hover:bg-white/5">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white">{format(m.timestamp, 'dd/MM/yyyy')}</span>
                      <span className="text-[10px] opacity-50 flex items-center gap-1"><Clock className="w-3 h-3" /> {format(m.timestamp, 'HH:mm')}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge className="font-bold text-[10px]">{m.type}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{m.description}</span>
                      {m.aiCategory && (
                        <TooltipProvider><Tooltip><TooltipTrigger><BrainCircuit className="w-4 h-4 text-accent animate-pulse" /></TooltipTrigger><TooltipContent className="max-w-xs bg-card border-accent p-3 shadow-2xl"><p className="font-bold text-accent mb-1">IA Insight: {m.aiCategory}</p><ul className="text-xs space-y-1 opacity-70">{m.aiSuggestions?.map((s, i) => <li key={i}>• {s}</li>)}</ul></TooltipContent></Tooltip></TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={['DESPESAS', 'WITHDRAWAL'].includes(m.type) ? 'text-destructive' : 'text-accent'}>
                      {['DESPESAS', 'WITHDRAWAL'].includes(m.type) ? '-' : '+'} R$ {m.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={() => db && deleteMovement(db, m.id)} className="hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="print-only p-8 space-y-10">
        <div className="flex justify-between items-center border-b-4 border-black pb-8">
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-24 border-2 border-black p-1 bg-white flex items-center justify-center">
              {brand?.logoUrl && <Image src={brand.logoUrl} alt="Logo" fill className="object-contain" unoptimized />}
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">RELATÓRIO FINANCEIRO</h1>
              <p className="text-gray-600 uppercase tracking-widest text-xs font-bold">{brand?.name || 'Sistema de Caixa'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold uppercase">{format(new Date(), 'MMMM yyyy', { locale: ptBR })}</p>
            <p className="text-gray-500 font-bold">{format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="border-2 border-black p-4">Entradas: R$ {totals.in.toLocaleString('pt-BR')}</div>
          <div className="border-2 border-black p-4">Saídas: R$ {totals.out.toLocaleString('pt-BR')}</div>
          <div className="border-2 border-black bg-gray-100 p-4 font-bold">Saldo: R$ {(totals.in - totals.out).toLocaleString('pt-BR')}</div>
        </div>
        <table className="w-full text-left border-collapse border-2 border-black">
          <thead className="bg-gray-100"><tr><th className="p-2 border-b-2 border-black">Data/Hora</th><th className="p-2 border-b-2 border-black">Tipo</th><th className="p-2 border-b-2 border-black">Descrição</th><th className="p-2 border-b-2 border-black text-right">Valor</th></tr></thead>
          <tbody>{filteredMovements.map(m => (
            <tr key={m.id} className="border-b border-gray-300">
              <td className="p-2">{format(m.timestamp, 'dd/MM/yyyy HH:mm')}</td>
              <td className="p-2 font-bold">{m.type}</td>
              <td className="p-2">{m.description}</td>
              <td className="p-2 text-right font-bold">R$ {m.value.toLocaleString('pt-BR')}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
