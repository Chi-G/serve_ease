export type ServiceType = 'eat-in' | 'take-away';

export interface CartItem {
  id: string | number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  serviceType: ServiceType;
  image: string;
  isProtein?: boolean;
  customerName: string;
  notes?: string;
}

export interface Order {
  id: number;
  table_id: number;
  customer_id?: number;
  total_price: number;
  status: 'pending' | 'paid' | 'in-kitchen' | 'ready' | 'served' | 'completed' | 'cancelled';
  queue_number: string;
  tokenNumber?: string | number;
  estimatedTime?: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  customer?: {
    id: number;
    name: string;
    phone_number?: string;
  };
  table?: {
    id: number;
    table_num: string;
  };
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  customer_name: string;
  quantity: number;
  price: number;
  serving_style: ServiceType;
  notes?: string;
  product?: {
    id: number;
    name: string;
    image_url: string;
  };
}
