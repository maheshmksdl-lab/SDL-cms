import React from 'react'
import type { AdminViewServerProps, CollectionSlug, Where } from 'payload'

import { withCmsBasePath } from './adminBasePath'
import {
  ContentGrowthWidget,
  ContentStatusWidget,
  LeadsByFormWidget,
  LeadsOverTimeWidget,
  type ContentChartDoc,
  type FormOption,
  type LeadChartDoc,
} from './SdlDashboardCharts'

/**
 * The admin dashboard — the EFTMRA admin's layout (a strip of module counts over a two-column grid
 * of chart panels) filled with SDL's own modules: leads, pages, insights, services, testimonials
 * and media. Styles live in app/(payload)/admin-dashboard.css.
 *
 * Counts read with `overrideAccess`, as the reference does: the dashboard is a summary, and a role
 * that cannot open a module still sees how much is in it.
 */

type Req = AdminViewServerProps['initPageResult']['req']

type Metric = { href: string; icon: React.ReactNode; label: string; value: number }
type GraphItem = { label: string; value: number; tone: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'sky' }

/** Lucide-style outline icons, drawn inline at the reference's 22px. */
function ModuleIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const ICONS = {
  leads: (
    <ModuleIcon>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </ModuleIcon>
  ),
  pages: (
    <ModuleIcon>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </ModuleIcon>
  ),
  insights: (
    <ModuleIcon>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      <path d="M6 8h2" />
      <path d="M6 12h2" />
      <path d="M16 8h2" />
      <path d="M16 12h2" />
    </ModuleIcon>
  ),
  services: (
    <ModuleIcon>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </ModuleIcon>
  ),
  testimonials: (
    <ModuleIcon>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 12a2 2 0 0 0 2-2V8H8" />
      <path d="M14 12a2 2 0 0 0 2-2V8h-2" />
    </ModuleIcon>
  ),
  media: (
    <ModuleIcon>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </ModuleIcon>
  ),
}

function countOf(req: Req, collection: CollectionSlug, where?: Where) {
  return req.payload
    .count({ collection, overrideAccess: true, ...(where ? { where } : {}) })
    .then((result) => result.totalDocs)
}

async function getDashboardStats(req: Req) {
  const [leads, pages, insights, forms, services, testimonials, media] = await Promise.all([
    req.payload.find({
      collection: 'leads',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      select: { createdAt: true, form: true, status: true },
    }),
    req.payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      select: { createdAt: true, _status: true },
    }),
    req.payload.find({
      collection: 'insights',
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      select: { createdAt: true, publishedAt: true, _status: true },
    }),
    req.payload.find({ collection: 'forms', depth: 0, limit: 100, overrideAccess: true, select: { name: true } }),
    countOf(req, 'services'),
    countOf(req, 'testimonials'),
    countOf(req, 'media'),
  ])

  return {
    leads: leads.docs as unknown as LeadChartDoc[],
    leadsTotal: leads.totalDocs,
    pages: pages.docs as unknown as ContentChartDoc[],
    pagesTotal: pages.totalDocs,
    insights: insights.docs as unknown as ContentChartDoc[],
    insightsTotal: insights.totalDocs,
    forms: forms.docs as unknown as FormOption[],
    services,
    testimonials,
    media,
  }
}

function CountWidget({ href, icon, label, value }: Metric) {
  return (
    <a className="sdl-dashboard-count" href={href}>
      <span className="sdl-dashboard-count__icon" aria-hidden="true">
        {icon}
      </span>
      <span>
        <span className="sdl-dashboard-count__label">{label}</span>
        <strong className="sdl-dashboard-count__value">{value}</strong>
      </span>
    </a>
  )
}

const percentOf = (value: number, total: number) =>
  total ? Math.max(0, Math.min(100, Math.round((value / total) * 100))) : 0

function ContentBar({ label, value, total, tone }: GraphItem & { total: number }) {
  return (
    <div className="sdl-dashboard-bar" data-tone={tone}>
      <div className="sdl-dashboard-bar__meta">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <span className="sdl-dashboard-bar__track">
        <span className="sdl-dashboard-bar__fill" style={{ width: `${percentOf(value, total)}%` }} />
      </span>
    </div>
  )
}

function VerticalBarChart({ items }: { items: GraphItem[] }) {
  const maxValue = Math.max(1, ...items.map((item) => item.value))
  return (
    <div className="sdl-dashboard-summary-chart" role="img" aria-label="Records by module chart">
      {items.map((item) => (
        <div className="sdl-dashboard-summary-chart__item" data-tone={item.tone} key={item.label}>
          <div className="sdl-dashboard-summary-chart__bar-wrap">
            <div className="sdl-dashboard-summary-chart__bar" style={{ height: `${Math.max(8, percentOf(item.value, maxValue))}%` }}>
              {item.value}
            </div>
          </div>
          <span className="sdl-dashboard-summary-chart__label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export async function SdlDashboard(props: AdminViewServerProps) {
  const stats = await getDashboardStats(props.initPageResult.req)
  const href = (collection: string) => withCmsBasePath(`/admin/collections/${collection}`)

  const modules: Metric[] = [
    { href: href('leads'), icon: ICONS.leads, label: 'Leads', value: stats.leadsTotal },
    { href: href('pages'), icon: ICONS.pages, label: 'Pages', value: stats.pagesTotal },
    { href: href('insights'), icon: ICONS.insights, label: 'Insights', value: stats.insightsTotal },
    { href: href('services'), icon: ICONS.services, label: 'Services', value: stats.services },
    { href: href('testimonials'), icon: ICONS.testimonials, label: 'Testimonials', value: stats.testimonials },
    { href: href('media'), icon: ICONS.media, label: 'Media', value: stats.media },
  ]

  const contentItems: GraphItem[] = [
    { label: 'Pages', value: stats.pagesTotal, tone: 'sky' },
    { label: 'Insights', value: stats.insightsTotal, tone: 'blue' },
    { label: 'Services', value: stats.services, tone: 'amber' },
    { label: 'Testimonials', value: stats.testimonials, tone: 'purple' },
    { label: 'Media', value: stats.media, tone: 'green' },
    { label: 'Leads', value: stats.leadsTotal, tone: 'red' },
  ]
  const contentTotal = contentItems.reduce((sum, item) => sum + item.value, 0)

  return (
    <main className="sdl-dashboard">
      <section className="sdl-dashboard-counts" aria-label="Dashboard widgets">
        <div className="sdl-dashboard__widgets">
          {modules.map((module) => (
            <CountWidget key={module.label} {...module} />
          ))}
        </div>
      </section>

      <section className="sdl-dashboard-graphs" aria-label="Dashboard graphs">
        <div className="sdl-dashboard-panel">
          <LeadsOverTimeWidget leads={stats.leads} insights={stats.insights} />
        </div>

        <div className="sdl-dashboard-panel">
          <LeadsByFormWidget leads={stats.leads} forms={stats.forms} />
        </div>

        <div className="sdl-dashboard-panel">
          <ContentStatusWidget pages={stats.pages} insights={stats.insights} />
        </div>

        <div className="sdl-dashboard-panel">
          <ContentGrowthWidget pages={stats.pages} insights={stats.insights} />
        </div>

        <div className="sdl-dashboard-panel">
          <div className="sdl-dashboard-panel__header">
            <div>
              <p className="sdl-dashboard-widget__eyebrow">Content Mix</p>
              <h2 className="sdl-dashboard-panel__title">Records by module</h2>
            </div>
          </div>
          <VerticalBarChart items={contentItems} />
        </div>

        <div className="sdl-dashboard-panel">
          <div className="sdl-dashboard-panel__header">
            <div>
              <p className="sdl-dashboard-widget__eyebrow">Distribution</p>
              <h2 className="sdl-dashboard-panel__title">Module share</h2>
            </div>
          </div>
          <div className="sdl-dashboard-bars">
            {contentItems.map((item) => (
              <ContentBar key={item.label} {...item} total={contentTotal} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default SdlDashboard
