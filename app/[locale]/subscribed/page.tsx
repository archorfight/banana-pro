import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales, defaultLocale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: "You're on the list — PixBanana",
  robots: { index: false },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SubscribedPage({
  params: { locale },
}: {
  params: { locale: (typeof locales)[number] };
}) {
  setRequestLocale(locale);
  const home = locale === defaultLocale ? '/' : `/${locale}`;
  const zh = locale === 'zh';
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          {zh ? '已加入订阅' : "You're on the list"}
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {zh
            ? '有新功能或新玩法上线时，你会收到一封邮件。不定期、不群发。'
            : 'When something worth trying ships, you\u2019ll get one email. No schedule, no spam.'}
        </p>
        <a href={home} className="text-yellow-400 text-sm hover:underline">
          {zh ? '← 返回首页' : '← Back to PixBanana'}
        </a>
      </div>
    </main>
  );
}
