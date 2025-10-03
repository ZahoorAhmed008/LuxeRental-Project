import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import FeaturedCollections from '../components/home/FeaturedCollections';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

const HomePage = () => {
  return (
    <div className="pt-16">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedCollections />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;