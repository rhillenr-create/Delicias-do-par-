"use client";

import { useState, useEffect } from 'react';
import { getBrandSettings, saveBrandSettings } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Save, Building2, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const brand = getBrandSettings();
    setName(brand.name);
    setLogoUrl(brand.logoUrl);
  }, []);

  const handleSave = () => {
    saveBrandSettings({ name, logoUrl });
    toast({
      title: "Configurações salvas!",
      description: "A identidade visual foi atualizada com sucesso.",
      className: "bg-accent text-accent-foreground",
    });
  };

  const clearLogo = () => {
    setLogoUrl('');
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
              placeholder="Ex: Açaí Delícias do Pará"
              className="bg-background border-muted"
            />
          </div>

          <div className="space-y-4">
            <Label>Logotipo da Empresa</Label>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Input 
                  value={logoUrl} 
                  onChange={(e) => setLogoUrl(e.target.value)} 
                  placeholder="Cole o link da sua imagem aqui..."
                  className="bg-background border-muted flex-1"
                />
                <Button variant="outline" size="icon" onClick={clearLogo} className="border-muted hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="relative w-full aspect-video rounded-2xl bg-muted/20 border-2 border-dashed border-muted flex items-center justify-center overflow-hidden">
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
              <p className="text-[10px] text-muted-foreground italic">
                Dica: Você pode usar links de imagens públicas do Google Drive, Dropbox ou links diretos.
              </p>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full h-12 bg-primary font-bold text-lg">
            <Save className="w-5 h-5 mr-2" />
            SALVAR ALTERAÇÕES
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
