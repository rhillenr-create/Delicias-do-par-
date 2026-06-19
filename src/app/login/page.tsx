
'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Loader2 } from 'lucide-react';
import Image from 'next/image';

const LOGO = "https://gitlab.com/rhillenr-create/teste-iptv/-/raw/main/delicias_do_para.png";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Bem-vindo de volta!",
        description: "Login realizado com sucesso.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description: "E-mail ou senha incorretos.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="glass-card w-full max-w-md rounded-[3rem] border-white/5 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
        <CardHeader className="space-y-4 pt-10 text-center">
          <div className="relative w-24 h-20 mx-auto mb-2">
            <Image src={LOGO} alt="Logo" fill className="object-contain" unoptimized />
          </div>
          <CardTitle className="text-3xl font-headline font-black text-white uppercase tracking-tighter">
            ACESSO <span className="text-accent">RESTRITO</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
            Entre para gerenciar seu caixa e pedidos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">E-mail Administrativo</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="h-14 bg-background border-white/5 pl-12 rounded-2xl text-white"
                    placeholder="admin@acaiteria.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                  <Input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="h-14 bg-background border-white/5 pl-12 rounded-2xl text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-accent text-accent-foreground font-black text-xl rounded-2xl shadow-xl shadow-accent/20 active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'ENTRAR NO SISTEMA'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
