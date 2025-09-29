import React, { useState } from 'react';
import Button from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Veuillez entrer votre adresse e-mail.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/forgot-password', { email });

      console.log('Password reset request successful:', response.data);
      navigate('/verify-email', { state: { email: email } });
    } catch (err) {
      console.error('Password reset request failed:', err);
      if (err.response) {
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Échec de l\'envoi du lien de réinitialisation. Veuillez vérifier votre adresse e-mail.');
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

  return (
    <section
      className="relative bg-cover bg-center flex items-center justify-center w-full py-10"
      style={{ backgroundImage: "url('/assets/images/login-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <div
        className="relative z-10 bg-white rounded-3xl shadow-xl w-full max-w-2xl mx-4 flex flex-col items-center justify-center p-10 gap-8"
      >
        <div className="text-center mb-3">
          <img
            src="/assets/images/padlock.png"
            alt="Padlock Icon"
            className="w-12 h-12 mx-auto"
          />
        </div>

        <h2 className="font-roboto font-medium text-4xl text-gray-800 text-center tracking-wider leading-tight mb-2">
          Mot de passe oublié ?
        </h2>

        <p className="font-roboto text-lg font-normal text-gray-600 text-center tracking-wider mb-4">
          Ne vous inquiétez pas, nous vous enverrons des instructions de réinitialisation
        </p>

        {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}

        <form className="w-full space-y-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Veuillez entrer l'adresse email associée à votre compte"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" primary size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
          </Button>
        </form>

        <div className="flex justify-start w-full mt-3 text-sm">
          <Link to="/login" className="text-gray-600 hover:underline">
            &larr; retour
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;