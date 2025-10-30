import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEnrollments, cancelEnrollment } from '../../services/enrollmentService';
import { mapApiStatusToDisplay } from '../../utils/enrollmentStatusUtils';

const MyEnrollments = () => {
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelingId, setCancelingId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalData, setModalData] = useState({
        enrollmentId: null,
        message: ''
    });
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const data = await getMyEnrollments();
                setEnrollments(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching enrollments:', err);
                setError('Failed to load enrollments. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    const showNotification = (message, type = 'error') => {
        setNotification({ message, type });
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const openConfirmModal = (enrollmentId, programName) => {
        setModalData({
            enrollmentId,
            message: `Êtes-vous sûr de vouloir annuler votre inscription à "${programName}" ? Cette action ne peut pas être annulée.`
        });
        setShowConfirmModal(true);
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setModalData({
            enrollmentId: null,
            message: ''
        });
    };

    const handleConfirmCancel = async () => {
        const { enrollmentId } = modalData;
        closeConfirmModal();
        setCancelingId(enrollmentId);
        
        try {
            await cancelEnrollment(enrollmentId);
            // Remove the cancelled enrollment from the list
            setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
            showNotification('Inscription annulée avec succès', 'success');
        } catch (error) {
            console.error('Error cancelling enrollment:', error);
            showNotification(error.response?.data || 'Erreur lors de l\'annulation de l\'inscription', 'error');
        } finally {
            setCancelingId(null);
        }
    };

    const handleCancelEnrollment = (enrollmentId, programName) => {
        openConfirmModal(enrollmentId, programName);
    };

    // Filter out cancelled enrollments
    const activeEnrollments = enrollments.filter(enrollment => enrollment.status !== 'CANCELLED');

    if (loading) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Inscriptions</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p>Chargement des inscriptions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Inscriptions</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Inscriptions</h2>
            
            {/* Notification display */}
            {notification && (
                <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
                    notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                    {notification.message}
                </div>
            )}
            
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirmation d'annulation</h3>
                        <p className="mb-6 text-gray-600">{modalData.message}</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeConfirmModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Confirmer l'annulation
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {activeEnrollments.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p>Vous n'avez aucune inscription active pour le moment.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                        Commencer une nouvelle inscription
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeEnrollments.map((enrollment) => (
                        <div key={enrollment.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {enrollment.programName || 'Formation inconnue'}
                                    </h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        enrollment.status === 'PENDING_VALIDATION' ? 'bg-yellow-100 text-yellow-800' :
                                        enrollment.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                        enrollment.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                        enrollment.status === 'ENROLLED' ? 'bg-green-100 text-green-800' :
                                        enrollment.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' :
                                        enrollment.status === 'CORRECTIONS_REQUIRED' ? 'bg-purple-100 text-purple-800' :
                                        enrollment.status === 'PENDING_PAYMENT' ? 'bg-orange-100 text-orange-800' :
                                        enrollment.status === 'PENDING_PROGRAM_PAYMENT' ? 'bg-indigo-100 text-indigo-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {mapApiStatusToDisplay(enrollment.status)}
                                    </span>
                                </div>
                                
                                <div className="text-sm text-gray-500 mb-4">
                                    <div className="flex items-center mb-1">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <span>
                                            Date de soumission: {enrollment.submissionDate 
                                                ? new Date(enrollment.submissionDate).toLocaleDateString('fr-FR') 
                                                : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                        </svg>
                                        <span>ID: {enrollment.id}</span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => navigate(`/dashboard/my-enrollments/${enrollment.id}`)}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                                    >
                                        Voir les détails
                                    </button>
                                    {/* Show cancel button only for cancellable enrollments */}
                                    {enrollment.status !== 'APPROVED' && enrollment.status !== 'CANCELLED' && enrollment.status !== 'ENROLLED' && (
                                        <button
                                            onClick={() => handleCancelEnrollment(enrollment.id, enrollment.programName)}
                                            disabled={cancelingId === enrollment.id}
                                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md disabled:opacity-50"
                                        >
                                            {cancelingId === enrollment.id ? 'Annulation...' : 'Annuler'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEnrollments;