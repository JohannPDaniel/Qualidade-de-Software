-- CreateEnum
CREATE TYPE "StudentType" AS ENUM ('M', 'T', 'F');

-- CreateTable
CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "email" VARCHAR(250) NOT NULL,
    "password" TEXT NOT NULL,
    "type" "StudentType" NOT NULL DEFAULT 'M',
    "age" INTEGER,
    "cpf" CHAR(11) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" UUID NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "description" TEXT,
    "grade" DECIMAL(4,2) NOT NULL,
    "student_id" UUID NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
