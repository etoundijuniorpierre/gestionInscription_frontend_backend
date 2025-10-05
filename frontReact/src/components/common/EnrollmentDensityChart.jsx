import React, { useState, useEffect } from 'react';
import { getAllEnrollments } from '../../services/enrollmentManagementService';
import { getAllPrograms } from '../../services/programService';

const EnrollmentDensityChart = () => {
    const [densityData, setDensityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all enrollments and programs
                const [enrollmentsResponse, programsResponse] = await Promise.all([
                    getAllEnrollments(),
                    getAllPrograms()
                ]);
                
                const enrollments = enrollmentsResponse.data;
                const programs = programsResponse.data;
                
                // Calculate enrollment count by program
                const programEnrollmentCount = {};
                enrollments.forEach(enrollment => {
                    const programId = enrollment.programId;
                    programEnrollmentCount[programId] = (programEnrollmentCount[programId] || 0) + 1;
                });
                
                // Find the maximum enrollment count for percentage calculation
                const maxCount = Math.max(...Object.values(programEnrollmentCount), 1);
                
                // Create density data with program names and percentages
                const data = programs.map(program => {
                    const count = programEnrollmentCount[program.id] || 0;
                    const percentage = Math.round((count / maxCount) * 100);
                    return {
                        filiere: program.programName,
                        percentage: percentage,
                        count: count
                    };
                });
                
                setDensityData(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
                <div
                    className="p-4 rounded-t-[0.53rem]"
                    style={{ backgroundColor: '#1019574D' }}
                >
                    <h4 className="text-[#101957] font-semibold text-[1.5rem]">Densité des Inscriptions par Formation</h4>
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
                    <h4 className="text-[#101957] font-semibold text-[1.5rem]">Densité des Inscriptions par Formation</h4>
                </div>
                <div className="p-6 flex-grow flex items-center justify-center">
                    Erreur: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
            <div
                className="p-4 rounded-t-[0.53rem]"
                style={{ backgroundColor: '#1019574D' }}
            >
                <h4 className="text-[#101957] font-semibold text-sm">Densité des Inscriptions par Formation</h4>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-center">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Densité des inscriptions</h3>
                <p className="text-[#666666] text-sm mb-4">Visualisation de la répartition des inscriptions par formation</p>
                <div className="space-y-4">
                    {densityData.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between text-[#333333] text-sm">
                                <span>{item.filiere}</span>
                                <span>{item.percentage}% ({item.count})</span>
                            </div>
                            <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                                <div className="bg-[#101957] h-full rounded-full" style={{ width: `${item.percentage}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EnrollmentDensityChart;