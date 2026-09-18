import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload } from 'payload'

/**
 * Seeds the CMS from the design's own data arrays AND verbatim static copy (plan §10 Phase 5).
 *
 * The design extraction (tools/design-extract) captures the JS DATA ARRAYS from the `sdl-2.0`
 * pages — PILLARS, *_CAPABILITIES, *_VALUE_ITEMS, EVOQ_PRODUCTS, MENUS, FOOTER_COLS and the rest —
 * transcribed here verbatim: every capability title and description, every value item, every nav
 * entry, every footer link. The hero headlines, narrative prose and section kickers/titles that
 * live in each page's HTML markup (not a data array) are transcribed by hand into the `COPY`
 * tables below, read directly from `sdl-2.0/*.html`.
 *
 * Fourteen pages, not nine: `cloud-engineering.html`, `mobile-engineering.html` and
 * `quality-engineering.html` were added to the design after the original extraction — siblings of
 * `web-application-engineering`, linked from digital engineering's capability rows — and then
 * `zoho-consulting-implementation.html` and `salesforce-implementation.html`, linked from business
 * transformation's "SaaS & business platforms" section. None is in the top nav.
 *
 * Idempotent: every record is matched on a natural key (slug / pathname / global slug) and
 * updated in place, so this is safe to re-run.
 *
 * ── Two bounded, deliberate simplifications (both documented in docs/DECISIONS.md) ──
 *  1. `case-study` renders an empty decorative box, not a bespoke illustration — a Phase 5
 *     decision this seed follows, not one it introduces.
 *  2. EVOQ's architecture diagram (business teams → EVOQ apps → shared platform → integrations)
 *     is seeded as one standalone `evoq-architecture` block; in the current design it is split
 *     between an inline visual inside the narrative and a separate integrations showcase further
 *     down the page. Content-complete, structurally approximate.
 */

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))

type DesignArrays = Record<string, Record<string, unknown>>
const DESIGN: DesignArrays = JSON.parse(
  fs.readFileSync(path.join(DIRNAME, 'design-data/_all.json'), 'utf8'),
)

// ── page map: design file → pathname, slug, parent, hero visual, template ──────

type PageSpec = {
  file: keyof typeof DESIGN | string
  slug: string
  parentSlug?: string
  title: string
  template: 'home' | 'services' | 'service' | 'sub-service'
  heroVisual: string
}

const PAGES: PageSpec[] = [
  { file: 'index', slug: 'home', title: 'Social DNA Labs', template: 'home', heroVisual: 'home-canvas' },
  { file: 'services', slug: 'services', title: 'Services', template: 'services', heroVisual: 'services-dna' },
  { file: 'ai-transformation', slug: 'ai-transformation', parentSlug: 'services', title: 'AI transformation', template: 'service', heroVisual: 'ai-orb' },
  { file: 'digital-engineering', slug: 'digital-engineering', parentSlug: 'services', title: 'Digital engineering', template: 'service', heroVisual: 'de-hex' },
  { file: 'business-transformation', slug: 'business-transformation', parentSlug: 'services', title: 'Business transformation', template: 'service', heroVisual: 'bt-arc' },
  { file: 'digital-experience', slug: 'digital-experience', parentSlug: 'services', title: 'Digital experience', template: 'service', heroVisual: 'dx-cursor' },
  { file: 'growth-transformation', slug: 'growth-transformation', parentSlug: 'services', title: 'Growth transformation', template: 'service', heroVisual: 'gt-chart' },
  { file: 'web-application-engineering', slug: 'web-application-engineering', parentSlug: 'digital-engineering', title: 'Web & application engineering', template: 'sub-service', heroVisual: 'wae-windows' },
  { file: 'cloud-engineering', slug: 'cloud-engineering', parentSlug: 'digital-engineering', title: 'Cloud engineering', template: 'sub-service', heroVisual: 'ce-cloud' },
  { file: 'mobile-engineering', slug: 'mobile-engineering', parentSlug: 'digital-engineering', title: 'Mobile engineering', template: 'sub-service', heroVisual: 'me-phone' },
  { file: 'quality-engineering', slug: 'quality-engineering', parentSlug: 'digital-engineering', title: 'Quality engineering', template: 'sub-service', heroVisual: 'qe-pipeline' },
  { file: 'evoq', slug: 'evoq', title: 'EVOQ', template: 'service', heroVisual: 'evoq-suite' },
  // The two SaaS platform pages, linked from business transformation's "SaaS & business
  // platforms" section rather than the top nav.
  { file: 'zoho-consulting-implementation', slug: 'zoho-consulting-implementation', parentSlug: 'business-transformation', title: 'Zoho consulting & implementation', template: 'service', heroVisual: 'zh-logo-card' },
  { file: 'salesforce-implementation', slug: 'salesforce-implementation', parentSlug: 'business-transformation', title: 'Salesforce implementation', template: 'service', heroVisual: 'sf-logo-card' },
]

/** Design ICONS is keyed by title; the CMS icon registry is keyed by slug. */
const ICON_KEY: Record<string, string> = {
  'AI transformation': 'ai-transformation',
  'Digital engineering': 'digital-engineering',
  'Business transformation': 'business-transformation',
  'Digital experience': 'digital-experience',
  'Growth transformation': 'growth-transformation',
  'Products & Platforms': 'products-and-platforms',
  'Products & platforms': 'products-and-platforms',
  EVOQ: 'evoq',
  Blogs: 'blogs',
  'Case studies': 'case-studies',
  Whitepapers: 'whitepapers',
  'Featured projects': 'featured-projects',
  About: 'about',
  'Our approach': 'our-approach',
  Clients: 'clients',
  Careers: 'careers',
}

/** Keys in web/lib/registries/motifs.ts — slugged, matching every other registry key. */
const MOTIF_KEY: Record<string, string> = {
  'AI transformation': 'ai-transformation',
  'Digital engineering': 'digital-engineering',
  'Business transformation': 'business-transformation',
  'Digital experience': 'digital-experience',
  'Growth transformation': 'growth-transformation',
}

/** Each generic service page's capability-detail section has its own distinct design. */
const CAP_VARIANT_BY_PAGE: Record<string, string> = {
  'ai-transformation': 'numbered',
  'business-transformation': 'accordion',
  'digital-experience': 'tabs',
  'growth-transformation': 'bento',
}

/** design href → intended pathname. */
const HREF_TO_PATHNAME: Record<string, string> = {
  'index.html': '/',
  'services.html': '/services',
  'ai-transformation.html': '/services/ai-transformation',
  'digital-engineering.html': '/services/digital-engineering',
  'business-transformation.html': '/services/business-transformation',
  'digital-experience.html': '/services/digital-experience',
  'growth-transformation.html': '/services/growth-transformation',
  'web-application-engineering.html': '/services/digital-engineering/web-application-engineering',
  'cloud-engineering.html': '/services/digital-engineering/cloud-engineering',
  'mobile-engineering.html': '/services/digital-engineering/mobile-engineering',
  'quality-engineering.html': '/services/digital-engineering/quality-engineering',
  'evoq.html': '/evoq',
  'zoho-consulting-implementation.html': '/services/business-transformation/zoho-consulting-implementation',
  'salesforce-implementation.html': '/services/business-transformation/salesforce-implementation',
}

// ── verbatim copy, transcribed from sdl-2.0/*.html (not in the JS data arrays) ─────────────────

type HeroCopy = {
  kicker?: string
  lines: { before?: string; accent?: string; after?: string }[]
  sub: string
  primary: string
  secondary?: string
}

/** ai/bt/dx/gt/de share this shape: hero, narrative, capability head, value head, case, cta. */
type ServiceCopy = {
  hero: HeroCopy
  narrativeKicker: string
  narrativeLead: string
  narrativeParagraphs: string[]
  capKicker: string
  capTitle: string
  capIntro: string[]
  valueKicker: string
  valueTitle: string
  caseKicker: string
  caseSectionTitle: string
  caseSectionSub: string
  caseTitle: string
  caseBlocks: { label: string; text: string }[]
  ctaKicker: string
  ctaTitle: string
  ctaSub: string
  ctaLabel: string
}

/** wae/ce/me/qe share this shape: hero, "shift" narrative, ai-engineering, capability, value, case, cta. */
type SubServiceCopy = {
  hero: HeroCopy
  shiftKicker: string
  shiftTitle: string
  shiftParagraphs: string[]
  shiftPills: string[]
  shiftQuote: string
  aiKicker: string
  aiTitle: string
  aiParagraphs: string[]
  capKicker: string
  capTitle: string
  capSub?: string
  valueKicker: string
  valueTitle: string
  caseKicker: string
  caseSectionTitle: string
  caseSectionSub: string
  caseTitle: string
  caseBlocks: { label: string; text: string }[]
  ctaKicker: string
  ctaTitle: string
  ctaSub: string
  ctaLabel: string
}

const SERVICE_COPY: Record<string, ServiceCopy> = {
  'ai-transformation': {
    hero: {
      kicker: 'AI transformation',
      lines: [{ before: 'Turn AI potential' }, { accent: 'into business value.' }],
      sub: 'Move beyond experimentation with practical AI strategies, intelligent capabilities and AI-powered solutions built around the way your business works.',
      primary: 'Talk to an AI expert', secondary: 'Explore AI capabilities',
    },
    narrativeKicker: "AI is changing what's possible",
    narrativeLead: 'AI is moving quickly from experimentation into everyday business. The opportunity goes well beyond chatbots and content generation.',
    narrativeParagraphs: [
      'It can change how teams work, how decisions are made, how customers are served, how operations run and how software is built.',
      'The challenge is knowing where AI can create meaningful value and how to make it work in the real world.',
      'Strategy, experience and engineering come together to turn those opportunities into working business capabilities.',
    ],
    capKicker: 'AI capabilities', capTitle: 'From AI strategy to intelligent applications.',
    capIntro: [
      'AI transformation takes more than selecting a model or building a proof of concept. It requires the right opportunity, the right technology and a clear path to putting it into use.',
      'From identifying opportunities and designing solutions to engineering, integration and adoption, the focus stays on creating AI that delivers a measurable difference.',
    ],
    valueKicker: 'Where AI can make a difference', valueTitle: 'The value is in what changes.',
    caseKicker: 'Selected work', caseSectionTitle: 'AI, applied.', caseSectionSub: 'See how AI moves from an idea to something people actually use.',
    caseTitle: 'Intelligent support operations for a growing SaaS platform',
    caseBlocks: [
      { label: 'Challenge', text: 'Support volume was growing faster than the team could scale. Answers lived across product documentation, past tickets and team knowledge, so agents spent more time searching than solving.' },
      { label: 'What we built', text: 'A retrieval-grounded AI assistant connected to product documentation, ticket history and CRM data — surfacing suggested responses inside the support workflow the team already used, with human review kept in the loop and clear boundaries on what the assistant can act on.' },
      { label: 'Impact', text: 'Faster first responses, more issues resolved on first contact, and a support team spending its time on the complex cases that genuinely need people.' },
    ],
    ctaKicker: 'Start a conversation', ctaTitle: 'Have an AI opportunity worth exploring?',
    ctaSub: "Let's find where AI can create meaningful value for your business.", ctaLabel: 'Talk to an AI expert',
  },

  'business-transformation': {
    hero: {
      kicker: 'Business transformation',
      lines: [{ before: 'Change how the' }, { accent: 'business works.' }],
      sub: 'Modernize processes, applications and business capabilities to remove friction, improve efficiency and create a stronger foundation for growth.',
      primary: 'Talk to a transformation expert', secondary: 'Explore transformation capabilities',
    },
    narrativeKicker: 'Business change needs more than new technology',
    narrativeLead: 'Businesses often outgrow the systems and processes that helped them get there.',
    narrativeParagraphs: [
      'Information sits across different systems. Manual processes slow teams down. Customer journeys become fragmented. Legacy applications become harder to change. New business models demand capabilities the existing technology was never designed to support.',
      'Business transformation brings these pieces together.',
      'The focus is not simply on introducing new technology. It is on rethinking how the business operates and using technology to make that operation simpler, faster and more effective.',
    ],
    capKicker: 'Transformation capabilities', capTitle: 'Transform the way the business works.',
    capIntro: [
      'Business transformation can mean modernizing an existing operation, introducing a new capability or rethinking an entire process.',
      'The right approach starts with how the business needs to work, then brings together processes, applications, data and technology to make it happen.',
    ],
    valueKicker: 'Where transformation creates value', valueTitle: 'Better ways of working.',
    caseKicker: 'Selected work', caseSectionTitle: 'Transformation in action.', caseSectionSub: 'See how technology has helped businesses change the way they operate, serve customers and grow.',
    caseTitle: 'Bringing together a fragmented sales and service operation',
    caseBlocks: [
      { label: 'Challenge', text: 'Customer, sales and service information lived in disconnected systems and spreadsheets, creating extra work and inconsistent customer experiences.' },
      { label: 'Transformation', text: 'A unified business application connected sales, service and operational data into a single system, with modernized workflows replacing manual handoffs between teams.' },
      { label: 'Impact', text: 'Faster response times, a single view of the customer across teams, and an operating model built to scale as the business grows.' },
    ],
    ctaKicker: 'Start a conversation', ctaTitle: 'Ready to change how the business works?',
    ctaSub: "Let's talk about the processes, systems or capabilities that need to work better.", ctaLabel: 'Talk to a transformation expert',
  },

  'digital-experience': {
    hero: {
      kicker: 'Digital experience',
      lines: [{ before: 'Design experiences' }, { accent: 'people want to use.' }],
      sub: 'Create intuitive digital experiences across customer and employee journeys, bringing together strategy, design and technology to make every interaction simpler and more effective.',
      primary: 'Talk to an expert', secondary: 'Explore experience capabilities',
    },
    narrativeKicker: 'Experience is more than how it looks',
    narrativeLead: 'A good digital experience should make things easier.',
    narrativeParagraphs: [
      'For customers, that means finding information, completing tasks and getting what they need without unnecessary friction. For employees, it means giving them the tools and workflows to do their work efficiently.',
      'The best experiences bring together user needs, business goals and technology realities.',
      'From strategy and research to product design and design systems, the focus is on creating experiences that people understand, use and value.',
    ],
    capKicker: 'Experience capabilities', capTitle: 'Design around people. Build for outcomes.',
    capIntro: ["Great experiences don't happen by adding visual polish at the end of a project. They come from understanding people, simplifying complexity and designing every interaction with purpose."],
    valueKicker: 'Where experience creates value', valueTitle: 'Better experiences change behavior.',
    caseKicker: 'Selected work', caseSectionTitle: 'Experience in action.', caseSectionSub: 'Explore digital experiences designed to simplify complexity, improve adoption and create better outcomes.',
    caseTitle: 'Redesigning a self-service portal customers kept abandoning',
    caseBlocks: [
      { label: 'Challenge', text: 'Customers were dropping off mid-task in a self-service portal, generating avoidable support volume and frustration.' },
      { label: 'What we designed', text: 'A simplified information architecture and redesigned core workflows, built around how customers actually complete tasks, backed by a reusable component library for consistency going forward.' },
      { label: 'Impact', text: 'Higher task completion, fewer support escalations, and a design foundation the team could extend to new features without starting over.' },
    ],
    ctaKicker: 'Start a conversation', ctaTitle: 'Have an experience that needs rethinking?',
    ctaSub: "Let's find the friction and design a better way forward.", ctaLabel: 'Talk to an expert',
  },

  'growth-transformation': {
    hero: {
      kicker: 'Growth transformation',
      lines: [{ before: 'Turn digital presence' }, { accent: 'into demand.' }],
      sub: 'Bring AI search, SEO, content, campaigns, digital channels and conversion together to attract the right audiences, create qualified demand and improve business performance.',
      primary: 'Talk to a growth expert', secondary: 'Explore growth capabilities',
    },
    narrativeKicker: 'Growth needs more than more traffic',
    narrativeLead: 'Getting noticed is only the beginning.',
    narrativeParagraphs: [
      'Growth happens when the right people discover the business, find something relevant, take action and have a reason to come back. That requires more than running campaigns or publishing content.',
      'Search visibility, content, paid media, digital experiences, conversion and measurement need to work together around clear business goals.',
      'The focus is on creating a growth engine that attracts the right audience, turns interest into action and shows what is actually driving results.',
    ],
    capKicker: 'Capabilities', capTitle: 'From visibility to conversion.',
    capIntro: [
      'Every stage of the customer journey creates an opportunity to improve growth.',
      'The right mix of search, content, campaigns, optimization and measurement turns digital activity into a more predictable source of demand.',
    ],
    valueKicker: 'Where it creates value', valueTitle: 'Make every digital effort count.',
    caseKicker: 'Selected work', caseSectionTitle: 'Growth in action.', caseSectionSub: 'Explore campaigns, digital programs and growth initiatives that turned attention into measurable business outcomes.',
    caseTitle: 'Rebuilding organic visibility for a plateaued B2B pipeline',
    caseBlocks: [
      { label: 'Challenge', text: 'Organic traffic had plateaued and marketing spend was going further each quarter without a clear read on what was actually driving qualified pipeline.' },
      { label: 'What we changed', text: 'A refreshed SEO and content strategy targeting real buying intent, paired with conversion improvements across key landing pages and clearer performance measurement tied to pipeline, not just traffic.' },
      { label: 'Impact', text: 'More qualified organic traffic, a higher visitor-to-lead conversion rate, and marketing decisions grounded in what was actually driving business results.' },
    ],
    ctaKicker: 'Start a conversation', ctaTitle: 'Ready to turn digital activity into growth?',
    ctaSub: "Let's identify where visibility, conversion and performance can create a bigger business impact.", ctaLabel: 'Talk to a growth expert',
  },
}

/** digital-engineering: its own row-variant capability section (see below) shares this copy shape. */
const DE_COPY = {
  hero: {
    kicker: 'Digital engineering',
    lines: [{ before: 'Build, modernize and scale' }, { accent: 'digital technology.' }],
    sub: 'Engineer digital products, applications and platforms with modern architecture, AI-enabled development and the technology expertise to support changing business needs.',
    primary: 'Talk to an engineering expert', secondary: 'Explore engineering capabilities',
  } satisfies HeroCopy,
  narrativeKicker: 'Technology should keep up with the business',
  narrativeLead: 'Businesses change faster than many systems supporting them.',
  narrativeParagraphs: [
    'New products need to launch. Existing applications need to evolve. Platforms need to scale. Legacy technology needs to become easier to maintain. New capabilities need to work with everything already in place.',
    'And increasingly, AI is changing what applications can do and how quickly they can be built.',
    'Digital engineering brings together the architecture, technology and engineering expertise needed to make that change possible.',
  ],
  capKicker: 'Engineering capabilities', capTitle: 'From digital products to enterprise platforms.',
  capIntro: [
    'Digital engineering is more than software development.',
    'It brings together specialist engineering capabilities and the architecture, integration and modernization expertise needed to build technology that performs today and can evolve tomorrow.',
  ],
  crossCuttingLabel: 'Cross-cutting engineering capabilities',
  crossCuttingPills: ['Application architecture', 'APIs & integration', 'Microservices', 'DevOps', 'Application modernization', 'AI-enabled engineering'],
  aiKicker: 'AI-enabled engineering', aiTitle: 'Build software faster. Build it better.',
  aiParagraphs: [
    'AI is changing how software is designed, developed, tested and maintained.',
    'Use AI throughout the engineering lifecycle to accelerate development, improve code quality, modernize applications, automate repetitive work and increase engineering productivity while keeping human expertise at the center of critical decisions.',
  ],
  aiTags: ['AI-assisted development', 'Code modernization', 'Automated testing', 'Code analysis', 'Engineering automation'],
  techKicker: 'Technology expertise', techTitle: 'The right technology for the job.',
  techIntro: [
    'Technology choices should follow the product, architecture and business requirement, not the other way around.',
    'Work across established and modern technology stacks to build, modernize and scale digital applications.',
  ],
  valueKicker: 'Engineering for business change', valueTitle: 'Technology should make change easier.',
  valueIntro: 'Digital engineering isn’t only about building new software. It is about creating a technology foundation that allows the business to launch, adapt, integrate and scale without technology becoming the constraint.',
  caseKicker: 'Selected work', caseSectionTitle: 'Engineering in action.', caseSectionSub: 'Explore digital products, platforms and applications built, modernized or scaled for real business needs.',
  caseTitle: 'Modernizing a legacy platform for a scaling B2B business',
  caseBlocks: [
    { label: 'Challenge', text: 'A core operations platform had grown difficult to maintain, slowing new feature delivery and increasing the risk of every release.' },
    { label: 'What we built', text: 'A phased modernization that re-architected critical modules into services, introduced automated testing across the release pipeline, and migrated the platform to a cloud-native foundation — without disrupting the business it already supported.' },
    { label: 'Impact', text: 'Faster release cycles, fewer production incidents, and a platform positioned to scale with the business rather than constrain it.' },
  ],
  ctaKicker: 'Start a conversation', ctaTitle: 'Building something new? Modernizing something critical?',
  ctaSub: "Let's talk about the technology your business needs next.", ctaLabel: 'Talk to an engineering expert',
}

const SUB_SERVICE_COPY: Record<string, SubServiceCopy> = {
  'web-application-engineering': {
    hero: {
      kicker: 'Web & Application Engineering',
      lines: [{ before: 'Turn ideas into' }, { accent: 'high-performing applications.' }],
      sub: 'Create web applications, portals and digital platforms with modern engineering, AI-accelerated development and technology built for performance, scalability and continuous evolution.',
      primary: 'Talk to a web engineering expert', secondary: 'Explore capabilities',
    },
    shiftKicker: 'Why it matters', shiftTitle: 'The web is now part of the business.',
    shiftParagraphs: [
      'Web applications are no longer just digital front doors. They support customer journeys, business processes, employee workflows and entire digital products.',
      'They need to be fast, secure, scalable and easy to evolve. They also need to work with the applications, data and systems already running the business.',
    ],
    shiftPills: ['Fast', 'Secure', 'Scalable', 'Easy to evolve', 'Connected'],
    shiftQuote: 'The right engineering approach brings these requirements together to create web experiences that perform today and can adapt to what comes next.',
    aiKicker: 'AI-accelerated engineering', aiTitle: 'Build faster. Keep engineering quality high.',
    aiParagraphs: [
      'AI is changing how web applications are designed, developed and maintained.',
      'Use AI-assisted development, code generation, refactoring, automated testing and application analysis to accelerate engineering work while keeping architecture, security, performance and quality under control.',
    ],
    capKicker: 'Web & application capabilities', capTitle: 'Engineering for modern web applications.',
    capSub: 'From customer-facing experiences to complex business applications, combine the right engineering approach and technology to build applications that are reliable, scalable and ready to evolve.',
    valueKicker: 'What you get', valueTitle: 'What good web engineering should deliver.',
    caseKicker: 'Web engineering in action', caseSectionTitle: 'Technology that delivers.', caseSectionSub: 'Explore web applications and digital platforms built or modernized for real business needs.',
    caseTitle: 'A modernized customer portal built for scale',
    caseBlocks: [
      { label: 'Challenge', text: 'A customer-facing portal was built on an aging stack that struggled under peak traffic and slowed every new feature release.' },
      { label: 'What we engineered', text: 'A modernized frontend and backend architecture with AI-assisted refactoring, automated testing and a scalable API layer — deployed without disrupting the business it already supported.' },
      { label: 'Impact', text: 'Faster page loads, fewer production incidents, and a platform ready to support new features and growing traffic.' },
    ],
    ctaKicker: 'Start a conversation', ctaTitle: 'Building a new web application? Modernizing an existing one?',
    ctaSub: "Let's talk about the web application or digital platform your business needs next.", ctaLabel: 'Talk to a web engineering expert',
  },

  'cloud-engineering': {
    hero: {
      kicker: 'Cloud Engineering',
      lines: [{ before: 'Build for scale.' }, { accent: 'Operate with confidence.' }],
      sub: 'Modernize applications and cloud infrastructure to handle changing demand, improve resilience and accelerate the delivery of new digital capabilities.',
      primary: 'Talk to a cloud engineering expert', secondary: 'Explore capabilities',
    },
    shiftKicker: 'Why it matters', shiftTitle: 'Cloud should enable change.',
    shiftParagraphs: [
      'Cloud is more than moving applications away from traditional infrastructure.',
      'The right cloud architecture makes it easier to launch new capabilities, scale when demand changes, integrate applications and operate technology more efficiently.',
    ],
    shiftPills: ['Scalable', 'Integrated', 'Resilient', 'Efficient'],
    shiftQuote: 'Whether modernizing an existing environment or building cloud-native applications, engineering decisions should support the way the business needs to operate.',
    aiKicker: 'AI-ready cloud engineering', aiTitle: 'Build the foundation for AI at scale.',
    aiParagraphs: ['AI applications require the right combination of compute, data, integration, security and scalability. Build cloud environments that support AI workloads while modernizing the applications and infrastructure around them.'],
    capKicker: 'Cloud engineering capabilities', capTitle: 'Engineering for cloud-native and modernized environments.',
    valueKicker: 'What you get', valueTitle: 'What good cloud engineering should deliver.',
    caseKicker: 'Cloud engineering in action', caseSectionTitle: "Technology built for what's next.", caseSectionSub: 'Explore cloud applications, modernizations and infrastructure transformations delivered for real business requirements.',
    caseTitle: 'A cloud migration built for zero-downtime scale',
    caseBlocks: [
      { label: 'Challenge', text: "A retail platform's on-premise infrastructure couldn't handle seasonal traffic spikes, causing slowdowns and costly over-provisioning year-round." },
      { label: 'What we engineered', text: 'A phased migration to a cloud-native architecture with auto-scaling, infrastructure-as-code and automated deployment pipelines — modernized without disrupting live operations.' },
      { label: 'Impact', text: 'Reliable performance during peak demand, lower infrastructure costs, and a platform the team can scale and deploy with confidence.' },
    ],
    ctaKicker: 'Start a conversation', ctaTitle: 'Modernizing your cloud environment?',
    ctaSub: "Let's talk about the architecture, applications and infrastructure your business needs next.", ctaLabel: 'Talk to a cloud engineering expert',
  },

  'mobile-engineering': {
    hero: {
      kicker: 'Mobile Engineering',
      lines: [{ before: 'Put your business in' }, { accent: "your customers' hands." }],
      sub: 'Build mobile applications that make it easier for customers, employees and field teams to get things done, with performance, security and experiences designed for real-world use.',
      primary: 'Talk to a mobile engineering expert', secondary: 'Explore capabilities',
    },
    shiftKicker: 'Why it matters', shiftTitle: 'Mobile is part of the product.',
    shiftParagraphs: [
      'Mobile applications are often where customers, employees and field teams interact directly with the business.',
      'They need to work reliably across devices and environments, perform well under real-world conditions and connect seamlessly with the systems behind them.',
    ],
    shiftPills: ['Reliable', 'Cross-device', 'High-performing', 'Connected'],
    shiftQuote: 'From a new mobile product to an existing application that needs modernization, the right engineering approach brings experience, architecture and integration together.',
    aiKicker: 'AI-enabled mobile engineering', aiTitle: 'Build smarter mobile experiences.',
    aiParagraphs: ['Use AI to create more personalized, responsive and capable mobile applications while accelerating development, testing and maintenance.'],
    capKicker: 'Capabilities', capTitle: 'Mobile engineering capabilities.',
    valueKicker: 'What you get', valueTitle: 'What good mobile engineering should deliver.',
    caseKicker: 'Mobile engineering in action', caseSectionTitle: 'From mobile idea to everyday use.', caseSectionSub: 'Explore mobile applications built or modernized for customers, employees and field teams.',
    caseTitle: 'A field service app rebuilt for offline-first reliability',
    caseBlocks: [
      { label: 'Challenge', text: 'A field team relied on a mobile app that failed without signal, forcing workers to fall back on paper forms and manual re-entry.' },
      { label: 'What we engineered', text: 'An offline-first mobile application with automatic sync, AI-assisted form validation and a modernized cross-platform codebase built for reliable field use.' },
      { label: 'Impact', text: 'Fewer manual errors, faster job completion in the field, and a single codebase the team can maintain and extend.' },
    ],
    ctaKicker: 'Start a conversation', ctaTitle: 'Have a mobile product to build or modernize?',
    ctaSub: "Let's talk about the application your users need next.", ctaLabel: 'Talk to a mobile engineering expert',
  },

  'quality-engineering': {
    hero: {
      kicker: 'Quality Engineering',
      lines: [{ before: 'Release faster.' }, { accent: 'Break less.' }],
      sub: 'Build quality into every stage of engineering with automation, continuous testing and performance engineering that improve reliability without slowing delivery.',
      primary: 'Talk to a quality engineering expert', secondary: 'Explore capabilities',
    },
    shiftKicker: 'Why it matters', shiftTitle: 'Quality starts before testing.',
    shiftParagraphs: [
      'Quality cannot be added at the end of the development cycle.',
      'Modern applications require quality to be considered across architecture, development, integration, testing and release. This means finding defects earlier, automating repeatable validation and continuously measuring how applications perform.',
    ],
    shiftPills: ['Earlier detection', 'Automated', 'Measured', 'Reliable'],
    shiftQuote: 'Quality engineering brings these practices together to make software more reliable without slowing down delivery.',
    aiKicker: 'AI-accelerated quality engineering', aiTitle: 'Test smarter. Release with confidence.',
    aiParagraphs: ['Use AI to accelerate test creation, identify potential defects, analyze application behavior and improve test coverage while keeping quality decisions under engineering control.'],
    capKicker: 'Quality engineering capabilities', capTitle: 'Engineering confidence into every release.',
    valueKicker: 'What you get', valueTitle: 'What good quality engineering should deliver.',
    caseKicker: 'Quality engineering in action', caseSectionTitle: 'Confidence from development to release.', caseSectionSub: 'Explore applications where automation, testing and performance engineering helped improve software quality and release reliability.',
    caseTitle: 'Automated regression testing built for confident releases',
    caseBlocks: [
      { label: 'Challenge', text: 'Manual regression testing before every release was slow and inconsistent, letting defects reach production and delaying launches.' },
      { label: 'What we engineered', text: 'An AI-assisted automated testing framework covering functional, API and regression tests, integrated directly into the CI/CD pipeline.' },
      { label: 'Impact', text: 'Higher test coverage, faster release cycles, and fewer production defects reaching customers.' },
    ],
    ctaKicker: 'Start a conversation', ctaTitle: 'Need more confidence in every release?',
    ctaSub: "Let's talk about the quality challenges across your applications and engineering lifecycle.", ctaLabel: 'Talk to a quality engineering expert',
  },
}

const HOME_COPY = {
  hero: {
    lines: [{ accent: 'AI', after: ' accelerates.' }, { before: 'Experience ', accent: 'directs.' }, { before: 'Business impact ', accent: 'follows.' }],
    sub: 'Harness AI, technology and experience to move faster, build better and create measurable business impact.',
    primary: 'Talk to an expert', secondary: 'Explore capabilities',
  } satisfies HeroCopy,
  approachTitle: 'From potential to impact.',
  approachSteps: [
    { title: 'Ideas everywhere', desc: 'Every business has possibilities.' },
    { title: 'Intelligence connects', desc: 'AI and technology find what matters.' },
    { title: 'Acceleration happens', desc: 'Work moves faster with the right direction.' },
    { title: 'Impact delivered', desc: 'Stronger outcomes. Measurable value.' },
  ],
  approachNote: { strong: 'Technology is powerful.', accent: 'Purpose makes it valuable.' },
  pillarsKicker: 'Capabilities', pillarsTitle: 'Where technology can make a difference.',
  pillarsSub: 'Technology creates possibilities. Experience turns the right ones into business capability.',
  investTitle: 'Technology is an investment. Make it return.',
  investSub: "Every technology investment should create something better. The goal isn't more technology. It's more value from the technology you already have, and the technology you add next.",
  investClosing: { line1: 'More effective growth.', line2: 'More value from technology.' },
  aiLeftKicker: 'AI with purpose',
  aiLeftBody: 'SDL brings AI together with engineering and business experience to move from experimentation to practical impact.',
  aiLeftCtaLabel: 'Explore AI transformation',
  aiRightTitle: "AI is everywhere. Value isn't.",
  aiRightBody: "AI is changing what businesses can build and how quickly they can move. The opportunity isn't to use AI everywhere. It's to know where it can create meaningful advantage.",
  proofKicker: 'Proof', proofTitle: 'Experience changes the outcome.',
  proofText: '15+ years of technology delivery have taught SDL something simple: good technology has to work in the real world. Across complex systems, digital products, customer experiences and business operations, the focus remains the same: technology that people can use, businesses can run and teams can build on.',
  proofCallout: 'Built for real business. Trusted by teams building what comes next.',
  proofBlockTitle: 'Built for real business',
  testimonialsKicker: 'Client perspective', testimonialsTitle: 'Experience, in their words.',
  insightsKicker: 'Insights', insightsTitle: 'Think ahead.',
  insightsSub: "Perspectives on AI, technology, transformation and digital growth for businesses navigating what's next.",
  insightsFooterText: 'Swipe through the latest thinking',
  contactSub: "Tell us what you're trying to build, improve or change. The conversation starts with the business challenge, not the technology.",
  contactPill: 'Business-first thinking. Technology that earns its place.',
}

const SERVICES_COPY = {
  hero: {
    lines: [{ before: 'Technology that solves' }, { accent: 'business problems.' }],
    sub: 'From AI and engineering to transformation, experience and growth, Social DNA Labs brings the capabilities needed to turn business priorities into practical outcomes.',
    primary: 'Talk to an expert', secondary: 'Explore capabilities',
  } satisfies HeroCopy,
  capKicker: 'Capabilities', capTitle: 'Capabilities built around your business',
  capSub: "Solve today's challenges and build what comes next with the right combination of technology, expertise and experience.",
  timelineKicker: 'Process', timelineTitle: 'Move from opportunity to impact faster',
  timelineSub: 'AI is changing how digital products and business systems are built. Combine AI with modern engineering and business expertise to accelerate execution, make better decisions and keep improving as needs change.',
  insightsKicker: 'Insights', insightsTitle: "Ideas for what's next",
  insightsSub: 'Explore perspectives on AI, engineering, transformation and digital growth.',
  contactHeading: "Let's talk about what you're building",
  contactSub: "Tell us what you're looking to build, improve or transform. Share a few details and we'll help identify the right next step.",
  calloutTitle: 'Prefer to talk?', calloutDesc: 'Book a consultation with an expert.', calloutCtaLabel: 'Book a consultation',
}

const EVOQ_COPY = {
  hero: {
    kicker: 'Products & Platforms — EVOQ',
    lines: [{ before: 'One suite.' }, { before: 'Built around ', accent: 'your business.' }],
    sub: 'EVOQ brings essential business applications together in one flexible suite. Start with the applications you need today and expand as your business grows.',
    primary: 'Explore products', secondary: 'Talk to an expert',
  } satisfies HeroCopy,
  narrativeKicker: 'Platform overview',
  narrativeLead: 'EVOQ brings business applications, shared platform capabilities and integrations together in one environment.',
  narrativeParagraphs: [
    'Designed to support teams across sales, marketing, service, operations and finance, it provides the tools businesses need to manage everyday work while creating a foundation for greater visibility, control and growth.',
    'A shared platform supports the applications with capabilities for administration, APIs, data, mobility, security and analytics. Integrations extend EVOQ into the systems businesses already use, making it easier to build a technology environment around existing workflows.',
  ],
  archHub: { title: 'EVOQ Applications', desc: 'Purpose-built apps for every business function' },
  archTeamsLabel: 'Business teams',
  archTeams: ['Sales', 'Marketing', 'Service', 'Operations', 'Finance', 'Leadership'],
  archPlatformLabel: 'Shared platform',
  archPlatform: ['Console & APIs', 'Administration', 'Storage', 'Data protection', 'Mobility', 'Analytics'],
  /** The five marks drawn in the diagram's integrations layer, then its dashed "+12" chip. */
  archBadges: [['QuickBooks', 'quickbooks'], ['SAP', 'sap'], ['Mailchimp', 'mailchimp'], ['Stripe', 'stripe'], ['Shopify', 'shopify']] as [string, string][],
  archMore: '+12',
  integrationsKicker: 'Integrations', integrationsTitle: 'Connect with the systems you already use.',
  integrationsParagraphs: [
    'EVOQ integrates with the systems and services that businesses rely on, helping data move between applications and existing business environments.',
    'Connect EVOQ with your CRM, ERP, accounting, productivity and other business systems to reduce manual data entry, maintain consistent information and support connected workflows.',
  ],
  integrationsCaptionTitle: 'Seamless integrations',
  integrationsCaptionDesc: 'Connect the tools your teams already use, without extra manual work.',
  integrationsCtaLabel: 'Explore integrations',
  ctaKicker: 'Find your fit', ctaTitle: 'Looking to find the right EVOQ solution?',
  ctaSub: 'Explore EVOQ applications built to simplify business processes, support your teams, and help your business grow.',
  ctaLabel: 'Talk to an expert',
  productsKicker: 'Product suite', productsTitle: 'Explore EVOQ products.',
  productsSub: 'Find the applications that fit your business. Start with what you need today and expand your suite as your requirements grow.',
  industriesKicker: 'Flexible by design', industriesTitle: 'Built for different ways of working.',
  industriesSub: "EVOQ's modular applications can support different business models, workflows and operational needs.",
}

// ── helpers ───────────────────────────────────────────────────────────────────

type Loose = Record<string, unknown>

/** Matches the slugging tools/design-extract/gen-registries.mjs uses to key icons.ts. */
const slug = (s: string): string =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/**
 * The design's own real asset files (client logos, testimonial avatars, insight thumbnails)
 * live in the sibling `sdl-2.0/assets/` checkout, not in this repo.
 */
const DESIGN_ASSETS_DIR = path.resolve(DIRNAME, '../../../../sdl-2.0/assets')

/**
 * The CMS media directory, which IS committed to this repo and deploys with the app (see
 * `.gitignore` — production serves media from the deployment, not object storage).
 *
 * This is the second place an asset is looked for, and it is what makes the seed runnable from
 * a machine without the `sdl-2.0` checkout. It is flat — `assets/clients/client1.jpg` in the
 * design data is `client1.jpg` here — so the lookup is by BASENAME, never by relative path.
 */
const MEDIA_DIR = process.env.SDL_MEDIA_DIR
  ? path.resolve(process.cwd(), process.env.SDL_MEDIA_DIR)
  : path.resolve(process.cwd(), 'media')

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
}

/**
 * Finds-or-creates the Media doc for a design asset, by its own filename.
 *
 * Order matters, and it is the opposite of what it was.
 *
 * This used to check `fs.existsSync(DESIGN_ASSETS_DIR/...)` FIRST and bail out before ever
 * querying the database. Run from an environment without the `sdl-2.0` checkout — which is
 * every environment except one developer machine — it therefore returned undefined for every
 * image. That is how production ended up with 14 pages, 12 insights and ZERO media: the seed
 * reported success while silently skipping every upload, and `clients` (whose logo is required)
 * was skipped wholesale along with it.
 *
 * Looking the document up by filename first makes the common case — media already in the
 * database — need no source file at all. Only a genuinely new asset falls through to the disk
 * lookup, which now tries the committed `media/` directory as well as the design checkout.
 */
async function uploadDesignAsset(
  payload: Payload,
  relativePath: string,
  alt: string,
): Promise<number | undefined> {
  const filename = path.basename(relativePath)

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) return (existing.docs[0] as { id: number }).id

  const candidates = [path.join(DESIGN_ASSETS_DIR, relativePath), path.join(MEDIA_DIR, filename)]
  const sourcePath = candidates.find((candidate) => fs.existsSync(candidate))
  if (!sourcePath) return undefined

  const buffer = fs.readFileSync(sourcePath)
  const mimetype = MIME_BY_EXT[path.extname(filename).toLowerCase()] ?? 'application/octet-stream'
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype, name: filename, size: buffer.length },
    overrideAccess: true,
    /*
     * Without this, Payload appends `-1`, `-2`, … whenever the target filename is already on
     * disk, and the new document then points at a file the deployment does not have. That is
     * exactly how `client1-1.jpg` and `client1-2.jpg` got into `media/`. Re-seeding must reuse
     * the committed filename, not fork a new one.
     */
    overwriteExistingFiles: true,
  })
  return doc.id as number
}

async function upsertBySlug(
  payload: Payload,
  collection: string,
  slug: string,
  data: Loose,
  published = false,
): Promise<number> {
  const existing = await payload.find({
    collection: collection as never,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const body = published ? { ...data, _status: 'published' } : data
  const first = existing.docs[0] as { id: number } | undefined

  if (first) {
    await payload.update({
      collection: collection as never,
      id: first.id,
      data: body as never,
      overrideAccess: true,
      draft: false,
    })
    return first.id
  }
  const created = await payload.create({
    collection: collection as never,
    data: { ...body, slug } as never,
    overrideAccess: true,
    draft: false,
  })
  return (created as { id: number }).id
}

/** Turns a design href into a resolved CMS link group. */
function link(label: string, href: string | undefined, pageIds: Map<string, number>): Loose {
  if (!href || href === '#') {
    return { label, type: 'anchor', anchor: 'contact' }
  }
  const pathname = HREF_TO_PATHNAME[href]
  const pageId = pathname ? pageIds.get(pathname) : undefined
  if (pageId) return { label, type: 'internal', page: pageId }
  if (/^https?:\/\//.test(href)) return { label, type: 'external', url: href, newTab: true }
  return { label, type: 'anchor', anchor: href.replace(/^#/, '') || 'contact' }
}

const arr = (file: string, key: string): Loose[] =>
  (DESIGN[file]?.[key] as Loose[] | undefined) ?? []

const anchorCta = (label: string, anchor = 'contact'): Loose => ({ label, type: 'anchor', anchor })

/**
 * Every page except home and services links its "talk to us" CTAs cross-page to the home
 * page's contact section (`index.html#contact` in the design) rather than carrying its own
 * contact form — only index.html and services.html have one (plan §2.5's page-anatomy table).
 * `type: 'external'` with a root-relative URL is how the CMS link union expresses that: `resolveLink`
 * passes an external `url` straight through as the href, so `/#contact` behaves exactly like the
 * design's own plain `<a href="index.html#contact">` — no protocol required.
 */
const contactLink = (label: string): Loose => ({ label, type: 'external', url: '/#contact', newTab: false })

/**
 * A link to a route the frontend owns rather than a CMS page.
 *
 * `/insights` is a route, not a Page document — a filtered view of a collection — so there is no
 * page id to point an `internal` link at. `external` with a root-relative url is how this schema
 * expresses that, exactly as `contactLink` does; `resolveLink` passes the url straight through.
 */
const routeLink = (label: string, url: string): Loose => ({
  label,
  type: 'external',
  url,
  newTab: false,
})

/**
 * The Insights menu, pointed at the insights index.
 *
 * Every entry here was seeded as `anchor: contact` because the page did not exist yet — the nav
 * promised four content types and delivered a jump to the contact form. The sub-items now deep
 * link into the index's content-type filter, which is what `?type=` on the explorer is for.
 */
const INSIGHTS_MENU_LINKS: Record<string, string> = {
  Blogs: '/insights?type=blog',
  'Case studies': '/insights?type=case-study',
  Whitepapers: '/insights?type=whitepaper',
  'Featured projects': '/insights?type=featured-project',
}

// ── globals ───────────────────────────────────────────────────────────────────

/**
 * The brand wordmark shown in the header and footer.
 *
 * Not a design-extract asset like the client logos — it ships in this repo, in `media/` — but
 * it is resolved through the same find-or-create helper, which looks there by filename.
 *
 * It was seeded by nobody: `seedHeader` and `seedFooter` set `logoAlt` and left `logo` unset,
 * so the only reason it appeared locally was a manual upload through the admin on one machine.
 * Production had the FILE (it is committed, and serves 200) but no Media document pointing at
 * it, so `header.logo` was null and the site rendered its empty `<span class="sdl-logo">`
 * fallback — a logo-shaped hole in the header.
 */
const BRAND_LOGO_FILE = 'sdl-logo.svg'

async function seedHeader(payload: Payload, pageIds: Map<string, number>): Promise<void> {
  const menus = arr('index', 'MENUS')
  const logoId = await uploadDesignAsset(payload, BRAND_LOGO_FILE, 'Social DNA Labs')
  await payload.updateGlobal({
    slug: 'header',
    overrideAccess: true,
    data: {
      logoAlt: 'Social DNA Labs',
      ...(logoId ? { logo: logoId } : {}),
      megaMenuEnabled: true,
      cta: anchorCta("Let's talk"),
      menuItems: menus.map((menu) => {
        const subItems = ((menu.items as Loose[] | undefined) ?? []).map((item) => ({
          title: String(item.title ?? ''),
          desc: String(item.desc ?? ''),
          iconKey: ICON_KEY[String(item.title ?? '')],
          link:
            INSIGHTS_MENU_LINKS[String(item.title ?? '')]
              ? routeLink(String(item.title ?? ''), INSIGHTS_MENU_LINKS[String(item.title ?? '')]!)
              : link(String(item.title ?? ''), item.href as string | undefined, pageIds),
        }))
        const cta = menu.cta as Loose | undefined
        const isInsights = String(menu.key ?? menu.label ?? '').toLowerCase() === 'insights'
        return {
          label: String(menu.label ?? ''),
          key: String(menu.key ?? menu.label ?? '').toLowerCase(),
          link: isInsights
            ? routeLink(String(menu.label ?? 'Insights'), '/insights')
            : link(String(menu.label ?? ''), menu.href as string | undefined, pageIds),
          subItems,
          submenuCTA: cta
            ? isInsights
              ? routeLink(String(cta.label ?? 'Explore insights'), '/insights')
              : link(String(cta.label ?? 'Explore'), cta.href as string | undefined, pageIds)
            : undefined,
        }
      }),
    } as never,
  })
  payload.logger.info('header seeded')
}

async function seedFooter(payload: Payload, pageIds: Map<string, number>): Promise<void> {
  const cols = arr('index', 'FOOTER_COLS')
  // Same omission as the header, and the same empty-space symptom at the foot of every page.
  const logoId = await uploadDesignAsset(payload, BRAND_LOGO_FILE, 'Social DNA Labs')
  await payload.updateGlobal({
    slug: 'footer',
    overrideAccess: true,
    data: {
      logoAlt: 'Social DNA Labs',
      ...(logoId ? { logo: logoId } : {}),
      tagline: 'Technology, experience and AI for businesses building what comes next.',
      bottomRightText: 'Business impact, by design.',
      copyrightText: '© {year} Social DNA Labs',
      columns: cols.map((col) => ({
        title: String(col.title ?? ''),
        links: ((col.links as Loose[] | undefined) ?? []).map((l) => ({
          link: link(String(l.label ?? ''), l.href as string | undefined, pageIds),
        })),
      })),
      socialLinks: [{ platform: 'linkedin', url: 'https://www.linkedin.com/company/social-dna-labs/' }],
    } as never,
  })
  payload.logger.info('footer seeded')
}

async function seedSiteSettings(payload: Payload): Promise<void> {
  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      siteName: 'Social DNA Labs',
      siteTagline: 'Business impact, by design.',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      legalName: 'Social DNA Labs',
      defaultMetaDescription:
        'Harness AI, technology and experience to move faster, build better and create measurable business impact.',
      linkedinUrl: 'https://www.linkedin.com/company/social-dna-labs/',
    } as never,
  })
  payload.logger.info('site-settings seeded')
}

// ── content collections ───────────────────────────────────────────────────────

async function seedServices(payload: Payload, pageIds: Map<string, number>): Promise<void> {
  const pillars = arr('index', 'PILLARS')
  const slugFor: Record<string, string> = {
    'AI transformation': 'ai-transformation',
    'Digital engineering': 'digital-engineering',
    'Business transformation': 'business-transformation',
    'Digital experience': 'digital-experience',
    'Growth transformation': 'growth-transformation',
    // The sixth home-page card. Its detail page is EVOQ, which sits at the site root.
    'Products & platforms': 'products-and-platforms',
  }

  let order = 10
  for (const pillar of pillars) {
    const title = String(pillar.title ?? '')
    const slug = slugFor[title]
    if (!slug) continue
    const pageId = pageIds.get(slug === 'products-and-platforms' ? '/evoq' : `/services/${slug}`)
    const cta = pillar.cta as Loose | undefined
    await upsertBySlug(
      payload,
      'services',
      slug,
      {
        title,
        tagline: String(pillar.tagline ?? ''),
        shortDesc: String(pillar.desc ?? ''),
        tags: (pillar.tags as string[] | undefined) ?? [],
        iconKey: ICON_KEY[title],
        motifKey: MOTIF_KEY[title],
        order,
        page: pageId,
        cta: cta ? link(String(cta.label ?? ''), cta.href as string | undefined, pageIds) : undefined,
      },
      true,
    )
    order += 10
  }
  payload.logger.info(`services seeded: ${pillars.length}`)
}

/**
 * Insights and their categories.
 *
 * The two pages carrying a carousel show DIFFERENT articles in the design: index.html's INSIGHTS
 * is placeholder copy ("Add a strong recent AI or technology article" — Appendix C Q1 flags real
 * articles as pending client input), while services.html's already names real perspectives. Both
 * sets are seeded, and each page's carousel references its own set, so each renders exactly what
 * its design page shows. Returns each set's ids in design order.
 */
/**
 * The EVOQ application modules, as the `products` facet on the insights index.
 *
 * Taken from the design's own EVOQ_PRODUCTS rather than invented, so the filter list and the
 * EVOQ page can never disagree about what the product suite contains.
 */
async function seedProducts(payload: Payload): Promise<number[]> {
  const products = (DESIGN.evoq?.EVOQ_PRODUCTS as Loose[] | undefined) ?? []
  const ids: number[] = []

  let order = 10
  for (const product of products) {
    const label = String(product.title ?? '').trim()
    if (!label) continue
    const id = await upsertBySlug(payload, 'products', slug(label), {
      label,
      shortDesc: String(product.desc ?? ''),
      order,
    })
    ids.push(id)
    order += 10
  }

  payload.logger.info(`products seeded: ${ids.length}`)
  return ids
}

/**
 * The four content types, spread across the seeded articles.
 *
 * The design ships one card shape and calls everything a blog, but the index filters on `kind`,
 * and a facet list where three of four options are permanently (0) cannot be judged — by the
 * client or by us. This gives every filter something to return without inventing articles: the
 * same real content, labelled across the four types the nav already promises.
 */
const KIND_CYCLE = ['blog', 'blog', 'case-study', 'blog', 'whitepaper', 'blog', 'featured-project'] as const

async function seedInsightsAndCategories(payload: Payload): Promise<{ home: number[]; services: number[] }> {
  const sets = { home: arr('index', 'INSIGHTS'), services: arr('services', 'INSIGHTS') }
  const cats = [...new Set([...sets.home, ...sets.services].map((i) => String(i.cat ?? '')).filter(Boolean))]

  const catIds = new Map<string, number>()
  let order = 10
  for (const label of cats) {
    const catSlug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const id = await upsertBySlug(payload, 'insight-categories', catSlug, { label, order })
    catIds.set(label, id)
    order += 10
  }

  /*
   * The facet targets are read back rather than threaded in as arguments, so this stays
   * independent of the order seedServices/seedProducts happen to run in. Both are already
   * seeded by the time seedDesign reaches here.
   */
  const [serviceDocs, productDocs] = await Promise.all([
    payload.find({ collection: 'services', limit: 50, depth: 0, sort: 'order', overrideAccess: true }),
    payload.find({ collection: 'products', limit: 50, depth: 0, sort: 'order', overrideAccess: true }),
  ])
  const serviceList = serviceDocs.docs as { id: number; title: string }[]
  const productList = productDocs.docs as { id: number; label: string }[]

  const swatchCycle = ['success', 'attention', 'accent']
  const ids = { home: [] as number[], services: [] as number[] }
  let dayOffset = 0
  for (const key of ['home', 'services'] as const) {
    let i = 0
    for (const insight of sets[key]) {
      const title = String(insight.title ?? '')
      const insightSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
      // Only half the design's cards have a `thumb` — the rest fall back to the solid swatch,
      // exactly as the design itself does.
      const thumbMatch = typeof insight.thumb === 'string' ? /url\(([^)]+)\)/.exec(insight.thumb) : null
      const thumbnailId = thumbMatch
        ? await uploadDesignAsset(payload, thumbMatch[1]!.replace(/^assets\//, ''), title)
        : undefined
      /*
       * Facets, assigned deterministically from the article's position rather than at random,
       * so re-running the seed does not reshuffle which article sits under which filter.
       * Two services and one or two products each: enough overlap that combining facets
       * genuinely narrows the list, which is the behaviour worth testing.
       */
      const categoryLabel = String(insight.cat ?? '').trim()
      const pickedServices = serviceList.length
        ? [serviceList[dayOffset % serviceList.length]!, serviceList[(dayOffset + 2) % serviceList.length]!]
            .filter((service, index, all) => all.findIndex((s) => s.id === service.id) === index)
        : []
      const pickedProducts = productList.length
        ? [productList[dayOffset % productList.length]!]
            .concat(dayOffset % 3 === 0 ? [productList[(dayOffset + 4) % productList.length]!] : [])
            .filter((product, index, all) => all.findIndex((p) => p.id === product.id) === index)
        : []

      const id = await upsertBySlug(
        payload,
        'insights',
        insightSlug,
        {
          title,
          kind: KIND_CYCLE[dayOffset % KIND_CYCLE.length],
          readTime: String(insight.readTime ?? ''),
          category: catIds.get(categoryLabel),
          swatch: swatchCycle[i % swatchCycle.length],
          ...(thumbnailId ? { thumbnail: thumbnailId } : {}),
          services: pickedServices.map((service) => service.id),
          products: pickedProducts.map((product) => product.id),
          tags: [categoryLabel, ...pickedServices.map((service) => service.title)].filter(Boolean),
          featured: i < 3,
          publishedAt: new Date(Date.now() - dayOffset * 86_400_000).toISOString(),
        },
        true,
      )
      ids[key].push(id)
      i += 1
      dayOffset += 1
    }
  }
  payload.logger.info(`insights seeded: ${ids.home.length} home + ${ids.services.length} services, ${cats.length} categories`)
  return ids
}

async function seedClientsAndTestimonials(payload: Payload): Promise<void> {
  const logos = (DESIGN.index?.CLIENT_LOGOS as string[] | undefined) ?? []
  let uploadedLogos = 0
  for (let i = 0; i < logos.length; i += 1) {
    const name = `Client ${i + 1}`
    const relativePath = logos[i]!.replace(/^assets\//, '')
    const logoId = await uploadDesignAsset(payload, relativePath, 'Client logo')

    const existing = await payload.find({
      collection: 'clients',
      where: { name: { equals: name } },
      limit: 1,
      overrideAccess: true,
    })
    if (!logoId) {
      // `logo` is required; skip creation until a real asset exists rather than fabricate one.
      if (!existing.docs.length) payload.logger.info(`clients: "${name}" needs a logo upload — skipped`)
      continue
    }
    const data = { name, logo: logoId, featured: true, order: 10 + i * 10 }
    if (existing.docs[0]) {
      await payload.update({
        collection: 'clients',
        id: (existing.docs[0] as { id: number }).id,
        data,
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'clients', data, overrideAccess: true })
    }
    uploadedLogos += 1
  }
  payload.logger.info(`clients seeded: ${uploadedLogos}/${logos.length}`)

  const testimonials = arr('index', 'TESTIMONIALS')
  let order = 10
  for (const t of testimonials) {
    const name = String(t.name ?? '')
    const avatarPath = typeof t.avatar === 'string' ? t.avatar.replace(/^assets\//, '') : undefined
    const avatarId = avatarPath ? await uploadDesignAsset(payload, avatarPath, name) : undefined

    const existing = await payload.find({
      collection: 'testimonials',
      where: { name: { equals: name } },
      limit: 1,
      overrideAccess: true,
    })
    const data = {
      name,
      role: String(t.role ?? ''),
      designation: t.designation ? String(t.designation) : undefined,
      quote: String(t.quote ?? ''),
      rating: typeof t.rating === 'number' ? t.rating : 5,
      ...(avatarId ? { avatar: avatarId } : {}),
      featured: true,
      order,
    }
    if (existing.docs[0]) {
      await payload.update({
        collection: 'testimonials',
        id: (existing.docs[0] as { id: number }).id,
        data,
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'testimonials', data, overrideAccess: true })
    }
    order += 10
  }
  payload.logger.info(`testimonials seeded: ${testimonials.length}`)
}

// ── page layouts ──────────────────────────────────────────────────────────────

const settings = (overrides: Loose = {}): Loose => ({
  background: 'default',
  spacing: 'default',
  reveal: true,
  hidden: false,
  ...overrides,
})

/** Everything a layout needs that the seed creates first: pages, forms, insights, uploaded art. */
type LayoutContext = {
  pageIds: Map<string, number>
  formId?: number
  servicesFormId?: number
  homeInsightIds: number[]
  servicesInsightIds: number[]
  assets: Partial<Record<'evoqHero' | 'evoqLogo' | 'zohoLogo' | 'salesforceLogo', number>>
}

function heroBlock(spec: PageSpec, hero: HeroCopy, primaryCta: Loose, secondaryCta?: Loose, extra: Loose = {}): Loose {
  return {
    blockType: 'hero',
    kicker: hero.kicker,
    headingLines: hero.lines,
    sub: hero.sub,
    primaryCTA: primaryCta,
    secondaryCTA: secondaryCta,
    visualKey: spec.heroVisual,
    ...extra,
    settings: settings(),
  }
}

/** The "talk to us" CTA for a page's hero/CTA banner — see `contactLink`'s doc for why this
 * differs between home/services (their own #contact section) and everything else. */
const talkToUsCta = (spec: PageSpec, label: string): Loose =>
  spec.template === 'home' || spec.template === 'services' ? anchorCta(label) : contactLink(label)

const ctaBanner = (
  spec: PageSpec, kicker: string, title: string, sub: string, ctaLabel: string,
  /** True only for the four engineering sub-service pages — see `CtaBannerBlock.titleAsHeading`. */
  titleAsHeading = false,
): Loose => ({
  blockType: 'cta-banner',
  variant: 'card',
  titleAsHeading,
  kicker,
  title,
  sub,
  cta: talkToUsCta(spec, ctaLabel),
  settings: settings({ anchorId: spec.template === 'home' || spec.template === 'services' ? 'contact' : undefined }),
})

/** The case study's closing link reads differently page to page in the design. */
const CASE_CTA_LABEL: Record<string, string> = {
  'ai-transformation': 'View case study',
  'business-transformation': 'View case study',
  'digital-engineering': 'View project',
  'digital-experience': 'View project',
  'growth-transformation': 'View project',
  'web-application-engineering': 'View project',
  'cloud-engineering': 'View case study',
  'mobile-engineering': 'View case study',
  'quality-engineering': 'View case study',
  'zoho-consulting-implementation': 'View case study',
  'salesforce-implementation': 'View case study',
}

const caseStudyBlock = (
  file: string,
  copy: {
    caseKicker: string; caseSectionTitle: string; caseSectionSub?: string
    caseTitle: string; caseBlocks: { label: string; text: string }[]
  },
  background: 'white' | 'alt' = 'alt',
): Loose => ({
  blockType: 'case-study',
  kicker: copy.caseKicker,
  title: copy.caseSectionTitle,
  sub: copy.caseSectionSub ?? '',
  source: 'inline',
  inline: {
    caseTitle: copy.caseTitle,
    tag: 'Sample case study',
    blocks: copy.caseBlocks,
  },
  mockKey: file,
  cta: anchorCta(CASE_CTA_LABEL[file] ?? 'View case study', 'contact'),
  settings: settings({ background }),
})

/**
 * The icon registry key tools/design-extract/gen-registries.mjs assigned to each design item,
 * mirrored here because the two apps share no code. A key is the item title's slug; where two
 * pages give one title different artwork, the later item is namespaced by its array prefix
 * (quality engineering's "Reliable releases" → `qe-reliable-releases`).
 */
const ITEM_ICON_KEYS = (() => {
  const icons = new Map<string, string>()
  const byItem = new Map<string, string>()
  for (const [page, data] of Object.entries(DESIGN)) {
    for (const [k, v] of Object.entries((data.ICONS as Record<string, string> | undefined) ?? {})) icons.set(slug(k), v)
    for (const [name, list] of Object.entries(data)) {
      if (!Array.isArray(list) || !/_VALUE_ITEMS$|_CAPABILITIES$|_TECH_GROUPS$|EVOQ_PRODUCTS/.test(name)) continue
      list.forEach((item: Loose, index: number) => {
        if (!item || typeof item !== 'object' || !item.icon) return
        const base = slug(String(item.title ?? item.label))
        if (icons.has(base) && icons.get(base) !== item.icon) {
          const namespaced = `${slug(name.split('_')[0]!)}-${base}`
          icons.set(namespaced, String(item.icon))
          byItem.set(`${page}:${name}:${index}`, namespaced)
          return
        }
        icons.set(base, String(item.icon))
        byItem.set(`${page}:${name}:${index}`, base)
      })
    }
  }
  return byItem
})()
const itemIconKey = (file: string, arrayName: string | undefined, index: number): string | undefined =>
  arrayName ? ITEM_ICON_KEYS.get(`${file}:${arrayName}:${index}`) : undefined

/** The sub-service "why it matters" pills: `shift-<label>`, except where two pages' artwork differs. */
const PILL_ICON_KEY_OVERRIDES: Record<string, string> = {
  'quality-engineering:Reliable': 'qe-shift-reliable',
}
const pillIconKey = (file: string, label: string) =>
  PILL_ICON_KEY_OVERRIDES[`${file}:${label}`] ?? `shift-${slug(label)}`

const keyOf = (file: string, pattern: RegExp) => Object.keys(DESIGN[file] ?? {}).find((k) => pattern.test(k))

// ── business transformation additions ─────────────────────────────────────────

const BT_PLATFORMS = {
  kicker: 'SaaS & business platforms',
  title: 'Use the right platform. Make it work for your business.',
  sub: 'Business platforms can accelerate transformation when they are configured around the way the business actually operates. Bring together implementation, customization, integration, migration and automation to make SaaS platforms part of a connected business environment.',
  platforms: [
    {
      asset: 'zohoLogo' as const, logoSize: 'default', badge: 'Official Zoho Consulting Partner',
      title: 'Zoho consulting & implementation',
      desc: 'Implement, customize and integrate Zoho applications around business processes, workflows and operational requirements.',
      linkLabel: 'Explore Zoho consulting & implementation', href: 'zoho-consulting-implementation.html',
    },
    {
      asset: 'salesforceLogo' as const, logoSize: 'compact', badge: undefined,
      title: 'Salesforce implementation',
      desc: 'Configure, customize and integrate Salesforce around customer processes, business workflows and the systems already supporting the business.',
      linkLabel: 'Explore Salesforce implementation', href: 'salesforce-implementation.html',
    },
  ],
}

const BT_TECH_FIT = {
  kicker: 'Technology that fits the business',
  lead: 'Transformation does not always mean replacing everything.',
  paragraphs: [
    'Sometimes the right answer is to modernize an existing application. Sometimes it is introducing a new business system. Sometimes it is connecting several systems so they work better together.',
    'The approach should fit the business, its existing technology and where it needs to go next.',
  ],
  ctaLabel: 'Explore digital engineering', href: 'digital-engineering.html',
}

// ── SaaS platform pages ───────────────────────────────────────────────────────

type PlatformCopy = {
  hero: HeroCopy
  logoAsset: 'zohoLogo' | 'salesforceLogo'
  narrativeKicker: string; narrativeLead: string; narrativeParagraphs: string[]
  capKicker: string; capTitle: string
  categoryKicker: string; categoryTitle: string; categoryAnchor: string
  valueKicker: string; valueTitle: string; valueSub?: string; valueColumns: 'one' | 'two'
  caseKicker: string; caseSectionTitle: string; caseTitle: string
  caseBlocks: { label: string; text: string }[]
  ctaKicker: string; ctaTitle: string; ctaSub: string; ctaLabel: string
}

const PLATFORM_COPY: Record<string, PlatformCopy> = {
  'zoho-consulting-implementation': {
    hero: {
      kicker: 'Zoho consulting & implementation',
      lines: [{ before: 'Make Zoho work the' }, { before: 'way ', accent: 'your business does.' }],
      sub: 'Implement, customize and integrate Zoho applications around your processes, teams and business goals, creating a more connected and efficient way to work.',
      primary: 'Talk to a Zoho expert', secondary: 'Explore Zoho services',
    },
    logoAsset: 'zohoLogo',
    narrativeKicker: 'More than implementation',
    narrativeLead: "Getting value from Zoho depends on how it's configured, not just that it's installed.",
    narrativeParagraphs: [
      'Zoho gives businesses a broad portfolio of applications. Getting value from that portfolio depends on how those applications are configured, connected and adapted to the way the business operates.',
      'From CRM and finance to service, automation and collaboration, build a Zoho environment around actual business requirements rather than forcing processes into standard configurations.',
    ],
    capKicker: 'Zoho services', capTitle: 'From setup to a platform that fits.',
    categoryKicker: 'Zoho applications', categoryTitle: 'Bring the right Zoho apps together.', categoryAnchor: 'applications',
    valueKicker: 'Why businesses choose Zoho', valueTitle: 'One platform. Many business processes.',
    valueSub: 'Bring customer management, finance, service, projects and other business functions into a broader application ecosystem without building every capability from scratch.',
    valueColumns: 'one',
    caseKicker: 'Zoho in action', caseSectionTitle: 'Turning business requirements into working systems.',
    caseTitle: 'Turning a disconnected Zoho setup into one working environment',
    caseBlocks: [
      { label: 'Business challenge', text: 'Zoho applications were running in isolation, with duplicated data entry and manual work needed to move information between CRM, finance and service teams.' },
      { label: 'Solution', text: 'A connected Zoho environment brought CRM, finance and service applications together, with workflows and automations replacing manual handoffs.' },
      { label: 'Outcome', text: 'Less duplicate work, a shared view of the customer across teams, and a platform that could be extended as the business grew.' },
    ],
    ctaKicker: 'Start a conversation', ctaTitle: 'Have Zoho in place or considering a move?',
    ctaSub: "Let's discuss what you need the platform to do for your business.", ctaLabel: 'Talk to a Zoho expert',
  },

  'salesforce-implementation': {
    hero: {
      kicker: 'Salesforce implementation',
      lines: [{ before: 'Turn Salesforce into a' }, { accent: 'better way to work.' }],
      sub: 'Configure, customize and integrate Salesforce around customer processes, sales operations and the systems that support your business.',
      primary: 'Talk to a Salesforce expert', secondary: 'Explore Salesforce services',
    },
    logoAsset: 'salesforceLogo',
    narrativeKicker: 'Salesforce should fit the customer journey',
    narrativeLead: 'Salesforce can provide a powerful foundation, but it needs to reflect how teams actually sell, serve and engage.',
    narrativeParagraphs: [
      'Salesforce can provide a powerful foundation for customer management, but the platform needs to reflect how teams actually sell, serve and engage with customers.',
      'The right implementation brings processes, data, workflows and integrations together so Salesforce becomes part of the way the business operates, rather than another system teams have to work around.',
    ],
    capKicker: 'Salesforce services', capTitle: 'From CRM requirements to a working platform.',
    categoryKicker: 'Salesforce capabilities', categoryTitle: 'Put customer information to work.', categoryAnchor: 'capabilities',
    valueKicker: 'Where implementation creates value', valueTitle: 'What a better Salesforce implementation should deliver.',
    valueColumns: 'two',
    caseKicker: 'Salesforce in action', caseSectionTitle: 'Experience that translates into implementation.',
    caseTitle: 'Turning a fragmented sales process into one Salesforce platform',
    caseBlocks: [
      { label: 'Business challenge', text: 'Customer and sales data lived across spreadsheets and disconnected tools, with inconsistent pipelines and no shared view of accounts.' },
      { label: 'What was implemented', text: 'A Salesforce implementation covering accounts, sales pipelines and service cases, with automated workflows and reporting built around how the teams actually sell.' },
      { label: 'Outcome', text: 'A single view of the customer, less manual data entry, and clearer visibility into pipeline and performance for managers.' },
    ],
    ctaKicker: 'Start a conversation', ctaTitle: 'Getting more from Salesforce?',
    ctaSub: "Let's look at what's working, what's getting in the way and what could work better.", ctaLabel: 'Talk to a Salesforce expert',
  },
}

function buildLayout(spec: PageSpec, ctx: LayoutContext): Loose[] {
  const f = String(spec.file)
  const { pageIds } = ctx
  let blocks: (Loose | null)[]

  if (spec.template === 'home') {
    const c = HOME_COPY
    blocks = [
      heroBlock(spec, c.hero, anchorCta(c.hero.primary), anchorCta(c.hero.secondary!, 'capabilities')),
      {
        blockType: 'approach-steps',
        kicker: 'Our approach',
        title: c.approachTitle,
        steps: c.approachSteps,
        note: c.approachNote,
        settings: settings({ anchorId: 'approach' }),
      },
      {
        // Six cards: the five services and "Products & platforms" (EVOQ).
        blockType: 'capability-cards', variant: 'grid-motif',
        kicker: c.pillarsKicker, title: c.pillarsTitle, sub: c.pillarsSub,
        source: 'auto', limit: 6,
        footerLink: link('View all services', 'services.html', pageIds),
        settings: settings({ anchorId: 'capabilities' }),
      },
      {
        blockType: 'investment-ladder',
        kicker: 'Investment',
        title: c.investTitle,
        sub: c.investSub,
        steps: arr('index', 'INVEST_STEPS').map((s) => ({ title: String(s.title ?? ''), caption: String(s.caption ?? '') })),
        closing: c.investClosing,
        settings: settings({ background: 'white' }),
      },
      {
        blockType: 'split-feature',
        left: { kicker: c.aiLeftKicker, body: c.aiLeftBody, cta: link(c.aiLeftCtaLabel, 'ai-transformation.html', pageIds) },
        right: {
          title: c.aiRightTitle,
          body: c.aiRightBody,
          processItems: arr('index', 'AI_STEPS').map((s) => ({ title: String(s.title ?? ''), desc: String(s.desc ?? '') })),
        },
        settings: settings({ background: 'white', spacing: 'tight' }),
      },
      {
        blockType: 'proof',
        kicker: c.proofKicker, title: c.proofTitle, text: c.proofText, callout: c.proofCallout,
        blockTitle: c.proofBlockTitle, source: 'auto',
        clientsLink: anchorCta('View all clients', 'contact'),
        settings: settings({ anchorId: 'proof', background: 'alt' }),
      },
      {
        blockType: 'testimonials',
        kicker: c.testimonialsKicker, title: c.testimonialsTitle, source: 'auto', limit: 2,
        cta: anchorCta('View all testimonials', 'contact'),
        // The design renders this as a continuation of the Proof section above (one shared
        // <section>, no seam) rather than a section of its own — matching its background is the
        // closest this block-per-section model gets without merging the two blocks.
        settings: settings({ background: 'alt' }),
      },
      {
        blockType: 'insights-carousel',
        kicker: c.insightsKicker, title: c.insightsTitle, sub: c.insightsSub,
        source: 'manual', insights: ctx.homeInsightIds, footerText: c.insightsFooterText,
        cta: anchorCta('Explore insights', 'contact'),
        settings: settings({ anchorId: 'insights', background: 'white', spacing: 'tight' }),
      },
    ]
  } else if (spec.template === 'services') {
    const c = SERVICES_COPY
    blocks = [
      heroBlock(spec, c.hero, anchorCta(c.hero.primary), anchorCta(c.hero.secondary!, 'capabilities'), {
        trustStrip: { strong: '15+ years', rest: 'of technology delivery', second: 'AI, engineering & growth under one roof' },
      }),
      {
        // services.html writes each capability at more length than the home cards, so these are
        // the page's own copy rather than the shared Services records.
        blockType: 'capability-cards', variant: 'list-detailed',
        kicker: c.capKicker, title: c.capTitle, sub: c.capSub,
        source: 'inline',
        items: arr('services', 'PILLARS').map((p) => {
          const cta = p.cta as Loose | undefined
          return {
            title: String(p.title ?? ''),
            tagline: String(p.tagline ?? ''),
            shortDesc: String(p.desc ?? ''),
            tags: (p.tags as string[] | undefined) ?? [],
            motifKey: MOTIF_KEY[String(p.title ?? '')],
            cta: cta ? link(String(cta.label ?? ''), cta.href as string | undefined, pageIds) : undefined,
          }
        }),
        settings: settings({ anchorId: 'capabilities' }),
      },
      {
        blockType: 'process-timeline',
        kicker: c.timelineKicker, title: c.timelineTitle, sub: c.timelineSub,
        steps: arr('services', 'OPPORTUNITY_STEPS').map((s) => ({ title: String(s.title ?? ''), desc: String(s.desc ?? '') })),
        settings: settings(),
      },
      {
        blockType: 'insights-carousel',
        kicker: c.insightsKicker, title: c.insightsTitle, sub: c.insightsSub,
        source: 'manual', insights: ctx.servicesInsightIds, footerText: HOME_COPY.insightsFooterText,
        cta: anchorCta('View all insights', 'contact'),
        settings: settings({ anchorId: 'insights', background: 'white', spacing: 'tight' }),
      },
      {
        blockType: 'contact-form',
        variant: 'callout',
        kicker: 'Start a conversation',
        headingLines: [{ before: "Let's talk about ", accent: "what you're building" }],
        sub: c.contactSub,
        callout: { title: c.calloutTitle, desc: c.calloutDesc, cta: anchorCta(c.calloutCtaLabel, 'contact') },
        form: ctx.servicesFormId ?? ctx.formId,
        settings: settings({ anchorId: 'contact' }),
      },
    ]
    return blocks.filter((b): b is Loose => b !== null)
  } else if (f === 'evoq') {
    const c = EVOQ_COPY
    blocks = [
      heroBlock(spec, c.hero, anchorCta(c.hero.primary, 'products'), contactLink(c.hero.secondary!), {
        visualImage: ctx.assets.evoqHero,
      }),
      {
        // "Platform overview": the overview copy beside the architecture diagram, on dark.
        blockType: 'evoq-architecture',
        kicker: c.narrativeKicker,
        lead: c.narrativeLead,
        paragraphs: c.narrativeParagraphs.map((text) => ({ text })),
        cards: [
          { label: c.archTeamsLabel, items: c.archTeams.map((text) => ({ text })) },
          { label: c.archPlatformLabel, items: c.archPlatform.map((text) => ({ text })) },
        ],
        hub: { ...c.archHub, logo: ctx.assets.evoqLogo },
        moreLabel: c.archMore,
        integrationBadges: c.archBadges.map(([name, iconSlug]) => ({
          name,
          iconUrl: `https://cdn.simpleicons.org/${iconSlug}`,
        })),
        settings: settings(),
      },
      {
        blockType: 'product-grid',
        kicker: c.productsKicker, title: c.productsTitle, sub: c.productsSub,
        tabs: (DESIGN.evoq?.EVOQ_TAB_LIST as string[] | undefined) ?? ['All', 'Growth', 'Operations', 'People'],
        products: arr('evoq', 'EVOQ_PRODUCTS').map((p) => ({
          title: String(p.title ?? ''),
          category: String(p.category ?? ''),
          desc: String(p.desc ?? ''),
          mockKey: slug(String(p.title ?? '')),
          photoUrl: typeof p.photo === 'string' ? p.photo : undefined,
        })),
        settings: settings({ anchorId: 'products', background: 'alt' }),
      },
      {
        blockType: 'industries-grid',
        kicker: c.industriesKicker, title: c.industriesTitle, sub: c.industriesSub,
        items: arr('evoq', 'EVOQ_INDUSTRIES').map((i) => ({
          title: String(i.name ?? ''),
          imageUrl: typeof i.photo === 'string' ? i.photo : undefined,
        })),
        settings: settings({ background: 'white' }),
      },
      {
        blockType: 'integrations-showcase',
        kicker: c.integrationsKicker, title: c.integrationsTitle,
        paragraphs: c.integrationsParagraphs.map((text) => ({ text })),
        badges: arr('evoq', 'EVOQ_INTEGRATION_BADGES').map((b) => ({
          name: String(b.name ?? ''),
          iconSlug: String(b.slug ?? ''),
          left: Number(b.left ?? 50),
          top: Number(b.top ?? 50),
          large: Boolean(b.large),
        })),
        captionTitle: c.integrationsCaptionTitle,
        captionDesc: c.integrationsCaptionDesc,
        cta: { label: c.integrationsCtaLabel, type: 'external', url: '#', newTab: false },
        settings: settings({ background: 'alt' }),
      },
      ctaBanner(spec, c.ctaKicker, c.ctaTitle, c.ctaSub, c.ctaLabel),
    ]
  } else if (f === 'digital-engineering') {
    const c = DE_COPY
    const capKey = keyOf(f, /_CAPABILITIES$/)
    const valKey = keyOf(f, /_VALUE_ITEMS$/)
    const items = capKey ? arr(f, capKey) : []
    blocks = [
      heroBlock(spec, c.hero, contactLink(c.hero.primary), anchorCta(c.hero.secondary!, 'capabilities')),
      {
        blockType: 'narrative',
        kicker: c.narrativeKicker, lead: c.narrativeLead,
        paragraphs: c.narrativeParagraphs.map((text) => ({ text })),
        settings: settings({ background: 'white' }),
      },
      {
        blockType: 'capability-detail',
        variant: 'row',
        kicker: c.capKicker, title: c.capTitle,
        intro: c.capIntro.map((text) => ({ text })),
        items: items.map((it) => {
          const href = it.href as string | undefined
          const title = String(it.title ?? '')
          return {
            title,
            desc: String(it.desc ?? ''),
            // The field has no `label` sub-field (withLabel: false); Payload ignores the extra
            // key from `link()`'s return shape rather than erroring on it.
            link: href ? link(title, href, pageIds) : undefined,
          }
        }),
        crossCutting: { label: c.crossCuttingLabel, pills: c.crossCuttingPills },
        settings: settings({ anchorId: 'capabilities', background: 'alt' }),
      },
      {
        blockType: 'ai-engineering',
        kicker: c.aiKicker, title: c.aiTitle,
        paragraphs: c.aiParagraphs.map((text) => ({ text })),
        tags: (DESIGN[f]?.DE_AI_TAGS as string[] | undefined) ?? c.aiTags,
        mockKey: 'digital-engineering',
        settings: settings({ anchorId: 'ai-engineering' }),
      },
      {
        blockType: 'tech-groups',
        kicker: c.techKicker, title: c.techTitle,
        intro: c.techIntro.map((text) => ({ text })),
        groups: arr('digital-engineering', 'DE_TECH_GROUPS').map((g, i) => ({
          label: String(g.label ?? ''),
          desc: String(g.desc ?? ''),
          list: (g.list as string[] | undefined) ?? [],
          iconKey: itemIconKey(f, 'DE_TECH_GROUPS', i),
          mockType: String(g.mockType ?? 'ui'),
          metric: g.metric as Loose | undefined,
          checklist: (g.checklist as string[] | undefined) ?? [],
        })),
        settings: settings({ background: 'alt' }),
      },
      {
        blockType: 'value-grid', variant: 'de-accent-cards',
        kicker: c.valueKicker, title: c.valueTitle, sub: c.valueIntro,
        items: (valKey ? arr(f, valKey) : []).map((it, i) => ({
          title: String(it.title ?? ''),
          desc: String(it.desc ?? ''),
          iconKey: itemIconKey(f, valKey, i),
        })),
        settings: settings(),
      },
      caseStudyBlock(f, c, 'alt'),
      ctaBanner(spec, c.ctaKicker, c.ctaTitle, c.ctaSub, c.ctaLabel),
    ]
  } else if (SUB_SERVICE_COPY[f]) {
    const c = SUB_SERVICE_COPY[f]!
    const capKey = keyOf(f, /_CAPABILITIES$/)
    const valKey = keyOf(f, /_VALUE_ITEMS$/)
    const tagsKey = keyOf(f, /_AI_TAGS$/)
    blocks = [
      heroBlock(spec, c.hero, contactLink(c.hero.primary), anchorCta(c.hero.secondary!, 'capabilities')),
      {
        blockType: 'narrative',
        kicker: c.shiftKicker,
        lead: c.shiftTitle,
        paragraphs: c.shiftParagraphs.map((text) => ({ text })),
        pills: c.shiftPills.map((label) => ({ label, iconKey: pillIconKey(f, label) })),
        quote: c.shiftQuote,
        settings: settings({ background: 'white' }),
      },
      {
        blockType: 'ai-engineering',
        kicker: c.aiKicker, title: c.aiTitle,
        paragraphs: c.aiParagraphs.map((text) => ({ text })),
        tags: tagsKey ? ((DESIGN[f]?.[tagsKey] as string[] | undefined) ?? []) : [],
        mockKey: f,
        settings: settings({ anchorId: 'ai-engineering' }),
      },
      capKey
        ? {
            blockType: 'capability-detail',
            variant: 'grid',
            kicker: c.capKicker, title: c.capTitle, sub: c.capSub,
            items: arr(f, capKey).map((it, i) => ({
              title: String(it.title ?? ''),
              desc: String(it.desc ?? ''),
              iconKey: itemIconKey(f, capKey, i),
              tech: (it.tech as string[] | undefined) ?? [],
            })),
            settings: settings({ anchorId: 'capabilities', background: 'white' }),
          }
        : null,
      valKey
        ? {
            blockType: 'value-grid', variant: 'icon-cards', mockKey: f,
            kicker: c.valueKicker, title: c.valueTitle,
            items: arr(f, valKey).map((it, i) => ({
              title: String(it.title ?? ''),
              desc: String(it.desc ?? ''),
              iconKey: itemIconKey(f, valKey, i),
            })),
            settings: settings({ anchorId: 'value' }),
          }
        : null,
      caseStudyBlock(f, c, 'white'),
      ctaBanner(spec, c.ctaKicker, c.ctaTitle, c.ctaSub, c.ctaLabel, true),
    ]
  } else if (PLATFORM_COPY[f]) {
    const c = PLATFORM_COPY[f]!
    const capKey = keyOf(f, /_CAPABILITIES$/)
    const valKey = keyOf(f, /_VALUE_ITEMS$/)
    const catKey = keyOf(f, /_(APP|CAP)_CATEGORIES$/)
    blocks = [
      heroBlock(spec, c.hero, contactLink(c.hero.primary), anchorCta(c.hero.secondary!, 'services'), {
        visualImage: ctx.assets[c.logoAsset],
      }),
      {
        blockType: 'narrative',
        kicker: c.narrativeKicker, lead: c.narrativeLead,
        paragraphs: c.narrativeParagraphs.map((text) => ({ text })),
        settings: settings({ background: 'white' }),
      },
      {
        blockType: 'capability-detail',
        variant: 'accordion',
        kicker: c.capKicker, title: c.capTitle,
        items: (capKey ? arr(f, capKey) : []).map((it) => ({
          title: String(it.title ?? ''),
          tagline: it.tagline ? String(it.tagline) : undefined,
          desc: String(it.desc ?? ''),
        })),
        settings: settings({ anchorId: 'services', background: 'alt' }),
      },
      {
        blockType: 'category-grid',
        kicker: c.categoryKicker, title: c.categoryTitle,
        categories: (catKey ? arr(f, catKey) : []).map((cat) => ({
          title: String(cat.title ?? ''),
          list: String(cat.apps ?? ''),
        })),
        settings: settings({ anchorId: c.categoryAnchor, background: 'white' }),
      },
      {
        blockType: 'value-grid', variant: 'bt-timeline', columns: c.valueColumns,
        kicker: c.valueKicker, title: c.valueTitle, sub: c.valueSub,
        items: (valKey ? arr(f, valKey) : []).map((it, i) => ({
          title: String(it.title ?? ''),
          desc: String(it.desc ?? ''),
          iconKey: itemIconKey(f, valKey, i),
        })),
        settings: settings(),
      },
      caseStudyBlock(f, c, 'alt'),
      ctaBanner(spec, c.ctaKicker, c.ctaTitle, c.ctaSub, c.ctaLabel),
    ]
  } else {
    const c = SERVICE_COPY[f]
    if (!c) {
      blocks = [heroBlock(spec, { lines: [{ before: spec.title }], sub: '', primary: "Let's talk" }, contactLink("Let's talk"))]
    } else {
      const capKey = keyOf(f, /_CAPABILITIES$/)
      const valKey = keyOf(f, /_VALUE_ITEMS$/)
      const isBt = f === 'business-transformation'
      blocks = [
        heroBlock(spec, c.hero, contactLink(c.hero.primary), anchorCta(c.hero.secondary!, 'capabilities')),
        {
          blockType: 'narrative',
          kicker: c.narrativeKicker, lead: c.narrativeLead,
          paragraphs: c.narrativeParagraphs.map((text) => ({ text })),
          settings: settings({ background: 'white' }),
        },
        capKey
          ? {
              blockType: 'capability-detail',
              // Each of the four generic pages has its own distinct capability-section design:
              // ai-transformation's numbered cards with a gradient shape, business-
              // transformation's expandable accordion rows, digital-experience's tabbed
              // selector, growth-transformation's "bento" tile grid.
              variant: CAP_VARIANT_BY_PAGE[f] ?? 'grid',
              kicker: c.capKicker, title: c.capTitle,
              intro: c.capIntro.map((text) => ({ text })),
              items: arr(f, capKey).map((it) => ({
                title: String(it.title ?? ''),
                tagline: it.tagline ? String(it.tagline) : undefined,
                desc: String(it.desc ?? ''),
                // Design's own data shape: a single joined string, not a list — normalized into
                // the one-element array the shared `tech` field (hasMany text) expects.
                tech: typeof it.tech === 'string' ? [it.tech] : (it.tech as string[] | undefined),
                // Only business-transformation's items carry this — a boolean flag for a fixed
                // "Explore ↗" link the design itself points at "#" (no real destination).
                link: it.cta ? { type: 'external', url: '#', newTab: false } : undefined,
              })),
              settings: settings({ anchorId: 'capabilities', background: 'alt' }),
            }
          : null,
        isBt
          ? {
              blockType: 'platform-row',
              kicker: BT_PLATFORMS.kicker, title: BT_PLATFORMS.title, sub: BT_PLATFORMS.sub,
              platforms: BT_PLATFORMS.platforms
                .filter((p) => ctx.assets[p.asset])
                .map((p) => ({
                  logo: ctx.assets[p.asset],
                  logoSize: p.logoSize,
                  badge: p.badge,
                  title: p.title,
                  desc: p.desc,
                  link: link(p.linkLabel, p.href, pageIds),
                })),
              settings: settings({ background: 'white' }),
            }
          : null,
        valKey
          ? {
              blockType: 'value-grid',
              variant:
                f === 'growth-transformation' ? 'gt-stat-rows'
                  : f === 'digital-experience' ? 'dx-checklist'
                  : isBt ? 'bt-timeline'
                  : 'dark',
              kicker: c.valueKicker, title: c.valueTitle,
              items: arr(f, valKey).map((it, i) => ({
                title: String(it.title ?? ''),
                desc: String(it.desc ?? ''),
                iconKey: itemIconKey(f, valKey, i),
              })),
              settings: settings(),
            }
          : null,
        isBt
          ? {
              blockType: 'narrative',
              kicker: BT_TECH_FIT.kicker, lead: BT_TECH_FIT.lead,
              paragraphs: BT_TECH_FIT.paragraphs.map((text) => ({ text })),
              cta: link(BT_TECH_FIT.ctaLabel, BT_TECH_FIT.href, pageIds),
              settings: settings({ background: 'white' }),
            }
          : null,
        // Every generic service page's case study sits on the alt tint except AI's, which the
        // design keeps white.
        caseStudyBlock(f, c, f === 'ai-transformation' ? 'white' : 'alt'),
        ctaBanner(spec, c.ctaKicker, c.ctaTitle, c.ctaSub, c.ctaLabel),
      ]
    }
  }

  // Only the home page carries its own contact form in the design (plan §2.5's page-anatomy
  // table) — `services` returns its own callout-variant form early, above. Every other page's
  // "talk to us" CTAs (already wired above via `contactLink`) point cross-page at this section.
  if (ctx.formId && spec.template === 'home') {
    blocks.push({
      blockType: 'contact-form',
      variant: 'pill',
      kicker: 'Start a conversation',
      headingLines: [{ before: 'Have an outcome' }, { accent: 'in mind?' }],
      sub: HOME_COPY.contactSub,
      pillText: HOME_COPY.contactPill,
      form: ctx.formId,
      settings: settings({ anchorId: 'contact' }),
    })
  }

  return blocks.filter((b): b is Loose => b !== null)
}

// ── orchestration ─────────────────────────────────────────────────────────────

async function formIdBySlug(payload: Payload, formSlug: string): Promise<number | undefined> {
  const result = await payload.find({
    collection: 'forms',
    where: { slug: { equals: formSlug } },
    limit: 1,
    overrideAccess: true,
  })
  return (result.docs[0] as { id: number } | undefined)?.id
}

export async function seedDesign(payload: Payload): Promise<void> {
  // 1. Pages first, in parent → child order, so `parent` and `computePathname` resolve.
  const pageIds = new Map<string, number>()
  const ordered = [...PAGES].sort((a, b) => {
    const depth = (p: PageSpec) => (p.parentSlug ? (p.parentSlug === 'services' ? 1 : 2) : 0)
    return depth(a) - depth(b)
  })

  for (const spec of ordered) {
    const parentId = spec.parentSlug ? pageIds.get(pathnameOf(spec.parentSlug)) : undefined
    const id = await upsertPage(payload, spec, parentId)
    pageIds.set(pathnameFor(spec), id)
  }

  // 2. Globals and content collections (they link back to pages).
  await seedSiteSettings(payload)
  await seedHeader(payload, pageIds)
  await seedFooter(payload, pageIds)
  await seedServices(payload, pageIds)
  // Before insights: they reference both as filter facets.
  await seedProducts(payload)
  const insightIds = await seedInsightsAndCategories(payload)
  await seedClientsAndTestimonials(payload)

  // 3. The design's own artwork the layouts place: EVOQ's hero and mark, the two partner logos.
  const assets: LayoutContext['assets'] = {
    evoqHero: await uploadDesignAsset(payload, 'evoq-hero-team.png', 'A team working together at a laptop'),
    evoqLogo: await uploadDesignAsset(payload, 'evoq-logo-icon.png', 'EVOQ'),
    zohoLogo: await uploadDesignAsset(payload, 'zoho-logo.svg', 'Zoho'),
    salesforceLogo: await uploadDesignAsset(payload, 'salesforce-logo.png', 'Salesforce'),
  }

  const ctx: LayoutContext = {
    pageIds,
    formId: await formIdBySlug(payload, 'contact'),
    servicesFormId: await formIdBySlug(payload, 'services-contact'),
    homeInsightIds: insightIds.home,
    servicesInsightIds: insightIds.services,
    assets,
  }

  // 4. Now fill in each page's layout (needs services/forms/pageIds to exist for relationships).
  for (const spec of ordered) {
    const id = pageIds.get(pathnameFor(spec))
    if (!id) continue
    const layout = buildLayout(spec, ctx)
    await payload.update({
      collection: 'pages',
      id,
      data: { layout } as never,
      overrideAccess: true,
      draft: false,
    })
    await payload.update({
      collection: 'pages',
      id,
      data: { _status: 'published' } as never,
      overrideAccess: true,
      draft: false,
    })
  }

  payload.logger.info(`design seeded: ${PAGES.length} pages`)
}

function pathnameOf(slug: string): string {
  const spec = PAGES.find((p) => p.slug === slug)
  return spec ? pathnameFor(spec) : `/${slug}`
}

function pathnameFor(spec: PageSpec): string {
  if (spec.slug === 'home') return '/'
  if (!spec.parentSlug) return `/${spec.slug}`
  return `${pathnameOf(spec.parentSlug)}/${spec.slug}`
}

async function upsertPage(
  payload: Payload,
  spec: PageSpec,
  parentId: number | undefined,
): Promise<number> {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: spec.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const data: Loose = {
    title: spec.title,
    slug: spec.slug,
    parent: parentId,
    template: spec.template,
    _status: 'published',
    layout: [],
  }
  const first = existing.docs[0] as { id: number } | undefined
  if (first) {
    await payload.update({ collection: 'pages', id: first.id, data: data as never, overrideAccess: true, draft: false })
    return first.id
  }
  const created = await payload.create({ collection: 'pages', data: data as never, overrideAccess: true, draft: false })
  return (created as { id: number }).id
}
