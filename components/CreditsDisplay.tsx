'use client';

import { useCredits } from '@/lib/hooks/useCredits';
import { Coins } from 'lucide-react';

interface CreditsDisplayProps {
  showLabel?: boolean;
  className?: string;
}

/**
 * Display user's credit balance
 */
export function CreditsDisplay({ showLabel = true, className = '' }: CreditsDisplayProps) {
  const { credits, loading } = useCredits();

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${className}`}>
        <Coins className="w-4 h-4" />
        <span className="text-sm">...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Coins className="w-4 h-4 text-yellow-500" />
      {showLabel && <span className="text-sm text-gray-600 dark:text-gray-400">Credits:</span>}
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {credits ?? 0}
      </span>
    </div>
  );
}
