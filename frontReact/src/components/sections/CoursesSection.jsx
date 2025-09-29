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
        const response = await getAllPrograms();
        
        // Verify and transform the data
        const transformedData = transformProgramData(response.data);
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
      <section
        id="nos-filieres"
        className="relative pt-36 md:pt-44 pb-16 md:pb-24 bg-white mb-[3rem] overflow-visible"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-[#000] text-left mb-12">
            Nos Formations
          </h2>
          <p>Loading programs...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="nos-filieres"
        className="relative pt-36 md:pt-44 pb-16 md:pb-24 bg-white mb-[3rem] overflow-visible"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-[#000] text-left mb-12">
            Nos Formations
          </h2>
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="nos-filieres"
      className="relative pt-36 md:pt-44 pb-16 md:pb-24 bg-white mb-[3rem] overflow-visible"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-[#000] text-left mb-12">
          Nos Formations
        </h2>

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