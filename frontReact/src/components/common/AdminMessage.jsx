import React from 'react';

const AdminMessage = () => {
    return (
        <div
            className="flex-grow cursor-pointer p-4 rounded-[0.53rem] shadow flex items-center justify-center transition-colors duration-200"
            style={{ 
                backgroundColor: '#B6B8CB',
                border: '1px solid transparent'
            }}
        >
            <span
                className="text-[#101957] font-semibold text-[1.2rem] transition-colors duration-200"
                style={{ fontFamily: 'Roboto, sans-serif' }}
            >
                Écrivez à un étudiant
            </span>
        </div>
    );
};

export default AdminMessage;