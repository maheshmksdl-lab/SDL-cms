import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_header_variant" AS ENUM('default', 'transparent');
  CREATE TYPE "public"."enum__pages_v_version_header_variant" AS ENUM('default', 'transparent');
  CREATE TYPE "public"."enum_insights_swatch" AS ENUM('accent', 'success', 'attention');
  CREATE TYPE "public"."enum__insights_v_version_swatch" AS ENUM('accent', 'success', 'attention');
  ALTER TABLE "pages" ADD COLUMN "header_variant" "enum_pages_header_variant" DEFAULT 'default';
  ALTER TABLE "pages" ADD COLUMN "hide_footer" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_header_variant" "enum__pages_v_version_header_variant" DEFAULT 'default';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hide_footer" boolean DEFAULT false;
  ALTER TABLE "insights" ADD COLUMN "author" varchar;
  ALTER TABLE "insights" ADD COLUMN "swatch" "enum_insights_swatch" DEFAULT 'accent';
  ALTER TABLE "_insights_v" ADD COLUMN "version_author" varchar;
  ALTER TABLE "_insights_v" ADD COLUMN "version_swatch" "enum__insights_v_version_swatch" DEFAULT 'accent';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "header_variant";
  ALTER TABLE "pages" DROP COLUMN "hide_footer";
  ALTER TABLE "_pages_v" DROP COLUMN "version_header_variant";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hide_footer";
  ALTER TABLE "insights" DROP COLUMN "author";
  ALTER TABLE "insights" DROP COLUMN "swatch";
  ALTER TABLE "_insights_v" DROP COLUMN "version_author";
  ALTER TABLE "_insights_v" DROP COLUMN "version_swatch";
  DROP TYPE "public"."enum_pages_header_variant";
  DROP TYPE "public"."enum__pages_v_version_header_variant";
  DROP TYPE "public"."enum_insights_swatch";
  DROP TYPE "public"."enum__insights_v_version_swatch";`)
}
