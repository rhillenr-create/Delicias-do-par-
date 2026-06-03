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
  Clock
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

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('day'); // day, week, month, all

  const loadMovements = () => {
    setMovements(getMovements());
  };

  useEffect(() => {
    loadMovements();
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white">Extrato de Movimentação</h1>
          <p className="text-muted-foreground">Gerencie todas as entradas e saídas do seu negócio.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card border border-primary/20 p-2 rounded-xl">
          <div className="px-4 py-2">
            <p className="text-[10px] uppercase text-muted-foreground font-bold">Saldo do Período</p>
            <p className="text-xl font-bold text-accent">R$ {(totals.in - totals.out).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar por descrição ou tipo..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-muted focus-visible:ring-primary h-12"
          />
        </div>
        <div className="md:col-span-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-12 bg-card border-muted">
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
           <Button className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold" onClick={() => window.print()}>
             <Calendar className="w-4 h-4 mr-2" />
             Imprimir Relatório
           </Button>
        </div>
      </div>

      <div className="bg-card border border-muted rounded-2xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-muted">
              <TableHead className="w-[180px]">Data & Hora</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[100px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Nenhuma movimentação encontrada para o período selecionado.
                </TableCell>
              </TableRow>
            ) : (
              filteredMovements.map((m) => (
                <TableRow key={m.id} className="border-muted hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-white">{format(m.timestamp, 'dd/MM/yyyy')}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {format(m.timestamp, 'HH:mm')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(m.type)} className="font-bold">
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
                                <BrainCircuit className="w-4 h-4 text-primary animate-pulse" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs bg-card border-primary p-3">
                                <p className="font-bold text-primary mb-1">IA Insight: {m.aiCategory}</p>
                                <ul className="text-xs space-y-1">
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
                      {m.observation && <span className="text-xs text-muted-foreground italic">{m.observation}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 font-headline font-bold">
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
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
      <div className="print-only p-10 space-y-8">
        <div className="flex justify-between items-center border-b-2 border-black pb-4">
          <h1 className="text-4xl font-bold">Relatório Mensal - AçaíLume Pro</h1>
          <p className="text-xl">{format(new Date(), 'MMMM yyyy', { locale: ptBR })}</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="border p-4">
            <p className="font-bold text-gray-600">Total Entradas</p>
            <p className="text-2xl font-bold text-green-700">R$ {totals.in.toFixed(2)}</p>
          </div>
          <div className="border p-4">
            <p className="font-bold text-gray-600">Total Saídas</p>
            <p className="text-2xl font-bold text-red-700">R$ {totals.out.toFixed(2)}</p>
          </div>
          <div className="border p-4 bg-gray-50">
            <p className="font-bold text-gray-600">Lucro Líquido</p>
            <p className="text-2xl font-bold">R$ {(totals.in - totals.out).toFixed(2)}</p>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 pt-20 border-t">Este documento foi gerado automaticamente pelo sistema AçaíLume Pro em {format(new Date(), 'dd/MM/yyyy HH:mm')}.</p>
      </div>
    </div>
  );
}
