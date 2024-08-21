import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724235523814 implements MigrationInterface {
    name = 'Migration1724235523814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "goal" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "startedTime" TIMESTAMP NOT NULL, "endedTime" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "goal_on_activity" ("id" SERIAL NOT NULL, "goalId" integer NOT NULL, "totalSpend" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "activityId" integer, CONSTRAINT "PK_99dec30d182d5a76464e1c2a710" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "goal" ADD CONSTRAINT "FK_40bd308ea814964cec7146c6dce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goal_on_activity" ADD CONSTRAINT "FK_38b4ae22b0c60af98f7fe308a15" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goal_on_activity" ADD CONSTRAINT "FK_ec3fe660765ad598f664d070c69" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_on_activity" DROP CONSTRAINT "FK_ec3fe660765ad598f664d070c69"`);
        await queryRunner.query(`ALTER TABLE "goal_on_activity" DROP CONSTRAINT "FK_38b4ae22b0c60af98f7fe308a15"`);
        await queryRunner.query(`ALTER TABLE "goal" DROP CONSTRAINT "FK_40bd308ea814964cec7146c6dce"`);
        await queryRunner.query(`DROP TABLE "goal_on_activity"`);
        await queryRunner.query(`DROP TABLE "goal"`);
    }

}
