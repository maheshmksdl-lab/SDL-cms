import * as migration_20260910_075513_initial from './20260910_075513_initial';
import * as migration_20260910_082904_phase3_schema from './20260910_082904_phase3_schema';
import * as migration_20260911_053055_phase7_schema_delta from './20260911_053055_phase7_schema_delta';
import * as migration_20260911_053445_tech_group_mocktypes from './20260911_053445_tech_group_mocktypes';
import * as migration_20260911_062120_ai_engineering_and_capability_extensions from './20260911_062120_ai_engineering_and_capability_extensions';
import * as migration_20260911_070916_value_grid_and_cta_heading_variants from './20260911_070916_value_grid_and_cta_heading_variants';
import * as migration_20260911_083235_asset_fixes_and_card_variants from './20260911_083235_asset_fixes_and_card_variants';
import * as migration_20260911_103748_capability_and_case_study_variants from './20260911_103748_capability_and_case_study_variants';
import * as migration_20260911_112623_value_grid_variants_and_tech_intro from './20260911_112623_value_grid_variants_and_tech_intro';
import * as migration_20260914_062147 from './20260914_062147';
import * as migration_20260917_101500_seed_default_superadmin from './20260917_101500_seed_default_superadmin';

export const migrations = [
  {
    up: migration_20260910_075513_initial.up,
    down: migration_20260910_075513_initial.down,
    name: '20260910_075513_initial',
  },
  {
    up: migration_20260910_082904_phase3_schema.up,
    down: migration_20260910_082904_phase3_schema.down,
    name: '20260910_082904_phase3_schema',
  },
  {
    up: migration_20260911_053055_phase7_schema_delta.up,
    down: migration_20260911_053055_phase7_schema_delta.down,
    name: '20260911_053055_phase7_schema_delta',
  },
  {
    up: migration_20260911_053445_tech_group_mocktypes.up,
    down: migration_20260911_053445_tech_group_mocktypes.down,
    name: '20260911_053445_tech_group_mocktypes',
  },
  {
    up: migration_20260911_062120_ai_engineering_and_capability_extensions.up,
    down: migration_20260911_062120_ai_engineering_and_capability_extensions.down,
    name: '20260911_062120_ai_engineering_and_capability_extensions',
  },
  {
    up: migration_20260911_070916_value_grid_and_cta_heading_variants.up,
    down: migration_20260911_070916_value_grid_and_cta_heading_variants.down,
    name: '20260911_070916_value_grid_and_cta_heading_variants',
  },
  {
    up: migration_20260911_083235_asset_fixes_and_card_variants.up,
    down: migration_20260911_083235_asset_fixes_and_card_variants.down,
    name: '20260911_083235_asset_fixes_and_card_variants',
  },
  {
    up: migration_20260911_103748_capability_and_case_study_variants.up,
    down: migration_20260911_103748_capability_and_case_study_variants.down,
    name: '20260911_103748_capability_and_case_study_variants',
  },
  {
    up: migration_20260911_112623_value_grid_variants_and_tech_intro.up,
    down: migration_20260911_112623_value_grid_variants_and_tech_intro.down,
    name: '20260911_112623_value_grid_variants_and_tech_intro',
  },
  {
    up: migration_20260914_062147.up,
    down: migration_20260914_062147.down,
    name: '20260914_062147',
  },
  {
    up: migration_20260917_101500_seed_default_superadmin.up,
    down: migration_20260917_101500_seed_default_superadmin.down,
    name: '20260917_101500_seed_default_superadmin',
  },
];
