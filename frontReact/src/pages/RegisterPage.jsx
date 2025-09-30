import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import api from '../services/api';

const pxToRem = (px) => `${(px / 16).toFixed(2)}rem`;

const RegisterPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError('Vous devez accepter les termes et conditions.');
      setIsLoading(false);
      return;
    }

    // Display the registration data being sent
    const registrationData = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
      roleName: 'STUDENT',
    };

    try {
      const response = await api.post('/auth/signup', {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
        roleName: 'STUDENT',
      });

      console.log('Registration response:', response.data);
      
      navigate('/verify-email', { state: { email: email } });
    } catch (err) {
      console.error('Registration failed:', err);
      if (err.response) {
        if (err.response.status === 409) {
          setError('Cet email est déjà enregistré. Veuillez vous connecter ou utiliser un autre email.');
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Échec de l\'inscription. Veuillez réessayer.');
        }
      } else if (err.request) {
        setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
      } else {
        setError('Une erreur inattendue est survenue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <section
      className="relative flex items-center justify-center w-full h-full"
      style={{
        backgroundImage: `url('/assets/images/register-bg.png'), linear-gradient(to right, #EFEFEF, #EFEFEF)`,
        backgroundSize: '60% 100%, 40% 100%',
        backgroundPosition: 'left center, right center',
        backgroundRepeat: 'no-repeat',
        paddingTop: '1.48rem',
        paddingBottom: '1.48rem',
      }}
    >
      <div
        className="relative z-10 bg-white rounded-lg shadow-xl overflow-hidden"
        style={{
          width: '50vw',
          height: '61.36vh',
          borderRadius: '1.93rem',
          boxShadow: '0px 0px 0.77rem 0px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div
          className="hidden md:block bg-cover bg-center absolute"
          style={{
            backgroundImage: `linear-gradient(95deg, transparent calc(100% - 1.80px), #d0d0d0 calc(100% - 1.80px)), url('/assets/images/register-bg-2.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '25.70vw',
            height: '59.69vh',
            top: '0.45rem',
            left: '0.48rem',
            borderRadius: '1.81rem',
          }}
        >
        </div>

        <div
          style={{
            paddingTop: '1.35rem',
            paddingRight: '1.35rem',
            paddingBottom: '2.70rem',
            paddingLeft: '1.35rem',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: 'calc(50vw - 25.70vw - 0.48rem)',
            left: 'calc(25.70vw + 0.48rem)',
            '@media (max-width: 767px)': {
              width: '100%',
              left: 0,
              paddingLeft: '1.35rem',
              paddingRight: '1.35rem',
            },
            '@media (min-width: 768px)': {
              paddingTop: '2.25rem',
              paddingRight: '2.25rem',
              paddingBottom: '4.50rem',
              paddingLeft: 'calc(25.70vw + 0.48rem + 2.25rem)',
            },
            overflowY: 'auto',
          }}
        >
          <div className="flex justify-end mb-[1.13rem]">
            <div className="relative inline-block text-gray-700">
              <select
                className="block appearance-none bg-white border border-gray-300 rounded-[0.34rem] py-[0.45rem] pl-[0.68rem] pr-[1.80rem] shadow-sm focus:outline-none focus:ring-[#2A3B7C] focus:border-[#2A3B7C] text-[0.79rem]"
              >
                <option value="fr">🇫🇷 FR</option>
                <option value="en">🇬🇧 EN</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-[0.90rem] w-[0.90rem]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                </svg>
              </div>
            </div>
          </div>

          <h2
            className="text-gray-800 text-center mb-[0.90rem]"
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '1.80rem',
              lineHeight: '150%',
              letterSpacing: '0.02rem',
            }}
          >
            Créer votre compte étudiant
          </h2>

          {error && (
            <p className="text-red-500 text-center text-[0.79rem] mb-[0.90rem]">{error}</p>
          )}

          <form className="space-y-[1.13rem]" onSubmit={handleSubmit}>
            <div className="flex justify-between" style={{ gap: '1.13rem' }}>
              <div className="relative flex-1">
                <label
                  htmlFor="lastName"
                  className="absolute text-gray-700 text-[0.79rem]"
                  style={{
                    top: '-0.68rem',
                    left: '0.72rem',
                    backgroundColor: 'white',
                    padding: '0 0.18rem',
                    fontSize: '0.72rem',
                    zIndex: 10,
                  }}
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Entrez votre nom"
                  className="shadow appearance-none border text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  style={{
                    width: '100%',
                    height: '2.15rem',
                    borderTopLeftRadius: '0.15rem',
                    borderTopRightRadius: '0.15rem', 
                    paddingTop: '0.63rem',
                    paddingBottom: '0.45rem',
                    paddingLeft: '0.72rem',
                    paddingRight: '0.72rem',
                  }}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="relative flex-1">
                <label
                  htmlFor="firstName"
                  className="absolute text-gray-700 text-[0.79rem]"
                  style={{
                    top: '-0.68rem',
                    left: '0.72rem',
                    backgroundColor: 'white',
                    padding: '0 0.18rem',
                    fontSize: '0.72rem',
                    zIndex: 10,
                  }}
                >
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Entrez votre prénom"
                  className="shadow appearance-none border text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  style={{
                    width: '100%',
                    height: '2.15rem',
                    borderTopLeftRadius: '0.15rem',
                    borderTopRightRadius: '0.15rem',
                    paddingTop: '0.63rem',
                    paddingBottom: '0.45rem',
                    paddingLeft: '0.72rem',
                    paddingRight: '0.72rem',
                  }}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="email"
                className="absolute text-gray-700 text-[0.79rem]"
                style={{
                  top: '-0.68rem',
                  left: '0.72rem',
                  backgroundColor: 'white',
                  padding: '0 0.18rem',
                  fontSize: '0.72rem',
                  zIndex: 10,
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre email"
                className="shadow appearance-none border text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                style={{
                  width: '100%',
                  height: '2.15rem',
                  borderTopLeftRadius: '0.15rem',
                  borderTopRightRadius: '0.15rem',
                  paddingTop: '0.63rem',
                  paddingBottom: '0.45rem',
                  paddingLeft: '0.72rem',
                  paddingRight: '0.72rem',
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="absolute text-gray-700 text-[0.79rem]"
                style={{
                  top: '-0.68rem',
                  left: '0.72rem',
                  backgroundColor: 'white',
                  padding: '0 0.18rem',
                  fontSize: '0.72rem',
                  zIndex: 10,
                }}
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Entrez votre mot de passe"
                  className="shadow appearance-none border text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-[2.25rem]"
                  style={{
                    width: '100%',
                    height: '2.15rem',
                    borderTopLeftRadius: '0.15rem',
                    borderTopRightRadius: '0.15rem',
                    paddingTop: '0.63rem',
                    paddingBottom: '0.45rem',
                    paddingLeft: '0.72rem',
                    paddingRight: '0.72rem',
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-[0.68rem] text-gray-400 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg className="w-[1.13rem] h-[1.13rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .59-1.874 1.545-3.64 2.898-5.07L4.545 5.545M19.07 19.07a10.05 10.05 0 00.93-2.07c1.274-4.057-2.517-7-7.042-7a10.05 10.05 0 00-2.07-.93M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg className="w-[1.13rem] h-[1.13rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="absolute text-gray-700 text-[0.79rem]"
                style={{
                  top: '-0.68rem',
                  left: '0.72rem',
                  backgroundColor: 'white',
                  padding: '0 0.18rem',
                  fontSize: '0.72rem',
                  zIndex: 10,
                }}
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                  className="shadow appearance-none border text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-[2.25rem]"
                  style={{
                    width: '100%',
                    height: '2.15rem',
                    borderTopLeftRadius: '0.15rem',
                    borderTopRightRadius: '0.15rem',
                    paddingTop: '0.63rem',
                    paddingBottom: '0.45rem',
                    paddingLeft: '0.72rem',
                    paddingRight: '0.72rem',
                  }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-[0.68rem] text-gray-400 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <svg className="w-[1.13rem] h-[1.13rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .59-1.874 1.545-3.64 2.898-5.07L4.545 5.545M19.07 19.07a10.05 10.05 0 00.93-2.07c1.274-4.057-2.517-7-7.042-7a10.05 10.05 0 00-2.07-.93M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg className="w-[1.13rem] h-[1.13rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center mt-[0.90rem]">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="form-checkbox h-[0.90rem] w-[0.90rem] text-[#2A3B7C] rounded"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms" className="ml-[0.45rem] text-gray-700 text-[0.79rem]">
                J'accepte les{' '}
                <Link to="/terms" className="text-[#2A3B7C] hover:underline font-bold">
                  termes ou conditions
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: '2.15rem',
                backgroundColor: '#101957',
                borderRadius: '0.23rem',
                paddingTop: '0.31rem',
                paddingRight: '0.61rem',
                paddingBottom: '0.31rem',
                paddingLeft: '0.61rem',
              }}
            >
              {isLoading ? 'Inscription...' : 'S\'inscrire'}
            </Button>
          </form>

          <div className="relative flex items-center py-[0.68rem]">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-[0.90rem] text-gray-500">ou inscrivez-vous avec</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col space-y-[0.68rem] sm:flex-row sm:space-y-0 sm:space-x-[0.90rem] mt-[0.45rem]">
            <button
              className="flex items-center justify-center shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
              type="button"
              style={{
                width: '100%',
                height: '35.57px',
                borderRadius: '0.26rem',
                border: '0.04rem solid #999999',
                paddingTop: '0.26rem',
                paddingRight: '2.39rem',
                paddingBottom: '0.26rem',
                paddingLeft: '2.39rem',
                gap: '0.17rem',
              }}
            >
              <img src="/assets/images/google-icon.png" alt="Google Icon" className="w-[2.25rem] h-[2.25rem]" />
              Google
            </button>
            <button
              className="flex items-center justify-center shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
              type="button"
              style={{
                width: '100%',
                height: '35.57px',
                borderRadius: '0.26rem',
                border: '0.04rem solid #999999',
                paddingTop: '0.26rem',
                paddingRight: '2.39rem',
                paddingBottom: '0.26rem',
                paddingLeft: '2.39rem',
                gap: '0.17rem',
              }}
            >
              <img src="/assets/images/apple-icon.png" alt="Apple Icon" className="w-[2.25rem] h-[2.25rem]" />
              Apple
            </button>
          </div>

          <p className="text-center text-gray-600 text-[0.79rem] mt-[1.35rem]">
            Avez-vous déjà un compte ?{' '}
            <Link to="/login" className="text-[#2A3B7C] hover:text-[#3B4C8D] font-bold">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;