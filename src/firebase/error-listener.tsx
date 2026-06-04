
'use client';

import { useEffect } from 'react';
import { errorEmitter } from './error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: any) => {
      // Mostra um erro visual para o usuário
      toast({
        variant: "destructive",
        title: "Erro de Permissão no Firebase",
        description: "O banco de dados bloqueou a operação. Verifique se você publicou as 'Rules' no Console do Firebase.",
      });

      // Em desenvolvimento, ainda lançamos o erro para o overlay do Next.js
      if (process.env.NODE_ENV === 'development') {
        console.error("Firebase Permission Error:", error);
      }
    };

    errorEmitter.on('permission-error', handleError);
    return () => errorEmitter.off('permission-error', handleError);
  }, [toast]);

  return null;
}
