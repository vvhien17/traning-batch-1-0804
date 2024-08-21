import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1724233286299 implements MigrationInterface {
  name = 'Migration1724233286299';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "goalName"`);
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "goalStartedTime"`);
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "goalEndedTime"`);
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "startedTime" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "endedTime" TIMESTAMP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "endedTime"`);
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "startedTime"`);
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "goalEndedTime" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "goalStartedTime" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "goalName" character varying NOT NULL`,
    );
  }
}
