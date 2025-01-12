import { Request, Response } from 'express';
import { StudentService } from '../service/student.service';
import { CreateStudentDto } from '../dtos';

export class StudentController {
	public static async create(req: Request, res: Response): Promise<void> {
		try {
			const { name, email, password, type, age, cpf } = req.body;

			const data: CreateStudentDto = {
				name,
				email,
				password,
				type,
				age,
				cpf,
			};
			const service = new StudentService();
			const result = await service.create(data);

			const { code, ...response } = result;

			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}

	public static async findAll(req: Request, res: Response): Promise<void> {
		try {
			const { name, cpf } = req.query;
			// const { student } = req.body;

			// console.log('Student no controller:', student);

			const service = new StudentService();
			const result = await service.findAll({
				name: name as string,
				cpf: cpf as string,
			});

			const { code, ...response } = result;

			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}

	public static async findOneById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const { student } = req.body as { student: { id: string; type: string } };

			const service = new StudentService();
			const result = await service.findOneById(id, student.id);

			const { code, ...response } = result;

			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}

	public static async update(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const { student } = req.body as { student: { id: string; type: string } };
			const { name, password, type, age } = req.body;

			const service = new StudentService();
			const result = await service.update(id, student.id, {
				name,
				password,
				type,
				age,
			});

			const { code, ...response } = result;

			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}

	public static async remove(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const { student } = req.body as { student: { id: string; type: string } };

			const service = new StudentService();
			const result = await service.remove(id, student.id);

			const { code, ...response } = result;

			res.status(code).json(response);
		} catch (error: any) {
			res.status(500).json({
				success: false,
				message: `Erro no servidor: ${error.message}`,
			});
		}
	}
}
