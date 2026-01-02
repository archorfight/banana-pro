import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/lib/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`@/lib/messages/${locale}.json`)).default,
  };
});
