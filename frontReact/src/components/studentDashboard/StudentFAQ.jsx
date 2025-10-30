import React from 'react';

const StudentFAQ = () => {
    const faqItems = [
        {
            id: 1,
            question: "Comment puis-je m'inscrire à une formation ?",
            answer: "Sur votre tableau de bord, cliquez sur la formation de votre choix dans la section 'Formations disponibles' et remplissez le formulaire d'inscription. Vous serez contacté par l'administration pour finaliser le processus. Vous pouvez suivre l'état de votre inscription dans la section 'Mes inscriptions'."
        },
        {
            id: 2,
            question: "Quels documents dois-je fournir pour une formation ?",
            answer: "Généralement, vous aurez besoin de votre relevé de notes du secondaire, d'une pièce d'identité valide, et d'une photo d'identité récente. Des documents supplémentaires peuvent être demandés en fonction de la formation choisie. La liste complète des documents requis sera affichée dans votre formulaire d'inscription."
        },
        {
            id: 3,
            question: "Comment puis-je vérifier le statut de mon inscription ?",
            answer: "Le statut de votre inscription sera mis à jour en temps réel dans la section 'Mes inscriptions' de votre tableau de bord. Vous recevrez également des notifications par e-mail à chaque étape du processus. Les statuts possibles sont : En attente, En cours de validation, Acceptée, Refusée."
        },
        {
            id: 4,
            question: "Que faire si j'ai oublié mon mot de passe ?",
            answer: "Sur la page de connexion, cliquez sur 'Mot de passe oublié'. Suivez les instructions pour réinitialiser votre mot de passe à l'aide de l'adresse e-mail associée à votre compte. Vous recevrez un lien de réinitialisation dans votre boîte mail."
        },
        {
            id: 5,
            question: "Comment puis-je contacter l'administration ?",
            answer: "Vous pouvez nous contacter via la section 'Messagerie' de votre tableau de bord (dans le menu Aide & Contact) ou en utilisant le bouton 'Aide' pour un support instantané. Vous pouvez également nous envoyer un email à support@igniteacademy.com ou nous appeler au +237 6XX-XX-XX-XX (du lundi au vendredi, de 8h à 17h)."
        },
        {
            id: 6,
            question: "Quand serai-je informé de l'acceptation ou du refus de mon inscription ?",
            answer: "Vous serez informé par email dans un délai de 3 à 5 jours ouvrables suivant votre inscription. Vous pouvez également consulter le statut dans la section 'Mes inscriptions' de votre tableau de bord."
        },
        {
            id: 7,
            question: "Puis-je modifier mes informations après l'inscription ?",
            answer: "Oui, vous pouvez modifier certaines informations dans la section 'Paramètres' de votre tableau de bord. Pour des modifications importantes, veuillez contacter l'administration via la messagerie ou par email."
        }
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Foire Aux Questions (FAQ) - Espace Étudiant</h2>
            <div className="space-y-6">
                {faqItems.map((item) => (
                    <div key={item.id} className="border-b pb-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{item.question}</h3>
                        <p className="text-gray-600">{item.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default StudentFAQ;