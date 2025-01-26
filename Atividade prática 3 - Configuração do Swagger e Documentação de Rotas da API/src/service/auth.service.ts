import { prisma } from '../database/prisma.database';
import { LoginDto } from '../dtos';
import { ResponseApi } from '../types';
import { Bcrypt } from '../utils/bcript';
import { Student } from '@prisma/client';
import { JWT } from '../utils/jwt';
import { AuthStudent } from '../types/student.types';

export class AuthService {
	public async login(data: LoginDto): Promise<ResponseApi> {
		const { email, password } = data;
		const student = await prisma.student.findUnique({
			where: { email: data.email },
		});

		if (!student) {
			return {
				success: false,
				code: 404,
				message: 'E-mail ou senha inconrretas (e-mail) !!! ',
			};
		}
		const hash = student.password;

		const bcrypt = new Bcrypt();

		const isValid = await bcrypt.verify(password, hash);

		if (!isValid) {
			return {
				success: false,
				code: 404,
				message: 'E-mail ou senha inconrretas (password) !!! ',
			};
		}

		const jwt = new JWT();
		const payload: AuthStudent = {
			id: student.id,
			name: student.name,
			email: student.email,
			type: student.type
		};
		const token = jwt.generateToken(payload);

		return {
			success: true,
			code: 200,
			message: 'Login efetuado com sucesso !',
			data: {
				student: payload,
				token,
			},
		};
	}
}
