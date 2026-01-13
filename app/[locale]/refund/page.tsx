'use client';

import { useTranslations } from 'next-intl';
import { Shield, Clock, CheckCircle, Mail } from 'lucide-react';

export default function RefundPage() {
  const t = useTranslations('refund');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-6">
            <Shield className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Refund Conditions */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('conditions.title')}
              </h2>
            </div>
            <ul className="space-y-4">
              {t.raw('conditions.items').map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Refund Process */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('process.title')}
              </h2>
            </div>
            <div className="space-y-4">
              {t.raw('process.steps').map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                    {i + 1}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Partial Refund Policy */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('partial.title')}
              </h2>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r">
              <p className="text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                {t('partial.noticeTitle')}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {t('partial.noticeContent')}
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              {t('partial.description')}
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                {t('contact.title')}
              </h2>
            </div>
            <p className="text-white/90 mb-4">
              {t('contact.description')}
            </p>
            <a
              href={`mailto:${t('contact.email')}`}
              className="inline-block px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              {t('contact.button')}
            </a>
          </section>

          {/* Last Updated */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {t('lastUpdated')}: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
