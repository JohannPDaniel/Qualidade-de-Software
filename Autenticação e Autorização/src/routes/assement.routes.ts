import { Router } from 'express';
import { AuthMiddleware } from "../middlewares/auth/auth.middleware";
import { ValidateUuidMiddleware } from "../middlewares/validate-uuid.middleware";
import { CreateAssessmentMiddleware } from "../middlewares/assessment/create-assessment.middleware";
import { AssessmentController } from "../controllers/assement.controller";
import { UpdateAssessmentMiddleware } from "../middlewares/assessment/update-assessment.middleaware";
import { TypeMidleware } from "../middlewares/type.midleware";
import { StudentType } from "@prisma/client";

export class AssessmentRoutes {
	public static execute(): Router {
		const router = Router();

		//CREATE - POST
		router.post(
			'/assessments',
			[
				AuthMiddleware.validate,
				TypeMidleware.validate([StudentType.M, StudentType.T]),
				CreateAssessmentMiddleware.validateRequired,
				CreateAssessmentMiddleware.validateTypes,
				CreateAssessmentMiddleware.validateData,
			],
			AssessmentController.create
		);

		router.get(
			'/assessments',
			AuthMiddleware.validate, // {student: { id, type }}
			AssessmentController.findAll
		);

		router.get(
			'/assessments/:id',
			[AuthMiddleware.validate, ValidateUuidMiddleware.validate],
			AssessmentController.findOneById
		);

		router.put(
			'/assessments/:id',
			[
				AuthMiddleware.validate,
				TypeMidleware.validate([StudentType.T]),
				ValidateUuidMiddleware.validate,
				UpdateAssessmentMiddleware.validateTypes,
				UpdateAssessmentMiddleware.validateData,
			],
			AssessmentController.update
		);

		router.delete(
			'/assessments/:id',
			[
				AuthMiddleware.validate,
				TypeMidleware.validate([StudentType.T]),
				ValidateUuidMiddleware.validate,
			],
			AssessmentController.remove
		);

		return router;
	}
}
