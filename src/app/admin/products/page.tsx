
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { saveProduct, deleteProduct } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2, Check, X, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

export default function AdminProductsPage() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const productsQuery = useMemo(() => (db ? query(collection(db, 'products')) : null), [db]);
  const { data: products = [] } = useCollection<Product>(productsQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !editingProduct?.nome || !editingProduct?.preco) return;
    
    await saveProduct(db, {
      nome: editingProduct.nome,
      preco: Number(editingProduct.preco),
      imagem: editingProduct.imagem || '',
      descricao: editingProduct.descricao || '',
      ativo: editingProduct.ativo ?? true,
      categoria: editingProduct.categoria || ''
    }, editingProduct.id);
    
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const openAddDialog = () => {
    setEditingProduct({ nome: '', preco: 0, ativo: true, imagem: '', descricao: '', categoria: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-white uppercase tracking-tighter">GESTÃO DE <span className="text-accent">CARDÁPIO</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Adicione e edite seus produtos</p>
        </div>
        <Button onClick={openAddDialog} className="bg-accent text-accent-foreground font-black rounded-2xl h-14 px-8 shadow-xl">
          <Plus className="w-5 h-5 mr-3" /> NOVO PRODUTO
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.id} className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 transition-all hover:scale-[1.02]">
            <div className="relative h-40 w-full bg-black/40">
              {product.imagem ? (
                <Image src={product.imagem} alt={product.nome} fill className="object-cover opacity-60" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20"><Package className="w-12 h-12" /></div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className={product.ativo ? "bg-accent text-accent-foreground" : "bg-destructive text-white"}>
                  {product.ativo ? "ATIVO" : "INATIVO"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-white mb-2">{product.nome}</h3>
              <p className="text-2xl font-black text-accent mb-4">R$ {product.preco.toFixed(2)}</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl border-white/10 text-white" onClick={() => openEditDialog(product)}>
                  <Edit2 className="w-4 h-4 mr-2" /> EDITAR
                </Button>
                <Button variant="outline" className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10" onClick={() => db && deleteProduct(db, product.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-accent/20 rounded-[3rem] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase text-white tracking-tighter">
              {editingProduct?.id ? "EDITAR" : "NOVO"} <span className="text-accent">PRODUTO</span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Nome</Label>
              <Input 
                value={editingProduct?.nome || ''} 
                onChange={e => setEditingProduct(prev => ({ ...prev, nome: e.target.value }))}
                className="bg-background border-white/10" 
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
                  className="bg-background border-white/10" 
                  required 
                />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Status Ativo</Label>
                <Switch 
                  checked={editingProduct?.ativo ?? true}
                  onCheckedChange={checked => setEditingProduct(prev => ({ ...prev, ativo: checked }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">URL da Imagem</Label>
              <Input 
                value={editingProduct?.imagem || ''} 
                onChange={e => setEditingProduct(prev => ({ ...prev, imagem: e.target.value }))}
                className="bg-background border-white/10" 
                placeholder="https://..." 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Descrição</Label>
              <Textarea 
                value={editingProduct?.descricao || ''} 
                onChange={e => setEditingProduct(prev => ({ ...prev, descricao: e.target.value }))}
                className="bg-background border-white/10 h-24" 
              />
            </div>
            <Button type="submit" className="w-full h-14 bg-accent text-accent-foreground font-black uppercase rounded-2xl">
              SALVAR PRODUTO
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
