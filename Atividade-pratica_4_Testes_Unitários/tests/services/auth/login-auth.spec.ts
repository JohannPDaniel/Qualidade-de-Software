import { prismaMock } from '../../config/prisma.mock';
import { AuthService } from '../../../src/service/auth.service';
import { StudentMock } from '../../mock/student.mock';
import { Bcrypt } from '../../../src/utils/bcript';
import { JWT } from '../../../src/utils/jwt';

describe('AuthService - login', () => {
	const createSut = () => new AuthService();
	const loginDto = { email: 'user@email.com', password: 'senha123' };

	it('Deve retornar 404 quando não for informado um e-mail correto', async () => {
		const sut = createSut();

		prismaMock.student.findUnique.mockResolvedValue(null);

		const result = await sut.login(loginDto);

		expect(result.code).toBe(404);
		expect(result.success).toBe(false);
		expect(result.message).toMatch(/e-mail/i);
	});

	it('Deve retornar 404 quando não for informado uma senha correta', async () => {
		const sut = createSut();

		const student = StudentMock.build();
		prismaMock.student.findUnique.mockResolvedValue(student);

		jest.spyOn(Bcrypt.prototype, 'verify').mockResolvedValue(false);

		const result = await sut.login(loginDto);

		expect(result.code).toBe(404);
		expect(result.success).toBe(false);
		expect(result.message).toMatch(/senha/i);
	});

	it('Deve ser realizado login quando fornecido um e-mail e senha corretos', async () => {
		const sut = createSut();
		const student = StudentMock.build();

		const payload = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};

		prismaMock.student.findUnique.mockResolvedValue(student);
		jest.spyOn(Bcrypt.prototype, 'verify').mockResolvedValue(true);

		const jwtSpy = jest
			.spyOn(JWT.prototype, 'generateToken')
			.mockReturnValue('fake.jwt.token');

		const result = await sut.login({
			email: student.email,
			password: 'senha_correta',
		});

		expect(jwtSpy).toHaveBeenCalledWith(payload);
		expect(result.success).toBe(true);
		expect(result.code).toBe(200);
		expect(result.data.token).toBe('fake.jwt.token');
		expect(result.data.student).toEqual(payload);
	});

	it('Deve retornar 404 quando a senha for vazia', async () => {
		const sut = createSut();
		const student = StudentMock.build();

		prismaMock.student.findUnique.mockResolvedValue(student);
		jest.spyOn(Bcrypt.prototype, 'verify').mockResolvedValue(false);

		const result = await sut.login({ email: student.email, password: '' });

		expect(result.success).toBe(false);
		expect(result.code).toBe(404);
		expect(result.message).toMatch(/senha/i);
	});

	it('Deve lançar erro se ocorrer falha no banco de dados', async () => {
		const sut = createSut();

		prismaMock.student.findUnique.mockRejectedValue(
			new Error('Falha no banco')
		);

		await expect(sut.login(loginDto)).rejects.toThrow('Falha no banco');
	});

	it('Deve chamar bcrypt.verify com senha e hash corretos', async () => {
		const sut = createSut();
		const student = StudentMock.build();

		prismaMock.student.findUnique.mockResolvedValue(student);

		const verifySpy = jest
			.spyOn(Bcrypt.prototype, 'verify')
			.mockResolvedValue(true);
		jest
			.spyOn(JWT.prototype, 'generateToken')
			.mockReturnValue('fake.jwt.token');

		await sut.login({ email: student.email, password: 'senha123' });

		expect(verifySpy).toHaveBeenCalledWith('senha123', student.password);
	});

	it('Deve retornar a estrutura correta de dados ao fazer login', async () => {
		const sut = createSut();
		const student = StudentMock.build();

		const payload = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};

		prismaMock.student.findUnique.mockResolvedValue(student);
		jest.spyOn(Bcrypt.prototype, 'verify').mockResolvedValue(true);
		jest
			.spyOn(JWT.prototype, 'generateToken')
			.mockReturnValue('fake.jwt.token');

		const result = await sut.login({
			email: student.email,
			password: 'senha123',
		});

		expect(result.success).toBe(true);
		expect(result.code).toBe(200);
		expect(result.data).toEqual({
			student: payload,
			token: 'fake.jwt.token',
		});
	});
});
