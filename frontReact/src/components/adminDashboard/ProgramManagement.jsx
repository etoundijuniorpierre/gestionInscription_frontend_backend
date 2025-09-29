import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getAllPrograms, deleteProgram } from '../../services/programService';

const ProgramManagement = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleAddProgram = () => {
        navigate('/admin-dashboard/program-management/add');
    };

    const handleModifyProgram = (programId) => {
        navigate(`/admin-dashboard/program-management/edit/${programId}`);
    };

    const handleDeleteProgram = async (programId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
            try {
                await deleteProgram(programId);
                // Refresh the programs list
                fetchPrograms();
                console.log(`Program with ID ${programId} deleted successfully`);
            } catch (err) {
                console.error('Error deleting program:', err);
                alert('Error deleting program: ' + err.message);
            }
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
                                <td className="px-6 py-4 whitespace-nowrap text-center" style={{ borderRight: '3px solid white' }}>{program.isOpen ? 'Oui' : 'Non'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
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