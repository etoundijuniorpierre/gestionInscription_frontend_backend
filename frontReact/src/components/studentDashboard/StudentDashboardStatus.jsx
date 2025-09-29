import React from 'react';

const StudentDashboardStatus = ({ enrollment, onGoBack }) => {
    if (!enrollment) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-600">
                <p>Aucune inscription trouvée. Veuillez commencer une nouvelle inscription.</p>
                <button
                    onClick={onGoBack}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    let statusText = '';
    let statusMessage = '';
    let statusImage = '';
    let buttonAction = null;

    const baseStyle = "text-xl font-medium";

    switch (enrollment.status) {
        case 'PENDING':
            statusText = 'En cours de traitement';
            statusMessage = 'Votre dossier d\'inscription est en cours d\'examen par notre équipe administrative. Veuillez patienter pour la validation. Vous serez notifié des mises à jour.';
            statusImage = '/assets/svg/pending-status.svg';
            break;
        case 'APPROVED':
            statusText = 'Félicitations ! Votre inscription est approuvée';
            statusMessage = 'Votre dossier a été validé. Vous pouvez maintenant procéder au paiement pour finaliser votre inscription.';
            statusImage = '/assets/svg/approved-status.svg';
            buttonAction = (
                <button className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Procéder au paiement
                </button>
            );
            break;
        case 'REJECTED':
            statusText = 'Inscription Rejetée';
            statusMessage = `Votre demande d'inscription a été rejetée. Raison : ${enrollment.rejectionReason || 'Non spécifiée'}. Vous pouvez recommencer le processus depuis le début.`;
            statusImage = '/assets/svg/rejected-status.svg';
            buttonAction = (
                <button
                    onClick={onGoBack}
                    className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Recommencer
                </button>
            );
            break;
        case 'CORRECTIONS_REQUIRED':
            statusText = 'Corrections requises';
            statusMessage = 'Votre dossier d\'inscription nécessite des corrections. Veuillez vérifier la liste des documents et informations à mettre à jour.';
            statusImage = '/assets/svg/corrections-required.svg';
            buttonAction = (
                <button
                    onClick={() => console.log('Navigate to corrections form')}
                    className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                    Mettre à jour mon dossier
                </button>
            );
            break;
        case 'PAID':
            statusText = 'Inscription Complétée';
            statusMessage = 'Votre paiement a été reçu et votre inscription est maintenant complète. Bienvenue !';
            statusImage = '/assets/svg/paid-status.svg';
            break;
        default:
            statusText = 'Statut inconnu';
            statusMessage = 'Une erreur est survenue lors de la récupération du statut. Veuillez contacter l\'assistance.';
            statusImage = '/assets/svg/error-status.svg';
            break;
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
            <img src={statusImage} alt="Statut" className="w-24 h-24 mb-6" />
            <h3 className="text-2xl font-bold mb-2 text-center text-gray-800">{statusText}</h3>
            <p className="text-center text-gray-600 px-4 leading-relaxed">{statusMessage}</p>
            {buttonAction}
        </div>
    );
};

export default StudentDashboardStatus;