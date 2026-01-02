/**
 * GalleryShowcase - 案例展示组件
 * 展示AI生成的优秀作品案例
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Download, Heart, Sparkles } from 'lucide-react';

// 案例数据
const galleryItems = [
  {
    id: 1,
    prompt: "A magical banana kingdom floating in the sky, golden clouds, whimsical castles made of banana peels",
    style: "fantasy",
    model: "banana-pro",
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
    initialLikes: 342
  },
  {
    id: 2,
    prompt: "Cyberpunk banana character with neon lights, futuristic city background, digital art style",
    style: "cyberpunk",
    model: "flux",
    gradient: "from-cyan-500 via-blue-500 to-purple-600",
    initialLikes: 256
  },
  {
    id: 3,
    prompt: "Cute anime girl holding a giant banana, soft lighting, kawaii style, detailed background",
    style: "anime",
    model: "banana-pro",
    gradient: "from-pink-400 via-rose-400 to-pink-500",
    initialLikes: 512
  },
  {
    id: 4,
    prompt: "Photorealistic banana still life, dramatic lighting, premium quality, 8K resolution",
    style: "realistic",
    model: "flux",
    gradient: "from-yellow-300 via-amber-400 to-yellow-600",
    initialLikes: 189
  },
  {
    id: 5,
    prompt: "Abstract banana art, flowing curves, vibrant colors, modern digital painting",
    style: "abstract",
    model: "banana-pro",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    initialLikes: 428
  },
  {
    id: 6,
    prompt: "Banana superhero flying through space, dynamic pose, epic background, comic book style",
    style: "comic",
    model: "flux",
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    initialLikes: 375
  },
  {
    id: 7,
    prompt: "Watercolor painting of banana plantation, sunrise, peaceful countryside, artistic",
    style: "watercolor",
    model: "banana-pro",
    gradient: "from-green-400 via-emerald-400 to-teal-500",
    initialLikes: 234
  },
  {
    id: 8,
    prompt: "3D rendered banana with glass texture, studio lighting, product photography style",
    style: "3d",
    model: "flux",
    gradient: "from-slate-300 via-gray-400 to-zinc-500",
    initialLikes: 467
  }
];

export default function GalleryShowcase() {
  const t = useTranslations('gallery');
  const tEditor = useTranslations('editor');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [likes, setLikes] = useState<Record<number, number>>({});

  const handleLike = (id: number) => {
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* 背景装饰 - 统一样式 */}
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

        {/* 案例网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* 图片区域（模拟渐变） */}
              <div className={`aspect-square bg-gradient-to-br ${item.gradient} relative overflow-hidden`}>
                {/* 模拟生成的图像 */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 bg-black/10 rounded-full blur-xl" />
                </div>

                {/* 悬停遮罩 */}
                <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                  hoveredId === item.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleLike(item.id)}
                      className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${likes[item.id] ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                    </button>
                    <button className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors">
                      <Download className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* 模型标签 */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-full">
                  <span className="text-white text-xs font-medium">{tEditor.raw(`models.${item.model}`)}</span>
                </div>

                {/* 风格标签 */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                  <span className="text-gray-800 text-xs font-medium">{t.raw(`styles.${item.style}`)}</span>
                </div>
              </div>

              {/* 提示词 */}
              <div className="p-4">
                <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                  "{item.prompt}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Heart className={`w-4 h-4 ${likes[item.id] ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-xs">{item.initialLikes + (likes[item.id] || 0)}</span>
                  </div>
                  <button className="text-xs text-yellow-600 hover:text-yellow-700 font-medium">
                    {t('trySimilar')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 查看更多按钮 */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl">
            {t('viewAll')}
          </button>
        </div>
      </div>
    </section>
  );
}
