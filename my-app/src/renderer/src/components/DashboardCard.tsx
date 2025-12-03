import { Card, CardBody, CardHeader, CardProps } from "@heroui/react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardCardProps extends Omit<CardProps, 'title'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
  headerContent?: ReactNode; // Extra content in header like buttons
  noPadding?: boolean;
}

export function DashboardCard({
  title,
  subtitle,
  children,
  className,
  headerContent,
  noPadding = false,
  ...props
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      <Card
        className={`w-full h-full flex flex-col bg-background/60 backdrop-blur-lg border border-default-200/50 shadow-sm ${className || ""}`}
        {...props}
      >
        {(title || subtitle || headerContent) && (
          <CardHeader className="flex justify-between items-center px-4 py-3 sa-chart-header cursor-move select-none shrink-0 border-b border-default-200/50">
            <div className="flex flex-col gap-1">
              {title && <h3 className="text-lg font-bold text-foreground tracking-tight">{title}</h3>}
              {subtitle && <p className="text-tiny text-default-500 uppercase tracking-wider font-medium">{subtitle}</p>}
            </div>
            {headerContent && <div className="flex items-center gap-2">{headerContent}</div>}
          </CardHeader>
        )}
        <CardBody className={`flex-1 h-full overflow-hidden relative ${noPadding ? 'p-0' : 'p-4'}`}>
          {children}
        </CardBody>
      </Card>
    </motion.div>
  );
}
