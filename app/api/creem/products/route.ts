import { NextResponse } from 'next/server';
import { CREEM_CONFIG } from '@/lib/config/payments';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  const products = {
    '100': CREEM_CONFIG.getProductId('100'),
    '200': CREEM_CONFIG.getProductId('200'),
    '500': CREEM_CONFIG.getProductId('500'),
  };

  return NextResponse.json(products);
}
