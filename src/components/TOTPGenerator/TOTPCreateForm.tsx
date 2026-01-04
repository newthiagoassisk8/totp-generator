import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TOTPForm.css';
import './button.css';
import { InfoModal } from '../Modal/InfoModal';
import { EditButton } from './TOTPDisplay';
import { useTotpContext } from '../../contexts/TotpContext';
import Loader from '../Loader/Loader';

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

    const { register, isLoading, error, isModalOpen } = useTotpContext();
    const navigate = useNavigate();

    const handleChange = (field: keyof CreateFormState, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        console.log(formData);
    };

    const handleSubmit = async () => {
        if (!formData.issuer.trim() || !formData.secret.trim()) {
            setModalError('Preencha o emissor e a chave secreta antes de cadastrar.');
            setModalMessage(null);
            return;
        }
        await register({ label: formData.issuer, digits: formData.digits.toString(), secret: formData.secret });
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
                </div>

                <div className="form-actions">
                    <EditButton canEdit={false} onToggle={() => navigate('/')} />
                    <button className="save-button" type="button" onClick={handleSubmit} title="Cadastrar">
                        <span className="edit-label"> {isLoading ? <Loader size="sm" /> : 'Cadastrar'}</span>
                    </button>
                </div>
            </form>

            <InfoModal
                isOpen={isModalOpen}
                title={modalError ? 'Ops' : 'Sucesso'}
                message={modalMessage ?? ''}
                onClose={closeModal}
                error={error ?? ''}
            />
        </div>
    );
};
export default TOTPCreateForm;
