-- CreateTable
CREATE TABLE `Ocorrencia` (
    `id` VARCHAR(36) NOT NULL,
    `tipoEvento` VARCHAR(100) NOT NULL,
    `observacoes` TEXT NULL,
    `profissionalId` VARCHAR(36) NOT NULL,
    `criadoEm` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ocorrencia` ADD CONSTRAINT `Ocorrencia_profissionalId_fkey` FOREIGN KEY (`profissionalId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX `Ocorrencia_profissionalId_idx` ON `Ocorrencia`(`profissionalId`);

-- CreateIndex
CREATE INDEX `Ocorrencia_tipoEvento_idx` ON `Ocorrencia`(`tipoEvento`);

-- CreateIndex
CREATE INDEX `Ocorrencia_criadoEm_idx` ON `Ocorrencia`(`criadoEm`);
