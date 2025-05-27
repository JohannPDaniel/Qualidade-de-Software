import { StudentService } from '../../../src/service';
import { prismaMock } from '../../config/prisma.mock';
import { StudentMock } from '../../mock/student.mock';

describe('StudentService - FindAll', () => {
	const createSut = () => new StudentService();

	it('Deve retornar todos os estudantes quando nenhum filtro é fornecido', async () => {
		const sut = createSut();
		const students = [StudentMock.build(), StudentMock.build()];

		prismaMock.student.findMany.mockResolvedValue(students);

		const result = await sut.findAll({});

		expect(result.code).toBe(200);
		expect(result.success).toBe(true);
		expect(result.data).toHaveLength(2);
	});

	it('Deve filtrar estudantes pelo nome de forma insensível', async () => {
		const sut = createSut();
		const mockStudent = StudentMock.build({ name: 'Johann' });

		prismaMock.student.findMany.mockResolvedValue([mockStudent]);

		const result = await sut.findAll({ name: 'joHAnn' });

		expect(prismaMock.student.findMany).toHaveBeenCalledWith({
			where: {
				name: { contains: 'joHAnn', mode: 'insensitive' },
			},
		});

		expect(result.code).toBe(200);
		expect(result.data).toEqual([sut['mapToDto'](mockStudent)]);
	});

	it('Deve filtrar estudantes pelo CPF', async () => {
		const sut = createSut();
		const mockStudent = StudentMock.build({ cpf: '12345678901' });

		prismaMock.student.findMany.mockResolvedValue([mockStudent]);

		const result = await sut.findAll({ cpf: '123' });

		expect(prismaMock.student.findMany).toHaveBeenCalledWith({
			where: {
				cpf: { contains: '123' },
			},
		});

		expect(result.data[0].cpf).toContain('123');
	});

	it('Deve filtrar estudantes pelo nome e CPF simultaneamente', async () => {
		const sut = createSut();
		const mockStudent = StudentMock.build({
			name: 'Maria',
			cpf: '98765432100',
		});

		prismaMock.student.findMany.mockResolvedValue([mockStudent]);

		const result = await sut.findAll({ name: 'mar', cpf: '987' });

		expect(prismaMock.student.findMany).toHaveBeenCalledWith({
			where: {
				name: { contains: 'mar', mode: 'insensitive' },
				cpf: { contains: '987' },
			},
		});

		expect(result.data[0].name).toContain('Mar');
		expect(result.data[0].cpf).toContain('987');
	});

	it('Deve retornar uma lista vazia quando nenhum estudante for encontrado', async () => {
		const sut = createSut();

		prismaMock.student.findMany.mockResolvedValue([]);

		const result = await sut.findAll({ name: 'NomeInexistente' });

		expect(result.code).toBe(200);
		expect(result.data).toHaveLength(0);
	});

	it('Deve retornar os estudantes com os dados mapeados pelo DTO', async () => {
		const sut = createSut();
		const mockStudent = StudentMock.build({ password: 'hash_senha' });

		prismaMock.student.findMany.mockResolvedValue([mockStudent]);

		const result = await sut.findAll({});

		expect(result.data[0]).not.toHaveProperty('password');
		expect(result.data[0]).toMatchObject({
			id: mockStudent.id,
			name: mockStudent.name,
			email: mockStudent.email,
			type: mockStudent.type,
			cpf: mockStudent.cpf,
		});
	});
});
