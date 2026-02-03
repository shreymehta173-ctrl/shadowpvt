import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, X, BookOpen, AlertTriangle, Target, Zap } from 'lucide-react';
import type { Weakness } from '@/hooks/useStudyPlanner';

interface WeaknessManagerProps {
  weaknesses: Weakness[];
  onAdd: (weakness: Omit<Weakness, 'id' | 'student_id' | 'is_resolved' | 'created_at'>) => Promise<unknown>;
  onRemove: (id: string) => Promise<void>;
}

const subjects = [
  { en: 'Mathematics', hi: 'गणित' },
  { en: 'Physics', hi: 'भौतिकी' },
  { en: 'Chemistry', hi: 'रसायन विज्ञान' },
  { en: 'Biology', hi: 'जीव विज्ञान' },
  { en: 'English', hi: 'अंग्रेजी' },
  { en: 'Hindi', hi: 'हिंदी' },
  { en: 'Social Science', hi: 'सामाजिक विज्ञान' },
  { en: 'Computer Science', hi: 'कंप्यूटर विज्ञान' },
  { en: 'Economics', hi: 'अर्थशास्त्र' },
  { en: 'Accountancy', hi: 'लेखाशास्त्र' },
  { en: 'Business Studies', hi: 'व्यवसाय अध्ययन' },
];

const priorityConfig = {
  critical: { color: 'bg-destructive text-destructive-foreground', icon: AlertTriangle },
  high: { color: 'bg-warning text-warning-foreground', icon: Target },
  medium: { color: 'bg-primary text-primary-foreground', icon: BookOpen },
  low: { color: 'bg-muted text-muted-foreground', icon: Zap },
};

export function WeaknessManager({ weaknesses, onAdd, onRemove }: WeaknessManagerProps) {
  const { t, language } = useLanguage();
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

  const getSubjectLabel = (subjectEn: string) => {
    const subject = subjects.find(s => s.en === subjectEn);
    return language === 'hi' && subject ? subject.hi : subjectEn;
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
              {t('Focus Areas', 'फोकस क्षेत्र')}
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              {t("Add topics you want to improve and we'll create a personalized study plan", 'जिन विषयों में आप सुधार करना चाहते हैं उन्हें जोड़ें और हम एक व्यक्तिगत अध्ययन योजना बनाएंगे')}
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
          {t('Add New Focus Topic', 'नया फोकस विषय जोड़ें')}
        </Button>

        {isAdding && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-primary/20 space-y-5 animate-in fade-in duration-200">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t('Add a Topic to Focus On', 'फोकस करने के लिए एक विषय जोड़ें')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-base font-medium">{t('Subject', 'विषय')}</Label>
                <Select
                  value={newWeakness.subject}
                  onValueChange={(v) => setNewWeakness(prev => ({ ...prev, subject: v }))}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder={t('Select subject', 'विषय चुनें')} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s.en} value={s.en} className="text-base">
                        {language === 'hi' ? s.hi : s.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">{t('Topic', 'टॉपिक')}</Label>
                <Input
                  placeholder={t('e.g., Quadratic Equations', 'जैसे, द्विघात समीकरण')}
                  className="h-12 text-base"
                  value={newWeakness.topic}
                  onChange={(e) => setNewWeakness(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label className="text-base font-medium">{t('Priority', 'प्राथमिकता')}</Label>
                <Select
                  value={newWeakness.priority}
                  onValueChange={(v) => setNewWeakness(prev => ({ ...prev, priority: v as Weakness['priority'] }))}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical" className="text-base">🔴 {t('Critical', 'अति महत्वपूर्ण')}</SelectItem>
                    <SelectItem value="high" className="text-base">🟠 {t('High', 'उच्च')}</SelectItem>
                    <SelectItem value="medium" className="text-base">🟡 {t('Medium', 'मध्यम')}</SelectItem>
                    <SelectItem value="low" className="text-base">🟢 {t('Low', 'कम')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">{t('Difficulty (1-5)', 'कठिनाई (1-5)')}</Label>
                <Select
                  value={String(newWeakness.difficulty)}
                  onValueChange={(v) => setNewWeakness(prev => ({ ...prev, difficulty: parseInt(v) }))}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1" className="text-base">1 - {t('Easy', 'आसान')}</SelectItem>
                    <SelectItem value="2" className="text-base">2 - {t('Moderate', 'सामान्य')}</SelectItem>
                    <SelectItem value="3" className="text-base">3 - {t('Average', 'औसत')}</SelectItem>
                    <SelectItem value="4" className="text-base">4 - {t('Hard', 'कठिन')}</SelectItem>
                    <SelectItem value="5" className="text-base">5 - {t('Very Hard', 'बहुत कठिन')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">{t('Est. Time (mins)', 'अनु. समय (मिनट)')}</Label>
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
              <Button variant="outline" size="lg" onClick={() => setIsAdding(false)}>{t('Cancel', 'रद्द करें')}</Button>
              <Button size="lg" onClick={handleAdd} disabled={!newWeakness.subject || !newWeakness.topic} className="px-8">
                {t('Add Topic', 'विषय जोड़ें')}
              </Button>
            </div>
          </div>
        )}

        {weaknesses.length === 0 && !isAdding ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <BookOpen className="h-10 w-10 opacity-50" />
            </div>
            <p className="text-lg font-medium mb-1">{t('No focus topics added yet', 'अभी तक कोई फोकस विषय नहीं जोड़ा गया')}</p>
            <p className="text-sm">{t('Click the button above to add topics you want to improve', 'जिन विषयों में आप सुधार करना चाहते हैं उन्हें जोड़ने के लिए ऊपर बटन क्लिक करें')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {t(`Your Focus Topics (${weaknesses.length})`, `आपके फोकस विषय (${weaknesses.length})`)}
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
                      <p className="text-sm text-muted-foreground">{getSubjectLabel(weakness.subject)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      {weakness.difficulty}/5 {t('difficulty', 'कठिनाई')}
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      ~{weakness.estimated_effort}{t('min', 'मिनट')}
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
