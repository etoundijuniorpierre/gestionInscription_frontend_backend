import { sampleBackendPrograms, expectedFrontendCourses } from './testData';

describe('Data Mapping Verification', () => {
  test('should correctly map backend program data to frontend course data', () => {
    // Transform backend data to frontend format
    const transformedData = sampleBackendPrograms.map(program => ({
      id: program.id,
      image: program.image || '/assets/images/filiere-informatique.jpg',
      title: program.programName,
      description: program.description,
      link: `/courses/${program.programCode}`,
    }));

    // Verify the transformation matches expected structure
    expect(transformedData).toEqual(expectedFrontendCourses);
    
    // Verify each item has the required properties
    transformedData.forEach(course => {
      expect(course).toHaveProperty('id');
      expect(course).toHaveProperty('image');
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('description');
      expect(course).toHaveProperty('link');
      
      // Verify data types
      expect(typeof course.id).toBe('number');
      expect(typeof course.image).toBe('string');
      expect(typeof course.title).toBe('string');
      expect(typeof course.description).toBe('string');
      expect(typeof course.link).toBe('string');
    });
  });

  test('should use default image when none provided', () => {
    // Create a program without an image
    const programWithoutImage = {
      ...sampleBackendPrograms[0],
      image: null
    };

    const transformedData = [{
      id: programWithoutImage.id,
      image: programWithoutImage.image || '/assets/images/filiere-informatique.jpg',
      title: programWithoutImage.programName,
      description: programWithoutImage.description,
      link: `/courses/${programWithoutImage.programCode}`,
    }];

    expect(transformedData[0].image).toBe('/assets/images/filiere-informatique.jpg');
  });
});