export type TOTPItem = {
    id: string;
    label?: string;
    totp?: string;
    timeRemaining: number;
    period: number;
    error?: string;
    otp: string;
    isValid?: boolean;
};
