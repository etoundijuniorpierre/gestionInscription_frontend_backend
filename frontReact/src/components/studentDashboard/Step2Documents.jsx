import React, { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';
import FileUploadField from '../common/FileUploadField.jsx';
import api from '../../services/api';

const Step2Documents = ({ initialData = {}, identityDocumentType = 'CNI', onSaveAndNext, onSave, onPrevious }) => {
    // We'll manage all files in a single state object keyed by their type
    const [documents, setDocuments] = useState({
        diplome1: initialData.diplome1 || null,
        diplome2: initialData.diplome2 || null,
        cniRecto: initialData.cniRecto || { file: null, status: null },
        cniVerso: initialData.cniVerso || { file: null, status: null },
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
            cniRecto: initialData.cniRecto || { file: null, status: null },
            cniVerso: initialData.cniVerso || { file: null, status: null },
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
            case 'cniRecto':
            case 'cniVerso':
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
            
            // Upload the document
            const response = await api.post('/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
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
            // Set status to rejected on error
            setDocuments(prevDocs => ({
                ...prevDocs,
                [documentType]: { file: file, status: 'rejected' }
            }));
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
        const requiredDocuments = ['diplome1', 'cniRecto', 'cniVerso', 'acteNaissance', 'photoIdentite', 'cv', 'lettreMotivation'];
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
    const getIdentityDocumentLabel = (side) => {
        switch (identityDocumentType) {
            case 'Passport':
                return `Photocopie Passport ${side}`;
            case 'Permis de conduire':
                return `Photocopie Permis de conduire ${side}`;
            default:
                return `Photocopie CNI ${side}`;
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
                    showActions={false}
                />
                {errors.diplome1 && <p className="text-red-500 text-[1.2rem] mt-1 col-span-2">{errors.diplome1}</p>}
                
                <FileUploadField
                    id="diplome2"
                    label={<span>Dernier diplôme obtenu "2" (Facultatif)</span>}
                    description='Importer un fichier compatible : PDF ou image claire et lisible, max 5Mo'
                    fileState={documents.diplome2}
                    onFileChange={handleFileUpload('diplome2')}
                    onDelete={handleFileDelete('diplome2')}
                    showActions={false}
                />
                
                <FileUploadField
                    id="cniRecto"
                    label={<span>{getIdentityDocumentLabel('Recto')} <span className="text-red-500">*</span></span>}
                    description='Importer un fichier compatible : PDF ou image claire et lisible(JPG/PNG)'
                    fileState={documents.cniRecto}
                    onFileChange={handleFileUpload('cniRecto')}
                    onDelete={handleFileDelete('cniRecto')}
                />
                {errors.cniRecto && <p className="text-red-500 text-[1.2rem] mt-1 col-span-2">{errors.cniRecto}</p>}
                
                <FileUploadField
                    id="cniVerso"
                    label={<span>{getIdentityDocumentLabel('Verso')} <span className="text-red-500">*</span></span>}
                    description='Importer un fichier compatible : PDF ou image claire et lisible(JPG/PNG)'
                    fileState={documents.cniVerso}
                    onFileChange={handleFileUpload('cniVerso')}
                    onDelete={handleFileDelete('cniVerso')}
                />
                {errors.cniVerso && <p className="text-red-500 text-[1.2rem] mt-1 col-span-2">{errors.cniVerso}</p>}
                
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