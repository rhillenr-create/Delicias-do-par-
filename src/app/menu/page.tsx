'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useDoc, useFirestore } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Product, OrderItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Search, Share2, Home, Receipt } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createOrder } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DEFAULT_LOGO = "https://gitlab.com/rhillenr-create/teste-iptv/-/raw/6a0cd7fe4b63fecad5f17a1eca98207bff5faa39/delicias_do_para.png";

export default function MenuPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');

  const brandRef = useMemo(() => (db ? doc(db, 'settings', 'brand') : null), [db]);
  const { data: brand } = useDoc<any>(brandRef);

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

  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: Product[] } = {};
    products.forEach(p => {
      const cat = p.categoria || 'Destaques';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [products]);

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
    
    const msg = `*NOVO PEDIDO - ${brand?.name || 'AÇAÍ DELICIAS DO PARA'}*\n\n*Cliente:* ${clienteNome}\n*Tel:* ${clienteTelefone}\n\n*Itens:*\n${cart.map(i => `- ${i.qtd}x ${i.nome} (R$ ${i.preco.toFixed(2)})`).join('\n')}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const zapLink = `https://wa.me/55${clienteTelefone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    
    window.open(zapLink, '_blank');
    setCart([]);
    setClienteNome('');
    setClienteTelefone('');
    toast({ title: "Pedido Enviado!", description: "Seu pedido foi registrado com sucesso." });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f1f1f1] pb-32 font-body">
      {/* Header com as cores originais */}
      <header className="bg-[#4a148c] text-white px-4 h-20 flex items-center justify-between sticky top-0 z-40 shadow-xl border-b-4 border-[#68ff36]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl overflow-hidden relative border-2 border-white/20 shadow-lg">
            <Image src={brand?.logoUrl || DEFAULT_LOGO} alt="Logo" fill className="object-contain p-1" unoptimized />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none">{brand?.name || 'Açaí Delicias do Para'}</h1>
            <span className="text-[10px] font-bold text-[#68ff36] uppercase tracking-widest">Aberto agora</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Info Bar */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Entrega estimada</span>
          <span className="text-sm font-bold text-gray-700">30 - 45 min</span>
        </div>
        <div className="h-8 w-px bg-gray-100" />
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Pedido mínimo</span>
          <span className="text-sm font-bold text-gray-700">R$ 15,00</span>
        </div>
      </div>

      {/* Listagem de Produtos */}
      <div className="max-w-4xl mx-auto p-4 space-y-12">
        {Object.entries(groupedProducts).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <ShoppingCart className="w-20 h-20 mb-4" />
            <p className="font-black uppercase tracking-[0.3em] text-xs">Adicione produtos no Admin</p>
          </div>
        ) : (
          Object.entries(groupedProducts).map(([category, products]) => (
            <section key={category} className="space-y-6">
              <h2 className="text-xl font-black text-[#4a148c] pl-4 border-l-8 border-[#68ff36] leading-none uppercase tracking-tighter">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(product => (
                  <div 
                    key={product.id} 
                    onClick={() => addToCart(product)}
                    className="bg-white rounded-3xl border border-gray-100 p-5 flex gap-5 cursor-pointer hover:shadow-2xl transition-all active:scale-95 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#68ff36]/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
                    
                    <div className="flex-1 flex flex-col justify-between relative z-10">
                      <div>
                        <h3 className="font-black text-gray-800 text-base md:text-lg leading-tight uppercase tracking-tight">{product.nome}</h3>
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed font-medium italic">
                          {product.descricao || 'Sabor autêntico do Pará, preparado com carinho.'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <span className="bg-[#4a148c] text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                          R$ {product.preco.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                    <div className="relative w-28 h-28 rounded-[2rem] overflow-hidden bg-gray-50 flex-shrink-0 shadow-lg border-2 border-white transition-transform group-hover:scale-105">
                      <Image 
                        src={product.imagem || `https://picsum.photos/seed/${product.id}/300/300`} 
                        alt={product.nome} 
                        fill 
                        className="object-cover"
                        unoptimized
                        data-ai-hint="acai bowl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Carrinho Flutuante */}
      {cart.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 px-6 z-50 flex justify-center">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full max-w-lg h-16 rounded-[2rem] bg-[#4a148c] hover:bg-[#310d5e] text-white font-black shadow-2xl flex justify-between px-8 text-sm border-2 border-[#68ff36]/50 animate-in slide-in-from-bottom-10">
                <div className="flex items-center gap-4">
                  <div className="bg-[#68ff36] text-[#4a148c] w-8 h-8 rounded-full flex items-center justify-center text-xs">
                    {cart.reduce((a, b) => a + b.qtd, 0)}
                  </div>
                  <span className="tracking-widest uppercase text-xs">Ver Sacola</span>
                </div>
                <span className="text-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-white rounded-t-[3rem] max-h-[90vh]">
              <DrawerHeader className="border-b-4 border-gray-50 pb-6">
                <DrawerTitle className="text-2xl font-black text-[#4a148c] text-center tracking-tighter uppercase">Minha Sacola</DrawerTitle>
              </DrawerHeader>
              <div className="p-8 space-y-8 overflow-y-auto">
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-50">
                      <div>
                        <p className="font-black text-gray-800 text-base uppercase tracking-tight">{item.nome}</p>
                        <p className="text-xs text-[#4a148c] font-black">R$ {(item.preco * item.qtd).toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-2xl">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-white shadow-sm text-[#4a148c]" onClick={() => updateQtd(item.id, -1)}><Minus className="w-4 h-4" /></Button>
                        <span className="font-black text-gray-800 text-sm w-4 text-center">{item.qtd}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-white shadow-sm text-[#4a148c]" onClick={() => updateQtd(item.id, 1)}><Plus className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nome do Cliente</Label>
                    <Input value={clienteNome} onChange={e => setClienteNome(e.target.value)} className="h-14 rounded-2xl border-gray-100 bg-gray-50 font-bold" placeholder="Como te chamamos?" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Seu WhatsApp</Label>
                    <Input value={clienteTelefone} onChange={e => setClienteTelefone(e.target.value)} className="h-14 rounded-2xl border-gray-100 bg-gray-50 font-bold" placeholder="(91) 9XXXX-XXXX" />
                  </div>
                </div>
              </div>
              <DrawerFooter className="p-8">
                <Button 
                  onClick={handleFinishOrder}
                  disabled={!clienteNome || !clienteTelefone}
                  className="h-16 rounded-[2rem] bg-[#68ff36] hover:bg-[#5ae630] text-[#4a148c] font-black text-lg shadow-xl uppercase tracking-tighter"
                >
                  Confirmar Pedido • R$ {total.toFixed(2).replace('.', ',')}
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Continuar Escolhendo</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}

      {/* Bottom Nav Bar com cores originais */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-50 h-20 flex items-center justify-around px-8 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-center text-[#4a148c]">
          <div className="bg-[#4a148c]/10 p-2 rounded-xl">
            <Home className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-black mt-1 uppercase tracking-widest">Início</span>
        </div>
        <div className="flex flex-col items-center text-gray-300 hover:text-[#4a148c] transition-colors">
          <Receipt className="w-6 h-6" />
          <span className="text-[9px] font-black mt-1 uppercase tracking-widest">Pedidos</span>
        </div>
      </nav>
    </div>
  );
}