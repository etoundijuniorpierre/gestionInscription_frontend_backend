import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getEnrollmentById, requestEnrollmentCorrections } from '../../services/enrollmentManagementService';
import { mapApiStatusToDisplay } from '../../utils/enrollmentStatusUtils';
import Button from '../common/Button';

const EnrollmentCorrections = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [enrollment, setEnrollment] = useState(null);
    const [corrections, setCorrections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchEnrollment = async () => {
            try {
                setLoading(true);
                // Get enrollment ID from location state or URL params
                const enrollmentId = location.state?.enrollmentId || location.pathname.split('/').pop();
                if (enrollmentId) {
                    const data = await getEnrollmentById(enrollmentId);
                    setEnrollment(data);
                    
                    // Initialize corrections array with document information
                    if (data.documents) {
                        const initialCorrections = data.documents.map(doc => ({
                            documentId: doc.id,
                            reason: '',
                            documentName: doc.name,
                            documentType: doc.documentType
                        }));
                        setCorrections(initialCorrections);
                    }
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching enrollment:', err);
                setError('Failed to load enrollment data: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollment();
    }, [location]);

    const handleReasonChange = (documentId, reason) => {
        setCorrections(prev => 
            prev.map(correction => 
                correction.documentId === documentId 
                    ? { ...correction, reason } 
                    : correction
            )
        );
    };

    const handleSubmitCorrections = async () => {
        // Filter out corrections without reasons
        const validCorrections = corrections.filter(c => c.reason.trim() !== '');
        
        if (validCorrections.length === 0) {
            toast.error('Veuillez fournir au moins une raison de correction.');
            return;
        }

        try {
            setSubmitting(true);
            // Transform corrections to match API format (documentId and reason)
            const correctionsData = validCorrections.map(correction => ({
                documentId: correction.documentId,
                reason: correction.reason
            }));
            
            // Submit corrections to the backend
            await requestEnrollmentCorrections(enrollment.id, correctionsData);
            
            // Show success message
            toast.success('Corrections soumises avec succès. Vous serez notifié une fois que les corrections auront été traitées.');
            
            // Navigate back to the dashboard or status page
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting corrections:', error);
            let errorMessage = 'Une erreur est survenue lors de la soumission des corrections. Veuillez réessayer.';
            
            if (error.response) {
                if (error.response.status === 400) {
                    errorMessage = 'Données de correction invalides. Veuillez vérifier les informations saisies.';
                } else if (error.response.status === 404) {
                    errorMessage = 'Inscription non trouvée.';
                } else if (error.response.status === 500) {
                    errorMessage = 'Erreur interne du serveur. Veuillez contacter l\'administrateur.';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = `Erreur: ${error.response.data.message}`;
                }
            }
            
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Chargement des corrections...</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p>Chargement des détails de l'inscription...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Corrections d'Inscription</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={handleCancel}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        Retour au tableau de bord
                    </button>
                </div>
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Corrections d'Inscription</h2>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p>Aucune inscription trouvée.</p>
                    <button
                        onClick={handleCancel}
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                        Retour au tableau de bord
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Corrections d'Inscription</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Détails de l'Inscription</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Étudiant:</p>
                        <p className="font-medium">{enrollment.studentName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Formation:</p>
                        <p className="font-medium">{enrollment.programName}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Date de soumission:</p>
                        <p className="font-medium">
                            {enrollment.submissionDate 
                                ? new Date(enrollment.submissionDate).toLocaleDateString('fr-FR') 
                                : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Statut:</p>
                        <p className="font-medium">{mapApiStatusToDisplay(enrollment.status)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Documents Nécessitant des Corrections</h3>
                <p className="text-gray-600 mb-6">
                    Veuillez fournir les raisons spécifiques pour chaque document nécessitant des corrections.
                </p>
                
                <div className="space-y-6">
                    {corrections.map((correction) => (
                        <div key={correction.documentId} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium text-lg">{correction.documentName}</h4>
                                <span className="text-sm text-gray-500">{correction.documentType}</span>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">
                                    Raison de la correction requise:
                                </label>
                                <textarea
                                    value={correction.reason}
                                    onChange={(e) => handleReasonChange(correction.documentId, e.target.value)}
                                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Décrivez pourquoi ce document nécessite une correction..."
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {corrections.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Aucun document nécessitant des corrections.</p>
                    </div>
                )}

                <div className="flex justify-end space-x-4 mt-8">
                    <Button
                        secondary
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2"
                        disabled={submitting}
                    >
                        Annuler
                    </Button>
                    <Button
                        primary
                        type="button"
                        onClick={handleSubmitCorrections}
                        className="px-6 py-2"
                        disabled={corrections.length === 0 || submitting}
                    >
                        {submitting ? 'Soumission en cours...' : 'Soumettre les Corrections'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentCorrections;