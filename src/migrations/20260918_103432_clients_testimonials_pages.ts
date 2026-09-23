import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_page_intro_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_page_intro_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_clients_grid_clients_tab_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_clients_grid_testimonials_tab_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_clients_grid_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_clients_grid_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_clients_grid_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_grid_clients_tab_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_grid_testimonials_tab_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_grid_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_grid_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_grid_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_success_cta_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_success_cta_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_success_cta_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_page_intro_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_page_intro_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_clients_grid_clients_tab_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_clients_grid_testimonials_tab_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_clients_grid_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_clients_grid_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_clients_grid_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_grid_clients_tab_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_grid_testimonials_tab_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_grid_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_grid_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_grid_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_success_cta_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_success_cta_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_success_cta_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TABLE "pages_blocks_page_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_page_intro_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_page_intro_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_clients_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"clients_tab_type" "enum_pages_blocks_clients_grid_clients_tab_type" DEFAULT 'internal',
  	"clients_tab_page_id" integer,
  	"clients_tab_url" varchar,
  	"clients_tab_anchor" varchar,
  	"clients_tab_new_tab" boolean DEFAULT false,
  	"testimonials_tab_type" "enum_pages_blocks_clients_grid_testimonials_tab_type" DEFAULT 'internal',
  	"testimonials_tab_page_id" integer,
  	"testimonials_tab_url" varchar,
  	"testimonials_tab_anchor" varchar,
  	"testimonials_tab_new_tab" boolean DEFAULT false,
  	"source" "enum_pages_blocks_clients_grid_source" DEFAULT 'auto',
  	"featured_only" boolean DEFAULT false,
  	"limit" numeric DEFAULT 100,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_clients_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_clients_grid_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"clients_tab_type" "enum_pages_blocks_testimonials_grid_clients_tab_type" DEFAULT 'internal',
  	"clients_tab_page_id" integer,
  	"clients_tab_url" varchar,
  	"clients_tab_anchor" varchar,
  	"clients_tab_new_tab" boolean DEFAULT false,
  	"testimonials_tab_type" "enum_pages_blocks_testimonials_grid_testimonials_tab_type" DEFAULT 'internal',
  	"testimonials_tab_page_id" integer,
  	"testimonials_tab_url" varchar,
  	"testimonials_tab_anchor" varchar,
  	"testimonials_tab_new_tab" boolean DEFAULT false,
  	"source" "enum_pages_blocks_testimonials_grid_source" DEFAULT 'auto',
  	"featured_only" boolean DEFAULT false,
  	"limit" numeric DEFAULT 100,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_testimonials_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_testimonials_grid_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_success_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"sub" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_success_cta_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_success_cta_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_success_cta_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_page_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_page_intro_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_page_intro_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_clients_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"clients_tab_type" "enum__pages_v_blocks_clients_grid_clients_tab_type" DEFAULT 'internal',
  	"clients_tab_page_id" integer,
  	"clients_tab_url" varchar,
  	"clients_tab_anchor" varchar,
  	"clients_tab_new_tab" boolean DEFAULT false,
  	"testimonials_tab_type" "enum__pages_v_blocks_clients_grid_testimonials_tab_type" DEFAULT 'internal',
  	"testimonials_tab_page_id" integer,
  	"testimonials_tab_url" varchar,
  	"testimonials_tab_anchor" varchar,
  	"testimonials_tab_new_tab" boolean DEFAULT false,
  	"source" "enum__pages_v_blocks_clients_grid_source" DEFAULT 'auto',
  	"featured_only" boolean DEFAULT false,
  	"limit" numeric DEFAULT 100,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_clients_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_clients_grid_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"clients_tab_type" "enum__pages_v_blocks_testimonials_grid_clients_tab_type" DEFAULT 'internal',
  	"clients_tab_page_id" integer,
  	"clients_tab_url" varchar,
  	"clients_tab_anchor" varchar,
  	"clients_tab_new_tab" boolean DEFAULT false,
  	"testimonials_tab_type" "enum__pages_v_blocks_testimonials_grid_testimonials_tab_type" DEFAULT 'internal',
  	"testimonials_tab_page_id" integer,
  	"testimonials_tab_url" varchar,
  	"testimonials_tab_anchor" varchar,
  	"testimonials_tab_new_tab" boolean DEFAULT false,
  	"source" "enum__pages_v_blocks_testimonials_grid_source" DEFAULT 'auto',
  	"featured_only" boolean DEFAULT false,
  	"limit" numeric DEFAULT 100,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_testimonials_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_testimonials_grid_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_success_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"sub" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_success_cta_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_success_cta_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_success_cta_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "testimonials" ADD COLUMN "designation" varchar;
  ALTER TABLE "testimonials" ADD COLUMN "rating" numeric DEFAULT 5;
  ALTER TABLE "pages_blocks_page_intro" ADD CONSTRAINT "pages_blocks_page_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_clients_grid" ADD CONSTRAINT "pages_blocks_clients_grid_clients_tab_page_id_pages_id_fk" FOREIGN KEY ("clients_tab_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_clients_grid" ADD CONSTRAINT "pages_blocks_clients_grid_testimonials_tab_page_id_pages_id_fk" FOREIGN KEY ("testimonials_tab_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_clients_grid" ADD CONSTRAINT "pages_blocks_clients_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_grid" ADD CONSTRAINT "pages_blocks_testimonials_grid_clients_tab_page_id_pages_id_fk" FOREIGN KEY ("clients_tab_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_grid" ADD CONSTRAINT "pages_blocks_testimonials_grid_testimonials_tab_page_id_pages_id_fk" FOREIGN KEY ("testimonials_tab_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_grid" ADD CONSTRAINT "pages_blocks_testimonials_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_success_cta" ADD CONSTRAINT "pages_blocks_success_cta_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_success_cta" ADD CONSTRAINT "pages_blocks_success_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_intro" ADD CONSTRAINT "_pages_v_blocks_page_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_clients_grid" ADD CONSTRAINT "_pages_v_blocks_clients_grid_clients_tab_page_id_pages_id_fk" FOREIGN KEY ("clients_tab_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_clients_grid" ADD CONSTRAINT "_pages_v_blocks_clients_grid_testimonials_tab_page_id_pages_id_fk" FOREIGN KEY ("testimonials_tab_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_clients_grid" ADD CONSTRAINT "_pages_v_blocks_clients_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_grid" ADD CONSTRAINT "_pages_v_blocks_testimonials_grid_clients_tab_page_id_pages_id_fk" FOREIGN KEY ("clients_tab_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_grid" ADD CONSTRAINT "_pages_v_blocks_testimonials_grid_testimonials_tab_page_id_pages_id_fk" FOREIGN KEY ("testimonials_tab_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_grid" ADD CONSTRAINT "_pages_v_blocks_testimonials_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_success_cta" ADD CONSTRAINT "_pages_v_blocks_success_cta_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_success_cta" ADD CONSTRAINT "_pages_v_blocks_success_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_page_intro_order_idx" ON "pages_blocks_page_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_intro_parent_id_idx" ON "pages_blocks_page_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_intro_path_idx" ON "pages_blocks_page_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_clients_grid_order_idx" ON "pages_blocks_clients_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_clients_grid_parent_id_idx" ON "pages_blocks_clients_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_clients_grid_path_idx" ON "pages_blocks_clients_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_clients_grid_clients_tab_clients_tab_page_idx" ON "pages_blocks_clients_grid" USING btree ("clients_tab_page_id");
  CREATE INDEX "pages_blocks_clients_grid_testimonials_tab_testimonials__idx" ON "pages_blocks_clients_grid" USING btree ("testimonials_tab_page_id");
  CREATE INDEX "pages_blocks_testimonials_grid_order_idx" ON "pages_blocks_testimonials_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_grid_parent_id_idx" ON "pages_blocks_testimonials_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_grid_path_idx" ON "pages_blocks_testimonials_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_grid_clients_tab_clients_tab_p_idx" ON "pages_blocks_testimonials_grid" USING btree ("clients_tab_page_id");
  CREATE INDEX "pages_blocks_testimonials_grid_testimonials_tab_testimon_idx" ON "pages_blocks_testimonials_grid" USING btree ("testimonials_tab_page_id");
  CREATE INDEX "pages_blocks_success_cta_order_idx" ON "pages_blocks_success_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_success_cta_parent_id_idx" ON "pages_blocks_success_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_success_cta_path_idx" ON "pages_blocks_success_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_success_cta_cta_cta_page_idx" ON "pages_blocks_success_cta" USING btree ("cta_page_id");
  CREATE INDEX "_pages_v_blocks_page_intro_order_idx" ON "_pages_v_blocks_page_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_intro_parent_id_idx" ON "_pages_v_blocks_page_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_intro_path_idx" ON "_pages_v_blocks_page_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_clients_grid_order_idx" ON "_pages_v_blocks_clients_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_clients_grid_parent_id_idx" ON "_pages_v_blocks_clients_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_clients_grid_path_idx" ON "_pages_v_blocks_clients_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_clients_grid_clients_tab_clients_tab_pag_idx" ON "_pages_v_blocks_clients_grid" USING btree ("clients_tab_page_id");
  CREATE INDEX "_pages_v_blocks_clients_grid_testimonials_tab_testimonia_idx" ON "_pages_v_blocks_clients_grid" USING btree ("testimonials_tab_page_id");
  CREATE INDEX "_pages_v_blocks_testimonials_grid_order_idx" ON "_pages_v_blocks_testimonials_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_grid_parent_id_idx" ON "_pages_v_blocks_testimonials_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_grid_path_idx" ON "_pages_v_blocks_testimonials_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_grid_clients_tab_clients_ta_idx" ON "_pages_v_blocks_testimonials_grid" USING btree ("clients_tab_page_id");
  CREATE INDEX "_pages_v_blocks_testimonials_grid_testimonials_tab_testi_idx" ON "_pages_v_blocks_testimonials_grid" USING btree ("testimonials_tab_page_id");
  CREATE INDEX "_pages_v_blocks_success_cta_order_idx" ON "_pages_v_blocks_success_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_success_cta_parent_id_idx" ON "_pages_v_blocks_success_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_success_cta_path_idx" ON "_pages_v_blocks_success_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_success_cta_cta_cta_page_idx" ON "_pages_v_blocks_success_cta" USING btree ("cta_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_page_intro" CASCADE;
  DROP TABLE "pages_blocks_clients_grid" CASCADE;
  DROP TABLE "pages_blocks_testimonials_grid" CASCADE;
  DROP TABLE "pages_blocks_success_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_page_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_clients_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_success_cta" CASCADE;
  ALTER TABLE "testimonials" DROP COLUMN "designation";
  ALTER TABLE "testimonials" DROP COLUMN "rating";
  DROP TYPE "public"."enum_pages_blocks_page_intro_settings_background";
  DROP TYPE "public"."enum_pages_blocks_page_intro_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_clients_grid_clients_tab_type";
  DROP TYPE "public"."enum_pages_blocks_clients_grid_testimonials_tab_type";
  DROP TYPE "public"."enum_pages_blocks_clients_grid_source";
  DROP TYPE "public"."enum_pages_blocks_clients_grid_settings_background";
  DROP TYPE "public"."enum_pages_blocks_clients_grid_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_testimonials_grid_clients_tab_type";
  DROP TYPE "public"."enum_pages_blocks_testimonials_grid_testimonials_tab_type";
  DROP TYPE "public"."enum_pages_blocks_testimonials_grid_source";
  DROP TYPE "public"."enum_pages_blocks_testimonials_grid_settings_background";
  DROP TYPE "public"."enum_pages_blocks_testimonials_grid_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_success_cta_cta_type";
  DROP TYPE "public"."enum_pages_blocks_success_cta_settings_background";
  DROP TYPE "public"."enum_pages_blocks_success_cta_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_page_intro_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_page_intro_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_clients_grid_clients_tab_type";
  DROP TYPE "public"."enum__pages_v_blocks_clients_grid_testimonials_tab_type";
  DROP TYPE "public"."enum__pages_v_blocks_clients_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_clients_grid_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_clients_grid_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_grid_clients_tab_type";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_grid_testimonials_tab_type";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_grid_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_grid_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_success_cta_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_success_cta_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_success_cta_settings_spacing";`)
}
