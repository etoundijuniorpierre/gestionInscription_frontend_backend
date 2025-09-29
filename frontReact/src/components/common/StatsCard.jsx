import React from 'react';

const StatsCard = ({ title, value, color }) => {
    return (
        <div 
            className={`p-4 rounded-[0.625rem] shadow flex flex-col justify-center items-center ${color} flex-grow`}
            style={{ 
                fontFamily: 'Roboto, sans-serif',
                boxShadow: '0px 2px 4px 0px #101957'
            }}
        >
            <h3 
                className="text-[1.5rem] font-bold mb-2 text-center" 
                style={{ 
                    color: '#101957',
                    lineHeight: '1.5rem',
                    letterSpacing: '0.031rem'
                }}
            >
                {title}
            </h3>
            <span 
                className="text-[6rem] font-bold text-center" 
                style={{ color: '#F96567CC' }}
            >
                {value}
            </span>
        </div>
    );
};

export default StatsCard;