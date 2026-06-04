"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { saveBrandSettings } from '@/lib/db';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Save, Building2, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const db = useFirestore();
  const brandRef = useMemo(() => db ? doc(db, 'settings', 'brand') : null, [db]);
  const { data: brand } = useDoc<any>(brandRef);

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (brand) {
      setName(brand.name || '');
      setLogoUrl(brand.logoUrl || '');
    }
  }, [brand]);

  const handleSave = () => {
    if (!db) return;
    saveBrandSettings(db, { name, logoUrl });
    toast({
      title: "Configurações salvas!",
      description: "A identidade visual foi atualizada com sucesso.",
      className: "bg-accent text-accent-foreground",
    });
  };

  const clearLogo = () => {
    setLogoUrl('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // Limite de 1MB para Firestore
        toast({
          variant: "destructive",
          title: "Arquivo muito grande",
          description: "Por favor, escolha uma imagem de até 1MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        toast({
          title: "Imagem carregada!",
          description: "O logotipo foi importado com sucesso. Não esqueça de salvar.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold text-white uppercase tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Personalize a identidade do seu sistema.</p>
      </div>

      <Card className="bg-card/40 border-white/5 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Identidade da Marca
          </CardTitle>
          <CardDescription>
            Defina o nome e o logotipo que aparecerão em todo o sistema e relatórios.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: ACAITERIA DELICIAS DO PARÁ"
              className="bg-background border-muted"
            />
          </div>

          <div className="space-y-4">
            <Label>Logotipo da Empresa</Label>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-3">
                <Input 
                  value={logoUrl} 
                  onChange={(e) => setLogoUrl(e.target.value)} 
                  placeholder="Link da imagem ou selecione um arquivo..."
                  className="bg-background border-muted flex-1"
                />
                
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-primary/50 text-primary hover:bg-primary/10"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={clearLogo} className="border-muted hover:bg-destructive/10 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="relative w-full aspect-video rounded-2xl bg-background border-2 border-dashed border-muted flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <Image 
                    src={logoUrl} 
                    alt="Preview Logo" 
                    fill 
                    className="object-contain p-4"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                    <p className="text-xs uppercase font-bold tracking-widest">Sem Logotipo</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full h-12 bg-primary font-bold text-lg rounded-xl">
            <Save className="w-5 h-5 mr-2" />
            SALVAR ALTERAÇÕES
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
