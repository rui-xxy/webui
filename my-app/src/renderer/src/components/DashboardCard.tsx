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
        className={`w-full h-full flex flex-col bg-white/70 backdrop-blur-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-[24px] ${className || ""}`}
        {...props}
      >
        {(title || subtitle || headerContent) && (
          <CardHeader className="flex justify-between items-center px-6 py-5 sa-chart-header cursor-move select-none shrink-0">
            <div className="flex flex-col gap-0.5">
              {title && <h3 className="text-lg font-bold text-foreground/90 tracking-tight">{title}</h3>}
              {subtitle && <p className="text-tiny text-default-400 uppercase tracking-wider font-medium">{subtitle}</p>}
            </div>
            {headerContent && <div className="flex items-center gap-2">{headerContent}</div>}
          </CardHeader>
        )}
        <CardBody className={`flex-1 h-full overflow-hidden relative ${noPadding ? 'p-0' : 'px-6 pb-6 pt-0'}`}>
          {children}
        </CardBody>
      </Card>
    </motion.div>
  );
}
