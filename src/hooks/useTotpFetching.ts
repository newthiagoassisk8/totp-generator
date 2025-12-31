import { useCallback, useEffect, useState } from 'react';
import { getTotp, updateTotp } from '../integrations/api';
import { TOTPItem } from '../types/TOTPItem';

export interface useTotpParams {
    secret?: string;
}

export interface UpdateTotpParams {
    id: string;
    label: string;
    digits: number;
}
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
    isModalOpen: boolean;
    toggleShowForm: () => void;
    update: (payload: UpdateTotpParams) => Promise<void>;
    closeModal: () => void;
    items: TOTPItem[];
    needsRefresh: boolean | null;
}
/**
 * currentTotp, now e expireDate precisa ser checado antes de exportar
 *
 * Secret é o parametro que estou madando para a API
 * currentTotp, now e expireDate é o retorno da requisição
 *
 */
export function useTotp(): UseTotpReturn {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentTOTP, setCurrentTOTP] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [needsRefresh, setNeedsRefresh] = useState<boolean | null>(false);
    const [items, setItems] = useState<TOTPItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expiresDate, setExpiresDate] = useState<number>(30);
    const [currentTime, setCurrentTime] = useState<number>(Date.now());

    function toggleShowForm() {
        setShowForm((prev) => !prev);
    }

    const fetchApi = useCallback(async (): Promise<void> => {
        setError(null);
        setNeedsRefresh(false);

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
    }, []);

    const saveTotp = async (payload: { digits: number; label: string; id: string }) => {
        setError(null);
        setIsLoading(true);

        try {
            await updateTotp(payload);
            await fetchApi();
            setIsModalOpen(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message ?? 'Erro ao salvar TOTP');
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Efeito para disparar a verificação automática (com debounce)
     */
    useEffect(() => {
            const timer = setTimeout(() => {
                fetchApi();
            }, 500);

            return () => clearTimeout(timer);
    }, [fetchApi]);

    return {
        currentTOTP,
        expiresDate,
        error,
        now: currentTime,
        reload: fetchApi,
        isLoading,
        showForm,
        toggleShowForm,
        update: saveTotp,
        closeModal: () => setIsModalOpen(false),
        items,
        isModalOpen,
        needsRefresh,
    };
}
