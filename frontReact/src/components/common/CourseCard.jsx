import Button from './Button';
import { Link } from 'react-router-dom';

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

const pxToRem = (px) => `${(px / 16).toFixed(2)}rem`;

const CourseCard = ({ image, title, description, link, programCode }) => {
  // Use program-specific image if available, otherwise fallback to provided image or default
  const backgroundImage = programImages[title] || image || '/assets/images/Filière.png';

  return (
    <div
      className="bg-white overflow-hidden flex flex-col relative group"
      style={{
        width: '100%',
        height: pxToRem(505.78),
        borderRadius: pxToRem(20),
        zIndex: 110,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          borderRadius: pxToRem(20),
        }}
      ></div>
      
      {/* Overlay gradient for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
        style={{ borderRadius: pxToRem(20) }}
      ></div>

      <div
        className="relative flex flex-col justify-end"
        style={{
          padding: `${pxToRem(40)} ${pxToRem(38)} ${pxToRem(40)} ${pxToRem(38)}`,
          height: '100%',
        }}
      >
        <h3
          className="text-white mb-3"
          style={{
            fontFamily: 'Roboto',
            fontWeight: 700,
            fontSize: pxToRem(28),
            lineHeight: '1.2',
            letterSpacing: '0',
          }}
        >
          {title}
        </h3>

        <p
          className="text-gray-200 mb-6"
          style={{
            fontFamily: 'Roboto',
            fontWeight: 400,
            fontSize: pxToRem(18),
            lineHeight: '1.5',
            letterSpacing: '0',
          }}
        >
          {description}
        </p>

        <div className="w-full">
          <Link to={link}>
            <Button 
              tertiary 
              size="md"
              className="w-full bg-white text-blue-700 hover:bg-gray-100 font-medium py-3 transition-all duration-300"
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