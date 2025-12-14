import React, { useState, useEffect } from 'react'
import TOTPDisplay from './TOTPDisplay'
import { TOTPConfig } from '../../types/TOTPTypes'
import { generateTOTP, testTOTPGeneration } from '../../utils/totpUtils'
import './TOTPGenerator.css'

const TOTPGenerator: React.FC = () => {
  const [config, setConfig] = useState<TOTPConfig>({
    secret: '',
    digits: 6,
    period: 30,
    algorithm: 'sha1'
  })

  const [currentTOTP, setCurrentTOTP] = useState<string>('')
  const [timeRemaining, setTimeRemaining] = useState<number>(30)
  const [isValid, setIsValid] = useState<boolean>(false)

  useEffect(() => {
    if (!config.secret || config.secret.trim() === '') {
      setIsValid(false)
      setCurrentTOTP('')
      return
    }

    try {
      const totp = generateTOTP(config)
      console.log('Generated TOTP:', totp, 'for config:', config) // Debug log
      setCurrentTOTP(totp)
      setIsValid(true)
    } catch (error) {
      console.error('TOTP generation error:', error) // Debug log
      setIsValid(false)
      setCurrentTOTP('')
    }
  }, [config])

  useEffect(() => {
    if (!isValid) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Regenerate TOTP when timer resets
          try {
            const totp = generateTOTP(config)
            console.log('Timer reset - New TOTP:', totp) // Debug log
            setCurrentTOTP(totp)
            return config.period
          } catch (error) {
            console.error('Timer reset TOTP error:', error) // Debug log
            setIsValid(false)
            return config.period
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isValid, config.period, config])

  const handleConfigChange = (newConfig: TOTPConfig) => {
    setConfig(newConfig)
    setTimeRemaining(newConfig.period)
  }

  const handleTestTOTP = () => {
    try {
      const testTOTP = testTOTPGeneration()
      console.log('Test TOTP result:', testTOTP)
      // Set a test config to see if it works
      const testConfig = {
        secret: 'JBSWY3DPEHPK3PXP',
        digits: 6,
        period: 30,
        algorithm: 'sha1' as const
      }
      setConfig(testConfig)
      setTimeRemaining(30)
    } catch (error) {
      console.error('Test failed:', error)
    }
  }

  return (
    <div className="totp-generator">
      <div className="generator-container">

        <TOTPDisplay
          totp={currentTOTP}
          timeRemaining={timeRemaining}
          period={config.period}
          isValid={true}
        />
      </div>
    </div>
  )
}

export default TOTPGenerator 
