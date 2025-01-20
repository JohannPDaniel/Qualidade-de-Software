export interface Student {
    id: string;
    name: string;
    email: string;
    type: string;
    age: number;
    cpf: string;
    password: string;
}

export type StudentsCreate = Pick<Student, "name" | "email" | "cpf" | "type" | "age" | "password">