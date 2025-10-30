import React, { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';
import FileUploadField from '../common/FileUploadField.jsx';
import api from '../../services/api';

const Step2Documents = ({ initialData = {}, identityDocumentType = 'CNI', onSaveAndNext, onSave, onPrevious }) => {
    // We'll manage all files in a single state object keyed by their type
    const [documents, setDocuments] = useState({
        diplome1: initialData.diplome1 || null,
        diplome2: initialData.diplome2 || null,
        cni: initialData.cni || { file: null, status: null },
        acteNaissance: initialData.acteNaissance || { file: null, status: null },
        photoIdentite: initialData.photoIdentite || { file: null, status: null },
        cv: initialData.cv || { file: null, status: null },
        lettreMotivation: initialData.lettreMotivation || { file: null, status: null },
    });
    
    // Validation error states
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setDocuments({
            diplome1: initialData.diplome1 || null,
            diplome2: initialData.diplome2 || null,
            cni: initialData.cni || { file: null, status: null },
            acteNaissance: initialData.acteNaissance || { file: null, status: null },
            photoIdentite: initialData.photoIdentite || { file: null, status: null },
            cv: initialData.cv || { file: null, status: null },
            lettreMotivation: initialData.lettreMotivation || { file: null, status: null },
        });
    }, [initialData]);

    const validateFile = (file, documentType) => {
        // Check file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return "La taille du fichier ne doit pas dépasser 5 Mo";
        }

        // Get file extension
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        // Define allowed extensions based on document type
        let allowedExtensions = [];
        let documentLabel = "";
        
        switch (documentType) {
            case 'diplome1':
            case 'diplome2':
            case 'cni':
            case 'acteNaissance':
            case 'photoIdentite':
                allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
                documentLabel = "Ce document";
                break;
            case 'cv':
            case 'lettreMotivation':
                allowedExtensions = ['pdf', 'doc', 'docx'];
                documentLabel = "Ce document";
                break;
            default:
                allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
                documentLabel = "Ce document";
        }
        
        // Check file extension
        if (!allowedExtensions.includes(fileExtension)) {
            return `${documentLabel} doit être au format ${allowedExtensions.join(', ')}`;
        }
        
        return null; // No validation errors
    };

    const handleFileUpload = (documentType) => async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file before upload
        const validationError = validateFile(file, documentType);
        if (validationError) {
            // Set error state for this document
            setErrors(prev => ({ ...prev, [documentType]: validationError }));
            
            // Set document status to rejected due to validation error
            // Don't store the invalid file, just set status to rejected
            setDocuments(prevDocs => ({
                ...prevDocs,
                [documentType]: { file: null, status: 'rejected' }
            }));
            
            // Clear the file input
            event.target.value = '';
            return;
        }

        // Clear any previous errors for this document
        if (errors[documentType]) {
            setErrors(prev => ({ ...prev, [documentType]: '' }));
        }

        // Update the state for the specific document type to show loading
        setDocuments(prevDocs => ({
            ...prevDocs,
            [documentType]: { file: file, status: 'loading' }
        }));

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', file);
            
            // Upload the document with timeout and better error handling
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30 second timeout
            };
            
            const response = await api.post('/api/v1/images/upload', formData, config);
            
            // Update state with the response
            setDocuments(prevDocs => ({
                ...prevDocs,
                [documentType]: { 
                    file: file, 
                    status: response.data.validationStatus || 'validated',
                    documentInfo: response.data
                }
            }));
        } catch (error) {
            console.error('Error uploading document:', error);
            
            // Provide more specific error information
            let errorMessage = "Une erreur s'est produite lors du téléchargement du document. Veuillez réessayer.";
            
            if (error.code === 'ERR_NETWORK') {
                // Network error - likely backend not reachable
                errorMessage = "Impossible de contacter le serveur pour le téléchargement du document. Veuillez vérifier que le serveur backend est en cours d'exécution et que vous êtes connecté à Internet.";
            } else if (error.response) {
                // Server responded with error status
                if (error.response.status === 500) {
                    errorMessage = "Erreur interne du serveur lors du téléchargement du document.";
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = `Erreur du serveur: ${error.response.data.message}`;
                } else {
                    errorMessage = `Erreur ${error.response.status}: ${error.response.statusText}`;
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = "Impossible de contacter le serveur pour le téléchargement du document. Veuillez vérifier votre connexion internet.";
            } else {
                // Something else happened
                errorMessage = `Erreur: ${error.message}`;
            }
            
            // Set status to rejected on error
            setDocuments(prevDocs => ({
                ...prevDocs,
                [documentType]: { file: file, status: 'rejected' }
            }));
            
            // Set error message
            setErrors(prev => ({ ...prev, [documentType]: errorMessage }));
        }
    };

    const handleFileDelete = (documentType) => () => {
        setDocuments(prevDocs => ({
            ...prevDocs,
            [documentType]: { file: null, status: null }
        }));
    };

    const collectData = () => {
        // Return the entire documents object with its named keys
        return documents;
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Check if required documents are uploaded
        const requiredDocuments = ['diplome1', 'cni', 'acteNaissance', 'photoIdentite', 'cv', 'lettreMotivation'];
        const missingDocuments = requiredDocuments.filter(doc => !documents[doc] || !documents[doc].file);
        
        if (missingDocuments.length > 0) {
            missingDocuments.forEach(doc => {
                newErrors[doc] = "Ce document est obligatoire";
            });
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveClick = () => {
        onSave(collectData());
    };

    const handleNextClick = () => {
        if (validateForm()) {
            onSaveAndNext(collectData());
        }
    };

    // Get the document label based on the selected identity document type
    const getIdentityDocumentLabel = () => {
        switch (identityDocumentType) {
            case 'Passport':
                return 'Photocopie Passport';
            case 'Permis de conduire':
                return 'Photocopie Permis de conduire';
            default:
                return 'Photocopie CNI';
        }
    };

    return (
        <>
            <h2
                className="mb-4"
                style={{
                    opacity: 1,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '1.5625rem',
                    lineHeight: '140%',
                    letterSpacing: '0',
                    textAlign: 'center',
                    color: '#666666',
                }}
            >
                Veuillez télécharger les documents requis
            </h2>
            <div className="grid grid-cols-2 gap-x-[1.28rem] gap-y-[2rem]">
                <FileUploadField
                    id="diplome1"
                    label={<span>Dernier diplôme obtenu "1" <span className="text-red-500">*</span></span>}
                    description='Importer un fichier compatible : PDF ou image claire et lisible, max 5Mo'
                    fileState={documents.diplome1}
                    onFileChange={handleFileUpload('diplome1')}
                    onDelete={handleFileDelete('diplome1')}
                />
                {errors.diplome1 && <p className="text-red-500 text-[1.2rem] mt-1 col-span-2">{errors.diplome1}</p>}
                
                <FileUploadField
                    id="diplome2"
                    label={<span>Autre diplôme obtenu "2" (Facultatif)</span>}
                    description='Importer un fichier compatible : PDF ou image claire et lisible, max 5Mo'
                    fileState={documents.diplome2}
                    onFileChange={handleFileUpload('diplome2')}
                    onDelete={handleFileDelete('diplome2')}
                />
                
                <FileUploadField
                    id="cni"
                    label={<span>{getIdentityDocumentLabel()} <span className="text-red-500">*</span></span>}
                    description='Importer un fichier compatible : PDF ou image claire et lisible(JPG/PNG)'
                    fileState={documents.cni}
                    onFileChange={handleFileUpload('cni')}
                    onDelete={handleFileDelete('cni')}
                />
                {errors.cni && <p className="text-red-500 text-[1.2rem] mt-1 col-span-2">{errors.cni}</p>}
                
                <FileUploadField
                    id="acteNaissance"
                    label={<span>Acte de naissance <span className="text-red-500">*</span></span>}
                    description='Importer un fichier compatible : PDF ou image claire et lisible'
                    fileState={documents.acteNaissance}
                    onFileChange={handleFileUpload('acteNaissance')}
                    onDelete={handleFileDelete('acteNaissance')}
                />
                {errors.acteNaissance && <p className="text-red-500 text-[1.2rem] mt-1 col-span-2">{errors.acteNaissance}</p>}
                
                <FileUploadField
                    id="photoIdentite"
                    label={<span>Photo d'identité 4+4 <span className="text-red-500">*</span></span>}
                    description='Importer un fichier compatible : PDF ou image claire et lisible'
                    fileState={documents.photoIdentite}
                    onFileChange={handleFileUpload('photoIdentite')}
                    onDelete={handleFileDelete('photoIdentite')}
                />
                {errors.photoIdentite && <p className="text-red-500 text-[1.2rem] mt-1 col-span-2">{errors.photoIdentite}</p>}
                
                <FileUploadField
                    id="cv"
                    label={<span>Curriculum Vitae (CV) <span className="text-red-500">*</span></span>}
                    description='Importer un fichier compatible : PDF ou document Word, max 5Mo'
                    fileState={documents.cv}
                    onFileChange={handleFileUpload('cv')}
                    onDelete={handleFileDelete('cv')}
                />
                {errors.cv && <p className="text-red-500 text-[1.2rem] mt-1 col-span-2">{errors.cv}</p>}
                
                <FileUploadField
                    id="lettreMotivation"
                    label={<span>Lettre de motivation <span className="text-red-500">*</span></span>}
                    description='Importer un fichier compatible : PDF ou document Word, max 5Mo'
                    fileState={documents.lettreMotivation}
                    onFileChange={handleFileUpload('lettreMotivation')}
                    onDelete={handleFileDelete('lettreMotivation')}
                />
                {errors.lettreMotivation && <p className="text-red-500 text-[1.2rem] mt-1 col-span-2">{errors.lettreMotivation}</p>}
            </div>
            
            <div className="flex justify-between gap-4 mt-8">
                <Button
                    secondary
                    type="button"
                    onClick={onPrevious}
                    className="flex-1 !w-auto font-semibold text-[1.28rem] leading-[127.5%] tracking-[0.0298rem]"
                    style={{ fontFamily: 'Roboto, sans-serif', height: '2.98rem' }}
                >
                    Précédent
                </Button>
                <Button
                    primary
                    type="button"
                    onClick={handleNextClick}
                    className="flex-1 !w-auto font-semibold text-[1.28rem] leading-[127.5%] tracking-[0.0298rem]"
                    style={{ fontFamily: 'Roboto, sans-serif', height: '2.98rem' }}
                >
                    Suivant
                </Button>
            </div>
        </>
    );
};

export default Step2Documents;