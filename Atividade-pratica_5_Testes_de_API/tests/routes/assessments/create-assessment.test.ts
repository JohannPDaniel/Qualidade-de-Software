import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { AuthStudent } from '../../types/student.types';
import { makeToken } from '../make-token';
import { StudentMock } from '../../mock/student.mock';
import { AssessmentMock } from '../../mock/assessments.mock';

describe('POST /assessments', () => {
	const server = createExpressServer();
	const endpoint = '/assessments';
	const student = StudentMock.build();
	const assessment = AssessmentMock.build();

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

	it('Deve retornar 401 quando o tipo de estudante não for ', async () => {
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

	it('Deve retornar 400 quando não for apresentado um titulo no body', async () => {
		const studentType = StudentMock.build({ type: 'M' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};
		const body = {};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/titulo.*obrigatório/i);
	});

	it('Deve retornar 400 quando não for apresentado uma nota no body', async () => {
		const studentType = StudentMock.build({ type: 'M' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};
		const body = { title: assessment.title };
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/nota.*obrigatório/i);
	});

	it('Deve retornar 400 quando o titulo vier diferente de um formato de texto', async () => {
		const studentType = StudentMock.build({ type: 'M' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};
		const body = {
			title: 1,
			grade: assessment.grade,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/titulo.*string/i);
	});

	it('Deve retornar 400 quando a descrição quando vier, for diferente de um formato de texto', async () => {
		const studentType = StudentMock.build({ type: 'M' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};
		const body = {
			title: assessment.title,
			description: 2,
			grade: assessment.grade,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/descrição.*string/i);
	});

	it('Deve retornar 400 quando a nota for diferente de número', async () => {
		const studentType = StudentMock.build({ type: 'M' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};
		const body = {
			title: assessment.title,
			description: assessment.description,
			grade: true,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/nota.*numero/i);
	});

	it('Deve retornar 400 quando o título tiver menos de 3 caracteres', async () => {
		const studentType = StudentMock.build({ type: 'M' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};
		const body = {
			title: "ab",
			description: assessment.description,
			grade: assessment.grade,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.post(endpoint)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/titulo.*caracteres/i);
	});
});
