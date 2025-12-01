import React from 'react'

type ReportType = 'daily' | 'yearly'

interface HeaderProps {
  currentReport: ReportType
  onReportChange: (type: ReportType) => void
}

function Header({ currentReport, onReportChange }: HeaderProps): React.JSX.Element {
  return (
    <div className="prism-header">
      {/* 1. 背景流体极光动画层 */}
      <div className="prism-bg-blobs">
        <div className="prism-blob"></div>
        <div className="prism-blob"></div>
        <div className="prism-blob"></div>
      </div>

      {/* 2. 装饰性悬浮几何体 */}
      <div className="prism-deco prism-deco-circle"></div>
      <div className="prism-deco prism-deco-triangle"></div>

      {/* 3. 左侧标题区域 */}
      <div className="prism-content-left">
        <h1 className="prism-title">硫酸车间报表</h1>
        <div className="prism-subtitle">SULFURIC ACID WORKSHOP DASHBOARD</div>
      </div>

      {/* 4. 右侧控制按钮区域 */}
      <div className="prism-controls">
        {/* 日报按钮 */}
        <button
          className={`prism-btn prism-btn-daily ${currentReport === 'daily' ? 'active' : ''}`}
          onClick={() => onReportChange('daily')}
        >
          <span>
            {/* 太阳图标 SVG */}
            <svg
              className="prism-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            日报
          </span>
        </button>

        {/* 年报按钮 */}
        <button
          className={`prism-btn prism-btn-yearly ${currentReport === 'yearly' ? 'active' : ''}`}
          onClick={() => onReportChange('yearly')}
        >
          <span>
            {/* 星星图标 SVG */}
            <svg
              className="prism-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            年报
          </span>
        </button>
      </div>
    </div>
  )
}

export default Header
