import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getLatestEnrollment, submitEnrollmentForm } from '../../services/enrollmentService';
import CourseCard from './CourseCard.jsx';
import EnrollmentForm from './EnrollmentForm.jsx';
import StudentDashboardStatus from './StudentDashboardStatus.jsx';
import { getAllPrograms } from '../../services/programService';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchIcon = '/assets/svg/search-icon.svg';

const StudentDashboardContent = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayMode, setDisplayMode] = useState('courses');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [latestEnrollment, setLatestEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated, userRole } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchLatestEnrollment = async () => {
            if (isAuthenticated) {
                try {
                    const enrollment = await getLatestEnrollment();
                    setLatestEnrollment(enrollment);
                } catch (err) {
                    console.error("Failed to fetch latest enrollment:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const programs = await getAllPrograms();
                
                // Ensure programs is an array before trying to map
                if (!Array.isArray(programs)) {
                    throw new Error('Les données des formations ne sont pas au format attendu');
                }
                
                const transformedCourses = programs.map(program => ({
                    id: program.id.toString(),
                    title: program.programName,
                    description: program.description,
                    imageUrl: program.image || '/assets/images/default-course.jpg',
                    programCode: program.programCode, // Add programCode for navigation
                    registrationFee: program.registrationFee // Add registrationFee for enrollment form
                }));
                setCourses(transformedCourses);
            } catch (err) {
                setError(err);
                console.error("Failed to fetch courses:", err);
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchLatestEnrollment();
        fetchCourses();
    }, [isAuthenticated]);

    // Check if we should start the enrollment flow based on location state
    useEffect(() => {
        if (location.state && location.state.courseForEnrollment) {
            setSelectedCourse(location.state.courseForEnrollment);
            setDisplayMode('enrollment');
            // Clear the state so it doesn't trigger again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEnrollClick = (course) => {
        setSelectedCourse(course);
        setDisplayMode('enrollment');
    };

    const handleViewCourseDetail = (course) => {
        // Navigate to the course detail page within the student dashboard
        if (course.programCode) {
            navigate(`/dashboard/courses/${course.programCode}`);
        } else {
            navigate(`/dashboard/courses/${course.id}`);
        }
    };

    const handleGoBackToCourses = () => {
        setSelectedCourse(null);
        setDisplayMode('courses');
    };

    const handleFormSubmission = async (formData) => {
        try {
            // Prepare the enrollment data according to the API specification
            const enrollmentData = {
                programId: parseInt(selectedCourse.id),
                personalInfo: {
                    lastName: formData.nom,
                    firstName: formData.prenom,
                    gender: formData.sexe === 'MALE' ? 'MASCULIN' : formData.sexe === 'FEMALE' ? 'FEMININ' : formData.sexe,
                    dateOfBirth: formData.dateNaissance,
                    nationality: formData.nationalite,
                    identityDocumentType: formData.typePieceIdentite,
                    // Optional fields that may not be in the formData
                    identityDocumentNumber: "",
                    issueDate: "",
                    expirationDate: "",
                    placeOfIssue: ""
                },
                academicInfo: {
                    lastInstitution: formData.lastInstitution,
                    specialization: formData.specialization === 'Autre' ? formData.otherSpecialization : formData.specialization,
                    availableForInternship: formData.availableForInternship,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    diplomaObtained: true // Assuming they have a diploma if they're uploading one
                },
                contactDetails: {
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    countryCode: formData.countryCode,
                    country: formData.country,
                    region: formData.region,
                    city: formData.city,
                    address: formData.address
                }
                // Note: The API documentation doesn't show emergency contacts in the enrollmentDtoRequest
                // If they're needed, they might be handled separately or added to contactDetails
            };

            // Extract documents from formData
            const documents = [];
            if (formData.diplome1?.file) documents.push(formData.diplome1.file);
            if (formData.diplome2?.file) documents.push(formData.diplome2.file);
            if (formData.cniRecto?.file) documents.push(formData.cniRecto.file);
            if (formData.cniVerso?.file) documents.push(formData.cniVerso.file);
            if (formData.acteNaissance?.file) documents.push(formData.acteNaissance.file);
            if (formData.photoIdentite?.file) documents.push(formData.photoIdentite.file);
            if (formData.cv?.file) documents.push(formData.cv.file);
            if (formData.lettreMotivation?.file) documents.push(formData.lettreMotivation.file);

            // Submit the enrollment form
            const response = await submitEnrollmentForm(enrollmentData, documents);
            
            // Show success message
            alert("Votre dossier d'inscription a été soumis avec succès!");
            
            // Refresh the latest enrollment status
            try {
                const updatedEnrollment = await getLatestEnrollment();
                setLatestEnrollment(updatedEnrollment);
            } catch (err) {
                console.error("Failed to fetch updated enrollment:", err);
            }
            
            // Go back to courses view
            handleGoBackToCourses();
        } catch (error) {
            console.error("Error submitting enrollment form:", error);
            
            // Provide more specific error information
            let errorMessage = "Une erreur s'est produite lors de la soumission de votre dossier. Veuillez réessayer.";
            
            if (error.response) {
                // Server responded with error status
                if (error.response.status === 500) {
                    // For 500 errors, provide more detailed information
                    errorMessage = `Erreur interne du serveur (500). Ceci est une erreur côté serveur. Veuillez contacter l'administrateur du système. ${error.response.data?.message ? '\n\nDétails: ' + error.response.data.message : ''}`;
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = `Erreur du serveur: ${error.response.data.message}`;
                } else {
                    errorMessage = `Erreur ${error.response.status}: ${error.response.statusText}`;
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = "Impossible de contacter le serveur. Veuillez vérifier votre connexion internet.";
            } else {
                // Something else happened
                errorMessage = `Erreur: ${error.message}`;
            }
            
            alert(errorMessage);
        }
    };

    if (loading || coursesLoading) {
        return <div className="p-8">Chargement...</div>;
    }

    if (error) {
        return <div className="p-8">Erreur: {error.message}</div>;
    }

    return (
        <div className="p-8">
            {displayMode === 'courses' ? (
                <>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Nos Formations</h2>
                        
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Rechercher une formation..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full md:w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <img 
                                src={SearchIcon} 
                                alt="Search" 
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                            />
                        </div>
                    </div>

                    <StudentDashboardStatus enrollment={latestEnrollment} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {filteredCourses.map((course) => (
                            <CourseCard 
                                key={course.id}
                                course={course}
                                onEnrollClick={handleEnrollClick}
                                onViewDetails={() => handleViewCourseDetail(course)}
                            />
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Aucune formation trouvée.</p>
                        </div>
                    )}
                </>
            ) : (
                <EnrollmentForm 
                    course={selectedCourse} 
                    onFormSubmitted={handleFormSubmission} 
                />
            )}
        </div>
    );
};

export default StudentDashboardContent;