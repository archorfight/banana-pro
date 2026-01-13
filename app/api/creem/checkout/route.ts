import { NextRequest, NextResponse } from 'next/server';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Creem API configuration
const CREEM_BASE_URL = process.env.CREEM_BASE_URL || (process.env.NODE_ENV === 'production'
  ? 'https://api.creem.io'
  : 'https://test-api.creem.io');

// Select API key based on environment
const getCreemApiKey = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.CREEM_API_KEY || process.env.CREEM_TEST_API_KEY || '';
  } else {
    return process.env.CREEM_TEST_API_KEY || process.env.CREEM_API_KEY || '';
  }
};

const MOCK_MODE = process.env.MOCK_PAYMENT === 'true';

// Proxy configuration (for Creem API access in restricted regions)
const HTTP_PROXY = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
const proxyAgent = HTTP_PROXY ? new HttpsProxyAgent(HTTP_PROXY) : undefined;

// Creem checkout endpoint
const CREEM_CHECKOUT_ENDPOINT = '/v1/checkouts';

interface CreemCheckoutRequest {
  product_id: string;
  success_url: string;
  cancel_url?: string;
  customer_email?: string;
  metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const CREEM_API_KEY = getCreemApiKey();

    if (!CREEM_API_KEY) {
      return NextResponse.json(
        { error: 'Creem API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json() as CreemCheckoutRequest;

    console.log('🛒 Checkout request:', {
      product_id: body.product_id,
      success_url: body.success_url,
      cancel_url: body.cancel_url,
      environment: process.env.NODE_ENV,
      creem_api_key: CREEM_API_KEY?.substring(0, 10) + '...',
    });

    // Mock mode for local development (when Creem API is not accessible)
    if (MOCK_MODE) {
      console.log('🔧 MOCK MODE: Simulating checkout for product:', body.product_id);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return success URL directly (skip payment)
      return NextResponse.json({
        success: true,
        checkout_url: body.success_url,
        mock: true,
      });
    }

    // Create checkout session with Creem
    console.log('📡 Calling Creem API:', CREEM_BASE_URL + CREEM_CHECKOUT_ENDPOINT);
    if (proxyAgent) {
      console.log('🔗 Using proxy:', HTTP_PROXY);
    }
    const response = await fetch(`${CREEM_BASE_URL}${CREEM_CHECKOUT_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CREEM_API_KEY,
      },
      // @ts-ignore - proxyAgent is compatible with Node.js fetch
      agent: proxyAgent,
      body: JSON.stringify({
        product_id: body.product_id,
        success_url: body.success_url,
        customer: body.customer_email ? {
          email: body.customer_email,
        } : undefined,
        metadata: body.metadata,
        units: 1,
      }),
    });

    console.log('📥 Creem API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ Creem API error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to create checkout session' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      checkout_url: data.checkout_url || data.url,
    });
  } catch (error) {
    console.error('Creem checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
