import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getLatestEnrollment } from '../../services/enrollmentService';
import CourseCard from './CourseCard.jsx';
import EnrollmentForm from './EnrollmentForm.jsx';
import StudentDashboardStatus from './StudentDashboardStatus.jsx';
import { getAllPrograms } from '../../services/programService';

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

    useEffect(() => {
        const fetchLatestEnrollment = async () => {
            if (isAuthenticated) {
                try {
                    const enrollment = await getLatestEnrollment();
                    setLatestEnrollment(enrollment);
                } catch (error) {
                    console.error("Failed to fetch latest enrollment:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchLatestEnrollment();
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCoursesLoading(true);
                const response = await getAllPrograms();
                // Transform API data to match the component's expected format
                const transformedCourses = response.data.map(program => ({
                    id: program.id.toString(),
                    title: program.programName,
                    description: program.description,
                    imageUrl: program.image || '/assets/images/default-course.jpg'
                }));
                setCourses(transformedCourses);
            } catch (err) {
                setError(err);
                console.error("Failed to fetch courses:", err);
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEnrollClick = (course) => {
        setSelectedCourse(course);
        setDisplayMode('enrollment');
    };

    const handleGoBackToCourses = () => {
        setSelectedCourse(null);
        setDisplayMode('courses');
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
                                onEnroll={() => handleEnrollClick(course)}
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
                    selectedCourse={selectedCourse} 
                    onGoBack={handleGoBackToCourses} 
                />
            )}
        </div>
    );
};

export default StudentDashboardContent;