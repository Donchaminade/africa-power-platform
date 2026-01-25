import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import Cursor from '../components/Cursor';

const MainLayout: React.FC = () => {
  return (
    <>
      <Cursor />
      <Header />
      <Outlet />
      <Footer />
      <Chatbot />
    </>
  );
};

export default MainLayout;
