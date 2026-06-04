
import { Movement, BrandSettings } from './types';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  Firestore 
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export const saveMovement = async (db: Firestore, movement: Omit<Movement, 'id' | 'timestamp'>) => {
  if (!db) throw new Error("Banco de dados não conectado.");
  
  const movementsRef = collection(db, 'movements');
  const data = {
    ...movement,
    timestamp: Date.now(),
  };

  try {
    const docRef = await addDoc(movementsRef, data);
    return docRef;
  } catch (serverError: any) {
    console.error("Erro ao salvar no Firestore:", serverError);
    const permissionError = new FirestorePermissionError({
      path: 'movements',
      operation: 'create',
      requestResourceData: data,
    } satisfies SecurityRuleContext);
    
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
};

export const deleteMovement = async (db: Firestore, id: string) => {
  if (!db || !id) return;
  
  const docRef = doc(db, 'movements', id);
  try {
    await deleteDoc(docRef);
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
      path: `movements/${id}`,
      operation: 'delete',
    } satisfies SecurityRuleContext);
    
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
};

export const saveBrandSettings = async (db: Firestore, settings: BrandSettings) => {
  if (!db) return;
  
  const docRef = doc(db, 'settings', 'brand');
  try {
    await setDoc(docRef, settings, { merge: true });
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
      path: 'settings/brand',
      operation: 'update',
      requestResourceData: settings,
    } satisfies SecurityRuleContext);
    
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
};
