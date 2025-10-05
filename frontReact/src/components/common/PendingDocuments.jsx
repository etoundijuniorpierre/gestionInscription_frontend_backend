import React, { useState, useEffect } from 'react';
import { getAllEnrollments } from '../../services/enrollmentManagementService';

const DocumentDetails = ({ doc }) => (
    <div
        className="flex flex-col rounded-[0.5rem]"
        style={{
            gap: '0.25rem',
            padding: '0.75rem 0.5rem',
            backgroundColor: '#F8F8F8',
            fontFamily: 'Roboto, sans-serif'
        }}
    >
        <p style={{ fontWeight: 500, fontSize: '1.2rem', lineHeight: '1.5rem', letterSpacing: '0.046875rem', color: '#000000' }}>
            <span style={{ fontWeight: 700 }}>Nom de l’étudiant:</span> {doc.studentName}
        </p>
        <p style={{ fontWeight: 500, fontSize: '1.2rem', lineHeight: '1.5rem', letterSpacing: '0.046875rem', color: '#000000' }}>
            <span style={{ fontWeight: 700 }}>Type de document:</span> {doc.documentType}
        </p>
        <p style={{ fontWeight: 500, fontSize: '1.2rem', lineHeight: '1.5rem', letterSpacing: '0.046875rem', color: '#000000' }}>
            <span style={{ fontWeight: 700 }}>Date du téléchargement:</span> {doc.date}
        </p>
        <a 
            href="#" 
            className="self-end" 
            style={{
                fontWeight: 600,
                fontSize: '1.05rem',
                lineHeight: '1.5rem',
                letterSpacing: '0.046875rem',
                color: '#F96567'
            }}
        >
            Voir les détails
        </a>
    </div>
);

const PendingDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPendingDocuments = async () => {
            try {
                // Fetch all enrollments
                const response = await getAllEnrollments();
                const enrollments = response.data;
                
                // Filter enrollments with pending documents
                // Note: enrollment.student does not exist in EnrollmentDtoResponse
                // Using generic student name until proper user data is available
                const pendingDocs = enrollments
                    .filter(enrollment => enrollment.status === 'PENDING' || enrollment.status === 'IN_PROGRESS')
                    .slice(0, 5) // Limit to first 5 for display
                    .map(enrollment => ({
                        studentName: `Étudiant #${enrollment.studentId}`,
                        documentType: 'Document à valider',
                        date: new Date(enrollment.submissionDate).toLocaleDateString('fr-FR')
                    }));
                
                setDocuments(pendingDocs);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchPendingDocuments();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
                <div
                    className="p-4 rounded-t-[0.53rem]"
                    style={{ backgroundColor: '#1019574D' }}
                >
                    <h4 className="text-[#101957] font-semibold text-[1.5rem]">Documents en Attente de Traitement</h4>
                </div>
                <div className="p-6 flex-grow flex items-center justify-center">
                    Chargement...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
                <div
                    className="p-4 rounded-t-[0.53rem]"
                    style={{ backgroundColor: '#1019574D' }}
                >
                    <h4 className="text-[#101957] font-semibold text-[1.5rem]">Documents en Attente de Traitement</h4>
                </div>
                <div className="p-6 flex-grow flex items-center justify-center">
                    Erreur: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FFFFFF] rounded-[0.53rem] shadow h-full flex flex-col">
            <div
                className="p-4 rounded-t-[0.53rem]"
                style={{ backgroundColor: '#1019574D' }}
            >
                <h4 className="text-[#101957] font-semibold text-sm">Documents en Attente de Traitement</h4>
            </div>
            <div className="p-6 flex-grow flex flex-col overflow-y-auto">
                <p 
                    className="mb-4 text-center text-sm"
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                        lineHeight: '1.5rem',
                        letterSpacing: '0.046875rem',
                        color: '#999999'
                    }}
                >
                    Documents à Valider Manuellement
                </p>
                <div className="space-y-4">
                    {documents.length > 0 ? (
                        documents.map((doc, index) => (
                            <DocumentDetails key={index} doc={doc} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500">
                            Aucun document en attente de traitement
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingDocuments;