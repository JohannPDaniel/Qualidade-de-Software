import { Assessment, CreateAssessmentRequest } from '../../utils/types/assessment';
import { api, ResponseAPI } from './api.service';

export async function createAssessmentService(
	data: CreateAssessmentRequest & { token: string; studentId: string }
): Promise<ResponseAPI> {
	try {
		const { token, studentId, ...restData } = data;

		const response = await api.post('/assessments', restData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log('response:', response)

		return {
			success: response.data.success,
			message: response.data.message,
			data: response.data.data,
		};
	} catch (error: any) {
		return {
			success: error.response?.data?.success ?? false,
			message: error.response?.data?.message ?? error.message,
		};
	}
}

export async function findAllAssessmentsService(token: string): Promise<ResponseAPI> {
    try {
        const response = await api.get('/assessments', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
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

export async function updateAssessmentService(
	data: { id: string; token: string } & Partial<Assessment>
): Promise<ResponseAPI> {
	try {
		const { token, id, ...restData } = data;

		const response = await api.put(`/assessments/${id}`, restData, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return {
			success: response.data.success,
			message: response.data.message,
			data: response.data.data,
		};
	} catch (error: any) {
		return {
			success: error.response?.data?.success ?? false,
			message: error.response?.data?.message ?? error.message,
		};
	}
}

export async function deleteAssessmentService(
	id: string,
	token: string
): Promise<ResponseAPI> {
	try {
		const response = await api.delete(`/assessments/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return {
			success: response.data.success,
			message: response.data.message,
			data: response.data.data
		};
	} catch (error: any) {
		return {
			success: error.response?.data?.success ?? false,
			message: error.response?.data?.message ?? error.message,
		};
	}
}
