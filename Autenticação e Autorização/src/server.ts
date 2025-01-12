import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { AuthRoutes, StudentRoutes } from "./routes";
import { AssessmentRoutes } from "./routes/assement.routes";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(StudentRoutes.execute());
app.use(AuthRoutes.execute());
app.use(AssessmentRoutes.execute())

app.get('/', (_request: Request, response: Response) => {
	response.status(200).json({
		success: true,
		message: 'Bem-vindo a aula 2 - Iniciando o Grow Academy',
	});
});

app.listen(port, () => {
	console.log(`Servidor rodando na porta http://localhost:${port}`);
});
