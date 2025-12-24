import React, { useState } from 'react';
import './TOTPDisplay.css';
import './button.css';
import { MinimalModal } from './MinimalModal';
import { useTotp } from '../../hooks/useTotpFetching';
import { TOTPItem } from '../../types/TOTPItem';
interface TOTPDisplayProps {
    items: TOTPItem[];
    onToggleEdit: (uid?: string) => void;
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

const TOTPDisplay: React.FC<TOTPDisplayProps> = ({ items, onToggleEdit }) => {
    //TODO: passar estado de loading via prop em vez de hook
    const { isLoading: isLoadingHook } = useTotp({ secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAA' });

    const [modalForUid, setModalForUid] = useState<string | null>(null);

    function handleClipBoard(uid: string, totp: string) {
        setModalForUid(uid);
        navigator.clipboard.writeText(totp);
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
                                <div key={item.uid} className="totp-card">
                                    <h3>{item.label ?? item.uid}</h3>
                                    <div className="totp-placeholder">
                                        <p>{item.error}</p>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={item.uid} className="totp-card">
                                <h3>{item.label ?? item.uid}</h3>

                                <div className="totp-code">
                                    {!isLoadingHook ? (
                                        <span
                                            className="code-text"
                                            onClick={() => handleClipBoard(item.uid, item.otp)}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            {item.otp ? item.otp : 'não disponível'}
                                        </span>
                                    ) : (
                                        <p>Carregando</p>
                                    )}

                                    {modalForUid === item.uid && (
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
                                    <EditButton canEdit={true} onToggle={() => onToggleEdit(item.uid)} />
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
