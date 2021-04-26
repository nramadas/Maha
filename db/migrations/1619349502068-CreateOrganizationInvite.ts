import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateOrganizationInvite1619349502068 implements MigrationInterface {
    name = 'CreateOrganizationInvite1619349502068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "create_organization_invite" (
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "expired" boolean NOT NULL DEFAULT false,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "UQ_99571ee090449b34d7ff8e57e19" UNIQUE ("email"),
                CONSTRAINT "PK_f042d1f9a5ec51d857bd1e5bb42" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "create_organization_invite"
        `);
    }

}
