import React from 'react';

const StatsCard = ({ title, value, color, icon }) => {
    return (
        <div 
            className={`p-1 rounded-[0.625rem] shadow flex flex-col justify-center items-center ${color} flex-grow`}
            style={{ 
                fontFamily: 'Roboto, sans-serif',
                boxShadow: '0px 2px 4px 0px #101957'
            }}
        >
            {icon && (
                <div className="mb-1">
                    <img src={icon} alt="" className="w-6 h-6" />
                </div>
            )}
            <h3 
                className="text-sm font-bold mb-1 text-center" 
                style={{ 
                    color: '#101957',
                    lineHeight: '1.25rem',
                    letterSpacing: '0.031rem'
                }}
            >
                {title}
            </h3>
            <span 
                className="text-2xl font-bold text-center" 
                style={{ color: '#F96567CC' }}
            >
                {value}
            </span>
        </div>
    );
};

export default StatsCard;