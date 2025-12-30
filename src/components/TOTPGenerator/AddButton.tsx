import { useNavigate } from 'react-router-dom';
import './button.css';

export function AddButton() {
    const navigate = useNavigate();

    return (
        <button
            className="add-button"
            type="button"
            onClick={() => navigate('/new')}
            aria-label="Cadastrar novo TOTP"
            title="Cadastrar novo TOTP"
        >
            <span className="add-icon">+</span>
            <span className="add-label">Novo</span>
        </button>
    );
}
