import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import '../assets/styles/project-status.css';

// Define types
type StatusType = 'progress' | 'completed' | 'delayed';

interface ProjectItem {
  id: string;
  name: string;
  manager: string;
  deadline: string;
  status: StatusType;
  budget: string;
  progress: number;
}

// Mock data
const mockData: ProjectItem[] = [
  { id: '1', name: 'ERP系统升级', manager: '张三', deadline: '2023-12-31', status: 'progress', budget: '¥500,000', progress: 65 },
  { id: '2', name: '新官网开发', manager: '李四', deadline: '2023-11-15', status: 'completed', budget: '¥200,000', progress: 100 },
  { id: '3', name: '数据中心迁移', manager: '王五', deadline: '2023-10-30', status: 'delayed', budget: '¥1,200,000', progress: 80 },
  { id: '4', name: '移动端APP重构', manager: '赵六', deadline: '2024-01-20', status: 'progress', budget: '¥350,000', progress: 40 },
  { id: '5', name: '内部OA系统', manager: '孙七', deadline: '2023-09-01', status: 'completed', budget: '¥150,000', progress: 100 },
  { id: '6', name: 'AI客服集成', manager: '周八', deadline: '2023-11-10', status: 'delayed', budget: '¥400,000', progress: 30 },
  { id: '7', name: '供应链优化', manager: '吴九', deadline: '2024-02-15', status: 'progress', budget: '¥800,000', progress: 25 },
  { id: '8', name: '财务系统维护', manager: '郑十', deadline: '2024-03-10', status: 'progress', budget: '¥100,000', progress: 10 },
];

// SVG Icons
const Icons = {
  progress: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  completed: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  delayed: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
};

const statusConfig = {
  progress: { 
    label: '进行中', 
    color: '#3b82f6', 
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    icon: Icons.progress 
  },
  completed: { 
    label: '已完成', 
    color: '#10b981', 
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    icon: Icons.completed 
  },
  delayed: { 
    label: '已延期', 
    color: '#ef4444', 
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    icon: Icons.delayed 
  },
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, icon, color, children }: ModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ borderLeft: `4px solid ${color}` }}>
          <div className="modal-title" style={{ color }}>
            <span className="modal-title-icon">{icon}</span>
            {title}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            {Icons.close}
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export const ProjectStatus = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusType | null>(null);

  const filteredData = selectedStatus 
    ? mockData.filter(item => item.status === selectedStatus)
    : [];

  return (
    <>
      <div className="sa-chart-card project-status-container">
        <div className="sa-chart-header">
          <div className="sa-chart-title-group">
            <h3 className="sa-chart-title">项目状态监控</h3>
            <p className="sa-chart-subtitle">PROJECT STATUS MONITOR</p>
          </div>
        </div>
        
        <div className="project-status-body">
          <div className="status-overview-grid">
            {(Object.keys(statusConfig) as StatusType[]).map((status) => {
              const config = statusConfig[status];
              const count = mockData.filter(item => item.status === status).length;
              
              return (
                <div 
                  key={status}
                  className={`status-item-card status-${status}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  <div className="status-header">
                    <span className="status-label">{config.label}</span>
                    <div className="status-icon-mini" style={{ color: config.color }}>
                      {config.icon}
                    </div>
                  </div>
                  <div className="status-value-group">
                    <span className="status-count" style={{ color: config.color }}>{count}</span>
                    <span className="status-unit">项</span>
                  </div>
                  <div className="status-bar-bg">
                    <div 
                      className="status-bar-fill" 
                      style={{ backgroundColor: config.color, width: '60%' }} // 模拟总体进度
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!selectedStatus}
        onClose={() => setSelectedStatus(null)}
        title={selectedStatus ? `${statusConfig[selectedStatus].label}项目列表` : ''}
        icon={selectedStatus ? statusConfig[selectedStatus].icon : null}
        color={selectedStatus ? statusConfig[selectedStatus].color : '#000'}
      >
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>项目名称</th>
                <th style={{ width: '15%' }}>负责人</th>
                <th style={{ width: '20%' }}>截止日期</th>
                <th style={{ width: '15%' }}>预算</th>
                <th style={{ width: '20%' }}>进度</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: '#1f2937' }}>{item.name}</td>
                    <td>{item.manager}</td>
                    <td style={{ fontFamily: 'monospace', color: '#6b7280' }}>{item.deadline}</td>
                    <td>{item.budget}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="progress-bar-bg">
                          <div 
                            className="progress-bar-fill"
                            style={{ 
                              width: `${item.progress}%`,
                              backgroundColor: statusConfig[item.status].color
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: '11px', width: '28px', textAlign: 'right' }}>{item.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>
                    暂无相关项目数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
};

export default ProjectStatus;
