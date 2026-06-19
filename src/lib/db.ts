
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
export function saveMovement(db: Firestore, movement: Omit<Movement, 'id' | 'timestamp'>) {
  if (!db) return;
  const movementsRef = collection(db, 'movements');
  const data = { ...movement, timestamp: Date.now() };
  addDoc(movementsRef, data)
    .catch(async (serverError: any) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'movements', operation: 'create', requestResourceData: data
      }));
    });
}

export function deleteMovement(db: Firestore, id: string) {
  if (!db || !id) return;
  const docRef = doc(db, 'movements', id);
  deleteDoc(docRef)
    .catch(async (serverError: any) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: `movements/${id}`, operation: 'delete'
      }));
    });
}

// SETTINGS
export function saveBrandSettings(db: Firestore, settings: BrandSettings) {
  if (!db) return;
  const docRef = doc(db, 'settings', 'brand');
  setDoc(docRef, settings, { merge: true })
    .catch(async (serverError: any) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'settings/brand', operation: 'update', requestResourceData: settings
      }));
    });
}

// PRODUCTS
export function saveProduct(db: Firestore, product: Omit<Product, 'id'>, id?: string) {
  if (!db) return;
  if (id) {
    const docRef = doc(db, 'products', id);
    setDoc(docRef, product, { merge: true })
      .catch(async (serverError: any) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: `products/${id}`, operation: 'update', requestResourceData: product
        }));
      });
  } else {
    addDoc(collection(db, 'products'), product)
      .catch(async (serverError: any) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'products', operation: 'create', requestResourceData: product
        }));
      });
  }
}

export function deleteProduct(db: Firestore, id: string) {
  if (!db || !id) return;
  deleteDoc(doc(db, 'products', id))
    .catch(async (serverError: any) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: `products/${id}`, operation: 'delete'
      }));
    });
}

// ORDERS
export function createOrder(db: Firestore, order: Omit<Order, 'id' | 'status' | 'createdAt'>) {
  if (!db) return;
  const data = {
    ...order,
    status: 'novo',
    createdAt: Date.now(),
  };
  addDoc(collection(db, 'orders'), data)
    .catch(async (serverError: any) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: 'orders', operation: 'create', requestResourceData: data
      }));
    });
}

export function updateOrderStatus(db: Firestore, id: string, status: OrderStatus) {
  if (!db || !id) return;
  updateDoc(doc(db, 'orders', id), { status })
    .catch(async (serverError: any) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: `orders/${id}`, operation: 'update', requestResourceData: { status }
      }));
    });
}
