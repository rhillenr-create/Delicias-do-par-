
import { Movement, BrandSettings, Product, Order, OrderStatus } from './types';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  Firestore 
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

// MOVEMENTS
export const saveMovement = async (db: Firestore, movement: Omit<Movement, 'id' | 'timestamp'>) => {
  if (!db) throw new Error("Banco de dados não conectado.");
  const movementsRef = collection(db, 'movements');
  const data = { ...movement, timestamp: Date.now() };
  try {
    return await addDoc(movementsRef, data);
  } catch (serverError: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: 'movements', operation: 'create', requestResourceData: data
    }));
    throw serverError;
  }
};

export const deleteMovement = async (db: Firestore, id: string) => {
  if (!db || !id) return;
  const docRef = doc(db, 'movements', id);
  try {
    await deleteDoc(docRef);
  } catch (serverError: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: `movements/${id}`, operation: 'delete'
    }));
    throw serverError;
  }
};

// SETTINGS
export const saveBrandSettings = async (db: Firestore, settings: BrandSettings) => {
  if (!db) return;
  const docRef = doc(db, 'settings', 'brand');
  try {
    await setDoc(docRef, settings, { merge: true });
  } catch (serverError: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: 'settings/brand', operation: 'update', requestResourceData: settings
    }));
    throw serverError;
  }
};

// PRODUCTS
export const saveProduct = async (db: Firestore, product: Omit<Product, 'id'>, id?: string) => {
  if (!db) return;
  try {
    if (id) {
      const docRef = doc(db, 'products', id);
      await setDoc(docRef, product, { merge: true });
    } else {
      await addDoc(collection(db, 'products'), product);
    }
  } catch (serverError: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: 'products', operation: id ? 'update' : 'create', requestResourceData: product
    }));
  }
};

export const deleteProduct = async (db: Firestore, id: string) => {
  if (!db || !id) return;
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (serverError: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: `products/${id}`, operation: 'delete'
    }));
  }
};

// ORDERS
export const createOrder = async (db: Firestore, order: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
  if (!db) return;
  const data = {
    ...order,
    status: 'novo',
    createdAt: Date.now(),
  };
  try {
    return await addDoc(collection(db, 'orders'), data);
  } catch (serverError: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: 'orders', operation: 'create', requestResourceData: data
    }));
  }
};

export const updateOrderStatus = async (db: Firestore, id: string, status: OrderStatus) => {
  if (!db || !id) return;
  try {
    await updateDoc(doc(db, 'orders', id), { status });
  } catch (serverError: any) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: `orders/${id}`, operation: 'update', requestResourceData: { status }
    }));
  }
};
