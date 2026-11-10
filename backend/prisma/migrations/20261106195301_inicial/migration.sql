/*
  Warnings:

  - You are about to alter the column `criadoEm` on the `encaminhamento` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `atualizadoEm` on the `encaminhamento` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `criadoEm` on the `orientacaoanonima` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `criadoEm` on the `unidade` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `atualizadoEm` on the `unidade` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `bloqueadoAte` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `criadoEm` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `atualizadoEm` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `encaminhamento` MODIFY `criadoEm` TIMESTAMP NOT NULL,
    MODIFY `atualizadoEm` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `orientacaoanonima` MODIFY `criadoEm` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `unidade` MODIFY `criadoEm` TIMESTAMP NOT NULL,
    MODIFY `atualizadoEm` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `usuario` MODIFY `bloqueadoAte` DATETIME NULL,
    MODIFY `criadoEm` TIMESTAMP NOT NULL,
    MODIFY `atualizadoEm` TIMESTAMP NOT NULL;
