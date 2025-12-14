import { authenticator } from '@otplib/preset-browser';
import { TOTPConfig } from '../types/TOTPTypes';

export const generateTOTP = (config: TOTPConfig): string => {
    if (!config.secret || config.secret.trim() === '') {
        throw new Error('Secret key is required');
    }

    // Configure otplib with the provided settings
    authenticator.options = {
        digits: config.digits,
        period: config.period,
        algorithm: config.algorithm,
        window: 0,
    };

    try {
        // Generate TOTP using the current time
        const totp = authenticator.generate(config.secret);
        console.log('otplib generated TOTP:', totp, 'for secret:', config.secret); // Debug log
        return totp;
    } catch (error) {
        console.error('otplib error:', error); // Debug log
        throw new Error(`Failed to generate TOTP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

// Test function to verify otplib is working
export const testTOTPGeneration = (): string => {
    try {
        const testSecret = 'JBSWY3DPEHPK3PXP'; // Google's test secret
        const totp = authenticator.generate(testSecret);
        console.log('Test TOTP generation successful:', totp);
        return totp;
    } catch (error) {
        console.error('Test TOTP generation failed:', error);
        throw error;
    }
};

export const validateSecret = (secret: string): boolean => {
    if (!secret || secret.trim() === '') {
        return false;
    }

    // More lenient base32 validation - allow common characters
    const base32Regex = /^[A-Z2-7]+=*$/i;
    const cleanedSecret = secret.replace(/[\s\-_]/g, '').toUpperCase();
    return base32Regex.test(cleanedSecret);
};

export const formatSecret = (secret: string): string => {
    // Remove spaces and convert to uppercase
    return secret.replace(/\s/g, '').toUpperCase();
};
