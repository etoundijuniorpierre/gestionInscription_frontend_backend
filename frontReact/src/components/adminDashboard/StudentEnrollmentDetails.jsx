import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEnrollmentById } from '../../services/enrollmentManagementService';
import { mapApiStatusToDisplay } from '../../utils/enrollmentStatusUtils';

const CollapsibleSection = ({ title, children, isCollapsed, onToggle }) => {
    return (
        <div className="mb-6 border border-gray-200 rounded-lg">
            <button
                onClick={onToggle}
                className="flex justify-between items-center w-full p-4 bg-gray-50 rounded-t-lg"
            >
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <svg
                    className={`h-6 w-6 transform transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isCollapsed ? 'max-h-0' : 'max-h-screen mt-4'}`}>
                <div className="p-2 grid grid-cols-2 gap-x-8 gap-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const DetailField = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        <p className="mt-1 text-sm text-gray-900">{value || 'N/A'}</p>
    </div>
);

const DocumentDetailField = ({ label, fileState, onValidate, onReject }) => (
    <div className="border border-gray-200 rounded p-3">
        <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900 truncate">{fileState?.file?.name || 'Aucun fichier'}</span>
            <div className="flex space-x-2">
                <button
                    onClick={onValidate}
                    className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
                >
                    Valider
                </button>
                <button
                    onClick={onReject}
                    className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
                >
                    Refuser
                </button>
            </div>
        </div>
        <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                fileState?.status === 'validated' ? 'bg-green-100 text-green-800' :
                fileState?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
            }`}>
                {fileState?.status === 'validated' ? 'Validé' :
                 fileState?.status === 'rejected' ? 'Refusé' : 'En attente'}
            </span>
        </div>
    </div>
);

const StudentEnrollmentDetails = ({ onBack }) => {
    const { enrollmentId } = useParams();
    const [enrollmentData, setEnrollmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEnrollmentData();
    }, [enrollmentId]);

    const fetchEnrollmentData = async () => {
        try {
            setLoading(true);
            const response = await getEnrollmentById(enrollmentId);
            setEnrollmentData(response);
            setError(null);
        } catch (err) {
            console.error('Error fetching enrollment data:', err);
            setError('Failed to load enrollment data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDocumentAction = (docKey, newStatus) => {
        setEnrollmentData(prevData => ({
            ...prevData,
            documents: {
                ...prevData.documents,
                [docKey]: {
                    ...prevData.documents[docKey],
                    status: newStatus,
                },
            },
        }));
    };

    const [collapsedSections, setCollapsedSections] = useState({
        enrollmentInfo: false,
        personalInfo: false,
        identityInfo: false,
        documents: false,
        academicHistory: false,
        contactInfo: false,
        emergencyContacts: false,
    });

    const toggleSection = (sectionName) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName],
        }));
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>;
    }

    if (!enrollmentData) {
        return <div className="p-8">No enrollment data found.</div>;
    }

    // Extract data from the enrollment object
    const personalInfo = enrollmentData.personalInfo || {};
    const academicInfo = enrollmentData.academicInfo || {};
    const contactDetails = enrollmentData.contactDetails || {};
    // Note: Backend now returns studentId, programId, and programName instead of full objects
    const studentName = personalInfo.firstName && personalInfo.lastName 
        ? `${personalInfo.firstName} ${personalInfo.lastName}` 
        : 'N/A';
    const studentEmail = contactDetails.email || 'N/A';

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button 
                    onClick={onBack} 
                    className="flex items-center text-[#101957] font-semibold mr-4 p-2 rounded-lg"
                    style={{ backgroundColor: '#E9EDF4' }}
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-[#333333] text-3xl font-bold">
                    Détail de l'inscription #{enrollmentData.id}
                </h2>
            </div>

            {/* Status Dropdown */}
            <div className="flex justify-end items-center mb-8">
                <label className="mr-4 text-lg font-semibold text-[#101957]">Statut global :</label>
                <select
                    className="p-2 rounded-md border border-gray-300 bg-white"
                    value={mapApiStatusToDisplay(enrollmentData.status)}
                    onChange={(e) => setEnrollmentData(prev => ({ ...prev, status: e.target.value }))}
                >
                    <option value="Soumis">Soumis</option>
                    <option value="Validé">Validé</option>
                    <option value="Refusé">Refusé</option>
                    <option value="Corrections requises">Corrections requises</option>
                </select>
            </div>

            {/* Collapsible Sections */}
            <CollapsibleSection
                title="Informations sur l'Inscription"
                isCollapsed={collapsedSections.enrollmentInfo}
                onToggle={() => toggleSection('enrollmentInfo')}
            >
                <DetailField label="ID de l'Inscription" value={enrollmentData.id} />
                <DetailField label="Date de Création" value={enrollmentData.createdDate ? new Date(enrollmentData.createdDate).toLocaleString('fr-FR') : 'N/A'} />
                <DetailField label="Dernière Modification" value={enrollmentData.lastModifiedDate ? new Date(enrollmentData.lastModifiedDate).toLocaleString('fr-FR') : 'N/A'} />
                <DetailField label="Date de Soumission" value={enrollmentData.submissionDate ? new Date(enrollmentData.submissionDate).toLocaleString('fr-FR') : 'N/A'} />
                <DetailField label="Date de Validation" value={enrollmentData.validationDate ? new Date(enrollmentData.validationDate).toLocaleString('fr-FR') : 'N/A'} />
                <DetailField label="Raison du Rejet" value={enrollmentData.rejectionReason} />
                <DetailField label="ID Étudiant" value={enrollmentData.studentId} />
                <DetailField label="Étudiant" value={studentName} />
                <DetailField label="Email de l'Étudiant" value={studentEmail} />
                <DetailField label="ID Formation" value={enrollmentData.programId} />
                <DetailField label="Formation" value={enrollmentData.programName} />
                <DetailField label="Étape Actuelle" value={enrollmentData.currentStep} />
            </CollapsibleSection>

            <CollapsibleSection
                title="Informations Personnelles"
                isCollapsed={collapsedSections.personalInfo}
                onToggle={() => toggleSection('personalInfo')}
            >
                <DetailField label="Nom" value={personalInfo.lastName} />
                <DetailField label="Prénom" value={personalInfo.firstName} />
                <DetailField label="Sexe" value={personalInfo.gender} />
                <DetailField label="Date de Naissance" value={personalInfo.dateOfBirth} />
                <DetailField label="Nationalité" value={personalInfo.nationality} />
            </CollapsibleSection>

            <CollapsibleSection
                title="Pièce d'Identité"
                isCollapsed={collapsedSections.identityInfo}
                onToggle={() => toggleSection('identityInfo')}
            >
                <DetailField label="Type de Pièce d'Identité" value={personalInfo.identityDocumentType} />
                <DetailField label="Numéro de Pièce d'Identité" value={personalInfo.identityDocumentNumber} />
                <DetailField label="Date de Délivrance" value={personalInfo.issueDate} />
                <DetailField label="Date d'Expiration" value={personalInfo.expirationDate} />
                <DetailField label="Lieu de Délivrance" value={personalInfo.placeOfIssue} />
            </CollapsibleSection>

            <CollapsibleSection
                title="Documents Officiels"
                isCollapsed={collapsedSections.documents}
                onToggle={() => toggleSection('documents')}
            >
                {enrollmentData.documents && enrollmentData.documents.length > 0 ? (
                    enrollmentData.documents.map((doc, index) => (
                        <div key={doc.id} className="col-span-2 border border-gray-200 rounded p-4 mb-3">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-base font-semibold text-gray-800">{doc.name}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    doc.validationStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    doc.validationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {doc.validationStatus === 'APPROVED' ? 'Approuvé' :
                                     doc.validationStatus === 'REJECTED' ? 'Rejeté' : 'En attente'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <DetailField label="ID Document" value={doc.id} />
                                <DetailField label="Type de Document" value={doc.documentType} />
                                <DetailField label="Type de Contenu" value={doc.contentType} />
                                <DetailField label="Date de Téléchargement" value={doc.uploadDate ? new Date(doc.uploadDate).toLocaleString('fr-FR') : 'N/A'} />
                                <DetailField label="Date de Création" value={doc.createdDate ? new Date(doc.createdDate).toLocaleString('fr-FR') : 'N/A'} />
                                <DetailField label="Dernière Modification" value={doc.lastModifiedDate ? new Date(doc.lastModifiedDate).toLocaleString('fr-FR') : 'N/A'} />
                                {doc.rejectionReason && (
                                    <div className="col-span-2">
                                        <DetailField label="Raison du Rejet" value={doc.rejectionReason} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-gray-500">Aucun document fourni</div>
                )}
            </CollapsibleSection>

            <CollapsibleSection
                title="Parcours Académique"
                isCollapsed={collapsedSections.academicHistory}
                onToggle={() => toggleSection('academicHistory')}
            >
                <DetailField label="Dernier Établissement Fréquenté" value={academicInfo.lastInstitution} />
                <DetailField label="Spécialisation" value={academicInfo.specialization} />
                <DetailField label="Disponible pour un Stage" value={academicInfo.availableForInternship ? 'Oui' : 'Non'} />
                <DetailField label="Date de Début" value={academicInfo.startDate} />
                <DetailField label="Date de Fin" value={academicInfo.endDate} />
                <DetailField label="Diplôme Obtenu" value={academicInfo.diplomaObtained} />
            </CollapsibleSection>

            <CollapsibleSection
                title="Coordonnées Personnelles"
                isCollapsed={collapsedSections.contactInfo}
                onToggle={() => toggleSection('contactInfo')}
            >
                <DetailField label="Email" value={contactDetails.email} />
                <DetailField label="Code Pays" value={contactDetails.countryCode} />
                <DetailField label="Numéro de Téléphone" value={contactDetails.phoneNumber} />
                <DetailField label="Pays" value={contactDetails.country} />
                <DetailField label="Région" value={contactDetails.region} />
                <DetailField label="Ville" value={contactDetails.city} />
                <DetailField label="Adresse" value={contactDetails.address} />
            </CollapsibleSection>

            <CollapsibleSection
                title="Contacts d'Urgence"
                isCollapsed={collapsedSections.emergencyContacts}
                onToggle={() => toggleSection('emergencyContacts')}
            >
                {contactDetails.emergencyContacts && contactDetails.emergencyContacts.length > 0 ? (
                    contactDetails.emergencyContacts.map((contact, index) => (
                        <div key={index} className="border border-gray-200 rounded p-3 mb-3">
                            <div className="grid grid-cols-2 gap-2">
                                <DetailField label="Nom" value={contact.name} />
                                <DetailField label="Relation" value={contact.relationship} />
                                <DetailField label="Code Pays" value={contact.countryCode} />
                                <DetailField label="Numéro de Téléphone" value={contact.phone} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500">Aucun contact d'urgence fourni</div>
                )}
            </CollapsibleSection>
        </div>
    );
};

export default StudentEnrollmentDetails;