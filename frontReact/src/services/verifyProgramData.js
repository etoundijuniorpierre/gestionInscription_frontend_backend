// This script can be used to verify that the backend data structure matches frontend expectations

export const verifyProgramDataStructure = (programs) => {
  console.log('Verifying program data structure...');
  
  // Check if programs is an array
  if (!Array.isArray(programs)) {
    console.error('Expected programs to be an array');
    return false;
  }
  
  // Check each program for required fields
  for (let i = 0; i < programs.length; i++) {
    const program = programs[i];
    
    // Required fields check
    const requiredFields = ['id', 'programName', 'programCode', 'description'];
    for (const field of requiredFields) {
      if (!(field in program)) {
        console.error(`Missing required field '${field}' in program at index ${i}`);
        return false;
      }
    }
    
    // Type checks
    if (typeof program.id !== 'number') {
      console.error(`Expected 'id' to be a number in program at index ${i}`);
      return false;
    }
    
    if (typeof program.programName !== 'string') {
      console.error(`Expected 'programName' to be a string in program at index ${i}`);
      return false;
    }
    
    if (typeof program.programCode !== 'string') {
      console.error(`Expected 'programCode' to be a string in program at index ${i}`);
      return false;
    }
    
    if (typeof program.description !== 'string') {
      console.error(`Expected 'description' to be a string in program at index ${i}`);
      return false;
    }
    
    // Optional fields check (if present, verify types)
    if ('image' in program && program.image !== null && typeof program.image !== 'string') {
      console.error(`Expected 'image' to be a string or null in program at index ${i}`);
      return false;
    }
  }
  
  console.log('All programs passed verification');
  return true;
};

// Function to transform backend data to frontend format with validation
export const transformProgramData = (programs) => {
  if (!verifyProgramDataStructure(programs)) {
    throw new Error('Program data structure verification failed');
  }
  
  return programs.map(program => ({
    id: program.id,
    image: program.image || '/assets/images/filiere-informatique.jpg',
    title: program.programName,
    description: program.description,
    link: `/courses/${program.programCode}`,
  }));
};