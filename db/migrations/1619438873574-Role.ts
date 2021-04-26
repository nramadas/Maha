import {MigrationInterface, QueryRunner} from "typeorm";

export class Role1619438873574 implements MigrationInterface {
    name = 'Role1619438873574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "role" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "organizationId" integer NOT NULL,
                "userId" integer NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "UQ_ROLE" UNIQUE ("name", "organizationId", "userId"),
                CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "role"
        `);
    }

}
