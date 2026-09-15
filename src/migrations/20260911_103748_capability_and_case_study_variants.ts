import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_capability_detail_variant" ADD VALUE 'accordion';
  ALTER TYPE "public"."enum_pages_blocks_capability_detail_variant" ADD VALUE 'tabs';
  ALTER TYPE "public"."enum_pages_blocks_capability_detail_variant" ADD VALUE 'bento';
  ALTER TYPE "public"."enum_pages_blocks_case_study_mock_key" ADD VALUE 'business-transformation';
  ALTER TYPE "public"."enum_pages_blocks_case_study_mock_key" ADD VALUE 'digital-experience';
  ALTER TYPE "public"."enum_pages_blocks_case_study_mock_key" ADD VALUE 'growth-transformation';
  ALTER TYPE "public"."enum_pages_blocks_case_study_mock_key" ADD VALUE 'digital-engineering';
  ALTER TYPE "public"."enum_pages_blocks_case_study_mock_key" ADD VALUE 'web-application-engineering';
  ALTER TYPE "public"."enum_pages_blocks_case_study_mock_key" ADD VALUE 'cloud-engineering';
  ALTER TYPE "public"."enum_pages_blocks_case_study_mock_key" ADD VALUE 'mobile-engineering';
  ALTER TYPE "public"."enum_pages_blocks_case_study_mock_key" ADD VALUE 'quality-engineering';
  ALTER TYPE "public"."enum__pages_v_blocks_capability_detail_variant" ADD VALUE 'accordion';
  ALTER TYPE "public"."enum__pages_v_blocks_capability_detail_variant" ADD VALUE 'tabs';
  ALTER TYPE "public"."enum__pages_v_blocks_capability_detail_variant" ADD VALUE 'bento';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_mock_key" ADD VALUE 'business-transformation';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_mock_key" ADD VALUE 'digital-experience';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_mock_key" ADD VALUE 'growth-transformation';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_mock_key" ADD VALUE 'digital-engineering';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_mock_key" ADD VALUE 'web-application-engineering';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_mock_key" ADD VALUE 'cloud-engineering';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_mock_key" ADD VALUE 'mobile-engineering';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_mock_key" ADD VALUE 'quality-engineering';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_capability_detail" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_capability_detail" ALTER COLUMN "variant" SET DEFAULT 'grid'::text;
  DROP TYPE "public"."enum_pages_blocks_capability_detail_variant";
  CREATE TYPE "public"."enum_pages_blocks_capability_detail_variant" AS ENUM('grid', 'row', 'numbered');
  ALTER TABLE "pages_blocks_capability_detail" ALTER COLUMN "variant" SET DEFAULT 'grid'::"public"."enum_pages_blocks_capability_detail_variant";
  ALTER TABLE "pages_blocks_capability_detail" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_capability_detail_variant" USING "variant"::"public"."enum_pages_blocks_capability_detail_variant";
  ALTER TABLE "pages_blocks_case_study" ALTER COLUMN "mock_key" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_case_study_mock_key";
  CREATE TYPE "public"."enum_pages_blocks_case_study_mock_key" AS ENUM('ai-transformation');
  ALTER TABLE "pages_blocks_case_study" ALTER COLUMN "mock_key" SET DATA TYPE "public"."enum_pages_blocks_case_study_mock_key" USING "mock_key"::"public"."enum_pages_blocks_case_study_mock_key";
  ALTER TABLE "_pages_v_blocks_capability_detail" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_capability_detail" ALTER COLUMN "variant" SET DEFAULT 'grid'::text;
  DROP TYPE "public"."enum__pages_v_blocks_capability_detail_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_capability_detail_variant" AS ENUM('grid', 'row', 'numbered');
  ALTER TABLE "_pages_v_blocks_capability_detail" ALTER COLUMN "variant" SET DEFAULT 'grid'::"public"."enum__pages_v_blocks_capability_detail_variant";
  ALTER TABLE "_pages_v_blocks_capability_detail" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_capability_detail_variant" USING "variant"::"public"."enum__pages_v_blocks_capability_detail_variant";
  ALTER TABLE "_pages_v_blocks_case_study" ALTER COLUMN "mock_key" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_case_study_mock_key";
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_mock_key" AS ENUM('ai-transformation');
  ALTER TABLE "_pages_v_blocks_case_study" ALTER COLUMN "mock_key" SET DATA TYPE "public"."enum__pages_v_blocks_case_study_mock_key" USING "mock_key"::"public"."enum__pages_v_blocks_case_study_mock_key";`)
}
