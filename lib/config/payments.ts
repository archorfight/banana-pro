/**
 * Payment Configuration
 * Centralized configuration for payment providers
 */

export interface CreditPackage {
  amount: number;
  displayName: string;
}

/**
 * Get product ID for a credit package based on environment
 */
function getProductIdForPackage(amount: string): string {
  const isTest = process.env.NODE_ENV !== 'production';

  if (isTest) {
    // Test environment
    return (
      process.env[`CREEM_TEST_PRODUCT_ID_${amount}`] ||
      process.env[`CREEM_PRODUCT_ID_${amount}`] ||
      ''
    );
  } else {
    // Production environment
    return (
      process.env[`CREEM_PRODUCT_ID_${amount}`] ||
      process.env[`CREEM_TEST_PRODUCT_ID_${amount}`] ||
      ''
    );
  }
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
   * Automatically selects test or production product ID based on NODE_ENV
   */
  getProductId(amount: string): string {
    return getProductIdForPackage(amount);
  },
} as const;
