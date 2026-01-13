import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './lib/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  // This function can be called during build time with undefined locale
  // Provide a locale that will be used for the negotiation
  let locale = await requestLocale;

  // Ensure we have a valid locale, fallback to default if needed
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
