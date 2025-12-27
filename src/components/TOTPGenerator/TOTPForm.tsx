import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TOTPConfig } from '../../types/TOTPTypes';
import './TOTPForm.css';
import { EditButton } from './TOTPDisplay';
import { InfoModal } from '../Modal/InfoModal';
import { useTotpContext } from '../../contexts/TotpContext';

interface TOTPFormProps {
    config: TOTPConfig;
    onConfigChange: (config: TOTPConfig) => void;
    onToggleEdit: (uid?: string) => void;
    selectedId: string | null;
    selectedLabel?: string;
}

const TOTPForm: React.FC<TOTPFormProps> = ({ config, onToggleEdit, onConfigChange, selectedId, selectedLabel }) => {
    const { update, isLoading, error, isModalOpen, closeModal } = useTotpContext();
    const [labelValue, setLabelValue] = useState(selectedLabel ?? '');
    const handleInputChange = (field: keyof TOTPConfig, value: string | number) => {
        onConfigChange({
            ...config,
            [field]: value,
        });
    };
    useEffect(() => {
        setLabelValue(selectedLabel ?? '');
    }, [selectedLabel]);

    const navigate = useNavigate();

    function closeButton() {
        closeModal();
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
        const canSave = Boolean(selectedId);
        const label = labelValue ?? selectedId ?? 'Sem label';
        return (
            <button
                className="save-button"
                type="button"
                title="Salvar"
                onClick={async () => {
                    if (!selectedId) return;
                    await update({ uid: selectedId, label: label, digits: config.digits });
                }}
                disabled={!canSave}
            >
                <span className="edit-label"> {isLoading ? <Loader /> : 'Salvar'}</span>
            </button>
        );
    }

    return (
        <div className="totp-form">
            <h2>Inserir detalhes da conta</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label htmlFor="secret">Emissor</label>
                    <input
                        type="text"
                        id="secret"
                        value={labelValue}
                        onChange={(e) => setLabelValue(e.target.value)}
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
