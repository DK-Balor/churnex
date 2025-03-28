import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/common/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import ContactSection from '@/components/landing/ContactSection';
import Footer from '@/components/common/Footer';

export default function LandingPage() {
  const location = useLocation();
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <div ref={featuresRef}>
          <FeaturesSection />
        </div>
        <div ref={pricingRef}>
          <PricingSection />
        </div>
        <div ref={contactRef}>
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  );
} 