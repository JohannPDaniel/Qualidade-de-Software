import { Assessment } from '@prisma/client';
import { AssessmentService, UpdateDTO } from '../../../src/service';
import { prismaMock } from '../../config/prisma.mock';
import { AssessmentMock } from '../../mock/assessments.mock';

describe('AssessmentService - Update', () => {
	const createSut = () => new AssessmentService();

	it('Deve retornar 404 quando a avaliação não for encontrada', async () => {
		const sut = createSut();

		const assessmentMock = AssessmentMock.build();

		const updateAssessments: UpdateDTO = {
			title: assessmentMock.title,
			description: assessmentMock.description ?? '',
			grade: assessmentMock.grade,
		};

		prismaMock.assessment.findUnique.mockResolvedValue(null);

		const result = await sut.update(assessmentMock.id, updateAssessments);

		expect(result.code).toBe(404);
		expect(result.success).toBeFalsy();
		expect(result.message).toMatch(/não.*encontrada/i);
		expect(result.data).toBeUndefined();
	});

	it('Deve retornar a avaliação atualizada quando informado um id correto e um body válido', async () => {
		const sut = createSut();

		const assessmentMock = AssessmentMock.build();

		const updateAssessments: UpdateDTO = {
			title: assessmentMock.title,
			description: assessmentMock.description ?? '',
			grade: assessmentMock.grade,
		};

		prismaMock.assessment.findUnique.mockResolvedValue(assessmentMock);

		prismaMock.assessment.update.mockResolvedValue(assessmentMock);

		const result = await sut.update(assessmentMock.id, updateAssessments);

		expect(result.code).toBe(200);
		expect(result.success).toBe(true);
		expect(result.message).toMatch(/atualizada com sucesso/i);
		expect(result.data).toEqual({
			...assessmentMock,
			grade: parseFloat(assessmentMock.grade as unknown as string),
		});
	});
});
