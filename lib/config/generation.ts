/**
 * Image generation credit costs configuration
 * Centralized configuration for credit deduction based on model and resolution
 */

export type ApiModel = 'nano-banana-fast' | 'nano-banana';
export type UiModel = 'banana-pro' | 'flux';
export type Resolution = 'standard' | 'high';
export type Style = 'default' | 'anime' | 'realistic';

export interface GenerationConfig {
  model: UiModel;
  apiModel: ApiModel;
  standardCost: number;
  highResCost: number;
  requiresCreditsFor: Style[];
}

/**
 * Credit costs per generation based on API model and resolution
 */
export const CREDIT_COSTS: Record<ApiModel, Record<Resolution, number>> = {
  'nano-banana-fast': {
    'standard': 1,
    'high': 2,
  },
  'nano-banana': {
    'standard': 2,
    'high': 4,
  },
};

/**
 * Generation configuration per UI model
 */
export const GENERATION_CONFIG: Record<UiModel, GenerationConfig> = {
  'banana-pro': {
    model: 'banana-pro',
    apiModel: 'nano-banana-fast',
    standardCost: 1,
    highResCost: 2,
    requiresCreditsFor: ['realistic'],
  },
  'flux': {
    model: 'flux',
    apiModel: 'nano-banana',
    standardCost: 2,
    highResCost: 4,
    requiresCreditsFor: ['realistic'],
  },
};

/**
 * Free tier restrictions
 */
export const FREE_TIER_RESTRICTIONS = {
  dailyLimit: 1,
  allowedStyles: ['default', 'anime'] as Style[],
  restrictedStyles: ['realistic'] as Style[],
  resolution: 'standard' as Resolution,
  allowedModels: ['banana-pro'] as UiModel[],
} as const;

/**
 * Check if a feature requires credits
 */
export function featureRequiresCredits(
  style: Style,
  resolution: Resolution,
  hasCredits: boolean
): boolean {
  if (hasCredits) return false;
  // Free user: realistic style and high resolution require credits
  return style === 'realistic' || resolution === 'high';
}

/**
 * Get credit cost for generation
 */
export function getCreditCost(
  uiModel: UiModel,
  resolution: Resolution
): number {
  const config = GENERATION_CONFIG[uiModel];
  if (!config) return 1;

  return resolution === 'high' ? config.highResCost : config.standardCost;
}

/**
 * Get credit cost by API model
 */
export function getCreditCostByApiModel(
  apiModel: ApiModel,
  resolution: Resolution
): number {
  return CREDIT_COSTS[apiModel]?.[resolution] || 1;
}
