/**
 * GalleryShowcase - 案例展示组件
 * 展示AI生成能力的示例（非用户作品）
 */

'use client';

import { useTranslations } from 'next-intl';
import { Sparkles, Wand2 } from 'lucide-react';

// 示例提示词 - 展示AI能力，非用户作品
const examplePrompts = [
  {
    id: 1,
    prompt: "A magical banana kingdom floating in the sky",
    category: "Fantasy",
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
  },
  {
    id: 2,
    prompt: "Cyberpunk banana character with neon lights",
    category: "Cyberpunk",
    gradient: "from-cyan-500 via-blue-500 to-purple-600",
  },
  {
    id: 3,
    prompt: "Cute anime girl holding a giant banana",
    category: "Anime",
    gradient: "from-pink-400 via-rose-400 to-pink-500",
  },
  {
    id: 4,
    prompt: "Photorealistic banana still life, dramatic lighting",
    category: "Realistic",
    gradient: "from-yellow-300 via-amber-400 to-yellow-600",
  },
];

export default function GalleryShowcase() {
  const t = useTranslations('gallery');
  const tEditor = useTranslations('editor');

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-orange-50/30 to-pink-50/30 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-pink-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.08),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-yellow-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t('badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* 示例提示词展示 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {examplePrompts.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {/* 渐变背景 */}
              <div className={`aspect-square bg-gradient-to-br ${item.gradient} relative flex items-center justify-center`}>
                <div className="text-center p-6">
                  <Wand2 className="w-12 h-12 text-white/80 mx-auto mb-3" />
                  <span className="text-white/90 text-sm font-medium">{item.category}</span>
                </div>
              </div>

              {/* 提示词 */}
              <div className="p-4">
                <p className="text-sm text-gray-700 line-clamp-2">
                  &ldquo;{item.prompt}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('description')}
          </p>
          <a
            href="#editor"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Wand2 className="w-5 h-5" />
            {t('tryItYourself')}
          </a>
        </div>
      </div>
    </section>
  );
}
