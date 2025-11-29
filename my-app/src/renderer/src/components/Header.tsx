import React from 'react'

type ReportType = 'daily' | 'yearly'

interface HeaderProps {
  currentReport: ReportType
  onReportChange: (type: ReportType) => void
}

function Header({ currentReport, onReportChange }: HeaderProps): React.JSX.Element {
  // 调试日志：检查当前状态
  console.log('Header渲染 - 当前报表类型:', currentReport);
  
  return (
    <div className="futuristic-header">
      {/* 背景网格和视觉特效 */}
      <div className="futuristic-grid-overlay"></div>
      <div className="futuristic-scan-lines"></div>
      <div className="futuristic-chromatic-aberration"></div>
      <div className="futuristic-digital-noise"></div>
      {/* 添加额外的背景数据流效果 */}
      <div className="futuristic-data-stream"></div>
      
      {/* 十六进制代码字符串背景 */}
      <div className="futuristic-hex-code">0x4A7F9C2E</div>
      <div className="futuristic-hex-code">0xB3E81D5F</div>
      <div className="futuristic-hex-code">0x9F2C6A8B</div>
      <div className="futuristic-hex-code">0x7D4E1A9C</div>
      <div className="futuristic-hex-code">0x5C8B3E2F</div>
      
      <div className="futuristic-header-content">
        {/* 中央标题区域 */}
        <div className="futuristic-title-section">
          <h1 className="futuristic-title">
            <span className="futuristic-title-text">硫酸车间报表</span>
            <div className="futuristic-title-glow"></div>
            <div className="futuristic-title-motion-blur"></div>
            <div className="futuristic-title-pixelation"></div>
          </h1>
        </div>

        {/* 控制按钮区域 */}
        <div className="futuristic-controls">
          <div className={`futuristic-button-container ${currentReport === 'daily' ? 'active' : ''}`}>
            <button
              className="futuristic-button futuristic-button-daily"
              onClick={() => {
                console.log('点击日报按钮');
                onReportChange('daily');
              }}
            >
              <span className="futuristic-button-text">日报</span>
              <div className="futuristic-button-glow"></div>
              <div className="futuristic-button-status"></div>
            </button>
          </div>
          
          <div className={`futuristic-button-container ${currentReport === 'yearly' ? 'active' : ''}`}>
            <button
              className="futuristic-button futuristic-button-yearly"
              onClick={() => {
                console.log('点击年报按钮');
                onReportChange('yearly');
              }}
            >
              <span className="futuristic-button-text">年报</span>
              <div className="futuristic-button-glow"></div>
              <div className="futuristic-button-status"></div>
              {/* 年报按钮右上角的状态指示灯 */}
              <div className="yearly-status-indicator"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
