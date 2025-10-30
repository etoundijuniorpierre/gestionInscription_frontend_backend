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
                const enrollments = response.data || []; // Ensure enrollments is an array
                
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
                console.error('Error fetching step progress data:', err);
                setError(err);
                setLoading(false);
            }
        };

        fetchStepProgressData();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow h-full flex flex-col">
                <div className="bg-[#1019574D] rounded-t-lg p-3">
                    <h4 className="text-[#101957] font-semibold text-sm">Progression des Étapes</h4>
                </div>
                <div className="p-4 flex-grow flex items-center justify-center">
                    Chargement...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow h-full flex flex-col">
                <div className="bg-[#1019574D] rounded-t-lg p-3">
                    <h4 className="text-[#101957] font-semibold text-sm">Progression des Étapes</h4>
                </div>
                <div className="p-4 flex-grow flex items-center justify-center">
                    Erreur: {error.message}
                </div>
            </div>
        );
    }

    // Calculate total for percentages
    const total = stepData.step1 + stepData.step2 + stepData.step3 + stepData.step4 + stepData.step5;
    
    return (
        <div className="bg-white rounded-lg shadow h-full flex flex-col">
            <div className="bg-[#1019574D] rounded-t-lg p-3">
                <h4 className="text-[#101957] font-semibold text-sm">Progression des Étapes</h4>
            </div>
            <div className="p-3 flex-grow overflow-hidden">
                <div className="space-y-3 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between text-[#333333] text-xs">
                            <span className="truncate">Étape 1 - Perso.</span>
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
                        <div className="flex justify-between text-[#333333] text-xs">
                            <span className="truncate">Étape 2 - Académ.</span>
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
                        <div className="flex justify-between text-[#333333] text-xs">
                            <span className="truncate">Étape 3 - Docs</span>
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
                        <div className="flex justify-between text-[#333333] text-xs">
                            <span className="truncate">Étape 4 - Rév.</span>
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
                        <div className="flex justify-between text-[#333333] text-xs">
                            <span className="truncate">Étape 5 - Soum.</span>
                            <span>{stepData.step5} ({total > 0 ? Math.round((stepData.step5 / total) * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-[#E0E0E0] h-2 rounded-full mt-1">
                            <div 
                                className="bg-[#101957] h-full rounded-full" 
                                style={{ width: `${total > 0 ? (stepData.step5 / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="text-center text-xs font-bold mt-2">
                        Total: {total} inscriptions
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepProgressChart;