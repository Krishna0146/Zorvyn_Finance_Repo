import React from 'react';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, className, valueClassName, ...props }) => {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-4 md:p-6",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className={cn("text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 number", valueClassName)}>
            {value}
          </p>
          {trend && (
            <p className={cn(
              "text-xs sm:text-sm mt-2 font-medium",
              trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            )}>
              {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;