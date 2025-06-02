import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { AuthService } from '../../../src/service';
import { StudentMock } from '../../mock/student.mock';

describe('POST /login', () => {
	const server = createExpressServer();
	const endpoint = '/login';
	const student = StudentMock.build();

	it('Deve retornar 400 quando o email não for informado', async () => {
		const body = {};
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/Email.*obrigatório/i);
	});

	it('Deve retornar 400 quando a senha não for informado', async () => {
		const body = { email: 1 };
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/Senha.*obrigatório/i);
	});

	it('Deve retornar 400 quando o e-mail não vir como uma string', async () => {
		const body = { email: 1, password: 1 };
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/email.*string/i);
	});

	it('Deve retornar 400 quando a senha não vir como uma string', async () => {
		const body = { email: 'email@email.com', password: 1 };
		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body).toHaveProperty('message');
		expect(typeof response.body.message).toBe('string');
		expect(response.body.message).toMatch(/senha.*string/i);
	});

	it('Deve permitir o login quando informado um e-mail e senha corretos', async () => {
		const body = {
			email: 'email@email.com',
			password: 'senha123',
		};

		jest.spyOn(AuthService.prototype, 'login').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Login efetuado com sucesso !',
			data: {
				student,
				token: 'any_token',
			},
		});

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.status).toBe(200);
		expect(response.body.success).toBeTruthy();
		expect(response.body.message).toMatch(/Login.*sucesso/i);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const body = { email: 'email@email.com', password: 'senha123' };

		jest
			.spyOn(AuthService.prototype, 'login')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server).post(endpoint).send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
