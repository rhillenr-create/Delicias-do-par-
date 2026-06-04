
'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { AlertCircle, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseInstance, setFirebaseInstance] = useState<{
    firebaseApp: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
  } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
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
              // Se houver erro de API Key ou Provedor, mostramos a tela de erro
              if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/operation-not-allowed') {
                setIsAuthReady(false);
              } else {
                setIsAuthReady(true); // Tenta prosseguir para outros erros
              }
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

  if (authError && (authError.includes('api-key-not-valid') || authError.includes('operation-not-allowed'))) {
    const isApiKeyError = authError.includes('api-key-not-valid');

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 font-body">
        <div className="max-w-md w-full bg-card border-2 border-destructive/20 p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-destructive" />
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Atenção Necessária</h1>
            <p className="text-sm text-muted-foreground">
              {isApiKeyError 
                ? "Sua chave de conexão (API Key) está inválida ou expirada." 
                : "O login anônimo não está ativado no seu Firebase."}
            </p>
          </div>

          <div className="bg-black/40 p-6 rounded-3xl border border-white/5 space-y-4">
            <p className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2">
              <Settings className="w-3 h-3" /> Como resolver:
            </p>
            <ol className="text-xs text-muted-foreground space-y-3 list-decimal ml-4">
              {isApiKeyError ? (
                <>
                  <li className="pl-2">Vá ao <b>Console do Firebase</b> do seu projeto.</li>
                  <li className="pl-2">Clique no ícone de <b>Engrenagem</b> &gt; Configurações do Projeto.</li>
                  <li className="pl-2">Copie a <b>Chave de API da Web</b> real.</li>
                  <li className="pl-2">Cole no arquivo <code>src/firebase/config.ts</code>.</li>
                </>
              ) : (
                <>
                  <li className="pl-2">No Console, vá em <b>Authentication</b>.</li>
                  <li className="pl-2">Acesse <b>Sign-in method</b>.</li>
                  <li className="pl-2">Ative o provedor <b>Anônimo</b> e salve.</li>
                </>
              )}
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-accent font-black tracking-widest uppercase text-xs">Conectando ao Caixa...</p>
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
