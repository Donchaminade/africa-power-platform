import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import Speakers from '../components/Speakers';
import Program from '../components/Program';
import Registration from '../components/Registration';
import Location from '../components/Location';
import Sponsors from '../components/Sponsors';
import Faq from '../components/Faq';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';

const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <Stats />
      <About />
      <Speakers />
      <Program />
      <Registration />
      <Location />
      <Sponsors />
      <Team />
      <Testimonials />
      <Gallery />
      <Faq />
      <Contact />
    </main>
  );
};

export default HomePage;