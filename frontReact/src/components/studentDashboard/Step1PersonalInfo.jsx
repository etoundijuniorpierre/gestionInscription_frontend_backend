import React, { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';

const Step1PersonalInfo = ({ initialData = {}, onSaveAndNext, onSave }) => {
    // Map initialData from DTO names to state names
    const [firstName, setFirstName] = useState(initialData.firstName || '');
    const [lastName, setLastName] = useState(initialData.lastName || '');
    const [gender, setGender] = useState(initialData.gender || '');
    const [dateOfBirth, setDateOfBirth] = useState(initialData.dateOfBirth || '');
    const [nationality, setNationality] = useState(initialData.nationality || 'Camerounais');
    // Note: 'typePieceIdentite' is not in the backend DTO, so we keep it locally.
    const [typePieceIdentite, setTypePieceIdentite] = useState(initialData.typePieceIdentite || 'CNI');
    
    // Validation error states
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFirstName(initialData.firstName || '');
        setLastName(initialData.lastName || '');
        setGender(initialData.gender || '');
        setDateOfBirth(initialData.dateOfBirth || '');
        setNationality(initialData.nationality || 'Camerounais');
        // Keep this local state
        setTypePieceIdentite(initialData.typePieceIdentite || 'CNI');
    }, [initialData]);

    const centralAfricanNationalities = [
        'Camerounais',
        'Centrafricain',
        'Tchadien',
        'Congolais (RDC)',
        'Congolais (République)',
        'Guinéen équatorial',
        'Gabonais',
        'Santoméen',
        'Autre',
    ];

    const collectData = () => {
        return {
            // Map frontend field names to backend field names
            lastName: lastName,
            firstName: firstName,
            gender: gender,
            dateOfBirth: dateOfBirth,
            nationality: nationality,
            typePieceIdentite: typePieceIdentite
        };
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!firstName) newErrors.firstName = "Le prénom est obligatoire";
        if (!lastName) newErrors.lastName = "Le nom est obligatoire";
        if (!gender) newErrors.gender = "Le sexe est obligatoire";
        if (!dateOfBirth) newErrors.dateOfBirth = "La date de naissance est obligatoire";
        if (!nationality) newErrors.nationality = "La nationalité est obligatoire";
        if (!typePieceIdentite) newErrors.typePieceIdentite = "Le type de pièce d'identité est obligatoire";
        
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
                    <label htmlFor="lastName" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Nom <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="lastName"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.lastName ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez votre nom"
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                            if (errors.lastName) {
                                setErrors(prev => ({ ...prev, lastName: '' }));
                            }
                        }}
                        required
                    />
                    {errors.lastName && <p className="text-red-500 text-[1.2rem] mt-1">{errors.lastName}</p>}
                </div>

                <div>
                    <label htmlFor="firstName" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Prénom <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="firstName"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.firstName ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez votre prénom"
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                            if (errors.firstName) {
                                setErrors(prev => ({ ...prev, firstName: '' }));
                            }
                        }}
                        required
                    />
                    {errors.firstName && <p className="text-red-500 text-[1.2rem] mt-1">{errors.firstName}</p>}
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-[#333333] text-[1.5rem] font-normal">Sexe : <span className="text-red-500">*</span></label>
                    <div className="flex space-x-[1.28rem] items-center">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-[#6B4F8B]"
                                name="gender"
                                value="FEMININ"
                                checked={gender === 'FEMININ'}
                                onChange={(e) => {
                                    setGender(e.target.value);
                                    if (errors.gender) {
                                        setErrors(prev => ({ ...prev, gender: '' }));
                                    }
                                }}
                                required
                            />
                            <span className="ml-[0.43rem] text-[#333333] text-[1.5rem] font-normal">Féminin</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-[#6B4F8B]"
                                name="gender"
                                value="MASCULIN"
                                checked={gender === 'MASCULIN'}
                                onChange={(e) => {
                                    setGender(e.target.value);
                                    if (errors.gender) {
                                        setErrors(prev => ({ ...prev, gender: '' }));
                                    }
                                }}
                                required
                            />
                            <span className="ml-[0.43rem] text-[#333333] text-[1.5rem] font-normal">Masculin</span>
                        </label>
                    </div>
                </div>
                {errors.gender && <p className="text-red-500 text-[1.2rem] mt-1">{errors.gender}</p>}

                <div>
                    <label htmlFor="dateOfBirth" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Date de naissance <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.dateOfBirth ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="JJ/MM/AA"
                        value={dateOfBirth}
                        onChange={(e) => {
                            setDateOfBirth(e.target.value);
                            if (errors.dateOfBirth) {
                                setErrors(prev => ({ ...prev, dateOfBirth: '' }));
                            }
                        }}
                        required
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-[1.2rem] mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                    <label htmlFor="nationality" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Nationalité <span className="text-red-500">*</span></label>
                    <select
                        id="nationality"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.nationality ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        value={nationality}
                        onChange={(e) => {
                            setNationality(e.target.value);
                            if (errors.nationality) {
                                setErrors(prev => ({ ...prev, nationality: '' }));
                            }
                        }}
                        required
                    >
                        {centralAfricanNationalities.map((nation) => (
                            <option key={nation} value={nation}>
                                {nation}
                            </option>
                        ))}
                    </select>
                    {errors.nationality && <p className="text-red-500 text-[1.2rem] mt-1">{errors.nationality}</p>}
                </div>

                <div>
                    <label htmlFor="typePieceIdentite" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">
                        Type de pièce d'identité <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="typePieceIdentite"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.typePieceIdentite ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        value={typePieceIdentite}
                        onChange={(e) => {
                            setTypePieceIdentite(e.target.value);
                            if (errors.typePieceIdentite) {
                                setErrors(prev => ({ ...prev, typePieceIdentite: '' }));
                            }
                        }}
                        required
                    >
                        <option value="CNI">Carte Nationale d'Identité (CNI)</option>
                        <option value="Passport">Passport</option>
                        <option value="Permis de conduire">Permis de conduire</option>
                    </select>
                    {errors.typePieceIdentite && <p className="text-red-500 text-[1.2rem] mt-1">{errors.typePieceIdentite}</p>}
                </div>
            </div>

            <div className="flex justify-between gap-4 mt-8">
                <Button
                    variant="secondary"
                    onClick={handleSaveClick}
                    className="px-8 py-3 text-[1.5rem]"
                >
                    Sauvegarder
                </Button>
                <Button
                    variant="primary"
                    onClick={handleNextClick}
                    className="px-8 py-3 text-[1.5rem]"
                >
                    Suivant
                </Button>
            </div>
        </>
    );
};

export default Step1PersonalInfo;