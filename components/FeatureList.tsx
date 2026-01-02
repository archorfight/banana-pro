'use client';

import { useTranslations } from 'next-intl';
import { MessageSquare, Users, Merge } from 'lucide-react';

export default function FeatureList() {
  const t = useTranslations('features');

  const features = [
    {
      key: 'naturalLanguage',
      icon: MessageSquare,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      key: 'characterConsistency',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      key: 'sceneFusion',
      icon: Merge,
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
      {/* 背景装饰 - 与 HeroSection 风格统一 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-orange-50/30 to-pink-50/30 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-pink-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 text-white shadow-lg`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                  {t(`${feature.key}.title`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t(`${feature.key}.description`)}
                </p>

                {/* Decorative background gradient */}
                <div className={`absolute -right-16 -top-16 h-40 w-40 bg-gradient-to-br ${feature.gradient} opacity-10 blur-3xl transition-opacity group-hover:opacity-20`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
