import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mapApiStatusToDisplay, getStatusDetails } from '../../utils/enrollmentStatusUtils';

const StudentDashboardStatus = ({ enrollment, onGoBack }) => {
    const navigate = useNavigate();
    
    const handleGoToCorrections = () => {
        navigate('/dashboard/corrections', { state: { enrollmentId: enrollment.id } });
    };
    
    if (!enrollment) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-600">
                <p>Aucune inscription trouvée. Veuillez commencer une nouvelle inscription.</p>
                <button
                    onClick={onGoBack}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    // Map API status to display status
    const displayStatus = mapApiStatusToDisplay(enrollment.status);
    
    // Get status details
    const statusDetails = getStatusDetails(enrollment.status);
    
    let statusText = statusDetails.text;
    let statusMessage = typeof statusDetails.message === 'function' 
        ? statusDetails.message(enrollment.rejectionReason) 
        : statusDetails.message;
    let statusImage = statusDetails.image;
    let buttonAction = null;

    // Handle button actions based on status
    if (statusDetails.button) {
        switch (statusDetails.button.action) {
            case 'payment':
                buttonAction = (
                    <button className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Procéder au paiement
                    </button>
                );
                break;
            default:
                break;
        }
    } else if (enrollment.status === 'REJECTED') {
        buttonAction = (
            <button
                onClick={onGoBack}
                className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
                Recommencer
            </button>
        );
    } else if (enrollment.status === 'CORRECTIONS_REQUIRED') {
        buttonAction = (
            <button
                onClick={handleGoToCorrections}
                className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
                Mettre à jour mon dossier
            </button>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
            <img src={statusImage} alt="Statut" className="w-24 h-24 mb-6" />
            <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">{statusText}</h3>
            <p className="text-center text-gray-600 px-4 leading-relaxed">{statusMessage}</p>
            {buttonAction}
        </div>
    );
};

export default StudentDashboardStatus;