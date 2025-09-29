import React, { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';

const Step3AcademicInfo = ({ initialData = {}, onSaveAndNext, onSave, onPrevious }) => {
    // Map initialData from DTO names to state names
    const [lastInstitution, setLastInstitution] = useState(initialData.lastInstitution || '');
    const [specialization, setSpecialization] = useState(initialData.specialization || 'Oncogénétique');
    // Using a boolean for the internship availability
    const [availableForInternship, setAvailableForInternship] = useState(initialData.availableForInternship || null);
    const [startDate, setStartDate] = useState(initialData.startDate || '');
    const [endDate, setEndDate] = useState(initialData.endDate || '');

    useEffect(() => {
        if (initialData) {
            setLastInstitution(initialData.lastInstitution || '');
            setSpecialization(initialData.specialization || 'Oncogénétique');
            // Ensure the initial data is correctly converted back to a boolean if it's a string
            setAvailableForInternship(typeof initialData.availableForInternship === 'boolean' ? initialData.availableForInternship : null);
            setStartDate(initialData.startDate || '');
            setEndDate(initialData.endDate || '');
        }
    }, [initialData]);

    const specializations = [
        'Oncogénétique',
        'Bio-informatique',
        'Biotechnologie',
        'Génétique Humaine',
        'Microbiologie',
        'Virologie',
        'Immunologie',
        'Biochimie',
        'Biophysique',
        'Autre',
    ];

    const collectData = () => {
        return {
            lastInstitution,
            specialization,
            availableForInternship, // This will be a boolean
            startDate,
            endDate,
        };
    };

    const handleSaveClick = () => {
        onSave(collectData());
    };

    const handleNextClick = () => {
        onSaveAndNext(collectData());
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-[1.28rem]">
                <div>
                    <label htmlFor="lastInstitution" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Dernier établissement fréquenté</label>
                    <input
                        type="text"
                        id="lastInstitution"
                        className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333]"
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez votre dernier établissement fréquenté"
                        value={lastInstitution}
                        onChange={(e) => setLastInstitution(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="specialization" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Spécialisation</label>
                    <select
                        id="specialization"
                        className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B4F8B' d='M9.293 12.95l.707.707L15 9.707l-1.414-1.414L10 10.586l-3.586-3.586L5 8.293z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.64rem center',
                            backgroundSize: '1.28rem',
                            backgroundColor: 'rgba(242, 242, 242, 0.6)',
                            fontSize: '1.5rem'
                        }}
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                    >
                        {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-[#333333] text-[1.5rem] font-normal">Seriez-vous disponible pour un programme de stage dans votre région ?</label>
                    <div className="flex space-x-[1.28rem] items-center">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-[#6B4F8B]"
                                name="availableForInternship"
                                value="true" // HTML value is a string
                                checked={availableForInternship === true} // Compare against the boolean state
                                onChange={() => setAvailableForInternship(true)} // Set the state as a boolean
                            />
                            <span className="ml-[0.43rem] text-[#333333] text-[1.5rem] font-normal">Oui</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-[#6B4F8B]"
                                name="availableForInternship"
                                value="false" // HTML value is a string
                                checked={availableForInternship === false} // Compare against the boolean state
                                onChange={() => setAvailableForInternship(false)} // Set the state as a boolean
                            />
                            <span className="ml-[0.43rem] text-[#333333] text-[1.5rem] font-normal">Non</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="startDate" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Début de formation</label>
                    <input
                        type="date"
                        id="startDate"
                        className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333]"
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="JJ/MM/AA"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="endDate" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Fin de formation</label>
                    <input
                        type="date"
                        id="endDate"
                        className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333]"
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="JJ/MM/AA"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-between gap-4 mt-8">
                <Button
                    secondary
                    type="button"
                    onClick={onPrevious}
                    className="flex-1 !w-auto font-semibold text-[1.28rem] leading-[127.5%] tracking-[0.0298rem]"
                    style={{ fontFamily: 'Roboto, sans-serif', height: '2.98rem' }}
                >
                    Précédent
                </Button>
                <Button
                    primary
                    type="button"
                    onClick={handleNextClick}
                    className="flex-1 !w-auto font-semibold text-[1.28rem] leading-[127.5%] tracking-[0.0298rem]"
                    style={{ fontFamily: 'Roboto, sans-serif', height: '2.98rem' }}
                >
                    Suivant
                </Button>
            </div>
        </>
    );
};

export default Step3AcademicInfo;