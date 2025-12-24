import { UpdateTotpParams } from '../hooks/useTotpFetching';

const API_URL = import.meta.env.VITE_API_URL;

export async function getTotp() {
    const baseUrl = `${API_URL}/totp`;
    try {
        const res = await fetch(`${baseUrl}`);

        if (!res.ok) {
            throw new Error(`Response status: ${res.status}`);
        }

        const data = (await res.json()) || {};
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function updateTotp(params: UpdateTotpParams) {
    try {
        const response = await fetch(`${API_URL}/totp`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}
