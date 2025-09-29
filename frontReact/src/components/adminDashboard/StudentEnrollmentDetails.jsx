import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEnrollmentById } from '../../services/enrollmentManagementService';

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
        personalInfo: false,
        documents: false,
        academicHistory: false,
        contactInfo: false,
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
    const student = enrollmentData.student || {};
    const program = enrollmentData.program || {};

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
                    Détail de l'inscription de "{student.firstname} {student.lastname}" à "{program.programName}"
                </h2>
            </div>

            {/* Status Dropdown */}
            <div className="flex justify-end items-center mb-8">
                <label className="mr-4 text-lg font-semibold text-[#101957]">Statut global :</label>
                <select
                    className="p-2 rounded-md border border-gray-300 bg-white"
                    value={enrollmentData.status}
                    onChange={(e) => setEnrollmentData(prev => ({ ...prev, status: e.target.value }))}
                >
                    <option value="Soumis">Soumis</option>
                    <option value="Validé">Validé</option>
                    <option value="Refusé">Refusé</option>
                </select>
            </div>

            {/* Collapsible Sections */}
            <CollapsibleSection
                title="Informations Personnelles"
                isCollapsed={collapsedSections.personalInfo}
                onToggle={() => toggleSection('personalInfo')}
            >
                <DetailField label="Nom" value={personalInfo.lastName} />
                <DetailField label="Prénom" value={personalInfo.firstName} />
                <DetailField label="Sexe" value={personalInfo.gender} />
                <DetailField label="Date de naissance" value={personalInfo.dateOfBirth} />
                <DetailField label="Nationalité" value={personalInfo.nationality} />
                <DetailField label="Type de pièce d'identité" value={personalInfo.identityDocumentType} />
            </CollapsibleSection>

            <CollapsibleSection
                title="Documents Officiels"
                isCollapsed={collapsedSections.documents}
                onToggle={() => toggleSection('documents')}
            >
                {/* In a real implementation, you would map through actual documents */}
                <div className="text-gray-500">Document management functionality would be implemented here</div>
            </CollapsibleSection>

            <CollapsibleSection
                title="Parcours Académique"
                isCollapsed={collapsedSections.academicHistory}
                onToggle={() => toggleSection('academicHistory')}
            >
                <DetailField label="Dernier établissement fréquenté" value={academicInfo.lastInstitution} />
                <DetailField label="Spécialisation" value={academicInfo.specialization} />
                <DetailField label="Disponible pour un stage ?" value={academicInfo.availableForInternship ? 'Oui' : 'Non'} />
                <DetailField label="Début de formation" value={academicInfo.startDate} />
                <DetailField label="Fin de formation" value={academicInfo.endDate} />
            </CollapsibleSection>

            <CollapsibleSection
                title="Coordonnées Personnelles"
                isCollapsed={collapsedSections.contactInfo}
                onToggle={() => toggleSection('contactInfo')}
            >
                <DetailField label="Email" value={contactDetails.email} />
                <DetailField label="Numéro de téléphone" value={`${contactDetails.countryCode} ${contactDetails.phoneNumber}`} />
                <DetailField label="Pays" value={contactDetails.country} />
                <DetailField label="Région" value={contactDetails.region} />
                <DetailField label="Ville" value={contactDetails.city} />
                <DetailField label="Adresse" value={contactDetails.address} />
                {/* Emergency contacts would be handled here in a real implementation */}
            </CollapsibleSection>
        </div>
    );
};

export default StudentEnrollmentDetails;