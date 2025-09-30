import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, onEnrollClick }) => {
    const navigate = useNavigate();
    const { id, title, description, imageUrl, programCode } = course;

    // Truncate description to a reasonable length for the card
    const truncateDescription = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleEnrollment = () => {
        onEnrollClick(course);
    };

    const handleViewDetails = () => {
        // Navigate to the course detail page using the program code
        if (programCode) {
            navigate(`/courses/${programCode}`);
        } else {
            // Fallback to using the ID if programCode is not available
            navigate(`/courses/${id}`);
        }
    };

    return (
        <div
            className="relative rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 flex flex-col bg-white border border-gray-200"
            style={{
                height: '22rem',
                borderRadius: '0.75rem',
            }}
        >
            {/* Background image */}
            <div
                className="h-32 w-full bg-cover bg-center"
                style={{ 
                    backgroundImage: `url(${imageUrl || '/assets/images/default-course.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                role="img"
                aria-label={`Image de fond pour le cours ${title}`}
            />
            
            {/* Content area */}
            <div className="flex-1 p-4 flex flex-col">
                <h3 
                    className="font-bold text-lg text-gray-800 mb-2"
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: '700',
                        fontSize: '1.125rem',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {title}
                </h3>
                
                <p 
                    className="text-gray-600 text-sm mb-4 flex-1"
                    style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: '400',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {truncateDescription(description, 120)}
                </p>
                
                <div className="flex space-x-2 mt-auto">
                    <button
                        onClick={handleViewDetails}
                        className="flex-1 py-2 px-3 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                        style={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '500',
                        }}
                    >
                        Détails
                    </button>
                    
                    <button
                        onClick={handleEnrollment}
                        className="flex-1 py-2 px-3 rounded-md bg-[#101957] text-white text-sm font-medium hover:bg-[#1a2685] transition-colors duration-200"
                        style={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '500',
                        }}
                    >
                        Inscription
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;