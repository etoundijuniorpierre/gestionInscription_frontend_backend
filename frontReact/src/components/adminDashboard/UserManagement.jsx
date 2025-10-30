import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getAllUsers, deleteUser, changeUserPassword, toggleUserStatus } from '../../services/userService';
import { jwtDecode } from 'jwt-decode';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('Tous');
    const [statusFilter, setStatusFilter] = useState('Tous');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalData, setModalData] = useState({
        message: '',
        onConfirm: null,
        title: 'Confirmation'
    });
    const [notification, setNotification] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    
    // State for password change modal
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        userId: null,
        newPassword: '',
        confirmNewPassword: ''
    });
    
    // State for view profile (details) modal
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Get current user ID from JWT token
        const token = localStorage.getItem('jwt_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Assuming the user ID is stored in the 'sub' field or another field of the token
                // You might need to adjust this based on your actual token structure
                const userId = decodedToken.userId || decodedToken.id || decodedToken.sub;
                // Store as number to ensure consistent comparison
                setCurrentUserId(parseInt(userId));
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [users, searchTerm, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const usersData = await getAllUsers();
            console.log('Users data received:', usersData); // Debug log
            
            // Log unique role names to help with filtering
            if (usersData && Array.isArray(usersData)) {
                const roleNames = [...new Set(usersData.map(user => user.roleName))];
                console.log('Unique role names in data:', roleNames);
            }
            
            // Ensure usersData is an array
            if (!Array.isArray(usersData)) {
                throw new Error('Les données des utilisateurs ne sont pas au format attendu');
            }
            
            setUsers(usersData);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            
            // Provide more specific error information
            let errorMessage = 'Failed to load users: ';
            
            if (err.response) {
                // Server responded with error status
                if (err.response.status === 500) {
                    errorMessage += 'Internal server error. This is a backend issue that requires administrator attention.';
                    if (err.response.data && err.response.data.message) {
                        errorMessage += ' Details: ' + err.response.data.message;
                    }
                } else if (err.response.data && err.response.data.message) {
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
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = users;
        
        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(user => 
                user.firstname.toLowerCase().includes(term) || 
                user.lastname.toLowerCase().includes(term) || 
                user.email.toLowerCase().includes(term)
            );
        }
        
        // Apply role filter
        if (roleFilter !== 'Tous') {
            result = result.filter(user => user.roleName === roleFilter);
        }
        
        // Apply status filter
        if (statusFilter !== 'Tous') {
            const statusValue = statusFilter === 'Actif';
            result = result.filter(user => user.enabled === statusValue);
        }
        
        setFilteredUsers(result);
    };

    const showNotification = (message, type = 'error') => {
        setNotification({ message, type });
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const openConfirmModal = (title, message, onConfirm) => {
        setModalData({ title, message, onConfirm });
        setShowConfirmModal(true);
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setModalData({ message: '', onConfirm: null, title: 'Confirmation' });
    };

    const handleConfirm = () => {
        if (modalData.onConfirm) {
            modalData.onConfirm();
        }
        closeConfirmModal();
    };

    const handleDeleteUser = (userId) => {
        // Prevent deleting the current user
        if (parseInt(userId) === parseInt(currentUserId)) {
            showNotification('Vous ne pouvez pas supprimer votre propre compte.', 'error');
            return;
        }
        
        const userToDelete = users.find(user => user.id === userId);
        if (userToDelete) {
            openConfirmModal(
                'Suppression d\'utilisateur',
                `Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete.firstname} ${userToDelete.lastname} ?`,
                () => proceedWithUserDeletion(parseInt(userId))
            );
        }
    };

    const proceedWithUserDeletion = async (userId) => {
        try {
            await deleteUser(userId);
            // Refresh the users list
            fetchUsers();
            showNotification('Utilisateur supprimé avec succès.', 'success');
        } catch (err) {
            console.error('Error deleting user:', err);
            showNotification('Erreur lors de la suppression de l\'utilisateur: ' + (err.response?.data?.message || err.message), 'error');
        }
    };

    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedUser(null);
    };

    const handleModifyPassword = (userId) => {
        setPasswordData({
            userId: userId,
            newPassword: '',
            confirmNewPassword: ''
        });
        setShowPasswordModal(true);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswordData({
            userId: null,
            newPassword: '',
            confirmNewPassword: ''
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitPasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            showNotification('Les mots de passe ne correspondent pas.', 'error');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            showNotification('Le mot de passe doit contenir au moins 8 caractères.', 'error');
            return;
        }

        try {
            await changeUserPassword(passwordData.userId, passwordData.newPassword);
            closePasswordModal();
            showNotification('Mot de passe modifié avec succès.', 'success');
        } catch (err) {
            console.error('Error changing password:', err);
            showNotification('Erreur lors de la modification du mot de passe: ' + (err.response?.data?.message || err.message), 'error');
        }
    };

    const handleToggleStatus = async (userId) => {
        // Prevent disabling the current user
        if (parseInt(userId) === parseInt(currentUserId)) {
            showNotification('Vous ne pouvez pas désactiver votre propre compte.', 'error');
            return;
        }
        
        const userToToggle = users.find(user => user.id === userId);
        if (userToToggle) {
            const action = userToToggle.enabled ? 'désactiver' : 'activer';
            const status = userToToggle.enabled ? 'actif' : 'inactif';
            
            openConfirmModal(
                `${action.charAt(0).toUpperCase() + action.slice(1)} un utilisateur`,
                `Êtes-vous sûr de vouloir ${action} l'utilisateur ${userToToggle.firstname} ${userToToggle.lastname} (actuellement ${status}) ?`,
                () => proceedWithStatusToggle(parseInt(userId))
            );
        }
    };

    const proceedWithStatusToggle = async (userId) => {
        try {
            await toggleUserStatus(userId);
            // Refresh the users list
            fetchUsers();
            showNotification('Statut utilisateur mis à jour avec succès.', 'success');
        } catch (err) {
            console.error('Error toggling user status:', err);
            showNotification('Erreur lors de la mise à jour du statut: ' + (err.response?.data?.message || err.message), 'error');
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                        <p className="text-gray-600 mt-1">Gérez les utilisateurs de la plateforme</p>
                    </div>
                </div>
                <div className="w-full h-1 bg-[#101957] my-8"></div>
                <div>Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                        <p className="text-gray-600 mt-1">Gérez les utilisateurs de la plateforme</p>
                    </div>
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
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">{modalData.title}</h3>
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
            
            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Modifier le mot de passe</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Entrez le nouveau mot de passe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={passwordData.confirmNewPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Confirmez le nouveau mot de passe"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={closePasswordModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={submitPasswordChange}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Modifier
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* User Details Modal */}
            {showDetailsModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800">Détails de l'utilisateur</h3>
                            <button 
                                onClick={closeDetailsModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {/* User Profile Header */}
                            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-[#101957] to-[#B6B8CB] rounded-lg text-white">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold">{selectedUser.firstname} {selectedUser.lastname}</h4>
                                    <p className="text-indigo-200">{selectedUser.email}</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                                        selectedUser.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedUser.enabled ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Basic Information Grid */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Informations de base</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</label>
                                        <p className="mt-1 text-sm text-gray-900 font-medium">{selectedUser.id}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Rôle</label>
                                        <p className="mt-1 text-sm text-gray-900 font-medium">{selectedUser.roleName || 'Non spécifié'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                                        <p className="mt-1 text-sm text-gray-900 font-medium break-words">{selectedUser.email || 'Non spécifié'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut du compte</label>
                                        <p className="mt-1">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                selectedUser.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {selectedUser.enabled ? 'Actif' : 'Inactif'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Compte verrouillé</label>
                                        <p className="mt-1">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                selectedUser.accountLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {selectedUser.accountLocked ? 'Oui' : 'Non'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Student-specific fields - only show if user has student data */}
                            {(selectedUser.dateOfBirth || 
                              selectedUser.address || 
                              selectedUser.phoneNumber || 
                              selectedUser.gender || 
                              selectedUser.nationality || 
                              selectedUser.maritalStatus || 
                              selectedUser.desiredAcademicYear || 
                              selectedUser.intendedFieldOfStudy) && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Informations Étudiant</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedUser.dateOfBirth && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Date de naissance</label>
                                                <p className="mt-1 text-sm text-gray-900 font-medium">{selectedUser.dateOfBirth}</p>
                                            </div>
                                        )}
                                        {selectedUser.address && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Adresse</label>
                                                <p className="mt-1 text-sm text-gray-900 font-medium">{selectedUser.address}</p>
                                            </div>
                                        )}
                                        {selectedUser.phoneNumber && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Téléphone</label>
                                                <p className="mt-1 text-sm text-gray-900 font-medium">{selectedUser.phoneNumber}</p>
                                            </div>
                                        )}
                                        {selectedUser.gender && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Sexe</label>
                                                <p className="mt-1 text-sm text-gray-900 font-medium">{selectedUser.gender}</p>
                                            </div>
                                        )}
                                        {selectedUser.nationality && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Nationalité</label>
                                                <p className="mt-1 text-sm text-gray-900 font-medium">{selectedUser.nationality}</p>
                                            </div>
                                        )}
                                        {selectedUser.maritalStatus && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">État civil</label>
                                                <p className="mt-1 text-sm text-gray-900 font-medium">{selectedUser.maritalStatus}</p>
                                            </div>
                                        )}
                                        {selectedUser.desiredAcademicYear && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Année académique souhaitée</label>
                                                <p className="mt-1 text-sm text-gray-900 font-medium">{selectedUser.desiredAcademicYear}</p>
                                            </div>
                                        )}
                                        {selectedUser.intendedFieldOfStudy && (
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Domaine d'étude prévu</label>
                                                <p className="mt-1 text-sm text-gray-900 font-medium">{selectedUser.intendedFieldOfStudy}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {selectedUser.enrollmentIds && selectedUser.enrollmentIds.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">Inscriptions</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">ID des inscriptions</label>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedUser.enrollmentIds.map((id, index) => (
                                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {id}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
                            <button
                                onClick={closeDetailsModal}
                                className="px-6 py-2 bg-[#101957] text-white rounded-lg hover:bg-[#1a2685] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#101957] shadow-md hover:shadow-lg"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                    <p className="text-gray-600 mt-1">Gérez les utilisateurs de la plateforme</p>
                </div>
            </div>

            <div className="w-full h-1 bg-[#101957] my-8"></div>
            
            {/* Added padding (mb-6) between filters and table */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    className="py-2 px-4 rounded-md border border-gray-300 w-full sm:w-auto sm:flex-grow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="py-2 px-4 rounded-md border border-gray-300 w-full sm:w-auto"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="Tous">Tous les rôles</option>
                    {/* Updated role options to match what API returns */}
                    <option value="STUDENT">Étudiant</option>
                    <option value="ADMIN">Administrateur</option>
                </select>
                <select
                    className="py-2 px-4 rounded-md border border-gray-300 w-full sm:w-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="Tous">Tous les statuts</option>
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#B6B8CB]">
                            <tr>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">ID</th>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">Nom</th>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">Prénom</th>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">Email</th>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">Rôle</th>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">Statut</th>
                                <th className="px-6 py-3 text-center text-white text-sm font-bold tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{user.lastname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{user.firstname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{user.roleName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm border-r border-gray-200">
                                            <span className={`py-1 px-3 rounded-full text-xs font-medium ${
                                                user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.enabled ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                            <button 
                                                onClick={() => handleViewProfile(user)} 
                                                className="py-1 px-3 rounded-md bg-gray-500 text-white text-sm hover:bg-gray-600 transition-colors"
                                            >
                                                Détails
                                            </button>
                                            {parseInt(user.id) !== parseInt(currentUserId) ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleToggleStatus(user.id)} 
                                                        className={`py-1 px-3 rounded-md text-white text-sm transition-colors ${
                                                            user.enabled 
                                                                ? 'bg-blue-500 hover:bg-blue-600' 
                                                                : 'bg-blue-500 hover:bg-blue-600'
                                                        }`}
                                                    >
                                                        {user.enabled ? 'Désactiver' : 'Activer'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleModifyPassword(user.id)} 
                                                        className="py-1 px-3 rounded-md bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"
                                                    >
                                                        Modifier MDP
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteUser(user.id)} 
                                                        className="py-1 px-3 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => handleModifyPassword(user.id)} 
                                                    className="py-1 px-3 rounded-md bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"
                                                >
                                                    Modifier MDP
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        Aucun utilisateur trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination controls - Only show when there are more than 10 items */}
            {filteredUsers.length > 10 && (
                <div className="flex justify-center mt-4 space-x-2">
                    <button 
                        className="py-2 px-4 rounded-md border border-gray-300 opacity-50 cursor-not-allowed"
                        disabled
                    >
                        Précédent
                    </button>
                    <button className="py-2 px-4 rounded-md border border-gray-300 bg-gray-200">1</button>
                    <button 
                        className="py-2 px-4 rounded-md border border-gray-300 opacity-50 cursor-not-allowed"
                        disabled
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserManagement;