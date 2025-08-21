export interface Balance {
  total_balance: number;
}

export interface Denomination {
  id: number;
  value: number;
  quantity: number;
}

export interface Movement {
  id: number;
  amount: number;
  type: 'ingreso' | 'gasto';
  origin: 'manual' | 'escaneo';
  date: string;
}

export interface AddMovementRequest {
  amount: number;
  type: 'ingreso' | 'gasto';
}

export interface AddMovementResponse {
  message: string;
  new_balance: number;
}