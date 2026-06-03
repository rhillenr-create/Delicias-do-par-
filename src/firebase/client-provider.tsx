
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
    const instance = initializeFirebase();
    setFirebaseInstance(instance);

    // Garante que o usuário esteja autenticado (mesmo que anonimamente) para gravar no Firestore
    const unsubscribe = onAuthStateChanged(instance.auth, (user) => {
      if (!user) {
        signInAnonymously(instance.auth).catch((error) => {
          console.error("Erro ao autenticar anonimamente:", error);
        });
      } else {
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!firebaseInstance || !isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-accent font-black tracking-widest uppercase text-xs">Iniciando Sistema...</p>
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
