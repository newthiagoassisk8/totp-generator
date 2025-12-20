import React from 'react'
import { TOTPConfig } from '../../types/TOTPTypes'
import './TOTPForm.css'
import { EditButton } from './TOTPDisplay'

interface TOTPFormProps {
  config: TOTPConfig
  onConfigChange: (config: TOTPConfig) => void
  onToggleEdit: () => void;

}
// TODO: Editar somente quantos digitos (por padrão 6) e o emissor Só pode 6 7 8 digitos
function SaveButton() {
  return (
    <button
      className="save-button"
      type="button"
      onClick={() => { }}
      title="Salvar"
    >
      <span className="edit-label">Salvar</span>
    </button>
  )
}
const TOTPForm: React.FC<TOTPFormProps> = ({ config, onToggleEdit, onConfigChange }) => {
  const handleInputChange = (field: keyof TOTPConfig, value: string | number) => {
    onConfigChange({
      ...config,
      [field]: value
    })
  }

  const handleSecretChange = (value: string) => {
    const cleanedSecret = value.replace(/\s/g, '').toUpperCase()
    handleInputChange('secret', cleanedSecret)
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
            value={config.secret}
            onChange={(e) => handleSecretChange(e.target.value)}
            placeholder="Enter your base32 secret key"
            className="form-input"
          />
          <small className="form-help">
            Enter the base32 encoded secret key from your TOTP setup
          </small>
        </div>

        <div className="form-row">

          <label htmlFor="secret">Chave Secreta</label>

          <input
            type="text"
            id="secret"
            value={config.secret}
            onChange={(e) => handleSecretChange(e.target.value)}
            placeholder="Enter your base32 secret key"
            className="form-input"
          />
          <div />
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="digits">Conta</label>


              <input
                type="text"
                id="secret"
                value={config.secret}
                onChange={(e) => handleSecretChange(e.target.value)}
                placeholder="Enter your base32 secret key"
                className="form-input"
              />

            </div>
          </div>

        </div>
        <EditButton canEdit={false} onToggle={onToggleEdit} />

        <SaveButton />
      </form>

    </div>
  )
}

export default TOTPForm 
