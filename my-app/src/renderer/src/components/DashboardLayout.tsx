import type React from 'react'
import { useMemo, useState, useCallback, useRef } from 'react'
import { Responsive, WidthProvider, type Layout } from 'react-grid-layout'
import Header from './Header'
import ProductionLineChart from './ProductionLineChart'
import MonthlyTreemap from './MonthlyTreemap'
import StorageTanks from './StorageTanks'
import { EnergyConsumptionMonitor, RawMaterialConsumptionMonitor } from './ConsumptionMonitor'
import ProductionRingChart from './ProductionRingChart'
import YearlyDowntimeTimeline from './YearlyDowntimeTimeline'
import ProjectStatus from './ProjectStatus'
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

const CONSUMPTION_WIDGET_IDS = ['energy-consumption', 'raw-material-consumption'] as const
type ConsumptionWidgetId = (typeof CONSUMPTION_WIDGET_IDS)[number]
const MIN_WIDGET_HEIGHT = 2
const EXPANDED_CONSUMPTION_HEIGHT = 15
const MIN_CONSUMPTION_HEIGHT = MIN_WIDGET_HEIGHT

const defaultDailyLayout: Layout[] = [
  { i: 'production-line-chart', x: 0, y: 0, w: 6, h: 10 },
  { i: 'storage-tanks', x: 6, y: 0, w: 6, h: 10 },
  { i: 'energy-consumption', x: 0, y: 10, w: 6, h: 3, minH: MIN_CONSUMPTION_HEIGHT },
  { i: 'raw-material-consumption', x: 6, y: 10, w: 6, h: 3, minH: MIN_CONSUMPTION_HEIGHT },
  { i: 'production-ring-chart', x: 0, y: 16, w: 6, h: 10, minH: MIN_WIDGET_HEIGHT },
  { i: 'project-status', x: 6, y: 16, w: 6, h: 10, minH: MIN_WIDGET_HEIGHT },
  { i: 'yearly-downtime-timeline', x: 0, y: 26, w: 12, h: 7, minH: MIN_WIDGET_HEIGHT }
]

const defaultYearlyLayout: Layout[] = [{ i: 'monthly-treemap', x: 0, y: 0, w: 12, h: 10 }]

type ReportType = 'daily' | 'yearly'

const STORAGE_KEY_DAILY = 'dashboard-layout-daily'
const STORAGE_KEY_YEARLY = 'dashboard-layout-yearly'

type WidgetConstraints = Partial<Pick<Layout, 'minH' | 'minW' | 'maxH' | 'maxW'>>

const WIDGET_CONSTRAINTS: Record<string, WidgetConstraints> = {
  'energy-consumption': { minH: MIN_CONSUMPTION_HEIGHT },
  'raw-material-consumption': { minH: MIN_CONSUMPTION_HEIGHT },
  'production-ring-chart': { minH: MIN_WIDGET_HEIGHT },
  'project-status': { minH: MIN_WIDGET_HEIGHT },
  'yearly-downtime-timeline': { minH: MIN_WIDGET_HEIGHT }
}

const applyWidgetConstraints = (layout: Layout[]): Layout[] =>
  layout.map((item) => {
    const constraints = WIDGET_CONSTRAINTS[item.i]
    if (!constraints) {
      return { ...item }
    }
    return { ...item, ...constraints }
  })

const buildLayouts = (layout: Layout[]): Record<string, Layout[]> => ({
  lg: applyWidgetConstraints(layout),
  md: applyWidgetConstraints(layout),
  sm: applyWidgetConstraints(layout),
  xs: applyWidgetConstraints(layout),
  xxs: applyWidgetConstraints(layout)
})

const mergeLayoutWithDefaults = (layout: Layout[], defaultLayout: Layout[]): Layout[] => {
  const defaultItems = new Map(defaultLayout.map((item) => [item.i, item]))
  const filtered = layout.filter((item) => defaultItems.has(item.i)).map((item) => ({ ...item }))

  const existingIds = new Set(filtered.map((item) => item.i))
  defaultLayout.forEach((item) => {
    if (!existingIds.has(item.i)) {
      filtered.push({ ...item })
    }
  })

  return filtered
}

const normalizeLayouts = (
  layouts: Record<string, Layout[]>,
  defaultLayout: Layout[]
): Record<string, Layout[]> => {
  const normalized = buildLayouts(defaultLayout)

  Object.keys(normalized).forEach((breakpoint) => {
    if (layouts[breakpoint]) {
      normalized[breakpoint] = applyWidgetConstraints(
        mergeLayoutWithDefaults(layouts[breakpoint], defaultLayout)
      )
    }
  })

  return normalized
}

// 从 localStorage 加载布局
const loadLayoutFromStorage = (key: string, defaultLayout: Layout[]): Record<string, Layout[]> => {
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      const parsed = JSON.parse(saved)
      return normalizeLayouts(parsed, defaultLayout)
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
  const [expandedConsumptionWidgets, setExpandedConsumptionWidgets] = useState<
    Set<ConsumptionWidgetId>
  >(new Set())
  const isExpandingRef = useRef(false)
  // 记住每个组件在各个 Breakpoint 下的收起高度
  const collapsedHeightRef = useRef<Partial<Record<ConsumptionWidgetId, Record<string, number>>>>(
    {}
  )

  // 使用 useMemo 确保初始化只执行一次,避免重新渲染
  const initialLayouts = useMemo(
    () => loadLayoutFromStorage(STORAGE_KEY_DAILY, defaultDailyLayout),
    []
  )

  const [currentLayouts, setCurrentLayouts] = useState<Record<string, Layout[]>>(initialLayouts)

  // 当展开状态变化时,只调整对应组件的高度,保留用户的位置和宽度设置
  const handleExpandChange = useCallback(
    (widgetId: ConsumptionWidgetId, expanded: boolean): void => {
      setExpandedConsumptionWidgets((prev) => {
        const next = new Set(prev)
        if (expanded) {
          next.add(widgetId)
        } else {
          next.delete(widgetId)
        }
        return next
      })
      isExpandingRef.current = true // 标记正在展开/收起

      setCurrentLayouts((prevLayouts) => {
        const newLayouts = { ...prevLayouts }
        Object.keys(newLayouts).forEach((breakpoint) => {
          newLayouts[breakpoint] = newLayouts[breakpoint].map((item) => {
            if (item.i === widgetId) {
              const currentX = item.x
              const currentY = item.y
              const currentW = item.w
              const currentH = item.h

              if (!collapsedHeightRef.current[widgetId]) {
                collapsedHeightRef.current[widgetId] = {}
              }
              const widgetCollapsedHeights = collapsedHeightRef.current[widgetId]!

              if (expanded && widgetCollapsedHeights[breakpoint] == null) {
                widgetCollapsedHeights[breakpoint] = currentH
              }

              const collapsedHeight = widgetCollapsedHeights[breakpoint] ?? MIN_CONSUMPTION_HEIGHT

              const targetHeight = expanded ? EXPANDED_CONSUMPTION_HEIGHT : collapsedHeight

              return {
                ...item,
                x: currentX,
                y: currentY,
                w: currentW,
                h: targetHeight,
                minH: MIN_CONSUMPTION_HEIGHT,
                static: false
              }
            }
            return item
          })
        })
        // 立即保存,防止被后续的 onLayoutChange 覆盖
        saveLayoutToStorage(STORAGE_KEY_DAILY, newLayouts)
        return newLayouts
      })

      // 延迟重置标志,等待 react-grid-layout 完成布局更新
      setTimeout(() => {
        isExpandingRef.current = false
      }, 200)
    },
    []
  )

  // 当用户手动调整布局时,保存新的布局
  const handleLayoutChange = useCallback(
    (_layout: Layout[], allLayouts: Record<string, Layout[]>): void => {
      // 如果是展开/收起触发的布局变化,忽略以防止位置被重置
      if (isExpandingRef.current) {
        return
      }

      // 更新收起状态的高度记录,每个组件单独处理
      Object.keys(allLayouts).forEach((breakpoint) => {
        CONSUMPTION_WIDGET_IDS.forEach((widgetId) => {
          if (expandedConsumptionWidgets.has(widgetId)) {
            return
          }
          const item = allLayouts[breakpoint].find((i) => i.i === widgetId)
          if (item && item.h < EXPANDED_CONSUMPTION_HEIGHT) {
            if (!collapsedHeightRef.current[widgetId]) {
              collapsedHeightRef.current[widgetId] = {}
            }
            const widgetCollapsedHeights = collapsedHeightRef.current[widgetId]!
            widgetCollapsedHeights[breakpoint] = item.h
          }
        })
      })

      setCurrentLayouts(allLayouts)
      // 保存到 localStorage
      saveLayoutToStorage(STORAGE_KEY_DAILY, allLayouts)
    },
    [expandedConsumptionWidgets]
  )

  const handleEnergyExpandChange = useCallback(
    (expanded: boolean) => handleExpandChange('energy-consumption', expanded),
    [handleExpandChange]
  )
  const handleRawExpandChange = useCallback(
    (expanded: boolean) => handleExpandChange('raw-material-consumption', expanded),
    [handleExpandChange]
  )

  return (
    <ResponsiveGridLayout
      className="h-full bg-transparent"
      breakpoints={breakpoints}
      cols={cols}
      layouts={currentLayouts}
      rowHeight={40}
      margin={[16, 16]}
      draggableHandle=".sa-chart-header"
      onLayoutChange={handleLayoutChange}
      isDraggable={true}
      isResizable={true}
      useCSSTransforms={true}
      compactType={null}
      preventCollision={false}
      allowOverlap={true}
    >
      <div key="production-line-chart" style={{ display: 'flex', flexDirection: 'column' }}>
        <ProductionLineChart />
      </div>
      <div key="storage-tanks" style={{ display: 'flex', flexDirection: 'column' }}>
        <StorageTanks />
      </div>
      <div key="energy-consumption" style={{ display: 'flex', flexDirection: 'column' }}>
        <EnergyConsumptionMonitor onExpandChange={handleEnergyExpandChange} />
      </div>
      <div key="raw-material-consumption" style={{ display: 'flex', flexDirection: 'column' }}>
        <RawMaterialConsumptionMonitor onExpandChange={handleRawExpandChange} />
      </div>
      <div key="production-ring-chart" style={{ display: 'flex', flexDirection: 'column' }}>
        <ProductionRingChart />
      </div>
      <div key="project-status" style={{ display: 'flex', flexDirection: 'column' }}>
        <ProjectStatus />
      </div>
      <div key="yearly-downtime-timeline" style={{ display: 'flex', flexDirection: 'column' }}>
        <YearlyDowntimeTimeline />
      </div>
    </ResponsiveGridLayout>
  )
}

function YearlyReportGrid(): React.JSX.Element {
  // 使用 useMemo 确保初始化只执行一次
  const initialLayouts = useMemo(
    () => loadLayoutFromStorage(STORAGE_KEY_YEARLY, defaultYearlyLayout),
    []
  )

  const [currentLayouts, setCurrentLayouts] = useState<Record<string, Layout[]>>(initialLayouts)

  // 当用户手动调整布局时，保存新的布局
  const handleLayoutChange = (_layout: Layout[], allLayouts: Record<string, Layout[]>): void => {
    setCurrentLayouts(allLayouts)
    // 保存到 localStorage
    saveLayoutToStorage(STORAGE_KEY_YEARLY, allLayouts)
  }

  return (
    <ResponsiveGridLayout
      className="h-full bg-transparent"
      breakpoints={breakpoints}
      cols={cols}
      layouts={currentLayouts}
      rowHeight={40}
      margin={[16, 16]}
      draggableHandle=".sa-chart-header"
      onLayoutChange={handleLayoutChange}
      isDraggable={true}
      isResizable={true}
      useCSSTransforms={true}
      compactType={null}
      preventCollision={false}
      allowOverlap={true}
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
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground p-4 gap-4 overflow-hidden">
      <Header currentReport={currentReport} onReportChange={handleReportChange} />

      <div className="flex-1 w-full relative overflow-y-auto scrollbar-hide">
        {currentReport === 'daily' ? <DailyReportGrid /> : <YearlyReportGrid />}
      </div>
    </div>
  )
}

export default DashboardLayout
