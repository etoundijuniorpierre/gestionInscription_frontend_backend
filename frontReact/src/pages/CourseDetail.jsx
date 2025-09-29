import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProgramByCode } from '../services/programService';

const programImages = {
  'HIS_101': '/assets/images/histoire.png',
  'MAT_201': '/assets/images/mathematique.png',
  'CHI_102': '/assets/images/chimie.png',
  'INF_302': '/assets/images/informatique.png',
  'PHYS_201': '/assets/images/physique.png',
  'ENG_202': '/assets/images/anglais.png',
};

const CourseDetail = () => {
  const { courseName } = useParams();
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

  if (loading) {
    return <div className="text-center py-20">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center py-20">Erreur : Impossible de récupérer les données du cours.</div>;
  }

  if (!course) {
    return <div className="text-center py-20">404 : Cours non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img 
            src={programImages[course.programCode] || '/assets/images/default-course.jpg'} 
            alt={course.programName}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center px-4">{course.programName}</h1>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Détails</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Code:</span>
                  <span className="text-gray-900">{course.programCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Durée:</span>
                  <span className="text-gray-900">{course.duration} mois</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Frais d'inscription:</span>
                  <span className="text-gray-900">{course.registrationFee} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Prix:</span>
                  <span className="text-gray-900">{course.price} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Capacité maximale:</span>
                  <span className="text-gray-900">{course.maxCapacity} étudiants</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Modules d'apprentissage</h2>
              {course.learnModules && course.learnModules.length > 0 ? (
                <div className="space-y-4">
                  {course.learnModules.map((module, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-bold text-lg text-gray-800">{module.moduleName}</h3>
                      <p className="text-gray-600 mt-2">{module.moduleDescription}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun module disponible pour cette formation.</p>
              )}
              
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Dates importantes</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Début des inscriptions:</span>
                    <span className="text-gray-900">{new Date(course.registrationStartDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Fin des inscriptions:</span>
                    <span className="text-gray-900">{new Date(course.registrationEndDate).toLocaleDateString('fr-FR')}</span>
                  </div>
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