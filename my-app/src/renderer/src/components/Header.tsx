import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import React from "react";

type ReportType = "daily" | "yearly";

interface HeaderProps {
  currentReport: ReportType;
  onReportChange: (type: ReportType) => void;
}

function Header({ currentReport, onReportChange }: HeaderProps): React.JSX.Element {
  return (
    <Card className="w-full bg-white/70 backdrop-blur-2xl border-none shadow-sm mb-6 rounded-[24px]">
      <CardBody className="flex flex-row items-center justify-between px-8 py-6 overflow-hidden">
        {/* Left: Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tight">
            硫酸车间报表
          </h1>
          <div className="text-[11px] text-default-400 tracking-[0.3em] uppercase font-bold">
            Sulfuric Acid Workshop Dashboard
          </div>
        </div>

        {/* Right: Controls */}
        <Tabs
          aria-label="Report Type"
          selectedKey={currentReport}
          onSelectionChange={(key) => onReportChange(key as ReportType)}
          color="primary"
          variant="solid"
          radius="full"
          classNames={{
            tabList: "bg-default-100/50 border border-default-200/50",
            cursor: "bg-gradient-to-r from-primary to-secondary shadow-lg",
            tabContent: "group-data-[selected=true]:text-primary-foreground font-medium",
          }}
        >
          <Tab
            key="daily"
            title={
              <div className="flex items-center space-x-2">
                <SunIcon />
                <span>日报</span>
              </div>
            }
          />
          <Tab
            key="yearly"
            title={
              <div className="flex items-center space-x-2">
                <StarIcon />
                <span>年报</span>
              </div>
            }
          />
        </Tabs>
      </CardBody>
    </Card>
  );
}

// Icon components
const SunIcon = () => (
  <svg
    className="w-4 h-4"
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
);

const StarIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default Header;
