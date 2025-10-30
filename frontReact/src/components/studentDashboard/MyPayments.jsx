import React, { useState, useEffect } from 'react';
import { getUserPayments } from '../../services/paymentService';
import { getMyUnpaidEnrollments } from '../../services/enrollmentService';
import { initiateEnrollmentPayment } from '../../services/paymentService';
import { useNavigate } from 'react-router-dom';
import { mapApiStatusToDisplay } from '../../utils/enrollmentStatusUtils';

const MyPayments = () => {
    const [payments, setPayments] = useState([]);
    const [unpaidEnrollments, setUnpaidEnrollments] = useState([]);
    const [activeTab, setActiveTab] = useState('history'); // 'history' or 'pending'
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Fetch payment history
            const paymentsData = await getUserPayments();
            setPayments(paymentsData);
            
            // Fetch unpaid enrollments
            const enrollmentsData = await getMyUnpaidEnrollments();
            setUnpaidEnrollments(enrollmentsData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Erreur lors du chargement des données: ' + (error.response?.data || error.message));
            setPayments([]);
            setUnpaidEnrollments([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (enrollmentId, enrollmentStatus) => {
        try {
            setPaymentLoading(true);
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
            setPaymentLoading(false);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    if (loading) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Paiements</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p>Chargement des paiements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Paiements</h2>
            
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'history'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Historique des paiements
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'pending'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Paiements en attente ({unpaidEnrollments.length})
                    </button>
                </nav>
            </div>

            {activeTab === 'history' ? (
                payments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p>Vous n'avez effectué aucun paiement pour le moment.</p>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                            Voir les paiements en attente
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Formation
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Montant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {payment.enrollmentName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {payment.paymentType === 'REGISTRATION_FEE' ? 'Frais d\'inscription' : 'Paiement formation'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatAmount(payment.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                payment.status === 'SUCCESSFUL' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {payment.status === 'SUCCESSFUL' ? 'Complété' : 
                                                 payment.status === 'PENDING' ? 'En attente' : 'Échoué'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div>
                    {unpaidEnrollments.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <p>Vous n'avez aucune inscription en attente de paiement.</p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                            >
                                Parcourir les formations
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-800">Inscriptions en attente de paiement</h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {unpaidEnrollments.map((enrollment) => (
                                        <div key={enrollment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <h4 className="text-lg font-bold text-gray-900">{enrollment.programName}</h4>
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
                                                    <p className="text-sm text-gray-500 mb-1">Inscription #{enrollment.id}</p>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                        <span>
                                                            Soumis le: {enrollment.submissionDate 
                                                                ? new Date(enrollment.submissionDate).toLocaleDateString('fr-FR') 
                                                                : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {/* Use the appropriate fee based on enrollment status */}
                                                    <p className="text-xl font-bold text-gray-900">
                                                        {enrollment.program && 
                                                         (enrollment.status === 'PENDING_PROGRAM_PAYMENT' ? 
                                                           (enrollment.program.price ? formatAmount(enrollment.program.price) : 'Prix non défini') :
                                                           (enrollment.program.registrationFee ? formatAmount(enrollment.program.registrationFee) : 'Frais non définis'))
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-500 mb-2">
                                                        {enrollment.status === 'PENDING_PROGRAM_PAYMENT' ? 'Prix du programme' : 'Frais d\'inscription'}
                                                    </p>
                                                    <button
                                                        onClick={() => handlePayment(enrollment.id, enrollment.status)}
                                                        disabled={paymentLoading}
                                                        className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
                                                    >
                                                        {paymentLoading ? 'Traitement...' : 'Payer maintenant'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyPayments;