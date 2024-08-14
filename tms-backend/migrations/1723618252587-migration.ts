import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723618252587 implements MigrationInterface {
    name = 'Migration1723618252587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "passWord" TO "password"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "categoryName" TO "name"`);
        await queryRunner.query(`ALTER TABLE "activity" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "name" TO "categoryName"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "password" TO "passWord"`);
    }

}
