/**
 * FAQ - 常见问题组件
 * 展示用户常见问题和解答
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, HelpCircle } from 'lucide-react';

// FAQ数据
const faqItems = [
  {
    id: 1,
    questionKey: "q1",
    answerKey: "a1",
    category: "general"
  },
  {
    id: 2,
    questionKey: "q2",
    answerKey: "a2",
    category: "features"
  },
  {
    id: 3,
    questionKey: "q3",
    answerKey: "a3",
    category: "features"
  },
  {
    id: 4,
    questionKey: "q5",
    answerKey: "a5",
    category: "features"
  },
  {
    id: 5,
    questionKey: "q6",
    answerKey: "a6",
    category: "legal"
  },
  {
    id: 6,
    questionKey: "q7",
    answerKey: "a7",
    category: "tips"
  },
  {
    id: 7,
    questionKey: "q8",
    answerKey: "a8",
    category: "technical"
  },
  {
    id: 8,
    questionKey: "q9",
    answerKey: "a9",
    category: "technical"
  },
  {
    id: 9,
    questionKey: "q10",
    answerKey: "a10",
    category: "tips"
  }
];

// 分类颜色映射
const categoryColors: Record<string, string> = {
  general: "bg-blue-100 text-blue-700",
  features: "bg-purple-100 text-purple-700",
  pricing: "bg-green-100 text-green-700",
  legal: "bg-red-100 text-red-700",
  tips: "bg-yellow-100 text-yellow-700",
  technical: "bg-gray-100 text-gray-700"
};

export default function FAQ() {
  const t = useTranslations('faq');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([1]));
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const toggleItem = (id: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 获取所有分类
  const categories = ["all", "general", "features", "legal", "tips", "technical"];

  // 过滤FAQ项目
  const filteredItems = selectedCategory === "all"
    ? faqItems
    : faqItems.filter(item => item.category === selectedCategory);

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* 背景装饰 - 统一样式 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-orange-50/30 to-pink-50/30 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-pink-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_50%)]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>{t('badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>

        {/* FAQ列表 */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[item.category]}`}>
                      {t(`categories.${item.category}`)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{t(item.questionKey)}</h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                    openItems.has(item.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* 答案 */}
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openItems.has(item.id) ? 'max-h-96 pb-5' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {t(item.answerKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 底部帮助链接 */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            {t('stillHaveQuestions')}
          </p>
          <button className="px-6 py-2 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-900 hover:text-white transition-all">
            {t('contactSupport')}
          </button>
        </div>
      </div>
    </section>
  );
}
