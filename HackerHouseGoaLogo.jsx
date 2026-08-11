import React from 'react';
import logoSvg from './logo.svg';

export default function HackerHouseGoaLogo({ className = "w-12 h-12" }) {
  return (
    <img
      src={logoSvg}
      alt="Hacker House Goa Logo"
      className={`object-contain block select-none drop-shadow-md ${className}`}
    />
  );
}
