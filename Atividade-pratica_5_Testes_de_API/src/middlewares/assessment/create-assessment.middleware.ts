import { NextFunction, Request, Response } from 'express';
import { regexUuid } from "../../types/regexUUID";

export class CreateAssessmentMiddleware {
	public static validateRequired(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { title, grade } = req.body;

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

		next();
	}
	public static validateTypes(
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const { title, description, grade } = req.body;

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
		const { title, description, studentId } = req.body;

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

		if (studentId && (typeof studentId !== 'string' || !regexUuid.test(studentId))) {
			res.status(400).json({
				success: false,
				message: 'Identificador studentId precisa ser um UUID!',
			});
			return;
		}

		next();
	}
}
