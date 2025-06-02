import { Express, Request, Response } from 'express';
import { StudentRoutes } from './student.routes';
import { AuthRoutes } from './auth.routes';
import { AssessmentRoutes } from './assement.routes';
import swaggerUI from 'swagger-ui-express';
import swaggerDOC from '../docs/swagger.json';

export const makeRoutes = (app: Express) => {
	app.get('/', (_request: Request, response: Response) => {
		response.status(200).json({
			success: true,
			message: 'Bem-vindo a aula 2 - Iniciando o Grow Academy',
		});
	});

	app.use('/docs', swaggerUI.serve);
	app.get('/docs', swaggerUI.setup(swaggerDOC));

	app.use(StudentRoutes.execute());
	app.use(AuthRoutes.execute());
	app.use(AssessmentRoutes.execute());
};
