import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TOTPForm.css';
import './button.css';
import { InfoModal } from '../Modal/InfoModal';
import { EditButton } from './TOTPDisplay';

type CreateFormState = {
    issuer: string;
    account: string;
    secret: string;
    digits: number;
    period: number;
    algorithm: 'sha1' | 'sha256' | 'sha512';
};

const initialState: CreateFormState = {
    issuer: '',
    account: '',
    secret: '',
    digits: 6,
    period: 30,
    algorithm: 'sha1',
};

const TOTPCreateForm: React.FC = () => {
    const [formData, setFormData] = useState<CreateFormState>(initialState);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (field: keyof CreateFormState, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        if (!formData.issuer.trim() || !formData.secret.trim()) {
            setModalError('Preencha o emissor e a chave secreta antes de cadastrar.');
            setModalMessage(null);
            return;
        }

        setModalError(null);
        setModalMessage('Cadastro pronto. Clique em OK para voltar para a lista.');
    };

    const closeModal = () => {
        setModalMessage(null);
        setModalError(null);

        if (!modalError) {
            navigate('/');
        }
    };

    return (
        <div className="totp-form">
            <h2>Cadastrar novo TOTP</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="issuer">Emissor</label>
                        <input
                            type="text"
                            id="issuer"
                            value={formData.issuer}
                            onChange={(e) => handleChange('issuer', e.target.value)}
                            placeholder="Ex: GitHub"
                            className="form-input"
                        />
                        <small className="form-help">Nome do serviço que gera o TOTP.</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="account">Conta</label>
                        <input
                            type="text"
                            id="account"
                            value={formData.account}
                            onChange={(e) => handleChange('account', e.target.value)}
                            placeholder="Ex: email@dominio.com"
                            className="form-input"
                        />
                        <small className="form-help">Identificação da conta vinculada ao emissor.</small>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="secret">Chave secreta</label>
                    <input
                        type="text"
                        id="secret"
                        value={formData.secret}
                        onChange={(e) => handleChange('secret', e.target.value)}
                        placeholder="Insira sua chave secreta base32"
                        className="form-input"
                    />
                    <small className="form-help">Insira a chave secreta base32 da sua configuração de TOTP.</small>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="digits">Dígitos</label>
                        <select
                            id="digits"
                            value={formData.digits}
                            onChange={(e) => handleChange('digits', parseInt(e.target.value, 10))}
                            className="form-select"
                        >
                            <option value={6}>6 dígitos</option>
                            <option value={7}>7 dígitos</option>
                            <option value={8}>8 dígitos</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="period">Período (segundos)</label>
                        <input
                            type="number"
                            id="period"
                            min={10}
                            value={formData.period}
                            onChange={(e) => handleChange('period', parseInt(e.target.value, 10) || 0)}
                            className="form-input"
                        />
                        <small className="form-help">Tempo de validade de cada código.</small>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="algorithm">Algoritmo</label>
                    <select
                        id="algorithm"
                        value={formData.algorithm}
                        onChange={(e) => handleChange('algorithm', e.target.value as CreateFormState['algorithm'])}
                        className="form-select"
                    >
                        <option value="sha1">SHA-1</option>
                        <option value="sha256">SHA-256</option>
                        <option value="sha512">SHA-512</option>
                    </select>
                </div>

                <div className="form-actions">
                    <EditButton canEdit={false} onToggle={() => navigate('/')} />
                    <button className="save-button" type="button" onClick={handleSubmit} title="Cadastrar">
                        <span className="edit-label">Cadastrar</span>
                    </button>
                </div>
            </form>

            <InfoModal
                isOpen={Boolean(modalMessage || modalError)}
                title={modalError ? 'Ops' : 'Sucesso'}
                message={modalMessage ?? ''}
                onClose={closeModal}
                error={modalError ?? ''}
            />
        </div>
    );
};

export default TOTPCreateForm;
