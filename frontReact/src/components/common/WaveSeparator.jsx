import React from 'react';
import wave1 from '/assets/images/wave-separator-1.png';
import wave2 from '/assets/images/wave-separator-2.png';
import wave3 from '/assets/images/wave-separator-3.png';

const WaveSeparator = () => {
  return (
    <div className="w-full h-full overflow-hidden"> 

      <img
        src={wave3}
        alt="Wave Separator Layer 3"
        className="absolute bottom-[-25rem] left-[-20%] w-[140%] h-auto object-cover object-top z-1
                   transform rotate-[-6.71deg]" 
        style={{
          opacity: 1, 
        }}
      />

      <img
        src={wave2}
        alt="Wave Separator Layer 2"
        className="absolute bottom-[-45rem] left-[-10%] w-[120%] h-auto object-cover object-top z-2" 
        style={{
          opacity: 1,
        }}
      />

      <img
        src={wave1}
        alt="Wave Separator Layer 1"
        className="absolute bottom-[-15rem] left-0 w-full h-auto object-cover object-top z-3" 
        style={{
          opacity: 1,
          boxShadow: '0px -4px 25px 0px rgba(0, 0, 0, 0.3)'
        }}
      />
    </div>
  );
};

export default WaveSeparator;