import React from 'react'

type ReportType = 'daily' | 'yearly'

interface HeaderProps {
  currentReport: ReportType
  onReportChange: (type: ReportType) => void
}

function Header({ currentReport, onReportChange }: HeaderProps): React.JSX.Element {
  return (
    <div className="brutalist-header">
      <div className="brutalist-header-content">
        {/* 标题 */}
        <div className="brutalist-title-section">
          <h1 className="brutalist-title">硫酸车间报表</h1>
          <div className="brutalist-subtitle">SULFURIC ACID WORKSHOP</div>
        </div>

        {/* 新野兽派按钮组 */}
        <div className="brutalist-tabs">
          <button
            className={`brutalist-tab brutalist-tab-daily ${currentReport === 'daily' ? 'active' : ''}`}
            onClick={() => onReportChange('daily')}
          >
            <span className="brutalist-tab-text">日报</span>
          </button>
          <button
            className={`brutalist-tab brutalist-tab-yearly ${currentReport === 'yearly' ? 'active' : ''}`}
            onClick={() => onReportChange('yearly')}
          >
            <span className="brutalist-tab-text">年报</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
