import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { Settings, Clock, Zap, Calendar, Save } from 'lucide-react';
import type { StudyPreferences } from '@/hooks/useStudyPlanner';

interface PreferencesFormProps {
  preferences: StudyPreferences | null;
  onSave: (prefs: Partial<StudyPreferences>) => Promise<unknown>;
}

const weekDays = [
  { id: 'monday', en: 'Mon', hi: 'सोम' },
  { id: 'tuesday', en: 'Tue', hi: 'मंगल' },
  { id: 'wednesday', en: 'Wed', hi: 'बुध' },
  { id: 'thursday', en: 'Thu', hi: 'गुरु' },
  { id: 'friday', en: 'Fri', hi: 'शुक्र' },
  { id: 'saturday', en: 'Sat', hi: 'शनि' },
  { id: 'sunday', en: 'Sun', hi: 'रवि' },
];

export function PreferencesForm({ preferences, onSave }: PreferencesFormProps) {
  const { t, language } = useLanguage();
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
              {t('Study Preferences', 'अध्ययन प्राथमिकताएं')}
            </CardTitle>
            <CardDescription>{t('Customize your study schedule', 'अपना अध्ययन कार्यक्रम कस्टमाइज़ करें')}</CardDescription>
          </div>
          {hasChanges && (
            <Button onClick={handleSave} size="sm" className="gap-1">
              <Save className="h-4 w-4" />
              {t('Save', 'सेव करें')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Learning Pace */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-warning" />
            {t('Learning Pace', 'सीखने की गति')}
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'slow', en: 'Slow', hi: 'धीमी', emoji: '🐢' },
              { value: 'medium', en: 'Medium', hi: 'मध्यम', emoji: '🚶' },
              { value: 'fast', en: 'Fast', hi: 'तेज़', emoji: '🏃' },
            ] as const).map((pace) => (
              <Button
                key={pace.value}
                variant={formData.learning_pace === pace.value ? 'default' : 'outline'}
                onClick={() => handleChange('learning_pace', pace.value)}
              >
                {pace.emoji} {language === 'hi' ? pace.hi : pace.en}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {formData.learning_pace === 'slow' && t('Shorter, more frequent sessions with extra revision', 'अतिरिक्त पुनरावृत्ति के साथ छोटे, अधिक बार सत्र')}
            {formData.learning_pace === 'medium' && t('Balanced sessions with regular revision', 'नियमित पुनरावृत्ति के साथ संतुलित सत्र')}
            {formData.learning_pace === 'fast' && t('Longer sessions with less frequent revision', 'कम बार पुनरावृत्ति के साथ लंबे सत्र')}
          </p>
        </div>

        {/* Daily Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {t('Daily Study Time (mins)', 'दैनिक अध्ययन समय (मिनट)')}
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
            <Label>{t('Preferred Time', 'पसंदीदा समय')}</Label>
            <Select
              value={formData.preferred_study_time}
              onValueChange={(v) => handleChange('preferred_study_time', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">🌅 {t('Morning (6-10 AM)', 'सुबह (6-10 बजे)')}</SelectItem>
                <SelectItem value="afternoon">☀️ {t('Afternoon (12-4 PM)', 'दोपहर (12-4 बजे)')}</SelectItem>
                <SelectItem value="evening">🌆 {t('Evening (5-8 PM)', 'शाम (5-8 बजे)')}</SelectItem>
                <SelectItem value="night">🌙 {t('Night (8-11 PM)', 'रात (8-11 बजे)')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Session Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('Session Length (mins)', 'सत्र की अवधि (मिनट)')}</Label>
            <Select
              value={String(formData.session_duration)}
              onValueChange={(v) => handleChange('session_duration', parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 {t('mins (Pomodoro)', 'मिनट (पोमोडोरो)')}</SelectItem>
                <SelectItem value="30">30 {t('mins', 'मिनट')}</SelectItem>
                <SelectItem value="45">45 {t('mins', 'मिनट')}</SelectItem>
                <SelectItem value="60">60 {t('mins', 'मिनट')}</SelectItem>
                <SelectItem value="90">90 {t('mins', 'मिनट')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t('Break Duration (mins)', 'ब्रेक अवधि (मिनट)')}</Label>
            <Select
              value={String(formData.break_duration)}
              onValueChange={(v) => handleChange('break_duration', parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 {t('mins', 'मिनट')}</SelectItem>
                <SelectItem value="10">10 {t('mins', 'मिनट')}</SelectItem>
                <SelectItem value="15">15 {t('mins', 'मिनट')}</SelectItem>
                <SelectItem value="20">20 {t('mins', 'मिनट')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Study Days */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-success" />
            {t('Study Days', 'अध्ययन के दिन')}
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
                <span className="text-sm">{language === 'hi' ? day.hi : day.en}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
