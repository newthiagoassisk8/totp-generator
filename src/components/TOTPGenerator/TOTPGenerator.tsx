import React, { useState, useEffect } from 'react';
import TOTPDisplay from './TOTPDisplay';
import { TOTPConfig } from '../../types/TOTPTypes';
import { generateTOTP } from '../../utils/totpUtils';
import './TOTPGenerator.css';
import { useTotp } from '../../hooks/useTotpFetching';
const TOTPGenerator: React.FC = () => {

    const [isValid, setIsValid] = useState<boolean>(true);
    const { expiresDate, now, currentTOTP, reload, error } = useTotp({ secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' })
    const [timeRemaining, setTimeRemaining] = useState<number>(Math.floor((expiresDate - now) / 1000));

    const [config, setConfig] = useState<TOTPConfig>({ secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', digits: 1, algorithm: 'sha1', period: 30 });

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
                <TOTPDisplay totp={currentTOTP} timeRemaining={timeRemaining} period={30} isValid={!false} error={error?.toString()} />
            </div>
        </div>
    );
};

export default TOTPGenerator
