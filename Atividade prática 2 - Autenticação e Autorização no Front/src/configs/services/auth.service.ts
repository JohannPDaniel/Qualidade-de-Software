import { LoginRequest } from '../../utils/types/auth';
import { api, ResponseAPI } from './api.service';

export async function loginService(
	data: Omit<LoginRequest, 'remember'>
): Promise<ResponseAPI> {
	try {
		const { email, password } = data;
		const response = await api.post('/login', { email, password });
		return {
			success: response.data.success,
			message: response.data.message,
			data: response.data.data,
		};
	} catch (error: any) {
		return {
			success: error.response.data.success,
			message: error.response.data.message,
		};
	}
}
