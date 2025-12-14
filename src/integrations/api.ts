const API_URL = 'http://192.168.0.27:3000/api';


export async function getTotp() {
	const baseUrl = `${API_URL}/totp`;
	try {
		const res = await fetch(`${baseUrl}`);

		if (!res.ok) {
			throw new Error(`Response status: ${res.status}`);
		}

		const data = (await res.json()) || {};
		console.log(data);
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}

}
