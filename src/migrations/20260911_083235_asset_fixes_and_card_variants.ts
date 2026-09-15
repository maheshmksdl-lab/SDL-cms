import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_case_study_mock_key" AS ENUM('ai-transformation');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_mock_key" AS ENUM('ai-transformation');
  ALTER TYPE "public"."enum_pages_blocks_capability_detail_variant" ADD VALUE 'numbered';
  ALTER TYPE "public"."enum__pages_v_blocks_capability_detail_variant" ADD VALUE 'numbered';
  ALTER TABLE "services" ALTER COLUMN "motif_key" SET DATA TYPE text;
  ALTER TABLE "_services_v" ALTER COLUMN "version_motif_key" SET DATA TYPE text;
  UPDATE "services" SET "motif_key" = 'digital-engineering' WHERE "motif_key" = 'Digital engineering';
  UPDATE "services" SET "motif_key" = 'business-transformation' WHERE "motif_key" = 'Business transformation';
  UPDATE "services" SET "motif_key" = 'digital-experience' WHERE "motif_key" = 'Digital experience';
  UPDATE "services" SET "motif_key" = 'growth-transformation' WHERE "motif_key" = 'Growth transformation';
  UPDATE "_services_v" SET "version_motif_key" = 'digital-engineering' WHERE "version_motif_key" = 'Digital engineering';
  UPDATE "_services_v" SET "version_motif_key" = 'business-transformation' WHERE "version_motif_key" = 'Business transformation';
  UPDATE "_services_v" SET "version_motif_key" = 'digital-experience' WHERE "version_motif_key" = 'Digital experience';
  UPDATE "_services_v" SET "version_motif_key" = 'growth-transformation' WHERE "version_motif_key" = 'Growth transformation';
  DROP TYPE "public"."enum_services_motif_key";
  CREATE TYPE "public"."enum_services_motif_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms');
  ALTER TABLE "services" ALTER COLUMN "motif_key" SET DATA TYPE "public"."enum_services_motif_key" USING "motif_key"::"public"."enum_services_motif_key";
  DROP TYPE "public"."enum__services_v_version_motif_key";
  CREATE TYPE "public"."enum__services_v_version_motif_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms');
  ALTER TABLE "_services_v" ALTER COLUMN "version_motif_key" SET DATA TYPE "public"."enum__services_v_version_motif_key" USING "version_motif_key"::"public"."enum__services_v_version_motif_key";
  ALTER TABLE "pages_blocks_case_study" ADD COLUMN "mock_key" "enum_pages_blocks_case_study_mock_key";
  ALTER TABLE "_pages_v_blocks_case_study" ADD COLUMN "mock_key" "enum__pages_v_blocks_case_study_mock_key";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_capability_detail" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_capability_detail" ALTER COLUMN "variant" SET DEFAULT 'grid'::text;
  DROP TYPE "public"."enum_pages_blocks_capability_detail_variant";
  CREATE TYPE "public"."enum_pages_blocks_capability_detail_variant" AS ENUM('grid', 'row');
  ALTER TABLE "pages_blocks_capability_detail" ALTER COLUMN "variant" SET DEFAULT 'grid'::"public"."enum_pages_blocks_capability_detail_variant";
  ALTER TABLE "pages_blocks_capability_detail" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_capability_detail_variant" USING "variant"::"public"."enum_pages_blocks_capability_detail_variant";
  ALTER TABLE "_pages_v_blocks_capability_detail" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_capability_detail" ALTER COLUMN "variant" SET DEFAULT 'grid'::text;
  DROP TYPE "public"."enum__pages_v_blocks_capability_detail_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_capability_detail_variant" AS ENUM('grid', 'row');
  ALTER TABLE "_pages_v_blocks_capability_detail" ALTER COLUMN "variant" SET DEFAULT 'grid'::"public"."enum__pages_v_blocks_capability_detail_variant";
  ALTER TABLE "_pages_v_blocks_capability_detail" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_capability_detail_variant" USING "variant"::"public"."enum__pages_v_blocks_capability_detail_variant";
  ALTER TABLE "services" ALTER COLUMN "motif_key" SET DATA TYPE text;
  DROP TYPE "public"."enum_services_motif_key";
  CREATE TYPE "public"."enum_services_motif_key" AS ENUM('ai-transformation', 'Digital engineering', 'Business transformation', 'Digital experience', 'Growth transformation', 'Products & platforms');
  ALTER TABLE "services" ALTER COLUMN "motif_key" SET DATA TYPE "public"."enum_services_motif_key" USING "motif_key"::"public"."enum_services_motif_key";
  ALTER TABLE "_services_v" ALTER COLUMN "version_motif_key" SET DATA TYPE text;
  DROP TYPE "public"."enum__services_v_version_motif_key";
  CREATE TYPE "public"."enum__services_v_version_motif_key" AS ENUM('ai-transformation', 'Digital engineering', 'Business transformation', 'Digital experience', 'Growth transformation', 'Products & platforms');
  ALTER TABLE "_services_v" ALTER COLUMN "version_motif_key" SET DATA TYPE "public"."enum__services_v_version_motif_key" USING "version_motif_key"::"public"."enum__services_v_version_motif_key";
  ALTER TABLE "pages_blocks_case_study" DROP COLUMN "mock_key";
  ALTER TABLE "_pages_v_blocks_case_study" DROP COLUMN "mock_key";
  DROP TYPE "public"."enum_pages_blocks_case_study_mock_key";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_mock_key";`)
}
