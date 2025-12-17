import React, { useState, useEffect } from 'react';
import TOTPDisplay from './TOTPDisplay';
import { TOTPConfig } from '../../types/TOTPTypes';
import { generateTOTP } from '../../utils/totpUtils';
import './TOTPGenerator.css';
import { useTotp } from '../../hooks/useTotpFetching';
import TOTPForm from './TOTPForm';
const TOTPGenerator: React.FC = () => {

    // TODO: Criar botão e colocar o formulário de cadastro de secret
    const [isValid, setIsValid] = useState<boolean>(true);
    const [showForm, setShowForm] = useState<boolean>(false)
    const { expiresDate, now, currentTOTP, reload, error } = useTotp({ secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' })
    const [timeRemaining, setTimeRemaining] = useState<number>(Math.floor((expiresDate - now) / 1000));

    const [config, setConfig] = useState<TOTPConfig>({ secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', digits: 1, algorithm: 'sha1', period: 30 });
    const handleConfigChange = (newConfig: TOTPConfig) => {
        setConfig(newConfig)
        setTimeRemaining(newConfig.period)
    }
    useEffect(() => {
        if (!isValid) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    // Regenerate TOTP when timer resets
                    try {
                        const totp = generateTOTP(config);
                        reload()
                        console.log('Timer reset - New TOTP:', totp); // Debug log

                        return config.period;
                    } catch (error) {
                        console.error('Timer reset TOTP error:', error); // Debug log
                        setIsValid(false);
                        return config.period;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isValid, 30, config]);


    return (
        <div className="totp-generator">
            <div className="generator-container">
                {showForm ? <TOTPForm
                    config={config}
                    onConfigChange={() => handleConfigChange}
                /> :
                    <TOTPDisplay
                        totp={currentTOTP}
                        timeRemaining={timeRemaining}
                        period={config.period}
                        isValid={isValid}
                        error={error?.toString()}
                    />}


            </div>
        </div>
    );
};

export default TOTPGenerator
