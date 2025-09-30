import React from 'react';

const AdminFAQ = () => {
    const faqItems = [
        {
            question: "Comment puis-je approuver une nouvelle inscription ?",
            answer: "Rendez-vous dans 'Gestion des Inscriptions'. Chaque demande a un statut que vous pouvez mettre à jour (ex: 'En attente', 'Approuvée', 'Rejetée'). Vous pouvez aussi voir les détails de chaque dossier pour prendre une décision éclairée."
        },
        {
            id: 2,
            question: "Comment gérer les inscriptions ?",
            answer: "Dans la section 'Gestion des Inscriptions', vous pouvez visualiser toutes les inscriptions en attente, les valider ou les rejeter. Vous pouvez également contacter directement les étudiants via le système de messagerie."
        },
        {
            question: "Comment ajouter une nouvelle formation ?",
            answer: "Dans la section 'Gestion des Formations', cliquez sur 'Ajouter une formation'. Remplissez les informations requises telles que le nom, la description et les conditions d'admission."
        },
        {
            question: "Puis-je modifier les informations d'un utilisateur ?",
            answer: "Oui. Allez dans 'Gestion des Utilisateurs', recherchez l'utilisateur et cliquez sur 'Modifier'. Vous pourrez mettre à jour leurs informations personnelles et leur rôle si nécessaire."
        },
        {
            question: "Comment gérer les messages des étudiants ?",
            answer: "Tous les messages envoyés par les étudiants sont centralisés dans la section 'Messagerie'. Vous pouvez y répondre directement pour assurer un suivi rapide et efficace."
        },
        {
            question: "Comment résoudre un problème technique sur le tableau de bord ?",
            answer: "Si vous rencontrez un bug ou un problème technique, veuillez nous contacter immédiatement en utilisant la section 'Aide' ou par e-mail. Fournissez une description détaillée du problème pour un diagnostic rapide."
        }
    ];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Foire Aux Questions (FAQ) - Espace Admin</h2>
                    <p className="text-gray-600">Consultez les questions fréquemment posées</p>
                </div>
            </div>
            <div className="w-full h-1 bg-[#101957] my-8"></div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                    {faqItems.map((item, index) => (
                        <div key={index} className="border-b pb-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">{item.question}</h3>
                            <p className="text-gray-600">{item.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminFAQ;