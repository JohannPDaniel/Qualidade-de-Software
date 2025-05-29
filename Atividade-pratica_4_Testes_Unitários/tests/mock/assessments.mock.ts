import { Assessment, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { StudentMock } from './student.mock';

export class AssessmentMock {
	public static build(params?: Partial<Assessment>) {
		const student = StudentMock.build();

		return {
			id: params?.id || randomUUID(),
			title: params?.title || 'any_title',
			description: params?.description || 'any_description',
			grade:
				params?.grade instanceof Prisma.Decimal
					? params.grade
					: new Prisma.Decimal(params?.grade ?? 8.5),
			studentId: params?.studentId || student.id,
			createdAt: params?.createdAt || new Date(),
			updatedAt: params?.updatedAt || new Date(),
		};
	}
}
