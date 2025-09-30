import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, createUser, updateUser } from '../../services/userService';

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'Étudiant',
        status: 'Actif',
        password: '',
        confirmPassword: '',
        // Student-specific fields (for a student user)
        birthDate: '',
        address: '',
        phone: '',
        gender: '',
        nationality: '',
        civilStatus: '',
    });

    useEffect(() => {
        if (isEditing) {
            fetchUserData();
        }
    }, [isEditing, id]);

    const fetchUserData = async () => {
        try {
            const userData = await getUserById(id);
            console.log('User data received:', userData); // Debug log
            // Map the response data to formData structure
            setFormData({
                firstName: userData.firstname || '',
                lastName: userData.lastname || '',
                email: userData.email || '',
                role: userData.roleName || 'Étudiant',
                status: userData.enabled ? 'Actif' : 'Inactif',
                // Student-specific fields
                birthDate: userData.dateOfBirth || '',
                address: userData.address || '',
                phone: userData.phoneNumber || '',
                gender: userData.gender || '',
                nationality: userData.nationality || '',
                civilStatus: userData.maritalStatus || '',
            });
        } catch (err) {
            console.error('Error fetching user data:', err);
            // Show error to user
            alert('Error fetching user data: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add password validation (e.g., must match confirm password)
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            // Map formData to API expected structure
            const userData = {
                firstname: formData.firstName,
                lastname: formData.lastName,
                email: formData.email,
                roleName: formData.role,
                enabled: formData.status === 'Actif',
                dateOfBirth: formData.birthDate,
                address: formData.address,
                phoneNumber: formData.phone,
                gender: formData.gender,
                nationality: formData.nationality,
                maritalStatus: formData.civilStatus,
            };

            if (isEditing) {
                await updateUser(id, userData);
                console.log('User updated:', userData);
            } else {
                // For new users, include password
                if (formData.password) {
                    userData.password = formData.password;
                }
                await createUser(userData);
                console.log('New user added:', userData);
            }
            navigate('/admin-dashboard/user-management');
        } catch (err) {
            console.error('Error saving user:', err);
            
            // Provide more specific error information
            let errorMessage = 'Error saving user: ';
            
            if (err.response) {
                // Server responded with error status
                if (err.response.data && err.response.data.message) {
                    errorMessage += err.response.data.message;
                } else {
                    errorMessage += `Server error ${err.response.status}: ${err.response.statusText}`;
                }
            } else if (err.request) {
                // Request was made but no response received
                errorMessage += 'Unable to contact server. Please check your internet connection.';
            } else {
                // Something else happened
                errorMessage += err.message;
            }
            
            alert(errorMessage);
        }
    };

    const handleCancel = () => {
        navigate('/admin-dashboard/user-management');
    };

    return (
        <div className="p-8">
            <h2 className="text-[#333333] text-[2.5rem] font-bold mb-4">
                {isEditing ? `Modifier utilisateur: ${formData.firstName} ${formData.lastName}` : 'Ajouter un utilisateur'}
            </h2>
            <div className="w-full h-1 bg-[#101957] my-8"></div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <label htmlFor="lastName" className="block text-[#333333] text-lg font-normal mb-2">Nom</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg" required />
                    </div>
                    <div>
                        <label htmlFor="firstName" className="block text-[#333333] text-lg font-normal mb-2">Prénom</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-[#333333] text-lg font-normal mb-2">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg" required />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-[#333333] text-lg font-normal mb-2">Rôle</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg">
                            <option value="Étudiant">Étudiant</option>
                            <option value="Administrateur">Administrateur</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-[#333333] text-lg font-normal mb-2">Mot de passe</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg" required={!isEditing} />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-[#333333] text-lg font-normal mb-2">Confirmer mot de passe</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg" required={!isEditing} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <label className="block text-[#333333] text-lg font-normal">Statut du compte :</label>
                        <div className="flex items-center space-x-2">
                            <label className="inline-flex items-center">
                                <input type="radio" name="status" value="Actif" checked={formData.status === 'Actif'} onChange={handleChange} className="form-radio" />
                                <span className="ml-2 text-gray-700">Actif</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" name="status" value="Inactif" checked={formData.status === 'Inactif'} onChange={handleChange} className="form-radio" />
                                <span className="ml-2 text-gray-700">Inactif</span>
                            </label>
                        </div>
                    </div>
                </div>

                {formData.role === 'Étudiant' && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <h3 className="col-span-1 md:col-span-2 text-[#333333] text-xl font-bold border-t pt-6">Informations Étudiant</h3>
                        <div>
                            <label htmlFor="birthDate" className="block text-[#333333] text-lg font-normal mb-2">Date de naissance</label>
                            <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg" />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-[#333333] text-lg font-normal mb-2">Adresse</label>
                            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-[#333333] text-lg font-normal mb-2">Téléphone</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg" />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-[#333333] text-lg font-normal mb-2">Sexe</label>
                            <div className="flex space-x-4">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="gender" value="M" checked={formData.gender === 'M'} onChange={handleChange} className="form-radio" />
                                    <span className="ml-2 text-gray-700">M</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input type="radio" name="gender" value="F" checked={formData.gender === 'F'} onChange={handleChange} className="form-radio" />
                                    <span className="ml-2 text-gray-700">F</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="nationality" className="block text-[#333333] text-lg font-normal mb-2">Nationalité</label>
                            <input type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg" />
                        </div>
                        <div>
                            <label htmlFor="civilStatus" className="block text-[#333333] text-lg font-normal mb-2">État civil</label>
                            <select id="civilStatus" name="civilStatus" value={formData.civilStatus} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-gray-300 text-lg">
                                <option value="">Sélectionner...</option>
                                <option value="Célibataire">Célibataire</option>
                                <option value="Marié">Marié</option>
                                <option value="Divorcé">Divorcé</option>
                                <option value="Veuf">Veuf</option>
                            </select>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" onClick={handleCancel} className="py-2 px-6 rounded-md border border-gray-400 text-[#333333] font-semibold hover:bg-gray-100 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" className="py-2 px-6 rounded-md bg-[#101957] text-white font-semibold hover:bg-opacity-90 transition-colors">
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;