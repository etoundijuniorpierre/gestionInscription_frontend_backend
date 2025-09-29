// src/pages/PaymentPage.jsx

import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { createCheckoutSession } from '../services/paymentService'; // Importez le service

const PaymentPage = () => {
    const stripe = useStripe();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Cette fonction est appelée lorsque l'utilisateur clique sur le bouton de paiement
    const handlePayment = async () => {
        setIsLoading(true);
        setError(null);

        // 1. S'assurer que Stripe.js est bien chargé
        if (!stripe) {
            setError("Stripe.js n'a pas encore été chargé. Veuillez patienter.");
            setIsLoading(false);
            return;
        }

        try {
            // Appeler votre backend pour créer une session de paiement
            const { sessionId } = await createCheckoutSession();

            // Rediriger l'utilisateur vers la page de paiement hébergée par Stripe
            const { error: stripeError } = await stripe.redirectToCheckout({
                sessionId: sessionId
            });

            // Cette partie n'est atteinte que s'il y a une erreur de redirection
            if (stripeError) {
                setError(stripeError.message);
            }
        } catch (err) {
            setError("Impossible de se connecter au service de paiement. Veuillez réessayer plus tard.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Finalisation de l'inscription</h1>
            <p>Pour finaliser votre inscription, veuillez procéder au paiement des frais.</p>

            {/* Le bouton de paiement */}
            <button
                onClick={handlePayment}
                disabled={isLoading || !stripe}
                style={{
                    backgroundColor: '#6772E5',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    opacity: isLoading ? 0.6 : 1
                }}
            >
                {isLoading ? "Chargement..." : "Payer les frais d'inscription"}
            </button>

            {/* Affichage des erreurs */}
            {error && <p style={{ color: 'red', marginTop: '15px' }}>Erreur : {error}</p>}
        </div>
    );
};

export default PaymentPage;