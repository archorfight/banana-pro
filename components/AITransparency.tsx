/**
 * AI Transparency - AI透明度声明
 * 说明产品是基于AI模型的独立平台，符合Creem合规要求
 */

'use client';

import { Info } from 'lucide-react';

export default function AITransparency() {
  return (
    <section className="relative py-12 px-4 bg-blue-50 dark:bg-blue-900/20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                About Our AI Technology
              </h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                <p>
                  <strong className="text-gray-900 dark:text-white">PixBanana is an independent platform.</strong> We provide a user-friendly interface for AI image generation, powered by various AI models.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">We are not affiliated with, endorsed by, or sponsored by</strong> any AI model providers (including but not limited to Flux, Stability AI, OpenAI, or Google). We are an independent service offering access to these technologies through our custom interface.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">Transparency commitment:</strong> We believe in being open about how our service works. If you have questions about the AI models we use or how we process your data, please contact us at{' '}
                  <a href="mailto:support@pixbanan.xyz" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    support@pixbanan.xyz
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
