import React from 'react';

const RealTimeStatItem = ({ text, value, hasValue = false }) => {
    return (
        <li
            className="p-2 rounded-[0.5rem] flex justify-between items-center"
            style={{
                backgroundColor: '#1019571A',
                padding: '0.5rem',
            }}
        >
            <span className="font-bold text-[1.1rem]" style={{ color: '#666666', letterSpacing: '0.03125rem' }}>
                {text}
            </span>
            {hasValue && (
                <span className="text-red-500 font-bold text-[1.1rem]">{value}</span>
            )}
        </li>
    );
};

export default RealTimeStatItem;
