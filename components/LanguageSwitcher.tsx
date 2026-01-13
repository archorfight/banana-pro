'use client';

import { Locale } from '@/lib/i18n';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const locales: { code: Locale; name: string }[] = [
    { code: 'en', name: 'EN' },
    { code: 'zh', name: '中文' },
  ];

  // 构建带语言前缀的路径
  const getLocalizedPath = (targetLocale: Locale) => {
    // 移除当前语言前缀，获取纯路径
    let pathWithoutLocale = pathname;
    if (pathname.startsWith(`/${currentLocale}`)) {
      pathWithoutLocale = pathname.slice(`/${currentLocale}`.length) || '/';
    }

    // 目标语言是默认语言(en)时不加前缀，其他语言加前缀
    if (targetLocale === 'en') {
      return pathWithoutLocale;
    }
    return `/${targetLocale}${pathWithoutLocale}`;
  };

  return (
    <div className="flex items-center space-x-2">
      {locales.map((locale) => (
        <Link
          key={locale.code}
          href={getLocalizedPath(locale.code)}
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
