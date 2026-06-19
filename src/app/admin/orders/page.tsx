
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Order, OrderStatus } from '@/lib/types';
import { updateOrderStatus } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ShoppingBag, Search, ExternalLink, Info, Printer, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminOrdersPage() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('');
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  const ordersQuery = useMemo(() => (db ? query(collection(db, 'orders'), orderBy('createdAt', 'desc')) : null), [db]);
  const { data: orders = [] } = useCollection<Order>(ordersQuery);

  const brandRef = useMemo(() => (db ? doc(db, 'settings', 'brand') : null), [db]);
  const { data: brand } = useDoc<any>(brandRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => o.clienteNome.toLowerCase().includes(filter.toLowerCase()));
  }, [orders, filter]);

  const handleStatusChange = (id: string, status: string) => {
    if (db) updateOrderStatus(db, id, status as OrderStatus);
  };

  const handlePrint = (order: Order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
    }, 500);
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
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
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

      <div className="bg-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl no-print">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5">
              <TableHead className="text-[10px] font-black uppercase tracking-widest p-6">Data</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest p-6">Cliente</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest p-6">Itens e Montagem</TableHead>
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
                  <div className="text-xs text-white/60 space-y-2">
                    {order.itens.map((i, idx) => (
                      <div key={idx} className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <div className="font-black text-accent">{i.qtd}x {i.nome}</div>
                        {i.complements && i.complements.map((c, cidx) => (
                          <div key={cidx} className="pl-2 border-l border-white/10 mt-1">
                            <span className="opacity-50 uppercase text-[9px]">{c.category}:</span> <span className="text-[9px]">{c.items.join(', ')}</span>
                          </div>
                        ))}
                      </div>
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
                  <div className="flex items-center gap-3">
                    <Select value={order.status} onValueChange={(val) => handleStatusChange(order.id, val)}>
                      <SelectTrigger className="h-10 bg-background border-white/10 rounded-xl text-xs w-32">
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
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-xl border-accent/20 text-accent hover:bg-accent/10 h-10 w-10"
                      onClick={() => handlePrint(order)}
                    >
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Recibo para Impressão Térmica */}
      {printingOrder && (
        <div className="print-only fixed inset-0 bg-white text-black p-4 z-[9999] overflow-auto font-mono text-sm leading-tight w-[80mm] mx-auto">
          <div className="text-center border-b border-dashed border-black pb-4 mb-4">
            <h2 className="text-xl font-bold uppercase">{brand?.name || 'AÇAÍ DELÍCIAS DO PARÁ'}</h2>
            <p className="text-[10px] mt-1">Sabor Original do Pará!</p>
            <p className="text-[10px]">{format(printingOrder.createdAt, "dd/MM/yyyy HH:mm")}</p>
          </div>

          <div className="mb-4">
            <p className="font-bold uppercase">CLIENTE: {printingOrder.clienteNome}</p>
            <p>TEL: {printingOrder.clienteTelefone}</p>
            <p className="mt-2 font-bold uppercase">TIPO: {printingOrder.tipoEntrega === 'entrega' ? 'DELIVERY' : 'RETIRADA'}</p>
            {printingOrder.tipoEntrega === 'entrega' && (
              <p className="uppercase">END: {printingOrder.endereco}</p>
            )}
          </div>

          <div className="border-y border-dashed border-black py-4 mb-4">
            <p className="font-bold mb-2 uppercase">ITENS DO PEDIDO:</p>
            {printingOrder.itens.map((item, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex justify-between font-bold">
                  <span>{item.qtd}x {item.nome}</span>
                  <span>R$ {(item.preco * item.qtd).toFixed(2)}</span>
                </div>
                {item.complements && item.complements.map((c, cidx) => (
                  <div key={cidx} className="text-[11px] pl-2">
                    <span className="opacity-70">{c.category}:</span> {c.items.join(', ')}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="space-y-1 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {(printingOrder.total - (printingOrder.taxaEntrega || 0)).toFixed(2)}</span>
            </div>
            {printingOrder.tipoEntrega === 'entrega' && (
              <div className="flex justify-between">
                <span>Taxa Entrega:</span>
                <span>R$ {(printingOrder.taxaEntrega || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-black pt-2 mt-2">
              <span>TOTAL:</span>
              <span>R$ {printingOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-black pt-4">
            <p className="font-bold uppercase">PAGAMENTO: {printingOrder.pagamento.toUpperCase()}</p>
            {printingOrder.pagamento === 'dinheiro' && printingOrder.troco && (
              <p>TROCO PARA: R$ {printingOrder.troco.toFixed(2)}</p>
            )}
          </div>

          <div className="text-center mt-10 opacity-50 text-[10px]">
            <p>Obrigado pela preferência!</p>
            <p>www.acaiteriadelicias.com.br</p>
          </div>
        </div>
      )}
    </div>
  );
}
