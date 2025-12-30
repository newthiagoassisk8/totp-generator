import React, { useEffect, useState } from 'react';
import TOTPDisplay from './TOTPDisplay';
import { TOTPConfig } from '../../types/TOTPTypes';
import { generateTOTP } from '../../utils/totpUtils';
import './TOTPGenerator.css';
import TOTPForm from './TOTPForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { TOTPItem } from '../../types/TOTPItem';
import { TotpProvider, useTotpContext } from '../../contexts/TotpContext';

const TOTPGeneratorContent: React.FC = () => {
    const { expiresDate, now, items: apiItems, reload, needsRefresh, error, isLoading } = useTotpContext();
    const [timeRemaining, setTimeRemaining] = useState<number>(Math.floor((expiresDate - now) / 1000));
    const [config, setConfig] = useState<TOTPConfig>({
        secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        digits: 6,
        algorithm: 'sha1',
        period: 30,
    });
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const isFormRoute = location.pathname === '/form';
    const handleToggleEdit = (uid?: string) => {
        if (uid) {
            setSelectedId(uid);
        }
        navigate(isFormRoute ? '/' : '/form'

        );
    };
    const items = apiItems.map((item: TOTPItem) => {
        return {
            id: item.id,
            label: item.label ?? item.id,
            otp: item.otp,
            timeRemaining,
            period: config.period,
            error: error?.toString(),
        };
    });
    const selectedItem = apiItems.find((item: TOTPItem) => item.id === selectedId);

    const handleConfigChange = (newConfig: TOTPConfig) => {
        setConfig(newConfig);
        setTimeRemaining(newConfig.period);
    };

    useEffect(() => {
        if (needsRefresh) {
            reload();
        }
    }, [needsRefresh, reload]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [config.period]);

    useEffect(() => {
        if (timeRemaining > 0) return;

        try {
            generateTOTP(config);
            reload();
        } catch (error) {
            // Ignore invalid config; reset the timer regardless.
        }

        setTimeRemaining(config.period);
    }, [timeRemaining, config, reload]);

    return (
        <div className="totp-generator">
            <div className="generator-container">
                {isFormRoute ? (
                    <TOTPForm
                        onToggleEdit={handleToggleEdit}
                        config={config}
                        onConfigChange={handleConfigChange}
                        selectedId={selectedId}
                        key={selectedItem?.id}
                        selectedLabel={selectedItem?.label ?? selectedItem?.id}
                    />
                ) : (
                    <TOTPDisplay items={items} error={error} onToggleEdit={handleToggleEdit} isLoading={isLoading} />
                )}
            </div>
        </div>
    );
};
const TOTPGenerator: React.FC = () => {
    return (
        <TotpProvider secret="AAAAAAAA" >
            <TOTPGeneratorContent />
        </TotpProvider>
    );
};
export default TOTPGenerator;
