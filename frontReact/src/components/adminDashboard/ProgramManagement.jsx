import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getAllPrograms, deleteProgram } from '../../services/programService';
import { getEnrollmentsByProgramId } from '../../services/enrollmentManagementService';

const ProgramManagement = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalData, setModalData] = useState({
        message: '',
        onConfirm: null
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const response = await getAllPrograms();
            setPrograms(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching programs:', err);
            setError('Failed to load programs: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'error') => {
        setNotification({ message, type });
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const openConfirmModal = (message, onConfirm) => {
        setModalData({ message, onConfirm });
        setShowConfirmModal(true);
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setModalData({ message: '', onConfirm: null });
    };

    const handleConfirm = () => {
        if (modalData.onConfirm) {
            modalData.onConfirm();
        }
        closeConfirmModal();
    };

    const handleAddProgram = () => {
        navigate('/admin-dashboard/program-management/add');
    };

    const handleModifyProgram = (programId) => {
        navigate(`/admin-dashboard/program-management/edit/${programId}`);
    };

    const handleManageModules = (programId) => {
        navigate(`/admin-dashboard/program-management/${programId}/modules`);
    };

    const handleDeleteProgram = async (programId) => {
        // First, check if there are any enrollments for this program
        try {
            const enrollments = await getEnrollmentsByProgramId(programId);
            
            // If there are enrollments, warn the user
            if (enrollments && enrollments.length > 0) {
                const confirmMessage = `Cette formation a ${enrollments.length} inscription(s) associée(s). Êtes-vous sûr de vouloir la supprimer ? Cette action pourrait affecter les données des étudiants.`;
                openConfirmModal(confirmMessage, () => proceedWithDeletion(programId));
            } else {
                // If no enrollments, show the standard confirmation
                openConfirmModal('Êtes-vous sûr de vouloir supprimer cette formation ?', () => proceedWithDeletion(programId));
            }
        } catch (err) {
            console.error('Error checking enrollments:', err);
            showNotification('Error checking enrollments: ' + err.message);
        }
    };

    const proceedWithDeletion = async (programId) => {
        try {
            // Proceed with deletion
            await deleteProgram(programId);
            // Refresh the programs list
            fetchPrograms();
            console.log(`Program with ID ${programId} deleted successfully`);
        } catch (err) {
            console.error('Error deleting program:', err);
            showNotification('Error deleting program: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestion des Formations</h2>
                        <p className="text-gray-600">Gérez les formations de votre institution</p>
                    </div>
                    <button
                        onClick={handleAddProgram}
                        className="bg-[#101957] hover:bg-[#1a2685] text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Ajouter une nouvelle formation
                    </button>
                </div>
                <div className="w-full h-1 bg-[#101957] my-8"></div>
                <div>Loading programs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestion des Formations</h2>
                        <p className="text-gray-600">Gérez les formations de votre institution</p>
                    </div>
                    <button
                        onClick={handleAddProgram}
                        className="bg-[#101957] hover:bg-[#1a2685] text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Ajouter une nouvelle formation
                    </button>
                </div>
                <div className="w-full h-1 bg-[#101957] my-8"></div>
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Notification display */}
            {notification && (
                <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
                    notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                    {notification.message}
                </div>
            )}
            
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirmation</h3>
                        <p className="mb-6 text-gray-600">{modalData.message}</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeConfirmModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des Formations</h2>
                    <p className="text-gray-600">Gérez les formations de votre institution</p>
                </div>
                <button
                    onClick={handleAddProgram}
                    className="bg-[#101957] hover:bg-[#1a2685] text-white font-bold py-2 px-4 rounded flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Ajouter une nouvelle formation
                </button>
            </div>

            <div className="w-full h-1 bg-[#101957] my-8"></div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#B6B8CB]">
                        <tr>
                            <th className="px-6 py-6 text-center text-white text-[1.2em] font-bold tracking-wider" style={{ borderRight: '3px solid white' }}>Nom de la Formation</th>
                            <th className="px-6 py-6 text-center text-white text-[1.2em] font-bold tracking-wider" style={{ borderRight: '3px solid white' }}>Code</th>
                            <th className="px-6 py-6 text-center text-white text-[1.2em] font-bold tracking-wider" style={{ borderRight: '3px solid white' }}>Frais d'Inscription</th>
                            <th className="px-6 py-6 text-center text-white text-[1.2em] font-bold tracking-wider" style={{ borderRight: '3px solid white' }}>Capacité Max.</th>
                            <th className="px-6 py-6 text-center text-white text-[1.2em] font-bold tracking-wider" style={{ borderRight: '3px solid white' }}>Ouverte aux Inscriptions</th>
                            <th className="px-6 py-6 text-center text-white text-[1.2em] font-bold tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {programs.map((program) => (
                            <tr key={program.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-center" style={{ borderRight: '3px solid white' }}>{program.programName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center" style={{ borderRight: '3px solid white' }}>{program.programCode}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center" style={{ borderRight: '3px solid white' }}>{program.registrationFee} F</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center" style={{ borderRight: '3px solid white' }}>{program.maxCapacity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center" style={{ borderRight: '3px solid white' }}>{program.enrollmentOpen ? 'Oui' : 'Non'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                    <button
                                        onClick={() => handleManageModules(program.id)}
                                        className="py-1 px-3 rounded-md bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"
                                    >
                                        Gérer les Modules
                                    </button>
                                    <button
                                        onClick={() => handleModifyProgram(program.id)}
                                        className="py-1 px-3 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProgram(program.id)}
                                        className="py-1 px-3 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProgramManagement;