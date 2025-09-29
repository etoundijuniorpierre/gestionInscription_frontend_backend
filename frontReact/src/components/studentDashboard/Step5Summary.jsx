import React, { useState } from 'react';
import Button from '../common/Button.jsx';

const SummaryField = ({ label, value }) => (
    <div>
        <label className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">{label}</label>
        <div
            className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] text-[#333333] flex items-center"
            style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem', fontFamily: 'Roboto, sans-serif' }}
        >
            {value}
        </div>
    </div>
);

const DocumentSummaryField = ({ label, fileState }) => {
    const getStatusText = (status) => {
        switch (status) {
            case 'loading':
                return 'Chargement...';
            case 'validated':
                return 'Validé';
            case 'rejected':
                return 'Rejeté';
            case 'en_attente':
                return 'En attente de validation';
            case 'uploaded':
                return 'Téléchargement...';
            default:
                return 'Non téléchargé';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'loading':
            case 'uploaded':
                return 'text-blue-500';
            case 'validated':
                return 'text-green-600';
            case 'rejected':
                return 'text-red-600';
            case 'en_attente':
                return 'text-orange-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div>
            <label className="block text-[#333333] text-[1.5rem] font-normal mb-[0.21rem]">{label}</label>
            <div
                className="w-full h-[2.98rem] px-[0.85rem] rounded-[0.21rem] border border-[#79747E] text-[#333333] flex items-center justify-between"
                style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', fontSize: '1.5rem', fontFamily: 'Roboto, sans-serif' }}
            >
                <span className="truncate">{fileState?.file?.name || getStatusText(null)}</span>
                {fileState?.file && (
                    <span className={`font-semibold ml-2 text-[1.2rem] ${getStatusColor(fileState.status)}`} style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {getStatusText(fileState.status)}
                    </span>
                )}
            </div>
        </div>
    );
};

const Step5Summary = ({ formData, onPrevious, onFinish }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleFinishClick = () => {
        if (isConfirmed) {
            onFinish();
        } else {
            alert("Veuillez cocher la case pour confirmer que les informations sont exactes.");
        }
    };

    return (
        <>
            <h2
                className="mb-6 text-center"
                style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '1.5625rem',
                    lineHeight: '140%',
                    color: '#666666',
                }}
            >
                Vérifiez et confirmez votre inscription
            </h2>

            <div className="flex flex-col gap-[1.28rem]">
                <h3
                    className="text-[#101957] font-semibold text-[1.5rem] mt-6"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                    Informations Personnelles
                </h3>
                <div className="grid grid-cols-2 gap-x-[1.28rem] gap-y-[1.28rem]">
                    <SummaryField label="Nom" value={formData.nom} />
                    <SummaryField label="Prénom" value={formData.prenom} />
                    <SummaryField label="Sexe" value={formData.sexe} />
                    <SummaryField label="Date de naissance" value={formData.dateNaissance} />
                    <SummaryField label="Nationalité" value={formData.nationalite} />
                    <SummaryField label="Type de pièce d'identité" value={formData.typePieceIdentite} />
                </div>

                <h3
                    className="text-[#101957] font-semibold text-[1.5rem] mt-6"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                    Documents Officiels
                </h3>
                <div className="grid grid-cols-2 gap-x-[1.28rem] gap-y-[1.28rem]">
                    {/* Updated to correctly reference the formData */}
                    <DocumentSummaryField label='Dernier diplôme obtenu "1"' fileState={formData.diplome1} />
                    <DocumentSummaryField label='Dernier diplôme obtenu "2" (Facultatif)' fileState={formData.diplome2} />
                    <DocumentSummaryField label='Photocopie CNI Recto' fileState={formData.cniRecto} />
                    <DocumentSummaryField label='Photocopie CNI Verso' fileState={formData.cniVerso} />
                    <DocumentSummaryField label='Acte de naissance' fileState={formData.acteNaissance} />
                    <DocumentSummaryField label="Photo d'identité 4+4" fileState={formData.photoIdentite} />
                </div>

                <h3
                    className="text-[#101957] font-semibold text-[1.5rem] mt-6"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                    Parcours Académique
                </h3>
                <div className="grid grid-cols-2 gap-x-[1.28rem] gap-y-[1.28rem]">
                    <SummaryField label="Dernier établissement fréquenté" value={formData.lastInstitution} />
                    <SummaryField label="Spécialisation" value={formData.specialization} />
                    <SummaryField label="Disponible pour un stage ?" value={formData.availableForInternship} />
                    <SummaryField label="Début de formation" value={formData.startDate} />
                    <SummaryField label="Fin de formation" value={formData.endDate} />
                </div>
                
                <h3
                    className="text-[#101957] font-semibold text-[1.5rem] mt-6"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                    Coordonnées Personnelles
                </h3>
                <div className="grid grid-cols-2 gap-x-[1.28rem] gap-y-[1.28rem]">
                    <SummaryField label="Email" value={formData.email} />
                    <SummaryField label="Numéro de téléphone" value={`${formData.countryCode} ${formData.phoneNumber}`} />
                    <SummaryField label="Pays" value={formData.country} />
                    <SummaryField label="Région" value={formData.region} />
                    <SummaryField label="Ville" value={formData.city} />
                    <SummaryField label="Adresse" value={formData.address} />
                    <SummaryField label="Nom de la personne à contacter en cas d'urgence (1)" value={formData.emergencyContactName1} />
                    <SummaryField label="Nom de la personne à contacter en cas d'urgence (2)" value={formData.emergencyContactName2} />
                    <SummaryField label="Téléphone de la personne à contacter (1)" value={`${formData.emergencyContactCode1} ${formData.emergencyContactPhone1}`} />
                    <SummaryField label="Téléphone de la personne à contacter (2)" value={`${formData.emergencyContactCode2} ${formData.emergencyContactPhone2}`} />
                    <SummaryField label="Lien de parenté (1)" value={formData.emergencyContactRelationship1} />
                    <SummaryField label="Lien de parenté (2)" value={formData.emergencyContactRelationship2} />
                </div>
            </div>

            <div className="mt-12 flex flex-col gap-8">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[#101957] font-semibold" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem' }}>
                            Montant des frais d'inscription :
                        </span>
                        <span className="text-[#101957] font-semibold" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem' }}>
                            50000fcfa
                        </span>
                    </div>
                </div>
                <label className="flex items-center space-x-2 mb-8">
                    <input
                        type="checkbox"
                        checked={isConfirmed}
                        onChange={(e) => setIsConfirmed(e.target.checked)}
                        className="form-checkbox h-6 w-6 text-[#6B4F8B] rounded border-[#79747E]"
                    />
                    <span className="text-[#333333] text-[1.3rem] font-normal" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        J’atteste l’exactitude des informations fournies
                    </span>
                </label>
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
                    onClick={handleFinishClick}
                    className="flex-1 !w-auto font-semibold text-[1.28rem] leading-[127.5%] tracking-[0.0298rem]"
                    style={{ fontFamily: 'Roboto, sans-serif', height: '2.98rem' }}
                >
                    Soumettre mon dossier
                </Button>
            </div>
        </>
    );
};

export default Step5Summary;