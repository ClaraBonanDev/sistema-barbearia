-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('AGENDADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO');

-- AlterTable
ALTER TABLE "Agendamento"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "StatusAgendamento"
USING "status"::"StatusAgendamento",
ALTER COLUMN "status" SET DEFAULT 'AGENDADO';