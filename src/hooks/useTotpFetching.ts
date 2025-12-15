import { useCallback, useEffect, useState } from 'react';
import { getTotp } from '../integrations/api';

interface useTotpParams {
    secret?: string;
}

/**
 * Retorno do hook
 */
export interface UseTotpReturn {
    expiresDate: number;
    currentTOTP: string;
    isChecking: boolean;
    error: string | null;
    reload: () => Promise<void>;
}

/**
 *
 *
 */
export function useTotp({ secret }: useTotpParams): UseTotpReturn {
    const [isChecking, setIsChecking] = useState(() => {
        return Boolean(secret);
    });
    const [error, setError] = useState<string | null>(null);
    const [currentTOTP, setCurrentTOTP] = useState('');
    const [expiresDate, setExpiresDate] = useState<number>(30);

    const fetchApi = useCallback(async (): Promise<void> => {
        if (!secret) {
            setIsChecking(false);
        }
        setIsChecking(true);
        setError(null);
        try {
            const result = await getTotp();
            setCurrentTOTP(result.otp);
            setExpiresDate(result?.expiresDate);
        } catch (err: any) {
            setError(err.message || 'Erro ao consumir api');
        } finally {
            setIsChecking(false);
        }
    }, [secret]);

    /**
     * Efeito para disparar a verificação automática (com debounce)
     */
    useEffect(() => {
        if (secret) {
            const timer = setTimeout(() => {
                fetchApi();
            }, 500);

            return () => clearTimeout(timer);
        }
        setIsChecking(false);
    }, [secret, fetchApi]);

    return {
        currentTOTP,
        expiresDate,
        error,
        isChecking,
        reload: fetchApi,
    };
}
