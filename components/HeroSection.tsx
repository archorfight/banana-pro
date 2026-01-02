'use client';

import { useTranslations } from 'next-intl';
import { Sparkles, Wand2 } from 'lucide-react';

export default function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-orange-50/30 to-pink-50/30 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-pink-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Image Generation</span>
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          {t('title')}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
          {t('subtitle')}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#editor"
            className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
          >
            <Wand2 className="h-5 w-5" />
            {t('cta')}
          </a>
        </div>

        {/* Demo Image Preview */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-2 shadow-2xl dark:from-gray-800 dark:to-gray-900">
            <div className="aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-pink-900/30">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Your AI-generated artwork will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
