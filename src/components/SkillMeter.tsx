import { cn } from '@/lib/utils';

interface SkillMeterProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animate?: boolean;
  className?: string;
}

export function SkillMeter({ 
  value, 
  size = 'md', 
  showLabel = true, 
  label,
  animate = true,
  className 
}: SkillMeterProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));
  
  const getLevel = () => {
    if (normalizedValue >= 70) return 'advanced';
    if (normalizedValue >= 40) return 'intermediate';
    return 'beginner';
  };

  const level = getLevel();
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const levelColors = {
    beginner: 'bg-warning',
    intermediate: 'bg-info',
    advanced: 'bg-success',
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-foreground">{label || 'Skill Level'}</span>
          <span className={cn(
            "text-xs font-medium capitalize",
            level === 'beginner' && 'text-warning',
            level === 'intermediate' && 'text-info',
            level === 'advanced' && 'text-success',
          )}>
            {normalizedValue}% • {level}
          </span>
        </div>
      )}
      <div className={cn("skill-meter", sizeClasses[size])}>
        <div 
          className={cn(
            "skill-meter-fill",
            levelColors[level],
            animate && "progress-animate"
          )}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}

interface GapIndicatorProps {
  severity: 'critical' | 'moderate' | 'minor' | 'none';
  showLabel?: boolean;
  className?: string;
}

export function GapIndicator({ severity, showLabel = true, className }: GapIndicatorProps) {
  const labels = {
    critical: 'Critical Gap',
    moderate: 'Moderate Gap',
    minor: 'Minor Gap',
    none: 'No Gap',
  };

  const classes = {
    critical: 'gap-critical',
    moderate: 'gap-moderate',
    minor: 'gap-minor',
    none: 'bg-success/10 text-success',
  };

  return (
    <span className={cn("gap-indicator", classes[severity], className)}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        severity === 'critical' && 'bg-destructive',
        severity === 'moderate' && 'bg-warning',
        severity === 'minor' && 'bg-info',
        severity === 'none' && 'bg-success',
      )} />
      {showLabel && labels[severity]}
    </span>
  );
}
