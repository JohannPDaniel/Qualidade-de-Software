import { AssessmentService } from '../../../src/service';
import { prismaMock } from '../../config/prisma.mock';
import { AssessmentMock } from '../../mock/assessments.mock';
import { StudentMock } from '../../mock/student.mock';
import { AuthStudent } from '../../types/student.types';

describe('AssessmentService - FindAll', () => {
	const createSut = () => new AssessmentService();

	it('Deve retornar 404 se a avaliação do estudante não for encontrada', async () => {
		const sut = createSut();

		const studentMock = StudentMock.build();

		const studentLogged: AuthStudent = {
			id: studentMock.id,
			name: studentMock.name,
			email: studentMock.email,
			type: studentMock.type,
		};

		const query = {
			page: 1,
			take: 5,
		};

		prismaMock.assessment.findMany.mockResolvedValue([]);

		const result = await sut.findAll(studentLogged, query);

		expect(result.code).toBe(404);
		expect(result.success).toBe(false);
		expect(result.message).toMatch('Avaliação do estudante não encontrada');
		expect(result.data).toBeUndefined();
	});

	it('Deve retornar as avaliações buscadas quando informada uma lista de avaliação válida', async () => {
		const sut = createSut();

		const studentMock = StudentMock.build({ type: 'M' });
		const assessmentMock = AssessmentMock.build();

		const studentLogged: AuthStudent = {
			id: studentMock.id,
			name: studentMock.name,
			email: studentMock.email,
			type: studentMock.type,
		};

		const query = {
			page: 1,
			take: 5,
		};

		prismaMock.assessment.findMany.mockResolvedValue([assessmentMock]);

		const result = await sut.findAll(studentLogged, query);

		expect(result.code).toBe(200);
		expect(prismaMock.assessment.findMany).toHaveBeenCalledWith({
			skip: query.page,
			take: query.take,
			where: { studentId: studentMock.id },
			orderBy: { createdAt: 'asc' },
		});
	});
});
