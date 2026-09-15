/**
 * The page-builder block set — 22 sections plus a rich-text escape hatch.
 *
 * `layoutBlocks` is what Pages.layout accepts. Order here is the order editors see in the
 * "Add block" menu, grouped roughly by where each is used.
 *
 * Adding a block: define it → add it here → build the component in
 * web/components/sections/<slug>/ → register it in web/components/render-blocks.tsx →
 * add its stylesheet to the import chain in web/app/globals.css.
 */
import type { Block } from 'payload'

import { HeroBlock } from './hero'
import {
  ApproachStepsBlock,
  CapabilityCardsBlock,
  ContactFormBlock,
  InsightsCarouselBlock,
  InvestmentLadderBlock,
  ProcessTimelineBlock,
  ProofBlock,
  SplitFeatureBlock,
  TestimonialsBlock,
} from './home'
import {
  AiEngineeringBlock,
  CapabilityDetailBlock,
  CaseStudyBlock,
  CategoryGridBlock,
  CtaBannerBlock,
  NarrativeBlock,
  PlatformRowBlock,
  TechGroupsBlock,
  ValueGridBlock,
} from './service'
import {
  EvoqArchitectureBlock,
  IndustriesGridBlock,
  IntegrationsShowcaseBlock,
  ProductGridBlock,
  RichTextBlock,
} from './evoq'

export const layoutBlocks: Block[] = [
  HeroBlock,

  // Home and services
  ApproachStepsBlock,
  CapabilityCardsBlock,
  InvestmentLadderBlock,
  SplitFeatureBlock,
  ProcessTimelineBlock,
  ProofBlock,
  TestimonialsBlock,
  InsightsCarouselBlock,
  ContactFormBlock,

  // Service detail
  NarrativeBlock,
  CapabilityDetailBlock,
  ValueGridBlock,
  CaseStudyBlock,
  TechGroupsBlock,
  AiEngineeringBlock,
  PlatformRowBlock,
  CategoryGridBlock,
  CtaBannerBlock,

  // EVOQ
  EvoqArchitectureBlock,
  ProductGridBlock,
  IndustriesGridBlock,
  IntegrationsShowcaseBlock,

  RichTextBlock,
]

export const layoutBlockSlugs = layoutBlocks.map((b) => b.slug)
