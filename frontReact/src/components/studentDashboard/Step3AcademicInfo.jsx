import React, { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';

const Step3AcademicInfo = ({ initialData = {}, onSaveAndNext, onSave, onPrevious }) => {
    // Map initialData from DTO names to state names
    const [lastInstitution, setLastInstitution] = useState(initialData.lastInstitution || '');
    const [specialization, setSpecialization] = useState(initialData.specialization || 'Oncogénétique');
    const [otherSpecialization, setOtherSpecialization] = useState(initialData.otherSpecialization || '');
    const [startDate, setStartDate] = useState(initialData.startDate || '');
    const [endDate, setEndDate] = useState(initialData.endDate || '');
    
    // Validation error states
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setLastInstitution(initialData.lastInstitution || '');
            setSpecialization(initialData.specialization || 'Oncogénétique');
            setOtherSpecialization(initialData.otherSpecialization || '');
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
            otherSpecialization: specialization === 'Autre' ? otherSpecialization : '',
            startDate,
            endDate,
        };
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!lastInstitution) newErrors.lastInstitution = "Le dernier établissement fréquenté est obligatoire";
        if (!specialization) newErrors.specialization = "La spécialisation est obligatoire";
        if (!startDate) newErrors.startDate = "La date de début de formation est obligatoire";
        if (!endDate) newErrors.endDate = "La date de fin de formation est obligatoire";
        
        // If "Autre" is selected, ensure otherSpecialization is provided
        if (specialization === 'Autre' && !otherSpecialization) {
            newErrors.otherSpecialization = "Veuillez préciser votre spécialisation";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveClick = () => {
        onSave(collectData());
    };

    const handleNextClick = () => {
        if (validateForm()) {
            onSaveAndNext(collectData());
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-[1.28rem]">
                <div>
                    <label htmlFor="lastInstitution" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Dernier établissement fréquenté <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="lastInstitution"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.lastInstitution ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez votre dernier établissement fréquenté"
                        value={lastInstitution}
                        onChange={(e) => {
                            setLastInstitution(e.target.value);
                            if (errors.lastInstitution) {
                                setErrors(prev => ({ ...prev, lastInstitution: '' }));
                            }
                        }}
                        required
                    />
                    {errors.lastInstitution && <p className="text-red-500 text-[1.2rem] mt-1">{errors.lastInstitution}</p>}
                </div>

                <div>
                    <label htmlFor="specialization" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Spécialisation <span className="text-red-500">*</span></label>
                    <select
                        id="specialization"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] appearance-none ${
                            errors.specialization ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B4F8B' d='M9.293 12.95l.707.707L15 9.707l-1.414-1.414L10 10.586l-3.586-3.586L5 8.293z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.64rem center',
                            backgroundSize: '1.28rem',
                            backgroundColor: 'rgba(242, 242, 242, 0.6)',
                            fontSize: '1.5rem'
                        }}
                        value={specialization}
                        onChange={(e) => {
                            setSpecialization(e.target.value);
                            if (errors.specialization) {
                                setErrors(prev => ({ ...prev, specialization: '' }));
                            }
                        }}
                        required
                    >
                        {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                    {errors.specialization && <p className="text-red-500 text-[1.2rem] mt-1">{errors.specialization}</p>}
                </div>

                {specialization === 'Autre' && (
                    <div>
                        <label htmlFor="otherSpecialization" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Veuillez préciser votre spécialisation <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="otherSpecialization"
                            className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                                errors.otherSpecialization ? 'border-red-500' : 'border-[#79747E]'
                            }`}
                            style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                            placeholder="Entrez votre spécialisation"
                            value={otherSpecialization}
                            onChange={(e) => {
                                setOtherSpecialization(e.target.value);
                                if (errors.otherSpecialization) {
                                    setErrors(prev => ({ ...prev, otherSpecialization: '' }));
                                }
                            }}
                            required
                        />
                        {errors.otherSpecialization && <p className="text-red-500 text-[1.2rem] mt-1">{errors.otherSpecialization}</p>}
                    </div>
                )}

                <div>
                    <label htmlFor="startDate" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Début de formation <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        id="startDate"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.startDate ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="JJ/MM/AA"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            if (errors.startDate) {
                                setErrors(prev => ({ ...prev, startDate: '' }));
                            }
                        }}
                        required
                    />
                    {errors.startDate && <p className="text-red-500 text-[1.2rem] mt-1">{errors.startDate}</p>}
                </div>

                <div>
                    <label htmlFor="endDate" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Fin de formation <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        id="endDate"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.endDate ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="JJ/MM/AA"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            if (errors.endDate) {
                                setErrors(prev => ({ ...prev, endDate: '' }));
                            }
                        }}
                        required
                    />
                    {errors.endDate && <p className="text-red-500 text-[1.2rem] mt-1">{errors.endDate}</p>}
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