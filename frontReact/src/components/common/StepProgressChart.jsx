import React, { useState, useEffect } from 'react';
import { getAllEnrollments } from '../../services/enrollmentManagementService';

const StepProgressChart = () => {
    const [stepData, setStepData] = useState({
        step1: 0,
        step2: 0,
        step3: 0,
        step4: 0,
        step5: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStepProgressData = async () => {
            try {
                // Fetch all enrollments
                const response = await getAllEnrollments();
                const enrollments = response.data;
                
                // Count enrollments by step completed
                const stepCount = {
                    step1: 0,
                    step2: 0,
                    step3: 0,
                    step4: 0,
                    step5: 0
                };
                
                enrollments.forEach(enrollment => {
                    const step = enrollment.stepCompleted;
                    if (step >= 1 && step <= 5) {
                        switch (step) {
                            case 1:
                                stepCount.step1++;
                                break;
                            case 2:
                                stepCount.step2++;
                                break;
                            case 3:
                                stepCount.step3++;
                                break;
                            case 4:
                                stepCount.step4++;
                                break;
                            case 5:
                                stepCount.step5++;
                                break;
                            default:
                                break;
                        }
                    }
                });
                
                setStepData(stepCount);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchStepProgressData();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
                <div
                    className="p-4 rounded-t-[0.53rem]"
                    style={{ backgroundColor: '#1019574D' }}
                >
                    <h4 className="text-[#101957] font-semibold text-[1.5rem]">Progression des Étapes</h4>
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
                    <h4 className="text-[#101957] font-semibold text-[1.5rem]">Progression des Étapes</h4>
                </div>
                <div className="p-6 flex-grow flex items-center justify-center">
                    Erreur: {error.message}
                </div>
            </div>
        );
    }

    // Calculate total for percentages
    const total = stepData.step1 + stepData.step2 + stepData.step3 + stepData.step4 + stepData.step5;
    
    return (
        <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
            <div
                className="p-4 rounded-t-[0.53rem]"
                style={{ backgroundColor: '#1019574D' }}
            >
                <h4 className="text-[#101957] font-semibold text-sm">Progression des Étapes</h4>
            </div>
            <div className="p-6 flex-grow">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-[#333333] text-sm">
                            <span>Étape 1 - Informations personnelles</span>
                            <span>{stepData.step1} ({total > 0 ? Math.round((stepData.step1 / total) * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                            <div 
                                className="bg-[#101957] h-full rounded-full" 
                                style={{ width: `${total > 0 ? (stepData.step1 / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[#333333] text-sm">
                            <span>Étape 2 - Informations académiques</span>
                            <span>{stepData.step2} ({total > 0 ? Math.round((stepData.step2 / total) * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                            <div 
                                className="bg-[#101957] h-full rounded-full" 
                                style={{ width: `${total > 0 ? (stepData.step2 / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[#333333] text-sm">
                            <span>Étape 3 - Documents</span>
                            <span>{stepData.step3} ({total > 0 ? Math.round((stepData.step3 / total) * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                            <div 
                                className="bg-[#101957] h-full rounded-full" 
                                style={{ width: `${total > 0 ? (stepData.step3 / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[#333333] text-sm">
                            <span>Étape 4 - Révision</span>
                            <span>{stepData.step4} ({total > 0 ? Math.round((stepData.step4 / total) * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                            <div 
                                className="bg-[#101957] h-full rounded-full" 
                                style={{ width: `${total > 0 ? (stepData.step4 / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[#333333] text-sm">
                            <span>Étape 5 - Soumission</span>
                            <span>{stepData.step5} ({total > 0 ? Math.round((stepData.step5 / total) * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                            <div 
                                className="bg-[#101957] h-full rounded-full" 
                                style={{ width: `${total > 0 ? (stepData.step5 / total) * 100 : 0}%` }}
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

export default StepProgressChart;