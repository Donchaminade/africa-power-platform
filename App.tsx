
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Speakers from './components/Speakers';
import Program from './components/Program';
import Registration from './components/Registration';
import Location from './components/Location';
import Sponsors from './components/Sponsors';
import Faq from './components/Faq';
import Team from './components/Team';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Cursor from './components/Cursor';

const App: React.FC = () => {
  return (
    <>
      <Cursor />
      <Header />
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
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
};

export default App;