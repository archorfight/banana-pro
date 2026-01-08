import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/HeroSection';
import FeatureList from '@/components/FeatureList';
import EditorSection from '@/components/EditorSection';
import GalleryShowcase from '@/components/GalleryShowcase';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import AITransparency from '@/components/AITransparency';
import BananaDecoration from '@/components/BananaDecoration';

interface PageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export default async function HomePage({ params: { locale } }: PageProps) {
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main className="relative">
      <BananaDecoration />
      <HeroSection />
      <FeatureList />
      <EditorSection />
      <GalleryShowcase />
      <Testimonials />
      <FAQ />
      <AITransparency />
    </main>
  );
}
