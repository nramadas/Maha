import {MigrationInterface, QueryRunner} from "typeorm";

export class AddProperty1620139129950 implements MigrationInterface {
    name = 'AddProperty1620139129950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "property" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "organizationId" uuid NOT NULL,
                "data" jsonb NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "property"
            ADD CONSTRAINT "FK_f56f94ae89db53dcb8f4620c04b" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "property" DROP CONSTRAINT "FK_f56f94ae89db53dcb8f4620c04b"
        `);
        await queryRunner.query(`
            DROP TABLE "property"
        `);
    }

}
