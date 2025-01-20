import axios from 'axios';

export interface ResponseAPI {
	success: true,
	message: string,
	data?: any;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;
export const api = axios.create({
	baseURL,
});
