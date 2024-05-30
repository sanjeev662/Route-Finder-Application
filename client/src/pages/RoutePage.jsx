import React from 'react';
import RouteForm from '../components/RouteForm';
import Header from '../components/Header';
import bgimage from '../assets/images/bg.jpg';

const RoutePage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-fixed w-full"
      style={{
        backgroundImage: `url(${bgimage})`,
      }}
    >
      <Header />
      <div className="flex items-center justify-center h-full pt-24">
        <RouteForm />
      </div>
    </div>
  );
};

export default RoutePage;
