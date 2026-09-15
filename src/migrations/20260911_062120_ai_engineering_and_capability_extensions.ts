import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_narrative_pills_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_pages_blocks_capability_detail_items_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_capability_detail_variant" AS ENUM('grid', 'row');
  CREATE TYPE "public"."enum_pages_blocks_ai_engineering_mock_key" AS ENUM('digital-engineering', 'web-application-engineering', 'cloud-engineering', 'mobile-engineering', 'quality-engineering');
  CREATE TYPE "public"."enum_pages_blocks_ai_engineering_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_ai_engineering_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_narrative_pills_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum__pages_v_blocks_capability_detail_items_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_capability_detail_variant" AS ENUM('grid', 'row');
  CREATE TYPE "public"."enum__pages_v_blocks_ai_engineering_mock_key" AS ENUM('digital-engineering', 'web-application-engineering', 'cloud-engineering', 'mobile-engineering', 'quality-engineering');
  CREATE TYPE "public"."enum__pages_v_blocks_ai_engineering_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_ai_engineering_settings_spacing" AS ENUM('default', 'tight', 'flush');
  ALTER TYPE "public"."enum_pages_blocks_hero_visual_key" ADD VALUE 'ce-cloud' BEFORE 'evoq-suite';
  ALTER TYPE "public"."enum_pages_blocks_hero_visual_key" ADD VALUE 'me-phone' BEFORE 'evoq-suite';
  ALTER TYPE "public"."enum_pages_blocks_hero_visual_key" ADD VALUE 'qe-pipeline' BEFORE 'evoq-suite';
  ALTER TYPE "public"."enum__pages_v_blocks_hero_visual_key" ADD VALUE 'ce-cloud' BEFORE 'evoq-suite';
  ALTER TYPE "public"."enum__pages_v_blocks_hero_visual_key" ADD VALUE 'me-phone' BEFORE 'evoq-suite';
  ALTER TYPE "public"."enum__pages_v_blocks_hero_visual_key" ADD VALUE 'qe-pipeline' BEFORE 'evoq-suite';
  CREATE TABLE "pages_blocks_narrative_pills" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon_key" "enum_pages_blocks_narrative_pills_icon_key"
  );
  
  CREATE TABLE "pages_blocks_ai_engineering_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_ai_engineering" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"mock_key" "enum_pages_blocks_ai_engineering_mock_key",
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_ai_engineering_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_ai_engineering_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_narrative_pills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon_key" "enum__pages_v_blocks_narrative_pills_icon_key",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_ai_engineering_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_ai_engineering" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"mock_key" "enum__pages_v_blocks_ai_engineering_mock_key",
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_ai_engineering_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_ai_engineering_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_narrative" ADD COLUMN "quote" varchar;
  ALTER TABLE "pages_blocks_capability_detail_items" ADD COLUMN "link_type" "enum_pages_blocks_capability_detail_items_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_capability_detail_items" ADD COLUMN "link_page_id" integer;
  ALTER TABLE "pages_blocks_capability_detail_items" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_capability_detail_items" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "pages_blocks_capability_detail_items" ADD COLUMN "link_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_capability_detail" ADD COLUMN "variant" "enum_pages_blocks_capability_detail_variant" DEFAULT 'grid';
  ALTER TABLE "pages_blocks_capability_detail" ADD COLUMN "cross_cutting_label" varchar;
  ALTER TABLE "_pages_v_blocks_narrative" ADD COLUMN "quote" varchar;
  ALTER TABLE "_pages_v_blocks_capability_detail_items" ADD COLUMN "link_type" "enum__pages_v_blocks_capability_detail_items_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_capability_detail_items" ADD COLUMN "link_page_id" integer;
  ALTER TABLE "_pages_v_blocks_capability_detail_items" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_capability_detail_items" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "_pages_v_blocks_capability_detail_items" ADD COLUMN "link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_capability_detail" ADD COLUMN "variant" "enum__pages_v_blocks_capability_detail_variant" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_capability_detail" ADD COLUMN "cross_cutting_label" varchar;
  ALTER TABLE "pages_blocks_narrative_pills" ADD CONSTRAINT "pages_blocks_narrative_pills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_narrative"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ai_engineering_paragraphs" ADD CONSTRAINT "pages_blocks_ai_engineering_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_ai_engineering"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_ai_engineering" ADD CONSTRAINT "pages_blocks_ai_engineering_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_narrative_pills" ADD CONSTRAINT "_pages_v_blocks_narrative_pills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_narrative"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_ai_engineering_paragraphs" ADD CONSTRAINT "_pages_v_blocks_ai_engineering_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_ai_engineering"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_ai_engineering" ADD CONSTRAINT "_pages_v_blocks_ai_engineering_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_narrative_pills_order_idx" ON "pages_blocks_narrative_pills" USING btree ("_order");
  CREATE INDEX "pages_blocks_narrative_pills_parent_id_idx" ON "pages_blocks_narrative_pills" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ai_engineering_paragraphs_order_idx" ON "pages_blocks_ai_engineering_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_ai_engineering_paragraphs_parent_id_idx" ON "pages_blocks_ai_engineering_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ai_engineering_order_idx" ON "pages_blocks_ai_engineering" USING btree ("_order");
  CREATE INDEX "pages_blocks_ai_engineering_parent_id_idx" ON "pages_blocks_ai_engineering" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_ai_engineering_path_idx" ON "pages_blocks_ai_engineering" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_narrative_pills_order_idx" ON "_pages_v_blocks_narrative_pills" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_narrative_pills_parent_id_idx" ON "_pages_v_blocks_narrative_pills" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_ai_engineering_paragraphs_order_idx" ON "_pages_v_blocks_ai_engineering_paragraphs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_ai_engineering_paragraphs_parent_id_idx" ON "_pages_v_blocks_ai_engineering_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_ai_engineering_order_idx" ON "_pages_v_blocks_ai_engineering" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_ai_engineering_parent_id_idx" ON "_pages_v_blocks_ai_engineering" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_ai_engineering_path_idx" ON "_pages_v_blocks_ai_engineering" USING btree ("_path");
  ALTER TABLE "pages_blocks_capability_detail_items" ADD CONSTRAINT "pages_blocks_capability_detail_items_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capability_detail_items" ADD CONSTRAINT "_pages_v_blocks_capability_detail_items_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_capability_detail_items_link_link_page_idx" ON "pages_blocks_capability_detail_items" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_capability_detail_items_link_link_page_idx" ON "_pages_v_blocks_capability_detail_items" USING btree ("link_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_narrative_pills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_ai_engineering_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_ai_engineering" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_narrative_pills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_ai_engineering_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_ai_engineering" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_narrative_pills" CASCADE;
  DROP TABLE "pages_blocks_ai_engineering_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_ai_engineering" CASCADE;
  DROP TABLE "_pages_v_blocks_narrative_pills" CASCADE;
  DROP TABLE "_pages_v_blocks_ai_engineering_paragraphs" CASCADE;
  DROP TABLE "_pages_v_blocks_ai_engineering" CASCADE;
  ALTER TABLE "pages_blocks_capability_detail_items" DROP CONSTRAINT "pages_blocks_capability_detail_items_link_page_id_pages_id_fk";
  
  ALTER TABLE "_pages_v_blocks_capability_detail_items" DROP CONSTRAINT "_pages_v_blocks_capability_detail_items_link_page_id_pages_id_fk";
  
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "visual_key" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "visual_key" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_hero_visual_key";
  CREATE TYPE "public"."enum_pages_blocks_hero_visual_key" AS ENUM('home-canvas', 'services-dna', 'ai-orb', 'bt-arc', 'de-hex', 'dx-cursor', 'gt-chart', 'wae-windows', 'evoq-suite', 'none');
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "visual_key" SET DEFAULT 'none'::"public"."enum_pages_blocks_hero_visual_key";
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "visual_key" SET DATA TYPE "public"."enum_pages_blocks_hero_visual_key" USING "visual_key"::"public"."enum_pages_blocks_hero_visual_key";
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "visual_key" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "visual_key" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_hero_visual_key";
  CREATE TYPE "public"."enum__pages_v_blocks_hero_visual_key" AS ENUM('home-canvas', 'services-dna', 'ai-orb', 'bt-arc', 'de-hex', 'dx-cursor', 'gt-chart', 'wae-windows', 'evoq-suite', 'none');
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "visual_key" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_hero_visual_key";
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "visual_key" SET DATA TYPE "public"."enum__pages_v_blocks_hero_visual_key" USING "visual_key"::"public"."enum__pages_v_blocks_hero_visual_key";
  DROP INDEX "pages_blocks_capability_detail_items_link_link_page_idx";
  DROP INDEX "_pages_v_blocks_capability_detail_items_link_link_page_idx";
  ALTER TABLE "pages_blocks_narrative" DROP COLUMN "quote";
  ALTER TABLE "pages_blocks_capability_detail_items" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_capability_detail_items" DROP COLUMN "link_page_id";
  ALTER TABLE "pages_blocks_capability_detail_items" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_capability_detail_items" DROP COLUMN "link_anchor";
  ALTER TABLE "pages_blocks_capability_detail_items" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_capability_detail" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_capability_detail" DROP COLUMN "cross_cutting_label";
  ALTER TABLE "_pages_v_blocks_narrative" DROP COLUMN "quote";
  ALTER TABLE "_pages_v_blocks_capability_detail_items" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_capability_detail_items" DROP COLUMN "link_page_id";
  ALTER TABLE "_pages_v_blocks_capability_detail_items" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_capability_detail_items" DROP COLUMN "link_anchor";
  ALTER TABLE "_pages_v_blocks_capability_detail_items" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_capability_detail" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_capability_detail" DROP COLUMN "cross_cutting_label";
  DROP TYPE "public"."enum_pages_blocks_narrative_pills_icon_key";
  DROP TYPE "public"."enum_pages_blocks_capability_detail_items_link_type";
  DROP TYPE "public"."enum_pages_blocks_capability_detail_variant";
  DROP TYPE "public"."enum_pages_blocks_ai_engineering_mock_key";
  DROP TYPE "public"."enum_pages_blocks_ai_engineering_settings_background";
  DROP TYPE "public"."enum_pages_blocks_ai_engineering_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_narrative_pills_icon_key";
  DROP TYPE "public"."enum__pages_v_blocks_capability_detail_items_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_capability_detail_variant";
  DROP TYPE "public"."enum__pages_v_blocks_ai_engineering_mock_key";
  DROP TYPE "public"."enum__pages_v_blocks_ai_engineering_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_ai_engineering_settings_spacing";`)
}
