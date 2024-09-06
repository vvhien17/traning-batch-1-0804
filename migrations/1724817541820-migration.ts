import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724817541820 implements MigrationInterface {
    name = 'Migration1724817541820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" ADD "realSpendTime" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "realSpendTime"`);
    }

}
