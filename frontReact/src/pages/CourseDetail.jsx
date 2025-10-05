import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProgramByCode } from '../services/programService';
import { useAuth } from '../hooks/useAuth';

// Define program images mapping for consistent imagery across the application
const programImages = {
  // Existing program code mappings
  'HIS_101': '/assets/images/histoire.png',
  'MAT_201': '/assets/images/mathematique.png',
  'CHI_102': '/assets/images/chimie.png',
  'INF_302': '/assets/images/informatique.png',
  'PHYS_201': '/assets/images/physique.png',
  'ENG_202': '/assets/images/anglais.png',
  
  // New formation image mappings based on program names/keywords
  'Computer Science': '/assets/formationsImg/dev.webp',
  'Mathematics': '/assets/images/mathematique.png',
  'Informatique': '/assets/formationsImg/dev.webp',
  'Mathématiques': '/assets/images/mathematique.png',
  'Histoire': '/assets/images/histoire.png',
  'Chimie': '/assets/images/chimie.png',
  'Physique': '/assets/images/physique.png',
  'Anglais': '/assets/images/anglais.png',
  'Développement': '/assets/formationsImg/dev.webp',
  'Programmation': '/assets/formationsImg/dev.webp',
  'Cybersécurité': '/assets/formationsImg/cyberSecurity.webp',
  'Sécurité': '/assets/formationsImg/cyberSecurity.webp',
  'Marketing': '/assets/formationsImg/marketing.jpg',
  'Communication': '/assets/formationsImg/comDigital.webp',
  'Digital': '/assets/formationsImg/comDigital.webp',
  'Cloud': '/assets/formationsImg/cloud.webp',
  'Intelligence Artificielle': '/assets/formationsImg/ia.webp',
  'IA': '/assets/formationsImg/ia.webp',
  'Blockchain': '/assets/formationsImg/blockChain.webp',
  'Design': '/assets/formationsImg/design.jpg',
  'Projet': '/assets/formationsImg/projet.png',
  'Embarqué': '/assets/formationsImg/embarqué.png',
  'Logistique': '/assets/formationsImg/geniLogidevApp.webp',
  'Analyse': '/assets/formationsImg/analyse.webp',
};

const CourseDetail = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await getProgramByCode(courseName);
        setCourse(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseName, isAuthenticated, navigate]);

  const handleEnroll = () => {
    // Redirect to student dashboard for enrollment
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="text-center py-20">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur : </strong>
          <span className="block sm:inline">Impossible de récupérer les données du cours.</span>
        </div>
        <div className="mt-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">404 : </strong>
          <span className="block sm:inline">Cours non trouvé</span>
        </div>
        <div className="mt-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Function to format career prospects as a list
  const formatCareerProspects = (prospects) => {
    if (!prospects) return null;
    
    // Split by common separators and filter out empty items
    const items = prospects
      .split(/[,.;\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    return items;
  };

  const careerProspectsList = formatCareerProspects(course.careerProspects);

  // Determine the background image for the course
  let backgroundImage = programImages[course.programCode];
  
  if (!backgroundImage) {
    // Check if any keyword in the title matches our mapping
    const titleWords = course.programName.toLowerCase().split(' ');
    for (const word of titleWords) {
      const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
      if (programImages[capitalizedWord]) {
        backgroundImage = programImages[capitalizedWord];
        break;
      }
      if (programImages[word]) {
        backgroundImage = programImages[word];
        break;
      }
    }
  }
  
  // Fallback to default image
  backgroundImage = backgroundImage || course.image || '/assets/images/filiere-informatique.jpg';

  return (
    <div className="px-4 py-8 w-full">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <img 
            src={backgroundImage} 
            alt={course.programName}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-start">
            <h1 className="text-3xl md:text-4xl font-bold text-white p-6">{course.programName}</h1>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">{course.description}</p>
              </div>
              
              {/* Career prospects section with modern list styling */}
              {careerProspectsList && careerProspectsList.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Débouchés professionnels</h2>
                  <ul className="space-y-3">
                    {careerProspectsList.map((prospect, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-1">
                          ✓
                        </span>
                        <span className="text-gray-700">{prospect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Certificate name section */}
              {course.certificateName && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Certificat obtenu</h2>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-gray-800 font-medium">{course.certificateName}</p>
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Modules d'apprentissage</h2>
                {course.learnModules && course.learnModules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.learnModules.map((module, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{module.moduleName}</h3>
                        <p className="text-gray-600 text-sm">{module.moduleDescription}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Aucun module disponible pour cette formation.</p>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Détails de la formation</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Code:</span>
                    <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">{course.programCode}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Durée:</span>
                    <span className="text-gray-900">{course.duration} mois</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Frais d'inscription:</span>
                    <span className="text-gray-900 font-semibold">{course.registrationFee} FCFA</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Prix:</span>
                    <span className="text-gray-900 font-semibold">{course.price} FCFA</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Capacité maximale:</span>
                    <span className="text-gray-900">{course.maxCapacity} étudiants</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Dates importantes</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Début des inscriptions:</span>
                      <span className="text-gray-900">{new Date(course.registrationStartDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700">Fin des inscriptions:</span>
                      <span className="text-gray-900">{new Date(course.registrationEndDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col space-y-3">
                  <button
                    onClick={handleBack}
                    className="py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
                  >
                    Retour à l'accueil
                  </button>
                  <button
                    onClick={handleEnroll}
                    className="py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    S'inscrire maintenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;