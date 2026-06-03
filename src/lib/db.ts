import { Movement, BrandSettings } from './types';

const MOVEMENTS_KEY = 'acailume_movements';
const BRAND_KEY = 'acailume_brand';

export const getMovements = (): Movement[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(MOVEMENTS_KEY);
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
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('movementsUpdated'));
  return newMovement;
};

export const updateMovement = (id: string, updates: Partial<Movement>): void => {
  const movements = getMovements();
  const updated = movements.map(m => m.id === id ? { ...m, ...updates } : m);
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('movementsUpdated'));
};

export const deleteMovement = (id: string): void => {
  const movements = getMovements();
  const updated = movements.filter(m => m.id !== id);
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('movementsUpdated'));
};

export const getBrandSettings = (): BrandSettings => {
  if (typeof window === 'undefined') return { name: 'Minha Empresa', logoUrl: '' };
  const stored = localStorage.getItem(BRAND_KEY);
  return stored ? JSON.parse(stored) : { name: 'Minha Empresa', logoUrl: '' };
};

export const saveBrandSettings = (settings: BrandSettings): void => {
  localStorage.setItem(BRAND_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event('brandUpdated'));
};
