import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { StudentMock } from '../../mock/student.mock';
import { AuthStudent } from '../../types/student.types';
import { makeToken } from '../make-token';
import { AssessmentService } from '../../../src/service';
import { AssessmentMock } from '../../mock/assessments.mock';

describe('PUT /assessment/:id', () => {
	const server = createExpressServer();
	const endpoint = '/assessments';
	const student = StudentMock.build();
	const assessment = AssessmentMock.build();

	it('Deve retornar 401 quando não informado um token', async () => {
		const response = await supertest(server).put(`${endpoint}/abc`);

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/token.*autenticado/i);
	});

	it('Deve retornar 401 quando não informado um token JWT', async () => {
		const response = await supertest(server)
			.put(`${endpoint}/abc`)
			.set('Authorization', 'token_inválido');

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/estudante.*autenticado/i);
	});

	it('Deve retornar 401 quando não informado um token JWT', async () => {
		const response = await supertest(server)
			.put(`${endpoint}/abc`)
			.set('Authorization', 'token_inválido');

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/estudante.*autenticado/i);
	});

	it('Deve retornar 401 quando o tipo de estudante não for T', async () => {
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/abc`)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.status).toBe(401);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/T/i);
	});

	it('Deve retornar 400 quando o ID informado não for do tipo UUID', async () => {
		const studentType = StudentMock.build({ type: 'T' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};
		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/abc`)
			.set('Authorization', `Bearer ${tokenJWT}`);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/identificador.*uuid/i);
	});

	it('Deve retornar 400 quando o titulo vier for diferente do formato de texto', async () => {
		const studentType = StudentMock.build({ type: 'T' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};

		const body = {
			title: 1,
		};

		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/titulo.*string/i);
	});

	it('Deve retornar 400 quando a descrição vier for diferente do formato de texto', async () => {
		const studentType = StudentMock.build({ type: 'T' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};

		const body = {
			title: 'ab',
			description: true,
		};

		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/descrição.*string/i);
	});

	it('Deve retornar 400 quando a nota vier for diferente do formato de número', async () => {
		const studentType = StudentMock.build({ type: 'T' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};

		const body = {
			title: 'ab',
			description: 'abcd',
			grade: true,
		};

		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/nota.*number/i);
	});

	it('Deve retornar 400 quando o título quando vier tiver menos de 3 caracteres', async () => {
		const studentType = StudentMock.build({ type: 'T' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};

		const body = {
			title: 'ab',
			description: 'abcd',
			grade: 30,
		};

		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/título.*caracteres/i);
	});

	it('Deve retornar 400 quando a descrição quando vier tiver menos de 5 caracteres', async () => {
		const studentType = StudentMock.build({ type: 'T' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};

		const body = {
			title: assessment.title,
			description: 'abcd',
			grade: Number(assessment.grade),
		};

		const tokenJWT = makeToken(payload);

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(400);
		expect(response.body.success).toBeFalsy();
		expect(response.body.message).toMatch(/descrição.*caracteres/i);
	});

	it('Deve retornar a avaliação atualizada quando fornecido um ID e um Body válido', async () => {
		const studentType = StudentMock.build({ type: 'T' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};

		const body = {
			title: assessment.title,
			description: assessment.description,
			grade: Number(assessment.grade),
		};

		const tokenJWT = makeToken(payload);

		jest.spyOn(AssessmentService.prototype, 'update').mockResolvedValue({
			success: true,
			code: 200,
			message: 'Avaliação excluída com sucesso!',
			data: {},
		});

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.status).toBe(200);
		expect(response.body.success).toBeTruthy();
		expect(response.body.message).toMatch(/avaliação.*sucesso/i);
	});

	it('Deve retornar 500 quando houver um erro', async () => {
		const studentType = StudentMock.build({ type: 'T' });
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: studentType.type,
		};
		const body = {
			title: assessment.title,
			description: assessment.description,
			grade: Number(assessment.grade),
		};
		const tokenJWT = makeToken(payload);

		jest
			.spyOn(AssessmentService.prototype, 'update')
			.mockRejectedValue(new Error('Exceção !!!'));

		const response = await supertest(server)
			.put(`${endpoint}/${student.id}`)
			.set('Authorization', `Bearer ${tokenJWT}`)
			.send(body);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual({
			success: false,
			message: 'Erro do servidor: Exceção !!!',
		});
	});
});
