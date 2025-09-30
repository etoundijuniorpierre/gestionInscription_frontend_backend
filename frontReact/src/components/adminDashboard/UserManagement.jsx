import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../../services/userService';

const UserManagement = () => {
    const navigate = useNavigate();
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
        onConfirm: null
    });
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [users, searchTerm, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            setUsers(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users: ' + err.message);
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
                user.firstName.toLowerCase().includes(term) || 
                user.lastName.toLowerCase().includes(term) || 
                user.email.toLowerCase().includes(term)
            );
        }
        
        // Apply role filter
        if (roleFilter !== 'Tous') {
            result = result.filter(user => user.role === roleFilter);
        }
        
        // Apply status filter
        if (statusFilter !== 'Tous') {
            result = result.filter(user => user.status === statusFilter);
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

    const handleAddUser = () => {
        navigate('/admin-dashboard/user-management/add');
    };

    const handleModifyUser = (userId) => {
        navigate(`/admin-dashboard/user-management/edit/${userId}`);
    };

    const handleDeleteUser = (userId) => {
        openConfirmModal('Êtes-vous sûr de vouloir supprimer cet utilisateur ?', () => proceedWithUserDeletion(userId));
    };

    const proceedWithUserDeletion = async (userId) => {
        try {
            await deleteUser(userId);
            // Refresh the users list
            fetchUsers();
            console.log(`User with ID ${userId} deleted successfully`);
        } catch (err) {
            console.error('Error deleting user:', err);
            showNotification('Error deleting user: ' + err.message);
        }
    };

    const handleViewProfile = (userId) => {
        console.log(`Viewing profile for user with ID: ${userId}`);
        // Navigate to a dedicated profile view page if one exists
    };

    const handleToggleStatus = (userId) => {
        // Implement logic to activate/deactivate user
        console.log(`Toggling status for user with ID: ${userId}`);
    };

    if (loading) {
        return (
            <div className="p-8">
                <h2 className="text-[#333333] text-[2.5rem] font-bold mb-4">Gestion des Utilisateurs</h2>
                <div className="w-full h-1 bg-[#101957] my-8"></div>
                <div>Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <h2 className="text-[#333333] text-[2.5rem] font-bold mb-4">Gestion des Utilisateurs</h2>
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
            
            <h2 className="text-[#333333] text-[2.5rem] font-bold mb-4">Gestion des Utilisateurs</h2>

            <div className="w-full h-1 bg-[#101957] my-8"></div>
            
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handleAddUser}
                    className="py-2 px-6 rounded-md bg-[#101957] text-white font-semibold hover:bg-opacity-90 transition-colors"
                >
                    Ajouter un nouvel utilisateur
                </button>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        className="py-2 px-4 rounded-md border border-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="py-2 px-4 rounded-md border border-gray-300"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="Tous">Tous les rôles</option>
                        <option value="Étudiant">Étudiant</option>
                        <option value="Administrateur">Administrateur</option>
                    </select>
                    <select
                        className="py-2 px-4 rounded-md border border-gray-300"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="Tous">Tous les statuts</option>
                        <option value="Actif">Actif</option>
                        <option value="Inactif">Inactif</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#B6B8CB]">
                        <tr>
                            <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider">Prénom</th>
                            <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider">Rôle</th>
                            <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-center text-white text-sm font-bold tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.firstName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`py-1 px-3 rounded-full text-xs font-medium ${
                                            user.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                                        <button onClick={() => handleViewProfile(user.id)} className="text-gray-600 hover:text-gray-900 transition-colors">
                                            Voir Profil
                                        </button>
                                        <button onClick={() => handleModifyUser(user.id)} className="text-blue-600 hover:text-blue-900 transition-colors">
                                            Modifier
                                        </button>
                                        <button onClick={() => handleToggleStatus(user.id)} className="text-yellow-600 hover:text-yellow-900 transition-colors">
                                            {user.status === 'Actif' ? 'Désactiver' : 'Activer'}
                                        </button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 transition-colors">
                                            Supprimer
                                        </button>
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

            {/* Pagination controls */}
            <div className="flex justify-center mt-4 space-x-2">
                <button className="py-2 px-4 rounded-md border border-gray-300">Précédent</button>
                <button className="py-2 px-4 rounded-md border border-gray-300">1</button>
                <button className="py-2 px-4 rounded-md border border-gray-300">2</button>
                <button className="py-2 px-4 rounded-md border border-gray-300">3</button>
                <button className="py-2 px-4 rounded-md border border-gray-300">Suivant</button>
            </div>
        </div>
    );
};

export default UserManagement;