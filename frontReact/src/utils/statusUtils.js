// Utilitaire de traduction des statuts anglais vers français
export const translateStatus = (status) => {
    const translations = {
        'DRAFT': 'Brouillon',
        'SUBMITTED': 'Soumise',
        'PENDING_PAYMENT': 'En attente de paiement',
        'PAYMENT_IN_PROGRESS': 'Paiement en cours',
        'PENDING_VALIDATION': 'En attente de validation',
        'APPROVED': 'Approuvée',
        'REJECTED': 'Rejetée',
        'CORRECTIONS_REQUIRED': 'Corrections requises'
    };
    return translations[status] || status;
};

// Utilitaire pour obtenir la couleur du statut
export const getStatusColor = (status) => {
    const colorMap = {
        'DRAFT': 'bg-gray-100 text-gray-800',
        'SUBMITTED': 'bg-blue-100 text-blue-800',
        'PENDING_PAYMENT': 'bg-yellow-100 text-yellow-800',
        'PAYMENT_IN_PROGRESS': 'bg-orange-100 text-orange-800',
        'PENDING_VALIDATION': 'bg-purple-100 text-purple-800',
        'APPROVED': 'bg-green-100 text-green-800',
        'REJECTED': 'bg-red-100 text-red-800',
        'CORRECTIONS_REQUIRED': 'bg-pink-100 text-pink-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
};

// Utilitaire pour obtenir le libellé du statut
export const getStatusLabel = (status) => {
    return translateStatus(status);
};
