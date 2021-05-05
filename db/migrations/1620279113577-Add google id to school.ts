import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGoogleIdToSchool1620279113577 implements MigrationInterface {
    name = 'AddGoogleIdToSchool1620279113577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "school"
            ADD "googleId" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "school" DROP COLUMN "googleId"
        `);
    }

}
