import { StudentType } from '@prisma/client';
import { randomUUID } from 'crypto';

interface StudentMockInterface {
	id?: string;
	name?: string;
	email?: string;
	password?: string;
	type?: StudentType | string; 
	age?: number | null;
	cpf?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export class StudentMock {
	public static build(params?: StudentMockInterface) {
		const validTypes = [StudentType.F, StudentType.M, StudentType.T];
		const type = validTypes.includes(params?.type as StudentType)
			? (params?.type as StudentType)
			: StudentType.F;

		return {
			id: params?.id || randomUUID(),
			name: params?.name || 'any_name',
			email: params?.email || 'any_email',
			password: params?.password || 'hash_password',
			type,
			age: params?.age ?? null,
			cpf: params?.cpf || 'any_cpf',
			createdAt: params?.createdAt || expect.any(Date),
			updatedAt: params?.updatedAt || expect.any(Date),
			assessments: undefined,
		};
	}
}
