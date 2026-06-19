
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { saveProduct, deleteProduct } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2, Package, Sparkles, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const productsQuery = useMemo(() => (db ? query(collection(db, 'products')) : null), [db]);
  const { data: products = [] } = useCollection<Product>(productsQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mainProducts = useMemo(() => products.filter(p => p.categoria !== 'Complementos'), [products]);
  const complements = useMemo(() => products.filter(p => p.categoria === 'Complementos'), [products]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !editingProduct?.nome || editingProduct?.preco === undefined) return;
    
    await saveProduct(db, {
      nome: editingProduct.nome,
      preco: Number(editingProduct.preco),
      imagem: editingProduct.imagem || '',
      descricao: editingProduct.descricao || '',
      ativo: editingProduct.ativo ?? true,
      categoria: editingProduct.categoria || 'Geral'
    }, editingProduct.id);
    
    setEditingProduct(null);
    setIsDialogOpen(false);
    toast({ title: "Sucesso!", description: "Produto salvo com sucesso." });
  };

  const seedProducts = async () => {
    if (!db) return;
    const defaults = [
      // Açaí no Tamanho Certo!
      { nome: 'Açaí 200g', preco: 14.99, categoria: 'Açaí no Tamanho Certo!', descricao: 'Doce na medida! Porção perfeita para um momento rápido e delicioso: 200g de puro sabor!', imagem: 'https://picsum.photos/seed/acai200/600/400', ativo: true },
      { nome: 'Açaí 300g', preco: 17.99, categoria: 'Açaí no Tamanho Certo!', descricao: 'Pequeno, mas poderoso! A medida exata pra saborear com alegria e sem exagero.', imagem: 'https://picsum.photos/seed/acai300/600/400', ativo: true },
      { nome: 'Açaí 400g', preco: 22.99, categoria: 'Açaí no Tamanho Certo!', descricao: 'Alegria Generosa. Suficiente para dividir… se você quiser!', imagem: 'https://picsum.photos/seed/acai400/600/400', ativo: true },
      
      // Açaí Para Quem Ama Muito!
      { nome: 'Açaí 500g', preco: 26.99, categoria: 'Açaí Para Quem Ama Muito!', descricao: 'Meio quilo de alegria! Porção reforçada para aproveitar cada colherada.', imagem: 'https://picsum.photos/seed/acai500/600/400', ativo: true },
      { nome: 'Açaí 600g', preco: 32.99, categoria: 'Açaí Para Quem Ama Muito!', descricao: 'Festa No Pote! Ideal para quem não brinca em serviço.', imagem: 'https://picsum.photos/seed/acai600/600/400', ativo: true },
      { nome: 'Açaí 700g', preco: 36.99, categoria: 'Açaí Para Quem Ama Muito!', descricao: 'Um Mar De Energia! Uma onda gigante de açaí fresquinho.', imagem: 'https://picsum.photos/seed/acai700/600/400', ativo: true },
      { nome: 'Açaí 1kg', preco: 53.99, categoria: 'Açaí Para Quem Ama Muito!', descricao: 'Gigante do Pará! Um quilo de pura felicidade na sua mão.', imagem: 'https://picsum.photos/seed/acai1000/600/400', ativo: true },
      
      // Açaí Puro & Poderoso!
      { nome: 'Açaí Puro 500g', preco: 21.99, categoria: 'Açaí Puro & Poderoso!', descricao: 'Sabor Autêntico. Açaí na sua essência: puro, cremoso e geladinho, do jeitinho que você ama.', imagem: 'https://picsum.photos/seed/puro500/600/400', ativo: true },
      { nome: 'Açaí Puro 1kg', preco: 43.99, categoria: 'Açaí Puro & Poderoso!', descricao: 'O Clássico Gigante. Para os amantes do sabor Original do açaí.', imagem: 'https://picsum.photos/seed/puro1000/600/400', ativo: true },
      
      // Cremes dos Deuses
      { nome: 'Creme de Ninho', preco: 21.90, categoria: 'Cremes dos Deuses', descricao: 'Doce como abraço! Leve, cremoso e irresistível.', imagem: 'https://picsum.photos/seed/cremeninho/600/400', ativo: true },
      { nome: 'Creme de Morango', preco: 21.90, categoria: 'Cremes dos Deuses', descricao: 'Amor Gelado! Doce, suave e refrescante.', imagem: 'https://picsum.photos/seed/crememorango/600/400', ativo: true },
      { nome: 'Creme Abacaxi ao Vinho', preco: 21.90, categoria: 'Cremes dos Deuses', descricao: 'Exótico & refinado! Uma combinação elegante e refrescante.', imagem: 'https://picsum.photos/seed/cremeabacaxi/600/400', ativo: true },
      { nome: 'Creme Oreo', preco: 21.90, categoria: 'Cremes dos Deuses', descricao: 'Crocância e sabor! O biscoito mais amado no creme mais gostoso.', imagem: 'https://picsum.photos/seed/cremeoreo/600/400', ativo: true },
      { nome: 'Creme Cupuaçu', preco: 21.90, categoria: 'Cremes dos Deuses', descricao: 'Amazônia na colher! Azedinho e doce na medida.', imagem: 'https://picsum.photos/seed/cremecupuacu/600/400', ativo: true },
      { nome: 'Creme Kit Kat', preco: 21.90, categoria: 'Cremes dos Deuses', descricao: 'Crocante de alegria! Um mergulho no sabor com pedaços crocantes.', imagem: 'https://picsum.photos/seed/cremekitkat/600/400', ativo: true },
      { nome: 'Creme Fini', preco: 21.90, categoria: 'Cremes dos Deuses', descricao: 'Diversão em forma de doce! Colorido, divertido e docinho.', imagem: 'https://picsum.photos/seed/cremefini/600/400', ativo: true },
      { nome: 'Creme Maracujá', preco: 21.90, categoria: 'Cremes dos Deuses', descricao: 'Tropical e refrescante! Um toque ácido com cremosidade perfeita.', imagem: 'https://picsum.photos/seed/crememaracuja/600/400', ativo: true },
      
      // Açaí A Moda Paraense
      { nome: 'Polpa de Açaí Congelada', preco: 35.00, categoria: 'Açaí A Moda Paraense', descricao: 'Litro de polpa de açaí congelado original do Pará.', imagem: 'https://picsum.photos/seed/polpacongelada/600/400', ativo: true },

      // Complementos (Adicionais)
      { nome: 'Leite em Pó', preco: 2.50, categoria: 'Complementos', descricao: 'Leite Ninho em pó.', imagem: 'https://picsum.photos/seed/milk/600/400', ativo: true },
      { nome: 'Nutella', preco: 5.00, categoria: 'Complementos', descricao: 'Nutella original Ferrero.', imagem: 'https://picsum.photos/seed/nutella/600/400', ativo: true },
      { nome: 'Granola', preco: 1.50, categoria: 'Complementos', descricao: 'Mix de cereais crocantes.', imagem: 'https://picsum.photos/seed/granola/600/400', ativo: true }
    ];

    for (const p of defaults) {
      await saveProduct(db, p);
    }
    toast({ title: "Produtos Adicionados!", description: "O novo cardápio foi populado com sucesso." });
  };

  const openAddDialog = (category?: string) => {
    setEditingProduct({ nome: '', preco: 0, ativo: true, imagem: '', descricao: '', categoria: category || 'Geral' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-white uppercase tracking-tighter">GESTÃO DE <span className="text-accent">CARDÁPIO</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Organize seus itens e adicionais</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={seedProducts} variant="outline" className="border-accent/30 text-accent font-black rounded-2xl h-14 px-6 hover:bg-accent/10">
            <Sparkles className="w-5 h-5 mr-3" /> SUGERIR ITENS
          </Button>
          <Button onClick={() => openAddDialog()} className="bg-accent text-accent-foreground font-black rounded-2xl h-14 px-8 shadow-xl">
            <Plus className="w-5 h-5 mr-3" /> NOVO ITEM
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="bg-card border border-white/5 rounded-2xl p-1 h-16 w-full md:w-auto grid grid-cols-2 md:flex">
          <TabsTrigger value="products" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" /> PRODUTOS
          </TabsTrigger>
          <TabsTrigger value="complements" className="rounded-xl font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
            <Utensils className="w-4 h-4 mr-2" /> COMPLEMENTOS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-8">
          <ProductGrid products={mainProducts} onEdit={openEditDialog} onDelete={(id) => db && deleteProduct(db, id)} />
        </TabsContent>

        <TabsContent value="complements" className="mt-8">
          <div className="mb-6 flex justify-end">
             <Button onClick={() => openAddDialog('Complementos')} variant="outline" className="border-accent/20 text-accent font-bold">
               <Plus className="w-4 h-4 mr-2" /> ADICIONAR COMPLEMENTO
             </Button>
          </div>
          <ProductGrid products={complements} onEdit={openEditDialog} onDelete={(id) => db && deleteProduct(db, id)} />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-accent/20 rounded-[3rem] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase text-white tracking-tighter">
              {editingProduct?.id ? "EDITAR" : "NOVO"} <span className="text-accent">{editingProduct?.categoria === 'Complementos' ? 'COMPLEMENTO' : 'ITEM'}</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Nome</Label>
              <Input 
                value={editingProduct?.nome || ''} 
                onChange={e => setEditingProduct(prev => ({ ...prev, nome: e.target.value }))}
                className="bg-background border-white/10 h-12 rounded-xl" 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Preço (R$)</Label>
                <Input 
                  type="number" step="0.01"
                  value={editingProduct?.preco || ''} 
                  onChange={e => setEditingProduct(prev => ({ ...prev, preco: Number(e.target.value) }))}
                  className="bg-background border-white/10 h-12 rounded-xl" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Categoria</Label>
                <Input 
                  value={editingProduct?.categoria || ''} 
                  onChange={e => setEditingProduct(prev => ({ ...prev, categoria: e.target.value }))}
                  className="bg-background border-white/10 h-12 rounded-xl" 
                  placeholder="Ex: Açaí no Copo"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold text-white uppercase">Disponível</Label>
                <p className="text-[10px] text-muted-foreground">Visível no cardápio online</p>
              </div>
              <Switch 
                checked={editingProduct?.ativo ?? true}
                onCheckedChange={checked => setEditingProduct(prev => ({ ...prev, ativo: checked }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">URL da Imagem</Label>
              <Input 
                value={editingProduct?.imagem || ''} 
                onChange={e => setEditingProduct(prev => ({ ...prev, imagem: e.target.value }))}
                className="bg-background border-white/10 h-12 rounded-xl text-xs" 
                placeholder="https://..." 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Descrição</Label>
              <Textarea 
                value={editingProduct?.descricao || ''} 
                onChange={e => setEditingProduct(prev => ({ ...prev, descricao: e.target.value }))}
                className="bg-background border-white/10 h-24 rounded-xl resize-none" 
              />
            </div>
            <Button type="submit" className="w-full h-14 bg-accent text-accent-foreground font-black uppercase rounded-2xl shadow-xl shadow-accent/20">
              SALVAR NO CARDÁPIO
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductGrid({ products, onEdit, onDelete }: { products: Product[], onEdit: (p: Product) => void, onDelete: (id: string) => void }) {
  if (products.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/5">
        <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Nenhum item nesta seção</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <Card key={product.id} className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 transition-all hover:scale-[1.02]">
          <div className="relative h-40 w-full bg-black/40">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
            <Image 
              src={product.imagem || `https://picsum.photos/seed/${product.id}/600/400`} 
              alt={product.nome} 
              fill 
              className={product.ativo ? "object-cover opacity-80" : "object-cover opacity-30 grayscale"} 
              unoptimized 
            />
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <Badge className={product.ativo ? "bg-accent text-accent-foreground" : "bg-destructive text-white"}>
                {product.ativo ? "ATIVO" : "INATIVO"}
              </Badge>
            </div>
          </div>
          <CardContent className="p-8">
            <div className="mb-4">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">{product.categoria}</span>
              <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{product.nome}</h3>
              <p className="text-2xl font-black text-accent">R$ {product.preco.toFixed(2)}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl border-white/10 text-white" onClick={() => onEdit(product)}>
                <Edit2 className="w-4 h-4 mr-2" /> EDITAR
              </Button>
              <Button variant="outline" className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10" onClick={() => onDelete(product.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
