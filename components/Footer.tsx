/**
 * Footer - 页脚组件
 * 显示法律页面链接和联系信息
 */

'use client';

import { useTranslations } from 'next-intl';
import { Mail, Github, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');

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
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
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
        </div>
      </div>
    </footer>
  );
}
