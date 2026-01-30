import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Clock, Zap, Calendar, Save } from 'lucide-react';
import type { StudyPreferences } from '@/hooks/useStudyPlanner';

interface PreferencesFormProps {
  preferences: StudyPreferences | null;
  onSave: (prefs: Partial<StudyPreferences>) => Promise<unknown>;
}

const weekDays = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' },
];

export function PreferencesForm({ preferences, onSave }: PreferencesFormProps) {
  const [formData, setFormData] = useState({
    learning_pace: 'medium' as 'slow' | 'medium' | 'fast',
    daily_time_limit: 120,
    preferred_study_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    preferred_study_time: 'evening',
    session_duration: 45,
    break_duration: 10,
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (preferences) {
      setFormData({
        learning_pace: preferences.learning_pace || 'medium',
        daily_time_limit: preferences.daily_time_limit || 120,
        preferred_study_days: preferences.preferred_study_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        preferred_study_time: preferences.preferred_study_time || 'evening',
        session_duration: preferences.session_duration || 45,
        break_duration: preferences.break_duration || 10,
      });
    }
  }, [preferences]);

  const handleChange = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_study_days: prev.preferred_study_days.includes(day)
        ? prev.preferred_study_days.filter(d => d !== day)
        : [...prev.preferred_study_days, day],
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await onSave(formData);
    setHasChanges(false);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Study Preferences
            </CardTitle>
            <CardDescription>Customize your study schedule</CardDescription>
          </div>
          {hasChanges && (
            <Button onClick={handleSave} size="sm" className="gap-1">
              <Save className="h-4 w-4" />
              Save
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Learning Pace */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-warning" />
            Learning Pace
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {(['slow', 'medium', 'fast'] as const).map((pace) => (
              <Button
                key={pace}
                variant={formData.learning_pace === pace ? 'default' : 'outline'}
                className="capitalize"
                onClick={() => handleChange('learning_pace', pace)}
              >
                {pace === 'slow' && '🐢 '}
                {pace === 'medium' && '🚶 '}
                {pace === 'fast' && '🏃 '}
                {pace}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {formData.learning_pace === 'slow' && 'Shorter, more frequent sessions with extra revision'}
            {formData.learning_pace === 'medium' && 'Balanced sessions with regular revision'}
            {formData.learning_pace === 'fast' && 'Longer sessions with less frequent revision'}
          </p>
        </div>

        {/* Daily Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Daily Study Time (mins)
            </Label>
            <Input
              type="number"
              min={30}
              max={480}
              step={15}
              value={formData.daily_time_limit}
              onChange={(e) => handleChange('daily_time_limit', parseInt(e.target.value) || 120)}
            />
          </div>
          <div className="space-y-2">
            <Label>Preferred Time</Label>
            <Select
              value={formData.preferred_study_time}
              onValueChange={(v) => handleChange('preferred_study_time', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">🌅 Morning (6-10 AM)</SelectItem>
                <SelectItem value="afternoon">☀️ Afternoon (12-4 PM)</SelectItem>
                <SelectItem value="evening">🌆 Evening (5-8 PM)</SelectItem>
                <SelectItem value="night">🌙 Night (8-11 PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Session Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Session Length (mins)</Label>
            <Select
              value={String(formData.session_duration)}
              onValueChange={(v) => handleChange('session_duration', parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 mins (Pomodoro)</SelectItem>
                <SelectItem value="30">30 mins</SelectItem>
                <SelectItem value="45">45 mins</SelectItem>
                <SelectItem value="60">60 mins</SelectItem>
                <SelectItem value="90">90 mins</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Break Duration (mins)</Label>
            <Select
              value={String(formData.break_duration)}
              onValueChange={(v) => handleChange('break_duration', parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 mins</SelectItem>
                <SelectItem value="10">10 mins</SelectItem>
                <SelectItem value="15">15 mins</SelectItem>
                <SelectItem value="20">20 mins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Study Days */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-success" />
            Study Days
          </Label>
          <div className="flex flex-wrap gap-2">
            {weekDays.map((day) => (
              <label
                key={day.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={formData.preferred_study_days.includes(day.id)}
                  onCheckedChange={() => toggleDay(day.id)}
                />
                <span className="text-sm">{day.label}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
