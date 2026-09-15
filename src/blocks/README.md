# Blocks

The 19 page-builder section types. Each maps 1:1 to a component in `web/components/sections/`.

| # | Slug | Variants | From |
|---|---|---|---|
| 1 | `hero` | `home-canvas`, `service-orb`, `services-dna`, `evoq`, `plain` | all pages |
| 2 | `approach-steps` | — | index |
| 3 | `capability-cards` | `grid-motif`, `list-detailed` | index, services |
| 4 | `capability-detail` | — | 6 service pages |
| 5 | `narrative` | — | service pages |
| 6 | `investment-ladder` | — | index |
| 7 | `split-feature` | — | index |
| 8 | `process-timeline` | — | services |
| 9 | `value-grid` | `dark`, `light`, `bento` | service pages |
| 10 | `proof` | — | index |
| 11 | `testimonials` | — | index |
| 12 | `case-study` | — | ai, bt, de |
| 13 | `tech-groups` | — | digital-engineering |
| 14 | `insights-carousel` | — | index, services |
| 15 | `contact-form` | `pill`, `callout` | index, services |
| 16 | `cta-banner` | `card`, `full` | service pages |
| 17 | `evoq-architecture` | — | evoq |
| 18 | `product-grid` | — | evoq |
| 19 | `industries-grid` | — | evoq |
| — | `rich-text` | — | escape hatch |

## Rules

**Every block spreads `sectionSettings`** from `shared/sectionSettings.ts`. That group provides
`anchorId`, `background`, `spacing`, `hidden` and `reveal` — the mechanism that gives editors
ordering, visibility, anchors and per-section configuration without a code change. A block that
omits it silently loses all five.

```ts
export const HeroBlock: Block = {
  slug: 'hero',
  fields: [
    /* … block-specific fields … */
    sectionSettings,
  ],
}
```

**Prefer a variant over a new block.** Two blocks differing only in layout should be one block with
a `variant` select. `capability-cards` renders as a motif grid on the home page and a detailed list
on services — one block, one component, two variants.

**No SVG in fields.** Artwork is chosen by string key (`iconKey`, `motifKey`, `mockKey`,
`visualKey`) and rendered from `web/lib/registries/`. Import the registry's `options` export into
the `select` field so the admin dropdown cannot drift from the code.

**Blocks that pull from collections offer `source`.** `auto` reads the collection (latest N,
by category); `manual` uses inline items. The resolver lives in `web/lib/cms/resolvers.ts`, never
in the route.

**Adding a block** means: definition here → register in `Pages.layout` → component in
`web/components/sections/<slug>/` → stylesheet in `web/styles/sections/<slug>.css` → entry in
`web/components/render-blocks.tsx` → add to the ordered import chain in `web/app/globals.css`.
