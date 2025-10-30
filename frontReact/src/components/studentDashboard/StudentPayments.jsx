import React, { useState, useEffect } from 'react';
import { getMyUnpaidEnrollments } from '../../services/enrollmentService';
import { getUserPayments, initiateEnrollmentPayment } from '../../services/paymentService';
import { mapApiStatusToDisplay } from '../../utils/enrollmentStatusUtils';

const StudentPayments = () => {
    const [activeTab, setActiveTab] = useState('unpaid'); // 'unpaid' or 'history'
    const [unpaidEnrollments, setUnpaidEnrollments] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            
            if (activeTab === 'unpaid') {
                // Fetch unpaid enrollments
                const enrollments = await getMyUnpaidEnrollments();
                setUnpaidEnrollments(enrollments);
            } else {
                // Fetch payment history
                const payments = await getUserPayments();
                setPaymentHistory(payments);
            }
        } catch (err) {
            setError('Erreur lors du chargement des données: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (enrollmentId, enrollmentStatus) => {
        try {
            setLoading(true);
            setError('');
            console.log('Handling Flutterwave payment for enrollment ID:', enrollmentId);
            
            // Determine payment type based on enrollment status
            const paymentType = enrollmentStatus === 'PENDING_PAYMENT' ? 'REGISTRATION_FEE' : 'PROGRAM_PAYMENT';
            console.log(`Initiating ${paymentType} payment for enrollment ID:`, enrollmentId);
            
            const paymentResponse = await initiateEnrollmentPayment(enrollmentId, paymentType);
            console.log('Flutterwave payment response received:', paymentResponse);

            // Redirect to Flutterwave checkout page
            if (paymentResponse && paymentResponse.link) {
                console.log('Redirecting to Flutterwave checkout with link:', paymentResponse.link);
                window.location.href = paymentResponse.link;
            } else {
                throw new Error('Lien de paiement non reçu');
            }
        } catch (err) {
            console.error('Error handling Flutterwave payment:', err);
            setError('Erreur lors de l\'initiation du paiement: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading && activeTab === 'unpaid') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes Paiements</h1>
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`py-2 px-4 font-medium text-sm ${activeTab === 'unpaid' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('unpaid')}
                        >
                            Inscriptions à payer
                        </button>
                        <button
                            className={`py-2 px-4 font-medium text-sm ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('history')}
                        >
                            Historique des paiements
                        </button>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">Chargement des inscriptions...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading && activeTab === 'history') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes Paiements</h1>
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`py-2 px-4 font-medium text-sm ${activeTab === 'unpaid' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('unpaid')}
                        >
                            Inscriptions à payer
                        </button>
                        <button
                            className={`py-2 px-4 font-medium text-sm ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('history')}
                        >
                            Historique des paiements
                        </button>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">Chargement de l'historique...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes Paiements</h1>
                
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2 px-4 font-medium text-sm ${activeTab === 'unpaid' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('unpaid')}
                    >
                        Inscriptions à payer
                    </button>
                    <button
                        className={`py-2 px-4 font-medium text-sm ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Historique des paiements
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Unpaid Enrollments Tab */}
                {activeTab === 'unpaid' && (
                    <>
                        {unpaidEnrollments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg">
                                    Vous n'avez aucune inscription nécessitant un paiement.
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {unpaidEnrollments.map((enrollment) => (
                                    <div key={enrollment.id} className="bg-white rounded-lg shadow-md p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    {enrollment.programName}
                                                </h3>
                                                <p className="text-gray-600">
                                                    Inscription #{enrollment.id}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    enrollment.status === 'PENDING_PAYMENT'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {mapApiStatusToDisplay(enrollment.status)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-bold text-gray-800 mb-3">Informations sur l'inscription</h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                        <span>Date de soumission: {new Date(enrollment.submissionDate).toLocaleDateString('fr-FR')}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm text-gray-600 mr-2">Statut:</span>
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
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                                        </svg>
                                                        <span>Formation: {enrollment.programName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="font-bold text-gray-800 mb-3">Montants à payer</h4>
                                                <div className="space-y-3">
                                                    {enrollment.status === 'PENDING_PAYMENT' && (
                                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                                                            <div>
                                                                <p className="font-medium text-gray-700">Frais d'inscription</p>
                                                                <p className="text-sm text-gray-500">Paiement initial requis</p>
                                                            </div>
                                                            <span className="text-lg font-bold text-gray-900">
                                                                {enrollment.program?.registrationFee 
                                                                    ? `${(enrollment.program.registrationFee / 100).toFixed(2)} €`
                                                                    : '50 €'}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {enrollment.status === 'PENDING_PROGRAM_PAYMENT' && (
                                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                                                            <div>
                                                                <p className="font-medium text-gray-700">Frais du programme</p>
                                                                <p className="text-sm text-gray-500">Paiement final requis</p>
                                                            </div>
                                                            <span className="text-lg font-bold text-gray-900">
                                                                {enrollment.program?.price 
                                                                    ? `${(enrollment.program.price / 100).toFixed(2)} €`
                                                                    : '100 €'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handlePayment(enrollment.id, enrollment.status)}
                                                disabled={loading}
                                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                {loading ? 'Traitement...' : (
                                                    enrollment.status === 'PENDING_PAYMENT'
                                                        ? 'Payer les frais d\'inscription'
                                                        : 'Payer les frais du programme'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Payment History Tab */}
                {activeTab === 'history' && (
                    <>
                        {paymentHistory.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg">
                                    Vous n'avez effectué aucun paiement pour le moment.
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {paymentHistory.map((payment) => (
                                    <div key={payment.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    Paiement #{payment.id}
                                                </h3>
                                                <div className="flex items-center text-gray-600 mt-1">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                    <span>{new Date(payment.createdAt).toLocaleString('fr-FR')}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    payment.status === 'SUCCESS'
                                                        ? 'bg-green-100 text-green-800'
                                                        : payment.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {payment.status === 'SUCCESS' ? 'Complété' : 
                                                     payment.status === 'PENDING' ? 'En attente' : 'Échoué'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-2">Détails du paiement</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Montant:</span>
                                                        <span className="font-semibold text-gray-900">{(payment.amount / 100).toFixed(2)} {payment.currency}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Type:</span>
                                                        <span className="font-medium text-gray-800">{payment.paymentType === 'REGISTRATION_FEE' ? 'Frais d\'inscription' : 'Frais du programme'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-2">Informations techniques</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">ID de session:</span>
                                                        <span className="font-mono text-gray-800 break-all">{payment.sessionId || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Référence:</span>
                                                        <span className="font-mono text-gray-800 break-all">{payment.reference || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentPayments;