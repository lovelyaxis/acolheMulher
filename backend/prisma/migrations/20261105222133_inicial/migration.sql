-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(36) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `senhaHash` VARCHAR(255) NOT NULL,
    `perfil` ENUM('PROFISSIONAL', 'ADMINISTRADOR') NOT NULL,
    `cargo` VARCHAR(100) NULL,
    `unidadeId` VARCHAR(36) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `tentativasLogin` INTEGER NOT NULL DEFAULT 0,
    `bloqueadoAte` DATETIME NULL,
    `criadoEm` TIMESTAMP NOT NULL,
    `atualizadoEm` TIMESTAMP NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    INDEX `Usuario_email_idx`(`email`),
    INDEX `Usuario_perfil_idx`(`perfil`),
    INDEX `Usuario_unidadeId_idx`(`unidadeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unidade` (
    `id` VARCHAR(36) NOT NULL,
    `nome` VARCHAR(150) NOT NULL,
    `tipo` ENUM('DELEGACIA_MULHER', 'CRAS_CREAS', 'CASA_ACOLHIMENTO', 'DEFENSORIA_PUBLICA', 'HOSPITAL_REFERENCIA') NOT NULL,
    `endereco` VARCHAR(200) NOT NULL,
    `bairro` VARCHAR(100) NOT NULL,
    `cep` VARCHAR(9) NOT NULL,
    `telefone` VARCHAR(20) NULL,
    `horario` VARCHAR(100) NULL,
    `ativa` BOOLEAN NOT NULL DEFAULT true,
    `vagasTotal` INTEGER NULL,
    `vagasDisponiveis` INTEGER NULL,
    `nomeNormalizado` VARCHAR(150) NOT NULL,
    `enderecoNormalizado` VARCHAR(200) NOT NULL,
    `criadoEm` TIMESTAMP NOT NULL,
    `atualizadoEm` TIMESTAMP NOT NULL,

    INDEX `Unidade_tipo_idx`(`tipo`),
    INDEX `Unidade_ativa_idx`(`ativa`),
    INDEX `Unidade_nomeNormalizado_enderecoNormalizado_idx`(`nomeNormalizado`, `enderecoNormalizado`),
    UNIQUE INDEX `Unidade_nomeNormalizado_enderecoNormalizado_key`(`nomeNormalizado`, `enderecoNormalizado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Encaminhamento` (
    `id` VARCHAR(36) NOT NULL,
    `codigoCaso` VARCHAR(50) NOT NULL,
    `tipoAtendimento` VARCHAR(100) NOT NULL,
    `unidadeDestinoId` VARCHAR(36) NOT NULL,
    `observacoes` TEXT NULL,
    `status` ENUM('PENDENTE', 'CONCLUIDO') NOT NULL DEFAULT 'PENDENTE',
    `profissionalId` VARCHAR(36) NOT NULL,
    `criadoEm` TIMESTAMP NOT NULL,
    `atualizadoEm` TIMESTAMP NOT NULL,

    UNIQUE INDEX `Encaminhamento_codigoCaso_key`(`codigoCaso`),
    INDEX `Encaminhamento_profissionalId_idx`(`profissionalId`),
    INDEX `Encaminhamento_unidadeDestinoId_idx`(`unidadeDestinoId`),
    INDEX `Encaminhamento_status_idx`(`status`),
    INDEX `encaminhamento_codigo_caso_idx`(`codigoCaso`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrientacaoAnonima` (
    `id` VARCHAR(36) NOT NULL,
    `mensagem` TEXT NOT NULL,
    `categoria` VARCHAR(100) NOT NULL,
    `criadoEm` TIMESTAMP NOT NULL,

    INDEX `OrientacaoAnonima_criadoEm_idx`(`criadoEm`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_unidadeId_fkey` FOREIGN KEY (`unidadeId`) REFERENCES `Unidade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Encaminhamento` ADD CONSTRAINT `Encaminhamento_profissionalId_fkey` FOREIGN KEY (`profissionalId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Encaminhamento` ADD CONSTRAINT `Encaminhamento_unidadeDestinoId_fkey` FOREIGN KEY (`unidadeDestinoId`) REFERENCES `Unidade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
