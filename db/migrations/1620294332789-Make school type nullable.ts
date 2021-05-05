import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeSchoolTypeNullable1620294332789 implements MigrationInterface {
    name = 'MakeSchoolTypeNullable1620294332789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "school"
            ALTER COLUMN "type" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "school"
            ALTER COLUMN "type"
            SET NOT NULL
        `);
    }

}
