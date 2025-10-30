import React, { useState } from 'react';
import StudentMessageModal from './StudentMessageModal';

const StudentHelp = () => {
    const [showMessageModal, setShowMessageModal] = useState(false);

    return (
        <>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Aide et Support - Espace Étudiant</h2>
                <div className="text-gray-700 space-y-4">
                    <p>
                        Bienvenue dans le centre d'aide. Si vous ne trouvez pas la réponse à votre question dans notre Foire Aux Questions, n'hésitez pas à nous contacter.
                    </p>
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">Options de Contact</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>
                                <button 
                                    onClick={() => setShowMessageModal(true)}
                                    className="text-blue-500 hover:underline cursor-pointer"
                                >
                                    Messagerie interne
                                </button>
                                <span> : Envoyez un message direct à l'administration via notre système de messagerie intégré.</span>
                            </li>
                            <li>
                                <span className="font-medium">E-mail :</span> support@igniteacademy.com
                            </li>
                            <li>
                                <span className="font-medium">Téléphone :</span> +237 6XX-XX-XX-XX (du lundi au vendredi, de 8h à 17h)
                            </li>
                        </ul>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">Ressources Utiles</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>
                                <a href="/dashboard/faq" className="text-blue-500 hover:underline">Foire Aux Questions (FAQ)</a>
                            </li>
                            <li>
                                Guide d'utilisation du portail (PDF à télécharger)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <StudentMessageModal 
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
            />
        </>
    );
};

export default StudentHelp;