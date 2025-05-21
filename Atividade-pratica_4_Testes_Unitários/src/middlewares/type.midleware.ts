import { StudentType } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export class TypeMidleware {
	public static validate(allowedTypes: StudentType[]) {
		return (req: Request, res: Response, next: NextFunction) => {
			const type = req.authStudent.type;
			console.log('type:', type)

			if (!allowedTypes) {
				return next();
			}

			if (type && !allowedTypes.includes(type)) {
				const allowed = allowedTypes.join(', ');
                const path = req.path;
                const method = req.method;
                
				res.status(401).json({
					success: false,
					message: `Somente estudante(s) do(s) tipo ${allowed} pode acessar a rota ${method} - ${path}`,
				});
				return
			}

			next();
		};
	}
}
