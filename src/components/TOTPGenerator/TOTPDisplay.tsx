import React, { ReactNode, useEffect, useState } from 'react';
import './TOTPDisplay.css';
import './button.css';
import { MinimalModal } from './MinimalModal';
import { TOTPItem } from '../../types/TOTPItem';

import { useTotpContext } from '../../contexts/TotpContext';
import Loader from '../Loader/Loader';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
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

type DeleteButtonProps = {
    onDelete?: () => void;
};

export function DeleteButton({ onDelete }: DeleteButtonProps) {
    return (
        <button className="delete-button" type="button" onClick={onDelete} aria-label="Excluir item" title="Excluir">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9zm1 13h8a2 2 0 0 0 2-2V9h-2v11H8V9H6v11a2 2 0 0 0 2 2z" />
            </svg>
        </button>
    );
}

const TOTPDisplay: React.FC<TOTPDisplayProps> = ({ items, onToggleEdit, error, isLoading }) => {
    const { delete: deleteHook, showForm } = useTotpContext();
    const [modalForUid, setModalForUid] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    function handleDeleteClick() {
        console.log('chego aqui?');
        setIsConfirmOpen((prevState) => !prevState);
        console.log(isConfirmOpen);
    }
    function handleCanel() {
        setIsConfirmOpen(false);
    }

    async function handleConfirmation(id: string) {
        await deleteHook(id);
        setIsConfirmOpen(false);
    }
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
        return <Loader size="lg" />;
    }

    if (!items || items.length === 0) {
        return (
            <div className="totp-display">
                <div className="display-container">
                    <h2>TOTP gerado</h2>
                    <div className="totp-placeholder">
                        <p>Nenhum item para exibir</p>
                    </div>
                    <EditButton canEdit={true} onToggle={onToggleEdit} />
                </div>
            </div>
        );
    }

    return (
        <div className="totp-display">
            <div className="display-container">
                <h2>TOTP gerado</h2>

                {/* LISTA */}
                <div className="totp-list">
                    {items.map((item) => {
                        const progressPercentage = ((item.period - item.timeRemaining) / item.period) * 100;

                        // tratamento opcional por item
                        if (item.error) {
                            return (
                                <div key={item.id} className="totp-card">
                                    <div className="totp-card-header">
                                        <h3>{item.label ?? item.id}</h3>
                                    </div>
                                    <div className="totp-placeholder">
                                        <p>{item.error}</p>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={item.id} className="totp-card">
                                <div className="totp-card-header">
                                    <h3>{item.label ?? item.id}</h3>
                                    <DeleteButton onDelete={handleDeleteClick} />
                                </div>

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
                                    {isConfirmOpen && (
                                        <ConfirmModal
                                            isOpen={isConfirmOpen}
                                            isLoading={isLoading}
                                            message={'Deseja confirmar a ação?'}
                                            cancelText={'Cancelar'}
                                            onConfirm={() => handleConfirmation(item.id)}
                                            onCancel={handleCanel}
                                            confirmText={'Confirmar'}
                                        />
                                    )}
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
        </div>
    );
};

export default TOTPDisplay;
