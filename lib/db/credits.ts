/**
 * Credit system database operations
 */

import { createClient } from '@/utils/supabase/client';
import type { UserCredits, CreditTransaction, CreditsResult } from '@/lib/types/credits';

/**
 * Get user's current credit balance
 */
export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('getUserCredits error:', error);
    throw error;
  }

  // Return first result or null
  return data && data.length > 0 ? data[0] : null;
}

/**
 * Get user's credit transactions
 */
export async function getUserTransactions(
  userId: string,
  limit: number = 50
): Promise<CreditTransaction[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Add credits to user account (atomic operation)
 * Uses Supabase RPC to call the database function
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: 'purchase' | 'refund' | 'bonus',
  description?: string,
  metadata?: Record<string, any>
): Promise<CreditsResult> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('add_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_type: type,
    p_description: description || null,
    p_metadata: metadata || {}
  });

  if (error) throw error;
  return data as CreditsResult;
}

/**
 * Deduct credits from user account (atomic operation with balance check)
 * Uses Supabase RPC to call the database function
 */
export async function deductCredits(
  userId: string,
  amount: number,
  type: 'usage',
  description?: string,
  metadata?: Record<string, any>
): Promise<CreditsResult> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('deduct_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_type: type,
    p_description: description || null,
    p_metadata: metadata || {}
  });

  if (error) throw error;
  return data as CreditsResult;
}

/**
 * Create credit account for new user (if not exists)
 */
export async function ensureCreditAccount(userId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('user_credits')
    .upsert(
      { user_id: userId, credits: 0 },
      { onConflict: 'user_id', ignoreDuplicates: true }
    );

  if (error) throw error;
}
