import {MigrationInterface, QueryRunner} from "typeorm";

export class init1620714185930 implements MigrationInterface {
    name = 'init1620714185930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "invite_type_enum" AS ENUM(
                'CreateOrganization',
                'JoinOrganization',
                'Unknown'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "invite" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "expired" boolean NOT NULL DEFAULT false,
                "type" "invite_type_enum" NOT NULL DEFAULT 'Unknown',
                "organizationId" uuid,
                "data" jsonb NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "UQ_658d8246180c0345d32a100544e" UNIQUE ("email"),
                CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "organization" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "data" jsonb NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "UQ_c21e615583a3ebbb0977452afb0" UNIQUE ("name"),
                CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "property" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "data" jsonb NOT NULL,
                "metropolitanKey" character varying,
                "organizationId" uuid NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "role" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "organizationId" uuid NOT NULL,
                "data" jsonb NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "googleId" character varying,
                "appleId" character varying,
                "authId" character varying NOT NULL,
                "email" character varying NOT NULL,
                "organizationId" uuid,
                "data" jsonb NOT NULL,
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "UQ_2084b497eeaa73c0417d901f024" UNIQUE ("email", "googleId", "appleId", "authId"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
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
            CREATE TYPE "school_type_enum" AS ENUM(
                'Matriculation',
                'PrePrimary',
                'Primary',
                'Secondary',
                'SeniorSecondary'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "school" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "data" jsonb NOT NULL,
                "googleId" character varying,
                "name" character varying NOT NULL,
                "type" "school_type_enum",
                "created" TIMESTAMP NOT NULL DEFAULT now(),
                "updated" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted" TIMESTAMP,
                CONSTRAINT "PK_57836c3fe2f2c7734b20911755e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "invite_roles_role" (
                "inviteId" uuid NOT NULL,
                "roleId" uuid NOT NULL,
                CONSTRAINT "PK_c57070a5da9df23e470028fc78f" PRIMARY KEY ("inviteId", "roleId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_8f1dd8a4ea9bf36dc12e496901" ON "invite_roles_role" ("inviteId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_6422199bfad3b08ba6e4957361" ON "invite_roles_role" ("roleId")
        `);
        await queryRunner.query(`
            CREATE TABLE "role_users_user" (
                "roleId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_46403d6ce64cde119287c876ca3" PRIMARY KEY ("roleId", "userId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ed6edac7184b013d4bd58d60e5" ON "role_users_user" ("roleId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a88fcb405b56bf2e2646e9d479" ON "role_users_user" ("userId")
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
            ALTER TABLE "invite"
            ADD CONSTRAINT "FK_68eef4ab86b67747f24f288a16c" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "property"
            ADD CONSTRAINT "FK_f56f94ae89db53dcb8f4620c04b" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "role"
            ADD CONSTRAINT "FK_2bcd50772082305f3bcee6b6da4" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "invite_roles_role"
            ADD CONSTRAINT "FK_8f1dd8a4ea9bf36dc12e4969013" FOREIGN KEY ("inviteId") REFERENCES "invite"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "invite_roles_role"
            ADD CONSTRAINT "FK_6422199bfad3b08ba6e4957361d" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "role_users_user"
            ADD CONSTRAINT "FK_ed6edac7184b013d4bd58d60e54" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "role_users_user"
            ADD CONSTRAINT "FK_a88fcb405b56bf2e2646e9d4797" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "role_users_user" DROP CONSTRAINT "FK_a88fcb405b56bf2e2646e9d4797"
        `);
        await queryRunner.query(`
            ALTER TABLE "role_users_user" DROP CONSTRAINT "FK_ed6edac7184b013d4bd58d60e54"
        `);
        await queryRunner.query(`
            ALTER TABLE "invite_roles_role" DROP CONSTRAINT "FK_6422199bfad3b08ba6e4957361d"
        `);
        await queryRunner.query(`
            ALTER TABLE "invite_roles_role" DROP CONSTRAINT "FK_8f1dd8a4ea9bf36dc12e4969013"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"
        `);
        await queryRunner.query(`
            ALTER TABLE "role" DROP CONSTRAINT "FK_2bcd50772082305f3bcee6b6da4"
        `);
        await queryRunner.query(`
            ALTER TABLE "property" DROP CONSTRAINT "FK_f56f94ae89db53dcb8f4620c04b"
        `);
        await queryRunner.query(`
            ALTER TABLE "invite" DROP CONSTRAINT "FK_68eef4ab86b67747f24f288a16c"
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
            DROP INDEX "IDX_a88fcb405b56bf2e2646e9d479"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_ed6edac7184b013d4bd58d60e5"
        `);
        await queryRunner.query(`
            DROP TABLE "role_users_user"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_6422199bfad3b08ba6e4957361"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_8f1dd8a4ea9bf36dc12e496901"
        `);
        await queryRunner.query(`
            DROP TABLE "invite_roles_role"
        `);
        await queryRunner.query(`
            DROP TABLE "school"
        `);
        await queryRunner.query(`
            DROP TYPE "school_type_enum"
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
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "role"
        `);
        await queryRunner.query(`
            DROP TABLE "property"
        `);
        await queryRunner.query(`
            DROP TABLE "organization"
        `);
        await queryRunner.query(`
            DROP TABLE "invite"
        `);
        await queryRunner.query(`
            DROP TYPE "invite_type_enum"
        `);
    }

}
