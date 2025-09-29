import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getModulesByProgramId, createModule, updateModule, deleteModule, addModuleToProgram } from '../../services/moduleService';
import { getProgramById } from '../../services/programService';

const ModuleManagement = () => {
    const navigate = useNavigate();
    const { programId } = useParams();
    const [program, setProgram] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingModule, setEditingModule] = useState(null);

    const [formData, setFormData] = useState({
        moduleName: '',
        moduleDescription: '',
        moduleOrder: 1
    });

    useEffect(() => {
        if (programId) {
            fetchProgramAndModules();
        }
    }, [programId]);

    const fetchProgramAndModules = async () => {
        try {
            setLoading(true);
            // Fetch program details
            const programResponse = await getProgramById(programId);
            setProgram(programResponse.data);
            
            // Fetch modules for this program
            const modulesResponse = await getModulesByProgramId(programId);
            setModules(modulesResponse);
            setError(null);
        } catch (err) {
            console.error('Error fetching program and modules:', err);
            setError("Impossible de charger les modules de la formation. Veuillez vérifier votre connexion ou réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddModule = () => {
        setEditingModule(null);
        setFormData({
            moduleName: '',
            moduleDescription: '',
            moduleOrder: modules.length + 1
        });
        setShowAddForm(true);
    };

    const handleEditModule = (module) => {
        setEditingModule(module);
        setFormData({
            moduleName: module.moduleName,
            moduleDescription: module.moduleDescription,
            moduleOrder: module.moduleOrder
        });
        setShowAddForm(true);
    };

    const handleDeleteModule = async (moduleId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
            try {
                await deleteModule(moduleId);
                // Refresh the modules list
                fetchProgramAndModules();
                console.log(`Module with ID ${moduleId} deleted successfully`);
            } catch (err) {
                console.error('Error deleting module:', err);
                alert('Erreur lors de la suppression du module : ' + err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingModule) {
                // Update existing module
                await updateModule(editingModule.id, { ...formData, programId: parseInt(programId) });
            } else {
                // Create new module using the dedicated endpoint
                await addModuleToProgram(programId, formData);
            }
            // Refresh the modules list
            fetchProgramAndModules();
            setShowAddForm(false);
        } catch (err) {
            console.error('Error saving module:', err);
            alert('Erreur lors de l\'enregistrement du module : ' + err.message);
        }
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingModule(null);
    };

    const handleBack = () => {
        navigate('/admin-dashboard/program-management');
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestion des Modules</h2>
                    </div>
                </div>
                <div className="w-full h-1 bg-[#101957] my-8"></div>
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101957]"></div>
                    <span className="ml-3 text-lg text-[#101957]">Chargement des modules...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestion des Modules</h2>
                    </div>
                </div>
                <div className="w-full h-1 bg-[#101957] my-8"></div>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erreur : </strong>
                    <span className="block sm:inline">{error}</span>
                    <button 
                        onClick={fetchProgramAndModules}
                        className="mt-2 bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-4 rounded"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des Modules</h2>
                    {program && (
                        <p className="text-gray-600">Formation: {program.programName}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        Retour aux Formations
                    </button>
                    <button
                        onClick={handleAddModule}
                        className="bg-[#101957] hover:bg-[#1a2685] text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        Ajouter un Module
                    </button>
                </div>
            </div>

            <div className="w-full h-1 bg-[#101957] my-8"></div>

            {showAddForm ? (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-[#101957]">
                        {editingModule ? 'Modifier le Module' : 'Ajouter un Module'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="moduleName" className="block text-[#333333] text-lg font-normal mb-2">Nom du Module</label>
                            <input
                                type="text"
                                id="moduleName"
                                name="moduleName"
                                value={formData.moduleName}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="moduleOrder" className="block text-[#333333] text-lg font-normal mb-2">Ordre</label>
                            <input
                                type="number"
                                id="moduleOrder"
                                name="moduleOrder"
                                value={formData.moduleOrder}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="moduleDescription" className="block text-[#333333] text-lg font-normal mb-2">Description</label>
                            <textarea
                                id="moduleDescription"
                                name="moduleDescription"
                                value={formData.moduleDescription}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 rounded-md border border-gray-300 text-lg"
                                required
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="py-2 px-6 rounded-md border border-gray-400 text-[#333333] font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="py-2 px-6 rounded-md bg-[#101957] text-white font-semibold hover:bg-opacity-90 transition-colors"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#B6B8CB]">
                        <tr>
                            <th className="px-6 py-6 text-center text-white text-[1.2em] font-bold tracking-wider" style={{ borderRight: '3px solid white' }}>Nom du Module</th>
                            <th className="px-6 py-6 text-center text-white text-[1.2em] font-bold tracking-wider" style={{ borderRight: '3px solid white' }}>Description</th>
                            <th className="px-6 py-6 text-center text-white text-[1.2em] font-bold tracking-wider" style={{ borderRight: '3px solid white' }}>Ordre</th>
                            <th className="px-6 py-6 text-center text-white text-[1.2em] font-bold tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {modules.length > 0 ? (
                            modules.map((module) => (
                                <tr key={module.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-center" style={{ borderRight: '3px solid white' }}>{module.moduleName}</td>
                                    <td className="px-6 py-4 text-center" style={{ borderRight: '3px solid white' }}>{module.moduleDescription}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center" style={{ borderRight: '3px solid white' }}>{module.moduleOrder}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                        <button
                                            onClick={() => handleEditModule(module)}
                                            className="py-1 px-3 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDeleteModule(module.id)}
                                            className="py-1 px-3 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun module disponible</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Aucun module n'a été trouvé pour cette formation.
                                        </p>
                                        <button
                                            onClick={handleAddModule}
                                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#101957] hover:bg-[#1a2685] focus:outline-none"
                                        >
                                            Ajouter un module
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ModuleManagement;