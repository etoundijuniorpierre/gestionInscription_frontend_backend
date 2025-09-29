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
            // Correctly map state variables to DTO/summary keys
            nom: lastName,
            prenom: firstName,
            sexe: gender,
            dateNaissance: dateOfBirth,
            nationalite: nationality,
            typePieceIdentite: typePieceIdentite, // Add this to the data payload
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
                    <label htmlFor="lastName" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Nom</label>
                    <input
                        type="text"
                        id="lastName"
                        className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333]"
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez votre nom"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="firstName" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Prénom</label>
                    <input
                        type="text"
                        id="firstName"
                        className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333]"
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez votre prénom"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-[#333333] text-[1.5rem] font-normal">Sexe :</label>
                    <div className="flex space-x-[1.28rem] items-center">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-[#6B4F8B]"
                                name="gender"
                                value="FEMALE"
                                checked={gender === 'FEMALE'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <span className="ml-[0.43rem] text-[#333333] text-[1.5rem] font-normal">Féminin</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-[#6B4F8B]"
                                name="gender"
                                value="MALE"
                                checked={gender === 'MALE'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <span className="ml-[0.43rem] text-[#333333] text-[1.5rem] font-normal">Masculin</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-[#6B4F8B]"
                                name="gender"
                                value="NON_BINARY"
                                checked={gender === 'NON_BINARY'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <span className="ml-[0.43rem] text-[#333333] text-[1.5rem] font-normal">Non-binaire</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="dateOfBirth" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Date de naissance</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333]"
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="JJ/MM/AA"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="nationality" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Nationalité</label>
                    <select
                        id="nationality"
                        className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B4F8B' d='M9.293 12.95l.707.707L15 9.707l-1.414-1.414L10 10.586l-3.586-3.586L5 8.293z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.64rem center',
                            backgroundSize: '1.28rem',
                            backgroundColor: 'rgba(242, 242, 242, 0.6)',
                            fontSize: '1.5rem'
                        }}
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                    >
                        {centralAfricanNationalities.map(nat => (
                            <option key={nat} value={nat}>{nat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="typePieceIdentite" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Type de pièce d'identité</label>
                    <select
                        id="typePieceIdentite"
                        className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B4F8B' d='M9.293 12.95l.707.707L15 9.707l-1.414-1.414L10 10.586l-3.586-3.586L5 8.293z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.64rem center',
                            backgroundSize: '1.28rem',
                            backgroundColor: 'rgba(242, 242, 242, 0.6)',
                            fontSize: '1.5rem'
                        }}
                        value={typePieceIdentite}
                        onChange={(e) => setTypePieceIdentite(e.target.value)}
                    >
                        <option value="CNI">CNI</option>
                        <option value="Passport">Passport</option>
                        <option value="Permis de conduire">Permis de conduire</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-between gap-4 mt-8">
                <Button
                    secondary
                    type="button"
                    onClick={handleSaveClick}
                    className="flex-1 !w-auto font-semibold text-[1.28rem] leading-[127.5%] tracking-[0.0298rem]"
                    style={{ fontFamily: 'Roboto, sans-serif', height: '2.98rem' }}
                >
                    Sauvegarder
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

export default Step1PersonalInfo;