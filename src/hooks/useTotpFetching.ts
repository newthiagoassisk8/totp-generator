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
    now: number;
    currentTOTP: string;
    error: string | null;
    reload: () => Promise<void>;
    isLoading: boolean
}

/**
 * currentTotp, now e expireDate precisa ser checado antes de exportar
 *
 * Secret é o parametro que estou madando para a API
 * currentTotp, now e expireDate é o retorno da requisição
 *
 */
export function useTotp({ secret }: useTotpParams): UseTotpReturn {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [currentTOTP, setCurrentTOTP] = useState('');
    const [expiresDate, setExpiresDate] = useState<number>(30);
    const [currentTime, setCurrentTime] = useState<number>(Date.now());
    const fetchApi = useCallback(async (): Promise<void> => {
        setError(null);
        setIsLoading(true)
        try {
            const result = await getTotp();
            setCurrentTOTP(result.otp);
            setExpiresDate(result?.expiresDate);
            setCurrentTime(result?.now)
        } catch (err: any) {
            setError(err.message || 'Erro ao consumir api');
        } finally {
            console.log('caiu aqui???')
            setIsLoading(false)
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
    }, [secret, fetchApi]);

    return {
        currentTOTP,
        expiresDate,
        error,
        now: currentTime,
        reload: fetchApi,
        isLoading
    };
}
