import { NextFunction, Request, Response } from 'express';

export class CreateAssessmentMiddleware {
	public static validateRequired(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { title, grade } = req.body;
		const studentId = req.headers['x-student-id'];

		if (!title) {
			res.status(400).json({
				success: false,
				message: 'Titulo é obrigatório !',
			});
			return;
		}

		if (!grade) {
			res.status(400).json({
				success: false,
				message: 'Nota é obrigatório !',
			});
			return;
		}

		if (!studentId) {
			res.status(400).json({
				success: false,
				message: 'studentId é obrigatório !',
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
		const { title, description, grade } = req.body;
		const studentId = req.headers['x-student-id'];

		if (typeof title !== 'string') {
			res.status(400).json({
				success: false,
				message: 'Titulo é uma string !',
			});
			return;
		}

		if (description && typeof description !== 'string') {
			res.status(400).json({
				success: false,
				message: 'Descrição é uma string !',
			});
			return;
		}

		if (typeof grade !== 'number') {
			res.status(400).json({
				success: false,
				message: 'Nota é um numero !',
			});
			return;
		}

		next();
	}
	public static validateData(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { title, description } = req.body;
		const studentId = req.headers['x-student-id']

		const regexUuid =
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

		if (title.length < 3) {
			res.status(400).json({
				success: false,
				message: 'O titulo deve ter pelo menos 3 caracteres !',
			});
			return;
		}

		if (description && description.length < 5) {
			res.status(400).json({
				success: false,
				message: 'A descrição deve ter pelo menos 5 caracteres !',
			});
			return;
		}

		if (typeof studentId !== 'string' || !regexUuid.test(studentId)) {
			res.status(400).json({
				success: false,
				message: 'Identificador studentId precisa ser um UUID!',
			});
			return;
		}

		next();
	}
}
