import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { StudentService } from '../../../src/service';
import { StudentMock } from '../../mock/student.mock';
import { makeToken } from '../make-token';
import { AuthStudent } from './../../../src/types/student.types';

describe('GET /students', () => {
	const server = createExpressServer();
	const endpoint = '/students';
	const student = StudentMock.build();

	it('Deve retornar 401 quando não informado um token', async () => {
		const response = await supertest(server).get(endpoint);

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/token.*autenticado/i);
	});

	it('Deve retornar 401 quando não informado um token JWT', async () => {
		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', 'token_inválido');

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/estudante.*autenticado/i);
	});

	it('Deve retornar 401 quando não informado um token JWT', async () => {
		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', 'token_inválido');

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/estudante.*autenticado/i);
	});

	it('Deve retornar 400 quando se informado um nome, ele não vir em formato de texto', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.get(`${endpoint}?name[]=123`)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/nome.*string/i);
	});

	it('Deve retornar 400 quando se informado um cpf, ele não vir em formato de texto', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.get(`${endpoint}?name=123&cpf[]=123`)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/cpf.*string/i);
	});

	it('Deve de retornar a pesquisa bem sucedida quando um name ou um cpf válido', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		jest.spyOn(StudentService.prototype, 'findAll').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Estudantes buscados com sucesso !!!',
			data: {},
		});

		const response = await supertest(server)
			.get(`${endpoint}?name=Johann&cpf=12345678901`)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.status).toBe(200);
		expect(response.body.success).toBeTruthy();
		expect(response.body.message).toMatch(/estudantes.*sucesso/i);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		jest
			.spyOn(StudentService.prototype, 'findAll')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.get(`${endpoint}?name=Johann&cpf=12345678901`)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
