import React, { useState, useEffect } from 'react';
import { getAllEnrollments } from '../../services/enrollmentManagementService';
import { getAllPrograms } from '../../services/programService';

const EnrollmentByFieldChart = () => {
    const [fieldData, setFieldData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrollmentByFieldData = async () => {
            try {
                // Fetch all enrollments and programs
                const [enrollmentsResponse, programsResponse] = await Promise.all([
                    getAllEnrollments(),
                    getAllPrograms()
                ]);
                
                const enrollments = enrollmentsResponse.data;
                const programs = programsResponse.data;
                
                const programMap = {};
                programs.forEach(program => {
                    programMap[program.id] = program.programName;
                });
                
                // Count enrollments by program
                const programCount = {};
                enrollments.forEach(enrollment => {
                    const programId = enrollment.programId;
                    programCount[programId] = (programCount[programId] || 0) + 1;
                });
                
                // Convert to array format for display
                const data = Object.entries(programCount).map(([programId, count]) => ({
                    programName: programMap[programId] || 'Formation inconnue',
                    programId,
                    count
                }));
                
                // Sort by count descending
                data.sort((a, b) => b.count - a.count);
                
                setFieldData(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchEnrollmentByFieldData();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
                <div
                    className="p-4 rounded-t-[0.53rem]"
                    style={{ backgroundColor: '#1019574D' }}
                >
                    <h4 className="text-[#101957] font-semibold text-[1.5rem]">Inscription par Formation</h4>
                </div>
                <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center">
                    <div>Chargement...</div>
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
                    <h4 className="text-[#101957] font-semibold text-[1.5rem]">Inscription par Formation</h4>
                </div>
                <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center">
                    <div>Erreur: {error.message}</div>
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
                <h4 className="text-[#101957] font-semibold text-sm">Inscription par Formation</h4>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex-grow">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Inscriptions par formation</h3>
                <div className="space-y-3">
                    {fieldData.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-3/4">
                                <div className="text-[#333333] text-sm font-medium">{item.programName}</div>
                                <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                                    <div 
                                        className="bg-[#101957] h-full rounded-full" 
                                        style={{ width: `${fieldData.length > 0 ? (item.count / Math.max(...fieldData.map(d => d.count))) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-1/4 text-right text-[#666666] text-sm font-bold">
                                {item.count}
                            </div>
                        </div>
                    ))}
                </div>
                {fieldData.length === 0 && (
                    <div className="text-center text-gray-500 mt-4">
                        Aucune inscription trouvée
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrollmentByFieldChart;