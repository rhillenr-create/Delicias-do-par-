
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useDoc, useFirestore } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Product, OrderItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Search, Share2, Home, Receipt, Utensils, Check, X, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createOrder } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const DEFAULT_LOGO = "https://gitlab.com/rhillenr-create/teste-iptv/-/raw/6a0cd7fe4b63fecad5f17a1eca98207bff5faa39/delicias_do_para.png";

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
    <div className="min-h-screen bg-[#f1f1f1] pb-32 font-body">
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

      <div className="max-w-4xl mx-auto p-4 space-y-12">
        {orderedCategories.map((category) => (
          <section key={category} className="space-y-6">
            <h2 className="text-xl font-black text-[#4a148c] pl-4 border-l-8 border-[#68ff36] leading-none uppercase tracking-tighter">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedProducts[category].map(product => (
                <MenuCard key={product.id} product={product} onAdd={() => handleProductClick(product)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Drawer open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DrawerContent className="bg-white rounded-t-[3rem] h-[95vh] flex flex-col">
          <DrawerHeader className="border-b shrink-0">
            <div className="flex justify-between items-center">
               <div>
                  <DrawerTitle className="text-2xl font-black text-[#4a148c] uppercase tracking-tighter">Montar meu {selectedProduct?.nome}</DrawerTitle>
                  <p className="text-xs text-muted-foreground font-bold">Personalize do seu jeito</p>
               </div>
               <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-gray-100"><X className="w-5 h-5" /></Button>
               </DrawerClose>
            </div>
          </DrawerHeader>
          
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-10 py-6">
              {currentComplementCategories.map((cat) => (
                <div key={cat.id} className="space-y-4">
                  <div className="flex justify-between items-end border-b pb-2">
                    <div>
                      <h3 className="font-black text-gray-800 text-base uppercase">{cat.title}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">{cat.description}</p>
                    </div>
                    <Badge className={cn(
                      "font-black uppercase text-[10px] h-6 px-3",
                      (tempComplements[cat.id]?.length || 0) === cat.max ? "bg-[#68ff36] text-[#4a148c]" : "bg-[#4a148c] text-white"
                    )}>
                      {tempComplements[cat.id]?.length || 0}/{cat.max}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {cat.items.map((item) => {
                      const isSelected = tempComplements[cat.id]?.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleComplement(cat.id, item, cat.max)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all relative overflow-hidden",
                            isSelected 
                              ? "border-[#68ff36] bg-[#68ff36]/5 shadow-sm" 
                              : "border-gray-100 bg-gray-50 hover:bg-white"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-[#68ff36] text-[#4a148c] rounded-full p-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative">
                            <Image 
                              src={`https://picsum.photos/seed/${item}/100/100`} 
                              alt={item} 
                              fill 
                              className="object-cover" 
                              unoptimized 
                            />
                          </div>
                          <span className={cn(
                            "text-[9px] font-black uppercase text-center leading-tight h-6 flex items-center",
                            isSelected ? "text-[#4a148c]" : "text-gray-600"
                          )}>
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DrawerFooter className="border-t p-6 bg-gray-50 shrink-0">
            <Button 
              onClick={finalizeCustomization}
              className="w-full h-16 rounded-[2rem] bg-[#4a148c] text-white font-black text-lg uppercase tracking-tighter flex justify-between px-8"
            >
              <span>Confirmar Montagem</span>
              <span>R$ {selectedProduct?.preco.toFixed(2)}</span>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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
              <ScrollArea className="max-h-[60vh] p-8">
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex flex-col py-4 border-b border-gray-50 gap-2">
                      <div className="flex items-center justify-between">
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
                      {item.complements && (
                        <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                          {item.complements.map((c, idx) => (
                            <div key={idx} className="flex flex-wrap gap-1 items-center">
                              <span className="text-[9px] font-black uppercase text-gray-400">{c.category}:</span>
                              {c.items.map((i, iidx) => (
                                <Badge key={iidx} variant="outline" className="text-[8px] border-[#4a148c]/20 text-[#4a148c] bg-white h-4">{i}</Badge>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-6 pt-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nome do Cliente</Label>
                    <Input value={clienteNome} onChange={e => setClienteNome(e.target.value)} className="h-14 rounded-2xl border-gray-100 bg-gray-50 font-bold" placeholder="Como te chamamos?" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Seu WhatsApp</Label>
                    <Input value={clienteTelefone} onChange={e => setClienteTelefone(e.target.value)} className="h-14 rounded-2xl border-gray-100 bg-gray-50 font-bold" placeholder="(91) 9XXXX-XXXX" />
                  </div>
                </div>
              </ScrollArea>
              <DrawerFooter className="p-8 border-t">
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

function MenuCard({ product, onAdd }: { product: Product, onAdd: () => void }) {
  return (
    <div 
      onClick={onAdd}
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
          <div className="bg-[#68ff36] text-[#4a148c] p-1.5 rounded-full group-hover:rotate-90 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div className="relative w-28 h-28 rounded-[2rem] overflow-hidden bg-gray-50 flex-shrink-0 shadow-lg border-2 border-white transition-transform group-hover:scale-105">
        <Image 
          src={product.imagem || `https://picsum.photos/seed/${product.id}/300/300`} 
          alt={product.nome} 
          fill 
          className="object-cover"
          unoptimized
        />
      </div>
    </div>
  );
}
