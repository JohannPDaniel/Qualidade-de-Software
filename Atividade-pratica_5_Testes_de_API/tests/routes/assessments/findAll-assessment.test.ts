import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { AssessmentService } from '../../../src/service';
import { StudentMock } from '../../mock/student.mock';
import { AuthStudent } from '../../types/student.types';
import { makeToken } from '../make-token';

describe('GET /assessment', () => {
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

	it('Deve retornar uma busca bem sucedida de avaliações quando informado um estudante autenticado', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};

		const tokenJWT = makeToken(payload);

		jest.spyOn(AssessmentService.prototype, 'findAll').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Avaliações buscadas com sucesso !!!',
			data: {},
		});

		const response = await supertest(server)
			.get(endpoint)
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
			.spyOn(AssessmentService.prototype, 'findAll')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.get(endpoint)
			.set('Authorization', `Bearer ${tokenJWT}`);
		console.log('response:', response.body)

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro do servidor: Exceção !!!',
		});
	});
});
