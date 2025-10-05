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
        return (
            <div className="p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Statistiques</h2>
                        <p className="text-gray-600 mt-1">Consultez les statistiques de la plateforme</p>
                    </div>
                    <div>
                        {/* Empty div to match the structure of other admin components */}
                    </div>
                </div>
                <div className="w-full h-1 bg-[#101957] my-8"></div>
                <div>Chargement des statistiques...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Statistiques</h2>
                        <p className="text-gray-600 mt-1">Consultez les statistiques de la plateforme</p>
                    </div>
                    <div>
                        {/* Empty div to match the structure of other admin components */}
                    </div>
                </div>
                <div className="w-full h-1 bg-[#101957] my-8"></div>
                <div className="text-red-500">Erreur lors du chargement des statistiques: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Statistiques</h2>
                    <p className="text-gray-600 mt-1 text-sm">Consultez les statistiques de la plateforme</p>
                </div>
                <div>
                    {/* Empty div to match the structure of other admin components */}
                </div>
            </div>
            
            <div className="w-full h-1 bg-[#101957] my-4"></div>

            {/* Main two-column layout */}
            <div className="flex gap-2 sm:gap-4 flex-col lg:flex-row">
                {/* Left side column */}
                <div className="flex flex-col gap-4 flex-grow">
                    {/* Top part of the left side */}
                    <div className="flex gap-4 flex-col lg:flex-row">
                        {/* Vue d'Ensemble Rapide container */}
                        <div
                            className="flex-grow flex-col p-1 rounded-[0.75rem] shadow"
                            style={{
                                backgroundColor: '#1019574D',
                                gap: '0.05rem',
                                color: '#101957'
                            }}
                        >
                            <h3 className="font-bold text-sm mb-1">Vue d'Ensemble Rapide</h3>
                            <div className="grid grid-cols-2 gap-[0.1rem] flex-grow">
                                <StatsCard title="Inscriptions Totales" value={statistics?.totalEnrollments || '0'} color="bg-[#FFFFFF]" shadowColor="#101957" icon="/assets/svg/enrollment-icon.svg" />
                                <StatsCard title="Inscriptions Validées" value={statistics?.validatedEnrollments || '0'} color="bg-[#FFFFFF]" shadowColor="#101957" icon="/assets/svg/dashboard-icon.svg" />
                                <StatsCard title="En Attente de Validation" value={statistics?.pendingEnrollments || '0'} color="bg-[#FFFFFF]" shadowColor="#101957" icon="/assets/svg/help-icon.svg" />
                                <StatsCard title="Nouveaux Comptes (24h)" value={statistics?.newAccountsLast24h || '0'} color="bg-[#FFFFFF]" shadowColor="#101957" icon="/assets/svg/user-management-icon.svg" />
                            </div>
                        </div>

                        {/* Real-time Stats container */}
                        <div className="flex-grow lg:w-1/3" style={{ maxHeight: '150px' }}>
                            <RealTimeStats />
                        </div>
                    </div>

                    {/* Middle part of the left side */}
                    <div className="flex gap-4 flex-col lg:flex-row">
                        {/* Container for the two smaller charts */}
                        <div className="flex flex-col gap-4 lg:w-1/3">
                            <div className="flex-grow" style={{ maxHeight: '130px' }}>
                                <EnrollmentStatusChart />
                            </div>
                            <div className="flex-grow" style={{ maxHeight: '130px' }}>
                                <EnrollmentByFieldChart />
                            </div>
                        </div>
                        {/* Container for the larger chart */}
                        <div className="flex-grow lg:w-2/3" style={{ maxHeight: '300px' }}>
                            <StepProgressChart />
                        </div>
                    </div>
                </div>

                {/* Right side column */}
                <div className="flex flex-col gap-4 lg:w-1/4">
                    <div className="flex-grow" style={{ maxHeight: '200px' }}>
                        <EnrollmentDensityChart />
                    </div>
                    <div className="flex-grow" style={{ maxHeight: '200px' }}>
                        <PendingDocuments />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardContent;