import 'dotenv/config';
import { createExpressServer } from './express.server';

const app = createExpressServer();
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Servidor rodando na porta http://localhost:${port}`);
});
