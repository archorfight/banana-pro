/**
 * Footer - 页脚组件
 * 显示法律页面链接和联系信息
 */

'use client';

import { useTranslations, useLocale } from 'next-intl';
import { defaultLocale } from '@/lib/i18n';
import { Mail, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const prefix = locale === defaultLocale ? '' : `/${locale}`;

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍌</span>
              <span className="text-xl font-bold text-white">PixBanana</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              AI-powered image generation platform for creators, designers, and businesses.
            </p>
            <div className="flex gap-4">
              <span className="hover:text-white transition-colors inline-block">
                <Twitter className="w-5 h-5" aria-hidden />
              </span>
              <span className="hover:text-white transition-colors inline-block">
                <Github className="w-5 h-5" aria-hidden />
              </span>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`${prefix}/privacy`} className="hover:text-white transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/terms`} className="hover:text-white transition-colors">
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/refund`} className="hover:text-white transition-colors">
                  {t('refundPolicy')}
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/pricing`} className="hover:text-white transition-colors">
                  {t('pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('contact')}</h3>
            <a
              href={`mailto:${t('supportEmail')}`}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              {t('supportEmail')}
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} PixBanana. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Independent product. Not affiliated with any AI model providers.
          </p>
          <a
            href="https://uno.directory"
            target="_blank"
            rel="noopener"
            aria-label="Listed on Uno Directory"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://uno.directory/uno-directory.svg"
              alt="Listed on Uno Directory"
              width={120}
              height={30}
              loading="lazy"
            />
          </a>
          <a
            href="https://toolparade.com/tools/pixbanana"
            target="_blank"
            rel="noopener"
            aria-label="Tool Parade"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://toolparade.com/assets/images/badge.png"
              alt="Tool Parade"
              height={30}
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
