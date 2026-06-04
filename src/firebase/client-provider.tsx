
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
            .catch((error) => {
              console.error("Erro crítico de autenticação:", error);
              // Em ambiente de desenvolvimento, permitimos prosseguir para ver erros do Firestore
              setIsAuthReady(true);
            });
        } else {
          setIsAuthReady(true);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Erro ao inicializar Firebase:", error);
    }
  }, []);

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
