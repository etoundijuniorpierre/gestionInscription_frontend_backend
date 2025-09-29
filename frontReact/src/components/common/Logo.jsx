import React from 'react';
import logoImage from '/assets/images/logo.png';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <img src={logoImage} alt="Ignite Academy Logo" className="h-[4.5rem] w-[4.5rem]" /> 
      
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-[#2A3B7C] leading-none">Ignite</span>
        <span className="text-2xl font-bold text-[#2A3B7C] leading-none">Academy</span>
      </div>
    </div>
  );
};

export default Logo;