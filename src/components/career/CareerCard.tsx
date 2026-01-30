import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  TrendingUp, 
  Star,
  ChevronRight,
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
}

export function CareerCard({ career, onClick }: CareerCardProps) {
  const matchPercentage = Math.round(career.match_score);
  
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-info';
    if (score >= 40) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getGrowthBadgeVariant = (rate: string) => {
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
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: career.color ? `${career.color}20` : 'hsl(var(--primary) / 0.1)' }}
          >
            {career.icon || <Briefcase className="h-6 w-6 text-primary" />}
          </div>
          <Badge variant={getGrowthBadgeVariant(career.growth_rate)} className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            {career.growth_rate}
          </Badge>
        </div>

        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {career.career_name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{career.industry}</p>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Match Score</span>
              <span className={cn("text-sm font-bold", getMatchColor(matchPercentage))}>
                {matchPercentage}%
              </span>
            </div>
            <Progress value={matchPercentage} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3 w-3 text-warning" />
              Future Scope: {career.future_scope_score}/10
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
