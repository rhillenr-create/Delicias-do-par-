
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useDoc, useFirestore } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Product, OrderItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Search, Share2, Home, Receipt, Utensils, Check, X, ChevronRight, Clock } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createOrder } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const DEFAULT_LOGO = "https://gitlab.com/rhillenr-create/teste-iptv/-/raw/main/delicias_do_para.png";

const CATEGORY_ORDER = [
  "Açaí no Tamanho Certo!",
  "Açaí Para Quem Ama Muito!",
  "Açaí Puro & Poderoso!",
  "Cremes dos Deuses",
  "Açaí A Moda Paraense"
];

const ACAI_COMPLEMENTS = [
  {
    id: 'base_acai',
    title: 'Escolha seu açaí',
    description: 'Escolha 1 item',
    max: 1,
    items: ['Açai Tradicional', 'Açaí Premium']
  },
  {
    id: 'cremes',
    title: 'Escolha seu creme favorito',
    description: 'Escolha até 2 itens',
    max: 2,
    items: ['Creme De Ninho', 'Creme De Morango', 'Creme De Abacaxi Ao Vinho', 'Creme De Cupuaçu', 'Creme De Kit Kat', 'Creme Finne', 'Creme De Maracujá']
  },
  {
    id: 'toppings',
    title: 'Topping pra ficar mais gostoso!',
    description: 'Escolha até 3 itens',
    max: 3,
    items: ['Skocopow', 'Paçoquinha', 'Ovomaltine', 'Nutella', 'Morango em calda', 'Marshmallow', 'Leite em pó', 'Jujuba', 'Granulado', 'Granola', 'Gota de chocolate', 'Finne', 'Fine', 'Disquete', 'Creme de cookeis', 'Cereja', 'Castanha', 'Brigadeiro']
  },
  {
    id: 'frutas',
    title: 'Escolha uma fruta pra dar aquele up!',
    description: 'Escolha até 1 item',
    max: 1,
    items: ['Morango', 'Banana com leite condensado']
  },
  {
    id: 'coberturas',
    title: 'Que tal uma cobertura para finalizar!',
    description: 'Escolha até 2 itens',
    max: 2,
    items: ['Calda de chocolate', 'Charope de Guaraná', 'Leite condensado', 'Calda de beijinho - Finni', 'Calda de dentadura - Finni', 'Calda de banana - Finni', 'Calda de morango', 'Doce de leite', 'Mel']
  },
  {
    id: 'montagem',
    title: 'Como você deseja a montagem do seu açaí?',
    description: 'Escolha até 1 item',
    max: 1,
    items: ['Quero Mais Açaí', 'Quero Mais Recheio']
  }
];

const CREME_COMPLEMENTS = [
  {
    id: 'tamanho_creme',
    title: 'Escolha o tamanho de sua preferência',
    description: 'Escolha 1 item',
    max: 1,
    items: ['Creme 300g', 'Creme 500g (R$ 13,00)', 'Creme 700g (R$ 25,00)', 'Creme 1k (R$ 39,00)']
  },
  {
    id: 'toppings_creme',
    title: 'Topping pra ficar mais gostoso!',
    description: 'Escolha até 3 itens',
    max: 3,
    items: ['Skocopow', 'Paçoquinha', 'Ovomaltine', 'Nutella', 'Morango em calda', 'Marshmallow', 'Leite em pó', 'Jujuba', 'Granulado', 'Granola', 'Gota de chocolate', 'Finne', 'Fine', 'Disquete', 'Creme de cookeis', 'Cereja', 'Castanha', 'Brigadeiro']
  },
  {
    id: 'frutas_creme',
    title: 'Escolha uma fruta pra dar aquele up!',
    description: 'Escolha até 1 item',
    max: 1,
    items: ['Morango', 'Banana com leite condensado']
  },
  {
    id: 'coberturas_creme',
    title: 'Que tal uma cobertura para finalizar!',
    description: 'Escolha até 2 itens',
    max: 2,
    items: ['Calda de chocolate', 'Charope de Guaraná', 'Leite condensado', 'Calda de beijinho - Finni', 'Calda de dentadura - Finni', 'Calda de banana - Finni', 'Calda de morango', 'Doce de leite', 'Mel']
  },
  {
    id: 'montagem_creme',
    title: 'Como você deseja a montagem do seu creme??',
    description: 'Escolha até 1 item',
    max: 1,
    items: ['Quero Mais Creme', 'Quero Mais Recheio']
  }
];

export default function MenuPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tempComplements, setTempComplements] = useState<{ [key: string]: string[] }>({});

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

  const mainProducts = useMemo(() => products.filter(p => p.categoria !== 'Complementos'), [products]);

  const groupedProducts = useMemo(() => {
    const groups: { [key: string]: Product[] } = {};
    mainProducts.forEach(p => {
      const cat = p.categoria || 'Geral';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [mainProducts]);

  const orderedCategories = useMemo(() => {
    const categories = Object.keys(groupedProducts);
    const ordered = CATEGORY_ORDER.filter(cat => categories.includes(cat));
    const others = categories.filter(cat => !CATEGORY_ORDER.includes(cat));
    return [...ordered, ...others];
  }, [groupedProducts]);

  const handleProductClick = (product: Product) => {
    if (product.categoria === 'Complementos') {
      quickAddToCart(product);
    } else {
      setSelectedProduct(product);
      setTempComplements({});
    }
  };

  const quickAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && !item.complements);
      if (existing) {
        return prev.map(item => item.id === product.id && !item.complements ? { ...item, qtd: item.qtd + 1 } : item);
      }
      return [...prev, { id: product.id, nome: product.nome, preco: product.preco, qtd: 1 }];
    });
    toast({ title: "Adicionado!", description: `${product.nome} está no carrinho.` });
  };

  const toggleComplement = (categoryId: string, item: string, max: number) => {
    setTempComplements(prev => {
      const current = prev[categoryId] || [];
      if (current.includes(item)) {
        return { ...prev, [categoryId]: current.filter(i => i !== item) };
      }
      if (current.length >= max) {
        toast({ title: "Limite atingido", description: `Escolha no máximo ${max} itens nesta categoria.`, variant: "destructive" });
        return prev;
      }
      return { ...prev, [categoryId]: [...current, item] };
    });
  };

  const finalizeCustomization = () => {
    if (!selectedProduct) return;

    const activeComplements = selectedProduct.categoria === 'Cremes dos Deuses' ? CREME_COMPLEMENTS : ACAI_COMPLEMENTS;

    const complementsArray = Object.entries(tempComplements).map(([catId, items]) => ({
      category: activeComplements.find(c => c.id === catId)?.title || catId,
      items
    })).filter(c => c.items.length > 0);

    setCart(prev => [
      ...prev,
      {
        id: `${selectedProduct.id}-${Date.now()}`,
        nome: selectedProduct.nome,
        preco: selectedProduct.preco,
        qtd: 1,
        complements: complementsArray
      }
    ]);

    setSelectedProduct(null);
    setTempComplements({});
    toast({ title: "Adicionado!", description: "Sua montagem foi adicionada ao carrinho." });
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
    
    let itensMsg = cart.map(i => {
      let msg = `*${i.qtd}x ${i.nome}* (R$ ${i.preco.toFixed(2)})`;
      if (i.complements) {
        i.complements.forEach(c => {
          msg += `\n  _${c.category}:_ ${c.items.join(', ')}`;
        });
      }
      return msg;
    }).join('\n\n');

    const msg = `*NOVO PEDIDO - ${brand?.name || 'AÇAÍ DELICIAS DO PARA'}*\n\n*Cliente:* ${clienteNome}\n*Tel:* ${clienteTelefone}\n\n*Itens:*\n${itensMsg}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const zapLink = `https://wa.me/55${clienteTelefone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    
    window.open(zapLink, '_blank');
    setCart([]);
    setClienteNome('');
    setClienteTelefone('');
    toast({ title: "Pedido Enviado!", description: "Seu pedido foi registrado com sucesso." });
  };

  const currentComplementCategories = useMemo(() => {
    if (!selectedProduct) return [];
    return selectedProduct.categoria === 'Cremes dos Deuses' ? CREME_COMPLEMENTS : ACAI_COMPLEMENTS;
  }, [selectedProduct]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pb-32 font-body selection:bg-accent selection:text-accent-foreground">
      <header className="bg-card/60 backdrop-blur-2xl px-6 h-24 flex items-center justify-between sticky top-0 z-40 border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-14 bg-background rounded-2xl overflow-hidden relative border border-accent/20 shadow-xl">
            <Image src={brand?.logoUrl || DEFAULT_LOGO} alt="Logo" fill className="object-contain p-1" unoptimized />
          </div>
          <div>
            <h1 className="font-headline font-black text-xl text-white tracking-tighter uppercase leading-none">{brand?.name || 'Açaí Delícias do Pará'}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(104,255,54,0.8)]" />
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Aberto agora</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/5 rounded-full h-12 w-12 border border-white/5">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/5 rounded-full h-12 w-12 border border-white/5">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="bg-card/20 backdrop-blur-md border-b border-white/5 px-8 py-5 flex justify-between items-center shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.3em]">Entrega estimada</span>
          <div className="flex items-center gap-2 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span className="text-sm font-black text-white">30 - 45 MIN</span>
          </div>
        </div>
        <div className="h-10 w-px bg-white/5" />
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-[0.3em]">Pedido mínimo</span>
          <span className="text-sm font-black text-white">R$ 15,00</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-16 mt-8">
        {orderedCategories.map((category) => (
          <section key={category} className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-2 h-8 bg-accent rounded-full shadow-[0_0_15px_rgba(104,255,54,0.4)]" />
               <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tighter">
                {category}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedProducts[category].map(product => (
                <MenuCard key={product.id} product={product} onAdd={() => handleProductClick(product)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Drawer open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DrawerContent className="bg-card border-t border-accent/20 rounded-t-[3rem] h-[92vh] flex flex-col overflow-hidden">
          <DrawerHeader className="border-b border-white/5 shrink-0 px-8 py-6">
            <div className="flex justify-between items-center">
               <div className="space-y-1">
                  <DrawerTitle className="text-3xl font-headline font-black text-white uppercase tracking-tighter">
                    Montar meu <span className="text-accent">{selectedProduct?.nome}</span>
                  </DrawerTitle>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Personalize do seu jeito</p>
               </div>
               <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 border border-white/10 h-12 w-12 hover:bg-white/10">
                    <X className="w-6 h-6 text-white" />
                  </Button>
               </DrawerClose>
            </div>
          </DrawerHeader>
          
          <ScrollArea className="flex-1">
            <div className="p-8 space-y-12">
              {currentComplementCategories.map((cat) => (
                <div key={cat.id} className="space-y-6">
                  <div className="flex justify-between items-end border-b border-white/5 pb-3">
                    <div className="space-y-1">
                      <h3 className="font-headline font-black text-white text-lg uppercase tracking-tight">{cat.title}</h3>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{cat.description}</p>
                    </div>
                    <Badge className={cn(
                      "font-black uppercase text-[10px] h-7 px-4 rounded-xl tracking-widest transition-all duration-300",
                      (tempComplements[cat.id]?.length || 0) === cat.max 
                        ? "bg-accent text-accent-foreground shadow-[0_0_15px_rgba(104,255,54,0.3)]" 
                        : "bg-white/5 text-white border border-white/10"
                    )}>
                      {tempComplements[cat.id]?.length || 0} / {cat.max}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cat.items.map((item) => {
                      const isSelected = tempComplements[cat.id]?.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleComplement(cat.id, item, cat.max)}
                          className={cn(
                            "flex items-center justify-between p-5 rounded-2xl border transition-all relative overflow-hidden text-left group",
                            isSelected 
                              ? "border-accent bg-accent/10 shadow-[inset_0_0_20px_rgba(104,255,54,0.1)]" 
                              : "border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-white/10"
                          )}
                        >
                          <span className={cn(
                            "text-xs font-black uppercase tracking-tight flex-1",
                            isSelected ? "text-accent" : "text-white/70 group-hover:text-white"
                          )}>
                            {item}
                          </span>
                          {isSelected ? (
                            <div className="bg-accent text-accent-foreground rounded-lg p-1.5 ml-3 shadow-[0_0_10px_rgba(104,255,54,0.4)]">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-lg border border-white/10 ml-3 group-hover:border-white/30" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DrawerFooter className="border-t border-white/5 p-8 bg-card/60 backdrop-blur-3xl shrink-0">
            <Button 
              onClick={finalizeCustomization}
              className="w-full h-18 rounded-3xl bg-accent text-accent-foreground hover:bg-accent/90 font-headline font-black text-xl uppercase tracking-tighter flex justify-between px-10 shadow-2xl shadow-accent/20 transition-all active:scale-95"
            >
              <span>Confirmar Montagem</span>
              <div className="flex items-center gap-3">
                <div className="w-px h-6 bg-accent-foreground/20" />
                <span>R$ {selectedProduct?.preco.toFixed(2)}</span>
              </div>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {cart.length > 0 && (
        <div className="fixed bottom-28 left-0 right-0 px-8 z-50 flex justify-center no-print">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full max-w-xl h-20 rounded-[2.5rem] bg-accent hover:bg-accent/90 text-accent-foreground font-headline font-black shadow-2xl flex justify-between px-10 border-t-2 border-white/20 transition-all active:scale-95 animate-in slide-in-from-bottom-12 duration-500">
                <div className="flex items-center gap-5">
                  <div className="bg-accent-foreground text-accent w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shadow-xl">
                    {cart.reduce((a, b) => a + b.qtd, 0)}
                  </div>
                  <span className="tracking-[0.2em] uppercase text-xs font-black">Sacola de Pedidos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-px h-8 bg-accent-foreground/20" />
                  <span className="text-xl">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-card border-t border-accent/20 rounded-t-[3.5rem] max-h-[92vh]">
              <DrawerHeader className="border-b border-white/5 pb-8 px-8">
                <DrawerTitle className="text-3xl font-headline font-black text-white text-center tracking-tighter uppercase">Minha <span className="text-accent">Sacola</span></DrawerTitle>
                <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-1">Confira seus itens antes de pedir</p>
              </DrawerHeader>
              <ScrollArea className="max-h-[55vh] p-8">
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex flex-col py-6 border-b border-white/5 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-headline font-black text-white text-lg uppercase tracking-tight">{item.nome}</p>
                          <p className="text-sm text-accent font-black mt-0.5">R$ {(item.preco * item.qtd).toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div className="flex items-center gap-5 bg-white/5 p-2 rounded-2xl border border-white/5">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-white/5 text-white hover:bg-white/10" onClick={() => updateQtd(item.id, -1)}><Minus className="w-4 h-4" /></Button>
                          <span className="font-black text-white text-base w-6 text-center">{item.qtd}</span>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-white/5 text-white hover:bg-white/10" onClick={() => updateQtd(item.id, 1)}><Plus className="w-4 h-4" /></Button>
                        </div>
                      </div>
                      {item.complements && (
                        <div className="bg-white/[0.03] p-5 rounded-[2rem] border border-white/5 space-y-4">
                          {item.complements.map((c, idx) => (
                            <div key={idx} className="space-y-2">
                              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest">{c.category}</span>
                              <div className="flex flex-wrap gap-2">
                                {c.items.map((i, iidx) => (
                                  <Badge key={iidx} variant="outline" className="text-[10px] font-bold border-accent/20 text-accent bg-accent/5 px-3 py-1 rounded-lg">{i}</Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-8 pt-10">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-2">Quem está pedindo?</Label>
                    <Input 
                      value={clienteNome} 
                      onChange={e => setClienteNome(e.target.value)} 
                      className="h-16 rounded-3xl border-white/5 bg-white/5 font-bold text-white placeholder:text-white/20 px-6 focus:ring-accent" 
                      placeholder="Seu nome completo" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-2">WhatsApp para Contato</Label>
                    <Input 
                      value={clienteTelefone} 
                      onChange={e => setClienteTelefone(e.target.value)} 
                      className="h-16 rounded-3xl border-white/5 bg-white/5 font-bold text-white placeholder:text-white/20 px-6 focus:ring-accent" 
                      placeholder="(91) 9XXXX-XXXX" 
                    />
                  </div>
                </div>
              </ScrollArea>
              <DrawerFooter className="p-8 border-t border-white/5 bg-card/40 backdrop-blur-2xl">
                <Button 
                  onClick={handleFinishOrder}
                  disabled={!clienteNome || !clienteTelefone || cart.length === 0}
                  className="h-20 rounded-[2.5rem] bg-accent hover:bg-accent/90 text-accent-foreground font-headline font-black text-xl shadow-2xl uppercase tracking-tighter disabled:opacity-20 transition-all active:scale-95"
                >
                  Confirmar Pedido • R$ {total.toFixed(2).replace('.', ',')}
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost" className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[9px] hover:text-white mt-2">Continuar Escolhendo</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-card/60 backdrop-blur-3xl border-t border-white/5 h-24 flex items-center justify-around px-12 z-40 shadow-[0_-15px_40px_rgba(0,0,0,0.4)] no-print">
        <div className="flex flex-col items-center text-accent transition-all">
          <div className="bg-accent/10 p-3.5 rounded-2xl shadow-[0_0_20px_rgba(104,255,54,0.1)] border border-accent/20">
            <Home className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-black mt-2 uppercase tracking-[0.2em]">Cardápio</span>
        </div>
        <div className="flex flex-col items-center text-muted-foreground/40 hover:text-white transition-all group">
          <div className="p-3.5 rounded-2xl group-hover:bg-white/5 transition-all">
            <Receipt className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-black mt-2 uppercase tracking-[0.2em]">Pedidos</span>
        </div>
      </nav>
    </div>
  );
}

function MenuCard({ product, onAdd }: { product: Product, onAdd: () => void }) {
  return (
    <div 
      onClick={onAdd}
      className="glass-card rounded-[2.5rem] p-6 flex gap-6 cursor-pointer hover:border-accent/40 transition-all active:scale-95 group relative overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl transition-all group-hover:bg-accent/10" />
      
      <div className="flex-1 flex flex-col justify-between relative z-10 py-1">
        <div>
          <h3 className="font-headline font-black text-white text-lg leading-tight uppercase tracking-tight group-hover:text-accent transition-colors">{product.nome}</h3>
          <p className="text-[11px] text-muted-foreground/70 mt-3 line-clamp-2 leading-relaxed font-medium">
            {product.descricao || 'Sabor autêntico do Pará, preparado com carinho.'}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-5">
          <span className="bg-white/5 border border-white/10 text-white px-5 py-2 rounded-2xl text-sm font-black tracking-tight">
            R$ {product.preco.toFixed(2).replace('.', ',')}
          </span>
          <div className="bg-accent text-accent-foreground p-2 rounded-xl group-hover:rotate-90 transition-all shadow-[0_0_15px_rgba(104,255,54,0.2)]">
            <Plus className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="relative w-32 h-32 rounded-[2.5rem] overflow-hidden bg-black/40 flex-shrink-0 shadow-2xl border-2 border-white/5 transition-all group-hover:scale-105 group-hover:border-accent/20">
        <Image 
          src={product.imagem || `https://picsum.photos/seed/${product.id}/300/300`} 
          alt={product.nome} 
          fill 
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          unoptimized
        />
      </div>
    </div>
  );
}
