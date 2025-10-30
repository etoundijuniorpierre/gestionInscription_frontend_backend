import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEnrollmentById } from '../../services/enrollmentManagementService';
import { downloadDocumentById } from '../../services/documentService';
import { mapApiStatusToDisplay } from '../../utils/enrollmentStatusUtils';
import { toast } from 'react-hot-toast';

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

const DocumentItem = ({ document }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    
    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const blob = await downloadDocumentById(document.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = document.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Document téléchargé avec succès!');
        } catch (error) {
            console.error('Error downloading document:', error);
            // Check if it's a network error or if the file doesn't exist
            if (error.response && error.response.status === 404) {
                toast.error('Document non trouvé. Il peut avoir été supprimé.');
            } else if (error.code === 'ERR_NETWORK') {
                toast.error('Problème de connexion. Veuillez vérifier votre réseau.');
            } else {
                toast.error('Échec du téléchargement. Veuillez réessayer.');
            }
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="border border-gray-200 rounded p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">{document.name}</label>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`px-3 py-1 text-xs font-medium rounded ${isDownloading ? 'bg-gray-300 text-gray-500' : 'text-blue-700 bg-blue-100 hover:bg-blue-200'}`}
                >
                    {isDownloading ? 'Téléchargement...' : 'Télécharger'}
                </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <DetailField label="Type de Document" value={document.documentType} />
                <DetailField label="Statut de Validation" value={document.validationStatus} />
                <DetailField label="Date de Téléchargement" value={document.uploadDate ? new Date(document.uploadDate).toLocaleString('fr-FR') : 'N/A'} />
                <DetailField label="Raison du Rejet" value={document.rejectionReason} />
            </div>
        </div>
    );
};

const StudentEnrollmentDetails = () => {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
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

    const [collapsedSections, setCollapsedSections] = useState({
        enrollmentInfo: false,
        personalInfo: false,
        academicInfo: false,
        contactInfo: false,
    });

    const toggleSection = (sectionName) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName],
        }));
    };

    if (loading) {
        return <div className="p-8">Chargement...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">Erreur: {error}</div>;
    }

    if (!enrollmentData) {
        return <div className="p-8">Aucune donnée d'inscription trouvée.</div>;
    }

    // Extract data from the enrollment object
    const personalInfo = enrollmentData.personalInfo || {};
    const academicInfo = enrollmentData.academicInfo || {};
    const contactDetails = enrollmentData.contactDetails || {};

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate('/dashboard/my-enrollments')} 
                    className="flex items-center text-[#101957] font-semibold mr-4 p-2 rounded-lg"
                    style={{ backgroundColor: '#E9EDF4' }}
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-[#333333] text-3xl font-bold">
                    Détail de l'inscription #{enrollmentData.id} - {enrollmentData.programName}
                </h2>
            </div>

            {/* Status */}
            <div className="flex justify-end items-center mb-8">
                <label className="mr-4 text-lg font-semibold text-[#101957]">Statut:</label>
                <span className="p-2 rounded-md border border-gray-300 bg-white">
                    {mapApiStatusToDisplay(enrollmentData.status)}
                </span>
            </div>

            {/* Collapsible Sections */}
            <CollapsibleSection
                title="Informations sur l'Inscription"
                isCollapsed={collapsedSections.enrollmentInfo}
                onToggle={() => toggleSection('enrollmentInfo')}
            >
                <DetailField label="ID de l'Inscription" value={enrollmentData.id} />
                <DetailField label="Formation" value={enrollmentData.programName} />
                <DetailField label="Date de Soumission" value={enrollmentData.submissionDate ? new Date(enrollmentData.submissionDate).toLocaleString('fr-FR') : 'N/A'} />
                <DetailField label="Date de Validation" value={enrollmentData.validationDate ? new Date(enrollmentData.validationDate).toLocaleString('fr-FR') : 'N/A'} />
                <DetailField label="Raison du Rejet" value={enrollmentData.rejectionReason} />
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
                title="Informations Académiques"
                isCollapsed={collapsedSections.academicInfo}
                onToggle={() => toggleSection('academicInfo')}
            >
                <DetailField label="Dernier Établissement Fréquenté" value={academicInfo.lastInstitution} />
                <DetailField label="Spécialisation" value={academicInfo.specialization} />
                <DetailField label="Disponible pour un Stage" value={academicInfo.availableForInternship ? 'Oui' : 'Non'} />
                <DetailField label="Date de Début" value={academicInfo.startDate} />
                <DetailField label="Date de Fin" value={academicInfo.endDate} />
                <DetailField label="Diplôme Obtenu" value={academicInfo.diplomaObtained} />
            </CollapsibleSection>

            {/* Documents Section */}
            {enrollmentData.documents && enrollmentData.documents.length > 0 && (
                <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents Soumis</h3>
                    <div className="space-y-3">
                        {enrollmentData.documents.map((document) => (
                            <DocumentItem key={document.id} document={document} />
                        ))}
                    </div>
                </div>
            )}

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

            {/* Emergency Contacts Section */}
            {contactDetails.emergencyContacts && contactDetails.emergencyContacts.length > 0 && (
                <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacts d'Urgence</h3>
                    <div className="space-y-4">
                        {contactDetails.emergencyContacts.map((contact, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-700 mb-3">Contact {index + 1}</h4>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                    <DetailField label="Nom" value={contact.name} />
                                    <DetailField label="Téléphone" value={`${contact.countryCode || ''} ${contact.phone || ''}`} />
                                    <DetailField label="Lien de Parenté" value={contact.relationship} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentEnrollmentDetails;