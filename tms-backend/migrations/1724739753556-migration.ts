import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724739753556 implements MigrationInterface {
    name = 'Migration1724739753556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_on_activity" DROP COLUMN "totalSpend"`);
        await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "status" SET DEFAULT 'NOT_COMPLETED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "goal_on_activity" ADD "totalSpend" integer NOT NULL`);
    }

}
