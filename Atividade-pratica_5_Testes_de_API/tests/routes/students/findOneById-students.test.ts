import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { StudentService } from '../../../src/service';
import { StudentMock } from '../../mock/student.mock';
import { AuthStudent } from '../../types/student.types';
import { makeToken } from '../make-token';

describe('GET /students/:id', () => {
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

	it('Deve retornar 400 se o identificador não for um UUID', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.get(`${endpoint}/abc123`)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/identificador.*UUID/i);
	});

	it('Deve retornar o estudante buscado pelo ID quando informado um ID válido', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		jest.spyOn(StudentService.prototype, 'findOneById').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Estudante encontrado com sucesso!',
			data: {},
		});

		const response = await supertest(server)
			.get(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send({ student: { id: student.id, type: student.type } });

		expect(response.status).toBe(200);
		expect(response.body.success).toBeTruthy();
		expect(response.body.message).toMatch(/estudante.*sucesso/i);
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
			.spyOn(StudentService.prototype, 'findOneById')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.get(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send({ student: { id: student.id, type: student.type } });

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro no servidor: Exceção !!!',
		});
	});
});
