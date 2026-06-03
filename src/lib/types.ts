export type MovementType = 'PIX' | 'CREDITO' | 'DEBITO' | 'DELIVERY' | 'DINHEIRO' | 'WITHDRAWAL' | 'DESPESAS';

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

export interface BrandSettings {
  name: string;
  logoUrl: string;
}

export interface DailyStats {
  totalPix: number;
  totalCredito: number;
  totalDebito: number;
  totalDelivery: number;
  totalDinheiro: number;
  totalDespesas: number;
  netProfit: number;
}
