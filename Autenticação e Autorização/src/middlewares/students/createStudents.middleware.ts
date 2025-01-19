import { StudentType } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export class CreateStudentsMiddleware {
	public static validateRequired(
		request: Request,
		response: Response,
		next: NextFunction
	): void {
		const { name, email, password, type, age, cpf } = request.body;

		if (!name) {
			response.status(400).json({
				success: false,
				message: 'Favor inserir o nome, por favor !!!',
			});
			return
		}

		if (!email) {
			response.status(400).json({
				success: false,
				message: 'Favor inserir o e-mail, por favor !!!',
			});
			return;
		}

		if (!password) {
			response.status(400).json({
				success: false,
				message: 'Favor inserir a senha !!!',
			});
			return;
		}

		if (!type) {
			response.status(400).json({
				success: false,
				message: 'Favor inserir tipo, por favor !!!',
			});
			return;
		}

		if (!cpf) {
			response.status(400).json({
				success: false,
				message: 'Favor inserir o cpf, por favor !!!',
			});
			return;
		}

		next();
	}
	public static validateTypes(
		request: Request,
		response: Response,
		next: NextFunction
	): void {
		const { name, email, password, type, age, cpf } = request.body;
		const validStudentType = [StudentType.F, StudentType.M, StudentType.T];

		if (typeof name !== 'string') {
			response.status(400).json({
				success: false,
				message: 'O nome deve ser uma string',
			});
			return;
		}

		if (typeof email !== 'string') {
			response.status(400).json({
				success: false,
				message: 'O E-mail deve ser uma string',
			});
			return;
		}

		if (typeof password !== 'string') {
			response.status(400).json({
				success: false,
				message: 'A senha deve ser uma string',
			});
			return;
		}

		if (!validStudentType.includes(type)) {
			response.status(400).json({
				success: false,
				message: 'O tipo deve ser T ou M ou F !!!',
			});
			return;
		}

		if (age) {
			if (typeof age !== 'number') {
				response.status(400).json({
					success: false,
					message: 'A idade deve ser um número',
				});
			}
			return;
		}

		if (typeof cpf !== 'string') {
			response.status(400).json({
				success: false,
				message: 'O cpf deve ser uma string',
			});
			return;
		}

		next();
	}
	public static validateData(
		request: Request,
		response: Response,
		next: NextFunction
	): void {
		const { name, email, password, type, age, cpf } = request.body;

		if (name.length < 3) {
			response.status(400).json({
				success: false,
				message: 'O nome deve ter pelo menos 3 caracteres',
			});
			return;
		}

		if (password.length < 4) {
			response.status(400).json({
				success: false,
				message: 'A senha deve conter pelo menos 4 caracteres',
			});
			return;
		}

		if (!email.includes('@') || !email.includes('.com')) {
			response.status(400).json({
				success: false,
				message: 'O e-mail deve conter (@) e (.com) !!!',
			});
			return;
		}

		if (cpf.length < 11) {
			response.status(400).json({
				success: false,
				message: 'O cpf deve conter 11 caracteres !!!',
			});
			return;
		}

		next();
	}
}
