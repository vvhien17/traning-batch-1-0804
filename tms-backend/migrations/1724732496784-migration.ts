import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724732496784 implements MigrationInterface {
    name = 'Migration1724732496784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_on_activity" DROP CONSTRAINT "FK_38b4ae22b0c60af98f7fe308a15"`);
        await queryRunner.query(`ALTER TABLE "goal_on_activity" ALTER COLUMN "activityId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "goal_on_activity" ADD CONSTRAINT "FK_38b4ae22b0c60af98f7fe308a15" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_on_activity" DROP CONSTRAINT "FK_38b4ae22b0c60af98f7fe308a15"`);
        await queryRunner.query(`ALTER TABLE "goal_on_activity" ALTER COLUMN "activityId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "goal_on_activity" ADD CONSTRAINT "FK_38b4ae22b0c60af98f7fe308a15" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
