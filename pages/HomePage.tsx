import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import Location from '../components/Location';
import Sponsors from '../components/Sponsors';
import Testimonials from '../components/Testimonials';


const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <Stats />
      <About />
      <Location />
      <Sponsors />
      <Testimonials />
    </main>
  );
};

export default HomePage;