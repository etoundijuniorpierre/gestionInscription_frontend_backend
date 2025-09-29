import React from 'react';
import wave1 from '/assets/images/wave-separator-1.png';
import wave2 from '/assets/images/wave-separator-2.png';
import wave3 from '/assets/images/wave-separator-3.png';

const WaveSeparatorInverted = () => {
  return (
    <div className="absolute w-full h-[20vh] md:h-[25vh] rotate-180 pt-[2rem]">

      <img
        src={wave3}
        alt="Inverted Wave Separator Layer 3"
        className="absolute top-[-2rem] w-full h-[40vh] object-cover object-top z-1"
      />

      <img
        src={wave2}
        alt="Inverted Wave Separator Layer 2"
        className="absolute top-[-5rem] w-full h-[40vh] object-cover object-top z-2"
      />

      <img
        src={wave1}
        alt="Inverted Wave Separator Layer 1"
        className="absolute top-[-3rem] left-0 w-full h-[40vh] object-cover object-top z-3"
      />
    </div>
  );
};

export default WaveSeparatorInverted;