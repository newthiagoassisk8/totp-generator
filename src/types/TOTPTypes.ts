export interface TOTPConfig {
    secret: string;
    digits: number;
    period: number;
    algorithm: 'sha1' | 'sha256' | 'sha512';
}

export interface TOTPResult {
    code: string;
    timeRemaining: number;
    isValid: boolean;
}
