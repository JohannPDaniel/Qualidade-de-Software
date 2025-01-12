import { NextFunction, Request, Response } from 'express';
import { JWT } from '../../utils/jwt';

export class AuthMiddleware {
	public static async validate(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const authorizathion = req.headers.authorization;

		if (!authorizathion) {
			res.status(401).json({
				success: false,
				message: 'Token não autenticado !',
			});
			return;
		}

		// const [_, token] = authorizathion.split(" ")
		const token = authorizathion.split(" ")[1]

		const jwt = new JWT();
		const studentDecode = jwt.verifyToken(token);

		if (!studentDecode) {
			res.status(401).json({
				success: false,
				message: 'Estudante não autenticado !',
			});
			return;
		}

		req.body.student = {
			id: studentDecode.id,
			type: studentDecode.type,
			name: studentDecode.name,
			email: studentDecode.email,
		};

		next();
	}
}
