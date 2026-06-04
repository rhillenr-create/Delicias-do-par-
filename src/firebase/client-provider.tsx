'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { AlertCircle, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const LOGO_URL = "https://gitlab.com/rhillenr-create/teste-iptv/-/raw/main/delicias_do_para.png";

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [firebaseInstance, setFirebaseInstance] = useState<{
    firebaseApp: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
  } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const instance = initializeFirebase();
      setFirebaseInstance(instance);

      const unsubscribe = onAuthStateChanged(instance.auth, (user) => {
        if (!user) {
          signInAnonymously(instance.auth)
            .then(() => {
              setIsAuthReady(true);
            })
            .catch((error: any) => {
              console.error("Erro de autenticação:", error);
              setAuthError(error.code || error.message);
              setIsAuthReady(true);
            });
        } else {
          setIsAuthReady(true);
        }
      });

      return () => unsubscribe();
    } catch (error: any) {
      console.error("Erro ao inicializar Firebase:", error);
      setAuthError(error.message);
    }
  }, []);

  // Evita erro de hidratação renderizando o mesmo conteúdo básico no servidor e cliente inicial
  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  if (authError && (authError.includes('api-key-not-valid') || authError.includes('operation-not-allowed') || authError.includes('invalid-api-key'))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 font-body">
        <div className="max-w-md w-full bg-card border-2 border-destructive/20 p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-destructive" />
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Erro de Conexão</h1>
            <p className="text-sm text-muted-foreground">
              O sistema não conseguiu se conectar ao banco de dados do Google.
            </p>
          </div>

          <div className="bg-black/40 p-6 rounded-3xl border border-white/5 space-y-4">
            <p className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2">
              <Settings className="w-3 h-3" /> Soluções possíveis:
            </p>
            <ol className="text-xs text-muted-foreground space-y-3 list-decimal ml-4">
              <li className="pl-2">Verifique se o <b>Login Anônimo</b> está ATIVADO no Console do Firebase.</li>
              <li className="pl-2">Confirme se a <b>API Key</b> no arquivo <code>config.ts</code> está correta.</li>
              <li className="pl-2">Verifique se você criou o banco <b>Firestore Database</b> no console.</li>
            </ol>
          </div>

          <Button 
            onClick={() => window.location.reload()} 
            className="w-full h-14 bg-white text-black hover:bg-white/90 font-black rounded-2xl"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            TENTAR NOVAMENTE
          </Button>
        </div>
      </div>
    );
  }

  if (!firebaseInstance || !isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="flex flex-col items-center gap-10">
          <div className="relative w-48 h-40 md:w-64 md:h-52 animate-bounce">
            <Image 
              src={LOGO_URL} 
              alt="Açaíteria Delícias do Pará" 
              fill 
              className="object-contain" 
              unoptimized
            />
          </div>
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(104,255,54,0.4)]" />
        </div>
        
        <div className="absolute bottom-8 left-8 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(104,255,54,0.8)]" />
          <p className="text-accent font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">
            Conectando ao Caixa...
          </p>
        </div>
      </div>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseInstance.firebaseApp}
      firestore={firebaseInstance.firestore}
      auth={firebaseInstance.auth}
    >
      {children}
    </FirebaseProvider>
  );
};