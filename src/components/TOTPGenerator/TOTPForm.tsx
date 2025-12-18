import React from 'react'
import { TOTPConfig } from '../../types/TOTPTypes'
import './TOTPForm.css'
import { EditButton } from './TOTPDisplay'

interface TOTPFormProps {
  config: TOTPConfig
  onConfigChange: (config: TOTPConfig) => void
  onToggleEdit: () => void;

}

const TOTPForm: React.FC<TOTPFormProps> = ({ config, onToggleEdit, onConfigChange }) => {
  const handleInputChange = (field: keyof TOTPConfig, value: string | number) => {
    onConfigChange({
      ...config,
      [field]: value
    })
  }

  const handleSecretChange = (value: string) => {
    // Remove spaces and convert to uppercase for base32
    const cleanedSecret = value.replace(/\s/g, '').toUpperCase()
    handleInputChange('secret', cleanedSecret)
  }

  return (
    <div className="totp-form">
      <h2>Configuration</h2>
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
          <div className="form-group">
            <label htmlFor="digits">Emissor</label>

            <select
              id="digits"
              value={config.digits}
              onChange={(e) => handleInputChange('digits', parseInt(e.target.value))}
              className="form-select"
            >
              <option value={6}>6 digits</option>
              <option value={8}>8 digits</option>
            </select>
          </div>

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
        <EditButton isEditing={false} onToggle={onToggleEdit} />
      </form>

    </div>
  )
}

export default TOTPForm 
