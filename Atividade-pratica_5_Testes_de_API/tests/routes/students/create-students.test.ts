import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { StudentMock } from '../../mock/student.mock';
import { StudentService } from '../../../src/service';

describe('POST /students', () => {
	const server = createExpressServer();
	const endpoint = '/students';
	const students = StudentMock.build();

	it('Deve retornar 400 quando não informado um name', async () => {
		const body = {};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/nome/i);
	});

	it('Deve retornar 400 quando não informado um e-mail', async () => {
		const body = { name: 1 };

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/e-mail/i);
	});

	it('Deve retornar 400 quando não informado uma senha', async () => {
		const body = { name: 1, email: 2 };

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/senha/i);
	});

	it('Deve retornar 400 quando não informado um tipo de estudante', async () => {
		const body = { name: 1, email: 2, password: 3 };

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/tipo/i);
	});

	it('Deve retornar 400 quando não informado um cpf', async () => {
		const body = { name: 1, email: 2, password: 3, type: 4 };

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/cpf/i);
	});

	it('Deve retornar 400 quando não vir um nome em formato de texto', async () => {
		const body = {
			name: 1,
			email: 2,
			password: 3,
			type: 4,
			cpf: 5,
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/nome.*string/i);
	});

	it('Deve retornar 400 quando não vir um e-mail em formato de texto', async () => {
		const body = {
			name: '1',
			email: 2,
			password: 3,
			type: 4,
			cpf: 5,
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/e-mail.*string/i);
	});

	it('Deve retornar 400 quando não vir uma senha em formato de texto', async () => {
		const body = {
			name: '1',
			email: '2',
			password: 3,
			type: 4,
			cpf: 5,
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/senha.*string/i);
	});

	it('Deve retornar 400 quando não vir um tipo válido', async () => {
		const body = {
			name: '1',
			email: '2',
			password: '3',
			type: 4,
			cpf: 5,
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/T.*M.*F/i);
	});

	it('Deve retornar 400 quando vier idade, ela não vir em formato de número', async () => {
		const body = {
			name: '1',
			email: '2',
			password: '3',
			type: 'M',
			age: true,
			cpf: 5,
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/idade.*número/i);
	});

	it('Deve retornar 400 quando vier idade, ela for menor que 0', async () => {
		const body = {
			name: '1',
			email: '2',
			password: '3',
			type: 'M',
			age: -5,
			cpf: 5,
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/idade.*negativa/i);
	});

	it('Deve retornar 400 quando não vir um cpf em formato de string', async () => {
		const body = {
			name: '1',
			email: '2',
			password: '3',
			type: 'M',
			age: 5,
			cpf: 6,
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/cpf.*string/i);
	});

	it('Deve retornar 400 quando o nome vir com menos de 3 caracteres', async () => {
		const body = {
			name: 'ab',
			email: '2',
			password: '3',
			type: 'M',
			age: 5,
			cpf: '6',
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/nome.*caracteres/i);
	});

	it('Deve retornar 400 quando a senha não tiver pelo menos 4 caracteres', async () => {
		const body = {
			name: 'Johann',
			email: '2',
			password: '123',
			type: 'M',
			age: 5,
			cpf: '6',
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/senha.*caracteres/i);
	});

	it('Deve retornar 400 quando o e-mail não tiver @ e .com', async () => {
		const body = {
			name: 'Johann',
			email: 'email',
			password: 'senha123',
			type: 'M',
			age: 5,
			cpf: '6',
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/(@).*(.com)/i);
	});

	it('Deve retornar 400 quando o cpf não tiver pelo menos 11 caracteres', async () => {
		const body = {
			name: 'Johann',
			email: 'email@email.com',
			password: 'senha123',
			type: 'M',
			age: 5,
			cpf: '123456789',
		};

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/cpf.*caracteres/i);
	});

	it('Deve retornar um estudante criado quando informado um body válido', async () => {
		const body = {
			name: 'Johann',
			email: 'email@email.com',
			password: 'senha123',
			type: 'M',
			age: 30,
			cpf: '12345678901',
		};

		jest.spyOn(StudentService.prototype, 'create').mockResolvedValue({
			success: true,
			code: 201,
			message: 'Estudante cadastrado com sucesso !',
			data: {},
		});

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(201);
		expect(response.body.success).toBeTruthy();
		expect(response.body.message).toMatch(/estudante.*sucesso/i);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const body = {
			name: 'Johann',
			email: 'email@email.com',
			password: 'senha123',
			type: 'M',
			age: 30,
			cpf: '12345678901',
		};

		jest
			.spyOn(StudentService.prototype, 'create')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
