import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProgramByCode } from '../../services/programService';
import { useAuth } from '../../hooks/useAuth';

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

const StudentCourseDetail = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [courseName]);

  const handleEnroll = () => {
    if (isAuthenticated && course) {
      // Navigate to the student dashboard with the course data for enrollment
      navigate('/dashboard', { state: { courseForEnrollment: course } });
    } else {
      navigate('/login');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur : </strong>
          <span className="block sm:inline">Impossible de récupérer les données du cours.</span>
        </div>
        <div className="mt-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">404 : </strong>
          <span className="block sm:inline">Cours non trouvé</span>
        </div>
        <div className="mt-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Retour au tableau de bord
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
  const backgroundImage = programImages[course.programName] || course.image || '/assets/images/default-course.jpg';

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
                    <span className="font-medium text-gray-700">Frais de scolarité:</span>
                    <span className="text-gray-900 font-semibold">{course.price} FCFA</span>
                  </div>
                  
                  {/* Registration dates */}
                  {(course.registrationStartDate || course.registrationEndDate) && (
                    <div className="pb-2 border-b border-gray-200">
                      <span className="font-medium text-gray-700 block mb-2">Dates d'inscription:</span>
                      <div className="text-gray-900">
                        {course.registrationStartDate && (
                          <div className="flex justify-between">
                            <span>Début:</span>
                            <span>{new Date(course.registrationStartDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                        {course.registrationEndDate && (
                          <div className="flex justify-between">
                            <span>Fin:</span>
                            <span>{new Date(course.registrationEndDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="font-medium text-gray-700">Statut:</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      course.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                  >
                    S'inscrire à cette formation
                  </button>
                  
                  <button
                    onClick={handleBack}
                    className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300"
                  >
                    Retour au tableau de bord
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

export default StudentCourseDetail;