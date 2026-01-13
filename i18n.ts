import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './lib/i18n';

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale, fallback to default if needed
  const validLocale = (locale && locales.includes(locale as any)) ? locale : defaultLocale;

  if (locale && !locales.includes(locale as any)) {
    notFound();
  }

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
