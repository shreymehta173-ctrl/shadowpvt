import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CareerRecommendation } from '@/hooks/useCareerGuidance';

interface CareerDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  career: CareerRecommendation | null;
  loading?: boolean;
  studentSkills?: string[];
}

export function CareerDetailDrawer({
  open,
  onOpenChange,
  career,
  loading,
  studentSkills = [],
}: CareerDetailDrawerProps) {
  if (!career && !loading) return null;

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    const format = (n: number) => `₹${(n / 100000).toFixed(1)}L`;
    if (min && max) return `${format(min)} - ${format(max)}`;
    return min ? `From ${format(min)}` : `Up to ${format(max!)}`;
  };

  const hasSkill = (skill: string) => 
    studentSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()));

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <ScrollArea className="h-full max-h-[85vh]">
          <div className="px-6 pb-8">
            {loading ? (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-24 rounded-xl" />
                  <Skeleton className="h-24 rounded-xl" />
                  <Skeleton className="h-24 rounded-xl" />
                </div>
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            ) : career ? (
              <>
                <DrawerHeader className="px-0">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                      style={{ backgroundColor: career.color ? `${career.color}20` : 'hsl(var(--primary) / 0.1)' }}
                    >
                      {career.icon || <Briefcase className="h-8 w-8 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <DrawerTitle className="text-xl sm:text-2xl">{career.career_name}</DrawerTitle>
                      <DrawerDescription className="flex flex-wrap items-center gap-2 mt-1">
                        <span>{career.industry}</span>
                        <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                          <TrendingUp className="h-3 w-3" />
                          {career.growth_rate}
                        </span>
                      </DrawerDescription>
                    </div>
                  </div>
                </DrawerHeader>

                {/* Match Score Section */}
                <div className="grid grid-cols-3 gap-3 my-6">
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="text-2xl sm:text-3xl font-bold text-primary">
                      {Math.round(career.match_score)}%
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Overall Match</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-success/5 border border-success/10">
                    <div className="text-2xl sm:text-3xl font-bold text-success">
                      {Math.round(career.skill_fit_score)}%
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Skill Fit</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 rounded-xl bg-info/5 border border-info/10">
                    <div className="text-2xl sm:text-3xl font-bold text-info">
                      {Math.round(career.interest_fit_score)}%
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Interest Fit</div>
                  </div>
                </div>

                {/* AI Explanation */}
                {career.ai_explanation && (
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Why This Career Fits You</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {career.ai_explanation}
                    </p>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Career Details */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <GraduationCap className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Education</div>
                      <div className="text-sm font-medium truncate">Bachelor's Degree</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <DollarSign className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Salary Range</div>
                      <div className="text-sm font-medium truncate">
                        {formatSalary(career.average_salary_min, career.average_salary_max)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Target className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Difficulty</div>
                      <div className="text-sm font-medium">{career.difficulty_level}/5</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <TrendingUp className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Future Scope</div>
                      <div className="text-sm font-medium">{career.future_scope_score}/10</div>
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                {career.required_skills && career.required_skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Required Skills
                    </h4>
                    <div className="space-y-2">
                      {career.required_skills.map((skill, index) => {
                        const hasIt = hasSkill(skill);
                        return (
                          <div 
                            key={index}
                            className={cn(
                              "flex items-center gap-2 p-2.5 rounded-lg text-sm transition-colors",
                              hasIt ? "bg-success/10" : "bg-muted/50"
                            )}
                          >
                            {hasIt ? (
                              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-warning shrink-0" />
                            )}
                            <span className={cn("flex-1", hasIt ? "text-success" : "text-foreground")}>
                              {skill}
                            </span>
                            {hasIt && (
                              <span className="text-xs text-success bg-success/20 px-2 py-0.5 rounded-full">
                                You have this!
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* AI Roadmap */}
                {career.ai_roadmap?.steps && career.ai_roadmap.steps.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Your Personalized Roadmap
                    </h4>
                    <div className="space-y-4">
                      {career.ai_roadmap.steps.map((step, index) => (
                        <div 
                          key={index}
                          className="relative pl-6 pb-4 border-l-2 border-primary/30 last:border-transparent last:pb-0"
                        >
                          <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-[10px] text-primary-foreground font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div className="ml-2">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{step.phase}</span>
                              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                                {step.duration}
                              </span>
                            </div>
                            {step.focus_areas && step.focus_areas.length > 0 && (
                              <div className="text-xs text-muted-foreground mb-2">
                                Focus: {step.focus_areas.join(', ')}
                              </div>
                            )}
                            {step.milestones && step.milestones.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {step.milestones.map((milestone, i) => (
                                  <span 
                                    key={i} 
                                    className="text-xs border border-border px-2 py-0.5 rounded-full"
                                  >
                                    {milestone}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
