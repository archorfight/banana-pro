/**
 * Hook for managing generation quota and permissions
 */

import { useState, useEffect } from 'react';

interface DailyLimitInfo {
  can_generate: boolean;
  current_count: number;
  limit: number;
  remaining: number;
}

interface QuotaInfo {
  isFreeUser: boolean;
  credits: number;
  dailyLimit: DailyLimitInfo | null;
  canUseRealisticStyle: boolean;
  canUseHighResolution: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useGenerationQuota(): QuotaInfo {
  const [quota, setQuota] = useState<DailyLimitInfo | null>(null);
  const [isFreeUser, setIsFreeUser] = useState(true);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuota = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/generate/quota');

      if (!response.ok) {
        if (response.status === 401) {
          // Not authenticated - default to free user
          setIsFreeUser(true);
          setCredits(0);
          setQuota({
            can_generate: true,
            current_count: 0,
            limit: 1,
            remaining: 1,
          });
          return;
        }
        throw new Error('Failed to fetch quota');
      }

      const data = await response.json();
      setIsFreeUser(data.isFreeUser);
      setCredits(data.credits);
      setQuota(data.dailyLimit);
    } catch (err) {
      console.error('Error fetching quota:', err);
      setError('Failed to load quota');
      // Set default values on error
      setIsFreeUser(true);
      setCredits(0);
      setQuota({
        can_generate: true,
        current_count: 0,
        limit: 1,
        remaining: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  return {
    isFreeUser,
    credits,
    dailyLimit: quota,
    canUseRealisticStyle: credits > 0,
    canUseHighResolution: credits > 0,
    loading,
    error,
    refresh: fetchQuota,
  };
}
