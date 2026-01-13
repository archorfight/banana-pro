import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server';
import crypto from 'crypto';
import type { CreditsResult } from '@/lib/types/credits';

const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET;

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!CREEM_WEBHOOK_SECRET) {
    console.error('CREEM_WEBHOOK_SECRET not configured');
    return false;
  }

  const hmac = crypto.createHmac('sha256', CREEM_WEBHOOK_SECRET);
  hmac.update(payload);
  const digest = hmac.digest('hex');

  // Creem may send signature with 'sha256=' prefix (like Stripe)
  // Strip the prefix if present
  const receivedSignature = signature.replace(/^sha256=/, '');

  // Check lengths first before timing-safe comparison
  if (receivedSignature.length !== digest.length) {
    console.error('Signature length mismatch:', {
      received: receivedSignature.length,
      expected: digest.length,
      receivedSig: receivedSignature,
      expectedSig: digest
    });
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(digest)
  );
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();

    // DEBUG: Log raw payload and headers immediately
    console.log('🔍 Raw webhook payload:', rawBody);
    console.log('🔍 All headers:', Object.fromEntries(request.headers.entries()));

    if (!CREEM_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Get the signature from headers (try both lowercase and capitalized versions)
    const signature = request.headers.get('creem-signature') || request.headers.get('x-creem-signature');
    console.log('🔍 Received signature:', signature);

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // DEBUG: Compute and log expected signature
    const hmac = crypto.createHmac('sha256', CREEM_WEBHOOK_SECRET);
    hmac.update(rawBody);
    const expectedDigest = hmac.digest('hex');
    console.log('🔍 Expected signature:', expectedDigest);
    console.log('🔍 Signature match:', signature === expectedDigest);

    // Verify the signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('❌ Signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const event = JSON.parse(rawBody);

    // DEBUG: Log full parsed event
    console.log('🔍 Full parsed event:', JSON.stringify(event, null, 2));

    // Creem sends: { eventType: "checkout.completed", object: {...} }
    const eventType = event.eventType || event.type;
    const eventData = event.object || event.data;

    console.log('📦 Received Creem webhook:', eventType);
    console.log('📦 Event data:', JSON.stringify(eventData, null, 2));

    // Handle different event types
    switch (eventType) {
      case 'checkout.completed':
        await handleCheckoutCompleted(eventData);
        break;

      case 'checkout.refunded':
        await handleCheckoutRefunded(eventData);
        break;

      case 'checkout.failed':
        console.log('Payment failed:', eventData);
        break;

      case 'checkout.cancelled':
        console.log('Payment cancelled:', eventData);
        break;

      default:
        console.log('Unhandled event type:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(data: any) {
  // Creem sends nested structure: { customer: { email }, order: { id }, product: { id } }
  const customer_email = data.customer?.email || data.customer_email;
  const product_id = data.product?.id || data.product_id;
  const order_id = data.order?.id || data.order_id;
  const metadata = data.metadata;
  const amount = data.amount || data.order?.amount;

  console.log('Payment completed:', { product_id, customer_email, order_id, metadata });

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
    console.error('Invalid credit amount:', { product_id, metadata });
    return;
  }

  // Create Supabase client with service role to bypass RLS
  const supabase = createServiceRoleClient();

  // Find user by email
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    console.error('Error listing users:', userError);
    return;
  }

  const user = users.find((u: any) => u.email === customer_email);

  if (!user) {
    console.error('User not found for email:', customer_email);
    // TODO: Handle unauthenticated users or create account automatically
    return;
  }

  console.log(`Adding ${creditsToAdd} credits to user ${user.id} (${user.email})`);

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
    console.error('Failed to add credits:', creditError);
    return;
  }

  const creditResult = result as CreditsResult;

  if (creditResult.success) {
    console.log(`Successfully added ${creditsToAdd} credits to user ${user.id}. New balance: ${creditResult.new_balance}`);
  } else {
    console.error('Failed to add credits:', creditResult);
  }
}

async function handleCheckoutRefunded(data: any) {
  const customer_email = data.customer?.email || data.customer_email;
  const product_id = data.product?.id || data.product_id;
  const order_id = data.order?.id || data.order_id;
  const metadata = data.metadata;
  const amount = data.amount || data.order?.amount;

  console.log('Payment refunded:', { product_id, customer_email, order_id, metadata });

  // Extract package amount from metadata or product_id
  let creditsToDeduct = 0;

  if (metadata?.package_amount) {
    creditsToDeduct = parseInt(metadata.package_amount) || 0;
  } else if (product_id) {
    const match = product_id.match(/(\d+)/);
    creditsToDeduct = match ? parseInt(match[1]) : 0;
  }

  if (creditsToDeduct <= 0) {
    console.error('Invalid credit amount for refund:', { product_id, metadata });
    return;
  }

  const supabase = createServiceRoleClient();

  // Find user by email
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    console.error('Error listing users:', userError);
    return;
  }

  const user = users.find((u: any) => u.email === customer_email);

  if (!user) {
    console.error('User not found for email:', customer_email);
    return;
  }

  console.log(`Deducting ${creditsToDeduct} credits from user ${user.id} (${user.email}) due to refund`);

  // For refunds, directly update the balance to allow negative values
  // This is because users may have already spent their credits
  const { data: existingCredit } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('user_id', user.id)
    .single();

  const currentBalance = existingCredit?.credits || 0;
  const newBalance = currentBalance - creditsToDeduct;

  // Update or insert credit record (allowing negative balance for refunds)
  const { error: updateError } = await supabase
    .from('user_credits')
    .upsert({
      user_id: user.id,
      credits: newBalance,
      updated_at: new Date().toISOString(),
    });

  if (updateError) {
    console.error('Failed to update credits:', updateError);
    return;
  }

  // Record the refund in history
  const { error: historyError } = await supabase
    .from('user_credit_history')
    .insert({
      user_id: user.id,
      amount: -creditsToDeduct,
      balance_after: newBalance,
      type: 'refund',
      description: `Refunded for order ${order_id}`,
      metadata: {
        product_id,
        order_id,
        amount,
        customer_email,
        refund_reason: data.refund_reason || 'customer_request',
        previous_balance: currentBalance
      },
    });

  if (historyError) {
    console.error('Failed to record credit history:', historyError);
  }

  console.log(`Successfully deducted ${creditsToDeduct} credits from user ${user.id}. New balance: ${newBalance} (was ${currentBalance})`);
}
