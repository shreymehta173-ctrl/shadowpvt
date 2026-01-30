import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  TrendingUp, 
  Star,
  ChevronRight,
  Sparkles,
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
  
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-info';
    if (score >= 40) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-info';
    if (score >= 40) return 'bg-warning';
    return 'bg-muted-foreground';
  };

  const getGrowthBadgeVariant = (rate: string): "default" | "secondary" | "outline" => {
    switch (rate?.toLowerCase()) {
      case 'very high':
      case 'high':
        return 'default';
      case 'moderate':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 border-border/50 bg-card overflow-hidden",
        "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30",
        "animate-in fade-in-0 slide-in-from-bottom-4"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
      onClick={onClick}
    >
      <CardContent className="p-5 relative">
        {/* Top Badge for high matches */}
        {matchPercentage >= 80 && (
          <div className="absolute -top-1 -right-1">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Top Match
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: career.color ? `${career.color}20` : 'hsl(var(--primary) / 0.1)' }}
          >
            {career.icon || <Briefcase className="h-6 w-6 text-primary" />}
          </div>
          <Badge variant={getGrowthBadgeVariant(career.growth_rate)} className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            {career.growth_rate}
          </Badge>
        </div>

        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {career.career_name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{career.industry}</p>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Match Score</span>
              <span className={cn("text-sm font-bold tabular-nums", getMatchColor(matchPercentage))}>
                {matchPercentage}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-500", getProgressColor(matchPercentage))}
                style={{ width: `${matchPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3 w-3 text-warning fill-warning" />
              <span>Future Scope: {career.future_scope_score}/10</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
