import Button from './Button';
import { Link } from 'react-router-dom';

// Define program images mapping for consistent imagery across the application
const programImages = {
  // Formation image mappings based on program names
  'Blockchain et Technologies Décentralisées': '/assets/formationsImg/blockChain.webp',
  'Cloud Computing et Architecture des Systèmes Distribués': '/assets/formationsImg/cloud.webp',
  'Communication Digitale et Stratégies de Contenu': '/assets/formationsImg/comDigital.webp',
  'Cybersécurité et Protection des Systèmes d\'Information': '/assets/formationsImg/cyberSecurity.webp',
  'Développement Web et Applications Interactives': '/assets/formationsImg/dev.webp',
  'Design Graphique et Création Visuelle': '/assets/formationsImg/design.jpg',
  'Génie Logiciel et Développement d\'Applications': '/assets/formationsImg/geniLogidevApp.webp',
  'Gestion de Projet et Leadership d\'Équipe': '/assets/formationsImg/projet.png',
  'Intelligence Artificielle et Machine Learning': '/assets/formationsImg/ia.webp',
  'Marketing Digital et Stratégies de Communication en Ligne': '/assets/formationsImg/marketing.jpg',
  'Systèmes Embarqués et Internet des Objets': '/assets/formationsImg/embarqué.png',
};

const CourseCard = ({ image, title, description, link, programCode }) => {
  // Use program-specific image if available, otherwise fallback to provided image or default
  const backgroundImage = programImages[title] || image || '/assets/images/filiere-informatique.jpg';

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border border-blue-200">
      {/* Background image section */}
      <div className="relative h-32 w-full">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        ></div>
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Content section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        {/* Title */}
        <h3 className="text-lg font-bold text-blue-900 mb-3 leading-tight">
          {title}
        </h3>

        {/* Separator line */}
        <div className="border-t border-blue-200 mb-3"></div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
          {description}
        </p>

        {/* Button */}
        <div className="mt-auto">
          <Link to={link} className="block">
            <Button
              tertiary
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              En savoir plus
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;