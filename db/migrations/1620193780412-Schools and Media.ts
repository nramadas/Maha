import {MigrationInterface, QueryRunner} from "typeorm";

export class SchoolsAndMedia1620193780412 implements MigrationInterface {
    name = 'SchoolsAndMedia1620193780412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "media_type_enum" AS ENUM('Image', 'Video', 'Blueprint')
        `);
        await queryRunner.query(`
            CREATE TYPE "media_parenttype_enum" AS ENUM('Organization', 'Property', 'User')
        `);
        await queryRunner.query(`
            CREATE TABLE "media" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" "media_type_enum" NOT NULL,
                "data" jsonb NOT NULL,
                "parentId" character varying,
                "parentType" "media_parenttype_enum",
                "src" character varying NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "school" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "data" jsonb NOT NULL,
                "name" character varying NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "PK_57836c3fe2f2c7734b20911755e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "school_nearby_properties_property" (
                "schoolId" uuid NOT NULL,
                "propertyId" uuid NOT NULL,
                CONSTRAINT "PK_98767be666ed0d35f1c33e59e10" PRIMARY KEY ("schoolId", "propertyId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_e035901cfd0f61d058e0e25e33" ON "school_nearby_properties_property" ("schoolId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_61e65e90bef0515b3ce06a15bf" ON "school_nearby_properties_property" ("propertyId")
        `);
        await queryRunner.query(`
            ALTER TABLE "school_nearby_properties_property"
            ADD CONSTRAINT "FK_e035901cfd0f61d058e0e25e335" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "school_nearby_properties_property"
            ADD CONSTRAINT "FK_61e65e90bef0515b3ce06a15bf0" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "school_nearby_properties_property" DROP CONSTRAINT "FK_61e65e90bef0515b3ce06a15bf0"
        `);
        await queryRunner.query(`
            ALTER TABLE "school_nearby_properties_property" DROP CONSTRAINT "FK_e035901cfd0f61d058e0e25e335"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_61e65e90bef0515b3ce06a15bf"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_e035901cfd0f61d058e0e25e33"
        `);
        await queryRunner.query(`
            DROP TABLE "school_nearby_properties_property"
        `);
        await queryRunner.query(`
            DROP TABLE "school"
        `);
        await queryRunner.query(`
            DROP TABLE "media"
        `);
        await queryRunner.query(`
            DROP TYPE "media_parenttype_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "media_type_enum"
        `);
    }

}
