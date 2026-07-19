import HeroSection from '../sections/HeroSection';
import StatsSection from '../sections/StatsSection';
import FeaturesSection from '../sections/FeaturesSection';
import ReferralSection from '../sections/ReferralSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ReferralSection />
      <Footer />
    </main>
  );
}
