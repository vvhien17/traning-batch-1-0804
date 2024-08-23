import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724321099626 implements MigrationInterface {
    name = 'Migration1724321099626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_ee489f009bbe0600fa8b9910a53"`);
        await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "categoryId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_ee489f009bbe0600fa8b9910a53" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_ee489f009bbe0600fa8b9910a53"`);
        await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activity" ALTER COLUMN "categoryId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_ee489f009bbe0600fa8b9910a53" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
