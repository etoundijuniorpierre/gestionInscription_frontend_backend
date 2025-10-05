import { useState, useEffect } from 'react';
import CourseCard from '../common/CourseCard';
import { getAllPrograms } from '../../services/programService';
import { transformProgramData } from '../../services/verifyProgramData';
const CoursesSection = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const data = await getAllPrograms();
        
        // Verify and transform the data
        const transformedData = transformProgramData(data);
        setPrograms(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to load programs: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <section className="relative pt-36 md:pt-44 pb-16 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 mb-[3rem] overflow-visible">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 bg-clip-text text-transparent mb-4 leading-tight">
              Nos Formations
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
              Découvrez nos programmes d'excellence conçus pour vous préparer aux défis de demain
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des formations...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="nos-filieres"
        className="relative pt-36 md:pt-44 pb-16 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 mb-[3rem] overflow-visible"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 bg-clip-text text-transparent mb-4 leading-tight">
              Nos Formations
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
              Découvrez nos programmes d'excellence conçus pour vous préparer aux défis de demain
            </p>
          </div>
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="nos-filieres"
      className="relative pt-36 md:pt-44 pb-16 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 mb-[3rem] overflow-visible"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-900 bg-clip-text text-transparent mb-4 leading-tight">
            Nos Formations
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
            Découvrez nos programmes d'excellence conçus pour vous préparer aux défis de demain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((course) => (
            <CourseCard
              key={course.id}
              image={course.image}
              title={course.title}
              description={course.description}
              link={course.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;