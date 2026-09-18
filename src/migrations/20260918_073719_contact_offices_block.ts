import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_contact_offices_heading_level" AS ENUM('h1', 'h2');
  CREATE TYPE "public"."enum_pages_blocks_contact_offices_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_contact_offices_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_offices_heading_level" AS ENUM('h1', 'h2');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_offices_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_offices_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TABLE "pages_blocks_contact_offices_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"region" varchar,
  	"address_label" varchar DEFAULT 'Address',
  	"address" varchar,
  	"email" varchar,
  	"phone" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Get in touch',
  	"heading_level" "enum_pages_blocks_contact_offices_heading_level" DEFAULT 'h1',
  	"sub" varchar,
  	"intro" varchar,
  	"form_id" integer,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_contact_offices_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_contact_offices_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_offices_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"region" varchar,
  	"address_label" varchar DEFAULT 'Address',
  	"address" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Get in touch',
  	"heading_level" "enum__pages_v_blocks_contact_offices_heading_level" DEFAULT 'h1',
  	"sub" varchar,
  	"intro" varchar,
  	"form_id" integer,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_contact_offices_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_contact_offices_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_contact_offices_offices" ADD CONSTRAINT "pages_blocks_contact_offices_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_offices" ADD CONSTRAINT "pages_blocks_contact_offices_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_offices" ADD CONSTRAINT "pages_blocks_contact_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_offices_offices" ADD CONSTRAINT "_pages_v_blocks_contact_offices_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_offices" ADD CONSTRAINT "_pages_v_blocks_contact_offices_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_offices" ADD CONSTRAINT "_pages_v_blocks_contact_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_contact_offices_offices_order_idx" ON "pages_blocks_contact_offices_offices" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_offices_offices_parent_id_idx" ON "pages_blocks_contact_offices_offices" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_offices_order_idx" ON "pages_blocks_contact_offices" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_offices_parent_id_idx" ON "pages_blocks_contact_offices" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_offices_path_idx" ON "pages_blocks_contact_offices" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_offices_form_idx" ON "pages_blocks_contact_offices" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_contact_offices_offices_order_idx" ON "_pages_v_blocks_contact_offices_offices" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_offices_offices_parent_id_idx" ON "_pages_v_blocks_contact_offices_offices" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_offices_order_idx" ON "_pages_v_blocks_contact_offices" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_offices_parent_id_idx" ON "_pages_v_blocks_contact_offices" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_offices_path_idx" ON "_pages_v_blocks_contact_offices" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_offices_form_idx" ON "_pages_v_blocks_contact_offices" USING btree ("form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_contact_offices_offices" CASCADE;
  DROP TABLE "pages_blocks_contact_offices" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_offices_offices" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_offices" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_contact_offices_heading_level";
  DROP TYPE "public"."enum_pages_blocks_contact_offices_settings_background";
  DROP TYPE "public"."enum_pages_blocks_contact_offices_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_contact_offices_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_contact_offices_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_contact_offices_settings_spacing";`)
}
