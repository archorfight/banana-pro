/**
 * Client-side hooks for credit system
 */

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

interface CreditsResponse {
  credits: number;
  has_account: boolean;
}

interface UseCreditsResult {
  credits: number | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to get and manage user credits
 */
export function useCredits(): UseCreditsResult {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/credits');

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated
          setCredits(0);
          return;
        }
        throw new Error('Failed to fetch credits');
      }

      const data: CreditsResponse = await response.json();
      setCredits(data.credits);
    } catch (err) {
      console.error('Error fetching credits:', err);
      setError('Failed to load credits');
      setCredits(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return {
    credits,
    loading,
    error,
    refresh: fetchCredits
  };
}

/**
 * Hook to deduct credits with automatic UI update
 */
export function useCreditDeduction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deduct = async (
    amount: number,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; remaining?: number; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/credits/deduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, description, metadata }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to deduct credits');
        return { success: false, error: data.error };
      }

      return { success: true, remaining: data.remaining };
    } catch (err) {
      console.error('Error deducting credits:', err);
      const errorMessage = 'Network error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    deduct,
    loading,
    error
  };
}
