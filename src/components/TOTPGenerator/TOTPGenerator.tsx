import React, { useEffect, useState } from 'react';
import TOTPDisplay from './TOTPDisplay';
import { TOTPConfig } from '../../types/TOTPTypes';
import { generateTOTP } from '../../utils/totpUtils';
import './TOTPGenerator.css';
import { useTotp } from '../../hooks/useTotpFetching';
import TOTPForm from './TOTPForm';
import { useLocation, useNavigate } from 'react-router-dom';
const TOTPGenerator: React.FC = () => {
    // TODO: Fazer o componetne ter mais de um visualizador de TOTP
    // TODO: Criar botão e colocar o formulário de cadastro de secret
    const { expiresDate, now, items: apiItems, reload, error } = useTotp({ secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
    const [timeRemaining, setTimeRemaining] = useState<number>(Math.floor((expiresDate - now) / 1000));
    const [config, setConfig] = useState<TOTPConfig>({
        secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        digits: 1,
        algorithm: 'sha1',
        period: 30,
    });
    const navigate = useNavigate();
    const location = useLocation();
    const isFormRoute = location.pathname === '/form';
    const handleToggleEdit = () => {
        navigate(isFormRoute ? '/' : '/form');
    };
    const itemsAsdf = apiItems.map((item) => {
        return {
            uid: item.uid,
            label: item.label ?? item.uid,
            otp: item.otp,
            timeRemaining,
            period: config.period,
            error: error?.toString(),
        };
    });

    const handleConfigChange = (newConfig: TOTPConfig) => {
        setConfig(newConfig);
        setTimeRemaining(newConfig.period);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    try {
                        const totp = generateTOTP(config);
                        reload();
                        console.log('Timer reset - New TOTP:', totp); // Debug log

                        return config.period;
                    } catch (error) {
                        console.error('Timer reset TOTP error:', error); // Debug log
                        return config.period;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [30, config]);

    return (
        <div className="totp-generator">
            <div className="generator-container">
                {isFormRoute ? (
                    <TOTPForm onToggleEdit={handleToggleEdit} config={config} onConfigChange={handleConfigChange} />
                ) : (
                    <TOTPDisplay items={itemsAsdf} onToggleEdit={handleToggleEdit} />
                )}
            </div>
        </div>
    );
};

export default TOTPGenerator;
