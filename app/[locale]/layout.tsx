import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/lib/i18n';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AuthButton from '@/components/AuthButton';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: typeof locales[number] };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: LayoutProps) {
  // Enable static rendering
  setRequestLocale(locale);

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <nav className="border-b border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/50">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <Link href={`/${locale}`} className="flex items-center space-x-2">
                    <span className="text-2xl">🍌</span>
                    <span className="text-xl font-bold text-primary-600">Banana Pro</span>
                  </Link>
                  <div className="flex items-center space-x-4">
                    <LanguageSwitcher currentLocale={locale} />
                    <AuthButton />
                  </div>
                </div>
              </div>
            </nav>
            {children}
            <footer className="border-t border-gray-200 bg-white/50 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                © 2025 Banana Pro. All rights reserved.
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
