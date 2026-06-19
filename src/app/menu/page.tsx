
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Product, OrderItem } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createOrder } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

export default function MenuPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'products'), where('ativo', '==', true));
  }, [db]);

  const { data: products = [] } = useCollection<Product>(productsQuery);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('acai-cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('acai-cart', JSON.stringify(cart));
  }, [cart, mounted]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qtd: item.qtd + 1 } : item);
      }
      return [...prev, { id: product.id, nome: product.nome, preco: product.preco, qtd: 1 }];
    });
    toast({ title: "Adicionado!", description: `${product.nome} está no carrinho.` });
  };

  const updateQtd = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQtd = Math.max(0, item.qtd + delta);
        return { ...item, qtd: newQtd };
      }
      return item;
    }).filter(item => item.qtd > 0));
  };

  const total = cart.reduce((acc, item) => acc + (item.preco * item.qtd), 0);

  const handleFinishOrder = async () => {
    if (!db || cart.length === 0 || !clienteNome || !clienteTelefone) return;

    const orderData = {
      clienteNome,
      clienteTelefone,
      itens: cart,
      total,
      pagamento: 'Pendente'
    };

    await createOrder(db, orderData);
    
    // Zap Integration
    const msg = `*NOVO PEDIDO - DELÍCIAS DO PARÁ*\n\n*Cliente:* ${clienteNome}\n*Tel:* ${clienteTelefone}\n\n*Itens:*\n${cart.map(i => `- ${i.qtd}x ${i.nome} (R$ ${i.preco.toFixed(2)})`).join('\n')}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const zapLink = `https://wa.me/55${clienteTelefone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    
    window.open(zapLink, '_blank');
    setCart([]);
    setClienteNome('');
    setClienteTelefone('');
    toast({ title: "Pedido Enviado!", description: "Seu pedido foi registrado com sucesso." });
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-black text-white uppercase tracking-tighter">CARDÁPIO <span className="text-accent">ONLINE</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Faça seu pedido agora</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(product => (
          <Card key={product.id} className="glass-card overflow-hidden rounded-[2rem] border-white/5 transition-all hover:scale-[1.02]">
            <div className="relative h-48 w-full bg-black/20">
              <Image 
                src={product.imagem || "https://picsum.photos/seed/acai/400/300"} 
                alt={product.nome} 
                fill 
                className="object-cover opacity-80"
                unoptimized
              />
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground font-black">R$ {product.preco.toFixed(2)}</Badge>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{product.nome}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.descricao}</p>
            </CardContent>
            <CardFooter className="px-6 pb-6">
              <Button 
                onClick={() => addToCart(product)}
                className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-xs"
              >
                <Plus className="w-4 h-4 mr-2" /> ADICIONAR AO CARRINHO
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full h-16 rounded-[2rem] bg-accent text-accent-foreground font-black shadow-2xl shadow-accent/20 flex justify-between px-8 text-lg hover:bg-accent/90">
                <div className="flex items-center gap-3">
                  <div className="bg-black/10 p-2 rounded-xl">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <span>{cart.length} ITENS</span>
                </div>
                <span>R$ {total.toFixed(2)}</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-card border-t-2 border-accent/20 rounded-t-[3rem] max-h-[85vh]">
              <DrawerHeader className="px-8 pt-8">
                <DrawerTitle className="text-2xl font-black uppercase text-white tracking-tighter">MEU <span className="text-accent">CARRINHO</span></DrawerTitle>
              </DrawerHeader>
              <div className="p-8 space-y-8 overflow-y-auto">
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div>
                        <p className="font-bold text-white">{item.nome}</p>
                        <p className="text-xs text-accent">R$ {(item.preco * item.qtd).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-black/20 p-1 rounded-xl">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={() => updateQtd(item.id, -1)}><Minus className="w-4 h-4" /></Button>
                        <span className="font-black text-white w-4 text-center">{item.qtd}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={() => updateQtd(item.id, 1)}><Plus className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Nome do Cliente</Label>
                    <Input value={clienteNome} onChange={e => setClienteNome(e.target.value)} className="h-12 rounded-xl bg-background border-white/10" placeholder="Ex: João Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">WhatsApp</Label>
                    <Input value={clienteTelefone} onChange={e => setClienteTelefone(e.target.value)} className="h-12 rounded-xl bg-background border-white/10" placeholder="Ex: 91988887777" />
                  </div>
                </div>
              </div>
              <DrawerFooter className="p-8">
                <Button 
                  onClick={handleFinishOrder}
                  disabled={!clienteNome || !clienteTelefone}
                  className="h-16 rounded-2xl bg-accent text-accent-foreground font-black text-lg uppercase tracking-widest"
                >
                  FINALIZAR PEDIDO (R$ {total.toFixed(2)})
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost" className="text-muted-foreground">Continuar Comprando</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
}
