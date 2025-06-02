import { JWT } from '../../src/utils/jwt';
import { AuthStudent } from "../types/student.types";

export function makeToken(payload: AuthStudent) {
	const jwt = new JWT();

	const token = jwt.generateToken(payload);

	return token;
}
