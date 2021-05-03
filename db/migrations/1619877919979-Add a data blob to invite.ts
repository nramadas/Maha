import {MigrationInterface, QueryRunner} from "typeorm";

export class AddADataBlobToInvite1619877919979 implements MigrationInterface {
    name = 'AddADataBlobToInvite1619877919979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "invite"
            ADD "data" jsonb NOT NULL
        `);
        await queryRunner.query(`
            ALTER TYPE "invite_type_enum"
            RENAME TO "invite_type_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "invite_type_enum" AS ENUM(
                'CreateOrganization',
                'JoinOrganization',
                'Unknown'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "invite"
            ALTER COLUMN "type" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "invite"
            ALTER COLUMN "type" TYPE "invite_type_enum" USING "type"::"text"::"invite_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "invite"
            ALTER COLUMN "type"
            SET DEFAULT 'Unknown'
        `);
        await queryRunner.query(`
            DROP TYPE "invite_type_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "invite_type_enum_old" AS ENUM(
                'createOrganization',
                'joinOrganization',
                'unknown'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "invite"
            ALTER COLUMN "type" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "invite"
            ALTER COLUMN "type" TYPE "invite_type_enum_old" USING "type"::"text"::"invite_type_enum_old"
        `);
        await queryRunner.query(`
            ALTER TABLE "invite"
            ALTER COLUMN "type"
            SET DEFAULT 'unknown'
        `);
        await queryRunner.query(`
            DROP TYPE "invite_type_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "invite_type_enum_old"
            RENAME TO "invite_type_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "invite" DROP COLUMN "data"
        `);
    }

}
