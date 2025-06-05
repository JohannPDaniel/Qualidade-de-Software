import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { StudentMock } from '../../mock/student.mock';
import { AuthStudent } from '../../types/student.types';
import { makeToken } from '../make-token';
import { StudentService } from '../../../src/service';

describe('PUT /students/:id', () => {
	const server = createExpressServer();
	const endpoint = '/students';
	const student = StudentMock.build();

	it('Deve retornar 401 quando não informado um token', async () => {
		const body = {
			name: student.name,
			password: student.password,
			type: student.type,
			age: student.age,
		};
		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.send(body);

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/token.*autenticado/i);
	});

	it('Deve retornar 401 quando não informado um token JWT', async () => {
		const body = {
			name: student.name,
			password: student.password,
			type: student.type,
			age: student.age,
		};
		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', 'token_inválido')
			.send(body);

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/estudante.*autenticado/i);
	});

	it('Deve retornar 400 se o identificador não for um UUID', async () => {
		const body = {
			name: student.name,
			password: student.password,
			type: student.type,
			age: student.age,
		};

		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/abc123`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/identificador.*UUID/i);
	});

	it('Deve retornar 400 se o nome se vier, não vir em formato de texto', async () => {
		const body = {
			name: 1,
			password: student.password,
			type: student.type,
			age: student.age,
		};

		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/nome.*string/i);
	});

	it('Deve retornar 400 se a senha se vier, não vir em formato de texto', async () => {
		const body = {
			name: student.name,
			password: 2,
			type: student.type,
			age: student.age,
		};

		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/senha.*string/i);
	});

	it('Deve retornar 400 se o tipo se vier, não for T, M ou F', async () => {
		const body = {
			name: student.name,
			password: student.password,
			type: 3,
			age: student.age,
		};

		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/T.*M.*F/i);
	});

	it('Deve retornar 400 se a idade se vier, não for um número', async () => {
		const body = {
			name: student.name,
			password: student.password,
			type: student.type,
			age: true,
		};

		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/idade.*número/i);
	});

	it('Deve retornar 400 se o nome vier, tiver menos de 3 caracteres', async () => {
		const body = {
			name: 'ab',
			password: student.password,
			type: student.type,
			age: student.age,
		};

		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/nome.*caracteres/i);
	});

	it('Deve retornar 400 se a senha vier, tiver menos de 4 caracteres', async () => {
		const body = {
			name: student.name,
			password: '123',
			type: student.type,
			age: student.age,
		};

		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/senha.*caracteres/i);
	});

	it('Deve retornar o estudante atualizado quando informado um ID do estudante válido e um Body válido', async () => {
		const body = {
			name: student.name,
			password: student.password,
			type: student.type,
			age: student.age,
		};

		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		jest.spyOn(StudentService.prototype, 'update').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Estudante atualizado com sucesso !',
			data: {},
		});

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(200);
		expect(response.body.success).toBeTruthy();
		expect(response.body.message).toMatch(/estudante.*sucesso/i);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const body = {
			name: student.name,
			password: student.password,
			type: student.type,
			age: student.age,
		};

		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		jest
			.spyOn(StudentService.prototype, 'update')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
