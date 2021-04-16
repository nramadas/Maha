import {MigrationInterface, QueryRunner} from "typeorm";

export class UniqueAuthId1618568336556 implements MigrationInterface {
    name = 'UniqueAuthId1618568336556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_40980e589785734a50439ccfc53"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_2084b497eeaa73c0417d901f024" UNIQUE ("email", "googleId", "appleId", "authId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_2084b497eeaa73c0417d901f024"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_40980e589785734a50439ccfc53" UNIQUE ("googleId", "appleId", "email")
        `);
    }

}
