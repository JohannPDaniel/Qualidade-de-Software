import { StudentsCreate } from "../../utils/types/student";
import { api } from "./api.service";

export async function createStudents(data: StudentsCreate) {
	try {
		const response = await api.post('/students', data);
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
