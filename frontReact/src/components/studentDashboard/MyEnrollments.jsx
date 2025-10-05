import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyEnrollments } from '../../services/enrollmentService';
import { mapApiStatusToDisplay } from '../../utils/enrollmentStatusUtils';

const MyEnrollments = () => {
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const data = await getMyEnrollments();
                setEnrollments(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching enrollments:', err);
                setError('Failed to load enrollments. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Inscriptions</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p>Chargement des inscriptions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Inscriptions</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Inscriptions</h2>
            {enrollments.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p>Vous n'avez aucune inscription pour le moment.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                        Commencer une nouvelle inscription
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    {enrollment.programName || 'Formation inconnue'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Statut: <span className="font-medium">{mapApiStatusToDisplay(enrollment.status)}</span>
                                </p>
                                <div className="text-sm text-gray-500 mb-4">
                                    <span>
                                        Date de soumission: {enrollment.submissionDate 
                                            ? new Date(enrollment.submissionDate).toLocaleDateString('fr-FR') 
                                            : 'N/A'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate(`/dashboard/my-enrollments/${enrollment.id}`)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Voir les détails
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEnrollments;