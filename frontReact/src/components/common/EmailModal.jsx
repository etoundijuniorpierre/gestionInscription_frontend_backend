import React, { useState, useEffect } from 'react';
import { sendEmailToStudent, getStudentsForEmail } from '../../services/emailService';

const EmailModal = ({ isOpen, onClose, studentEmail = '' }) => {
    const [formData, setFormData] = useState({
        recipientEmail: studentEmail,
        subject: '',
        content: ''
    });
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStudents, setIsLoadingStudents] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setIsLoadingStudents(true);
                const studentsList = await getStudentsForEmail();
                setStudents(studentsList);
            } catch (err) {
                setError('Erreur lors du chargement des étudiants: ' + (err.response?.data || err.message));
            } finally {
                setIsLoadingStudents(false);
            }
        };

        if (isOpen) {
            fetchStudents();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            // Réinitialiser le formulaire quand le modal se ferme
            setFormData({
                recipientEmail: studentEmail,
                subject: '',
                content: ''
            });
            setSelectedStudentId('');
            setError('');
        }
    }, [isOpen, studentEmail]);

    const handleStudentChange = (studentId) => {
        if (studentId === 'other') {
            setSelectedStudentId(studentId);
            setFormData(prev => ({
                ...prev,
                recipientEmail: ''
            }));
        } else {
            const student = students.find(s => s.id.toString() === studentId);
            setSelectedStudentId(studentId);
            setFormData(prev => ({
                ...prev,
                recipientEmail: student ? student.email : ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await sendEmailToStudent(formData.recipientEmail, formData.subject, formData.content);
            alert('Email envoyé avec succès!');
            onClose();
            setFormData({
                recipientEmail: studentEmail,
                subject: '',
                content: ''
            });
            setSelectedStudentId('');
        } catch (err) {
            setError('Erreur lors de l\'envoi de l\'email: ' + (err.response?.data || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Envoyer un email</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sélectionner un étudiant
                        </label>
                        {isLoadingStudents ? (
                            <div className="text-gray-500">Chargement des étudiants...</div>
                        ) : (
                            <select
                                value={selectedStudentId}
                                onChange={(e) => handleStudentChange(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Sélectionner un étudiant...</option>
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.fullName} ({student.email})
                                    </option>
                                ))}
                                <option value="other">Autre (saisir manuellement)</option>
                            </select>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email du destinataire
                        </label>
                        <input
                            type="email"
                            name="recipientEmail"
                            value={formData.recipientEmail}
                            onChange={handleChange}
                            className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                selectedStudentId === 'other' ? '' : 'bg-gray-50'
                            }`}
                            readOnly={selectedStudentId !== 'other' && selectedStudentId !== ''}
                            placeholder={selectedStudentId === 'other' ? 'Saisir l\'email du destinataire' : ''}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sujet
                        </label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Objet de l'email"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows={8}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contenu de votre message..."
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !formData.recipientEmail}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Envoi...' : 'Envoyer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmailModal;