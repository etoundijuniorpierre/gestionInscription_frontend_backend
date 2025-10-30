import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getEnrollmentById, approveEnrollment, rejectEnrollment } from '../../services/enrollmentManagementService';
import { downloadDocumentById, validateDocumentById, rejectDocumentById } from '../../services/documentService';
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

const StudentEnrollmentDetails = ({ onBack }) => {
    const { enrollmentId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [enrollmentData, setEnrollmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [rejectingDocumentId, setRejectingDocumentId] = useState(null);
    const [documentRejectionReason, setDocumentRejectionReason] = useState('');
    const [showEnrollmentApprovalModal, setShowEnrollmentApprovalModal] = useState(false);

    // Move the useCallback hook before the useEffect hook that uses it
    const fetchEnrollmentData = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Fetching enrollment with ID:', enrollmentId);
            
            // Check if we have enrollment data passed through location state
            if (location.state && location.state.enrollment) {
                console.log('Using enrollment data from location state');
                setEnrollmentData(location.state.enrollment);
                setError(null);
            } else {
                console.log('Fetching enrollment data from API');
                const response = await getEnrollmentById(enrollmentId);
                setEnrollmentData(response);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching enrollment data:', err);
            setError('Failed to load enrollment data: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [enrollmentId, location.state]);

    useEffect(() => {
        fetchEnrollmentData();
    }, [fetchEnrollmentData]);

    const handleValidate = async () => {
        // Check if all documents are validated before allowing enrollment approval
        const allDocumentsValidated = enrollmentData.documents?.every(doc => doc.validationStatus === 'VALIDATED');
        
        if (!allDocumentsValidated) {
            toast.error('Tous les documents doivent être validés avant d\'approuver l\'inscription');
            return;
        }
        
        // Show confirmation modal instead of directly approving
        setShowEnrollmentApprovalModal(true);
    };
    
    const confirmEnrollmentApproval = async () => {
        try {
            setIsValidating(true);
            const updatedEnrollment = await approveEnrollment(enrollmentId);
            setEnrollmentData(updatedEnrollment);
            toast.success('Inscription validée avec succès');
            // Close the confirmation modal
            setShowEnrollmentApprovalModal(false);
            // Redirect to enrollment management page after successful validation
            setTimeout(() => {
                navigate('/admin-dashboard/enrollment-management');
            }, 1500);
        } catch (err) {
            console.error('Error validating enrollment:', err);
            setError('Erreur lors de la validation: ' + err.message);
            // Close the confirmation modal even on error
            setShowEnrollmentApprovalModal(false);
        } finally {
            setIsValidating(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Veuillez entrer une raison de rejet');
            return;
        }
        try {
            setIsRejecting(true);
            await rejectEnrollment(enrollmentId, rejectionReason);
            setEnrollmentData(prev => ({ ...prev, status: 'REJECTED', rejectionReason }));
            toast.success('Inscription rejetée');
            setShowRejectionModal(false);
            setRejectionReason('');
        } catch (err) {
            console.error('Error rejecting enrollment:', err);
            setError('Erreur lors du rejet: ' + err.message);
        } finally {
            setIsRejecting(false);
        }
    };

    const handleDocumentValidate = async (documentId) => {
        try {
            // Find the document to validate
            const document = enrollmentData.documents.find(doc => doc.id === documentId);
            
            // Check if document exists
            if (!document) {
                toast.error('Document non trouvé');
                return;
            }
            
            // Check if document is already validated
            if (document.validationStatus === 'VALIDATED') {
                toast.error('Document déjà validé');
                return;
            }
            
            await validateDocumentById(documentId);
            // Update document status in local state
            setEnrollmentData(prev => ({
                ...prev,
                documents: prev.documents.map(doc =>
                    doc.id === documentId ? { ...doc, validationStatus: 'VALIDATED' } : doc
                )
            }));
            toast.success('Document validé avec succès');
        } catch (err) {
            console.error('Error validating document:', err);
            toast.error('Erreur lors de la validation du document: ' + err.message);
        }
    };

    const handleDocumentReject = async (documentId) => {
        // Check if rejection reason is provided
        if (!documentRejectionReason.trim()) {
            toast.error('Veuillez entrer une raison de rejet');
            return;
        }
        
        try {
            // Find the document to reject
            const document = enrollmentData.documents.find(doc => doc.id === documentId);
            
            // Check if document exists
            if (!document) {
                toast.error('Document non trouvé');
                return;
            }
            
            // Check if document is already rejected
            if (document.validationStatus === 'REJECTED') {
                toast.error('Document déjà rejeté');
                return;
            }
            
            await rejectDocumentById(documentId, documentRejectionReason);
            // Update document status in local state
            setEnrollmentData(prev => ({
                ...prev,
                documents: prev.documents.map(doc =>
                    doc.id === documentId ? { ...doc, validationStatus: 'REJECTED' } : doc
                )
            }));
            toast.success('Document rejeté');
            // Close the modal
            setRejectingDocumentId(null);
            setDocumentRejectionReason('');
        } catch (err) {
            console.error('Error rejecting document:', err);
            toast.error('Erreur lors du rejet du document: ' + err.message);
        }
    };

    const handleDownloadDocument = async (document) => {
        try {
            const blob = await downloadDocumentById(document.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = document.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading document:', err);
            toast.error('Erreur lors du téléchargement du document');
        }
    };

    const [collapsedSections, setCollapsedSections] = useState({
        enrollmentInfo: false,
        personalInfo: false,
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
        return (
            <div className="p-8">
                <div className="text-red-500">Error: {error}</div>
                <div className="mt-4">
                    <p>Debug information:</p>
                    <p>Enrollment ID from URL: {enrollmentId}</p>
                    <p>Location state enrollment: {location.state?.enrollment ? 'Yes' : 'No'}</p>
                </div>
                <button 
                    onClick={onBack}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retour
                </button>
            </div>
        );
    }

    if (!enrollmentData) {
        return (
            <div className="p-8">
                <div>No enrollment data found.</div>
                <div className="mt-4">
                    <p>Debug information:</p>
                    <p>Enrollment ID from URL: {enrollmentId}</p>
                    <p>Location state enrollment: {location.state?.enrollment ? 'Yes' : 'No'}</p>
                </div>
                <button 
                    onClick={onBack}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retour
                </button>
            </div>
        );
    }

    // Extract data from the enrollment object
    const personalInfo = enrollmentData.personalInfo || {};
    const academicInfo = enrollmentData.academicInfo || {};
    const contactDetails = enrollmentData.contactDetails || {};

    // More flexible student name construction
    let studentName = 'N/A';
    const firstName = personalInfo.firstName ? personalInfo.firstName.trim() : '';
    const lastName = personalInfo.lastName ? personalInfo.lastName.trim() : '';
    
    // Construct the full name with better handling
    if (firstName && lastName) {
        studentName = `${firstName} ${lastName}`;
    } else if (firstName) {
        studentName = firstName;
    } else if (lastName) {
        studentName = lastName;
    }
    
    // Additional check to ensure we have a meaningful name
    if (studentName === 'N/A' || studentName.trim() === '') {
        // If we still don't have a name, try to get it from the student's email or other sources
        if (contactDetails && contactDetails.email) {
            // Extract name from email if possible
            const emailName = contactDetails.email.split('@')[0];
            if (emailName && emailName.length > 0) {
                studentName = emailName;
            }
        }
    }

    // Check if any document is rejected to disable validation button
    const hasRejectedDocuments = enrollmentData.documents?.some(doc => doc.validationStatus === 'REJECTED') || false;
    
    // Check if all documents are validated
    const allDocumentsValidated = enrollmentData.documents?.every(doc => doc.validationStatus === 'VALIDATED') || false;
    
    // Check if enrollment status is "Annulé" (cancelled)
    const isCancelled = enrollmentData.status === 'CANCELLED';
    
    // Check if enrollment status is "En attente de paiement du programme"
    const isPendingProgramPayment = enrollmentData.status === 'PENDING_PROGRAM_PAYMENT';
    
    // Check if enrollment status is "PENDING_VALIDATION" to show approval buttons
    const isPendingValidation = enrollmentData.status === 'PENDING_VALIDATION';

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-[#101957] font-semibold mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    style={{ backgroundColor: '#E9EDF4' }}
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
                    <div>
                        <h2 className="text-[#333333] text-2xl md:text-3xl font-bold">
                            Inscription de : {studentName}
                        </h2>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                ID: {enrollmentData.id}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                Formation: {enrollmentData.programName || 'Non spécifiée'}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            enrollmentData.status === 'PENDING_VALIDATION' ? 'bg-yellow-100 text-yellow-800' :
                            enrollmentData.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            enrollmentData.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            enrollmentData.status === 'ENROLLED' ? 'bg-green-100 text-green-800' :
                            enrollmentData.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' :
                            enrollmentData.status === 'CORRECTIONS_REQUIRED' ? 'bg-purple-100 text-purple-800' :
                            enrollmentData.status === 'PENDING_PAYMENT' ? 'bg-orange-100 text-orange-800' :
                            enrollmentData.status === 'PENDING_PROGRAM_PAYMENT' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {mapApiStatusToDisplay(enrollmentData.status)}
                        </span>
                    </div>
                </div>
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
                title="Documents"
                isCollapsed={collapsedSections.documents}
                onToggle={() => toggleSection('documents')}
            >
                {enrollmentData.documents && enrollmentData.documents.length > 0 ? (
                    <div className="col-span-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {enrollmentData.documents.map((document) => (
                                    <tr key={document.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{document.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{document.documentType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                document.validationStatus === 'VALIDATED' ? 'bg-green-100 text-green-800' :
                                                document.validationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {document.validationStatus || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button
                                                onClick={() => handleDownloadDocument(document)}
                                                disabled={isCancelled}
                                                className={`text-blue-600 hover:text-blue-900 mr-3 ${isCancelled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                Télécharger
                                            </button>
                                            {!isPendingProgramPayment && document.validationStatus !== 'VALIDATED' && document.validationStatus !== 'REJECTED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleDocumentValidate(document.id)}
                                                        disabled={isCancelled}
                                                        className={`text-green-600 hover:text-green-900 mr-3 ${isCancelled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        Valider
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectingDocumentId(document.id)}
                                                        disabled={isCancelled}
                                                        className={`text-red-600 hover:text-red-900 ${isCancelled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        Rejeter
                                                    </button>
                                                </>
                                            )}
                                            {document.validationStatus === 'VALIDATED' && (
                                                <span className="text-green-600 font-medium">Validé</span>
                                            )}
                                            {document.validationStatus === 'REJECTED' && (
                                                <span className="text-red-600 font-medium">Rejeté</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="col-span-2 text-gray-500">Aucun document trouvé</p>
                )}
            </CollapsibleSection>

            <CollapsibleSection
                title="Historique Académique"
                isCollapsed={collapsedSections.academicHistory}
                onToggle={() => toggleSection('academicHistory')}
            >
                <DetailField label="Dernière Institution" value={academicInfo.lastInstitution} />
                <DetailField label="Spécialisation" value={academicInfo.specialization} />
                <DetailField label="Diplôme Obtenu" value={academicInfo.diplomaObtained ? 'Oui' : 'Non'} />
                <DetailField label="Disponible pour Stage" value={academicInfo.availableForInternship ? 'Oui' : 'Non'} />
                <DetailField label="Date de Début" value={academicInfo.startDate} />
                <DetailField label="Date de Fin" value={academicInfo.endDate} />
            </CollapsibleSection>

            <CollapsibleSection
                title="Informations de Contact"
                isCollapsed={collapsedSections.contactInfo}
                onToggle={() => toggleSection('contactInfo')}
            >
                <DetailField label="Email" value={contactDetails.email} />
                <DetailField label="Téléphone" value={contactDetails.phoneNumber} />
                <DetailField label="Code Pays" value={contactDetails.countryCode} />
                <DetailField label="Pays" value={contactDetails.country} />
                <DetailField label="Région" value={contactDetails.region} />
                <DetailField label="Ville" value={contactDetails.city} />
                <DetailField label="Adresse" value={contactDetails.address} />
            </CollapsibleSection>

            {contactDetails.emergencyContacts && contactDetails.emergencyContacts.length > 0 && (
                <CollapsibleSection
                    title="Contacts d'Urgence"
                    isCollapsed={collapsedSections.emergencyContacts}
                    onToggle={() => toggleSection('emergencyContacts')}
                >
                    {contactDetails.emergencyContacts.map((contact, index) => (
                        <div key={index} className="col-span-2 grid grid-cols-2 gap-4 mb-4">
                            <DetailField label="Nom" value={contact.name} />
                            <DetailField label="Téléphone" value={contact.phone} />
                            <DetailField label="Code Pays" value={contact.countryCode} />
                            <DetailField label="Relation" value={contact.relationship} />
                        </div>
                    ))}
                </CollapsibleSection>
            )}

            {/* Action Buttons */}
            {!isPendingProgramPayment && isPendingValidation && (
                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        onClick={() => setShowRejectionModal(true)}
                        disabled={isValidating || isRejecting || isCancelled}
                        className={`px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 ${isCancelled ? 'cursor-not-allowed' : ''}`}
                    >
                        {isRejecting ? 'Rejet en cours...' : 'Rejeter'}
                    </button>
                    <button
                        onClick={handleValidate}
                        disabled={isValidating || isRejecting || hasRejectedDocuments || isCancelled || !allDocumentsValidated}
                        className={`px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 ${isCancelled || !allDocumentsValidated ? 'cursor-not-allowed' : ''}`}
                    >
                        {isValidating ? 'Validation en cours...' : 'Valider'}
                    </button>
                </div>
            )}

            {/* Enrollment Approval Confirmation Modal */}
            {showEnrollmentApprovalModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirmer l'approbation</h3>
                        <p className="mb-4 text-gray-600">
                            Êtes-vous sûr de vouloir approuver cette inscription ? Cette action ne peut pas être annulée.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowEnrollmentApprovalModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmEnrollmentApproval}
                                disabled={isValidating}
                                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50`}
                            >
                                {isValidating ? 'Validation en cours...' : 'Confirmer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Rejeter l'Inscription</h3>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Entrez la raison du rejet"
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                            rows="4"
                            disabled={isCancelled}
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowRejectionModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                disabled={isCancelled}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectionReason.trim() || isCancelled}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 ${isCancelled ? 'cursor-not-allowed' : ''}`}
                            >
                                Confirmer le Rejet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Rejection Modal */}
            {rejectingDocumentId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Rejeter le Document</h3>
                        <textarea
                            value={documentRejectionReason}
                            onChange={(e) => setDocumentRejectionReason(e.target.value)}
                            placeholder="Entrez la raison du rejet"
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                            rows="4"
                            disabled={isCancelled}
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {
                                    setRejectingDocumentId(null);
                                    setDocumentRejectionReason('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                disabled={isCancelled}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => handleDocumentReject(rejectingDocumentId)}
                                disabled={!documentRejectionReason.trim() || isCancelled}
                                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 ${isCancelled ? 'cursor-not-allowed' : ''}`}
                            >
                                Confirmer le Rejet
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default StudentEnrollmentDetails;