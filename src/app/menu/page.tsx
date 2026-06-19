
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useDoc, useFirestore } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Product, OrderItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Search, Share2, Home, Receipt, Utensils, Check, X, ChevronRight, Clock, MapPin, Store, CreditCard, Banknote, Smartphone } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  
  // Checkout States
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState<'entrega' | 'retirada'>('entrega');
  const [endereco, setEndereco] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');
  const [valorTroco, setValorTroco] = useState('');

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
    setSelectedProduct(product);
    setTempComplements({});
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

    setCart(prev => [...prev, {
      id: `${selectedProduct.id}-${Date.now()}`,
      nome: selectedProduct.nome,
      preco: selectedProduct.preco,
      qtd: 1,
      complements: complementsArray
    }]);

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
    if (tipoEntrega === 'entrega' && !endereco) {
      toast({ title: "Endereço incompleto", description: "Por favor, informe seu endereço para entrega.", variant: "destructive" });
      return;
    }

    const orderData = {
      clienteNome,
      clienteTelefone,
      itens: cart,
      total,
      pagamento: formaPagamento,
      tipoEntrega,
      endereco: tipoEntrega === 'entrega' ? endereco : '',
      troco: formaPagamento === 'dinheiro' ? (parseFloat(valorTroco) || 0) : 0
    };

    createOrder(db, orderData);
    
    let itensMsg = cart.map(i => {
      let msg = `*${i.qtd}x ${i.nome}*`;
      if (i.complements) {
        i.complements.forEach(c => {
          msg += `\n  _${c.category}:_ ${c.items.join(', ')}`;
        });
      }
      return msg;
    }).join('\n\n');

    const pgtoLabel = formaPagamento === 'pix' ? 'PIX' : formaPagamento === 'cartao' ? 'Cartão (Máquina)' : 'Dinheiro';
    const trocoMsg = (formaPagamento === 'dinheiro' && valorTroco) ? `\n*Troco para:* R$ ${valorTroco}` : '';
    const entregaMsg = tipoEntrega === 'entrega' ? `*Entrega:* ${endereco}` : '*Retirada no Balcão*';

    const msg = `*NOVO PEDIDO - ${brand?.name || 'AÇAÍ DELICIAS DO PARA'}*\n\n*Cliente:* ${clienteNome}\n*Tel:* ${clienteTelefone}\n\n*Pedido:*\n${itensMsg}\n\n${entregaMsg}\n*Pagamento:* ${pgtoLabel}${trocoMsg}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const zapLink = `https://wa.me/55${clienteTelefone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    
    window.open(zapLink, '_blank');
    setCart([]);
    setClienteNome('');
    setClienteTelefone('');
    setEndereco('');
    setValorTroco('');
    toast({ title: "Pedido Enviado!", description: "Seu pedido foi registrado com sucesso." });
  };

  const currentComplementCategories = useMemo(() => {
    if (!selectedProduct) return [];
    return selectedProduct.categoria === 'Cremes dos Deuses' ? CREME_COMPLEMENTS : ACAI_COMPLEMENTS;
  }, [selectedProduct]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pb-32 font-body">
      <header className="bg-card/60 backdrop-blur-2xl px-6 h-24 flex items-center justify-between sticky top-0 z-40 border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-14 bg-background rounded-2xl overflow-hidden relative border border-accent/20">
            <Image src={brand?.logoUrl || DEFAULT_LOGO} alt="Logo" fill className="object-contain p-1" unoptimized />
          </div>
          <div>
            <h1 className="font-headline font-black text-xl text-white tracking-tighter uppercase leading-none">{brand?.name || 'Açaí Delícias do Pará'}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Aberto agora</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-16 mt-8">
        {orderedCategories.map((category) => (
          <section key={category} className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-2 h-8 bg-accent rounded-full" />
               <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tighter">{category}</h2>
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
        <DrawerContent className="bg-card border-t border-accent/20 rounded-t-[3rem] h-[92vh] flex flex-col">
          <DrawerHeader className="border-b border-white/5 shrink-0 px-8 py-6">
            <div className="flex justify-between items-center">
               <DrawerTitle className="text-3xl font-headline font-black text-white uppercase tracking-tighter">
                Personalizar <span className="text-accent">{selectedProduct?.nome}</span>
               </DrawerTitle>
               <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 h-12 w-12"><X className="w-6 h-6 text-white" /></Button>
               </DrawerClose>
            </div>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-8">
            <div className="space-y-12 pb-10">
              {currentComplementCategories.map((cat) => (
                <div key={cat.id} className="space-y-6">
                  <div className="flex justify-between items-end border-b border-white/5 pb-3">
                    <div className="space-y-1">
                      <h3 className="font-headline font-black text-white text-lg uppercase tracking-tight">{cat.title}</h3>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{cat.description}</p>
                    </div>
                    <Badge className={cn("font-black uppercase text-[10px] h-7 px-4 rounded-xl", (tempComplements[cat.id]?.length || 0) === cat.max ? "bg-accent text-accent-foreground" : "bg-white/5 text-white")}>
                      {tempComplements[cat.id]?.length || 0} / {cat.max}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cat.items.map((item) => {
                      const isSelected = tempComplements[cat.id]?.includes(item);
                      return (
                        <button key={item} onClick={() => toggleComplement(cat.id, item, cat.max)} className={cn("flex items-center justify-between p-5 rounded-2xl border transition-all", isSelected ? "border-accent bg-accent/10" : "border-white/5 bg-white/5")}>
                          <span className={cn("text-xs font-black uppercase tracking-tight", isSelected ? "text-accent" : "text-white/70")}>{item}</span>
                          {isSelected ? <div className="bg-accent text-accent-foreground rounded-lg p-1.5 ml-3"><Check className="w-3.5 h-3.5" /></div> : <div className="w-5 h-5 rounded-lg border border-white/10 ml-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DrawerFooter className="border-t border-white/5 p-8 bg-card/60 backdrop-blur-3xl shrink-0">
            <Button onClick={finalizeCustomization} className="w-full h-18 rounded-3xl bg-accent text-accent-foreground font-black text-xl uppercase tracking-tighter flex justify-between px-10">
              <span>Confirmar Montagem</span>
              <span>R$ {selectedProduct?.preco.toFixed(2)}</span>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {cart.length > 0 && (
        <div className="fixed bottom-10 left-0 right-0 px-8 z-50 flex justify-center no-print">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="w-full max-w-xl h-20 rounded-[2.5rem] bg-accent text-accent-foreground font-headline font-black shadow-2xl flex justify-between px-10 transition-all active:scale-95">
                <div className="flex items-center gap-5">
                  <div className="bg-accent-foreground text-accent w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black">{cart.reduce((a, b) => a + b.qtd, 0)}</div>
                  <span className="tracking-[0.2em] uppercase text-xs font-black">Minha Sacola</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-px h-8 bg-accent-foreground/20" />
                  <span className="text-xl">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-card border-t border-accent/20 rounded-t-[3.5rem] max-h-[92vh] flex flex-col">
              <DrawerHeader className="border-b border-white/5 pb-8 px-8 shrink-0">
                <DrawerTitle className="text-3xl font-headline font-black text-white text-center tracking-tighter uppercase">Minha <span className="text-accent">Sacola</span></DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 p-8">
                <div className="space-y-10 pb-10">
                  {/* Itens do Carrinho */}
                  <div className="space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex flex-col py-6 border-b border-white/5 gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-headline font-black text-white text-lg uppercase">{item.nome}</p>
                            <p className="text-sm text-accent font-black">R$ {(item.preco * item.qtd).toFixed(2).replace('.', ',')}</p>
                          </div>
                          <div className="flex items-center gap-5 bg-white/5 p-2 rounded-2xl">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => updateQtd(item.id, -1)}><Minus className="w-4 h-4" /></Button>
                            <span className="font-black text-white">{item.qtd}</span>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => updateQtd(item.id, 1)}><Plus className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Informações do Cliente */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Informações de Contato</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input value={clienteNome} onChange={e => setClienteNome(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-white/5 text-white" placeholder="Seu Nome" />
                        <Input value={clienteTelefone} onChange={e => setClienteTelefone(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-white/5 text-white" placeholder="Seu WhatsApp" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Onde quer receber?</Label>
                      <RadioGroup value={tipoEntrega} onValueChange={(v) => setTipoEntrega(v as any)} className="grid grid-cols-2 gap-4">
                        <div className={cn("flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer", tipoEntrega === 'entrega' ? "bg-accent/10 border-accent text-accent" : "bg-white/5 border-white/5 text-white/50")} onClick={() => setTipoEntrega('entrega')}>
                          <MapPin className="w-5 h-5" />
                          <span className="text-xs font-black uppercase">Entrega</span>
                          <RadioGroupItem value="entrega" className="hidden" />
                        </div>
                        <div className={cn("flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer", tipoEntrega === 'retirada' ? "bg-accent/10 border-accent text-accent" : "bg-white/5 border-white/5 text-white/50")} onClick={() => setTipoEntrega('retirada')}>
                          <Store className="w-5 h-5" />
                          <span className="text-xs font-black uppercase">Retirada</span>
                          <RadioGroupItem value="retirada" className="hidden" />
                        </div>
                      </RadioGroup>
                    </div>

                    {tipoEntrega === 'entrega' && (
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Endereço Completo</Label>
                        <Input value={endereco} onChange={e => setEndereco(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-white/5 text-white" placeholder="Rua, Número, Bairro, Referência" />
                      </div>
                    )}

                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Forma de Pagamento</Label>
                      <RadioGroup value={formaPagamento} onValueChange={(v) => setFormaPagamento(v as any)} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className={cn("flex items-center gap-3 p-4 rounded-2xl border cursor-pointer", formaPagamento === 'pix' ? "border-accent bg-accent/10 text-accent" : "bg-white/5 border-white/5 text-white/50")} onClick={() => setFormaPagamento('pix')}>
                          <Smartphone className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">PIX</span>
                        </div>
                        <div className={cn("flex items-center gap-3 p-4 rounded-2xl border cursor-pointer", formaPagamento === 'cartao' ? "border-accent bg-accent/10 text-accent" : "bg-white/5 border-white/5 text-white/50")} onClick={() => setFormaPagamento('cartao')}>
                          <CreditCard className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">Cartão (Máquina)</span>
                        </div>
                        <div className={cn("flex items-center gap-3 p-4 rounded-2xl border cursor-pointer", formaPagamento === 'dinheiro' ? "border-accent bg-accent/10 text-accent" : "bg-white/5 border-white/5 text-white/50")} onClick={() => setFormaPagamento('dinheiro')}>
                          <Banknote className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">Dinheiro</span>
                        </div>
                      </RadioGroup>
                    </div>

                    {formaPagamento === 'dinheiro' && (
                      <div className="space-y-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Precisa de troco para quanto?</Label>
                        <Input type="number" value={valorTroco} onChange={e => setValorTroco(e.target.value)} className="h-12 rounded-xl bg-background border-white/5 text-accent font-black" placeholder="Ex: 50,00" />
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
              <DrawerFooter className="p-8 border-t border-white/5 bg-card/40 backdrop-blur-2xl shrink-0">
                <Button onClick={handleFinishOrder} disabled={!clienteNome || !clienteTelefone || (tipoEntrega === 'entrega' && !endereco) || cart.length === 0} className="h-20 rounded-[2.5rem] bg-accent text-accent-foreground font-black text-xl shadow-2xl uppercase tracking-tighter disabled:opacity-20">
                  Confirmar Pedido • R$ {total.toFixed(2).replace('.', ',')}
                </Button>
                <DrawerClose asChild><Button variant="ghost" className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[9px] mt-2">Continuar Comprando</Button></DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
}

function MenuCard({ product, onAdd }: { product: Product, onAdd: () => void }) {
  return (
    <div onClick={onAdd} className="glass-card rounded-[2.5rem] p-6 flex gap-6 cursor-pointer hover:border-accent/40 transition-all active:scale-95 group relative overflow-hidden">
      <div className="flex-1 flex flex-col justify-between relative z-10 py-1">
        <div>
          <h3 className="font-headline font-black text-white text-lg leading-tight uppercase tracking-tight group-hover:text-accent transition-colors">{product.nome}</h3>
          <p className="text-[11px] text-muted-foreground/70 mt-3 line-clamp-2 leading-relaxed font-medium">{product.descricao}</p>
        </div>
        <div className="flex items-center gap-4 mt-5">
          <span className="bg-white/5 border border-white/10 text-white px-5 py-2 rounded-2xl text-sm font-black tracking-tight">R$ {product.preco.toFixed(2).replace('.', ',')}</span>
          <div className="bg-accent text-accent-foreground p-2 rounded-xl group-hover:rotate-90 transition-all shadow-lg"><Plus className="w-5 h-5" /></div>
        </div>
      </div>
      <div className="relative w-32 h-32 rounded-[2.5rem] overflow-hidden bg-black/40 flex-shrink-0 border-2 border-white/5 group-hover:scale-105 transition-all">
        <Image src={product.imagem || `https://picsum.photos/seed/${product.id}/300/300`} alt={product.nome} fill className="object-cover opacity-80" unoptimized />
      </div>
    </div>
  );
}
