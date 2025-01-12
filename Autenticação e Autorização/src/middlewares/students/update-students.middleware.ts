import { StudentType } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export class UpdateStudentMiddleware {
	public static validateTypes(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { name, password, type, age } = req.body;

		const validStudentType = [StudentType.F, StudentType.M, StudentType.T];

		if (name && typeof name !== 'string') {
			res.status(400).json({
				success: false,
				message: 'O nome deve ser uma string',
			});
		}

		if (password && typeof password !== 'string') {
			res.status(400).json({
				success: false,
				message: 'A senha deve ser uma string',
			});
		}

		if (type && !validStudentType.includes(type)) {
			res.status(400).json({
				success: false,
				message: 'O tipo deve ser T ou M ou F !!!',
			});
		}

		if (age && typeof age !== 'number') {
			res.status(400).json({
				success: false,
				message: 'A idade deve ser um número',
			});
		}

		next();
	}
	public static validateData(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { name, password } = req.body;

		if (name && name.length < 3) {
			res.status(400).json({
				success: false,
				message: 'O nome deve ter pelo menos 3 caracteres',
			});
			return;
		}

		if (password && password.length < 4) {
			res.status(400).json({
				success: false,
				message: 'A senha deve conter pelo menos 4 caracteres',
			});
			return;
		}

		next();
	}
}
