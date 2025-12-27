import { createContext, ReactNode, useContext } from 'react';
import { useTotp, useTotpParams, UseTotpReturn } from '../hooks/useTotpFetching';

type TotpProviderProps = useTotpParams & {
    children: ReactNode;
};

const TotpContext = createContext<UseTotpReturn | null>(null);

export function TotpProvider({ children, secret }: TotpProviderProps) {
    const totp = useTotp({ secret });

    return <TotpContext.Provider value={totp}>{children}</TotpContext.Provider>;
}

export function useTotpContext(): UseTotpReturn {
    const context = useContext(TotpContext);

    if (!context) {
        throw new Error('useTotpContext must be used within TotpProvider');
    }

    return context;
}

export { TotpContext };
