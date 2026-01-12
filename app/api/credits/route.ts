import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserCredits } from '@/lib/db/credits';

/**
 * GET /api/credits
 * Get current user's credit balance
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('❌ Auth error:', authError, 'user:', user);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ Authenticated user:', user.id, user.email);

    // Get user credits - use the same supabase client
    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id);

    console.log('📊 Credits raw data:', creditsData, 'error:', creditsError);

    // If no credit account exists, return 0 balance
    if (!creditsData || creditsData.length === 0) {
      return NextResponse.json({
        credits: 0,
        has_account: false
      });
    }

    return NextResponse.json({
      credits: creditsData[0].credits,
      has_account: true
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}
