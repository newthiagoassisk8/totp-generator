import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOTPConfig } from '../../types/TOTPTypes';
import './TOTPForm.css';
import { EditButton } from './TOTPDisplay';
import { InfoModal } from '../Modal/InfoModal.tsx';
import { useTotp } from '../../hooks/useTotpFetching.ts';

interface TOTPFormProps {
    config: TOTPConfig;
    onConfigChange: (config: TOTPConfig) => void;
    onToggleEdit: () => void;
}

// TODO: Editar somente quantos digitos (por padrão 6) e o emissor Só pode 6 7 8 digitos
const TOTPForm: React.FC<TOTPFormProps> = ({ config, onToggleEdit, onConfigChange }) => {
    const { update, isLoading, error, isModalOpen } = useTotp({ secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
    const handleInputChange = (field: keyof TOTPConfig, value: string | number) => {
        onConfigChange({
            ...config,
            [field]: value,
        });
    };

    const navigate = useNavigate();

    function closeButton() {
        navigate('/');
    }

    function Loader() {
        return (
            <svg className="loader" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="Carregando">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        );
    }
    function SaveButton() {
        return (
            <button
                className="save-button"
                type="button"
                title="Salvar"
                onClick={() => update({ uid: 'item1', label: 'Demo 1 - 1 digitos', digits: 6 })}
            >
                <span className="edit-label"> {isLoading ? <Loader /> : 'Salvar'}</span>
            </button>
        );
    }
    const handleSecretChange = (value: string) => {
        const cleanedSecret = value.replace(/\s/g, '').toUpperCase();
        handleInputChange('secret', cleanedSecret);
    };

    return (
        <div className="totp-form">
            <h2>Inserir detalhes da conta</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="secret">Emissor</label>
                    <input
                        type="text"
                        id="secret"
                        value={config.secret}
                        onChange={(e) => handleSecretChange(e.target.value)}
                        placeholder="Insira sua chave secreta base32"
                        className="form-input"
                    />
                    <small className="form-help">Insira a chave secreta base32 da sua configuração de TOTP</small>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="digits">Dígitos</label>
                        <select
                            id="digits"
                            value={config.digits}
                            onChange={(e) => handleInputChange('digits', parseInt(e.target.value))}
                            className="form-select"
                        >
                            <option value={6}>6 dígitos</option>
                            <option value={7}>7 dígitos</option>
                            <option value={8}>8 dígitos</option>
                        </select>
                    </div>
                    {isModalOpen && (
                        <InfoModal
                            isOpen={isModalOpen}
                            title={error ? 'Ops' : 'Sucesso'}
                            message={error ? error : 'Dados atualizados com sucesso'}
                            onClose={closeButton}
                            error={error}
                        />
                    )}
                </div>
                <div className="form-actions">
                    <EditButton canEdit={false} onToggle={onToggleEdit} />
                    <SaveButton />
                </div>
            </form>
        </div>
    );
};

export default TOTPForm;
