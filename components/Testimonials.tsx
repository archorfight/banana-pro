/**
 * Testimonials - 用户评价组件
 * 展示用户对产品的真实评价
 */

import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';

// Placeholder for real user testimonials
// When you have genuine customer reviews, replace this empty array with real data
const testimonials: never[] = [];

// Stats removed - waiting for real data

export default function Testimonials() {
  const t = useTranslations('testimonials');

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* 背景装饰 - 统一样式 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-orange-50/30 to-pink-50/30 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-pink-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* 占位消息 - 等待真实评价 */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 mb-6">
            <Quote className="w-10 h-10 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('placeholderTitle')}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            {t('placeholderMessage')}
          </p>
          <a
            href="#editor"
            className="inline-block px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
          >
            {t('startCreating')}
          </a>
        </div>
      </div>
    </section>
  );
}
