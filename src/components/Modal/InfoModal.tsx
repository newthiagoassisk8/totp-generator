
import React, { ReactNode, useEffect } from 'react';
import './InfoModal.css';

interface InfoModalProps {
	isOpen: boolean;
	title?: string;
	message: ReactNode;
	onClose: () => void;
	error: ReactNode
}

export const InfoModal: React.FC<InfoModalProps> = ({
	isOpen,
	title,
	message,
	onClose,
	error
}) => {
	// Fecha com ESC
	useEffect(() => {
		if (!isOpen) return;

		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="modal-backdrop" onClick={onClose}>
			<div
				className="modal-container"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
			>
				{title && <h3 className="modal-title">{title}</h3>}

				<div className="modal-content">
					{message || error}
				</div>

				<button className="modal-button" onClick={onClose}>
					OK
				</button>
			</div>
		</div>
	);
}
