import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724318263134 implements MigrationInterface {
    name = 'Migration1724318263134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "startedAt"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "startedAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "endedAt"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "endedAt" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "endedAt"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "endedAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "startedAt"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

}
