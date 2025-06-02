import { prismaMock } from '../../config/prisma.mock';
import { AssessmentMock } from '../../mock/assessments.mock';
import { AssessmentService } from '../../../src/service';

describe('AssessmentService - Remove', () => {
	const createSut = () => new AssessmentService();

	it('Deve retornar 404 quando a avaliação não for encontrada', async () => {
		const sut = createSut();

		const assessmentMock = AssessmentMock.build();

		prismaMock.assessment.findUnique.mockResolvedValue(null);

		const result = await sut.remove(assessmentMock.id);

		expect(result.code).toBe(404);
		expect(result.success).toBeFalsy();
		expect(result.message).toMatch(/não.*encontrada/i);
		expect(result.data).toBeUndefined();
	});

	it('Deve deletar uma avaliação quando fornecido um Id válido', async () => {
		const sut = createSut();

		const assessmentMock = AssessmentMock.build();

		prismaMock.assessment.findUnique.mockResolvedValue(assessmentMock);

		prismaMock.assessment.delete.mockResolvedValue(assessmentMock);

		const result = await sut.remove(assessmentMock.id);

		expect(result.code).toBe(200);
		expect(result.success).toBeTruthy();
		expect(result.message).toMatch(/excluída.*sucesso/i);
		expect(result.data).toEqual({
			...assessmentMock,
			grade: parseFloat(assessmentMock.grade as unknown as string),
		});
		expect(prismaMock.assessment.findUnique).toHaveBeenCalledWith({
			where: { id: assessmentMock.id },
		});
		expect(prismaMock.assessment.delete).toHaveBeenCalledWith({
			where: { id: assessmentMock.id },
		});
	});
});
