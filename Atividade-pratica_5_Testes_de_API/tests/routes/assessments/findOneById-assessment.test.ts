import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { AssessmentService } from '../../../src/service';
import { StudentMock } from '../../mock/student.mock';
import { AuthStudent } from '../../types/student.types';
import { makeToken } from '../make-token';

describe('GET /assessments/:id', () => {
	const server = createExpressServer();
	const endpoint = '/assessments';
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

	it('Deve retornar 400 quando o Id informado não for do tipo UUID', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.get(`${endpoint}/abc`)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/identificador.*uuid/i);
	});

	it('Deve retornar um estudante buscado com sucesso quando informado um ID válido', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		jest.spyOn(AssessmentService.prototype, 'findOneById').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Avaliações buscadas com sucesso !!!',
			data: {},
		});

		const response = await supertest(server)
			.get(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.status).toBe(200);
		expect(response.body.success).toBeTruthy();
		expect(response.body.message).toMatch(/avaliações.*sucesso/i);
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
			.spyOn(AssessmentService.prototype, 'findOneById')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.get(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro do servidor: Exceção !!!',
		});
	});
});
