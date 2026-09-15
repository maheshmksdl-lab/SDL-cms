import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_value_grid_variant" ADD VALUE 'de-accent-cards';
  ALTER TYPE "public"."enum_pages_blocks_value_grid_variant" ADD VALUE 'bt-timeline';
  ALTER TYPE "public"."enum_pages_blocks_value_grid_variant" ADD VALUE 'dx-checklist';
  ALTER TYPE "public"."enum_pages_blocks_value_grid_variant" ADD VALUE 'gt-stat-rows';
  ALTER TYPE "public"."enum__pages_v_blocks_value_grid_variant" ADD VALUE 'de-accent-cards';
  ALTER TYPE "public"."enum__pages_v_blocks_value_grid_variant" ADD VALUE 'bt-timeline';
  ALTER TYPE "public"."enum__pages_v_blocks_value_grid_variant" ADD VALUE 'dx-checklist';
  ALTER TYPE "public"."enum__pages_v_blocks_value_grid_variant" ADD VALUE 'gt-stat-rows';
  CREATE TABLE "pages_blocks_tech_groups_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tech_groups_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_tech_groups_intro" ADD CONSTRAINT "pages_blocks_tech_groups_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tech_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tech_groups_intro" ADD CONSTRAINT "_pages_v_blocks_tech_groups_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tech_groups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_tech_groups_intro_order_idx" ON "pages_blocks_tech_groups_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_tech_groups_intro_parent_id_idx" ON "pages_blocks_tech_groups_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tech_groups_intro_order_idx" ON "_pages_v_blocks_tech_groups_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tech_groups_intro_parent_id_idx" ON "_pages_v_blocks_tech_groups_intro" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_tech_groups_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_tech_groups_intro" CASCADE;
  ALTER TABLE "pages_blocks_value_grid" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_value_grid" ALTER COLUMN "variant" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum_pages_blocks_value_grid_variant";
  CREATE TYPE "public"."enum_pages_blocks_value_grid_variant" AS ENUM('dark', 'light', 'bento', 'icon-cards');
  ALTER TABLE "pages_blocks_value_grid" ALTER COLUMN "variant" SET DEFAULT 'dark'::"public"."enum_pages_blocks_value_grid_variant";
  ALTER TABLE "pages_blocks_value_grid" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_value_grid_variant" USING "variant"::"public"."enum_pages_blocks_value_grid_variant";
  ALTER TABLE "_pages_v_blocks_value_grid" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_value_grid" ALTER COLUMN "variant" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum__pages_v_blocks_value_grid_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_value_grid_variant" AS ENUM('dark', 'light', 'bento', 'icon-cards');
  ALTER TABLE "_pages_v_blocks_value_grid" ALTER COLUMN "variant" SET DEFAULT 'dark'::"public"."enum__pages_v_blocks_value_grid_variant";
  ALTER TABLE "_pages_v_blocks_value_grid" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_value_grid_variant" USING "variant"::"public"."enum__pages_v_blocks_value_grid_variant";`)
}
