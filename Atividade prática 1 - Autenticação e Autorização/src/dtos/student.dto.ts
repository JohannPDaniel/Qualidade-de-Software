import { StudentType } from '@prisma/client';

export interface CreateStudentDto {
	name: string;
	email: string;
	password: string;
	type: StudentType;
	age?: number;
	cpf: string;
}

export interface StudentDto {
	id: string;
	name: string;
	email: string;
	type: StudentType;
	age?: number | null;
	cpf: string;
	assessments?: Array<Assessments>;
}

export interface updateStudentDto {
	name?: string;
	password?: string;
	type?: StudentType;
	age?: number | null;
}

export interface Assessments {
	id: string;
	title: string;
	description?: string | null;
	grade: number;
}

export interface QueryFilterDto {
	name?: string;
	cpf?: string;
}
