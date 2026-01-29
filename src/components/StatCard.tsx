import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const variantClasses = {
    default: 'bg-card',
    primary: 'bg-gradient-primary text-primary-foreground',
    success: 'bg-gradient-success text-success-foreground',
    warning: 'bg-warning/10 border-warning/20',
    danger: 'bg-destructive/10 border-destructive/20',
  };

  const iconBgClasses = {
    default: 'bg-muted',
    primary: 'bg-primary-foreground/20',
    success: 'bg-success-foreground/20',
    warning: 'bg-warning/20',
    danger: 'bg-destructive/20',
  };

  const isLightVariant = variant === 'primary' || variant === 'success';

  return (
    <div className={cn(
      "rounded-xl border p-6 transition-all duration-300 hover:shadow-lg",
      variantClasses[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            "text-sm font-medium",
            isLightVariant ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className={cn(
            "mt-2 text-3xl font-bold tracking-tight",
            isLightVariant ? "text-primary-foreground" : "text-foreground"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "mt-1 text-sm",
              isLightVariant ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trend.positive 
                ? "bg-success/10 text-success" 
                : "bg-destructive/10 text-destructive"
            )}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "rounded-lg p-3",
            iconBgClasses[variant]
          )}>
            <Icon className={cn(
              "h-6 w-6",
              isLightVariant ? "text-primary-foreground" : "text-muted-foreground"
            )} />
          </div>
        )}
      </div>
    </div>
  );
}
