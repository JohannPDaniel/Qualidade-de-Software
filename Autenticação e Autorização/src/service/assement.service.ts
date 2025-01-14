import { Assessment, StudentType } from '@prisma/client';
import { prisma } from '../database/prisma.database';
import { AssessmentDto, CreateAssessmentDto } from '../dtos';
import { ResponseApi } from '../types';
import { AuthStudent } from '../types/student.types';

export class AssessmentService {
	public async create(
		createAssementDto: CreateAssessmentDto,
		studentLogged: AuthStudent
	): Promise<ResponseApi> {
		const { title, description, grade, studentId } = createAssementDto;
		
		const studentValidate =
			studentLogged.type !== StudentType.M ? studentLogged.id : studentId;

		const studentFounded = await prisma.student.findUnique({
			where: { id: studentId },
		});

		if (!studentFounded) {
			return {
				success: false,
				code: 404,
				message: 'Estudante não encontrado!',
			};
		}

		const assessmentCreated = await prisma.assessment.create({
			data: {
				title,
				description,
				grade,
				studentId: studentValidate,
			},
		});

		return {
			success: true,
			code: 201,
			message: 'Avaliação criada com sucesso !',
			data: this.mapToDto(assessmentCreated),
		};
	}

	public async findAll(
		studentLogged: AuthStudent,
		query?: { page?: number; take?: number }
	): Promise<ResponseApi> {
		const studentId =
			studentLogged.type !== StudentType.T ? undefined : studentLogged.id;

		const assessmentList = await prisma.assessment.findMany({
			skip: query?.page,
			take: query?.take,
			where: { studentId },
			orderBy: { createdAt: 'asc' },
		});

		if (!assessmentList) {
			return {
				success: false,
				code: 404,
				message: 'Avaliação do estudante não encontrada',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Avaliações buscadas com sucesso !!!',
			data: assessmentList.map((ass) => this.mapToDto(ass)),
		};
	}

	public async findOneById(id: string): Promise<ResponseApi> {
		const assessment = await prisma.assessment.findUnique({
			where: { id },
		});

		if (!assessment) {
			return {
				success: false,
				code: 404, // Not Found
				message: 'Avaliaçao não encontrado!',
			};
		}

		return {
			success: true,
			code: 200,
			message: 'Avaliação buscada com sucesso!',
			data: this.mapToDto(assessment),
		};
	}

	public async update(
		id: string,
		updateAssessments: UpdateDTO
	): Promise<ResponseApi> {
		const assessment = await prisma.assessment.findUnique({
			where: { id },
		});

		if (!assessment) {
			return {
				success: false,
				code: 404,
				message: 'Avaliação não encontrada!',
			};
		}

		const updateAssessment = await prisma.assessment.update({
			where: { id },
			data: { ...updateAssessments },
		});

		return {
			success: true,
			code: 200,
			message: 'Avaliação atualizada com sucesso!',
			data: this.mapToDto(updateAssessment),
		};
	}

	public async remove(id: string): Promise<ResponseApi> {
		const assessment = await prisma.assessment.findUnique({
			where: { id },
		});

		if (!assessment) {
			return {
				success: false,
				code: 404,
				message: 'Avaliação não encontrada!',
			};
		}

		const removeAssessment = await prisma.assessment.delete({
			where: { id },
		});
		return {
			success: true,
			code: 200,
			message: 'Avaliação excluída com sucesso!',
			data: this.mapToDto(removeAssessment),
		};
	}

	private mapToDto(assessment: Assessment): AssessmentDto {
		return {
			id: assessment.id,
			title: assessment.title,
			description: assessment.description,
			grade: Number(assessment.grade),
			studentId: assessment.studentId,
			createdAt: assessment.createdAt,
		};
	}
}

interface UpdateDTO {
	title?: string;
	description?: string;
	grade?: number;
}
