import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusDetails } from '../../utils/enrollmentStatusUtils';

const StudentDashboardStatus = ({ enrollment, onGoBack }) => {
    const navigate = useNavigate();
    
    const handleGoToCorrections = () => {
        navigate('/dashboard/corrections', { state: { enrollmentId: enrollment.id } });
    };
    
    const handleGoToPayments = () => {
        navigate('/dashboard/my-payments');
    };
    
    if (!enrollment) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-600 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="bg-blue-50 p-6 rounded-full mb-6">
                    <svg className="w-16 h-16 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Aucune inscription en cours</h3>
                <p className="text-gray-600 mb-6 px-4 leading-relaxed">Vous n'avez aucune inscription en cours. Veuillez commencer une nouvelle inscription.</p>
                <button
                    onClick={onGoBack}
                    className="mt-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Parcourir les formations
                </button>
            </div>
        );
    }

    // Get status details with payment type and program name information
    const statusDetails = getStatusDetails(enrollment.status, enrollment.paymentType, enrollment.programName);
    
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
                    <button 
                        onClick={handleGoToPayments}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold"
                    >
                        {statusDetails.button.text}
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
                className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold"
            >
                Recommencer l'inscription
            </button>
        );
    } else if (enrollment.status === 'CORRECTIONS_REQUIRED') {
        buttonAction = (
            <button
                onClick={handleGoToCorrections}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold"
            >
                Mettre à jour mon dossier
            </button>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white shadow-xl rounded-xl border border-gray-100 max-w-2xl mx-auto transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-full mb-6">
                <img src={statusImage} alt="Statut" className="w-20 h-20 mx-auto" />
            </div>
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{statusText}</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 leading-relaxed">
                        <span className="font-medium text-gray-900">Formation:</span> {enrollment.programName || 'Non spécifiée'}
                    </p>
                </div>
                <p className="text-gray-600 px-4 leading-relaxed mb-2">{statusMessage}</p>
            </div>
            {buttonAction}
        </div>
    );
};

export default StudentDashboardStatus;