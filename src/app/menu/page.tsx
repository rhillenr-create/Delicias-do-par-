
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

  // Agrupamento por categoria
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
    <div className="min-h-screen bg-[#f8f9fa] pb-32">
      {/* Header Estilo Anota AI */}
      <header className="bg-[#0095ff] text-white px-4 h-16 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full overflow-hidden relative border-2 border-white/20">
            <Image src={brand?.logoUrl || DEFAULT_LOGO} alt="Logo" fill className="object-cover" unoptimized />
          </div>
          <h1 className="font-bold text-lg truncate max-w-[180px]">{brand?.name || 'Açaí Delicias do Para'}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Search className="w-6 h-6" />
          <Share2 className="w-6 h-6" />
        </div>
      </header>

      {/* Status Bar */}
      <div className="bg-black text-white text-[11px] font-bold py-3 px-4 flex items-center justify-center">
        Loja aberta • Fecha às 23h
      </div>

      {/* Info Bar */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">
        <span>Sem pedido mínimo</span>
        <span className="text-blue-500 font-bold">Perfil da loja</span>
      </div>

      {/* Listagem de Produtos Agrupados */}
      <div className="max-w-4xl mx-auto p-4 space-y-10">
        {Object.entries(groupedProducts).map(([category, products]) => (
          <section key={category} className="space-y-4">
            <h2 className="text-lg font-extrabold text-[#333] pl-2 border-l-4 border-blue-500 leading-none">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-[#444] text-sm md:text-base leading-tight">{product.nome}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {product.descricao || 'Experimente nossa deliciosa combinação exclusiva.'}
                      </p>
                    </div>
                    <p className="font-black text-[#333] text-sm mt-3">
                      R$ {product.preco.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image 
                      src={product.imagem || "https://picsum.photos/seed/acai/200/200"} 
                      alt={product.nome} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Carrinho Flutuante (Drawer) */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-xl flex justify-between px-6 text-sm">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  <span>VER CARRINHO ({cart.length})</span>
                </div>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-white rounded-t-[2.5rem] max-h-[90vh]">
              <DrawerHeader className="border-b pb-4">
                <DrawerTitle className="text-xl font-black text-gray-800 text-center">MEU CARRINHO</DrawerTitle>
              </DrawerHeader>
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{item.nome}</p>
                        <p className="text-xs text-blue-500 font-bold">R$ {(item.preco * item.qtd).toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-full">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-white shadow-sm" onClick={() => updateQtd(item.id, -1)}><Minus className="w-3 h-3 text-blue-500" /></Button>
                        <span className="font-black text-gray-800 text-xs w-4 text-center">{item.qtd}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-white shadow-sm" onClick={() => updateQtd(item.id, 1)}><Plus className="w-3 h-3 text-blue-500" /></Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-gray-400">Seu Nome</Label>
                    <Input value={clienteNome} onChange={e => setClienteNome(e.target.value)} className="h-12 rounded-xl border-gray-100 bg-gray-50" placeholder="Como podemos te chamar?" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-gray-400">WhatsApp</Label>
                    <Input value={clienteTelefone} onChange={e => setClienteTelefone(e.target.value)} className="h-12 rounded-xl border-gray-100 bg-gray-50" placeholder="Ex: 91988887777" />
                  </div>
                </div>
              </div>
              <DrawerFooter className="p-6">
                <Button 
                  onClick={handleFinishOrder}
                  disabled={!clienteNome || !clienteTelefone}
                  className="h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black text-base"
                >
                  FINALIZAR PEDIDO • R$ {total.toFixed(2).replace('.', ',')}
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost" className="text-gray-400 text-xs">Continuar Comprando</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around px-6 z-40">
        <div className="flex flex-col items-center text-blue-500">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1 uppercase">Início</span>
        </div>
        <div className="flex flex-col items-center text-gray-300">
          <Receipt className="w-6 h-6" />
          <span className="text-[10px] font-bold mt-1 uppercase">Pedidos</span>
        </div>
      </nav>
    </div>
  );
}
