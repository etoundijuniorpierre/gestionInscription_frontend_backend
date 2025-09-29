import React from 'react';

const AdminHelp = () => {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Aide et Support - Espace Admin</h2>
            <div className="text-gray-700 space-y-4">
                <p>
                    Ce centre d'aide est conçu pour vous assister dans la gestion de la plateforme. Pour toute question qui n'est pas couverte par la FAQ, veuillez contacter notre équipe de support.
                </p>
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Contact Support Technique</h3>
                    <p>
                        Notre équipe est disponible pour vous assister avec toute question ou problème lié au système.
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-2">
                        <li>
                            <span className="font-medium">E-mail :</span> techsupport@igniteacademy.com
                        </li>
                        <li>
                            <span className="font-medium">Téléphone :</span> +237 6XX-XX-XX-XX (ligne dédiée aux administrateurs)
                        </li>
                    </ul>
                </div>
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Signaler un Problème</h3>
                    <p>
                        Si vous trouvez un bug ou un dysfonctionnement, veuillez nous le signaler. Un rapport détaillé nous aidera à le résoudre plus rapidement.
                    </p>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Soumettre un rapport de bug
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminHelp;