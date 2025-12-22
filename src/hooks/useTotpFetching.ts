import { useCallback, useEffect, useState } from 'react';
import { getTotp } from '../integrations/api';

interface useTotpParams {
    secret?: string;
}

type TOTPItem = {
    uid: string;
    label?: string;
    otp: string;
    timeRemaining: number;
    period: number;
    error?: string;
    isValid?: boolean;
};

/**
 * Retorno do hook
 */
export interface UseTotpReturn {
    expiresDate: number;
    now: number;
    showForm: boolean;
    currentTOTP: string;
    error: string | null;
    reload: () => Promise<void>;
    isLoading: boolean;
    toggleShowForm: () => void;
    items: TOTPItem[];
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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentTOTP, setCurrentTOTP] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [items, setItems] = useState<TOTPItem[]>([]);
    const [expiresDate, setExpiresDate] = useState<number>(30);
    const [currentTime, setCurrentTime] = useState<number>(Date.now());
    function toggleShowForm() {
        setShowForm((prev) => !prev);
    }

    const fetchApi = useCallback(async (): Promise<void> => {
        setError(null);
        setIsLoading(true);
        try {
            const result = await getTotp();
            setItems(result);

            setCurrentTOTP(result.otp);
            setCurrentTime(result?.now);
        } catch (err: any) {
            setError(err.message || 'Erro ao consumir api');
        } finally {
            setIsLoading(false);
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
        isLoading,
        showForm,
        toggleShowForm,
        items,
    };
}
