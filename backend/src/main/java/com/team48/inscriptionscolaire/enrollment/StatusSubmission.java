package com.team48.inscriptionscolaire.enrollment;

/**
 * Statuts pour les candidatures (Enrollment)
 * Workflow: DRAFT → SUBMITTED → PENDING_PAYMENT → PENDING_VALIDATION → APPROVED/REJECTED
 */
public enum StatusSubmission {
    // Brouillon - candidature en cours de remplissage
    DRAFT,

    // Soumis - candidature soumise par l'étudiant
    SUBMITTED,

    // En attente de paiement - frais d'inscription à payer
    PENDING_PAYMENT,

    // En attente de validation - frais d'inscription payés, en attente de validation admin
    PENDING_VALIDATION,

    // En attente de paiement du program lié au enrollment- frais du program à payer
    PENDING_PROGRAM_PAYMENT,

    // Approuvée - candidature validée par admin, étudiant peut maintenant s'inscrire au programme
    APPROVED,

    // Rejetée - candidature rejetée par admin
    REJECTED,

    // Corrections requises - documents ou informations à corriger
    CORRECTIONS_REQUIRED,

    // Cancelled status
    CANCELLED,

    // enrollment terminé et validé après paiment des frais du program
    ENROLLED
}