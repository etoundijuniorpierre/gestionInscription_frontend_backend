import React, { useState, useEffect } from 'react';

const BandwidthStats = () => {
    // In a real application, these values would come from an API
    // For now, we'll use static values as placeholders
    const [bandwidthStats] = useState({
        bandwidth: '500Mo',
        totalWeight: '5.2Go'
    });

    return (
        <div
            className="flex-grow p-4 rounded-[0.53rem] shadow text-[#101957] flex justify-around items-center"
            style={{
                backgroundColor: '#B6B8CB',
            }}
        >
            <div className="flex items-center gap-2">
                <img src="/assets/images/up-down-arrows.png" alt="Up-down arrows" className="w-6 h-6" />
                <span className="text-[1.2rem] font-medium">Bande pass : {bandwidthStats.bandwidth}</span>
            </div>
            <div className="flex items-center gap-2">
                <img src="/assets/images/load.png" alt="Load icon" className="w-6 h-6" />
                <span className="text-[1.2rem] font-medium">Poids total : {bandwidthStats.totalWeight}</span>
            </div>
        </div>
    );
};

export default BandwidthStats;