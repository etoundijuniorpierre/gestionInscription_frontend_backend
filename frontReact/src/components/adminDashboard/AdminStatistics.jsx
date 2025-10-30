import React, { useState, useEffect } from 'react';
import { getStatistics, getCandidatureStatistics, getInscriptionStatistics, getTempsReelStatistics } from '../../services/statisticsService';

const AdminStatistics = () => {
    const [statistics, setStatistics] = useState(null);
    const [candidatureStats, setCandidatureStats] = useState(null);
    const [inscriptionStats, setInscriptionStats] = useState(null);
    const [tempsReelStats, setTempsReelStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const [allStats, candidatureData, inscriptionData, tempsReelData] = await Promise.all([
                getStatistics(),
                getCandidatureStatistics(),
                getInscriptionStatistics(),
                getTempsReelStatistics()
            ]);

            setStatistics(allStats);
            setCandidatureStats(candidatureData);
            setInscriptionStats(inscriptionData);
            setTempsReelStats(tempsReelData);
        } catch (err) {
            if (err.response && err.response.status === 500) {
                setError('Erreur interne du serveur. Veuillez réessayer plus tard ou contacter l\'administrateur.');
            } else {
                setError('Erreur lors du chargement des statistiques: ' + (err.response?.data || err.message));
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Chargement des statistiques...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Statistiques Détaillées</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Navigation par onglets */}
                <div className="mb-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-2 px-3 border-b-2 font-medium text-sm ${
                                activeTab === 'overview'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Vue d'ensemble
                        </button>
                        <button
                            onClick={() => setActiveTab('candidatures')}
                            className={`py-2 px-3 border-b-2 font-medium text-sm ${
                                activeTab === 'candidatures'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Candidatures
                        </button>
                        <button
                            onClick={() => setActiveTab('inscriptions')}
                            className={`py-2 px-3 border-b-2 font-medium text-sm ${
                                activeTab === 'inscriptions'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Inscriptions
                        </button>
                        <button
                            onClick={() => setActiveTab('temps-reel')}
                            className={`py-2 px-3 border-b-2 font-medium text-sm ${
                                activeTab === 'temps-reel'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Temps réel (24h)
                        </button>
                    </nav>
                </div>

                {/* Contenu des onglets */}
                {activeTab === 'overview' && statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Candidatures totales */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Candidatures Totales</h3>
                            <p className="text-3xl font-bold text-blue-600">{candidatureStats?.total || 0}</p>
                            <p className="text-sm text-gray-600 mt-1">Toutes les candidatures soumises</p>
                        </div>

                        {/* Inscriptions totales */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Inscriptions Totales</h3>
                            <p className="text-3xl font-bold text-green-600">{inscriptionStats?.total || 0}</p>
                            <p className="text-sm text-gray-600 mt-1">Étudiants inscrits (programme payé)</p>
                        </div>

                        {/* Nouveaux comptes 24h */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nouveaux Comptes (24h)</h3>
                            <p className="text-3xl font-bold text-purple-600">{statistics.nouveauxComptes?.dernières24h || 0}</p>
                            <p className="text-sm text-gray-600 mt-1">Comptes créés récemment</p>
                        </div>
                    </div>
                )}

                {activeTab === 'candidatures' && candidatureStats && (
                    <div className="space-y-6">
                        {/* Métriques principales */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">En attente de paiement</h3>
                                <p className="text-3xl font-bold text-yellow-600">{candidatureStats.enAttenteDePaiement || 0}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">En attente de validation</h3>
                                <p className="text-3xl font-bold text-blue-600">{candidatureStats.enAttenteDeValidation || 0}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Approuvées</h3>
                                <p className="text-3xl font-bold text-green-600">{candidatureStats.statuts?.APPROVED || 0}</p>
                            </div>
                        </div>

                        {/* Répartition par statut */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Répartition par statut</h3>
                            <div className="space-y-3">
                                {Object.entries(candidatureStats.statuts || {}).map(([status, count]) => (
                                    <div key={status} className="flex justify-between items-center">
                                        <span className="text-gray-700 capitalize">
                                            {status.replace('_', ' ').toLowerCase()}
                                        </span>
                                        <span className="font-semibold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'inscriptions' && inscriptionStats && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Inscriptions Totales</h3>
                                <p className="text-3xl font-bold text-green-600">{inscriptionStats.total || 0}</p>
                                <p className="text-sm text-gray-600 mt-1">Étudiants inscrits aux programmes</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">En attente de paiement</h3>
                                <p className="text-3xl font-bold text-yellow-600">{inscriptionStats.enAttenteDePaiement || 0}</p>
                                <p className="text-sm text-gray-600 mt-1">Candidatures approuvées, programme non payé</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'temps-reel' && tempsReelStats && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Nouveaux Paiements (24h)</h3>
                                <p className="text-3xl font-bold text-green-600">{tempsReelStats.nouveauxPaiements || 0}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Nouvelles Inscriptions (24h)</h3>
                                <p className="text-3xl font-bold text-blue-600">{tempsReelStats.nouvellesInscriptions || 0}</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Nouvelles Candidatures (24h)</h3>
                                <p className="text-3xl font-bold text-purple-600">{tempsReelStats.nouvellesCandidatures || 0}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStatistics;
