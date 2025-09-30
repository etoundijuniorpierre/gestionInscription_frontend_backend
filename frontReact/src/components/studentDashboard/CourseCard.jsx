import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define program images mapping for consistent imagery across the application
const programImages = {
  // Formation image mappings based on program names
  'Blockchain et Technologies Décentralisées': '/assets/formationsImg/blockChain .webp',
  'Cloud Computing et Architecture des Systèmes Distribués': '/assets/formationsImg/cloud.webp',
  'Communication Digitale et Stratégies de Contenu': '/assets/formationsImg/comDigital.webp',
  'Cybersécurité et Protection des Systèmes d\'Information': '/assets/formationsImg/cyberSecurity.webp',
  'Développement Web et Applications Interactives': '/assets/formationsImg/dev.webp',
  'Design Graphique et Création Visuelle': '/assets/formationsImg/design.jpg',
  'Génie Logiciel et Développement d\'Applications': '/assets/formationsImg/geniLogidevApp.webp',
  'Gestion de Projet et Leadership d\'Équipe': '/assets/formationsImg/projet.png',
  'Intelligence Artificielle et Machine Learning': '/assets/formationsImg/ia.webp',
  'Marketing Digital et Stratégies de Communication en Ligne': '/assets/formationsImg/marketing.jpg',
  'Science des Données et Analyse Prédictive': '/assets/formationsImg/analyse.webp',
  'Systèmes Embarqués et Internet des Objets': '/assets/formationsImg/embarqué.png',
};

const CourseCard = ({ course, onEnrollClick, onViewDetails }) => {
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
        // Use the provided handler if available, otherwise navigate directly
        if (onViewDetails) {
            onViewDetails(course);
        } else {
            // Navigate to the course detail page using the program code
            if (programCode) {
                navigate(`/courses/${programCode}`);
            } else {
                // Fallback to using the ID if programCode is not available
                navigate(`/courses/${id}`);
            }
        }
    };

    // Use program-specific image if available, otherwise fallback to imageUrl or default
    const backgroundImage = programImages[title] || imageUrl || '/assets/images/default-course.jpg';

    return (
        <div
            className="relative rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col bg-white border border-gray-200 group"
            style={{
                height: '22rem',
            }}
        >
            {/* Background image with overlay */}
            <div className="relative h-32 w-full">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                        backgroundImage: `url(${backgroundImage})`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
            
            {/* Content area */}
            <div className="flex-1 p-4 flex flex-col">
                <h3 
                    className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors"
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
                        className="flex-1 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                        style={{
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '500',
                        }}
                    >
                        Détails
                    </button>
                    
                    <button
                        onClick={handleEnrollment}
                        className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-sm"
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