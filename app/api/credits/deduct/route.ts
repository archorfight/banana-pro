import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { deductCredits } from '@/lib/db/credits';
import type { CreditsResult } from '@/lib/types/credits';

// Force dynamic rendering for API routes that use cookies
export const dynamic = 'force-dynamic';

/**
 * POST /api/credits/deduct
 * Deduct credits from user account
 *
 * Body: { amount: number, description?: string, metadata?: any }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { amount, description, metadata } = body;

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Deduct credits
    const result = await deductCredits(
      user.id,
      amount,
      'usage',
      description || 'Credit usage',
      metadata || {}
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          current_balance: result.current_balance,
          required: result.required
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      amount: result.amount,
      remaining: result.new_balance
    });
  } catch (error) {
    console.error('Error deducting credits:', error);
    return NextResponse.json(
      { error: 'Failed to deduct credits' },
      { status: 500 }
    );
  }
}
