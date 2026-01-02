'use client';

import { Locale } from '@/lib/i18n';
import Link from 'next/link';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const locales: { code: Locale; name: string }[] = [
    { code: 'en', name: 'EN' },
    { code: 'zh', name: '中文' },
  ];

  return (
    <div className="flex items-center space-x-2">
      {locales.map((locale) => (
        <Link
          key={locale.code}
          href={`/${locale.code}`}
          className={`rounded px-2 py-1 text-sm transition-colors ${
            currentLocale === locale.code
              ? 'bg-primary-500 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
        >
          {locale.name}
        </Link>
      ))}
    </div>
  );
}
