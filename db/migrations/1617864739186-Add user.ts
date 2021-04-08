import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUser1617864739186 implements MigrationInterface {
    name = 'AddUser1617864739186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "googleId" character varying,
                "appleId" character varying,
                "email" character varying NOT NULL,
                "data" jsonb NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "UQ_40980e589785734a50439ccfc53" UNIQUE ("email", "googleId", "appleId"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}
