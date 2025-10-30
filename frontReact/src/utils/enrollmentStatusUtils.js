/**
 * Utility functions for handling enrollment status values
 */

// Map API status values to French display values
export const mapApiStatusToDisplay = (apiStatus) => {
  const statusMap = {
    'DRAFT': 'Brouillon',
    'SUBMITTED': 'Soumis',
    'PENDING_PAYMENT': 'En attente de paiement',
    'PAYMENT_IN_PROGRESS': 'Paiement en cours',
    'PENDING_VALIDATION': 'En attente de validation',
    'PENDING_PROGRAM_PAYMENT': 'En attente de paiement du programme',
    'APPROVED': 'Validé',
    'REJECTED': 'Refusé',
    'CORRECTIONS_REQUIRED': 'Corrections requises',
    'CANCELLED': 'Annulé',
    'ENROLLED': 'Inscrit', // Add the missing ENROLLED status
    // For backward compatibility
    'IN_PROGRESS': 'En cours',
    'PENDING': 'Soumis',
    'DOCUMENTS_UNDER_REVIEW': 'Documents en révision'
  };
  
  return statusMap[apiStatus] || apiStatus;
};

// Map French display values to API status values
export const mapDisplayStatusToApi = (displayStatus) => {
  const statusMap = {
    'Brouillon': 'DRAFT',
    'Soumis': 'SUBMITTED',
    'En attente de paiement': 'PENDING_PAYMENT',
    'Paiement en cours': 'PAYMENT_IN_PROGRESS',
    'En attente de validation': 'PENDING_VALIDATION',
    'En attente de paiement du programme': 'PENDING_PROGRAM_PAYMENT',
    'Validé': 'APPROVED',
    'Refusé': 'REJECTED',
    'Corrections requises': 'CORRECTIONS_REQUIRED',
    'Annulé': 'CANCELLED',
    'Inscrit': 'ENROLLED', // Add the missing ENROLLED status
    // For backward compatibility
    'En cours': 'IN_PROGRESS',
    'Documents en révision': 'DOCUMENTS_UNDER_REVIEW'
  };
  
  return statusMap[displayStatus] || displayStatus;
};

// Get status details (text, message, image) for StudentDashboardStatus component
export const getStatusDetails = (status, paymentType = null, programName = null) => {
  // Default status details
  const statusDetails = {
    'DRAFT': {
      text: 'Brouillon',
      message: 'Votre dossier d\'inscription est en cours de préparation. Vous pouvez le modifier à tout moment avant de le soumettre.',
      image: '/assets/svg/draft-icon.svg'
    },
    'SUBMITTED': {
      text: 'Soumis',
      message: 'Votre dossier d\'inscription a été soumis. Il est maintenant en cours d\'examen par notre équipe administrative.',
      image: '/assets/svg/submitted-icon.svg'
    },
    'PENDING_PAYMENT': {
      text: 'En attente de paiement',
      message: paymentType === 'PROGRAM_PAYMENT' 
        ? `Votre dossier pour la formation "${programName || 'inconnue'}" a été validé. Vous devez maintenant procéder au paiement des frais de formation.`
        : `Votre dossier pour la formation "${programName || 'inconnue'}" a été validé. Vous devez maintenant procéder au paiement des frais d'inscription.`,
      image: '/assets/svg/payment-icon.svg',
      button: {
        text: 'Procéder au paiement',
        action: 'payment'
      }
    },
    'PAYMENT_IN_PROGRESS': {
      text: 'Paiement en cours',
      message: 'Votre paiement est en cours de traitement. Veuillez patienter pendant que nous validons votre transaction.',
      image: '/assets/svg/payment-icon.svg'
    },
    'PENDING_VALIDATION': {
      text: 'En attente de validation',
      message: 'Votre paiement a été reçu. Votre dossier est maintenant en attente de validation finale par notre équipe administrative.',
      image: '/assets/svg/validation-icon.svg'
    },
    'PENDING_PROGRAM_PAYMENT': {
      text: 'En attente de paiement du programme',
      message: `Votre dossier pour la formation "${programName || 'inconnue'}" a été validé par l'administrateur. Vous devez maintenant procéder au paiement du programme pour finaliser votre inscription.`,
      image: '/assets/svg/payment-icon.svg',
      button: {
        text: 'Procéder au paiement',
        action: 'payment'
      }
    },
    'APPROVED': {
      text: 'Félicitations ! Votre inscription est approuvée',
      message: `Votre dossier pour la formation "${programName || 'inconnue'}" a été validé. Vous êtes maintenant officiellement inscrit.`,
      image: '/assets/svg/book-icon.svg'
    },
    'REJECTED': {
      text: 'Inscription Rejetée',
      message: (rejectionReason) => `Votre demande d'inscription pour la formation "${programName || 'inconnue'}" a été rejetée. Raison : ${rejectionReason || 'Non spécifiée'}. Vous pouvez recommencer le processus depuis le début.`,
      image: '/assets/svg/mail-icon.svg'
    },
    'CORRECTIONS_REQUIRED': {
      text: 'Corrections requises',
      message: `Votre dossier d'inscription pour la formation "${programName || 'inconnue'}" nécessite des corrections. Veuillez vérifier la liste des documents et informations à mettre à jour.`,
      image: '/assets/svg/settings-icon.svg'
    },
    'CANCELLED': {
      text: 'Inscription Annulée',
      message: `Votre inscription à la formation "${programName || 'inconnue'}" a été annulée. Si vous souhaitez vous réinscrire, vous pouvez recommencer le processus.`,
      image: '/assets/svg/cancel-icon.svg'
    },
    'ENROLLED': {
      text: 'Inscrit',
      message: `Félicitations ! Vous êtes officiellement inscrit à la formation "${programName || 'inconnue'}.`,
      image: '/assets/svg/book-icon.svg'
    },
    // For backward compatibility
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
    'DOCUMENTS_UNDER_REVIEW': {
      text: 'Documents en révision',
      message: 'Vos documents sont en cours de révision par notre équipe. Veuillez patienter pendant que nous les examinons.',
      image: '/assets/svg/review-icon.svg'
    }
  };
  
  return statusDetails[status] || {
    text: 'Statut inconnu',
    message: 'Une erreur est survenue lors de la récupération du statut. Veuillez contacter l\'assistance.',
    image: '/assets/svg/help-icon.svg'
  };
};