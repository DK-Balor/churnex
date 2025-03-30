import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <span className="text-xl font-bold text-brand-dark-900">
      Churnex
      <span className="text-xs align-top text-brand-green">™</span>
    </span>
  );
};

export default Logo; 