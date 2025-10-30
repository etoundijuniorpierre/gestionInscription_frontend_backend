import React, { useState, useEffect } from 'react';
import { getAllEnrollments } from '../../services/enrollmentManagementService';

const DocumentDetails = ({ doc }) => (
    <div className="flex flex-col rounded bg-gray-100 p-2 h-full">
        <p className="font-medium text-xs text-gray-800 truncate">
            <span className="font-bold">Étudiant:</span> {doc.studentName}
        </p>
        <p className="font-medium text-xs text-gray-800 truncate">
            <span className="font-bold">Document:</span> {doc.documentType}
        </p>
        <p className="font-medium text-xs text-gray-800 truncate">
            <span className="font-bold">Date:</span> {doc.date}
        </p>
        <a 
            href="#" 
            className="self-end text-xs font-semibold text-red-500 mt-1"
        >
            Voir détails
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
                const enrollments = response.data || []; // Ensure enrollments is an array
                
                // Filter enrollments with pending documents
                // Note: enrollment.student does not exist in EnrollmentDtoResponse
                // Using generic student name until proper user data is available
                const pendingDocs = enrollments
                    .filter(enrollment => enrollment.status === 'PENDING' || enrollment.status === 'IN_PROGRESS')
                    .slice(0, 2) // Limit to first 2 for display
                    .map(enrollment => ({
                        studentName: `Étudiant #${enrollment.studentId}`,
                        documentType: 'Document à valider',
                        date: new Date(enrollment.submissionDate).toLocaleDateString('fr-FR')
                    }));
                
                setDocuments(pendingDocs);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching pending documents:', err);
                setError(err);
                setLoading(false);
            }
        };

        fetchPendingDocuments();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow h-full flex flex-col">
                <div className="bg-[#1019574D] rounded-t-lg p-3">
                    <h4 className="text-[#101957] font-semibold text-sm">Documents en Attente</h4>
                </div>
                <div className="p-4 flex-grow flex items-center justify-center">
                    Chargement...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow h-full flex flex-col">
                <div className="bg-[#1019574D] rounded-t-lg p-3">
                    <h4 className="text-[#101957] font-semibold text-sm">Documents en Attente</h4>
                </div>
                <div className="p-4 flex-grow flex items-center justify-center">
                    Erreur: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow h-full flex flex-col">
            <div className="bg-[#1019574D] rounded-t-lg p-3">
                <h4 className="text-[#101957] font-semibold text-sm">Documents en Attente</h4>
            </div>
            <div className="p-3 flex-grow overflow-hidden">
                <div className="space-y-2 h-full">
                    {documents.length > 0 ? (
                        documents.map((doc, index) => (
                            <DocumentDetails key={index} doc={doc} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 text-xs h-full flex items-center justify-center">
                            Aucun document en attente
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingDocuments;