import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProgramById, createProgram, updateProgram } from '../../services/programService';

const ProgramForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        programName: '',
        programCode: '',
        description: '',
        registrationFee: '',
        maxCapacity: '',
        registrationStartDate: '',
        registrationEndDate: '',
        image: '',
        duration: '',
        price: ''
    });

    useEffect(() => {
        if (isEditing) {
            fetchProgramData();
        }
    }, [isEditing, id]);

    const fetchProgramData = async () => {
        try {
            const response = await getProgramById(id);
            // Map the response data to formData structure
            setFormData({
                programName: response.programName || '',
                programCode: response.programCode || '',
                description: response.description || '',
                registrationFee: response.registrationFee || '',
                maxCapacity: response.maxCapacity || '',
                registrationStartDate: response.registrationStartDate || '',
                registrationEndDate: response.registrationEndDate || '',
                image: response.image || '',
                duration: response.duration || '',
                price: response.price || ''
            });
        } catch (err) {
            console.error('Error fetching program data:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateProgram(id, formData);
                console.log('Program updated:', formData);
            } else {
                await createProgram(formData);
                console.log('New program created:', formData);
            }
            navigate('/admin-dashboard/program-management');
        } catch (err) {
            console.error('Error saving program:', err);
            alert('Error saving program: ' + err.message);
        }
    };

    const handleCancel = () => {
        navigate('/admin-dashboard/program-management');
    };

    return (
        <div className="p-8">
            <h2 className="text-[#333333] text-3xl font-bold mb-6">
                {isEditing ? `Modifier Formation: ${formData.programName}` : 'Ajouter une Formation'}
            </h2>
            
            <div className="w-full h-1 bg-[#101957] my-8"></div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#101957]">Informations de Base</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="programName" className="block text-[#333333] text-lg font-normal mb-2">Nom de la Formation</label>
                            <input
                                type="text"
                                id="programName"
                                name="programName"
                                value={formData.programName}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="programCode" className="block text-[#333333] text-lg font-normal mb-2">Code de la Formation</label>
                            <input
                                type="text"
                                id="programCode"
                                name="programCode"
                                value={formData.programCode}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-[#333333] text-lg font-normal mb-2">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 rounded-md border border-gray-300 text-lg"
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Registration Details Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#101957]">Détails d'Inscription</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="registrationFee" className="block text-[#333333] text-lg font-normal mb-2">Frais d'Inscription (FCFA)</label>
                            <input
                                type="number"
                                id="registrationFee"
                                name="registrationFee"
                                value={formData.registrationFee}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="maxCapacity" className="block text-[#333333] text-lg font-normal mb-2">Capacité Maximale</label>
                            <input
                                type="number"
                                id="maxCapacity"
                                name="maxCapacity"
                                value={formData.maxCapacity}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="registrationStartDate" className="block text-[#333333] text-lg font-normal mb-2">Date de Début des Inscriptions</label>
                            <input
                                type="date"
                                id="registrationStartDate"
                                name="registrationStartDate"
                                value={formData.registrationStartDate}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="registrationEndDate" className="block text-[#333333] text-lg font-normal mb-2">Date de Fin des Inscriptions</label>
                            <input
                                type="date"
                                id="registrationEndDate"
                                name="registrationEndDate"
                                value={formData.registrationEndDate}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-[#333333] text-lg font-normal mb-2">Durée (mois)</label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-[#333333] text-lg font-normal mb-2">Prix (FCFA)</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Image Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-[#101957]">Image</h3>
                    <div>
                        <label htmlFor="image" className="block text-[#333333] text-lg font-normal mb-2">URL de l'Image</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg"
                        />
                    </div>
                </div>

                {/* Form Actions */}
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
    );
};

export default ProgramForm;