import React, { useState, useEffect } from 'react';
import Button from '../common/Button.jsx';
import FileUploadField from '../common/FileUploadField.jsx';
import api from '../../services/api';

const Step2Documents = ({ initialData = {}, onSaveAndNext, onSave, onPrevious }) => {
    // We'll manage all files in a single state object keyed by their type
    const [documents, setDocuments] = useState({
        diplome1: initialData.diplome1 || null,
        diplome2: initialData.diplome2 || null,
        cniRecto: initialData.cniRecto || { file: null, status: null },
        cniVerso: initialData.cniVerso || { file: null, status: null },
        acteNaissance: initialData.acteNaissance || { file: null, status: null },
        photoIdentite: initialData.photoIdentite || { file: null, status: null },
    });

    useEffect(() => {
        setDocuments({
            diplome1: initialData.diplome1 || null,
            diplome2: initialData.diplome2 || null,
            cniRecto: initialData.cniRecto || { file: null, status: null },
            cniVerso: initialData.cniVerso || { file: null, status: null },
            acteNaissance: initialData.acteNaissance || { file: null, status: null },
            photoIdentite: initialData.photoIdentite || { file: null, status: null },
        });
    }, [initialData]);

    const handleFileUpload = (documentType) => async (event) => {
        const file = event.target.files[0];
        if (!file) return;

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

    const handleSaveClick = () => {
        onSave(collectData());
    };

    const handleNextClick = () => {
        onSaveAndNext(collectData());
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
                    label='Dernier diplôme obtenu "1"'
                    description='Importer un fichier compatible : PDF ou image claire et lisible, max 5Mo'
                    fileState={documents.diplome1}
                    onFileChange={handleFileUpload('diplome1')}
                    onDelete={handleFileDelete('diplome1')}
                    showActions={false}
                />
                <FileUploadField
                    id="diplome2"
                    label='Dernier diplôme obtenu "2" (Facultatif)'
                    description='Importer un fichier compatible : PDF ou image claire et lisible, max 5Mo'
                    fileState={documents.diplome2}
                    onFileChange={handleFileUpload('diplome2')}
                    onDelete={handleFileDelete('diplome2')}
                    showActions={false}
                />
                <FileUploadField
                    id="cniRecto"
                    label='Photocopie CNI Recto'
                    description='Importer un fichier compatible : PDF ou image claire et lisible(JPG/PNG)'
                    fileState={documents.cniRecto}
                    onFileChange={handleFileUpload('cniRecto')}
                    onDelete={handleFileDelete('cniRecto')}
                />
                <FileUploadField
                    id="cniVerso"
                    label='Photocopie CNI Verso'
                    description='Importer un fichier compatible : PDF ou image claire et lisible(JPG/PNG)'
                    fileState={documents.cniVerso}
                    onFileChange={handleFileUpload('cniVerso')}
                    onDelete={handleFileDelete('cniVerso')}
                />
                <FileUploadField
                    id="acteNaissance"
                    label='Acte de naissance'
                    description='Importer un fichier compatible : PDF ou image claire et lisible'
                    fileState={documents.acteNaissance}
                    onFileChange={handleFileUpload('acteNaissance')}
                    onDelete={handleFileDelete('acteNaissance')}
                />
                <FileUploadField
                    id="photoIdentite"
                    label="Photo d'identité 4+4"
                    description='Importer un fichier compatible : PDF ou image claire et lisible'
                    fileState={documents.photoIdentite}
                    onFileChange={handleFileUpload('photoIdentite')}
                    onDelete={handleFileDelete('photoIdentite')}
                />
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