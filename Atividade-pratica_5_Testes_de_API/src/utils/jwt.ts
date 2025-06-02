import jwt from 'jsonwebtoken';
import { AuthStudent } from '../types/student.types';
import { StringValue } from "ms"

export class JWT {
	public generateToken(user: AuthStudent): string {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error('JWT_SECRET não definido.');
		}

		const expiresIn = (process.env.EXPIRES_IN || '1h') as StringValue;

		const options: jwt.SignOptions = {
			algorithm: 'HS256',
			expiresIn,
		};

		const token = jwt.sign(user, secret, options);
		return token;
	}

	public verifyToken(token: string): AuthStudent | null {
		try {
			if (!process.env.JWT_SECRET) {
				throw new Error('JWT_SECRET não definido !!!');
			}
			const data = jwt.verify(token, process.env.JWT_SECRET) as AuthStudent;
			return data;
		} catch {
			return null;
		}
	}
}
