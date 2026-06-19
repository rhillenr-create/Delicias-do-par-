
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
  whatsapp: string;
}

export type OrderStatus = 'novo' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado';

export interface Product {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  descricao: string;
  ativo: boolean;
  categoria?: string;
}

export interface OrderItem {
  id: string;
  nome: string;
  preco: number;
  qtd: number;
  complements?: {
    category: string;
    items: string[];
  }[];
}

export interface Order {
  id: string;
  userId?: string;
  clienteNome: string;
  clienteTelefone: string;
  itens: OrderItem[];
  total: number;
  status: OrderStatus;
  pagamento: string;
  tipoEntrega: 'entrega' | 'retirada';
  endereco?: string;
  troco?: number;
  taxaEntrega?: number;
  createdAt: number;
}
