import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import api from '../services/api';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email: registeredEmail } = location.state || {};

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.length > 1) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);


    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (e.nativeEvent.inputType === 'deleteContentBackward' && index > 0 && !value) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const newCode = pasteData.split('');
      setCode(newCode);
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const verificationCode = code.join('');

    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      setError('Veuillez entrer un code de vérification à 6 chiffres valide.');
      setIsLoading(false);
      return;
    }

    try {

      const response = await api.get(`/auth/activate-account?token=${verificationCode}`);

      console.log('Email verification successful:', response.data);

      navigate('/login');
    } catch (err) {
      console.error('Email verification failed:', err);
      if (err.response) {
        setError(err.response.data.message || 'Échec de la vérification. Veuillez réessayer.');
      } else if (err.request) {
        setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
      } else {
        setError('Une erreur inattendue est survenue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setIsLoading(true);
    try {
      await api.post('/auth/activate-account', { email: registeredEmail });
      alert('Un nouveau code a été envoyé à votre adresse e-mail.');
    } catch (err) {
      console.error('Failed to resend code:', err);
      setError('Impossible de renvoyer le code. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <section
      className="relative flex items-center justify-center py-8 md:py-12 w-full h-full"
      style={{
        backgroundImage: `url('/assets/images/register-bg.png'), linear-gradient(to right, #EFEFEF, #EFEFEF)`,
        backgroundSize: '60% 100%, 40% 100%',
        backgroundPosition: 'left center, right center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div
        className="relative z-10 bg-white rounded-lg shadow-xl overflow-hidden"
        style={{
          width: '45vw',
          height: '52vh',
          borderRadius: '1.5rem',
          boxShadow: '0px 0px 0.77rem 0px rgba(0, 0, 0, 0.25)',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          marginRight: '1.80vw',
        }}
      >
        <div
          className="hidden md:block bg-cover bg-center absolute"
          style={{
            backgroundImage: `linear-gradient(95deg, transparent calc(100% - 1.80px), #d0d0d0 calc(100% - 1.80px)), url('/assets/images/register-bg-2.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '22.5vw',
            height: '49vh',
            top: '0.8rem',
            left: '0.8rem',
            borderRadius: '1.2rem',
          }}
        >
        </div>

        <div
          className="p-[1.35rem] md:p-[2.25rem]"
          style={{
            paddingLeft: 'calc(22.5vw + 0.8rem + 2.25rem)',
          }}
        >
          <div className="flex justify-between items-center mb-[1rem]">
            <Link to="/register" className="flex items-center text-gray-700 text-[0.85rem] hover:text-[#2A3B7C]">
              <svg className="w-[0.9rem] h-[0.9rem] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Retour
            </Link>
            <div className="relative inline-block text-gray-700">
              <select
                className="block appearance-none bg-white border border-gray-300 rounded-[0.30rem] py-[0.40rem] pl-[0.60rem] pr-[1.60rem] shadow-sm focus:outline-none focus:ring-[#2A3B7C] focus:border-[#2A3B7C] text-[0.75rem]" // Slightly smaller select
              >
                <option value="fr">🇫🇷 FR</option>
                <option value="en">🇬🇧 EN</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-[0.85rem] w-[0.85rem]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                </svg>
              </div>
            </div>
          </div>

          <h2
            className="text-gray-800 text-center mb-[0.6rem]"
            style={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '1.6rem',
              lineHeight: '150%',
              letterSpacing: '0.02rem',
            }}
          >
            Vérifiez votre e-mail
          </h2>

          <p className="text-center text-gray-600 text-[0.8rem] mb-[1.2rem]">
            Un code à six chiffres a été envoyé à l'adresse e-mail que vous avez fournie. Veuillez le saisir dans l'espace prévu ci-dessous.
          </p>

          {error && (
            <p className="text-red-500 text-center text-[0.75rem] mb-[0.8rem]">{error}</p>
          )}

          <form className="space-y-[1rem]" onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-[0.5rem]">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  ref={el => inputRefs.current[index] = el}
                  className="w-[2.2rem] h-[2.5rem] text-center text-gray-700 border border-gray-300 rounded-[0.3rem] focus:outline-none focus:border-[#2A3B7C] focus:ring-1 focus:ring-[#2A3B7C] text-[1.2rem] font-bold"
                  style={{ MozAppearance: 'textfield' }}
                />
              ))}
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
                marginTop: '1.2rem',
              }}
            >
              {isLoading ? 'Vérification...' : 'Continuer'}
            </Button>
          </form>

          <p className="text-center text-gray-600 text-[0.75rem] mt-[1rem]">
            Vous n'avez pas reçu le code ?{' '}
            <Link
              to="#"
              onClick={handleResendCode}
              className="text-[#2A3B7C] hover:text-[#3B4C8D] font-bold"
              disabled={isLoading}
            >
              Renvoyer le code
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmailPage;