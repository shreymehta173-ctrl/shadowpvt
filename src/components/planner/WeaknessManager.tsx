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
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Focus Areas
            </CardTitle>
            <CardDescription>Topics you want to improve</CardDescription>
          </div>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Topic
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={newWeakness.subject}
                  onValueChange={(v) => setNewWeakness(prev => ({ ...prev, subject: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <Input
                  placeholder="e.g., Quadratic Equations"
                  value={newWeakness.topic}
                  onChange={(e) => setNewWeakness(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={newWeakness.priority}
                  onValueChange={(v) => setNewWeakness(prev => ({ ...prev, priority: v as Weakness['priority'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">🔴 Critical</SelectItem>
                    <SelectItem value="high">🟠 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty (1-5)</Label>
                <Select
                  value={String(newWeakness.difficulty)}
                  onValueChange={(v) => setNewWeakness(prev => ({ ...prev, difficulty: parseInt(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Easy</SelectItem>
                    <SelectItem value="2">2 - Moderate</SelectItem>
                    <SelectItem value="3">3 - Average</SelectItem>
                    <SelectItem value="4">4 - Hard</SelectItem>
                    <SelectItem value="5">5 - Very Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Est. Time (mins)</Label>
                <Input
                  type="number"
                  min={15}
                  max={300}
                  value={newWeakness.estimated_effort}
                  onChange={(e) => setNewWeakness(prev => ({ ...prev, estimated_effort: parseInt(e.target.value) || 60 }))}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!newWeakness.subject || !newWeakness.topic}>
                Add Topic
              </Button>
            </div>
          </div>
        )}

        {weaknesses.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No topics added yet</p>
            <p className="text-sm">Add topics you want to focus on</p>
          </div>
        ) : (
          <div className="space-y-2">
            {weaknesses.map((weakness) => {
              const config = priorityConfig[weakness.priority];
              const Icon = config.icon;
              return (
                <div
                  key={weakness.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{weakness.topic}</p>
                      <p className="text-xs text-muted-foreground">{weakness.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {weakness.difficulty}/5 difficulty
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ~{weakness.estimated_effort}min
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(weakness.id)}
                    >
                      <X className="h-4 w-4" />
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
