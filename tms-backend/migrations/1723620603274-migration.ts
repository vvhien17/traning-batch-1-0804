import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723620603274 implements MigrationInterface {
    name = 'Migration1723620603274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "userName" TO "username"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "UQ_da5934070b5f2726ebfd3122c80" TO "UQ_78a916df40e02a9deb1c4b75edb"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" TO "UQ_da5934070b5f2726ebfd3122c80"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "userName"`);
    }

}
