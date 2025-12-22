export type TotpItem = {
    uid: string;
    label: string;
    icon: string | null;
    key: string;
};
const API_URL = 'http://192.168.0.27:3000/api';

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

function sleep(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const TOTPKeys = {
    item1: {
        uid: "item1",
        label: "Demo 1 - 1 digitos",
        icon: null,
        key: "BBBBBBBBBBBBBBB",
        opts: { digits: 6, period: 30 },
    }
};

export async function mockGetTotps() {
    await sleep(4500); // simula rede
    return Object.values(TOTPKeys).map((x) => structuredClone(x));
}
