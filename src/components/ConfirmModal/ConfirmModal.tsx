import React, { ReactNode, useEffect } from 'react';
import './ConfirmModal.css';
import Loader from '../Loader/Loader';

type ConfirmModalProps = {
    isOpen: boolean;
    isLoading: boolean;
    message?: ReactNode;
    onCancel: () => void;
    onConfirm: () => Promise<void>;
    cancelText?: string;
    confirmText?: string;
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    message,
    onCancel,
    onConfirm,
    isLoading = false,
    cancelText = 'Cancelar',
    confirmText = 'Confirmar',
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onCancel();
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="confirm-modal-backdrop" onClick={onCancel}>
            <div
                className="confirm-modal-container"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Confirmação"
            >
                <div className="confirm-modal-message">{message}</div>
                <div className="confirm-modal-actions">
                    {!isLoading ? (
                        <div>
                            <button className="confirm-modal-button ghost" type="button" onClick={onCancel}>
                                {cancelText}
                            </button>
                            <button className="confirm-modal-button primary" type="button" onClick={onConfirm}>
                                {confirmText}
                            </button>
                        </div>
                    ) : (
                        <Loader size="lg" />
                    )}
                </div>
            </div>
        </div>
    );
};
