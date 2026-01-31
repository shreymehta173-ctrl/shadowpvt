import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  TrendingUp, 
  Star,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CareerCardProps {
  career: {
    career_id: string;
    career_name: string;
    industry: string;
    match_score: number;
    skill_fit_score: number;
    future_scope_score: number;
    growth_rate: string;
    icon?: string;
    color?: string;
  };
  onClick: () => void;
  index?: number;
}

export function CareerCard({ career, onClick, index = 0 }: CareerCardProps) {
  const matchPercentage = Math.round(career.match_score);
  
  const getMatchGradient = (score: number) => {
    if (score >= 80) return 'from-success via-success/90 to-success/80';
    if (score >= 60) return 'from-info via-info/90 to-info/80';
    if (score >= 40) return 'from-warning via-warning/90 to-warning/80';
    return 'from-muted-foreground via-muted-foreground/90 to-muted-foreground/80';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-info';
    if (score >= 40) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getGlowColor = (score: number) => {
    if (score >= 80) return 'hover:shadow-[0_0_30px_hsl(var(--success)/0.3)]';
    if (score >= 60) return 'hover:shadow-[0_0_30px_hsl(var(--info)/0.3)]';
    if (score >= 40) return 'hover:shadow-[0_0_30px_hsl(var(--warning)/0.3)]';
    return 'hover:shadow-xl';
  };

  const getGrowthBadgeStyle = (rate: string) => {
    switch (rate?.toLowerCase()) {
      case 'very high':
        return 'bg-gradient-to-r from-success to-success/80 text-success-foreground border-0';
      case 'high':
        return 'bg-gradient-to-r from-info to-info/80 text-info-foreground border-0';
      case 'moderate':
        return 'bg-gradient-to-r from-warning to-warning/80 text-warning-foreground border-0';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const isTopMatch = matchPercentage >= 80;

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-500 overflow-hidden relative",
        "border-2 border-border/40 bg-gradient-to-br from-card via-card to-muted/20",
        "hover:-translate-y-2 hover:border-primary/50",
        getGlowColor(matchPercentage),
        "fade-in-up"
      )}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
      onClick={onClick}
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-success/0 group-hover:from-primary/5 group-hover:via-accent/5 group-hover:to-success/5 transition-all duration-500" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
      
      {/* Top Match Badge */}
      {isTopMatch && (
        <div className="absolute -top-1 -right-1 z-10">
          <div className="bg-gradient-to-r from-success via-success to-success/90 text-success-foreground text-[10px] font-bold px-3 py-1.5 rounded-bl-xl rounded-tr-xl flex items-center gap-1.5 shadow-lg shadow-success/30">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Top Match
          </div>
        </div>
      )}

      <CardContent className="p-5 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
              "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
              "shadow-lg group-hover:shadow-xl",
              isTopMatch 
                ? "bg-gradient-to-br from-success/20 to-success/10 ring-2 ring-success/30" 
                : "bg-gradient-to-br from-primary/15 to-accent/10"
            )}
          >
            {career.icon || <Briefcase className={cn("h-8 w-8", isTopMatch ? "text-success" : "text-primary")} />}
          </div>
          <Badge className={cn("text-xs font-semibold shadow-sm", getGrowthBadgeStyle(career.growth_rate))}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {career.growth_rate}
          </Badge>
        </div>

        {/* Title & Industry */}
        <h3 className="font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300 line-clamp-1 text-lg">
          {career.career_name}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground line-clamp-1">{career.industry}</p>
        </div>

        {/* Match Score */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-muted/50">
                  <Target className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">Match Score</span>
              </div>
              <span className={cn("text-xl font-bold tabular-nums", getScoreColor(matchPercentage))}>
                {matchPercentage}%
              </span>
            </div>
            
            {/* Custom Progress Bar */}
            <div className="h-3 bg-muted/60 rounded-full overflow-hidden relative">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden",
                  `bg-gradient-to-r ${getMatchGradient(matchPercentage)}`
                )}
                style={{ width: `${matchPercentage}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-4 w-4 transition-all duration-300",
                      i < Math.round(career.future_scope_score / 2) 
                        ? "text-accent fill-accent" 
                        : "text-muted-foreground/30"
                    )} 
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">Future Scope</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-all duration-300">
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore</span>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
