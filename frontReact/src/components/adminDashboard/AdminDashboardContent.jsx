import React, { useState, useEffect } from 'react';
import StatsCard from '../common/StatsCard';
import RealTimeStats from '../common/RealTimeStats';
import EnrollmentDensityChart from '../common/EnrollmentDensityChart';
import PendingDocuments from '../common/PendingDocuments';
import EnrollmentStatusChart from '../common/EnrollmentStatusChart';
import StepProgressChart from '../common/StepProgressChart';
import EnrollmentByFieldChart from '../common/EnrollmentByFieldChart';
import AdminMessage from '../common/AdminMessage';
import BandwidthStats from '../common/BandwidthStats';
import { getStatistics } from '../../services/statisticsService';

const AdminDashboardContent = () => {
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
        return <div className="p-8">Chargement des statistiques...</div>;
    }

    if (error) {
        return <div className="p-8">Erreur lors du chargement des statistiques: {error.message}</div>;
    }

    return (
        <div className="p-8" style={{ backgroundColor: '#F8F8F8' }}>
            <h2 className="text-[#101957] text-[2.5rem] font-bold mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>Statistiques</h2>
            
            <div
                className="w-full"
                style={{
                    height: '5px',
                    backgroundColor: '#101957',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                }}
            ></div>

            {/* Main two-column layout */}
            <div className="flex gap-6">
                {/* Left side column */}
                <div className="flex flex-col gap-6 flex-grow">
                    {/* Top part of the left side */}
                    <div className="flex gap-6 flex-grow">
                        {/* Vue d'Ensemble Rapide container */}
                        <div
                            className="flex-grow flex-col p-4 rounded-[0.75rem] shadow"
                            style={{
                                backgroundColor: '#1019574D',
                                gap: '0.5rem',
                                color: '#101957'
                            }}
                        >
                            <h3 className="font-bold text-[1.5rem] mb-2">Vue d'Ensemble Rapide</h3>
                            <div className="grid grid-cols-2 gap-[0.5rem] flex-grow">
                                <StatsCard title="Inscriptions Totales" value={statistics?.totalEnrollments || '0'} color="bg-[#FFFFFF]" shadowColor="#101957" />
                                <StatsCard title="Inscriptions Validées" value={statistics?.validatedEnrollments || '0'} color="bg-[#FFFFFF]" shadowColor="#101957" />
                                <StatsCard title="En Attente de Validation" value={statistics?.pendingEnrollments || '0'} color="bg-[#FFFFFF]" shadowColor="#101957" />
                                <StatsCard title="Nouveaux Comptes (24h)" value={statistics?.newAccountsLast24h || '0'} color="bg-[#FFFFFF]" shadowColor="#101957" />
                            </div>
                        </div>

                        {/* Real-time Stats container */}
                        <div className="flex-grow">
                            <RealTimeStats connectedAccounts={statistics?.connectedAccounts || 0} />
                        </div>
                    </div>

                    {/* Middle part of the left side */}
                    <div className="flex gap-6 flex-grow">
                        {/* Container for the two smaller charts */}
                        <div className="flex flex-col gap-6" style={{ flexBasis: '33.333%', flexGrow: 1 }}>
                            <div className="flex-grow">
                                <EnrollmentStatusChart />
                            </div>
                            <div className="flex-grow">
                                <EnrollmentByFieldChart />
                            </div>
                        </div>
                        {/* Container for the larger chart */}
                        <div className="flex-grow" style={{ flexBasis: '66.666%', flexGrow: 2 }}>
                            <StepProgressChart />
                        </div>
                    </div>

                    {/* Bottom part of the left side */}
                    <div className="flex flex-row gap-6">
                        <AdminMessage />
                        <BandwidthStats />
                    </div>
                </div>

                {/* Right side column */}
                <div className="flex flex-col gap-6" style={{ flexBasis: '25%' }}>
                    <div className="flex-grow">
                        <EnrollmentDensityChart />
                    </div>
                    <div className="flex-grow">
                        <PendingDocuments />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardContent;