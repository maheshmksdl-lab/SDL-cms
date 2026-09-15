'use client'

import React, { useMemo, useState } from 'react'

/**
 * The dashboard's chart widgets — the EFTMRA admin's line/area chart and donut, drawn in plain SVG
 * and CSS (no chart library), fed with SDL's leads and content.
 */

export type LeadChartDoc = { createdAt?: string | null; form?: number | string | { id?: number | string } | null; status?: string | null }
export type ContentChartDoc = { createdAt?: string | null; publishedAt?: string | null; _status?: string | null }
export type FormOption = { id: number | string; name?: string | null }

type MonthlySeries = { color: string; label: string; values: number[] }
type DistributionItem = { color: string; key: string; label: string; value: number }

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const distributionColors = ['#2b49db', '#6a80e6', '#f5a623', '#7d56cc', '#6b7190']

function getYear(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : String(date.getFullYear())
}

function getMonthIndex(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.getMonth()
}

function countByMonth<T>(docs: T[], selectedYear: string, getDate: (doc: T) => string | null | undefined) {
  const counts = Array.from({ length: 12 }, () => 0)
  docs.forEach((doc) => {
    const value = getDate(doc)
    const month = getMonthIndex(value)
    if (month === null) return
    if (selectedYear !== 'all' && getYear(value) !== selectedYear) return
    counts[month] = (counts[month] ?? 0) + 1
  })
  return counts
}

function yearsOf(dates: (string | null | undefined)[]) {
  const values = new Set<string>([String(new Date().getFullYear())])
  dates.forEach((date) => {
    const year = getYear(date)
    if (year) values.add(year)
  })
  return Array.from(values).sort((a, b) => Number(b) - Number(a))
}

function getChartPoints(values: number[], maxValue: number, width = 620, height = 220, padding = 18) {
  return values.map((value, index) => ({
    x: padding + (index / Math.max(1, values.length - 1)) * (width - padding * 2),
    y: height - padding - (value / maxValue) * (height - padding * 2),
  }))
}

function LineAreaChart({ series, label }: { series: MonthlySeries[]; label: string }) {
  const maxValue = Math.max(1, ...series.flatMap((item) => item.values))
  const axis = [maxValue, Math.ceil(maxValue * 0.75), Math.ceil(maxValue * 0.5), Math.ceil(maxValue * 0.25)]

  return (
    <div className="sdl-dashboard-line-chart" role="img" aria-label={label}>
      <div className="sdl-dashboard-line-chart__axis" aria-hidden="true">
        {axis.map((value, index) => (
          <span key={`${value}-${index}`}>{value}</span>
        ))}
      </div>
      <div className="sdl-dashboard-line-chart__plot">
        <svg viewBox="0 0 620 220" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            {series.map((item) => (
              <linearGradient id={`sdl-area-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} x1="0" x2="0" y1="0" y2="1" key={item.label}>
                <stop offset="0%" stopColor={item.color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={item.color} stopOpacity="0.02" />
              </linearGradient>
            ))}
          </defs>
          {[0.25, 0.5, 0.75, 1].map((position) => (
            <line
              key={position}
              x1="18"
              x2="602"
              y1={18 + (220 - 36) * position}
              y2={18 + (220 - 36) * position}
              className="sdl-dashboard-line-chart__grid"
            />
          ))}
          {series.map((item) => {
            const gradientId = `sdl-area-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            const points = getChartPoints(item.values, maxValue)
            const line = points.map((point) => `${point.x},${point.y}`).join(' ')
            return (
              <g key={item.label}>
                <polygon points={`18,202 ${line} 602,202`} fill={`url(#${gradientId})`} />
                <polyline points={line} fill="none" stroke={item.color} strokeLinecap="round" strokeWidth="3" />
                {points.map((point, index) => (
                  <circle cx={point.x} cy={point.y} fill="#ffffff" key={`${item.label}-${monthLabels[index]}`} r="3.8" stroke={item.color} strokeWidth="2" />
                ))}
              </g>
            )
          })}
        </svg>
        <div className="sdl-dashboard-line-chart__months" aria-hidden="true">
          {monthLabels.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function YearFilter({ value, years, onChange }: { value: string; years: string[]; onChange: (year: string) => void }) {
  return (
    <label className="sdl-dashboard-filter">
      <span>Year</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </label>
  )
}

function Legend({ series }: { series: { color: string; label: string }[] }) {
  return (
    <div className="sdl-dashboard-chart-legend">
      {series.map((item) => (
        <span key={item.label} style={{ '--legend-color': item.color } as React.CSSProperties}>
          {item.label}
        </span>
      ))}
    </div>
  )
}

function Donut({ items, label }: { items: DistributionItem[]; label: string }) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  let progress = 0
  const stops = items
    .map((item) => {
      const from = progress
      progress += total ? (item.value / total) * 100 : 0
      return `${item.color} ${from}% ${progress}%`
    })
    .join(', ')

  return (
    <div className="sdl-dashboard-donut-layout">
      <div
        className="sdl-dashboard-donut"
        style={{ '--donut-gradient': stops || '#edf0f6 0 100%' } as React.CSSProperties}
        role="img"
        aria-label={label}
      >
        <strong>{total}</strong>
        <span>Total</span>
      </div>
      <div className="sdl-dashboard-donut-legend">
        {items.map((item) => (
          <div key={item.key} style={{ '--legend-color': item.color } as React.CSSProperties}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

const titleCase = (value: string) => value.replace(/[-_]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

/** Leads, and the content published alongside them, month by month. */
export function LeadsOverTimeWidget({ leads, insights }: { leads: LeadChartDoc[]; insights: ContentChartDoc[] }) {
  const years = useMemo(
    () => yearsOf([...leads.map((l) => l.createdAt), ...insights.map((i) => i.publishedAt ?? i.createdAt)]),
    [leads, insights],
  )
  const [year, setYear] = useState(String(new Date().getFullYear()))

  const series: MonthlySeries[] = [
    { color: '#2b49db', label: 'Leads', values: countByMonth(leads, year, (l) => l.createdAt) },
    {
      color: '#6a80e6',
      label: 'Qualified',
      values: countByMonth(
        leads.filter((l) => l.status && l.status !== 'new' && l.status !== 'spam'),
        year,
        (l) => l.createdAt,
      ),
    },
    { color: '#f5a623', label: 'Insights published', values: countByMonth(insights, year, (i) => i.publishedAt ?? i.createdAt) },
  ]

  return (
    <>
      <div className="sdl-dashboard-panel__header">
        <h2 className="sdl-dashboard-panel__title">Leads Over Time</h2>
        <YearFilter value={year} years={years} onChange={setYear} />
      </div>
      <LineAreaChart series={series} label="Leads and published insights by month" />
      <Legend series={series} />
    </>
  )
}

/** Where leads came from — one slice per form. */
export function LeadsByFormWidget({ leads, forms }: { leads: LeadChartDoc[]; forms: FormOption[] }) {
  const items = useMemo<DistributionItem[]>(() => {
    const idOf = (form: LeadChartDoc['form']) =>
      form && typeof form === 'object' ? String(form.id ?? '') : form != null ? String(form) : ''
    const counts = new Map<string, number>()
    leads.forEach((lead) => counts.set(idOf(lead.form), (counts.get(idOf(lead.form)) ?? 0) + 1))

    return forms.slice(0, distributionColors.length).map((form, index) => ({
      color: distributionColors[index]!,
      key: String(form.id),
      label: form.name || `Form ${form.id}`,
      value: counts.get(String(form.id)) ?? 0,
    }))
  }, [leads, forms])

  return (
    <>
      <div className="sdl-dashboard-panel__header">
        <h2 className="sdl-dashboard-panel__title">Leads by Form</h2>
      </div>
      <Donut items={items} label="Leads by form" />
    </>
  )
}

/** Published against draft, across pages and insights. */
export function ContentStatusWidget({ pages, insights }: { pages: ContentChartDoc[]; insights: ContentChartDoc[] }) {
  const items = useMemo<DistributionItem[]>(() => {
    const tally = (docs: ContentChartDoc[], status: string) => docs.filter((d) => (d._status ?? 'draft') === status).length
    return [
      { color: distributionColors[0]!, key: 'pages-published', label: 'Pages published', value: tally(pages, 'published') },
      { color: distributionColors[1]!, key: 'insights-published', label: 'Insights published', value: tally(insights, 'published') },
      { color: distributionColors[2]!, key: 'pages-draft', label: 'Pages in draft', value: tally(pages, 'draft') },
      { color: distributionColors[3]!, key: 'insights-draft', label: 'Insights in draft', value: tally(insights, 'draft') },
    ]
  }, [pages, insights])

  return (
    <>
      <div className="sdl-dashboard-panel__header">
        <h2 className="sdl-dashboard-panel__title">Content Status Overview</h2>
      </div>
      <Donut items={items} label="Content status" />
    </>
  )
}

/** New pages and insights added each month. */
export function ContentGrowthWidget({ pages, insights }: { pages: ContentChartDoc[]; insights: ContentChartDoc[] }) {
  const years = useMemo(() => yearsOf([...pages, ...insights].map((d) => d.createdAt)), [pages, insights])
  const [year, setYear] = useState(String(new Date().getFullYear()))

  const series: MonthlySeries[] = [
    { color: '#7d56cc', label: 'Pages', values: countByMonth(pages, year, (d) => d.createdAt) },
    { color: '#1cab68', label: 'Insights', values: countByMonth(insights, year, (d) => d.createdAt) },
  ]

  return (
    <>
      <div className="sdl-dashboard-panel__header">
        <h2 className="sdl-dashboard-panel__title">Content Growth</h2>
        <YearFilter value={year} years={years} onChange={setYear} />
      </div>
      <LineAreaChart series={series} label="Pages and insights created by month" />
      <Legend series={series} />
    </>
  )
}

export const leadStatusLabel = titleCase
