import type React from 'react'
import { useMemo, useState, useEffect } from 'react'
import { Responsive, WidthProvider, type Layout } from 'react-grid-layout'
import Header from './Header'
import ProductionLineChart from './ProductionLineChart'
import MonthlyTreemap from './MonthlyTreemap'
import StorageTanks from './StorageTanks'
import ConsumptionMonitor from './ConsumptionMonitor'
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

const defaultDailyLayout: Layout[] = [
  { i: 'production-line-chart', x: 0, y: 0, w: 6, h: 10 },
  { i: 'storage-tanks', x: 6, y: 0, w: 6, h: 10 },
  { i: 'consumption-monitor', x: 0, y: 10, w: 6, h: 6, minH: 5 }
]

const defaultYearlyLayout: Layout[] = [
  { i: 'monthly-treemap', x: 0, y: 0, w: 12, h: 10 }
]

type ReportType = 'daily' | 'yearly'

const STORAGE_KEY_DAILY = 'dashboard-layout-daily'
const STORAGE_KEY_YEARLY = 'dashboard-layout-yearly'

const cloneLayout = (layout: Layout[]): Layout[] => layout.map((item) => ({ ...item }))

const buildLayouts = (layout: Layout[]): Record<string, Layout[]> => ({
  lg: cloneLayout(layout),
  md: cloneLayout(layout),
  sm: cloneLayout(layout),
  xs: cloneLayout(layout),
  xxs: cloneLayout(layout)
})

// 从 localStorage 加载布局
const loadLayoutFromStorage = (key: string, defaultLayout: Layout[]): Record<string, Layout[]> => {
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load layout from storage:', error)
  }
  return buildLayouts(defaultLayout)
}

// 保存布局到 localStorage
const saveLayoutToStorage = (key: string, layouts: Record<string, Layout[]>): void => {
  try {
    localStorage.setItem(key, JSON.stringify(layouts))
  } catch (error) {
    console.error('Failed to save layout to storage:', error)
  }
}

function DailyReportGrid(): React.JSX.Element {
  const [consumptionExpanded, setConsumptionExpanded] = useState(false)
  const [currentLayouts, setCurrentLayouts] = useState<Record<string, Layout[]>>(() =>
    loadLayoutFromStorage(STORAGE_KEY_DAILY, defaultDailyLayout)
  )

  // 当展开状态变化时，只调整高度，保留用户的位置和宽度设置
  const handleExpandChange = (expanded: boolean): void => {
    setConsumptionExpanded(expanded)

    setCurrentLayouts((prevLayouts) => {
      const newLayouts = { ...prevLayouts }
      Object.keys(newLayouts).forEach((breakpoint) => {
        newLayouts[breakpoint] = newLayouts[breakpoint].map((item) => {
          if (item.i === 'consumption-monitor') {
            return {
              ...item,
              h: expanded ? Math.max(item.h, 15) : Math.min(item.h, 6), // 展开时至少15行，收起时最多6行
              minH: 5
            }
          }
          return item
        })
      })
      // 保存到 localStorage
      saveLayoutToStorage(STORAGE_KEY_DAILY, newLayouts)
      return newLayouts
    })
  }

  // 当用户手动调整布局时，保存新的布局
  const handleLayoutChange = (layout: Layout[], allLayouts: Record<string, Layout[]>): void => {
    setCurrentLayouts(allLayouts)
    // 保存到 localStorage
    saveLayoutToStorage(STORAGE_KEY_DAILY, allLayouts)
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={breakpoints}
      cols={cols}
      layouts={currentLayouts}
      rowHeight={40}
      margin={[16, 16]}
      draggableHandle=".sa-chart-header"
      onLayoutChange={handleLayoutChange}
    >
      <div key="production-line-chart" style={{ display: 'flex', flexDirection: 'column' }}>
        <ProductionLineChart />
      </div>
      <div key="storage-tanks" style={{ display: 'flex', flexDirection: 'column' }}>
        <StorageTanks />
      </div>
      <div key="consumption-monitor" style={{ display: 'flex', flexDirection: 'column' }}>
        <ConsumptionMonitor onExpandChange={handleExpandChange} />
      </div>
    </ResponsiveGridLayout>
  )
}

function YearlyReportGrid(): React.JSX.Element {
  const [currentLayouts, setCurrentLayouts] = useState<Record<string, Layout[]>>(() =>
    loadLayoutFromStorage(STORAGE_KEY_YEARLY, defaultYearlyLayout)
  )

  // 当用户手动调整布局时，保存新的布局
  const handleLayoutChange = (layout: Layout[], allLayouts: Record<string, Layout[]>): void => {
    setCurrentLayouts(allLayouts)
    // 保存到 localStorage
    saveLayoutToStorage(STORAGE_KEY_YEARLY, allLayouts)
  }

  return (
    <ResponsiveGridLayout
      className="layout"
      breakpoints={breakpoints}
      cols={cols}
      layouts={currentLayouts}
      rowHeight={40}
      margin={[16, 16]}
      draggableHandle=".sa-chart-header"
      onLayoutChange={handleLayoutChange}
    >
      <div key="monthly-treemap" style={{ display: 'flex', flexDirection: 'column' }}>
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
