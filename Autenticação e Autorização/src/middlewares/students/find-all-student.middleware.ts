import { NextFunction, Request, Response } from 'express';

export class FindAllStudentMiddleware {
	public static validateTypes(req: Request, res: Response, next: NextFunction) {
		const { name, cpf } = req.query;

		if (name && typeof name !== 'string') {
			res.status(400).json({
                success: false,
                message: "O nome deve ser uma string"
            });
		}

		if (cpf && typeof cpf !== 'string') {
			res.status(400).json({
                success: false,
                message: "O cpf deve ser uma string"
            })
		}

        next()
	}
}
