import { AssessmentService } from '../../../src/service';
import { prismaMock } from '../../config/prisma.mock';
import { CreateAssessmentDto } from '../../dtos';
import { AssessmentMock } from '../../mock/assessments.mock';
import { StudentMock } from '../../mock/student.mock';
import { AuthStudent } from "../../types/student.types";

describe('AssessmentService - Create', () => {
	const createSut = () => new AssessmentService();

	it('Deve retornar 404 quando o Id do Estudante não for encontrado', async () => {
		const sut = createSut();

		const assessmentMock = AssessmentMock.build();
		const studentMock = StudentMock.build();

		const createAssessmentDto: CreateAssessmentDto = {
			title: assessmentMock.title,
			description: assessmentMock.description ?? "",
			grade:
				typeof assessmentMock.grade === 'number'
					? assessmentMock.grade
					: assessmentMock.grade.toNumber(),
			studentId: assessmentMock.studentId,
		};

		const authStudent = {
			id: studentMock.id,
			name: studentMock.name,
			email: studentMock.email,
			type: studentMock.type,
		};

		prismaMock.student.findUnique.mockResolvedValue(null);

		const result = await sut.create(createAssessmentDto, authStudent);

		expect(result.code).toBe(404);
		expect(result.success).toBe(false);
		expect(result.message).toMatch(/estudante.*não encontrado/i);
	});

	it('Deve criar uma avaliação quando fornecido um ID de Estudante válido', async () => {
		const sut = createSut();

		const assessmentMock = AssessmentMock.build({
			studentId: 'Id_do_Estudante',
		});
		const studentMock = StudentMock.build();

		const createAssessmentDto: CreateAssessmentDto = {
			title: assessmentMock.title,
			description: assessmentMock.description ?? "",
			grade:
				typeof assessmentMock.grade === 'number'
					? assessmentMock.grade
					: assessmentMock.grade.toNumber(),
			studentId: assessmentMock.studentId,
		};

		const authStudent: AuthStudent = {
			id: studentMock.id,
			name: studentMock.name,
			email: studentMock.email,
			type: studentMock.type, 
		};

		prismaMock.student.findUnique.mockResolvedValue(studentMock);
		prismaMock.assessment.create.mockResolvedValue(assessmentMock);

		const result = await sut.create(createAssessmentDto, authStudent);
		console.log('result:', result.message);

		expect(result.code).toBe(201);
		expect(result.success).toBe(true);
		expect(result.message).toMatch(/sucesso/i);
	});
});
