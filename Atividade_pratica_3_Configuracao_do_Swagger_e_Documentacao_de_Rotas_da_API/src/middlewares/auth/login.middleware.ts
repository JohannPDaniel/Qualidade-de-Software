import { NextFunction, Request, Response } from 'express';

export class LoginMiddleware {
	public static validateRequired(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { email, password } = req.body;

		if (!email) {
			res.status(400).json({
				success: false,
				message: 'Email é obrigatório !',
			});
			return;
		}

		if (!password) {
			res.status(400).json({
				success: false,
				message: 'Senha é obrigatório !',
			});
			return;
		}

		next();
	}
	public static validateTypes(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { email, password } = req.body;

		if (typeof email !== 'string') {
			res.status(400).json({
				successs: false,
				massage: 'Email deve ser uma string !',
			});
			return;
		}

		if (typeof password !== 'string') {
			res.status(400).json({
				successs: false,
				massage: 'Senha deve ser uma string !',
			});
			return;
		}
        
        next()
	}
}
