
'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

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
              setAuthError(error.message);
              // Permitimos prosseguir para ver erros de permissão no Firestore se necessário
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

  if (authError && authError.includes('api-key-not-valid')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border-2 border-destructive p-8 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">Erro de Configuração</h1>
          <p className="text-sm text-muted-foreground">A sua <b>Chave de API</b> do Firebase é inválida ou não foi configurada.</p>
          <div className="bg-black/40 p-4 rounded-xl text-left">
            <p className="text-[10px] font-bold text-destructive uppercase mb-2">Como Resolver:</p>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal ml-4">
              <li>Acesse o <b>Console do Firebase</b>.</li>
              <li>Vá em <b>Configurações do Projeto</b>.</li>
              <li>Copie a <b>Chave de API da Web</b> real.</li>
              <li>Cole no arquivo <code>src/firebase/config.ts</code>.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!firebaseInstance || !isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(104,255,54,0.3)]" />
          <div className="space-y-2 text-center">
            <p className="text-accent font-black tracking-[0.2em] uppercase text-xs">Conectando ao Sistema</p>
            <p className="text-muted-foreground text-[10px] uppercase font-bold">Verificando Credenciais...</p>
          </div>
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
