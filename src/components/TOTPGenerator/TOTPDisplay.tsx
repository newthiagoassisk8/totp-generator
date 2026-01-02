import React, { useState } from 'react';
import './TOTPDisplay.css';
import './button.css';
import { MinimalModal } from './MinimalModal';
import { TOTPItem } from '../../types/TOTPItem';
import { AddButton } from './AddButton';

import { useTotpContext } from '../../contexts/TotpContext';
import Loader from '../Loader/Loader';
interface TOTPDisplayProps {
    items: TOTPItem[];
    onToggleEdit: (uid?: string) => void;
    error: string | null;
    isLoading: boolean;
}

type EditButtonProps = {
    canEdit?: boolean;
    onToggle?: (uid?: string) => void;
};

export function EditButton({ canEdit, onToggle }: EditButtonProps) {
    return (
        <button
            className="edit-button"
            type="button"
            onClick={() => onToggle?.()}
            aria-pressed={canEdit}
            aria-label={canEdit ? 'Sair do modo de edição' : 'Entrar no modo de edição'}
            title={canEdit ? 'Sair do modo de edição' : 'Editar'}
        >
            <span className="edit-label">{canEdit ? 'Editar' : 'Voltar'}</span>
        </button>
    );
}

const TOTPDisplay: React.FC<TOTPDisplayProps> = ({ items, onToggleEdit, error, isLoading }) => {
    const [modalForUid, setModalForUid] = useState<string | null>(null);

    const { showForm } = useTotpContext();
    function handleClipBoard(uid: string, totp: string) {
        setModalForUid(uid);
        navigator.clipboard.writeText(totp);
    }
    if (error) {
        return (
            <div className="totp-display">
                <div className="display-container">
                    <div className="totp-placeholder">
                        <p className="error">{error}</p>
                    </div>
                </div>
            </div>
        );
    }
    if (isLoading) {
        return (<Loader size='lg' />)
    }

    if (!items || items.length === 0) {
        return (
            <div className="totp-display">
                <div className="display-container">
                    <div className="display-header">
                        <h2>TOTP gerado</h2>
                    </div>
                    <div className="totp-placeholder">
                        <p>Nenhum item para exibir</p>
                    </div>
                    <div className="display-actions">
                        <EditButton canEdit={true} onToggle={onToggleEdit} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="totp-display">
            <div className="display-container">
                <div className="display-header">
                    <h2>TOTP gerado</h2>
                </div>

                {/* LISTA */}
                <div className="totp-list">
                    {items.map((item) => {
                        const progressPercentage = ((item.period - item.timeRemaining) / item.period) * 100;
                        // tratamento opcional por item
                        if (item.error) {
                            return (
                                <div key={item.id} className="totp-card">
                                    <h3>{item.label ?? item.id}</h3>
                                    <div className="totp-placeholder">
                                        <p>{item.error}</p>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={item.id} className="totp-card">
                                <h3>{item.label ?? item.id}</h3>

                                <div className="totp-code">
                                    {!isLoading ? (
                                        <span
                                            className="code-text"
                                            onClick={() => handleClipBoard(item.id, item.otp)}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            {item.otp ? item.otp : 'não disponível'}
                                        </span>
                                    ) : (
                                        <p>Carregando</p>
                                    )}

                                    {modalForUid === item.id && (
                                        <MinimalModal
                                            isShown={true}
                                            text="Código TOTP copiado para o clipboard."
                                            onClose={() => setModalForUid(null)}
                                        />
                                    )}
                                </div>

                                <div className="timer-section">
                                    <div className="timer-display">
                                        <span className="time-remaining">{item.timeRemaining}s</span>
                                        <span className="time-label">restante</span>
                                    </div>

                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
                                    </div>
                                    <EditButton canEdit={!showForm} onToggle={() => onToggleEdit(item.id)} />
                                </div>

                                <div className="refresh-info">
                                    <p>O código é atualizado automaticamente a cada {item.period} segundos</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <AddButton />
        </div>
    );
};

export default TOTPDisplay;
