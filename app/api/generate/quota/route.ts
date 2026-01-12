import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { FREE_TIER_RESTRICTIONS } from '@/lib/config/generation';

export async function GET(request: NextRequest) {
  try {
    console.log('[Quota API] Request received');
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('[Quota API] Auth error:', authError, 'user:', user);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Quota API] Authenticated user:', user.id, user.email);

    // Get user credits
    const { data: creditsData } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    const credits = creditsData?.credits || 0;
    const isFreeUser = credits === 0;

    // Get daily generation limit for free users
    let dailyLimit = null;
    if (isFreeUser) {
      const { data: dailyData } = await supabase.rpc('check_daily_generation_limit', {
        p_user_id: user.id,
        p_limit: FREE_TIER_RESTRICTIONS.dailyLimit,
      });
      dailyLimit = dailyData;
    }

    return NextResponse.json({
      isFreeUser,
      credits,
      dailyLimit,
      canUseRealisticStyle: credits > 0,
      canUseHighResolution: credits > 0,
    });
  } catch (error) {
    console.error('Error fetching quota:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quota' },
      { status: 500 }
    );
  }
}
