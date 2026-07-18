import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, type: "spring", bounce: 0.3 }}
    >
      <Card className={cn(
        "border-none shadow-md shadow-primary/5 bg-card/80 backdrop-blur-md overflow-hidden group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 relative",
        className
      )}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 transform translate-x-4 -translate-y-4">
          {React.cloneElement(icon as React.ReactElement<any>, { size: 80 })}
        </div>
        
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground tracking-tight">{title}</h3>
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
              {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{value}</h2>
            {trendValue && (
              <span className={cn(
                "text-xs font-bold px-1.5 py-0.5 rounded-md",
                trend === 'up' ? "bg-green-500/10 text-green-500" : 
                trend === 'down' ? "bg-destructive/10 text-destructive" : 
                "bg-muted text-muted-foreground"
              )}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
              </span>
            )}
          </div>
          
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-2 font-medium">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
