import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, BookOpen, AlertTriangle, Target, Zap } from 'lucide-react';
import type { Weakness } from '@/hooks/useStudyPlanner';

interface WeaknessManagerProps {
  weaknesses: Weakness[];
  onAdd: (weakness: Omit<Weakness, 'id' | 'student_id' | 'is_resolved' | 'created_at'>) => Promise<unknown>;
  onRemove: (id: string) => Promise<void>;
}

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Hindi',
  'Social Science',
  'Computer Science',
  'Economics',
  'Accountancy',
  'Business Studies',
];

const priorityConfig = {
  critical: { color: 'bg-destructive text-destructive-foreground', icon: AlertTriangle },
  high: { color: 'bg-warning text-warning-foreground', icon: Target },
  medium: { color: 'bg-primary text-primary-foreground', icon: BookOpen },
  low: { color: 'bg-muted text-muted-foreground', icon: Zap },
};

export function WeaknessManager({ weaknesses, onAdd, onRemove }: WeaknessManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newWeakness, setNewWeakness] = useState<{
    subject: string;
    topic: string;
    difficulty: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    estimated_effort: number;
  }>({
    subject: '',
    topic: '',
    difficulty: 3,
    priority: 'medium',
    estimated_effort: 60,
  });

  const handleAdd = async () => {
    if (!newWeakness.subject || !newWeakness.topic) return;
    
    await onAdd(newWeakness);
    setNewWeakness({
      subject: '',
      topic: '',
      difficulty: 3,
      priority: 'medium',
      estimated_effort: 60,
    });
    setIsAdding(false);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              Focus Areas
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              Add topics you want to improve and we'll create a personalized study plan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Always visible Add Topic button - larger and more prominent */}
        <Button 
          onClick={() => setIsAdding(true)} 
          size="lg"
          disabled={isAdding}
          className="w-full gap-2 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 shadow-md"
        >
          <Plus className="h-5 w-5" />
          Add New Focus Topic
        </Button>

        {isAdding && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-primary/20 space-y-5 animate-in fade-in duration-200">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Add a Topic to Focus On
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-base font-medium">Subject</Label>
                <Select
                  value={newWeakness.subject}
                  onValueChange={(v) => setNewWeakness(prev => ({ ...prev, subject: v }))}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s} value={s} className="text-base">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">Topic</Label>
                <Input
                  placeholder="e.g., Quadratic Equations"
                  className="h-12 text-base"
                  value={newWeakness.topic}
                  onChange={(e) => setNewWeakness(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label className="text-base font-medium">Priority</Label>
                <Select
                  value={newWeakness.priority}
                  onValueChange={(v) => setNewWeakness(prev => ({ ...prev, priority: v as Weakness['priority'] }))}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical" className="text-base">🔴 Critical</SelectItem>
                    <SelectItem value="high" className="text-base">🟠 High</SelectItem>
                    <SelectItem value="medium" className="text-base">🟡 Medium</SelectItem>
                    <SelectItem value="low" className="text-base">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">Difficulty (1-5)</Label>
                <Select
                  value={String(newWeakness.difficulty)}
                  onValueChange={(v) => setNewWeakness(prev => ({ ...prev, difficulty: parseInt(v) }))}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1" className="text-base">1 - Easy</SelectItem>
                    <SelectItem value="2" className="text-base">2 - Moderate</SelectItem>
                    <SelectItem value="3" className="text-base">3 - Average</SelectItem>
                    <SelectItem value="4" className="text-base">4 - Hard</SelectItem>
                    <SelectItem value="5" className="text-base">5 - Very Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">Est. Time (mins)</Label>
                <Input
                  type="number"
                  min={15}
                  max={300}
                  className="h-12 text-base"
                  value={newWeakness.estimated_effort}
                  onChange={(e) => setNewWeakness(prev => ({ ...prev, estimated_effort: parseInt(e.target.value) || 60 }))}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" size="lg" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button size="lg" onClick={handleAdd} disabled={!newWeakness.subject || !newWeakness.topic} className="px-8">
                Add Topic
              </Button>
            </div>
          </div>
        )}

        {weaknesses.length === 0 && !isAdding ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <BookOpen className="h-10 w-10 opacity-50" />
            </div>
            <p className="text-lg font-medium mb-1">No focus topics added yet</p>
            <p className="text-sm">Click the button above to add topics you want to improve</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Your Focus Topics ({weaknesses.length})
            </h3>
            {weaknesses.map((weakness) => {
              const config = priorityConfig[weakness.priority];
              const Icon = config.icon;
              return (
                <div
                  key={weakness.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color} shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-base">{weakness.topic}</p>
                      <p className="text-sm text-muted-foreground">{weakness.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {weakness.difficulty}/5 difficulty
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      ~{weakness.estimated_effort}min
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onRemove(weakness.id)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
