// src/pages/PaymentPage.jsx

import React, { useState } from 'react';
import { createRegistrationFeePaymentLink } from '../services/paymentService';

const PaymentPage = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Cette fonction est appelée lorsque l'utilisateur clique sur le bouton de paiement
    const handlePayment = async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Creating Flutterwave payment link');
            // For demo purposes, using a fixed enrollment ID
            // In a real application, you would get this from context or props
            const enrollmentId = 1; // Replace with actual enrollment ID
            const redirectUrl = window.location.origin + "/payment/success";
            
            const paymentData = {
                enrollmentId: enrollmentId,
                redirectUrl: redirectUrl
            };
            
            // For demo purposes, we'll use registration fee payment
            // In a real application, you would determine the payment type based on enrollment status
            const response = await createRegistrationFeePaymentLink(paymentData);
            console.log('Flutterwave payment link created:', response);

            // Redirect to Flutterwave checkout page
            if (response && response.link) {
                window.location.href = response.link;
            } else {
                throw new Error('Lien de paiement non reçu');
            }
        } catch (err) {
            console.error('Error creating Flutterwave payment link:', err);
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
                disabled={isLoading}
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