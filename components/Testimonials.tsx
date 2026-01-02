/**
 * Testimonials - 用户评价组件
 * 展示用户对产品的真实评价
 */

import { useTranslations } from 'next-intl';
import { Star, Quote } from 'lucide-react';

// 用户评价数据
const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    roleKey: "artist",
    avatar: "SC",
    rating: 5,
    content: "Banana Pro has completely transformed my digital art workflow. The AI understands exactly what I want and delivers stunning results every time.",
    highlight: "workflowTransformed"
  },
  {
    id: 2,
    name: "Mike Johnson",
    roleKey: "creator",
    avatar: "MJ",
    rating: 5,
    content: "As a content creator, I need high-quality images fast. Banana Pro delivers incredible visuals in seconds. My engagement has increased by 300%!",
    highlight: "engagement300"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    roleKey: "developer",
    avatar: "ER",
    rating: 5,
    content: "The character consistency feature is a game-changer. I can now generate entire character sheets with perfect consistency. Absolutely amazing!",
    highlight: "characterConsistency"
  },
  {
    id: 4,
    name: "David Kim",
    roleKey: "marketing",
    avatar: "DK",
    rating: 5,
    content: "We've reduced our design costs by 70% since adopting Banana Pro. The quality is professional-grade and the speed is unbeatable.",
    highlight: "cost70"
  },
  {
    id: 5,
    name: "Lisa Wang",
    roleKey: "illustrator",
    avatar: "LW",
    rating: 5,
    content: "The natural language prompts make it so intuitive. I can describe exactly what I imagine and watch it come to life. It's like having a creative partner.",
    highlight: "creativePartner"
  },
  {
    id: 6,
    name: "James Thompson",
    roleKey: "youtuber",
    avatar: "JT",
    rating: 5,
    content: "My thumbnails have never looked better! The AI understands what makes an image click-worthy. My CTR has doubled since I started using it.",
    highlight: "ctrDoubled"
  }
];

// 统计数据
const stats = [
  { value: "2M+", labelKey: "images" },
  { value: "150K+", labelKey: "users" },
  { value: "4.9/5", labelKey: "rating" },
  { value: "99.9%", labelKey: "uptime" }
];

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

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm md:text-base">{t(`stats.${stat.labelKey}`)}</div>
            </div>
          ))}
        </div>

        {/* 用户评价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              {/* 引用图标 */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-yellow-200" />

              {/* 头像和信息 */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold text-lg`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{t(`roles.${testimonial.roleKey}`)}</p>
                </div>
              </div>

              {/* 星级评分 */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* 评价内容 */}
              <p className="text-gray-700 leading-relaxed">
                {testimonial.content}
              </p>

              {/* 高亮标签 */}
              <div className="mt-4 inline-flex items-center px-3 py-1 bg-yellow-100 rounded-full">
                <span className="text-yellow-700 text-sm font-medium">{t(`highlights.${testimonial.highlight}`)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 底部CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            {t('joinCreators')}
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
