export type Shop = {
  id: string;
  name: string;
  createdAt?: any;
};

export type Engineer = {
  id?: string;
  fullName: string;
  phone?: string;
  workshop?: string;
  notes?: string;
  createdAt?: any;
};

export type Product = {
  id?: string;
  name: string;
  category?: string;
  model?: string;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold?: number;
  createdAt?: any;
};

export type TransactionRecord = {
  id?: string;
  txnNumber: string;
  engineerId: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  amountPaid: number;
  outstanding: number;
  status: "PAID" | "PARTIALLY_PAID" | "UNPAID";
  createdAt?: any;
};

export type Payment = {
  id?: string;
  engineerId: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
  createdAt?: any;
};
