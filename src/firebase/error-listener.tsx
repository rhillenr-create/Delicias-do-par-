
'use client';

import { useEffect } from 'react';
import { errorEmitter } from './error-emitter';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: any) => {
      // Throw the error as an uncaught exception for the Next.js overlay to pick up during dev
      // or handle it according to your app's needs.
      throw error;
    };

    errorEmitter.on('permission-error', handleError);
    return () => errorEmitter.off('permission-error', handleError);
  }, []);

  return null;
}
