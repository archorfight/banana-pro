import { type Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/lib/i18n';
import { SITE_URL, OG_IMAGE } from '@/lib/seo';
import { landingPages } from '@/lib/landing-pages';
import BananaDecoration from '@/components/BananaDecoration';

interface Props {
  params: { locale: string; slug: string };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    landingPages.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  const page = landingPages.find((p) => p.slug === slug);
  if (!page) return {};
  const c = page[locale === 'zh' ? 'zh' : 'en'];
  const localePath = locale === defaultLocale ? '' : `/${locale}`;
  const url = `${SITE_URL}${localePath}/${slug}`;
  return {
    title: c.title,
    description: c.meta,
    alternates: {
      canonical: url,
      languages: {
        'en': `${SITE_URL}/${slug}`,
        'zh': `${SITE_URL}/zh/${slug}`,
        'x-default': `${SITE_URL}/${slug}`,
      },
    },
    openGraph: {
      title: c.title,
      description: c.meta,
      url,
      type: 'website',
      images: [{ url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: c.title }],
    },
    twitter: { card: 'summary_large_image', title: c.title, description: c.meta, images: [OG_IMAGE.url] },
  };
}

export default async function LandingPage({ params: { locale, slug } }: Props) {
  const page = landingPages.find((p) => p.slug === slug);
  if (!page) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'common' });
  const appName = t('appName');
  const c = page[locale === 'zh' ? 'zh' : 'en'];
  const localePath = locale === defaultLocale ? '' : `/${locale}`;
  const link = (s: string) => `${localePath}/${s}`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <main className="relative">
      <BananaDecoration />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{c.h1}</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">{c.answer}</p>
        <div className="flex flex-wrap gap-4">
          <Link
            href={localePath || '/'}
            className="inline-flex items-center rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black hover:bg-yellow-300 transition-colors"
          >
            {locale === 'zh' ? `免费试用 ${appName}` : `Try ${appName} Free`}
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {locale === 'zh' ? '如何使用' : 'How to use it'}
        </h2>
        <ol className="space-y-4">
          {c.steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      {c.prompts && c.prompts.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">
            {locale === 'zh' ? '示例提示词' : 'Example prompts'}
          </h2>
          <div className="space-y-3">
            {c.prompts.map((p, i) => (
              <div key={i} className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-4">
                <p className="font-mono text-sm text-neutral-700 dark:text-neutral-300">{p}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {locale === 'zh' ? '常见用途' : 'Common use cases'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-1">
          {c.useCases.map((u, i) => (
            <div key={i} className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
              <h3 className="font-semibold mb-1">{u.t}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{u.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-8">
          {locale === 'zh' ? '常见问题' : 'Frequently asked questions'}
        </h2>
        <div className="space-y-6">
          {c.faq.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold mb-2">{f.q}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {locale === 'zh' ? '相关工具' : 'Related tools'}
        </h2>
        <div className="flex flex-wrap gap-3">
          {page.related.map((s) => {
            const r = landingPages.find((p) => p.slug === s);
            if (!r) return null;
            const rc = r[locale === 'zh' ? 'zh' : 'en'];
            return (
              <Link
                key={s}
                href={link(s)}
                className="rounded-full border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm hover:border-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
              >
                {rc.h1}
              </Link>
            );
          })}
          <Link
            href={localePath || '/'}
            className="rounded-full border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm hover:border-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
          >
            {appName} — {locale === 'zh' ? '首页生成器' : 'Home generator'}
          </Link>
        </div>
      </section>
    </main>
  );
}
