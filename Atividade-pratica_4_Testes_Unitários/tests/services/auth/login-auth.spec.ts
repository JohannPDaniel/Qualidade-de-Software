import { prismaMock } from "../../config/prisma.mock";
import { AuthService } from "../../../src/service/auth.service";

describe("AuthService - login", () => {
    const createSut = () => new AuthService()
    const loginDto = { email: "user@email.com", password: "senha123" }

    it("Deve retornar 404 quando não for informado um e-mail correto", async () => {
        const sut = createSut()

        prismaMock.student.findUnique.mockResolvedValue(null)

        const result = await sut.login(loginDto)

        expect(result.code).toBe(404)
    })
})