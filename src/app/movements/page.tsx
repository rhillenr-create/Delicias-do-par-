
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Movement, MovementType } from '@/lib/types';
import { getMovements, deleteMovement } from '@/lib/db';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Trash2, 
  Calendar, 
  BrainCircuit, 
  Filter,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  Printer
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('day'); 
  const [reportDate, setReportDate] = useState<string>('');
  const logo = PlaceHolderImages.find(img => img.id === 'brand-logo');

  const loadMovements = () => {
    setMovements(getMovements());
  };

  useEffect(() => {
    loadMovements();
    setReportDate(format(new Date(), 'dd/MM/yyyy HH:mm'));
    
    window.addEventListener('movementsUpdated', loadMovements);
    return () => window.removeEventListener('movementsUpdated', loadMovements);
  }, []);

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

  const totals = useMemo(() => {
    return filteredMovements.reduce((acc, curr) => {
      if (['DESPESAS', 'WITHDRAWAL'].includes(curr.type)) {
        acc.out += curr.value;
      } else {
        acc.in += curr.value;
      }
      return acc;
    }, { in: 0, out: 0 });
  }, [filteredMovements]);

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este registro?')) {
      deleteMovement(id);
    }
  };

  const getBadgeVariant = (type: MovementType) => {
    switch (type) {
      case 'PIX': return 'default';
      case 'DINHEIRO': return 'secondary';
      case 'DELIVERY': return 'outline';
      case 'DESPESAS':
      case 'WITHDRAWAL': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white uppercase italic tracking-tighter">Açaí <span className="text-accent">Delícias do Pará</span></h1>
          <p className="text-muted-foreground uppercase text-xs font-bold tracking-widest mt-1">Gerenciamento de Fluxo de Caixa</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card border border-primary/20 p-3 rounded-2xl shadow-lg">
          <div className="px-4">
            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Saldo do Período</p>
            <p className="text-2xl font-bold text-accent">R$ {(totals.in - totals.out).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 no-print">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar movimentação..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-muted focus-visible:ring-primary h-12 rounded-xl"
          />
        </div>
        <div className="md:col-span-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-12 bg-card border-muted rounded-xl">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <SelectValue placeholder="Período" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoje</SelectItem>
              <SelectItem value="week">Últimos 7 dias</SelectItem>
              <SelectItem value="month">Mês atual</SelectItem>
              <SelectItem value="all">Todo o histórico</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3">
           <Button className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-xl shadow-lg shadow-accent/10" onClick={() => window.print()}>
             <Printer className="w-4 h-4 mr-2" />
             Relatório
           </Button>
        </div>
      </div>

      <div className="bg-card border border-muted rounded-2xl overflow-hidden shadow-2xl no-print">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-muted">
              <TableHead className="w-[180px] uppercase text-[10px] font-bold tracking-widest">Data & Hora</TableHead>
              <TableHead className="uppercase text-[10px] font-bold tracking-widest">Tipo</TableHead>
              <TableHead className="uppercase text-[10px] font-bold tracking-widest">Descrição</TableHead>
              <TableHead className="text-right uppercase text-[10px] font-bold tracking-widest">Valor</TableHead>
              <TableHead className="w-[100px] text-center uppercase text-[10px] font-bold tracking-widest">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                  Nenhuma movimentação registrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredMovements.map((m) => (
                <TableRow key={m.id} className="border-muted hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-white">{format(m.timestamp, 'dd/MM/yyyy')}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold">
                        <Clock className="w-3 h-3" /> {format(m.timestamp, 'HH:mm')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(m.type)} className="font-bold text-[10px] px-3 py-1">
                      {m.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{m.description}</span>
                        {m.aiCategory && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BrainCircuit className="w-4 h-4 text-accent animate-pulse" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs bg-card border-accent p-3 shadow-2xl">
                                <p className="font-bold text-accent mb-1 flex items-center gap-2">
                                  <BrainCircuit className="w-3 h-3" /> IA Insight: {m.aiCategory}
                                </p>
                                <ul className="text-xs space-y-1 text-muted-foreground">
                                  {m.aiSuggestions?.map((s, i) => (
                                    <li key={i} className="flex gap-2">
                                      <span className="text-accent">•</span> {s}
                                    </li>
                                  ))}
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {m.observation && <span className="text-[10px] text-muted-foreground italic">{m.observation}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 font-headline font-bold text-lg">
                      {['DESPESAS', 'WITHDRAWAL'].includes(m.type) ? (
                        <>
                          <ArrowUpCircle className="w-4 h-4 text-destructive" />
                          <span className="text-destructive">- R$ {m.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownCircle className="w-4 h-4 text-accent" />
                          <span className="text-accent">+ R$ {m.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                      onClick={() => handleDelete(m.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Print-only section */}
      <div className="print-only p-8 space-y-10">
        <div className="flex justify-between items-center border-b-4 border-black pb-8">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 border-2 border-black p-1">
              {logo && (
                <Image 
                  src={logo.imageUrl} 
                  alt="Logo" 
                  width={96} 
                  height={96} 
                  className="object-contain"
                />
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="text-5xl font-black uppercase italic tracking-tighter">Açaí Delícias do Pará</h1>
              <p className="text-gray-600 uppercase tracking-[0.3em] text-sm font-bold">Relatório Financeiro de Movimentação</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold uppercase">{format(new Date(), 'MMMM yyyy', { locale: ptBR })}</p>
            <p className="text-gray-500 font-bold">{reportDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="border-2 border-black p-6">
            <p className="font-bold text-gray-500 uppercase text-xs tracking-widest mb-2">Total Entradas</p>
            <p className="text-3xl font-black text-green-700">R$ {totals.in.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="border-2 border-black p-6">
            <p className="font-bold text-gray-500 uppercase text-xs tracking-widest mb-2">Total Saídas</p>
            <p className="text-3xl font-black text-red-700">R$ {totals.out.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="border-2 border-black bg-gray-100 p-6 shadow-inner">
            <p className="font-bold text-gray-500 uppercase text-xs tracking-widest mb-2">Saldo Final</p>
            <p className="text-3xl font-black">R$ {(totals.in - totals.out).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="border-2 border-black">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b-2 border-black">
              <tr>
                <th className="p-3 font-bold uppercase text-xs">Data</th>
                <th className="p-3 font-bold uppercase text-xs">Tipo</th>
                <th className="p-3 font-bold uppercase text-xs">Descrição</th>
                <th className="p-3 font-bold uppercase text-xs text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((m) => (
                <tr key={m.id} className="border-b border-gray-300">
                  <td className="p-3 text-sm">{format(m.timestamp, 'dd/MM/yyyy HH:mm')}</td>
                  <td className="p-3 text-sm font-bold">{m.type}</td>
                  <td className="p-3 text-sm">{m.description}</td>
                  <td className={`p-3 text-sm text-right font-bold ${['DESPESAS', 'WITHDRAWAL'].includes(m.type) ? 'text-red-700' : 'text-green-700'}`}>
                    {['DESPESAS', 'WITHDRAWAL'].includes(m.type) ? '-' : '+'} R$ {m.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reportDate && (
          <div className="pt-20 border-t border-black space-y-4">
            <div className="flex justify-around">
              <div className="border-t border-black w-64 text-center pt-2">
                <p className="text-xs font-bold uppercase">Assinatura Responsável</p>
              </div>
              <div className="border-t border-black w-64 text-center pt-2">
                <p className="text-xs font-bold uppercase">Data de Conferência</p>
              </div>
            </div>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Documento gerado automaticamente pelo Sistema Açaí Delícias do Pará em {reportDate}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
