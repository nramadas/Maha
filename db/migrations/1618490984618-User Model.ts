import {MigrationInterface, QueryRunner} from "typeorm";

export class UserModel1618490984618 implements MigrationInterface {
    name = 'UserModel1618490984618'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
