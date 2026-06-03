
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

export const saveMovement = (db: Firestore, movement: Omit<Movement, 'id' | 'timestamp'>) => {
  const movementsRef = collection(db, 'movements');
  const data = {
    ...movement,
    timestamp: Date.now(),
  };

  addDoc(movementsRef, data)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: 'movements',
        operation: 'create',
        requestResourceData: data,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
};

export const deleteMovement = (db: Firestore, id: string) => {
  const docRef = doc(db, 'movements', id);
  deleteDoc(docRef)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: `movements/${id}`,
        operation: 'delete',
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
};

export const saveBrandSettings = (db: Firestore, settings: BrandSettings) => {
  const docRef = doc(db, 'settings', 'brand');
  setDoc(docRef, settings, { merge: true })
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: 'settings/brand',
        operation: 'update',
        requestResourceData: settings,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
};
