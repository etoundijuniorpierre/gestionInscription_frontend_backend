import Button from '../common/Button';
import { Link } from 'react-router-dom';
import WaveSeparator from '../common/WaveSeparator';
import hangingTags from '/assets/svg/hanging-tags.svg';

const Hero = () => {
    return (
        <section
            className="
                relative
                h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh]
                bg-cover bg-center flex flex-col justify-start text-white
                overflow-hidden
            "
            style={{ backgroundImage: "url('/assets/images/hero-bg.png')" }}
        >
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

            {/* Main Content Block */}
            <div className="
                absolute z-40
                w-full md:w-[752px] xl:w-[752px]
                top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                md:top-24 md:left-24 md:right-auto md:transform-none
                px-6 sm:px-12 md:px-0
                text-center
            ">
                <h1 className="
                    font-roboto font-bold
                    text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[80px]
                    leading-[100%]
                    tracking-[-0.41px]
                    mb-8
                ">
                    Ignite Academy<br/>
                    Quand la curiosité<br/>
                    allume le succès
                </h1>
                <div className="flex justify-center space-x-8 mt-6">
                    <Link to="/register">
                        <Button primary size="lg">S'inscrire</Button>
                    </Link>
                    <Link to="/login">
                        <Button secondary size="lg">Se connecter</Button>
                    </Link>
                </div>
            </div>

            {/* Wave Separator */}
            {/* <div className="absolute bottom-0 left-0 w-full z-20">
                <WaveSeparator />
            </div> */}
            
            {/* Hanging Tags Image */}
            {/* <div className="
                absolute top-[-20%] right-[10%] z-[50]
                h-[40vh] md:h-[50vh] xl:h-[60vh]
                w-auto max-w-[40%]
                overflow-hidden
            ">
                <img
                    src={hangingTags}
                    alt="Decorative Hanging Tags"
                    className="
                        h-full w-auto object-cover object-bottom
                        transform translate-y-1/4
                    "
                />
            </div> */}
        </section>
    );
};

export default Hero;