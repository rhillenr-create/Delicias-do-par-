
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
import { Image as ImageIcon, Save, Building2, Trash2, Upload, Phone } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const db = useFirestore();
  const brandRef = useMemo(() => db ? doc(db, 'settings', 'brand') : null, [db]);
  const { data: brand } = useDoc<any>(brandRef);

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (brand) {
      setName(brand.name || '');
      setLogoUrl(brand.logoUrl || '');
      setWhatsapp(brand.whatsapp || '');
    }
  }, [brand]);

  const handleSave = () => {
    if (!db) return;
    saveBrandSettings(db, { name, logoUrl, whatsapp });
    toast({
      title: "Configurações salvas!",
      description: "A identidade visual e contatos foram atualizados com sucesso.",
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
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-headline font-black text-white uppercase tracking-tighter">CONFIGURAÇÕES <span className="text-accent">DO SISTEMA</span></h1>
        <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Personalize a identidade da sua Açaíteria</p>
      </div>

      <Card className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="flex items-center gap-3 text-white font-black uppercase text-lg">
            <Building2 className="w-6 h-6 text-accent" />
            Identidade & Contato
          </CardTitle>
          <CardDescription className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
            Defina como sua marca aparece para os clientes.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nome da Empresa</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ex: ACAITERIA DELICIAS DO PARÁ"
                className="h-14 bg-background border-white/5 rounded-2xl text-white font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">WhatsApp de Recebimento (com DDD)</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                <Input 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)} 
                  placeholder="Ex: 5591999999999"
                  className="h-14 bg-background border-white/5 rounded-2xl pl-12 text-white font-bold"
                />
              </div>
              <p className="text-[9px] text-muted-foreground">O número para onde os pedidos serão enviados.</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Logotipo Oficial</Label>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-3">
                <Input 
                  value={logoUrl} 
                  onChange={(e) => setLogoUrl(e.target.value)} 
                  placeholder="Link da imagem..."
                  className="h-12 bg-background border-white/5 rounded-xl text-xs flex-1"
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
                    className="h-12 rounded-xl border-accent/20 text-accent font-bold hover:bg-accent/10"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    UPLOAD
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={clearLogo} className="h-12 w-12 rounded-xl border-white/10 hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              
              <div className="relative w-full aspect-video rounded-[2rem] bg-black/40 border-2 border-dashed border-white/5 flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <Image 
                    src={logoUrl} 
                    alt="Preview Logo" 
                    fill 
                    className="object-contain p-8"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-muted-foreground opacity-20">
                    <ImageIcon className="w-16 h-16" />
                    <p className="text-[10px] uppercase font-black tracking-[0.3em]">Visualização Indisponível</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full h-16 bg-accent text-accent-foreground font-black text-xl rounded-2xl shadow-xl shadow-accent/20 active:scale-95 transition-all">
            <Save className="w-6 h-6 mr-3" />
            SALVAR ALTERAÇÕES
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
