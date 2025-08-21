import { useState, useEffect } from 'react';
import { Balance, Denomination, Movement, AddMovementRequest, AddMovementResponse } from '../types/cashFlow';

const API_BASE = 'http://localhost:5000/api/cashflow';

export const useCashFlow = () => {
  const [balance, setBalance] = useState<number>(0);
  const [denominations, setDenominations] = useState<Denomination[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/balance`);
      if (!response.ok) throw new Error('Error al obtener el saldo');
      const data: Balance = await response.json();
      setBalance(data.total_balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const fetchDenominations = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/denominations`);
      if (!response.ok) throw new Error('Error al obtener denominaciones');
      const data: Denomination[] = await response.json();
      setDenominations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const fetchMovements = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/movements`);
      if (!response.ok) throw new Error('Error al obtener movimientos');
      const data: Movement[] = await response.json();
      setMovements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const addMovement = async (movementData: AddMovementRequest): Promise<AddMovementResponse> => {
    try {
      const response = await fetch(`${API_BASE}/movement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movementData),
      });

      if (!response.ok) throw new Error('Error al agregar movimiento');
      
      const data: AddMovementResponse = await response.json();
      setBalance(data.new_balance);
      
      // Recargar movimientos para obtener la lista actualizada
      await fetchMovements();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    }
  };

  const loadInitialData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchBalance(),
        fetchDenominations(),
        fetchMovements()
      ]);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async (): Promise<void> => {
    await loadInitialData();
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    balance,
    denominations,
    movements,
    loading,
    error,
    addMovement,
    refresh,
    fetchBalance,
    fetchDenominations,
    fetchMovements
  };
};