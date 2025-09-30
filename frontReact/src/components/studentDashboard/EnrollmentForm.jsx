import React, { useState, useEffect } from 'react';
import Step1PersonalInfo from './Step1PersonalInfo.jsx';
import Step2Documents from './Step2Documents.jsx';
import Step3AcademicInfo from './Step3AcademicInfo.jsx';
import Step4ContactInfo from './Step4ContactInfo.jsx';
import Step5Summary from './Step5Summary.jsx';

const EnrollmentForm = ({ course, onFormSubmitted }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        step1: {},
        step2: {},
        step3: {},
        step4: {},
    });

    const handleSave = (stepName, data) => {
        setFormData(prevData => ({
            ...prevData,
            [stepName]: data
        }));
    };

    const handleNext = (stepName, data) => {
        handleSave(stepName, data);
        setStep(prevStep => prevStep + 1);
    };

    const handlePrevious = () => {
        setStep(prevStep => prevStep - 1);
    };

    const combinedFormData = {
        ...formData.step1,
        ...formData.step2,
        ...formData.step3,
        ...formData.step4,
    };
    
    // Get the identity document type from step 1 data
    const identityDocumentType = formData.step1.typePieceIdentite || 'CNI';
    
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Step1PersonalInfo
                        initialData={formData.step1}
                        onSaveAndNext={(data) => handleNext('step1', data)}
                        onSave={(data) => handleSave('step1', data)}
                    />
                );
            case 2:
                return (
                    <Step2Documents
                        initialData={formData.step2}
                        identityDocumentType={identityDocumentType}
                        onSaveAndNext={(data) => handleNext('step2', data)}
                        onSave={(data) => handleSave('step2', data)}
                        onPrevious={handlePrevious}
                    />
                );
            case 3:
                return (
                    <Step3AcademicInfo
                        initialData={formData.step3}
                        onSaveAndNext={(data) => handleNext('step3', data)}
                        onSave={(data) => handleSave('step3', data)}
                        onPrevious={handlePrevious}
                    />
                );
            case 4:
                return (
                    <Step4ContactInfo
                        initialData={formData.step4}
                        onSaveAndNext={(data) => handleNext('step4', data)}
                        onSave={(data) => handleSave('step4', data)}
                        onPrevious={handlePrevious}
                    />
                );
            case 5:
                return (
                    <Step5Summary
                        formData={combinedFormData}
                        course={course}
                        onPrevious={handlePrevious}
                        onFinish={(dataWithInternship) => onFormSubmitted(dataWithInternship)}
                    />
                );
            default:
                return <div>Étape non trouvée</div>;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA] text-[#101957] p-8 rounded-[0.52rem] border border-[#E0E0E0] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] overflow-y-auto">
            {renderStep()}
        </div>
    );
};

export default EnrollmentForm;