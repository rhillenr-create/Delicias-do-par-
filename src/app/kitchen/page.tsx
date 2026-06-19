
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Order, OrderStatus } from '@/lib/types';
import { updateOrderStatus } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function KitchenPage() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  const ordersQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, 'orders'),
      where('status', 'in', ['novo', 'preparando']),
      orderBy('createdAt', 'asc')
    );
  }, [db]);

  const { data: orders = [] } = useCollection<Order>(ordersQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStatusUpdate = (id: string, currentStatus: OrderStatus) => {
    if (!db) return;
    const nextStatus = currentStatus === 'novo' ? 'preparando' : 'saiu_entrega';
    updateOrderStatus(db, id, nextStatus as OrderStatus);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-white uppercase tracking-tighter">COZINHA <span className="text-accent">AO VIVO</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Gerencie os pedidos em preparo</p>
        </div>
        <div className="bg-card p-4 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase font-black">Em Fila</p>
            <p className="text-2xl font-black text-accent">{orders.length}</p>
          </div>
          <ChefHat className="w-8 h-8 text-accent" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center bg-card/40 border-2 border-dashed border-white/5 rounded-[3rem] opacity-50">
            <CheckCircle2 className="w-12 h-12 mb-4" />
            <p className="uppercase font-black tracking-widest text-xs">Cozinha limpa! Nenhum pedido pendente.</p>
          </div>
        ) : (
          orders.map(order => (
            <Card key={order.id} className={`glass-card rounded-[2.5rem] border-white/5 relative overflow-hidden ${order.status === 'preparando' ? 'border-accent/40 bg-accent/5' : ''}`}>
              {order.status === 'preparando' && (
                <div className="absolute top-0 right-0 p-4">
                  <Badge className="bg-accent text-accent-foreground animate-pulse">PREPARANDO</Badge>
                </div>
              )}
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-sm font-black uppercase text-white/50 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {format(order.createdAt, "HH:mm '•' dd MMM", { locale: ptBR })}
                </CardTitle>
                <div className="mt-4">
                  <h3 className="text-2xl font-black text-white uppercase">{order.clienteNome}</h3>
                  <p className="text-accent text-xs font-bold">{order.clienteTelefone}</p>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                <div className="space-y-3">
                  {order.itens.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-lg text-white font-black">{item.qtd}</span>
                        <span className="text-white/80 font-medium">{item.nome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button 
                  onClick={() => handleStatusUpdate(order.id, order.status)}
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs ${order.status === 'novo' ? 'bg-primary text-white' : 'bg-accent text-accent-foreground'}`}
                >
                  {order.status === 'novo' ? 'COMEÇAR PREPARO' : 'PEDIDO PRONTO'}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
