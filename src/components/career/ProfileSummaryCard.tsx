import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, GraduationCap, Clock, Zap, Heart } from 'lucide-react';

interface ProfileSummaryCardProps {
  profile: {
    display_name: string;
    grade?: string | null;
    daily_study_time?: number | null;
    learning_speed?: 'slow' | 'average' | 'fast' | null;
    interests?: string[] | null;
  };
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getLearningSpeedLabel = (speed?: string | null) => {
    switch (speed) {
      case 'fast': return 'Quick Learner';
      case 'slow': return 'Steady Learner';
      default: return 'Average Pace';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
      <CardContent className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(profile.display_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{profile.display_name}</h3>
            {profile.grade && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                {profile.grade}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {profile.daily_study_time || 30} min/day
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {getLearningSpeedLabel(profile.learning_speed)}
            </span>
          </div>
        </div>

        {profile.interests && profile.interests.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Interests
            </p>
            <div className="flex flex-wrap gap-1">
              {profile.interests.slice(0, 5).map((interest, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {profile.interests.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{profile.interests.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
