import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileText, Mail } from 'lucide-react';

interface PageProps {
  params: { locale: string };
}

export default function TermsPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  return <TermsContent />;
}

function TermsContent() {
  const t = useTranslations('terms');
  const footer = useTranslations('footer');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
            <FileText className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('lastUpdated')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.introduction.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.introduction.content')}
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.serviceDescription.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.serviceDescription.content')}
            </p>
          </section>

          {/* User Obligations */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.userObligations.title')}
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {t.raw('sections.userObligations.items').map((item: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Prohibited Uses */}
          <section className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.prohibitedUses.title')}
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {t.raw('sections.prohibitedUses.items').map((item: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="text-red-500 mr-2">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Content Ownership */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.contentOwnership.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.contentOwnership.content')}
            </p>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.payment.title')}
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              {t.raw('sections.payment.items').map((item: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Cancellation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.cancellation.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.cancellation.content')}
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.disclaimer.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.disclaimer.content')}
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.limitation.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.limitation.content')}
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.termination.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.termination.content')}
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.governingLaw.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.governingLaw.content')}
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('sections.changes.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('sections.changes.content')}
            </p>
          </section>

          {/* Contact */}
          <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              {t('sections.contact.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {t('sections.contact.content')}
            </p>
            <a
              href={`mailto:${footer('supportEmail')}`}
              className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium"
            >
              {footer('supportEmail')}
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
