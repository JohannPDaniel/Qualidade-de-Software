import supertest from 'supertest';
import { createExpressServer } from '../../../src/express.server';
import { StudentMock } from '../../mock/student.mock';

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
});
