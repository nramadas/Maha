import {MigrationInterface, QueryRunner} from "typeorm";

export class FixInviteRoles1620048376724 implements MigrationInterface {
    name = 'FixInviteRoles1620048376724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "invite_roles_role" (
                "inviteId" uuid NOT NULL,
                "roleId" uuid NOT NULL,
                CONSTRAINT "PK_c57070a5da9df23e470028fc78f" PRIMARY KEY ("inviteId", "roleId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8f1dd8a4ea9bf36dc12e496901" ON "invite_roles_role" ("inviteId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_6422199bfad3b08ba6e4957361" ON "invite_roles_role" ("roleId")
        `);
        await queryRunner.query(`
            ALTER TABLE "invite_roles_role"
            ADD CONSTRAINT "FK_8f1dd8a4ea9bf36dc12e4969013" FOREIGN KEY ("inviteId") REFERENCES "invite"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "invite_roles_role"
            ADD CONSTRAINT "FK_6422199bfad3b08ba6e4957361d" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "invite_roles_role" DROP CONSTRAINT "FK_6422199bfad3b08ba6e4957361d"
        `);
        await queryRunner.query(`
            ALTER TABLE "invite_roles_role" DROP CONSTRAINT "FK_8f1dd8a4ea9bf36dc12e4969013"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_6422199bfad3b08ba6e4957361"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_8f1dd8a4ea9bf36dc12e496901"
        `);
        await queryRunner.query(`
            DROP TABLE "invite_roles_role"
        `);
    }

}
