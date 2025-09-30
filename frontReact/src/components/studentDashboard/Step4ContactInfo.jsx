import React, { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';

const Step4ContactInfo = ({ initialData = {}, onSaveAndNext, onSave, onPrevious }) => {
    const [email, setEmail] = useState(initialData.email || '');
    const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber || '');
    const [countryCode, setCountryCode] = useState(initialData.countryCode || '+237');
    const [country, setCountry] = useState(initialData.country || '');
    const [region, setRegion] = useState(initialData.region || '');
    const [city, setCity] = useState(initialData.city || '');
    const [address, setAddress] = useState(initialData.address || '');

    // Refactored to use a single state for emergency contacts
    const [emergencyContacts, setEmergencyContacts] = useState([
        initialData.emergencyContacts?.[0] || { name: '', phone: '', code: '+237', relationship: '' },
        initialData.emergencyContacts?.[1] || { name: '', phone: '', code: '+237', relationship: '' },
    ]);
    
    // Validation error states
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setEmail(initialData.email || '');
            setPhoneNumber(initialData.phoneNumber || '');
            setCountryCode(initialData.countryCode || '+237');
            setCountry(initialData.country || '');
            setRegion(initialData.region || '');
            setCity(initialData.city || '');
            setAddress(initialData.address || '');
            setEmergencyContacts(initialData.emergencyContacts || [
                { name: '', phone: '', code: '+237', relationship: '' },
                { name: '', phone: '', code: '+237', relationship: '' },
            ]);
        }
    }, [initialData]);

    const countryCodes = ['+237', '+33', '+1', '+44', '+49'];

    const handleEmergencyContactChange = (index, field, value) => {
        const newContacts = [...emergencyContacts];
        newContacts[index] = {
            ...newContacts[index],
            [field]: value
        };
        setEmergencyContacts(newContacts);
        
        // Clear error for this field if it exists
        const errorKey = `emergencyContact${index}${field.charAt(0).toUpperCase() + field.slice(1)}`;
        if (errors[errorKey]) {
            setErrors(prev => ({ ...prev, [errorKey]: '' }));
        }
    };

    const collectData = () => {
        // Flatten the emergencyContacts array into individual keys
        const emergencyContact1 = emergencyContacts[0];
        const emergencyContact2 = emergencyContacts[1];

        return {
            email,
            phoneNumber,
            countryCode,
            country,
            region,
            city,
            address,
            emergencyContactName1: emergencyContact1.name,
            emergencyContactPhone1: emergencyContact1.phone,
            emergencyContactCode1: emergencyContact1.code,
            emergencyContactRelationship1: emergencyContact1.relationship,
            emergencyContactName2: emergencyContact2.name,
            emergencyContactPhone2: emergencyContact2.phone,
            emergencyContactCode2: emergencyContact2.code,
            emergencyContactRelationship2: emergencyContact2.relationship,
        };
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Validate main contact fields
        if (!email) newErrors.email = "L'email est obligatoire";
        if (!phoneNumber) newErrors.phoneNumber = "Le numéro de téléphone est obligatoire";
        if (!country) newErrors.country = "Le pays est obligatoire";
        if (!region) newErrors.region = "La région est obligatoire";
        if (!city) newErrors.city = "La ville est obligatoire";
        if (!address) newErrors.address = "L'adresse est obligatoire";
        
        // Validate emergency contacts
        if (!emergencyContacts[0].name) newErrors.emergencyContact0Name = "Le nom du contact d'urgence 1 est obligatoire";
        if (!emergencyContacts[0].phone) newErrors.emergencyContact0Phone = "Le téléphone du contact d'urgence 1 est obligatoire";
        if (!emergencyContacts[0].relationship) newErrors.emergencyContact0Relationship = "Le lien de parenté du contact d'urgence 1 est obligatoire";
        
        if (!emergencyContacts[1].name) newErrors.emergencyContact1Name = "Le nom du contact d'urgence 2 est obligatoire";
        if (!emergencyContacts[1].phone) newErrors.emergencyContact1Phone = "Le téléphone du contact d'urgence 2 est obligatoire";
        if (!emergencyContacts[1].relationship) newErrors.emergencyContact1Relationship = "Le lien de parenté du contact d'urgence 2 est obligatoire";
        
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
            <div className="grid grid-cols-2 gap-x-[1.28rem] gap-y-[1.28rem]">
                {/* Email and Phone Number */}
                <div>
                    <label htmlFor="email" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        id="email"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.email ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="igniteacademy@gmail.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                                setErrors(prev => ({ ...prev, email: '' }));
                            }
                        }}
                        required
                    />
                    {errors.email && <p className="text-red-500 text-[1.2rem] mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="phoneNumber" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Numéro de téléphone <span className="text-red-500">*</span></label>
                    <div className="flex">
                        <select
                            id="countryCode"
                            className="h-[2.98rem] pr-[2rem] pl-[0.85rem] rounded-l-[0.21rem] border border-r-0 border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] appearance-none"
                            style={{
                                backgroundColor: 'rgba(242, 242, 242, 0.6)',
                                fontSize: '1.5rem',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B4F8B' d='M9.293 12.95l.707.707L15 9.707l-1.414-1.414L10 10.586l-3.586-3.586L5 8.293z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.85rem center',
                                backgroundSize: '1.28rem',
                            }}
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            required
                        >
                            {countryCodes.map(code => <option key={code} value={code}>{code}</option>)}
                        </select>
                        <input
                            type="tel"
                            id="phoneNumber"
                            className={`flex-1 h-[2.98rem] px-[0.85rem] rounded-r-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                                errors.phoneNumber ? 'border-red-500' : 'border-[#79747E]'
                            }`}
                            style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                            placeholder="612 345 678"
                            value={phoneNumber}
                            onChange={(e) => {
                                setPhoneNumber(e.target.value);
                                if (errors.phoneNumber) {
                                    setErrors(prev => ({ ...prev, phoneNumber: '' }));
                                }
                            }}
                            required
                        />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-[1.2rem] mt-1">{errors.phoneNumber}</p>}
                </div>

                {/* Address Fields */}
                <div>
                    <label htmlFor="country" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Pays <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="country"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.country ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez votre pays"
                        value={country}
                        onChange={(e) => {
                            setCountry(e.target.value);
                            if (errors.country) {
                                setErrors(prev => ({ ...prev, country: '' }));
                            }
                        }}
                        required
                    />
                    {errors.country && <p className="text-red-500 text-[1.2rem] mt-1">{errors.country}</p>}
                </div>
                <div>
                    <label htmlFor="region" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Région <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="region"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.region ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez votre région"
                        value={region}
                        onChange={(e) => {
                            setRegion(e.target.value);
                            if (errors.region) {
                                setErrors(prev => ({ ...prev, region: '' }));
                            }
                        }}
                        required
                    />
                    {errors.region && <p className="text-red-500 text-[1.2rem] mt-1">{errors.region}</p>}
                </div>
                <div>
                    <label htmlFor="city" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Ville <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="city"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.city ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez votre ville"
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value);
                            if (errors.city) {
                                setErrors(prev => ({ ...prev, city: '' }));
                            }
                        }}
                        required
                    />
                    {errors.city && <p className="text-red-500 text-[1.2rem] mt-1">{errors.city}</p>}
                </div>
                <div>
                    <label htmlFor="address" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Adresse <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="address"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.address ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez votre adresse"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            if (errors.address) {
                                setErrors(prev => ({ ...prev, address: '' }));
                            }
                        }}
                        required
                    />
                    {errors.address && <p className="text-red-500 text-[1.2rem] mt-1">{errors.address}</p>}
                </div>

                {/* Emergency Contact 1 */}
                <div>
                    <label htmlFor="emergencyContactName1" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Nom de la personne à contacter en cas d'urgence (1) <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="emergencyContactName1"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.emergencyContact0Name ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez le nom de la personne à contacter en cas d'urgence"
                        value={emergencyContacts[0].name}
                        onChange={(e) => handleEmergencyContactChange(0, 'name', e.target.value)}
                        required
                    />
                    {errors.emergencyContact0Name && <p className="text-red-500 text-[1.2rem] mt-1">{errors.emergencyContact0Name}</p>}
                </div>
                <div>
                    <label htmlFor="emergencyContactPhone1" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Téléphone de la personne à contacter (1) <span className="text-red-500">*</span></label>
                    <div className="flex">
                        <select
                            id="emergencyContactCode1"
                            className="h-[2.98rem] pr-[2rem] pl-[0.85rem] rounded-l-[0.21rem] border border-r-0 border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] appearance-none"
                            style={{
                                backgroundColor: 'rgba(242, 242, 242, 0.6)',
                                fontSize: '1.5rem',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B4F8B' d='M9.293 12.95l.707.707L15 9.707l-1.414-1.414L10 10.586l-3.586-3.586L5 8.293z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.85rem center',
                                backgroundSize: '1.28rem',
                            }}
                            value={emergencyContacts[0].code}
                            onChange={(e) => handleEmergencyContactChange(0, 'code', e.target.value)}
                            required
                        >
                            {countryCodes.map(code => <option key={code} value={code}>{code}</option>)}
                        </select>
                        <input
                            type="tel"
                            id="emergencyContactPhone1"
                            className={`flex-1 h-[2.98rem] px-[0.85rem] rounded-r-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                                errors.emergencyContact0Phone ? 'border-red-500' : 'border-[#79747E]'
                            }`}
                            style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                            placeholder="612 345 678"
                            value={emergencyContacts[0].phone}
                            onChange={(e) => handleEmergencyContactChange(0, 'phone', e.target.value)}
                            required
                        />
                    </div>
                    {errors.emergencyContact0Phone && <p className="text-red-500 text-[1.2rem] mt-1">{errors.emergencyContact0Phone}</p>}
                </div>
                <div>
                    <label htmlFor="emergencyContactRelationship1" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Lien de parenté (1) <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="emergencyContactRelationship1"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.emergencyContact0Relationship ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez le lien de parenté"
                        value={emergencyContacts[0].relationship}
                        onChange={(e) => handleEmergencyContactChange(0, 'relationship', e.target.value)}
                        required
                    />
                    {errors.emergencyContact0Relationship && <p className="text-red-500 text-[1.2rem] mt-1">{errors.emergencyContact0Relationship}</p>}
                </div>

                {/* Emergency Contact 2 */}
                <div>
                    <label htmlFor="emergencyContactName2" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Nom de la personne à contacter en cas d'urgence (2) <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="emergencyContactName2"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.emergencyContact1Name ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez le nom de la personne à contacter en cas d'urgence"
                        value={emergencyContacts[1].name}
                        onChange={(e) => handleEmergencyContactChange(1, 'name', e.target.value)}
                        required
                    />
                    {errors.emergencyContact1Name && <p className="text-red-500 text-[1.2rem] mt-1">{errors.emergencyContact1Name}</p>}
                </div>
                <div>
                    <label htmlFor="emergencyContactPhone2" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Téléphone de la personne à contacter (2) <span className="text-red-500">*</span></label>
                    <div className="flex">
                        <select
                            id="emergencyContactCode2"
                            className="h-[2.98rem] pr-[2rem] pl-[0.85rem] rounded-l-[0.21rem] border border-r-0 border-[#79747E] focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] appearance-none"
                            style={{
                                backgroundColor: 'rgba(242, 242, 242, 0.6)',
                                fontSize: '1.5rem',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B4F8B' d='M9.293 12.95l.707.707L15 9.707l-1.414-1.414L10 10.586l-3.586-3.586L5 8.293z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.85rem center',
                                backgroundSize: '1.28rem',
                            }}
                            value={emergencyContacts[1].code}
                            onChange={(e) => handleEmergencyContactChange(1, 'code', e.target.value)}
                            required
                        >
                            {countryCodes.map(code => <option key={code} value={code}>{code}</option>)}
                        </select>
                        <input
                            type="tel"
                            id="emergencyContactPhone2"
                            className={`flex-1 h-[2.98rem] px-[0.85rem] rounded-r-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                                errors.emergencyContact1Phone ? 'border-red-500' : 'border-[#79747E]'
                            }`}
                            style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                            placeholder="612 345 678"
                            value={emergencyContacts[1].phone}
                            onChange={(e) => handleEmergencyContactChange(1, 'phone', e.target.value)}
                            required
                        />
                    </div>
                    {errors.emergencyContact1Phone && <p className="text-red-500 text-[1.2rem] mt-1">{errors.emergencyContact1Phone}</p>}
                </div>
                <div>
                    <label htmlFor="emergencyContactRelationship2" className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">Lien de parenté (2) <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="emergencyContactRelationship2"
                        className={`w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] text-[#333333] ${
                            errors.emergencyContact1Relationship ? 'border-red-500' : 'border-[#79747E]'
                        }`}
                        style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem' }}
                        placeholder="Entrez le lien de parenté"
                        value={emergencyContacts[1].relationship}
                        onChange={(e) => handleEmergencyContactChange(1, 'relationship', e.target.value)}
                        required
                    />
                    {errors.emergencyContact1Relationship && <p className="text-red-500 text-[1.2rem] mt-1">{errors.emergencyContact1Relationship}</p>}
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

export default Step4ContactInfo;