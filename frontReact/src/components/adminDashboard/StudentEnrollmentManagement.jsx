import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEnrollments, getAllNonApprovedEnrollments } from '../../services/enrollmentManagementService';
import { getAllPrograms } from '../../services/programService';
import { mapApiStatusToDisplay } from '../../utils/enrollmentStatusUtils';

const StudentEnrollmentManagement = ({ onViewDetails }) => {
    const navigate = useNavigate();
    const [selectedEnrollments, setSelectedEnrollments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedMajor, setSelectedMajor] = useState(null);
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [allProgramNames, setAllProgramNames] = useState([]); // New state for all program names
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [activeTab, setActiveTab] = useState('all'); // New state for tabs

    // Add the missing state for filtered enrollments
    const [filteredEnrollments, setFilteredEnrollments] = useState([]);

    useEffect(() => {
        fetchEnrollments();
        fetchAllPrograms(); // Fetch all programs for the filter
    }, [activeTab]); // Add activeTab as dependency

    useEffect(() => {
        // Apply filters
        let result = enrollmentData;
        
        if (selectedStatus && selectedStatus !== "") {
            result = result.filter(enrollment => mapApiStatusToDisplay(enrollment.status) === selectedStatus);
        }
        
        // Fix: Only apply program filter if a specific program is selected (not "Toutes les formations")
        if (selectedMajor && selectedMajor !== "Toutes les formations") {
            result = result.filter(enrollment => enrollment.programName === selectedMajor);
        }
        
        // Academic year filtering removed - feature abandoned
        // if (selectedAcademicYear) {
        //     result = result.filter(enrollment => enrollment.academicYear === selectedAcademicYear);
        // }
        
        setFilteredEnrollments(result);
        setTotalPages(Math.ceil(result.length / 10)); // Update total pages based on filtered results
        setCurrentPage(1); // Reset to first page when filters change
    }, [enrollmentData, selectedStatus, selectedMajor]);

    // Calculate current enrollments for pagination
    const currentEnrollments = filteredEnrollments.slice(
        (currentPage - 1) * 10,
        currentPage * 10
    );

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            let response;
            
            // Fetch enrollments based on active tab
            if (activeTab === 'pending') {
                // Use the non-approved endpoint for pending validation enrollments
                response = await getAllNonApprovedEnrollments();
                console.log('Non-approved enrollments data received:', response); // Debug log
            } else {
                // Use the all enrollments endpoint to get all enrollments
                response = await getAllEnrollments();
                console.log('All enrollments data received:', response); // Debug log
            }
            
            setEnrollmentData(response);
            setFilteredEnrollments(response); // Initialize filtered enrollments
            setTotalPages(Math.ceil(response.length / 10)); // Assuming 10 items per page
            setError(null);
        } catch (err) {
            console.error('Error fetching enrollments:', err);
            
            // Provide more specific error information
            let errorMessage = 'Failed to load enrollments: ';
            
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

    // New function to fetch all programs for the filter
    const fetchAllPrograms = async () => {
        try {
            const programs = await getAllPrograms();
            // Extract program names and filter out any null/undefined values
            const programNames = [...new Set(programs.map(program => program.programName))].filter(name => name);
            setAllProgramNames(programNames);
        } catch (err) {
            console.error('Error fetching all programs:', err);
            // Even if we can't fetch all programs, we can still use the ones from enrollments
        }
    };

    const handleSelectEnrollment = (id) => {
        setSelectedEnrollments((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((enrollmentId) => enrollmentId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = currentEnrollments.map(enrollment => enrollment.id);
            setSelectedEnrollments(allIds);
        } else {
            setSelectedEnrollments([]);
        }
    };

    const isAllSelected = selectedEnrollments.length === currentEnrollments.length && currentEnrollments.length > 0;

    const actionButtonStyle = "py-2 px-4 rounded-md border transition-colors duration-200"

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
        setModalData({});
    };

    const handleConfirm = () => {
        if (modalData.onConfirm) {
            modalData.onConfirm();
        }
        closeConfirmModal();
    };

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const previousBtnColor = isFirstPage ? 'text-[#999999]' : 'text-[#1E1E1E]';
    const nextBtnColor = isLastPage ? 'text-[#999999]' : 'text-[#1E1E1E]';

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestion des Inscriptions</h2>
                        <p className="text-gray-600 mt-1">Gérez les inscriptions des étudiants</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="w-full h-1 bg-[#101957] my-8"></div>
                <div>Loading enrollments...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestion des Inscriptions</h2>
                        <p className="text-gray-600 mt-1">Gérez les inscriptions des étudiants</p>
                    </div>
                </div>
                <div className="w-full h-1 bg-[#101957] my-8"></div>
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    // Get unique program names from enrollments (fallback if allProgramNames is empty)
    const uniqueProgramNames = allProgramNames.length > 0 ? allProgramNames : 
        [...new Set(enrollmentData.map(enrollment => enrollment.programName))].filter(name => name);
    
    // Get unique statuses for the filter dropdown
    const uniqueStatuses = [...new Set(enrollmentData.map(enrollment => mapApiStatusToDisplay(enrollment.status)))].filter(status => status);

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
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des Inscriptions</h2>
                    <p className="text-gray-600 mt-1">Gérez les inscriptions des étudiants</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="h-10 w-64 bg-gray-200 rounded"></div>
                </div>
            </div>

            <div className="w-full h-1 bg-[#101957] my-8"></div>

            {/* Tab Navigation */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => {
                                setActiveTab('all');
                                setCurrentPage(1); // Reset to first page when changing tabs
                            }}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'all'
                                    ? 'border-[#101957] text-[#101957]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Toutes les inscriptions
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('pending');
                                setCurrentPage(1); // Reset to first page when changing tabs
                            }}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'pending'
                                    ? 'border-[#101957] text-[#101957]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Inscriptions en attente de validation
                        </button>
                    </nav>
                </div>
            </div>

            {/* Filter Section */}
            <div className="mb-6 flex flex-wrap gap-4">
                {/* Only show status filter on "Toutes les inscriptions" tab */}
                {activeTab === 'all' && (
                    <div className="relative">
                        <select
                            value={selectedStatus || ''}
                            onChange={(e) => setSelectedStatus(e.target.value || null)}
                            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Tous les statuts</option>
                            {/* Populate with unique status values from the data */}
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                )}
                
                <div className="relative">
                    <select
                        value={selectedMajor || 'Toutes les formations'}
                        onChange={(e) => setSelectedMajor(e.target.value || null)}
                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
                    >
                        <option value="Toutes les formations">Toutes les formations</option>
                        {/* Populate with unique program names */}
                        {uniqueProgramNames.map(programName => (
                            <option key={programName} value={programName}>{programName}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Table Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#B6B8CB]">
                            <tr>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={isAllSelected}
                                        className="w-4 h-4"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">ID Inscription</th>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">Nom Étudiant</th>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">Formation</th>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">Date Soumission</th>
                                <th className="px-6 py-3 text-left text-white text-sm font-bold tracking-wider border-r border-white">Statut</th>
                                <th className="px-6 py-3 text-center text-white text-sm font-bold tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentEnrollments.map((enrollment) => (
                                <tr key={enrollment.id} className={selectedEnrollments.includes(enrollment.id) ? 'bg-gray-100' : 'hover:bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedEnrollments.includes(enrollment.id)}
                                            onChange={() => handleSelectEnrollment(enrollment.id)}
                                            className="w-4 h-4"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 font-medium">{enrollment.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                        {enrollment.personalInfo ? `${enrollment.personalInfo.firstName} ${enrollment.personalInfo.lastName}` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                        {enrollment.programName || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                        {enrollment.submissionDate ? new Date(enrollment.submissionDate).toLocaleString('fr-FR') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            enrollment.status === 'PENDING_VALIDATION' ? 'bg-yellow-100 text-yellow-800' :
                                            enrollment.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                            enrollment.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            enrollment.status === 'ENROLLED' ? 'bg-green-100 text-green-800' :
                                            enrollment.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' :
                                            enrollment.status === 'CORRECTIONS_REQUIRED' ? 'bg-purple-100 text-purple-800' :
                                            enrollment.status === 'PENDING_PAYMENT' ? 'bg-orange-100 text-orange-800' :
                                            enrollment.status === 'PENDING_PROGRAM_PAYMENT' ? 'bg-indigo-100 text-indigo-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {mapApiStatusToDisplay(enrollment.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => onViewDetails(enrollment)}
                                            className="py-1 px-3 rounded-md bg-white text-gray-500 border text-sm transition-all duration-200
                                            hover:bg-gray-100 hover:border-gray-500 hover:text-gray-500
                                            active:bg-gray-200 active:border-blue-700 active:text-blue-700"
                                            style={{ borderColor: '#999999', borderWidth: '0.7px' }}>
                                            Voir les Détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Section - Only show when there are more than 10 items */}
            {filteredEnrollments.length > 10 && (
                <div className="flex justify-end items-center mt-4">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button 
                            onClick={handlePrevious}
                            disabled={isFirstPage}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${isFirstPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Précédent
                        </button>
                        <button 
                            onClick={handleNext}
                            disabled={isLastPage}
                            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${isLastPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Suivant
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end">
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={handlePrevious}
                                    disabled={isFirstPage}
                                    className={`relative inline-flex items-center px-6 py-3 text-base font-medium bg-transparent border-b border-black/10 rounded-l-md ${previousBtnColor} ${isFirstPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{ gap: '0.3rem' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Précédent
                                </button>
                                
                                {/* Page numbers */}
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNum = index + 1;
                                    // Show first, last, current, and nearby pages
                                    if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`relative inline-flex items-center px-6 py-3 text-base font-medium bg-transparent text-[#1E1E1E] border-b border-black/10 ${currentPage === pageNum ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    }
                                    // Show ellipsis for skipped pages
                                    if (pageNum === 2 && currentPage > 3) {
                                        return (
                                            <span
                                                key="ellipsis-start"
                                                className="relative inline-flex items-center px-6 py-3 text-base font-medium bg-transparent text-[#1E1E1E] border-b border-black/10"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                                        return (
                                            <span
                                                key="ellipsis-end"
                                                className="relative inline-flex items-center px-6 py-3 text-base font-medium bg-transparent text-[#1E1E1E] border-b border-black/10"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                                
                                <button
                                    onClick={handleNext}
                                    disabled={isLastPage}
                                    className={`relative inline-flex items-center px-6 py-3 text-base font-medium bg-transparent border-b border-black/10 rounded-r-md ${nextBtnColor} ${isLastPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{ gap: '0.3rem' }}
                                >
                                    Suivant
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentEnrollmentManagement;