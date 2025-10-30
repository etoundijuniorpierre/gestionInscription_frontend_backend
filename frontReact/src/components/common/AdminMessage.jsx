import React, { useState } from 'react';
import EmailModal from './EmailModal';

const AdminMessage = () => {
    const [showEmailModal, setShowEmailModal] = useState(false);

    return (
        <>
            <div
                className="cursor-pointer px-4 py-2 rounded-[0.53rem] shadow flex items-center justify-center transition-colors duration-200 w-full sm:w-auto"
                style={{ 
                    backgroundColor: '#101957',
                    border: '1px solid transparent'
                }}
                onClick={() => setShowEmailModal(true)}
            >
                <span
                    className="text-white font-semibold text-sm transition-colors duration-200"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                    Écrivez à un étudiant
                </span>
            </div>
            
            <EmailModal 
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
            />
        </>
    );
};

export default AdminMessage;