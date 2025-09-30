import React from 'react';
import Button from './Button';

const UploadIcon = '/assets/svg/upload-icon.svg';

const FileUploadField = ({
    id,
    label,
    description,
    fileState,
    onFileChange,
    onDelete,
    showActions = true
}) => {
    const handleFileButtonClick = () => {
        document.getElementById(id).click();
    };

    return (
        <div className="flex flex-col">
            <label
                htmlFor={id}
                className="block mb-[0.43rem]"
                style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 500,
                    fontSize: '0.93rem',
                    lineHeight: '140%',
                    letterSpacing: '0',
                    color: '#333333',
                }}
            >
                {label}
            </label>
            <p
                className="mb-[0.65rem]"
                style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.72rem',
                    lineHeight: '100%',
                    letterSpacing: '0',
                    color: '#6b7280',
                }}
            >
                {description}
            </p>
            <input
                type="file"
                id={id}
                className="hidden"
                onChange={onFileChange}
            />
            {!fileState?.file ? (
                <button
                    type="button"
                    onClick={handleFileButtonClick}
                    style={{
                        width: '225px',
                        height: '41.25px',
                        borderRadius: '7px',
                        padding: '13px 17px',
                        border: '1px solid #0000002B',
                        backgroundColor: 'rgba(242, 242, 242, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '9px',
                    }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                >
                    <img src={UploadIcon} alt="Upload" className="mr-2" style={{ width: '1.03rem', height: '1.03rem' }} />
                    <span
                        style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: '0.93rem',
                            lineHeight: '140%',
                            letterSpacing: '0',
                            color: '#101957',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Ajouter un fichier
                    </span>
                </button>
            ) : (
                <div
                    className="flex items-center justify-between border"
                    style={{
                        width: '225px',
                        height: '41.25px',
                        borderRadius: '7px',
                        paddingLeft: '17px',
                        paddingRight: '17px',
                        borderColor: '#0000002B',
                        backgroundColor: 'rgba(242, 242, 242, 0.6)',
                    }}
                >
                    <span className="truncate mr-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.93rem', fontWeight: 500 }}>{fileState.file.name}</span>
                    <span className={`font-semibold
                        ${fileState.status === 'loading' ? 'text-blue-600' : ''}
                        ${fileState.status === 'pending' ? 'text-yellow-600' : ''}
                        ${fileState.status === 'rejected' ? 'text-red-600' : ''}
                        ${fileState.status === 'validated' ? 'text-green-600' : ''}
                    `}
                    style={{ fontSize: '0.74rem' }}
                    >
                        {fileState.status === 'loading' && 'Téléchargement...'}
                        {fileState.status === 'pending' && 'En attente de validation'}
                        {fileState.status === 'rejected' && 'Rejeté'}
                        {fileState.status === 'validated' && 'Validé'}
                    </span>
                </div>
            )}
            {showActions && (fileState?.file || fileState?.status === 'rejected') && (fileState.status === 'rejected' || fileState.status === 'validated') && (
                <div className="flex mt-[0.53rem] justify-end" style={{ gap: '0.53rem' }}>
                    <Button
                        secondary
                        size="sm"
                        type="button"
                        onClick={handleFileButtonClick}
                        className="!w-auto !h-auto font-semibold"
                        style={{
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: '0.74rem',
                            padding: '0.26rem 0.68rem',
                        }}
                    >
                        Modifier
                    </Button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="text-red-600 font-semibold hover:underline"
                        style={{
                            fontSize: '0.74rem',
                            padding: '0.26rem 0.68rem',
                        }}
                    >
                        Supprimer
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUploadField;