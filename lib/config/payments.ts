/**
 * Payment Configuration
 * Centralized configuration for payment providers
 */

export interface CreditPackage {
  amount: number;
  displayName: string;
}

/**
 * Get product ID for a credit package
 * Reads from environment variables
 */
function getProductIdForPackage(amount: string): string {
  // Directly read from CREEM_PRODUCT_ID_* environment variables
  // Vercel will have these configured
  return process.env[`CREEM_PRODUCT_ID_${amount}`] || '';
}

/**
 * Creem Payment Configuration
 * @see https://dashboard.creem.io
 */
export const CREEM_CONFIG = {
  /**
   * Credit packages available for purchase
   */
  creditPackages: {
    '100': {
      amount: 100,
      displayName: '100 Credits',
    },
    '200': {
      amount: 200,
      displayName: '200 Credits',
    },
    '500': {
      amount: 500,
      displayName: '500 Credits',
    },
  } as Record<string, CreditPackage>,

  /**
   * Get product ID by package amount
   */
  getProductId(amount: string): string {
    return getProductIdForPackage(amount);
  },
} as const;
