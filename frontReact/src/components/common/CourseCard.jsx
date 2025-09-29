import Button from './Button';
import { Link } from 'react-router-dom';

const pxToRem = (px) => `${(px / 16).toFixed(2)}rem`;

const CourseCard = ({ image, title, description, link }) => {
  return (
    <div
      className="bg-white overflow-hidden flex flex-col relative"
      style={{
        width: pxToRem(376),
        height: pxToRem(505.78),
        borderRadius: pxToRem(20),
        zIndex: 110,
        boxShadow: 'none',
      }}
    >
      {image && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: pxToRem(20),
          }}
        ></div>
      )}

      <div
        className="relative flex flex-col"
        style={{
          paddingTop: pxToRem(298.78),
          paddingRight: pxToRem(38),
          paddingBottom: pxToRem(40),
          paddingLeft: pxToRem(38),
          height: '100%',

        }}
      >
        <h3
          className="text-[#000000]"
          style={{
            width: pxToRem(300),
            height: pxToRem(29),
            fontFamily: 'Roboto',
            fontWeight: 500,
            fontSize: pxToRem(32),
            lineHeight: '100%',
            letterSpacing: pxToRem(0),
            marginBottom: pxToRem(8),
          }}
        >
          {title}
        </h3>

        <p
          className="text-gray-700"
          style={{
            width: pxToRem(300),
            minHeight: pxToRem(60),
            fontFamily: 'Roboto',
            fontWeight: 400,
            fontSize: pxToRem(20),
            lineHeight: '100%',
            letterSpacing: pxToRem(0),
            verticalAlign: 'middle',
            marginBottom: pxToRem(12),
          }}
        >
          {description}
        </p>

        <div className="" >
          <Link to={link}>
            <Button tertiary size="md">En savoir plus</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;