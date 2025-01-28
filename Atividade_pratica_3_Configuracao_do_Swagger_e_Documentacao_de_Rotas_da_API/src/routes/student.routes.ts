import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';
import { CreateStudentsMiddleware } from '../middlewares/students/createStudents.middleware';
import { FindAllStudentMiddleware } from '../middlewares/students/find-all-student.middleware';
import { UpdateStudentMiddleware } from '../middlewares/students/update-students.middleware';
import { ValidateUuidMiddleware } from '../middlewares/validate-uuid.middleware';

export class StudentRoutes {
	public static execute(): Router {
		const router = Router();
		router.post(
			'/students',
			[
				CreateStudentsMiddleware.validateRequired,
				CreateStudentsMiddleware.validateTypes,
				CreateStudentsMiddleware.validateData,
			],
			StudentController.create
		);

		router.get(
			'/students',
			[AuthMiddleware.validate, FindAllStudentMiddleware.validateTypes],
			StudentController.findAll
		);

		router.get(
			'/students/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			StudentController.findOneById
		);

		router.put(
			'/students/:id',
			[
				AuthMiddleware.validate,
				ValidateUuidMiddleware.validate,
				UpdateStudentMiddleware.validateTypes,
				UpdateStudentMiddleware.validateData,
			],
			StudentController.update
		);

		router.delete(
			'/students/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			StudentController.remove
		);

		return router;
	}
}
