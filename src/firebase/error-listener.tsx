
'use client';

import { useEffect } from 'react';
import { errorEmitter } from './error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: any) => {
      // Mostra um erro visual crítico para o usuário
      toast({
        variant: "destructive",
        title: "ERRO DE GRAVAÇÃO!",
        description: "Os dados NÃO foram salvos no Google. Verifique se você publicou as 'Rules' no Console do Firebase conforme o README.",
      });

      // Em desenvolvimento, logamos o erro detalhado
      if (process.env.NODE_ENV === 'development') {
        console.error("Firebase Permission Error Details:", error);
      }
    };

    errorEmitter.on('permission-error', handleError);
    return () => errorEmitter.off('permission-error', handleError);
  }, [toast]);

  return null;
}
