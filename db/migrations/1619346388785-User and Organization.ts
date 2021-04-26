import {MigrationInterface, QueryRunner} from "typeorm";

export class UserAndOrganization1619346388785 implements MigrationInterface {
    name = 'UserAndOrganization1619346388785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "organization" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "data" jsonb NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"),
                CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "googleId" character varying,
                "appleId" character varying,
                "authId" character varying NOT NULL,
                "email" character varying NOT NULL,
                "data" jsonb NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "UQ_2084b497eeaa73c0417d901f024" UNIQUE ("email", "googleId", "appleId", "authId"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "organization"
        `);
    }

}
