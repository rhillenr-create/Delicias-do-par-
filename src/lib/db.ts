import { Movement, MovementType } from './types';

const STORAGE_KEY = 'acailume_movements';

export const getMovements = (): Movement[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
};

export const saveMovement = (movement: Omit<Movement, 'id' | 'timestamp'>): Movement => {
  const movements = getMovements();
  const newMovement: Movement = {
    ...movement,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  
  const updated = [newMovement, ...movements];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('movementsUpdated'));
  return newMovement;
};

export const updateMovement = (id: string, updates: Partial<Movement>): void => {
  const movements = getMovements();
  const updated = movements.map(m => m.id === id ? { ...m, ...updates } : m);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('movementsUpdated'));
};

export const deleteMovement = (id: string): void => {
  const movements = getMovements();
  const updated = movements.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('movementsUpdated'));
};