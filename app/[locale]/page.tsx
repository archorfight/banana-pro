import { useTranslations } from 'next-intl';
import HeroSection from '@/components/HeroSection';
import FeatureList from '@/components/FeatureList';
import EditorSection from '@/components/EditorSection';
import GalleryShowcase from '@/components/GalleryShowcase';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import BananaDecoration from '@/components/BananaDecoration';

export default function HomePage() {
  return (
    <main className="relative">
      <BananaDecoration />
      <HeroSection />
      <FeatureList />
      <EditorSection />
      <GalleryShowcase />
      <Testimonials />
      <FAQ />
    </main>
  );
}
