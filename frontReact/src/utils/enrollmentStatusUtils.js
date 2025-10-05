/**
 * Utility functions for handling enrollment status values
 */

// Map API status values to French display values
export const mapApiStatusToDisplay = (apiStatus) => {
  const statusMap = {
    'IN_PROGRESS': 'Soumis',
    'PENDING': 'Soumis',
    'APPROVED': 'Validé',
    'REJECTED': 'Refusé',
    'CORRECTIONS_REQUIRED': 'Corrections requises'
  };
  
  return statusMap[apiStatus] || apiStatus;
};

// Map French display values to API status values
export const mapDisplayStatusToApi = (displayStatus) => {
  const statusMap = {
    'Soumis': 'PENDING',
    'Validé': 'APPROVED',
    'Refusé': 'REJECTED',
    'Corrections requises': 'CORRECTIONS_REQUIRED',
    'Payé': 'PAID' // Assuming this is a valid status
  };
  
  return statusMap[displayStatus] || displayStatus;
};

// Get status details (text, message, image) for StudentDashboardStatus component
export const getStatusDetails = (status) => {
  const statusDetails = {
    'IN_PROGRESS': {
      text: 'En cours de traitement',
      message: 'Votre dossier d\'inscription est en cours d\'examen par notre équipe administrative. Veuillez patienter pour la validation. Vous serez notifié des mises à jour.',
      image: '/assets/svg/bell-icon.svg'
    },
    'PENDING': {
      text: 'En cours de traitement',
      message: 'Votre dossier d\'inscription est en cours d\'examen par notre équipe administrative. Veuillez patienter pour la validation. Vous serez notifié des mises à jour.',
      image: '/assets/svg/bell-icon.svg'
    },
    'APPROVED': {
      text: 'Félicitations ! Votre inscription est approuvée',
      message: 'Votre dossier a été validé. Vous pouvez maintenant procéder au paiement pour finaliser votre inscription.',
      image: '/assets/svg/book-icon.svg',
      button: {
        text: 'Procéder au paiement',
        action: 'payment'
      }
    },
    'REJECTED': {
      text: 'Inscription Rejetée',
      message: (rejectionReason) => `Votre demande d'inscription a été rejetée. Raison : ${rejectionReason || 'Non spécifiée'}. Vous pouvez recommencer le processus depuis le début.`,
      image: '/assets/svg/mail-icon.svg'
    },
    'CORRECTIONS_REQUIRED': {
      text: 'Corrections requises',
      message: 'Votre dossier d\'inscription nécessite des corrections. Veuillez vérifier la liste des documents et informations à mettre à jour.',
      image: '/assets/svg/settings-icon.svg'
    },
    'PAID': {
      text: 'Inscription Complétée',
      message: 'Votre paiement a été reçu et votre inscription est maintenant complète. Bienvenue !',
      image: '/assets/svg/book-icon.svg'
    }
  };
  
  return statusDetails[status] || {
    text: 'Statut inconnu',
    message: 'Une erreur est survenue lors de la récupération du statut. Veuillez contacter l\'assistance.',
    image: '/assets/svg/help-icon.svg'
  };
};