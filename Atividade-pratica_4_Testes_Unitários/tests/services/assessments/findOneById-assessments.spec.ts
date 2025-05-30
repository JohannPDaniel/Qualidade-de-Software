import { AssessmentService } from '../../../src/service';
import { prismaMock } from '../../config/prisma.mock';
import { AssessmentMock } from '../../mock/assessments.mock';

describe('AssessmentService - FindOneById', () => {
	const createSut = () => new AssessmentService();

	it('Deve retornar 404 quando a avaliação não for encontrada', async () => {
		const sut = createSut();

		const assessmentMock = AssessmentMock.build();

		prismaMock.assessment.findUnique.mockResolvedValue(null);

		const result = await sut.findOneById(assessmentMock.id);

		expect(result.code).toBe(404);
		expect(result.success).toBeFalsy();
		expect(result.message).toMatch(/não.*encontrado/i);
		expect(result.data).toBeUndefined();
	});

	it('Deve retornar a avaliação buscada quando informado um Id válido', async () => {
		const sut = createSut();

		const assessmentMock = AssessmentMock.build();

		prismaMock.assessment.findUnique.mockResolvedValue(assessmentMock);

		const result = await sut.findOneById(assessmentMock.id);
		console.log('result:', result.data);

		expect(result.code).toBe(200);
		expect(result.success).toBe(true);
		expect(result.message).toMatch(/sucesso/i);
		expect(result.data).toEqual({
			...assessmentMock,
			grade: parseFloat(assessmentMock.grade as unknown as string),
		});
	});
});
