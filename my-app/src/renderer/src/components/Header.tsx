import React from 'react'

type ReportType = 'daily' | 'yearly'

interface HeaderProps {
  currentReport: ReportType
  onReportChange: (type: ReportType) => void
}

function Header({ currentReport, onReportChange }: HeaderProps): React.JSX.Element {
  return (
    <div className="clay-header">
      <div className="clay-grain-texture"></div>
      <div className="clay-header-content">
        {/* 雕刻标题 */}
        <div className="clay-title-section">
          <h1 className="clay-title">硫酸车间报表</h1>
        </div>

        {/* 物理形态按键 */}
        <div className="clay-controls">
          <button
            className={`clay-button clay-button-daily ${currentReport === 'daily' ? 'active' : ''}`}
            onClick={() => onReportChange('daily')}
          >
            <span className="clay-button-text">日报</span>
          </button>
          
          <button
            className={`clay-button clay-button-yearly ${currentReport === 'yearly' ? 'active' : ''}`}
            onClick={() => onReportChange('yearly')}
          >
            <span className="clay-button-text">年报</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
