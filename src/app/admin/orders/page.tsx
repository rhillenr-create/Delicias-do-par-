
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Order, OrderStatus } from '@/lib/types';
import { updateOrderStatus } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ShoppingBag, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminOrdersPage() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('');

  const ordersQuery = useMemo(() => (db ? query(collection(db, 'orders'), orderBy('createdAt', 'desc')) : null), [db]);
  const { data: orders = [] } = useCollection<Order>(ordersQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => o.clienteNome.toLowerCase().includes(filter.toLowerCase()));
  }, [orders, filter]);

  const handleStatusChange = (id: string, status: string) => {
    if (db) updateOrderStatus(db, id, status as OrderStatus);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'novo': return <Badge className="bg-primary text-white">NOVO</Badge>;
      case 'preparando': return <Badge className="bg-blue-500 text-white">PREPARANDO</Badge>;
      case 'saiu_entrega': return <Badge className="bg-purple-500 text-white">EM ENTREGA</Badge>;
      case 'entregue': return <Badge className="bg-accent text-accent-foreground">ENTREGUE</Badge>;
      case 'cancelado': return <Badge variant="destructive">CANCELADO</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-white uppercase tracking-tighter">CONTROLE DE <span className="text-accent">PEDIDOS</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Gerenciamento completo de delivery</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar cliente..." 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="pl-10 h-12 bg-card border-white/5 rounded-xl w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5">
              <TableHead className="text-[10px] font-black uppercase tracking-widest p-6">Data</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest p-6">Cliente</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest p-6">Itens</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest p-6">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest p-6 text-right">Total</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest p-6 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="p-6 text-sm text-white/70">
                  {format(order.createdAt, 'dd/MM HH:mm')}
                </TableCell>
                <TableCell className="p-6">
                  <div className="font-bold text-white">{order.clienteNome}</div>
                  <div className="text-[10px] text-accent uppercase font-black">{order.clienteTelefone}</div>
                </TableCell>
                <TableCell className="p-6">
                  <div className="text-xs text-white/60 space-y-1">
                    {order.itens.map((i, idx) => (
                      <div key={idx}>{i.qtd}x {i.nome}</div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="p-6">
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell className="p-6 text-right font-black text-accent">
                  R$ {order.total.toFixed(2)}
                </TableCell>
                <TableCell className="p-6">
                  <Select value={order.status} onValueChange={(val) => handleStatusChange(order.id, val)}>
                    <SelectTrigger className="h-10 bg-background border-white/10 rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="novo">Novo</SelectItem>
                      <SelectItem value="preparando">Preparando</SelectItem>
                      <SelectItem value="saiu_entrega">Em Entrega</SelectItem>
                      <SelectItem value="entregue">Entregue</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
