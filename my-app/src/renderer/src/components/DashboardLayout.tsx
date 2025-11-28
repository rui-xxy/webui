import type React from 'react'
import { useMemo, useState } from 'react'
import { Responsive, WidthProvider, type Layout } from 'react-grid-layout'
import Header from './Header'
import ProductionLineChart from './ProductionLineChart'
import MonthlyTreemap from './MonthlyTreemap'
import StorageTanks from './StorageTanks'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const breakpoints = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0
}

const cols = {
  lg: 12,
  md: 12,
  sm: 12,
  xs: 6,
  xxs: 4
}

const dailyLayout: Layout[] = [
  { i: 'production-line-chart', x: 0, y: 0, w: 6, h: 10 },
  { i: 'storage-tanks', x: 6, y: 0, w: 6, h: 10 }
]

const yearlyLayout: Layout[] = [
  { i: 'monthly-treemap', x: 0, y: 0, w: 12, h: 10 }
]

type ReportType = 'daily' | 'yearly'

const cloneLayout = (layout: Layout[]): Layout[] => layout.map((item) => ({ ...item }))

const buildLayouts = (layout: Layout[]): Record<string, Layout[]> => ({
  lg: cloneLayout(layout),
  md: cloneLayout(layout),
  sm: cloneLayout(layout),
  xs: cloneLayout(layout),
  xxs: cloneLayout(layout)
})

function DailyReportGrid(): React.JSX.Element {
  const layouts = useMemo(() => buildLayouts(dailyLayout), [])

  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={breakpoints}
      cols={cols}
      layouts={layouts}
      rowHeight={40}
      margin={[16, 16]}
      draggableHandle=".sa-chart-card"
    >
      <div
        key="production-line-chart"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <ProductionLineChart />
      </div>
      <div
        key="storage-tanks"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <StorageTanks />
      </div>
    </ResponsiveGridLayout>
  )
}

function YearlyReportGrid(): React.JSX.Element {
  const layouts = useMemo(() => buildLayouts(yearlyLayout), [])

  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={breakpoints}
      cols={cols}
      layouts={layouts}
      rowHeight={40}
      margin={[16, 16]}
      draggableHandle=".sa-chart-card"
    >
      <div
        key="monthly-treemap"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <MonthlyTreemap />
      </div>
    </ResponsiveGridLayout>
  )
}

function DashboardLayout(): React.JSX.Element {
  const [currentReport, setCurrentReport] = useState<ReportType>('daily')

  const handleReportChange = (type: ReportType): void => {
    setCurrentReport(type)
  }

  return (
    <>
      <Header currentReport={currentReport} onReportChange={handleReportChange} />
      
      <div className="dashboard-content">
        {currentReport === 'daily' ? <DailyReportGrid /> : <YearlyReportGrid />}
      </div>
    </>
  )
}

export default DashboardLayout
