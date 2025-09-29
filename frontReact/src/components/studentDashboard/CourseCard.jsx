import React from 'react';

const CourseCard = ({ course, onEnrollClick }) => {
    const { title, description, imageUrl, id } = course;

    const handleEnrollment = () => {
        onEnrollClick(course);
    };

    return (
        <div
            className="relative rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105"
            style={{
                height: '18.75rem',
                borderRadius: '0.59rem',
                background: '#FFFFFF',
            }}
        >
            <div
                className="h-full w-full bg-cover bg-center flex items-end justify-start p-0"
                style={{ backgroundImage: `url(${imageUrl})` }}
                role="img"
                aria-label={`Image de fond pour le cours ${title}`}
            >
                <div
                    className="absolute"
                    style={{
                        width: '23rem',
                        height: '7.5rem',
                        top: '10.66rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderRadius: '0.38rem',
                        paddingTop: '0.5rem',
                        paddingRight: '0.75rem',
                        paddingBottom: '0.5rem',
                        paddingLeft: '0.75rem',
                        background: '#0610194D',
                        border: '0.5px solid #FFFFFF4D',
                        backdropFilter: 'blur(0.63rem)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <p style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                        <span
                            style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: '700',
                                fontSize: '1rem',
                                lineHeight: '1',
                                letterSpacing: '0.03125rem',
                                color: 'white',
                            }}
                        >
                            {title}:
                        </span>{' '}
                        <span
                            style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: '400',
                                fontSize: '1rem',
                                lineHeight: '1',
                                letterSpacing: '0.03125rem',
                                color: 'white',
                            }}
                        >
                            {description}
                        </span>
                    </p>

                    <button
                        onClick={handleEnrollment}
                        className="flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6B4F8B] focus:ring-opacity-50"
                        style={{
                            position: 'relative',
                            bottom: '0.6rem',
                            width: '80%',
                            height: '1.69rem',
                            borderRadius: '0.25rem',
                            padding: '0.5rem 1rem',
                            background: '#FFFFFF26',
                            boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
                            border: '0.5px solid rgba(255, 255, 255, 0.15)',
                        }}
                    >
                        <span
                            className="text-white whitespace-nowrap"
                            style={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: '400',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                                letterSpacing: '0.0156rem',
                            }}
                        >
                            Démarrer une inscription
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;