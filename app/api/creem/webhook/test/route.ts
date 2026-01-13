import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server';

/**
 * Test endpoint for webhook (no signature verification)
 * Use this to test the credit addition logic
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Simulate webhook payload structure
    const event = {
      type: 'checkout.completed',
      data: body.object || body
    };

    console.log('🧪 Test webhook received:', JSON.stringify(event, null, 2));

    // Handle the event
    await handleCheckoutCompleted(event.data);

    return NextResponse.json({
      success: true,
      message: 'Test webhook processed successfully',
      event
    });
  } catch (error: any) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      {
        error: 'Test webhook failed',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(data: any) {
  const {
    product_id,
    metadata,
    customer_email,
    order_id,
    amount
  } = data;

  console.log('💰 Payment completed:', { product_id, customer_email, order_id, metadata });

  // Extract package amount from metadata or product_id
  let creditsToAdd = 0;

  if (metadata?.package_amount) {
    creditsToAdd = parseInt(metadata.package_amount) || 0;
  } else if (product_id) {
    // Fallback: try to extract from product_id (e.g., "pixbanana-100" -> 100)
    const match = product_id.match(/(\d+)/);
    creditsToAdd = match ? parseInt(match[1]) : 0;
  }

  if (creditsToAdd <= 0) {
    console.error('❌ Invalid credit amount:', { product_id, metadata });
    return;
  }

  // Create Supabase client with service role to bypass RLS
  const supabase = createServiceRoleClient();

  // Find user by email
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    console.error('❌ Error listing users:', userError);
    return;
  }

  const user = users.find((u: any) => u.email === customer_email);

  if (!user) {
    console.error('❌ User not found for email:', customer_email);
    return;
  }

  console.log(`👤 Found user: ${user.id} (${user.email})`);
  console.log(`💎 Adding ${creditsToAdd} credits...`);

  // Add credits using RPC function
  const { data: result, error: creditError } = await supabase.rpc('add_credits', {
    p_user_id: user.id,
    p_amount: creditsToAdd,
    p_type: 'purchase',
    p_description: `Purchased ${creditsToAdd} credits`,
    p_metadata: {
      product_id,
      order_id,
      amount,
      customer_email
    }
  });

  if (creditError) {
    console.error('❌ Failed to add credits:', creditError);
    return;
  }

  console.log('✅ Credit result:', result);

  if (result?.success) {
    console.log(`✅ Successfully added ${creditsToAdd} credits. New balance: ${result.new_balance}`);
  } else {
    console.error('❌ Failed to add credits:', result);
  }
}
