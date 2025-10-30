// src/pages/PaymentSuccess.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const query = new URLSearchParams(location.search);
  const status = query.get("status");
  const tx_ref = query.get("tx_ref");
  const transaction_id = query.get("transaction_id");

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      {status === "successful" ? (
        <>
          <h1>🎉 Paiement réussi !</h1>
          <p>Référence de transaction : {tx_ref}</p>
          <p>ID de transaction : {transaction_id}</p>
          <p>Merci pour votre paiement.</p>
        </>
      ) : (
        <>
          <h1>⚠️ Paiement non confirmé</h1>
          <p>Veuillez réessayer ou contacter le support.</p>
        </>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={handleReturnToDashboard}
          style={{
            backgroundColor: '#6772E5',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;