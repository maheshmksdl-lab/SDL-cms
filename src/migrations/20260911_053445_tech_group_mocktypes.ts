import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_tech_groups_groups_mock_type" ADD VALUE 'split';
  ALTER TYPE "public"."enum_pages_blocks_tech_groups_groups_mock_type" ADD VALUE 'cms';
  ALTER TYPE "public"."enum_pages_blocks_tech_groups_groups_mock_type" ADD VALUE 'graph';
  ALTER TYPE "public"."enum__pages_v_blocks_tech_groups_groups_mock_type" ADD VALUE 'split';
  ALTER TYPE "public"."enum__pages_v_blocks_tech_groups_groups_mock_type" ADD VALUE 'cms';
  ALTER TYPE "public"."enum__pages_v_blocks_tech_groups_groups_mock_type" ADD VALUE 'graph';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_tech_groups_groups" ALTER COLUMN "mock_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_tech_groups_groups" ALTER COLUMN "mock_type" SET DEFAULT 'ui'::text;
  DROP TYPE "public"."enum_pages_blocks_tech_groups_groups_mock_type";
  CREATE TYPE "public"."enum_pages_blocks_tech_groups_groups_mock_type" AS ENUM('ui', 'server', 'code');
  ALTER TABLE "pages_blocks_tech_groups_groups" ALTER COLUMN "mock_type" SET DEFAULT 'ui'::"public"."enum_pages_blocks_tech_groups_groups_mock_type";
  ALTER TABLE "pages_blocks_tech_groups_groups" ALTER COLUMN "mock_type" SET DATA TYPE "public"."enum_pages_blocks_tech_groups_groups_mock_type" USING "mock_type"::"public"."enum_pages_blocks_tech_groups_groups_mock_type";
  ALTER TABLE "_pages_v_blocks_tech_groups_groups" ALTER COLUMN "mock_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_tech_groups_groups" ALTER COLUMN "mock_type" SET DEFAULT 'ui'::text;
  DROP TYPE "public"."enum__pages_v_blocks_tech_groups_groups_mock_type";
  CREATE TYPE "public"."enum__pages_v_blocks_tech_groups_groups_mock_type" AS ENUM('ui', 'server', 'code');
  ALTER TABLE "_pages_v_blocks_tech_groups_groups" ALTER COLUMN "mock_type" SET DEFAULT 'ui'::"public"."enum__pages_v_blocks_tech_groups_groups_mock_type";
  ALTER TABLE "_pages_v_blocks_tech_groups_groups" ALTER COLUMN "mock_type" SET DATA TYPE "public"."enum__pages_v_blocks_tech_groups_groups_mock_type" USING "mock_type"::"public"."enum__pages_v_blocks_tech_groups_groups_mock_type";`)
}
