import { Prisma } from "@prisma/client";

export interface CreateAssessmentDto {
	title: string;
	description: string;
	grade: number;
	studentId: string;
}

export interface UpdateAssessmentDto {
	title?: string;
	description?: string;
	grade?: number | Prisma.Decimal;
}

export interface AssessmentDto {
	id: string;
	title: string;
	description?: string | null;
	grade: number | Prisma.Decimal;
	studentId: string;
	createdAt: Date;
	updatedAt: Date;
}
