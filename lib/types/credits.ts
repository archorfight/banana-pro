/**
 * Credit system types
 */

export interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number; // positive for additions, negative for deductions
  balance_after: number;
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  description: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export type TransactionType = CreditTransaction['type'];

export interface AddCreditsResult {
  success: true;
  user_id: string;
  amount: number;
  new_balance: number;
}

export interface DeductCreditsError {
  success: false;
  error: string;
  current_balance?: number;
  required?: number;
}

export type CreditsResult = AddCreditsResult | DeductCreditsError;
