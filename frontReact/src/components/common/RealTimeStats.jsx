import React, { useState, useEffect } from 'react';
import { getStatistics } from '../../services/statisticsService';

const RealTimeStats = ({ connectedAccounts }) => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const data = await getStatistics();
                setStatistics(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return <div>Chargement des statistiques en temps réel...</div>;
    }

    if (error) {
        return <div>Erreur lors du chargement: {error.message}</div>;
    }

    // Format the last validated document message
    const lastValidatedDocumentMessage = statistics?.lastValidatedDocument 
        ? `Document de ${statistics.lastValidatedDocument.studentName} validé`
        : 'Aucun document validé récemment';

    // Format the last enrollment message
    const lastEnrollmentMessage = statistics?.lastEnrollment 
        ? `Nouvelle inscription de ${statistics.lastEnrollment.studentName}`
        : 'Aucune nouvelle inscription';

    // Format the last payment message
    const lastPaymentMessage = statistics?.lastPayment 
        ? `Paiement reçu pour ${statistics.lastPayment.studentName}`
        : 'Aucun paiement reçu';

    return (
        <div 
            className="flex flex-col rounded-[0.75rem] shadow h-full" 
            style={{
                gap: '0.5rem',
            }}
        >
            {/* Top section with heading */}
            <div
                className="flex flex-col rounded-t-[0.75rem] px-6 pt-4"
                style={{
                    backgroundColor: 'rgba(16, 25, 87, 0.3)',
                    height: '12.5%',
                }}
            >
                <h4 className="text-[#101957] font-semibold text-sm">Statistiques en Temps Réel</h4>
            </div>

            {/* Main content area with list items */}
            <div 
                className="bg-[#FFFFFF] p-6 flex-grow flex flex-col overflow-y-auto"
                style={{
                    borderRadius: '0.53rem',
                    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
                }}
            >
                <ul className="text-[#333333] text-sm flex flex-col space-y-2 flex-grow">
                    <li
                        className="p-2 rounded-[0.5rem] flex items-center"
                        style={{
                            backgroundColor: '#1019571A',
                            padding: '0.5rem',
                            flexGrow: 1,
                        }}
                    >
                        <span className="font-bold text-sm" style={{ color: '#666666', letterSpacing: '0.03125rem' }}>
                            {lastValidatedDocumentMessage}
                        </span>
                    </li>
                    <li
                        className="p-2 rounded-[0.5rem] flex items-center"
                        style={{
                            backgroundColor: '#1019571A',
                            padding: '0.5rem',
                            flexGrow: 1,
                        }}
                    >
                        <span className="font-bold text-sm" style={{ color: '#666666', letterSpacing: '0.03125rem' }}>
                            {lastEnrollmentMessage}
                        </span>
                    </li>
                    <li
                        className="p-2 rounded-[0.5rem] flex items-center"
                        style={{
                            backgroundColor: '#1019571A',
                            padding: '0.5rem',
                            flexGrow: 1,
                        }}
                    >
                        <span className="font-bold text-sm" style={{ color: '#666666', letterSpacing: '0.03125rem' }}>
                            {lastPaymentMessage}
                        </span>
                    </li>
                </ul>
            </div>
            {/* The bottom background section */}
            <div
                className="flex-none rounded-b-[0.75rem]"
                style={{
                    height: '12.5%',
                    backgroundColor: 'rgba(16, 25, 87, 0.3)',
                }}
            ></div>
        </div>
    );
};

export default RealTimeStats;