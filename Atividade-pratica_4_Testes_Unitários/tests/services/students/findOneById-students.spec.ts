import { StudentService } from '../../../src/service';
import { prismaMock } from '../../config/prisma.mock';
import { StudentMock } from '../../mock/student.mock';

describe('StudentService - FindOneById', () => {
	const createSut = () => new StudentService();

	it('Deve retornar 403 quando o id do estudante não for igual ao id cadastrado', async () => {
		const sut = createSut();

		const studentMock = StudentMock.build({
			id: 'Id_Cadastrado',
		});

		const result = await sut.findOneById('Id_Diferente', studentMock.id);

		expect(result.code).toBe(403);
		expect(result.success).toBeFalsy();
		expect(result.message).toBe(
			'Acesso negado: você não tem permissão para acessar este estudante.'
		);
	});

	it('Deve retornar 404 quando o Id do estudante não for encontrado', async () => {
		const sut = createSut();

		const studentMock = StudentMock.build({ id: 'Id_Cadastrado' });

		prismaMock.student.findUnique.mockResolvedValue(null);

		const result = await sut.findOneById(studentMock.id, studentMock.id);

		expect(result.code).toBe(404);
		expect(result.success).toBe(false);
		expect(result.message).toBe('Estudante não encontrado !!!');
	});

	it('Deve retornar um estudante encontrado quando informado um Id válido', async () => {
		const sut = createSut();

		const studentMock = StudentMock.build({ id: 'Id_Cadastrado' });

		prismaMock.student.findUnique.mockResolvedValue(studentMock);

		const result = await sut.findOneById(studentMock.id, studentMock.id);
		console.log('result:', result.message);

		expect(result.code).toBe(200);
		expect(result.success).toBeTruthy();
		expect(result.message).toBe('Estudante encontrado com sucesso!');
		expect(result.data).toMatchObject({
			id: studentMock.id,
			name: studentMock.name,
			email: studentMock.email,
			cpf: studentMock.cpf,
			type: studentMock.type,
			age: studentMock.age,
			assessments: studentMock.assessments,
		});
	});
});
