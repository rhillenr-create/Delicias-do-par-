
'use client';

import React, { useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

export const FirebaseClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseInstance, setFirebaseInstance] = useState<{
    firebaseApp: FirebaseApp;
    firestore: Firestore;
    auth: Auth;
  } | null>(null);

  useEffect(() => {
    const instance = initializeFirebase();
    setFirebaseInstance(instance);
  }, []);

  if (!firebaseInstance) {
    return null; // Or a loading spinner
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
