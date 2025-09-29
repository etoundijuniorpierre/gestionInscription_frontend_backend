import React from 'react';

const StatusCard = ({ title, message, status, onAction, actionLabel, actionColor }) => {
    const statusColors = {
        'PENDING': 'bg-yellow-100 border-yellow-500 text-yellow-700',
        'APPROVED': 'bg-green-100 border-green-500 text-green-700',
        'CORRECTIONS_REQUIRED': 'bg-orange-100 border-orange-500 text-orange-700',
        'REJECTED': 'bg-red-100 border-red-500 text-red-700'
    };

    const statusClasses = statusColors[status] || 'bg-gray-100 border-gray-500 text-gray-700';

    return (
        <div className={`p-6 border-l-4 rounded-lg shadow-md max-w-2xl mx-auto my-10 ${statusClasses}`}>
            <h2 className="text-2xl font-bold mb-3">{title}</h2>
            <p className="text-lg">{message}</p>
            {onAction && (
                <button
                    onClick={onAction}
                    className={`mt-4 px-6 py-2 rounded-md font-semibold text-white ${actionColor}`}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

const EnrollmentStatusPage = ({ enrollment, onCorrection, onRestart, onPayment }) => {
    if (!enrollment) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold text-gray-700">Aucune inscription en cours</h2>
                <p className="text-gray-500 mt-2">Commencez le processus d'inscription en sélectionnant une formation.</p>
            </div>
        );
    }

    switch (enrollment.status) {
        case 'PENDING':
            return (
                <StatusCard
                    title="Demande d'inscription en attente"
                    message="Votre demande d'inscription est en cours d'examen par notre équipe administrative. Nous vous notifierons dès qu'une décision sera prise."
                    status="PENDING"
                />
            );
        case 'APPROVED':
            return (
                <StatusCard
                    title="Demande d'inscription approuvée !"
                    message="Félicitations ! Votre demande a été acceptée. Vous pouvez maintenant passer à la dernière étape: le paiement des frais."
                    status="APPROVED"
                    onAction={onPayment}
                    actionLabel="Procéder au paiement"
                    actionColor="bg-green-600 hover:bg-green-700"
                />
            );
        case 'CORRECTIONS_REQUIRED':
            return (
                <StatusCard
                    title="Corrections requises"
                    message={`Votre demande nécessite des ajustements. Veuillez corriger les documents ou informations suivants: ${enrollment.rejectionReason}`}
                    status="CORRECTIONS_REQUIRED"
                    onAction={onCorrection}
                    actionLabel="Aller aux corrections"
                    actionColor="bg-orange-600 hover:bg-orange-700"
                />
            );
        case 'REJECTED':
            return (
                <StatusCard
                    title="Demande d'inscription rejetée"
                    message={`Votre demande a été rejetée. Raison: ${enrollment.rejectionReason}`}
                    status="REJECTED"
                    onAction={onRestart}
                    actionLabel="Recommencer"
                    actionColor="bg-red-600 hover:bg-red-700"
                />
            );
        default:
            return (
                <div className="text-center p-10">
                    <h2 className="text-2xl font-bold text-gray-700">Statut inconnu</h2>
                    <p className="text-gray-500 mt-2">Veuillez contacter le support pour plus d'informations.</p>
                </div>
            );
    }
};

export default EnrollmentStatusPage;