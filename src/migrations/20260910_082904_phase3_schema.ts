import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_primary_c_t_a_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_hero_visual_key" AS ENUM('home-canvas', 'services-dna', 'ai-orb', 'bt-arc', 'de-hex', 'dx-cursor', 'gt-chart', 'wae-windows', 'evoq-suite', 'none');
  CREATE TYPE "public"."enum_pages_blocks_hero_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_hero_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_approach_steps_steps_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_pages_blocks_approach_steps_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_approach_steps_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_capability_cards_variant" AS ENUM('grid-motif', 'list-detailed');
  CREATE TYPE "public"."enum_pages_blocks_capability_cards_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_capability_cards_footer_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_capability_cards_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_capability_cards_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_investment_ladder_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_investment_ladder_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_left_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_split_feature_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_process_timeline_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_process_timeline_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_proof_clients_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_proof_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_proof_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_proof_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_insights_carousel_source" AS ENUM('latest', 'category', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_insights_carousel_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_insights_carousel_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_insights_carousel_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_contact_form_variant" AS ENUM('pill', 'callout');
  CREATE TYPE "public"."enum_pages_blocks_contact_form_callout_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_contact_form_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_contact_form_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_narrative_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_narrative_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_capability_detail_items_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_pages_blocks_capability_detail_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_capability_detail_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_value_grid_items_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_pages_blocks_value_grid_variant" AS ENUM('dark', 'light', 'bento');
  CREATE TYPE "public"."enum_pages_blocks_value_grid_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_value_grid_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_case_study_source" AS ENUM('reference', 'inline');
  CREATE TYPE "public"."enum_pages_blocks_case_study_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_case_study_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_case_study_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_tech_groups_groups_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_pages_blocks_tech_groups_groups_mock_type" AS ENUM('ui', 'server', 'code');
  CREATE TYPE "public"."enum_pages_blocks_tech_groups_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_tech_groups_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_variant" AS ENUM('card', 'full');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_cta_banner_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_evoq_architecture_cards_items_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_pages_blocks_evoq_architecture_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_evoq_architecture_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_product_grid_products_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_pages_blocks_product_grid_products_mock_key" AS ENUM('crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_pages_blocks_product_grid_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_product_grid_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_industries_grid_items_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_pages_blocks_industries_grid_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_industries_grid_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_width" AS ENUM('narrow', 'full');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum_pages_template" AS ENUM('service', 'home', 'services', 'sub-service');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_primary_c_t_a_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_visual_key" AS ENUM('home-canvas', 'services-dna', 'ai-orb', 'bt-arc', 'de-hex', 'dx-cursor', 'gt-chart', 'wae-windows', 'evoq-suite', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_approach_steps_steps_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum__pages_v_blocks_approach_steps_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_approach_steps_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_capability_cards_variant" AS ENUM('grid-motif', 'list-detailed');
  CREATE TYPE "public"."enum__pages_v_blocks_capability_cards_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_capability_cards_footer_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_capability_cards_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_capability_cards_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_investment_ladder_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_investment_ladder_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_left_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_split_feature_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_process_timeline_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_process_timeline_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_proof_clients_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_proof_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_proof_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_proof_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_source" AS ENUM('auto', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_insights_carousel_source" AS ENUM('latest', 'category', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_insights_carousel_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_insights_carousel_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_insights_carousel_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_form_variant" AS ENUM('pill', 'callout');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_form_callout_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_form_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_form_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_narrative_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_narrative_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_capability_detail_items_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum__pages_v_blocks_capability_detail_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_capability_detail_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_value_grid_items_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum__pages_v_blocks_value_grid_variant" AS ENUM('dark', 'light', 'bento');
  CREATE TYPE "public"."enum__pages_v_blocks_value_grid_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_value_grid_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_source" AS ENUM('reference', 'inline');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_tech_groups_groups_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum__pages_v_blocks_tech_groups_groups_mock_type" AS ENUM('ui', 'server', 'code');
  CREATE TYPE "public"."enum__pages_v_blocks_tech_groups_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_tech_groups_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_variant" AS ENUM('card', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_banner_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_evoq_architecture_cards_items_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum__pages_v_blocks_evoq_architecture_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_evoq_architecture_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_product_grid_products_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum__pages_v_blocks_product_grid_products_mock_key" AS ENUM('crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum__pages_v_blocks_product_grid_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_product_grid_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_industries_grid_items_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum__pages_v_blocks_industries_grid_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_industries_grid_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_width" AS ENUM('narrow', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_settings_background" AS ENUM('default', 'white', 'alt', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_settings_spacing" AS ENUM('default', 'tight', 'flush');
  CREATE TYPE "public"."enum__pages_v_version_template" AS ENUM('service', 'home', 'services', 'sub-service');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_insights_kind" AS ENUM('blog', 'case-study', 'whitepaper', 'featured-project');
  CREATE TYPE "public"."enum_insights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__insights_v_version_kind" AS ENUM('blog', 'case-study', 'whitepaper', 'featured-project');
  CREATE TYPE "public"."enum__insights_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_services_motif_key" AS ENUM('ai-transformation', 'Digital engineering', 'Business transformation', 'Digital experience', 'Growth transformation', 'Products & platforms');
  CREATE TYPE "public"."enum_services_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum__services_v_version_motif_key" AS ENUM('ai-transformation', 'Digital engineering', 'Business transformation', 'Digital experience', 'Growth transformation', 'Products & platforms');
  CREATE TYPE "public"."enum__services_v_version_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_case_studies_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_version_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_forms_fields_type" AS ENUM('text', 'email', 'tel', 'textarea', 'select');
  CREATE TYPE "public"."enum_forms_fields_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'archived');
  CREATE TYPE "public"."enum_email_accounts_provider" AS ENUM('resend', 'sendgrid', 'postmark', 'sparkpost', 'gmail', 'outlook', 'nodemailer');
  CREATE TYPE "public"."enum_email_accounts_auth_mode" AS ENUM('api-key', 'smtp');
  CREATE TYPE "public"."enum_email_templates_template_type" AS ENUM('notification', 'confirmation', 'operational');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_header_menu_items_sub_items_icon_key" AS ENUM('ai-transformation', 'digital-engineering', 'business-transformation', 'digital-experience', 'growth-transformation', 'products-and-platforms', 'evoq', 'blogs', 'case-studies', 'whitepapers', 'featured-projects', 'about', 'our-approach', 'clients', 'careers', 'customer-experience', 'employee-productivity', 'business-operations', 'decision-making', 'digital-products', 'software-engineering', 'simpler-operations', 'better-customer-relationships', 'faster-execution', 'connected-business-capabilities', 'scalable-operations', 'new-business-capabilities', 'launch-faster', 'modernize-with-confidence', 'scale-as-demand-grows', 'connect-what-already-exists', 'improve-reliability', 'prepare-for-what-s-next', 'frontend', 'backend', 'frameworks', 'full-stack', 'content-platforms', 'architecture-and-engineering', 'increase-qualified-demand', 'improve-visibility', 'turn-interest-into-action', 'improve-marketing-efficiency', 'build-lasting-visibility', 'measure-what-matters', 'web-application-engineering', 'frontend-engineering', 'backend-engineering', 'cms-and-content-platforms', 'application-modernization', 'integration-and-apis', 'full-stack-engineering', 'performance-that-scales', 'modernization-without-unnecessary-disruption', 'experiences-people-can-use', 'technology-that-works-together', 'faster-evolution', 'engineering-quality-from-the-start', 'crm', 'campaigns', 'serviceops', 'desk', 'projects', 'sync', 'inventory', 'billing', 'hrms', 'skillberry', 'booking', 'loyalty', 'surveys');
  CREATE TYPE "public"."enum_header_menu_items_sub_items_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_header_menu_items_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_header_menu_items_submenu_c_t_a_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_header_cta_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_footer_columns_links_link_type" AS ENUM('internal', 'external', 'anchor');
  CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('linkedin', 'twitter', 'youtube', 'instagram', 'facebook');
  CREATE TABLE "pages_blocks_hero_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"before" varchar,
  	"accent" varchar,
  	"after" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"sub" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_type" "enum_pages_blocks_hero_primary_c_t_a_type" DEFAULT 'internal',
  	"primary_c_t_a_page_id" integer,
  	"primary_c_t_a_url" varchar,
  	"primary_c_t_a_anchor" varchar,
  	"primary_c_t_a_new_tab" boolean DEFAULT false,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_type" "enum_pages_blocks_hero_secondary_c_t_a_type" DEFAULT 'internal',
  	"secondary_c_t_a_page_id" integer,
  	"secondary_c_t_a_url" varchar,
  	"secondary_c_t_a_anchor" varchar,
  	"secondary_c_t_a_new_tab" boolean DEFAULT false,
  	"trust_strip_strong" varchar,
  	"trust_strip_rest" varchar,
  	"trust_strip_second" varchar,
  	"visual_key" "enum_pages_blocks_hero_visual_key" DEFAULT 'none',
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_hero_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_hero_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_approach_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"icon_key" "enum_pages_blocks_approach_steps_steps_icon_key"
  );
  
  CREATE TABLE "pages_blocks_approach_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"note_strong" varchar,
  	"note_accent" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_approach_steps_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_approach_steps_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_capability_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_capability_cards_variant" DEFAULT 'grid-motif',
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"source" "enum_pages_blocks_capability_cards_source" DEFAULT 'auto',
  	"limit" numeric DEFAULT 6,
  	"footer_link_label" varchar,
  	"footer_link_type" "enum_pages_blocks_capability_cards_footer_link_type" DEFAULT 'internal',
  	"footer_link_page_id" integer,
  	"footer_link_url" varchar,
  	"footer_link_anchor" varchar,
  	"footer_link_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_capability_cards_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_capability_cards_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_investment_ladder_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_investment_ladder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"closing_line1" varchar,
  	"closing_line2" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_investment_ladder_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_investment_ladder_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_split_feature_right_process_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar
  );
  
  CREATE TABLE "pages_blocks_split_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"left_kicker" varchar,
  	"left_body" varchar,
  	"left_cta_label" varchar,
  	"left_cta_type" "enum_pages_blocks_split_feature_left_cta_type" DEFAULT 'internal',
  	"left_cta_page_id" integer,
  	"left_cta_url" varchar,
  	"left_cta_anchor" varchar,
  	"left_cta_new_tab" boolean DEFAULT false,
  	"right_title" varchar,
  	"right_body" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_split_feature_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_split_feature_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar
  );
  
  CREATE TABLE "pages_blocks_process_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_process_timeline_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_process_timeline_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"text" varchar,
  	"callout" varchar,
  	"clients_link_label" varchar,
  	"clients_link_type" "enum_pages_blocks_proof_clients_link_type" DEFAULT 'internal',
  	"clients_link_page_id" integer,
  	"clients_link_url" varchar,
  	"clients_link_anchor" varchar,
  	"clients_link_new_tab" boolean DEFAULT false,
  	"block_title" varchar,
  	"source" "enum_pages_blocks_proof_source" DEFAULT 'auto',
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_proof_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_proof_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"source" "enum_pages_blocks_testimonials_source" DEFAULT 'auto',
  	"limit" numeric DEFAULT 2,
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_testimonials_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_testimonials_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_testimonials_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_insights_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"source" "enum_pages_blocks_insights_carousel_source" DEFAULT 'latest',
  	"category_id" integer,
  	"limit" numeric DEFAULT 6,
  	"footer_text" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_insights_carousel_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_insights_carousel_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_insights_carousel_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"before" varchar,
  	"accent" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_contact_form_variant" DEFAULT 'pill',
  	"kicker" varchar,
  	"sub" varchar,
  	"pill_text" varchar,
  	"callout_title" varchar,
  	"callout_desc" varchar,
  	"callout_cta_label" varchar,
  	"callout_cta_type" "enum_pages_blocks_contact_form_callout_cta_type" DEFAULT 'internal',
  	"callout_cta_page_id" integer,
  	"callout_cta_url" varchar,
  	"callout_cta_anchor" varchar,
  	"callout_cta_new_tab" boolean DEFAULT false,
  	"form_id" integer,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_contact_form_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_contact_form_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_narrative_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_narrative" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"lead" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_narrative_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_narrative_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_capability_detail_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_capability_detail_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar,
  	"desc" varchar,
  	"icon_key" "enum_pages_blocks_capability_detail_items_icon_key"
  );
  
  CREATE TABLE "pages_blocks_capability_detail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_capability_detail_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_capability_detail_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_value_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"icon_key" "enum_pages_blocks_value_grid_items_icon_key"
  );
  
  CREATE TABLE "pages_blocks_value_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_value_grid_variant" DEFAULT 'dark',
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_value_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_value_grid_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_case_study_inline_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_case_study" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"source" "enum_pages_blocks_case_study_source" DEFAULT 'reference',
  	"study_id" integer,
  	"inline_case_title" varchar,
  	"inline_tag" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_case_study_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_case_study_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_case_study_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tech_groups_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"desc" varchar,
  	"icon_key" "enum_pages_blocks_tech_groups_groups_icon_key",
  	"mock_type" "enum_pages_blocks_tech_groups_groups_mock_type" DEFAULT 'ui',
  	"metric_value" varchar,
  	"metric_label" varchar
  );
  
  CREATE TABLE "pages_blocks_tech_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_tech_groups_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_tech_groups_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_cta_banner_variant" DEFAULT 'card',
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum_pages_blocks_cta_banner_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_cta_banner_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_cta_banner_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_evoq_architecture_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"icon_key" "enum_pages_blocks_evoq_architecture_cards_items_icon_key"
  );
  
  CREATE TABLE "pages_blocks_evoq_architecture_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_evoq_architecture_integration_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"icon_url" varchar
  );
  
  CREATE TABLE "pages_blocks_evoq_architecture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"hub_title" varchar,
  	"hub_desc" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_evoq_architecture_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_evoq_architecture_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_grid_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"category" varchar,
  	"desc" varchar,
  	"icon_key" "enum_pages_blocks_product_grid_products_icon_key",
  	"mock_key" "enum_pages_blocks_product_grid_products_mock_key"
  );
  
  CREATE TABLE "pages_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_product_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_product_grid_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_industries_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"image_id" integer,
  	"icon_key" "enum_pages_blocks_industries_grid_items_icon_key"
  );
  
  CREATE TABLE "pages_blocks_industries_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_industries_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_industries_grid_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"content" jsonb,
  	"width" "enum_pages_blocks_rich_text_width" DEFAULT 'narrow',
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum_pages_blocks_rich_text_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum_pages_blocks_rich_text_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_canonical_override" varchar,
  	"slug" varchar,
  	"parent_id" integer,
  	"pathname" varchar,
  	"template" "enum_pages_template" DEFAULT 'service',
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"clients_id" integer,
  	"testimonials_id" integer,
  	"insights_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"before" varchar,
  	"accent" varchar,
  	"after" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"sub" varchar,
  	"primary_c_t_a_label" varchar,
  	"primary_c_t_a_type" "enum__pages_v_blocks_hero_primary_c_t_a_type" DEFAULT 'internal',
  	"primary_c_t_a_page_id" integer,
  	"primary_c_t_a_url" varchar,
  	"primary_c_t_a_anchor" varchar,
  	"primary_c_t_a_new_tab" boolean DEFAULT false,
  	"secondary_c_t_a_label" varchar,
  	"secondary_c_t_a_type" "enum__pages_v_blocks_hero_secondary_c_t_a_type" DEFAULT 'internal',
  	"secondary_c_t_a_page_id" integer,
  	"secondary_c_t_a_url" varchar,
  	"secondary_c_t_a_anchor" varchar,
  	"secondary_c_t_a_new_tab" boolean DEFAULT false,
  	"trust_strip_strong" varchar,
  	"trust_strip_rest" varchar,
  	"trust_strip_second" varchar,
  	"visual_key" "enum__pages_v_blocks_hero_visual_key" DEFAULT 'none',
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_hero_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_hero_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_approach_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"icon_key" "enum__pages_v_blocks_approach_steps_steps_icon_key",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_approach_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"note_strong" varchar,
  	"note_accent" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_approach_steps_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_approach_steps_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_capability_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_capability_cards_variant" DEFAULT 'grid-motif',
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"source" "enum__pages_v_blocks_capability_cards_source" DEFAULT 'auto',
  	"limit" numeric DEFAULT 6,
  	"footer_link_label" varchar,
  	"footer_link_type" "enum__pages_v_blocks_capability_cards_footer_link_type" DEFAULT 'internal',
  	"footer_link_page_id" integer,
  	"footer_link_url" varchar,
  	"footer_link_anchor" varchar,
  	"footer_link_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_capability_cards_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_capability_cards_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_investment_ladder_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_investment_ladder" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"closing_line1" varchar,
  	"closing_line2" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_investment_ladder_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_investment_ladder_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_feature_right_process_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"left_kicker" varchar,
  	"left_body" varchar,
  	"left_cta_label" varchar,
  	"left_cta_type" "enum__pages_v_blocks_split_feature_left_cta_type" DEFAULT 'internal',
  	"left_cta_page_id" integer,
  	"left_cta_url" varchar,
  	"left_cta_anchor" varchar,
  	"left_cta_new_tab" boolean DEFAULT false,
  	"right_title" varchar,
  	"right_body" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_split_feature_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_split_feature_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_process_timeline_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_process_timeline_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"text" varchar,
  	"callout" varchar,
  	"clients_link_label" varchar,
  	"clients_link_type" "enum__pages_v_blocks_proof_clients_link_type" DEFAULT 'internal',
  	"clients_link_page_id" integer,
  	"clients_link_url" varchar,
  	"clients_link_anchor" varchar,
  	"clients_link_new_tab" boolean DEFAULT false,
  	"block_title" varchar,
  	"source" "enum__pages_v_blocks_proof_source" DEFAULT 'auto',
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_proof_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_proof_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"source" "enum__pages_v_blocks_testimonials_source" DEFAULT 'auto',
  	"limit" numeric DEFAULT 2,
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_testimonials_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_testimonials_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_testimonials_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_insights_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"source" "enum__pages_v_blocks_insights_carousel_source" DEFAULT 'latest',
  	"category_id" integer,
  	"limit" numeric DEFAULT 6,
  	"footer_text" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_insights_carousel_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_insights_carousel_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_insights_carousel_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form_heading_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"before" varchar,
  	"accent" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_contact_form_variant" DEFAULT 'pill',
  	"kicker" varchar,
  	"sub" varchar,
  	"pill_text" varchar,
  	"callout_title" varchar,
  	"callout_desc" varchar,
  	"callout_cta_label" varchar,
  	"callout_cta_type" "enum__pages_v_blocks_contact_form_callout_cta_type" DEFAULT 'internal',
  	"callout_cta_page_id" integer,
  	"callout_cta_url" varchar,
  	"callout_cta_anchor" varchar,
  	"callout_cta_new_tab" boolean DEFAULT false,
  	"form_id" integer,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_contact_form_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_contact_form_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_narrative_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_narrative" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"lead" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_narrative_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_narrative_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_capability_detail_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_capability_detail_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tagline" varchar,
  	"desc" varchar,
  	"icon_key" "enum__pages_v_blocks_capability_detail_items_icon_key",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_capability_detail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_capability_detail_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_capability_detail_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_value_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"icon_key" "enum__pages_v_blocks_value_grid_items_icon_key",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_value_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_value_grid_variant" DEFAULT 'dark',
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_value_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_value_grid_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_study_inline_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_study" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"source" "enum__pages_v_blocks_case_study_source" DEFAULT 'reference',
  	"study_id" integer,
  	"inline_case_title" varchar,
  	"inline_tag" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_case_study_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_case_study_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_case_study_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tech_groups_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"desc" varchar,
  	"icon_key" "enum__pages_v_blocks_tech_groups_groups_icon_key",
  	"mock_type" "enum__pages_v_blocks_tech_groups_groups_mock_type" DEFAULT 'ui',
  	"metric_value" varchar,
  	"metric_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tech_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_tech_groups_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_tech_groups_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_cta_banner_variant" DEFAULT 'card',
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum__pages_v_blocks_cta_banner_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_cta_banner_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_cta_banner_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_evoq_architecture_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"icon_key" "enum__pages_v_blocks_evoq_architecture_cards_items_icon_key",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_evoq_architecture_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_evoq_architecture_integration_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"icon_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_evoq_architecture" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"hub_title" varchar,
  	"hub_desc" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_evoq_architecture_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_evoq_architecture_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_grid_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"category" varchar,
  	"desc" varchar,
  	"icon_key" "enum__pages_v_blocks_product_grid_products_icon_key",
  	"mock_key" "enum__pages_v_blocks_product_grid_products_mock_key",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_product_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_product_grid_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_industries_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"desc" varchar,
  	"image_id" integer,
  	"icon_key" "enum__pages_v_blocks_industries_grid_items_icon_key",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_industries_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"sub" varchar,
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_industries_grid_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_industries_grid_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kicker" varchar,
  	"title" varchar,
  	"content" jsonb,
  	"width" "enum__pages_v_blocks_rich_text_width" DEFAULT 'narrow',
  	"settings_anchor_id" varchar,
  	"settings_hidden" boolean DEFAULT false,
  	"settings_background" "enum__pages_v_blocks_rich_text_settings_background" DEFAULT 'default',
  	"settings_spacing" "enum__pages_v_blocks_rich_text_settings_spacing" DEFAULT 'default',
  	"settings_reveal" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_canonical_override" varchar,
  	"version_slug" varchar,
  	"version_parent_id" integer,
  	"version_pathname" varchar,
  	"version_template" "enum__pages_v_version_template" DEFAULT 'service',
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"clients_id" integer,
  	"testimonials_id" integer,
  	"insights_id" integer
  );
  
  CREATE TABLE "insights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_canonical_override" varchar,
  	"slug" varchar,
  	"kind" "enum_insights_kind" DEFAULT 'blog',
  	"category_id" integer,
  	"read_time" varchar,
  	"thumbnail_id" integer,
  	"featured" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_insights_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_insights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_canonical_override" varchar,
  	"version_slug" varchar,
  	"version_kind" "enum__insights_v_version_kind" DEFAULT 'blog',
  	"version_category_id" integer,
  	"version_read_time" varchar,
  	"version_thumbnail_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__insights_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"tagline" varchar,
  	"short_desc" varchar,
  	"icon_key" "enum_services_icon_key",
  	"motif_key" "enum_services_motif_key",
  	"order" numeric DEFAULT 100,
  	"page_id" integer,
  	"cta_label" varchar,
  	"cta_type" "enum_services_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_tagline" varchar,
  	"version_short_desc" varchar,
  	"version_icon_key" "enum__services_v_version_icon_key",
  	"version_motif_key" "enum__services_v_version_motif_key",
  	"version_order" numeric DEFAULT 100,
  	"version_page_id" integer,
  	"version_cta_label" varchar,
  	"version_cta_type" "enum__services_v_version_cta_type" DEFAULT 'internal',
  	"version_cta_page_id" integer,
  	"version_cta_url" varchar,
  	"version_cta_anchor" varchar,
  	"version_cta_new_tab" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_services_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "case_studies_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"client" varchar,
  	"tag" varchar,
  	"mock_key" varchar,
  	"cta_label" varchar,
  	"cta_type" "enum_case_studies_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_case_studies_v_version_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_client" varchar,
  	"version_tag" varchar,
  	"version_mock_key" varchar,
  	"version_cta_label" varchar,
  	"version_cta_type" "enum__case_studies_v_version_cta_type" DEFAULT 'internal',
  	"version_cta_page_id" integer,
  	"version_cta_url" varchar,
  	"version_cta_anchor" varchar,
  	"version_cta_new_tab" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "insight_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"url" varchar,
  	"featured" boolean DEFAULT true,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"avatar_id" integer,
  	"quote" varchar NOT NULL,
  	"featured" boolean DEFAULT true,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"type" "enum_redirects_type" DEFAULT '301',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_forms_fields_type" DEFAULT 'text',
  	"required" boolean DEFAULT false,
  	"width" "enum_forms_fields_width" DEFAULT 'full',
  	"placeholder" varchar
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"submit_label" varchar DEFAULT 'Send',
  	"card_title" varchar,
  	"success_title" varchar DEFAULT 'Thanks — message received.',
  	"success_body" varchar,
  	"fineprint" varchar,
  	"notification_template_id" integer,
  	"confirmation_template_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "leads_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" varchar NOT NULL,
  	"author_id" integer
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"submitted_email" varchar,
  	"submission_data" jsonb,
  	"source_pathname" varchar,
  	"source_referrer" varchar,
  	"source_utm_source" varchar,
  	"source_utm_medium" varchar,
  	"source_utm_campaign" varchar,
  	"source_utm_term" varchar,
  	"source_utm_content" varchar,
  	"meta_ip_hash" varchar,
  	"meta_user_agent" varchar,
  	"meta_recaptcha_score" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"provider" "enum_email_accounts_provider" DEFAULT 'resend' NOT NULL,
  	"auth_mode" "enum_email_accounts_auth_mode" DEFAULT 'api-key' NOT NULL,
  	"use_as_default" boolean DEFAULT false,
  	"enabled" boolean DEFAULT true,
  	"from_name" varchar,
  	"from_email" varchar,
  	"env_key_name" varchar,
  	"host" varchar,
  	"port" numeric DEFAULT 587,
  	"secure" boolean DEFAULT false,
  	"username" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"template_type" "enum_email_templates_template_type" DEFAULT 'notification' NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"description" varchar,
  	"available_variables" varchar,
  	"subject" varchar NOT NULL,
  	"html" varchar,
  	"text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_menu_items_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"desc" varchar,
  	"icon_key" "enum_header_menu_items_sub_items_icon_key",
  	"link_type" "enum_header_menu_items_sub_items_link_type" DEFAULT 'internal',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_anchor" varchar,
  	"link_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "header_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"key" varchar NOT NULL,
  	"link_type" "enum_header_menu_items_link_type" DEFAULT 'internal',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_anchor" varchar,
  	"link_new_tab" boolean DEFAULT false,
  	"submenu_c_t_a_label" varchar,
  	"submenu_c_t_a_type" "enum_header_menu_items_submenu_c_t_a_type" DEFAULT 'internal',
  	"submenu_c_t_a_page_id" integer,
  	"submenu_c_t_a_url" varchar,
  	"submenu_c_t_a_anchor" varchar,
  	"submenu_c_t_a_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_alt" varchar DEFAULT 'Social DNA Labs',
  	"cta_label" varchar,
  	"cta_type" "enum_header_cta_type" DEFAULT 'internal',
  	"cta_page_id" integer,
  	"cta_url" varchar,
  	"cta_anchor" varchar,
  	"cta_new_tab" boolean DEFAULT false,
  	"mega_menu_enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar,
  	"link_type" "enum_footer_columns_links_link_type" DEFAULT 'internal',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_anchor" varchar,
  	"link_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "footer_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_alt" varchar DEFAULT 'Social DNA Labs',
  	"tagline" varchar,
  	"copyright_text" varchar DEFAULT '© {year} Social DNA Labs',
  	"bottom_right_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Social DNA Labs',
  	"site_tagline" varchar,
  	"support_email" varchar,
  	"support_phone" varchar,
  	"site_url" varchar,
  	"linkedin_url" varchar,
  	"twitter_url" varchar,
  	"youtube_url" varchar,
  	"instagram_url" varchar,
  	"default_meta_title" varchar,
  	"default_meta_description" varchar,
  	"default_og_image_id" integer,
  	"robots_txt_additions" varchar,
  	"legal_name" varchar,
  	"organisation_logo_id" integer,
  	"google_analytics_id" varchar,
  	"google_tag_manager_id" varchar,
  	"linkedin_partner_id" varchar,
  	"recaptcha_enabled" boolean DEFAULT false,
  	"recaptcha_min_score" numeric DEFAULT 0.5,
  	"maintenance_mode" boolean DEFAULT false,
  	"maintenance_message" varchar DEFAULT 'We are currently performing scheduled maintenance. We will be back shortly.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "email_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"account_id" integer,
  	"from_name" varchar DEFAULT 'Social DNA Labs',
  	"from_email" varchar,
  	"primary_notification_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "insights_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "insight_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "clients_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leads_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "email_accounts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "email_templates_id" integer;
  ALTER TABLE "pages_blocks_hero_heading_lines" ADD CONSTRAINT "pages_blocks_hero_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_primary_c_t_a_page_id_pages_id_fk" FOREIGN KEY ("primary_c_t_a_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_secondary_c_t_a_page_id_pages_id_fk" FOREIGN KEY ("secondary_c_t_a_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_approach_steps_steps" ADD CONSTRAINT "pages_blocks_approach_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_approach_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_approach_steps" ADD CONSTRAINT "pages_blocks_approach_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capability_cards" ADD CONSTRAINT "pages_blocks_capability_cards_footer_link_page_id_pages_id_fk" FOREIGN KEY ("footer_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_capability_cards" ADD CONSTRAINT "pages_blocks_capability_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_investment_ladder_steps" ADD CONSTRAINT "pages_blocks_investment_ladder_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_investment_ladder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_investment_ladder" ADD CONSTRAINT "pages_blocks_investment_ladder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature_right_process_items" ADD CONSTRAINT "pages_blocks_split_feature_right_process_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature" ADD CONSTRAINT "pages_blocks_split_feature_left_cta_page_id_pages_id_fk" FOREIGN KEY ("left_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_feature" ADD CONSTRAINT "pages_blocks_split_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_timeline_steps" ADD CONSTRAINT "pages_blocks_process_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_timeline" ADD CONSTRAINT "pages_blocks_process_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof" ADD CONSTRAINT "pages_blocks_proof_clients_link_page_id_pages_id_fk" FOREIGN KEY ("clients_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof" ADD CONSTRAINT "pages_blocks_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_carousel" ADD CONSTRAINT "pages_blocks_insights_carousel_category_id_insight_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."insight_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_carousel" ADD CONSTRAINT "pages_blocks_insights_carousel_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_insights_carousel" ADD CONSTRAINT "pages_blocks_insights_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form_heading_lines" ADD CONSTRAINT "pages_blocks_contact_form_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_callout_cta_page_id_pages_id_fk" FOREIGN KEY ("callout_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_narrative_paragraphs" ADD CONSTRAINT "pages_blocks_narrative_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_narrative"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_narrative" ADD CONSTRAINT "pages_blocks_narrative_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capability_detail_intro" ADD CONSTRAINT "pages_blocks_capability_detail_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capability_detail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capability_detail_items" ADD CONSTRAINT "pages_blocks_capability_detail_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_capability_detail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_capability_detail" ADD CONSTRAINT "pages_blocks_capability_detail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_grid_items" ADD CONSTRAINT "pages_blocks_value_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_value_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_value_grid" ADD CONSTRAINT "pages_blocks_value_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study_inline_blocks" ADD CONSTRAINT "pages_blocks_case_study_inline_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study" ADD CONSTRAINT "pages_blocks_case_study_study_id_case_studies_id_fk" FOREIGN KEY ("study_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study" ADD CONSTRAINT "pages_blocks_case_study_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study" ADD CONSTRAINT "pages_blocks_case_study_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tech_groups_groups" ADD CONSTRAINT "pages_blocks_tech_groups_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tech_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tech_groups" ADD CONSTRAINT "pages_blocks_tech_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_banner" ADD CONSTRAINT "pages_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_evoq_architecture_cards_items" ADD CONSTRAINT "pages_blocks_evoq_architecture_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_evoq_architecture_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_evoq_architecture_cards" ADD CONSTRAINT "pages_blocks_evoq_architecture_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_evoq_architecture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_evoq_architecture_integration_badges" ADD CONSTRAINT "pages_blocks_evoq_architecture_integration_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_evoq_architecture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_evoq_architecture" ADD CONSTRAINT "pages_blocks_evoq_architecture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid_products" ADD CONSTRAINT "pages_blocks_product_grid_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_industries_grid_items" ADD CONSTRAINT "pages_blocks_industries_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_industries_grid_items" ADD CONSTRAINT "pages_blocks_industries_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_industries_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_industries_grid" ADD CONSTRAINT "pages_blocks_industries_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_heading_lines" ADD CONSTRAINT "_pages_v_blocks_hero_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_primary_c_t_a_page_id_pages_id_fk" FOREIGN KEY ("primary_c_t_a_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_secondary_c_t_a_page_id_pages_id_fk" FOREIGN KEY ("secondary_c_t_a_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_approach_steps_steps" ADD CONSTRAINT "_pages_v_blocks_approach_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_approach_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_approach_steps" ADD CONSTRAINT "_pages_v_blocks_approach_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capability_cards" ADD CONSTRAINT "_pages_v_blocks_capability_cards_footer_link_page_id_pages_id_fk" FOREIGN KEY ("footer_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capability_cards" ADD CONSTRAINT "_pages_v_blocks_capability_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_investment_ladder_steps" ADD CONSTRAINT "_pages_v_blocks_investment_ladder_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_investment_ladder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_investment_ladder" ADD CONSTRAINT "_pages_v_blocks_investment_ladder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature_right_process_items" ADD CONSTRAINT "_pages_v_blocks_split_feature_right_process_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD CONSTRAINT "_pages_v_blocks_split_feature_left_cta_page_id_pages_id_fk" FOREIGN KEY ("left_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_feature" ADD CONSTRAINT "_pages_v_blocks_split_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_timeline_steps" ADD CONSTRAINT "_pages_v_blocks_process_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_timeline" ADD CONSTRAINT "_pages_v_blocks_process_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof" ADD CONSTRAINT "_pages_v_blocks_proof_clients_link_page_id_pages_id_fk" FOREIGN KEY ("clients_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof" ADD CONSTRAINT "_pages_v_blocks_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_carousel" ADD CONSTRAINT "_pages_v_blocks_insights_carousel_category_id_insight_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."insight_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_carousel" ADD CONSTRAINT "_pages_v_blocks_insights_carousel_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_insights_carousel" ADD CONSTRAINT "_pages_v_blocks_insights_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form_heading_lines" ADD CONSTRAINT "_pages_v_blocks_contact_form_heading_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_callout_cta_page_id_pages_id_fk" FOREIGN KEY ("callout_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_narrative_paragraphs" ADD CONSTRAINT "_pages_v_blocks_narrative_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_narrative"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_narrative" ADD CONSTRAINT "_pages_v_blocks_narrative_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capability_detail_intro" ADD CONSTRAINT "_pages_v_blocks_capability_detail_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capability_detail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capability_detail_items" ADD CONSTRAINT "_pages_v_blocks_capability_detail_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_capability_detail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_capability_detail" ADD CONSTRAINT "_pages_v_blocks_capability_detail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_grid_items" ADD CONSTRAINT "_pages_v_blocks_value_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_value_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_value_grid" ADD CONSTRAINT "_pages_v_blocks_value_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study_inline_blocks" ADD CONSTRAINT "_pages_v_blocks_case_study_inline_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study" ADD CONSTRAINT "_pages_v_blocks_case_study_study_id_case_studies_id_fk" FOREIGN KEY ("study_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study" ADD CONSTRAINT "_pages_v_blocks_case_study_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study" ADD CONSTRAINT "_pages_v_blocks_case_study_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tech_groups_groups" ADD CONSTRAINT "_pages_v_blocks_tech_groups_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tech_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tech_groups" ADD CONSTRAINT "_pages_v_blocks_tech_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_banner" ADD CONSTRAINT "_pages_v_blocks_cta_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_evoq_architecture_cards_items" ADD CONSTRAINT "_pages_v_blocks_evoq_architecture_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_evoq_architecture_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_evoq_architecture_cards" ADD CONSTRAINT "_pages_v_blocks_evoq_architecture_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_evoq_architecture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_evoq_architecture_integration_badges" ADD CONSTRAINT "_pages_v_blocks_evoq_architecture_integration_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_evoq_architecture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_evoq_architecture" ADD CONSTRAINT "_pages_v_blocks_evoq_architecture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid_products" ADD CONSTRAINT "_pages_v_blocks_product_grid_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_product_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_industries_grid_items" ADD CONSTRAINT "_pages_v_blocks_industries_grid_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_industries_grid_items" ADD CONSTRAINT "_pages_v_blocks_industries_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_industries_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_industries_grid" ADD CONSTRAINT "_pages_v_blocks_industries_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_category_id_insight_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."insight_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_parent_id_insights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_category_id_insight_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."insight_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_texts" ADD CONSTRAINT "services_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_page_id_pages_id_fk" FOREIGN KEY ("version_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_cta_page_id_pages_id_fk" FOREIGN KEY ("version_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_texts" ADD CONSTRAINT "_services_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_blocks" ADD CONSTRAINT "case_studies_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_blocks" ADD CONSTRAINT "_case_studies_v_version_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_cta_page_id_pages_id_fk" FOREIGN KEY ("version_cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clients" ADD CONSTRAINT "clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_fields" ADD CONSTRAINT "forms_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms" ADD CONSTRAINT "forms_notification_template_id_email_templates_id_fk" FOREIGN KEY ("notification_template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms" ADD CONSTRAINT "forms_confirmation_template_id_email_templates_id_fk" FOREIGN KEY ("confirmation_template_id") REFERENCES "public"."email_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_texts" ADD CONSTRAINT "forms_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_notes" ADD CONSTRAINT "leads_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads_notes" ADD CONSTRAINT "leads_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_menu_items_sub_items" ADD CONSTRAINT "header_menu_items_sub_items_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_menu_items_sub_items" ADD CONSTRAINT "header_menu_items_sub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_menu_items" ADD CONSTRAINT "header_menu_items_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_menu_items" ADD CONSTRAINT "header_menu_items_submenu_c_t_a_page_id_pages_id_fk" FOREIGN KEY ("submenu_c_t_a_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_menu_items" ADD CONSTRAINT "header_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_cta_page_id_pages_id_fk" FOREIGN KEY ("cta_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_links" ADD CONSTRAINT "footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_organisation_logo_id_media_id_fk" FOREIGN KEY ("organisation_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_settings" ADD CONSTRAINT "email_settings_account_id_email_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."email_accounts"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_heading_lines_order_idx" ON "pages_blocks_hero_heading_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_heading_lines_parent_id_idx" ON "pages_blocks_hero_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_primary_c_t_a_primary_c_t_a_page_idx" ON "pages_blocks_hero" USING btree ("primary_c_t_a_page_id");
  CREATE INDEX "pages_blocks_hero_secondary_c_t_a_secondary_c_t_a_page_idx" ON "pages_blocks_hero" USING btree ("secondary_c_t_a_page_id");
  CREATE INDEX "pages_blocks_approach_steps_steps_order_idx" ON "pages_blocks_approach_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_approach_steps_steps_parent_id_idx" ON "pages_blocks_approach_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_approach_steps_order_idx" ON "pages_blocks_approach_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_approach_steps_parent_id_idx" ON "pages_blocks_approach_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_approach_steps_path_idx" ON "pages_blocks_approach_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_capability_cards_order_idx" ON "pages_blocks_capability_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_capability_cards_parent_id_idx" ON "pages_blocks_capability_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capability_cards_path_idx" ON "pages_blocks_capability_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_capability_cards_footer_link_footer_link_pa_idx" ON "pages_blocks_capability_cards" USING btree ("footer_link_page_id");
  CREATE INDEX "pages_blocks_investment_ladder_steps_order_idx" ON "pages_blocks_investment_ladder_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_investment_ladder_steps_parent_id_idx" ON "pages_blocks_investment_ladder_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_investment_ladder_order_idx" ON "pages_blocks_investment_ladder" USING btree ("_order");
  CREATE INDEX "pages_blocks_investment_ladder_parent_id_idx" ON "pages_blocks_investment_ladder" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_investment_ladder_path_idx" ON "pages_blocks_investment_ladder" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_feature_right_process_items_order_idx" ON "pages_blocks_split_feature_right_process_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_feature_right_process_items_parent_id_idx" ON "pages_blocks_split_feature_right_process_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_feature_order_idx" ON "pages_blocks_split_feature" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_feature_parent_id_idx" ON "pages_blocks_split_feature" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_feature_path_idx" ON "pages_blocks_split_feature" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_feature_left_cta_left_cta_page_idx" ON "pages_blocks_split_feature" USING btree ("left_cta_page_id");
  CREATE INDEX "pages_blocks_process_timeline_steps_order_idx" ON "pages_blocks_process_timeline_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_timeline_steps_parent_id_idx" ON "pages_blocks_process_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_timeline_order_idx" ON "pages_blocks_process_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_timeline_parent_id_idx" ON "pages_blocks_process_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_timeline_path_idx" ON "pages_blocks_process_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_proof_order_idx" ON "pages_blocks_proof" USING btree ("_order");
  CREATE INDEX "pages_blocks_proof_parent_id_idx" ON "pages_blocks_proof" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_proof_path_idx" ON "pages_blocks_proof" USING btree ("_path");
  CREATE INDEX "pages_blocks_proof_clients_link_clients_link_page_idx" ON "pages_blocks_proof" USING btree ("clients_link_page_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_cta_cta_page_idx" ON "pages_blocks_testimonials" USING btree ("cta_page_id");
  CREATE INDEX "pages_blocks_insights_carousel_order_idx" ON "pages_blocks_insights_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_insights_carousel_parent_id_idx" ON "pages_blocks_insights_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_insights_carousel_path_idx" ON "pages_blocks_insights_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_insights_carousel_category_idx" ON "pages_blocks_insights_carousel" USING btree ("category_id");
  CREATE INDEX "pages_blocks_insights_carousel_cta_cta_page_idx" ON "pages_blocks_insights_carousel" USING btree ("cta_page_id");
  CREATE INDEX "pages_blocks_contact_form_heading_lines_order_idx" ON "pages_blocks_contact_form_heading_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_heading_lines_parent_id_idx" ON "pages_blocks_contact_form_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_callout_cta_callout_cta_page_idx" ON "pages_blocks_contact_form" USING btree ("callout_cta_page_id");
  CREATE INDEX "pages_blocks_contact_form_form_idx" ON "pages_blocks_contact_form" USING btree ("form_id");
  CREATE INDEX "pages_blocks_narrative_paragraphs_order_idx" ON "pages_blocks_narrative_paragraphs" USING btree ("_order");
  CREATE INDEX "pages_blocks_narrative_paragraphs_parent_id_idx" ON "pages_blocks_narrative_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_narrative_order_idx" ON "pages_blocks_narrative" USING btree ("_order");
  CREATE INDEX "pages_blocks_narrative_parent_id_idx" ON "pages_blocks_narrative" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_narrative_path_idx" ON "pages_blocks_narrative" USING btree ("_path");
  CREATE INDEX "pages_blocks_capability_detail_intro_order_idx" ON "pages_blocks_capability_detail_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_capability_detail_intro_parent_id_idx" ON "pages_blocks_capability_detail_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capability_detail_items_order_idx" ON "pages_blocks_capability_detail_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_capability_detail_items_parent_id_idx" ON "pages_blocks_capability_detail_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capability_detail_order_idx" ON "pages_blocks_capability_detail" USING btree ("_order");
  CREATE INDEX "pages_blocks_capability_detail_parent_id_idx" ON "pages_blocks_capability_detail" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_capability_detail_path_idx" ON "pages_blocks_capability_detail" USING btree ("_path");
  CREATE INDEX "pages_blocks_value_grid_items_order_idx" ON "pages_blocks_value_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_value_grid_items_parent_id_idx" ON "pages_blocks_value_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_value_grid_order_idx" ON "pages_blocks_value_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_value_grid_parent_id_idx" ON "pages_blocks_value_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_value_grid_path_idx" ON "pages_blocks_value_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_case_study_inline_blocks_order_idx" ON "pages_blocks_case_study_inline_blocks" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_inline_blocks_parent_id_idx" ON "pages_blocks_case_study_inline_blocks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_order_idx" ON "pages_blocks_case_study" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_parent_id_idx" ON "pages_blocks_case_study" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_path_idx" ON "pages_blocks_case_study" USING btree ("_path");
  CREATE INDEX "pages_blocks_case_study_study_idx" ON "pages_blocks_case_study" USING btree ("study_id");
  CREATE INDEX "pages_blocks_case_study_cta_cta_page_idx" ON "pages_blocks_case_study" USING btree ("cta_page_id");
  CREATE INDEX "pages_blocks_tech_groups_groups_order_idx" ON "pages_blocks_tech_groups_groups" USING btree ("_order");
  CREATE INDEX "pages_blocks_tech_groups_groups_parent_id_idx" ON "pages_blocks_tech_groups_groups" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tech_groups_order_idx" ON "pages_blocks_tech_groups" USING btree ("_order");
  CREATE INDEX "pages_blocks_tech_groups_parent_id_idx" ON "pages_blocks_tech_groups" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tech_groups_path_idx" ON "pages_blocks_tech_groups" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_banner_order_idx" ON "pages_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_banner_parent_id_idx" ON "pages_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_banner_path_idx" ON "pages_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_banner_cta_cta_page_idx" ON "pages_blocks_cta_banner" USING btree ("cta_page_id");
  CREATE INDEX "pages_blocks_evoq_architecture_cards_items_order_idx" ON "pages_blocks_evoq_architecture_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_evoq_architecture_cards_items_parent_id_idx" ON "pages_blocks_evoq_architecture_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_evoq_architecture_cards_order_idx" ON "pages_blocks_evoq_architecture_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_evoq_architecture_cards_parent_id_idx" ON "pages_blocks_evoq_architecture_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_evoq_architecture_integration_badges_order_idx" ON "pages_blocks_evoq_architecture_integration_badges" USING btree ("_order");
  CREATE INDEX "pages_blocks_evoq_architecture_integration_badges_parent_id_idx" ON "pages_blocks_evoq_architecture_integration_badges" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_evoq_architecture_order_idx" ON "pages_blocks_evoq_architecture" USING btree ("_order");
  CREATE INDEX "pages_blocks_evoq_architecture_parent_id_idx" ON "pages_blocks_evoq_architecture" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_evoq_architecture_path_idx" ON "pages_blocks_evoq_architecture" USING btree ("_path");
  CREATE INDEX "pages_blocks_product_grid_products_order_idx" ON "pages_blocks_product_grid_products" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_grid_products_parent_id_idx" ON "pages_blocks_product_grid_products" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_grid_order_idx" ON "pages_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_grid_parent_id_idx" ON "pages_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_grid_path_idx" ON "pages_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_industries_grid_items_order_idx" ON "pages_blocks_industries_grid_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_industries_grid_items_parent_id_idx" ON "pages_blocks_industries_grid_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_industries_grid_items_image_idx" ON "pages_blocks_industries_grid_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_industries_grid_order_idx" ON "pages_blocks_industries_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_industries_grid_parent_id_idx" ON "pages_blocks_industries_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_industries_grid_path_idx" ON "pages_blocks_industries_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE UNIQUE INDEX "pages_pathname_idx" ON "pages" USING btree ("pathname");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id");
  CREATE INDEX "pages_rels_clients_id_idx" ON "pages_rels" USING btree ("clients_id");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "pages_rels_insights_id_idx" ON "pages_rels" USING btree ("insights_id");
  CREATE INDEX "_pages_v_blocks_hero_heading_lines_order_idx" ON "_pages_v_blocks_hero_heading_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_heading_lines_parent_id_idx" ON "_pages_v_blocks_hero_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_primary_c_t_a_primary_c_t_a_page_idx" ON "_pages_v_blocks_hero" USING btree ("primary_c_t_a_page_id");
  CREATE INDEX "_pages_v_blocks_hero_secondary_c_t_a_secondary_c_t_a_pag_idx" ON "_pages_v_blocks_hero" USING btree ("secondary_c_t_a_page_id");
  CREATE INDEX "_pages_v_blocks_approach_steps_steps_order_idx" ON "_pages_v_blocks_approach_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_approach_steps_steps_parent_id_idx" ON "_pages_v_blocks_approach_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_approach_steps_order_idx" ON "_pages_v_blocks_approach_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_approach_steps_parent_id_idx" ON "_pages_v_blocks_approach_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_approach_steps_path_idx" ON "_pages_v_blocks_approach_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_capability_cards_order_idx" ON "_pages_v_blocks_capability_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capability_cards_parent_id_idx" ON "_pages_v_blocks_capability_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_capability_cards_path_idx" ON "_pages_v_blocks_capability_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_capability_cards_footer_link_footer_link_idx" ON "_pages_v_blocks_capability_cards" USING btree ("footer_link_page_id");
  CREATE INDEX "_pages_v_blocks_investment_ladder_steps_order_idx" ON "_pages_v_blocks_investment_ladder_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_investment_ladder_steps_parent_id_idx" ON "_pages_v_blocks_investment_ladder_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_investment_ladder_order_idx" ON "_pages_v_blocks_investment_ladder" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_investment_ladder_parent_id_idx" ON "_pages_v_blocks_investment_ladder" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_investment_ladder_path_idx" ON "_pages_v_blocks_investment_ladder" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_feature_right_process_items_order_idx" ON "_pages_v_blocks_split_feature_right_process_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_feature_right_process_items_parent_id_idx" ON "_pages_v_blocks_split_feature_right_process_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_feature_order_idx" ON "_pages_v_blocks_split_feature" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_feature_parent_id_idx" ON "_pages_v_blocks_split_feature" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_feature_path_idx" ON "_pages_v_blocks_split_feature" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_feature_left_cta_left_cta_page_idx" ON "_pages_v_blocks_split_feature" USING btree ("left_cta_page_id");
  CREATE INDEX "_pages_v_blocks_process_timeline_steps_order_idx" ON "_pages_v_blocks_process_timeline_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_timeline_steps_parent_id_idx" ON "_pages_v_blocks_process_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_timeline_order_idx" ON "_pages_v_blocks_process_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_timeline_parent_id_idx" ON "_pages_v_blocks_process_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_timeline_path_idx" ON "_pages_v_blocks_process_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_proof_order_idx" ON "_pages_v_blocks_proof" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_proof_parent_id_idx" ON "_pages_v_blocks_proof" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_proof_path_idx" ON "_pages_v_blocks_proof" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_proof_clients_link_clients_link_page_idx" ON "_pages_v_blocks_proof" USING btree ("clients_link_page_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_cta_cta_page_idx" ON "_pages_v_blocks_testimonials" USING btree ("cta_page_id");
  CREATE INDEX "_pages_v_blocks_insights_carousel_order_idx" ON "_pages_v_blocks_insights_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_insights_carousel_parent_id_idx" ON "_pages_v_blocks_insights_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_insights_carousel_path_idx" ON "_pages_v_blocks_insights_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_insights_carousel_category_idx" ON "_pages_v_blocks_insights_carousel" USING btree ("category_id");
  CREATE INDEX "_pages_v_blocks_insights_carousel_cta_cta_page_idx" ON "_pages_v_blocks_insights_carousel" USING btree ("cta_page_id");
  CREATE INDEX "_pages_v_blocks_contact_form_heading_lines_order_idx" ON "_pages_v_blocks_contact_form_heading_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_heading_lines_parent_id_idx" ON "_pages_v_blocks_contact_form_heading_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_callout_cta_callout_cta_pag_idx" ON "_pages_v_blocks_contact_form" USING btree ("callout_cta_page_id");
  CREATE INDEX "_pages_v_blocks_contact_form_form_idx" ON "_pages_v_blocks_contact_form" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_narrative_paragraphs_order_idx" ON "_pages_v_blocks_narrative_paragraphs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_narrative_paragraphs_parent_id_idx" ON "_pages_v_blocks_narrative_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_narrative_order_idx" ON "_pages_v_blocks_narrative" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_narrative_parent_id_idx" ON "_pages_v_blocks_narrative" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_narrative_path_idx" ON "_pages_v_blocks_narrative" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_capability_detail_intro_order_idx" ON "_pages_v_blocks_capability_detail_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capability_detail_intro_parent_id_idx" ON "_pages_v_blocks_capability_detail_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_capability_detail_items_order_idx" ON "_pages_v_blocks_capability_detail_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capability_detail_items_parent_id_idx" ON "_pages_v_blocks_capability_detail_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_capability_detail_order_idx" ON "_pages_v_blocks_capability_detail" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_capability_detail_parent_id_idx" ON "_pages_v_blocks_capability_detail" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_capability_detail_path_idx" ON "_pages_v_blocks_capability_detail" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_value_grid_items_order_idx" ON "_pages_v_blocks_value_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_value_grid_items_parent_id_idx" ON "_pages_v_blocks_value_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_value_grid_order_idx" ON "_pages_v_blocks_value_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_value_grid_parent_id_idx" ON "_pages_v_blocks_value_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_value_grid_path_idx" ON "_pages_v_blocks_value_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_case_study_inline_blocks_order_idx" ON "_pages_v_blocks_case_study_inline_blocks" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_study_inline_blocks_parent_id_idx" ON "_pages_v_blocks_case_study_inline_blocks" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_study_order_idx" ON "_pages_v_blocks_case_study" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_study_parent_id_idx" ON "_pages_v_blocks_case_study" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_study_path_idx" ON "_pages_v_blocks_case_study" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_case_study_study_idx" ON "_pages_v_blocks_case_study" USING btree ("study_id");
  CREATE INDEX "_pages_v_blocks_case_study_cta_cta_page_idx" ON "_pages_v_blocks_case_study" USING btree ("cta_page_id");
  CREATE INDEX "_pages_v_blocks_tech_groups_groups_order_idx" ON "_pages_v_blocks_tech_groups_groups" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tech_groups_groups_parent_id_idx" ON "_pages_v_blocks_tech_groups_groups" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tech_groups_order_idx" ON "_pages_v_blocks_tech_groups" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tech_groups_parent_id_idx" ON "_pages_v_blocks_tech_groups" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tech_groups_path_idx" ON "_pages_v_blocks_tech_groups" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_banner_order_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_banner_parent_id_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_banner_path_idx" ON "_pages_v_blocks_cta_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_banner_cta_cta_page_idx" ON "_pages_v_blocks_cta_banner" USING btree ("cta_page_id");
  CREATE INDEX "_pages_v_blocks_evoq_architecture_cards_items_order_idx" ON "_pages_v_blocks_evoq_architecture_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_evoq_architecture_cards_items_parent_id_idx" ON "_pages_v_blocks_evoq_architecture_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_evoq_architecture_cards_order_idx" ON "_pages_v_blocks_evoq_architecture_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_evoq_architecture_cards_parent_id_idx" ON "_pages_v_blocks_evoq_architecture_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_evoq_architecture_integration_badges_order_idx" ON "_pages_v_blocks_evoq_architecture_integration_badges" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_evoq_architecture_integration_badges_parent_id_idx" ON "_pages_v_blocks_evoq_architecture_integration_badges" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_evoq_architecture_order_idx" ON "_pages_v_blocks_evoq_architecture" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_evoq_architecture_parent_id_idx" ON "_pages_v_blocks_evoq_architecture" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_evoq_architecture_path_idx" ON "_pages_v_blocks_evoq_architecture" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_product_grid_products_order_idx" ON "_pages_v_blocks_product_grid_products" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_grid_products_parent_id_idx" ON "_pages_v_blocks_product_grid_products" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_grid_order_idx" ON "_pages_v_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_grid_parent_id_idx" ON "_pages_v_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_grid_path_idx" ON "_pages_v_blocks_product_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_industries_grid_items_order_idx" ON "_pages_v_blocks_industries_grid_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_industries_grid_items_parent_id_idx" ON "_pages_v_blocks_industries_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_industries_grid_items_image_idx" ON "_pages_v_blocks_industries_grid_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_industries_grid_order_idx" ON "_pages_v_blocks_industries_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_industries_grid_parent_id_idx" ON "_pages_v_blocks_industries_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_industries_grid_path_idx" ON "_pages_v_blocks_industries_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_version_pathname_idx" ON "_pages_v" USING btree ("version_pathname");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_rels_clients_id_idx" ON "_pages_v_rels" USING btree ("clients_id");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "_pages_v_rels_insights_id_idx" ON "_pages_v_rels" USING btree ("insights_id");
  CREATE INDEX "insights_seo_seo_image_idx" ON "insights" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "insights_slug_idx" ON "insights" USING btree ("slug");
  CREATE INDEX "insights_category_idx" ON "insights" USING btree ("category_id");
  CREATE INDEX "insights_thumbnail_idx" ON "insights" USING btree ("thumbnail_id");
  CREATE INDEX "insights_updated_at_idx" ON "insights" USING btree ("updated_at");
  CREATE INDEX "insights_created_at_idx" ON "insights" USING btree ("created_at");
  CREATE INDEX "insights__status_idx" ON "insights" USING btree ("_status");
  CREATE INDEX "_insights_v_parent_idx" ON "_insights_v" USING btree ("parent_id");
  CREATE INDEX "_insights_v_version_seo_version_seo_image_idx" ON "_insights_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_insights_v_version_version_slug_idx" ON "_insights_v" USING btree ("version_slug");
  CREATE INDEX "_insights_v_version_version_category_idx" ON "_insights_v" USING btree ("version_category_id");
  CREATE INDEX "_insights_v_version_version_thumbnail_idx" ON "_insights_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_insights_v_version_version_updated_at_idx" ON "_insights_v" USING btree ("version_updated_at");
  CREATE INDEX "_insights_v_version_version_created_at_idx" ON "_insights_v" USING btree ("version_created_at");
  CREATE INDEX "_insights_v_version_version__status_idx" ON "_insights_v" USING btree ("version__status");
  CREATE INDEX "_insights_v_created_at_idx" ON "_insights_v" USING btree ("created_at");
  CREATE INDEX "_insights_v_updated_at_idx" ON "_insights_v" USING btree ("updated_at");
  CREATE INDEX "_insights_v_latest_idx" ON "_insights_v" USING btree ("latest");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_page_idx" ON "services" USING btree ("page_id");
  CREATE INDEX "services_cta_cta_page_idx" ON "services" USING btree ("cta_page_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "services_texts_order_parent" ON "services_texts" USING btree ("order","parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_page_idx" ON "_services_v" USING btree ("version_page_id");
  CREATE INDEX "_services_v_version_cta_version_cta_page_idx" ON "_services_v" USING btree ("version_cta_page_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_texts_order_parent" ON "_services_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "case_studies_blocks_order_idx" ON "case_studies_blocks" USING btree ("_order");
  CREATE INDEX "case_studies_blocks_parent_id_idx" ON "case_studies_blocks" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_cta_cta_page_idx" ON "case_studies" USING btree ("cta_page_id");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE INDEX "_case_studies_v_version_blocks_order_idx" ON "_case_studies_v_version_blocks" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_blocks_parent_id_idx" ON "_case_studies_v_version_blocks" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_cta_version_cta_page_idx" ON "_case_studies_v" USING btree ("version_cta_page_id");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE UNIQUE INDEX "insight_categories_slug_idx" ON "insight_categories" USING btree ("slug");
  CREATE INDEX "insight_categories_updated_at_idx" ON "insight_categories" USING btree ("updated_at");
  CREATE INDEX "insight_categories_created_at_idx" ON "insight_categories" USING btree ("created_at");
  CREATE INDEX "clients_logo_idx" ON "clients" USING btree ("logo_id");
  CREATE INDEX "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX "clients_created_at_idx" ON "clients" USING btree ("created_at");
  CREATE INDEX "testimonials_avatar_idx" ON "testimonials" USING btree ("avatar_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "forms_fields_order_idx" ON "forms_fields" USING btree ("_order");
  CREATE INDEX "forms_fields_parent_id_idx" ON "forms_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_slug_idx" ON "forms" USING btree ("slug");
  CREATE INDEX "forms_notification_template_idx" ON "forms" USING btree ("notification_template_id");
  CREATE INDEX "forms_confirmation_template_idx" ON "forms" USING btree ("confirmation_template_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "forms_texts_order_parent" ON "forms_texts" USING btree ("order","parent_id");
  CREATE INDEX "leads_notes_order_idx" ON "leads_notes" USING btree ("_order");
  CREATE INDEX "leads_notes_parent_id_idx" ON "leads_notes" USING btree ("_parent_id");
  CREATE INDEX "leads_notes_author_idx" ON "leads_notes" USING btree ("author_id");
  CREATE INDEX "leads_form_idx" ON "leads" USING btree ("form_id");
  CREATE INDEX "leads_submitted_email_idx" ON "leads" USING btree ("submitted_email");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "email_accounts_updated_at_idx" ON "email_accounts" USING btree ("updated_at");
  CREATE INDEX "email_accounts_created_at_idx" ON "email_accounts" USING btree ("created_at");
  CREATE UNIQUE INDEX "email_templates_slug_idx" ON "email_templates" USING btree ("slug");
  CREATE INDEX "email_templates_updated_at_idx" ON "email_templates" USING btree ("updated_at");
  CREATE INDEX "email_templates_created_at_idx" ON "email_templates" USING btree ("created_at");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "header_menu_items_sub_items_order_idx" ON "header_menu_items_sub_items" USING btree ("_order");
  CREATE INDEX "header_menu_items_sub_items_parent_id_idx" ON "header_menu_items_sub_items" USING btree ("_parent_id");
  CREATE INDEX "header_menu_items_sub_items_link_link_page_idx" ON "header_menu_items_sub_items" USING btree ("link_page_id");
  CREATE INDEX "header_menu_items_order_idx" ON "header_menu_items" USING btree ("_order");
  CREATE INDEX "header_menu_items_parent_id_idx" ON "header_menu_items" USING btree ("_parent_id");
  CREATE INDEX "header_menu_items_link_link_page_idx" ON "header_menu_items" USING btree ("link_page_id");
  CREATE INDEX "header_menu_items_submenu_c_t_a_submenu_c_t_a_page_idx" ON "header_menu_items" USING btree ("submenu_c_t_a_page_id");
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");
  CREATE INDEX "header_cta_cta_page_idx" ON "header" USING btree ("cta_page_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_links_link_link_page_idx" ON "footer_columns_links" USING btree ("link_page_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_social_links_order_idx" ON "footer_social_links" USING btree ("_order");
  CREATE INDEX "footer_social_links_parent_id_idx" ON "footer_social_links" USING btree ("_parent_id");
  CREATE INDEX "footer_logo_idx" ON "footer" USING btree ("logo_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "site_settings_organisation_logo_idx" ON "site_settings" USING btree ("organisation_logo_id");
  CREATE INDEX "email_settings_account_idx" ON "email_settings" USING btree ("account_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insight_categories_fk" FOREIGN KEY ("insight_categories_id") REFERENCES "public"."insight_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_accounts_fk" FOREIGN KEY ("email_accounts_id") REFERENCES "public"."email_accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_templates_fk" FOREIGN KEY ("email_templates_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_role_idx" ON "users" USING btree ("role");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_insights_id_idx" ON "payload_locked_documents_rels" USING btree ("insights_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  CREATE INDEX "payload_locked_documents_rels_insight_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("insight_categories_id");
  CREATE INDEX "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_email_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("email_accounts_id");
  CREATE INDEX "payload_locked_documents_rels_email_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("email_templates_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_heading_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_approach_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_approach_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_capability_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_investment_ladder_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_investment_ladder" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_split_feature_right_process_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_split_feature" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_process_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_proof" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_insights_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_form_heading_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contact_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_narrative_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_narrative" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_capability_detail_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_capability_detail_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_capability_detail" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_value_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_value_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_case_study_inline_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_case_study" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_tech_groups_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_tech_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_evoq_architecture_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_evoq_architecture_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_evoq_architecture_integration_badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_evoq_architecture" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_product_grid_products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_product_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_industries_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_industries_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_heading_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_approach_steps_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_approach_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_capability_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_investment_ladder_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_investment_ladder" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_split_feature_right_process_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_split_feature" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_process_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_proof" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_insights_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contact_form_heading_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contact_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_narrative_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_narrative" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_capability_detail_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_capability_detail_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_capability_detail" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_value_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_value_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_case_study_inline_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_case_study" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_tech_groups_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_tech_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_cta_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_evoq_architecture_cards_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_evoq_architecture_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_evoq_architecture_integration_badges" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_evoq_architecture" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_product_grid_products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_product_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_industries_grid_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_industries_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "insights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_insights_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "insight_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_accounts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_menu_items_sub_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_menu_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_heading_lines" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_approach_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_approach_steps" CASCADE;
  DROP TABLE "pages_blocks_capability_cards" CASCADE;
  DROP TABLE "pages_blocks_investment_ladder_steps" CASCADE;
  DROP TABLE "pages_blocks_investment_ladder" CASCADE;
  DROP TABLE "pages_blocks_split_feature_right_process_items" CASCADE;
  DROP TABLE "pages_blocks_split_feature" CASCADE;
  DROP TABLE "pages_blocks_process_timeline_steps" CASCADE;
  DROP TABLE "pages_blocks_process_timeline" CASCADE;
  DROP TABLE "pages_blocks_proof" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_insights_carousel" CASCADE;
  DROP TABLE "pages_blocks_contact_form_heading_lines" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_narrative_paragraphs" CASCADE;
  DROP TABLE "pages_blocks_narrative" CASCADE;
  DROP TABLE "pages_blocks_capability_detail_intro" CASCADE;
  DROP TABLE "pages_blocks_capability_detail_items" CASCADE;
  DROP TABLE "pages_blocks_capability_detail" CASCADE;
  DROP TABLE "pages_blocks_value_grid_items" CASCADE;
  DROP TABLE "pages_blocks_value_grid" CASCADE;
  DROP TABLE "pages_blocks_case_study_inline_blocks" CASCADE;
  DROP TABLE "pages_blocks_case_study" CASCADE;
  DROP TABLE "pages_blocks_tech_groups_groups" CASCADE;
  DROP TABLE "pages_blocks_tech_groups" CASCADE;
  DROP TABLE "pages_blocks_cta_banner" CASCADE;
  DROP TABLE "pages_blocks_evoq_architecture_cards_items" CASCADE;
  DROP TABLE "pages_blocks_evoq_architecture_cards" CASCADE;
  DROP TABLE "pages_blocks_evoq_architecture_integration_badges" CASCADE;
  DROP TABLE "pages_blocks_evoq_architecture" CASCADE;
  DROP TABLE "pages_blocks_product_grid_products" CASCADE;
  DROP TABLE "pages_blocks_product_grid" CASCADE;
  DROP TABLE "pages_blocks_industries_grid_items" CASCADE;
  DROP TABLE "pages_blocks_industries_grid" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_heading_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_approach_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_approach_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_capability_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_investment_ladder_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_investment_ladder" CASCADE;
  DROP TABLE "_pages_v_blocks_split_feature_right_process_items" CASCADE;
  DROP TABLE "_pages_v_blocks_split_feature" CASCADE;
  DROP TABLE "_pages_v_blocks_process_timeline_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_proof" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_insights_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form_heading_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_narrative_paragraphs" CASCADE;
  DROP TABLE "_pages_v_blocks_narrative" CASCADE;
  DROP TABLE "_pages_v_blocks_capability_detail_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_capability_detail_items" CASCADE;
  DROP TABLE "_pages_v_blocks_capability_detail" CASCADE;
  DROP TABLE "_pages_v_blocks_value_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_value_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_case_study_inline_blocks" CASCADE;
  DROP TABLE "_pages_v_blocks_case_study" CASCADE;
  DROP TABLE "_pages_v_blocks_tech_groups_groups" CASCADE;
  DROP TABLE "_pages_v_blocks_tech_groups" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_evoq_architecture_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_evoq_architecture_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_evoq_architecture_integration_badges" CASCADE;
  DROP TABLE "_pages_v_blocks_evoq_architecture" CASCADE;
  DROP TABLE "_pages_v_blocks_product_grid_products" CASCADE;
  DROP TABLE "_pages_v_blocks_product_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_industries_grid_items" CASCADE;
  DROP TABLE "_pages_v_blocks_industries_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_texts" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "insights" CASCADE;
  DROP TABLE "_insights_v" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_texts" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_texts" CASCADE;
  DROP TABLE "case_studies_blocks" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "_case_studies_v_version_blocks" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "insight_categories" CASCADE;
  DROP TABLE "clients" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "forms_fields" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_texts" CASCADE;
  DROP TABLE "leads_notes" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "email_accounts" CASCADE;
  DROP TABLE "email_templates" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "header_menu_items_sub_items" CASCADE;
  DROP TABLE "header_menu_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_social_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "email_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_insights_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_case_studies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_insight_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_clients_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_redirects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_forms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leads_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_email_accounts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_email_templates_fk";
  
  DROP INDEX "users_role_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_insights_id_idx";
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_case_studies_id_idx";
  DROP INDEX "payload_locked_documents_rels_insight_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_clients_id_idx";
  DROP INDEX "payload_locked_documents_rels_testimonials_id_idx";
  DROP INDEX "payload_locked_documents_rels_redirects_id_idx";
  DROP INDEX "payload_locked_documents_rels_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_leads_id_idx";
  DROP INDEX "payload_locked_documents_rels_email_accounts_id_idx";
  DROP INDEX "payload_locked_documents_rels_email_templates_id_idx";
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "insights_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "case_studies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "insight_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "clients_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "redirects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leads_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "email_accounts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "email_templates_id";
  DROP TYPE "public"."enum_pages_blocks_hero_primary_c_t_a_type";
  DROP TYPE "public"."enum_pages_blocks_hero_secondary_c_t_a_type";
  DROP TYPE "public"."enum_pages_blocks_hero_visual_key";
  DROP TYPE "public"."enum_pages_blocks_hero_settings_background";
  DROP TYPE "public"."enum_pages_blocks_hero_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_approach_steps_steps_icon_key";
  DROP TYPE "public"."enum_pages_blocks_approach_steps_settings_background";
  DROP TYPE "public"."enum_pages_blocks_approach_steps_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_capability_cards_variant";
  DROP TYPE "public"."enum_pages_blocks_capability_cards_source";
  DROP TYPE "public"."enum_pages_blocks_capability_cards_footer_link_type";
  DROP TYPE "public"."enum_pages_blocks_capability_cards_settings_background";
  DROP TYPE "public"."enum_pages_blocks_capability_cards_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_investment_ladder_settings_background";
  DROP TYPE "public"."enum_pages_blocks_investment_ladder_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_split_feature_left_cta_type";
  DROP TYPE "public"."enum_pages_blocks_split_feature_settings_background";
  DROP TYPE "public"."enum_pages_blocks_split_feature_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_process_timeline_settings_background";
  DROP TYPE "public"."enum_pages_blocks_process_timeline_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_proof_clients_link_type";
  DROP TYPE "public"."enum_pages_blocks_proof_source";
  DROP TYPE "public"."enum_pages_blocks_proof_settings_background";
  DROP TYPE "public"."enum_pages_blocks_proof_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_testimonials_source";
  DROP TYPE "public"."enum_pages_blocks_testimonials_cta_type";
  DROP TYPE "public"."enum_pages_blocks_testimonials_settings_background";
  DROP TYPE "public"."enum_pages_blocks_testimonials_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_insights_carousel_source";
  DROP TYPE "public"."enum_pages_blocks_insights_carousel_cta_type";
  DROP TYPE "public"."enum_pages_blocks_insights_carousel_settings_background";
  DROP TYPE "public"."enum_pages_blocks_insights_carousel_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_contact_form_variant";
  DROP TYPE "public"."enum_pages_blocks_contact_form_callout_cta_type";
  DROP TYPE "public"."enum_pages_blocks_contact_form_settings_background";
  DROP TYPE "public"."enum_pages_blocks_contact_form_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_narrative_settings_background";
  DROP TYPE "public"."enum_pages_blocks_narrative_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_capability_detail_items_icon_key";
  DROP TYPE "public"."enum_pages_blocks_capability_detail_settings_background";
  DROP TYPE "public"."enum_pages_blocks_capability_detail_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_value_grid_items_icon_key";
  DROP TYPE "public"."enum_pages_blocks_value_grid_variant";
  DROP TYPE "public"."enum_pages_blocks_value_grid_settings_background";
  DROP TYPE "public"."enum_pages_blocks_value_grid_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_case_study_source";
  DROP TYPE "public"."enum_pages_blocks_case_study_cta_type";
  DROP TYPE "public"."enum_pages_blocks_case_study_settings_background";
  DROP TYPE "public"."enum_pages_blocks_case_study_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_tech_groups_groups_icon_key";
  DROP TYPE "public"."enum_pages_blocks_tech_groups_groups_mock_type";
  DROP TYPE "public"."enum_pages_blocks_tech_groups_settings_background";
  DROP TYPE "public"."enum_pages_blocks_tech_groups_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_cta_type";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_settings_background";
  DROP TYPE "public"."enum_pages_blocks_cta_banner_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_evoq_architecture_cards_items_icon_key";
  DROP TYPE "public"."enum_pages_blocks_evoq_architecture_settings_background";
  DROP TYPE "public"."enum_pages_blocks_evoq_architecture_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_product_grid_products_icon_key";
  DROP TYPE "public"."enum_pages_blocks_product_grid_products_mock_key";
  DROP TYPE "public"."enum_pages_blocks_product_grid_settings_background";
  DROP TYPE "public"."enum_pages_blocks_product_grid_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_industries_grid_items_icon_key";
  DROP TYPE "public"."enum_pages_blocks_industries_grid_settings_background";
  DROP TYPE "public"."enum_pages_blocks_industries_grid_settings_spacing";
  DROP TYPE "public"."enum_pages_blocks_rich_text_width";
  DROP TYPE "public"."enum_pages_blocks_rich_text_settings_background";
  DROP TYPE "public"."enum_pages_blocks_rich_text_settings_spacing";
  DROP TYPE "public"."enum_pages_template";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_primary_c_t_a_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_secondary_c_t_a_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_visual_key";
  DROP TYPE "public"."enum__pages_v_blocks_hero_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_hero_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_approach_steps_steps_icon_key";
  DROP TYPE "public"."enum__pages_v_blocks_approach_steps_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_approach_steps_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_capability_cards_variant";
  DROP TYPE "public"."enum__pages_v_blocks_capability_cards_source";
  DROP TYPE "public"."enum__pages_v_blocks_capability_cards_footer_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_capability_cards_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_capability_cards_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_investment_ladder_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_investment_ladder_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_left_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_split_feature_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_process_timeline_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_process_timeline_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_proof_clients_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_proof_source";
  DROP TYPE "public"."enum__pages_v_blocks_proof_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_proof_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_source";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_insights_carousel_source";
  DROP TYPE "public"."enum__pages_v_blocks_insights_carousel_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_insights_carousel_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_insights_carousel_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_contact_form_variant";
  DROP TYPE "public"."enum__pages_v_blocks_contact_form_callout_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_contact_form_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_contact_form_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_narrative_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_narrative_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_capability_detail_items_icon_key";
  DROP TYPE "public"."enum__pages_v_blocks_capability_detail_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_capability_detail_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_value_grid_items_icon_key";
  DROP TYPE "public"."enum__pages_v_blocks_value_grid_variant";
  DROP TYPE "public"."enum__pages_v_blocks_value_grid_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_value_grid_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_source";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_tech_groups_groups_icon_key";
  DROP TYPE "public"."enum__pages_v_blocks_tech_groups_groups_mock_type";
  DROP TYPE "public"."enum__pages_v_blocks_tech_groups_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_tech_groups_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_cta_banner_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_evoq_architecture_cards_items_icon_key";
  DROP TYPE "public"."enum__pages_v_blocks_evoq_architecture_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_evoq_architecture_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_product_grid_products_icon_key";
  DROP TYPE "public"."enum__pages_v_blocks_product_grid_products_mock_key";
  DROP TYPE "public"."enum__pages_v_blocks_product_grid_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_product_grid_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_industries_grid_items_icon_key";
  DROP TYPE "public"."enum__pages_v_blocks_industries_grid_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_industries_grid_settings_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_settings_background";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_settings_spacing";
  DROP TYPE "public"."enum__pages_v_version_template";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_insights_kind";
  DROP TYPE "public"."enum_insights_status";
  DROP TYPE "public"."enum__insights_v_version_kind";
  DROP TYPE "public"."enum__insights_v_version_status";
  DROP TYPE "public"."enum_services_icon_key";
  DROP TYPE "public"."enum_services_motif_key";
  DROP TYPE "public"."enum_services_cta_type";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_icon_key";
  DROP TYPE "public"."enum__services_v_version_motif_key";
  DROP TYPE "public"."enum__services_v_version_cta_type";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_case_studies_cta_type";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_version_cta_type";
  DROP TYPE "public"."enum__case_studies_v_version_status";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_forms_fields_type";
  DROP TYPE "public"."enum_forms_fields_width";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_email_accounts_provider";
  DROP TYPE "public"."enum_email_accounts_auth_mode";
  DROP TYPE "public"."enum_email_templates_template_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_header_menu_items_sub_items_icon_key";
  DROP TYPE "public"."enum_header_menu_items_sub_items_link_type";
  DROP TYPE "public"."enum_header_menu_items_link_type";
  DROP TYPE "public"."enum_header_menu_items_submenu_c_t_a_type";
  DROP TYPE "public"."enum_header_cta_type";
  DROP TYPE "public"."enum_footer_columns_links_link_type";
  DROP TYPE "public"."enum_footer_social_links_platform";`)
}
