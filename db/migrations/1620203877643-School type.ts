import {MigrationInterface, QueryRunner} from "typeorm";

export class SchoolType1620203877643 implements MigrationInterface {
    name = 'SchoolType1620203877643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "school_type_enum" AS ENUM(
                'Matriculation',
                'PrePrimary',
                'Primary',
                'Secondary',
                'SeniorSecondary'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "school"
            ADD "type" "school_type_enum" NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "school" DROP COLUMN "type"
        `);
        await queryRunner.query(`
            DROP TYPE "school_type_enum"
        `);
    }

}
