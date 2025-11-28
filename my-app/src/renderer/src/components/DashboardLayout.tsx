import type React from 'react'
import { Responsive, WidthProvider, type Layout } from 'react-grid-layout'
import ProductionLineChart from './ProductionLineChart'
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

const initialLayout: Layout[] = [
  {
    i: 'production-line-chart',
    x: 0,
    y: 0,
    w: 12,
    h: 16
  }
]

function DashboardLayout(): React.JSX.Element {
  const handleLayoutChange = (currentLayout: Layout[]): void => {
    // 将来可以把布局存到 localStorage 或接口
    // console.log('layout changed', currentLayout)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        padding: 0,
        boxSizing: 'border-box',
        backgroundColor: 'transparent'
      }}
    >
      <ResponsiveGridLayout
        className="layout"
        breakpoints={breakpoints}
        cols={cols}
        layouts={{ lg: initialLayout }}
        rowHeight={40}
        margin={[16, 16]}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".sa-chart-card"
      >
        <div
          key="production-line-chart"
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ProductionLineChart />
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}

export default DashboardLayout
