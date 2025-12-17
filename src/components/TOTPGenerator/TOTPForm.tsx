import React from 'react'
import { TOTPConfig } from '../../types/TOTPTypes'
import './TOTPForm.css'

interface TOTPFormProps {
  config: TOTPConfig
  onConfigChange: (config: TOTPConfig) => void
}

const TOTPForm: React.FC<TOTPFormProps> = ({ config, onConfigChange }) => {
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
          <label htmlFor="secret">Secret Key (Base32)</label>
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
            <label htmlFor="digits">Digits</label>
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

          <div className="form-group">
            <label htmlFor="period">Period (seconds)</label>
            <select
              id="period"
              value={config.period}
              onChange={(e) => handleInputChange('period', parseInt(e.target.value))}
              className="form-select"
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="algorithm">Algorithm</label>
          <select
            id="algorithm"
            value={config.algorithm}
            onChange={(e) => handleInputChange('algorithm', e.target.value)}
            className="form-select"
          >
            <option value="sha1">sha1</option>
            <option value="sha256">sha256</option>
            <option value="sha512">sha512</option>
          </select>
        </div>
      </form>
    </div>
  )
}

export default TOTPForm 