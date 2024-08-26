import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724646314666 implements MigrationInterface {
    name = 'Migration1724646314666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "status"`);
    }

}
