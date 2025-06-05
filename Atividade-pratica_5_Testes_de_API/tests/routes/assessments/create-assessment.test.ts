import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { AuthStudent } from '../../types/student.types';
import { makeToken } from '../make-token';
import { StudentMock } from '../../mock/student.mock';

describe('POST /assessments', () => {
	const server = createExpressServer();
	const endpoint = '/assessments';
	const student = StudentMock.build();

	it('Deve retornar 401 quando não informado um token', async () => {
		const response = await supertest(server).post(endpoint);

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/token.*autenticado/i);
	});

	it('Deve retornar 401 quando não informado um token JWT', async () => {
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', 'token_inválido');

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/estudante.*autenticado/i);
	});

	it('Deve retornar 401 quando não informado um token JWT', async () => {
		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', 'token_inválido');

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/estudante.*autenticado/i);
	});

	it('Deve retornar 401 quando o tipo de estudante não for informado', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/M.*T/i);
	});
});
