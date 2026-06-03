export type MovementType = 'PIX' | 'CREDIT' | 'DEBIT' | 'DELIVERY' | 'CASH' | 'WITHDRAWAL' | 'EXPENSE';

export interface Movement {
  id: string;
  type: MovementType;
  value: number;
  description: string;
  observation?: string;
  timestamp: number;
  aiCategory?: string;
  aiSuggestions?: string[];
}

export interface DailyStats {
  totalPix: number;
  totalCredit: number;
  totalDebit: number;
  totalDelivery: number;
  totalCash: number;
  totalExpenses: number;
  netProfit: number;
}