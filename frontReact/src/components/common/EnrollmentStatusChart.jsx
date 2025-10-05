import React, { useState, useEffect } from 'react';
import { getAllEnrollments } from '../../services/enrollmentManagementService';

const EnrollmentStatusChart = () => {
    const [statusData, setStatusData] = useState({
        pending: 0,
        validated: 0,
        rejected: 0,
        correctionsRequired: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrollmentStatusData = async () => {
            try {
                // Fetch all enrollments
                const response = await getAllEnrollments();
                const enrollments = response.data;
                
                // Count enrollments by status
                const statusCount = {
                    pending: 0,
                    validated: 0,
                    rejected: 0,
                    correctionsRequired: 0
                };
                
                enrollments.forEach(enrollment => {
                    switch (enrollment.status) {
                        case 'PENDING':
                        case 'IN_PROGRESS':
                            statusCount.pending++;
                            break;
                        case 'APPROVED':
                            statusCount.validated++;
                            break;
                        case 'REJECTED':
                            statusCount.rejected++;
                            break;
                        case 'CORRECTIONS_REQUIRED':
                            statusCount.correctionsRequired++;
                            break;
                        default:
                            break;
                    }
                });
                
                setStatusData(statusCount);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchEnrollmentStatusData();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
                <div
                    className="p-4 rounded-t-[0.53rem]"
                    style={{ backgroundColor: '#1019574D' }}
                >
                    <h4 className="text-[#101957] font-semibold text-[1.5rem]">Statut des Inscriptions</h4>
                </div>
                <div className="p-6 flex-grow flex items-center justify-center">
                    Chargement...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
                <div
                    className="p-4 rounded-t-[0.53rem]"
                    style={{ backgroundColor: '#1019574D' }}
                >
                    <h4 className="text-[#101957] font-semibold text-[1.5rem]">Statut des Inscriptions</h4>
                </div>
                <div className="p-6 flex-grow flex items-center justify-center">
                    Erreur: {error.message}
                </div>
            </div>
        );
    }

    // Calculate total for percentages
    const total = statusData.pending + statusData.validated + statusData.rejected + statusData.correctionsRequired;
    
    return (
        <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
            <div
                className="p-4 rounded-t-[0.53rem]"
                style={{ backgroundColor: '#1019574D' }}
            >
                <h4 className="text-[#101957] font-semibold text-sm">Statut des Inscriptions</h4>
            </div>
            <div className="p-6 flex-grow">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-[#333333] text-sm">
                            <span>En attente</span>
                            <span>{statusData.pending} ({total > 0 ? Math.round((statusData.pending / total) * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                            <div 
                                className="bg-[#FFA500] h-full rounded-full" 
                                style={{ width: `${total > 0 ? (statusData.pending / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[#333333] text-sm">
                            <span>Validées</span>
                            <span>{statusData.validated} ({total > 0 ? Math.round((statusData.validated / total) * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                            <div 
                                className="bg-[#00FF00] h-full rounded-full" 
                                style={{ width: `${total > 0 ? (statusData.validated / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[#333333] text-sm">
                            <span>Rejetées</span>
                            <span>{statusData.rejected} ({total > 0 ? Math.round((statusData.rejected / total) * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                            <div 
                                className="bg-[#FF0000] h-full rounded-full" 
                                style={{ width: `${total > 0 ? (statusData.rejected / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[#333333] text-sm">
                            <span>Corrections requises</span>
                            <span>{statusData.correctionsRequired} ({total > 0 ? Math.round((statusData.correctionsRequired / total) * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                            <div 
                                className="bg-[#FF8C00] h-full rounded-full" 
                                style={{ width: `${total > 0 ? (statusData.correctionsRequired / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center text-sm font-bold">
                    Total: {total} inscriptions
                </div>
            </div>
        </div>
    );
};

export default EnrollmentStatusChart;