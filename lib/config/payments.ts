/**
 * Payment Configuration
 * Centralized configuration for payment providers
 */

export interface CreditPackage {
  id: string;
  amount: number;
  displayName: string;
}

/**
 * Creem Payment Configuration
 * @see https://dashboard.creem.io
 */
export const CREEM_CONFIG = {
  /**
   * Credit packages available for purchase
   * Product IDs must be configured in Creem Dashboard
   */
  creditPackages: {
    '100': {
      id: 'prod_2h4o9YVLDdR33ch289vaBs',
      amount: 100,
      displayName: '100 Credits',
    },
    '200': {
      id: 'pixbanana-200',
      amount: 200,
      displayName: '200 Credits',
    },
    '500': {
      id: 'pixbanana-500',
      amount: 500,
      displayName: '500 Credits',
    },
  } as Record<string, CreditPackage>,

  /**
   * Get product ID by package amount
   */
  getProductId(amount: string): string {
    return this.creditPackages[amount]?.id || '';
  },
} as const;
