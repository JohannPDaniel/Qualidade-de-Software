import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { AuthRoutes, StudentRoutes } from "./routes";
import { AssessmentRoutes } from "./routes/assement.routes";
import swaggerUI from "swagger-ui-express"
import swaggerDOC from "./docs/swagger.json"

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (_request: Request, response: Response) => {
	response.status(200).json({
		success: true,
		message: 'Bem-vindo a aula 2 - Iniciando o Grow Academy',
	});
});

app.use('/docs', swaggerUI.serve)
app.get('/docs', swaggerUI.setup(swaggerDOC));

app.use(StudentRoutes.execute());
app.use(AuthRoutes.execute());
app.use(AssessmentRoutes.execute());


app.listen(port, () => {
	console.log(`Servidor rodando na porta http://localhost:${port}`);
});
