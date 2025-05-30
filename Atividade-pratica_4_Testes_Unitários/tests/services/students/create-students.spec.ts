import { StudentService } from '../../../src/service/student.service';
import { prismaMock } from '../../config/prisma.mock';
import { StudentMock } from '../../mock/student.mock';
import { Bcrypt } from '../../../src/utils/bcript';

describe('StudentService - Create', () => {
	const createSut = () => new StudentService();
	const student = StudentMock.build({
		email: 'any_email',
		cpf: 'any_cpf',
	});

	it('Deve retornar 409 quando o E-mail estiver em uso', async () => {
		const sut = createSut();

		prismaMock.student.findFirst.mockResolvedValue(student);

		const result = await sut.create({
			name: 'any_name',
			email: 'any_email',
			password: 'hash_password',
			type: 'M',
			age: 20,
			cpf: '11111111111',
		});

		expect(result.code).toBe(409);
		expect(result.success).toBeFalsy;
		expect(result.message).toMatch(/email/i);
		expect(result.data).toBeUndefined();
		expect(prismaMock.student.findFirst).toHaveBeenCalledWith({
			where: {
				OR: [{ email: 'any_email' }, { cpf: '11111111111' }],
			},
		});
	});

	it('Deve retornar 409 quando o CPF estiver em uso', async () => {
		const sut = createSut();

		prismaMock.student.findFirst.mockResolvedValue(student);

		const result = await sut.create({
			name: 'any_name',
			email: 'email@email.com',
			password: 'hash_password',
			type: 'M',
			age: 20,
			cpf: 'any_cpf',
		});

		expect(result.code).toBe(409);
		expect(result.success).toBeFalsy;
		expect(result.message).toMatch(/cpf/i);
		expect(result.data).toBeUndefined();
		expect(prismaMock.student.findFirst).toHaveBeenCalledWith({
			where: {
				OR: [{ email: 'email@email.com' }, { cpf: 'any_cpf' }],
			},
		});
	});

	it('Deve cadastrar um estudante quando fornecido um body válido', async () => {
		const sut = createSut();

		prismaMock.student.findFirst.mockResolvedValue(null);

		const studentMock = StudentMock.build({
			email: 'email@email.com',
			cpf: '11111111111',
			type: 'M',
			age: null,
		});

		const hashSpy = jest
			.spyOn(Bcrypt.prototype, 'generateHash')
			.mockResolvedValue('hash_password');

		prismaMock.student.create.mockResolvedValue(studentMock);

		const result = await sut.create({
			name: 'any_name',
			email: 'email@email.com',
			password: 'hash_password',
			type: 'M',
			cpf: '11111111111',
			age: null,
		});

		expect(result.code).toBe(201);
		expect(result.success).toBe(true);
		expect(result.message).toMatch(/sucesso/i);
		expect(result.data).toMatchObject({
			id: studentMock.id,
			name: 'any_name',
			email: 'email@email.com',
			cpf: '11111111111',
			type: 'M',
			age: null,
			assessments: undefined,
		});

		expect(prismaMock.student.create).toHaveBeenCalledWith({
			data: {
				name: 'any_name',
				email: 'email@email.com',
				password: 'hash_password',
				type: 'M',
				cpf: '11111111111',
				age: null,
			},
		});

		expect(hashSpy).toHaveBeenCalledWith('hash_password');
	});
});
