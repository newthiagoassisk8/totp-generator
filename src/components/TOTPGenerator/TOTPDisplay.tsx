import React, { useState } from 'react';
import './TOTPDisplay.css';
import './button.css';

import { MinimalModal } from './MinimalModal';
import { useTotp } from '../../hooks/useTotpFetching';
interface TOTPDisplayProps {
    totp: string;
    timeRemaining: number;
    period: number;
    isValid: boolean;
    error: string | undefined;
}

type EditButtonProps = {
    isEditing?: boolean
    onToggle?: () => void
}

//TODO: Remover isEditing daqui, não faz sentido
export function EditButton({ isEditing, onToggle }: EditButtonProps) {
    return (
        <button
            className="edit-button"
            type="button"
            onClick={onToggle}
            aria-pressed={isEditing}
            aria-label={isEditing ? "Sair do modo de edição" : "Entrar no modo de edição"}
            title={isEditing ? "Sair do modo de edição" : "Editar"}
        >
            <span className="edit-label">{isEditing ? "Editing" : "Edit"}</span>
        </button>
    )
}
const TOTPDisplay: React.FC<TOTPDisplayProps> = ({ totp, timeRemaining, period, isValid, error }) => {
    const progressPercentage = ((period - timeRemaining) / period) * 100;
    const [showModal, setShowModal] = useState(false);
    const { isLoading: isLoadingHook } = useTotp({ secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAA' })

    function handleClipBoard(texto: string) {
        setShowModal(true)
        navigator.clipboard.writeText(texto)

    }



    if (error) {
        return (
            <div className="totp-display">
                <div className="display-container">
                    <h2>Generated TOTP</h2>
                    <div className="totp-placeholder">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );

    }


    if (!isValid) {
        return (
            <div className="totp-display">
                <div className="display-container">
                    <h2>Generated TOTP</h2>
                    <div className="totp-placeholder">
                        <p>Enter a valid secret key to generate TOTP codes</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="totp-display">
            <div className="display-container">
                <h2>Generated TOTP</h2>

                <div className="totp-code">
                    {
                        !isLoadingHook ?
                            <span className="code-text" onClick={() => handleClipBoard(totp)}>{totp ? totp : 'não disponivel'}</span> : <p>Carregando</p>
                    }
                    {showModal &&
                        <MinimalModal
                            isShown={showModal}
                            text="Código TOTP copiado para o clipboard."
                            onClose={() => setShowModal(false)}
                        />}
                </div>

                <div className="timer-section">
                    <div className="timer-display">
                        <span className="time-remaining">{timeRemaining}s</span>
                        <span className="time-label">remaining</span>
                    </div>

                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
                    </div>
                </div>
                <EditButton isEditing={true} onToggle={() => console.log('')} />

                <div className="refresh-info">
                    <p>Code refreshes automatically every {period} seconds</p>
                </div>
            </div>
        </div>
    );
};

export default TOTPDisplay;
