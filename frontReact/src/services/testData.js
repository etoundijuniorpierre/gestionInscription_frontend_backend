// Sample backend response data structure for reference
export const sampleBackendPrograms = [
  {
    "id": 1,
    "programName": "Computer Science",
    "programCode": "CS101",
    "description": "Learn the fundamentals of computer science and programming.",
    "registrationFee": 100.00,
    "maxCapacity": 50,
    "registrationStartDate": "2023-09-01",
    "registrationEndDate": "2023-12-31",
    "image": "/assets/images/informatique.png",
    "duration": 12,
    "price": 2000.00,
    "learnModules": [
      {
        "id": 1,
        "moduleName": "Introduction to Programming",
        "moduleDescription": "Basic programming concepts",
        "moduleOrder": 1
      }
    ]
  },
  {
    "id": 2,
    "programName": "Mathematics",
    "programCode": "MATH202",
    "description": "Advanced mathematical concepts and applications.",
    "registrationFee": 75.00,
    "maxCapacity": 40,
    "registrationStartDate": "2023-09-01",
    "registrationEndDate": "2023-12-31",
    "image": "/assets/images/mathematique.png",
    "duration": 12,
    "price": 1800.00,
    "learnModules": []
  }
];

// Expected frontend data structure after transformation
export const expectedFrontendCourses = sampleBackendPrograms.map(program => ({
  id: program.id,
  image: program.image || '/assets/images/filiere-informatique.jpg',
  title: program.programName,
  description: program.description,
  link: `/courses/${program.programCode}`,
}));