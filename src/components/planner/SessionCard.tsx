import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  BookOpen, 
  RefreshCw, 
  Clock, 
  Play, 
  Check, 
  XCircle, 
  AlertCircle,
  Star,
} from 'lucide-react';
import type { StudySession } from '@/hooks/useStudyPlanner';

interface SessionCardProps {
  session: StudySession;
  compact?: boolean;
  onUpdateStatus: (
    sessionId: string,
    status: 'completed' | 'partial' | 'skipped',
    feedback?: { notes?: string; effectiveness?: number }
  ) => Promise<void>;
}

const sessionTypeConfig = {
  study: { icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
  revision: { icon: RefreshCw, color: 'text-success', bg: 'bg-success/10' },
  buffer: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
};

const statusConfig = {
  pending: { icon: Play, color: 'text-muted-foreground', bg: 'bg-muted' },
  completed: { icon: Check, color: 'text-success', bg: 'bg-success/20' },
  partial: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/20' },
  skipped: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/20' },
};

export function SessionCard({ session, compact = false, onUpdateStatus }: SessionCardProps) {
  const { t } = useLanguage();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'completed' | 'partial' | 'skipped'>('completed');
  const [notes, setNotes] = useState('');
  const [effectiveness, setEffectiveness] = useState(3);
  const [loading, setLoading] = useState(false);

  const typeConfig = sessionTypeConfig[session.session_type];
  const TypeIcon = typeConfig.icon;
  const status = statusConfig[session.status];
  const StatusIcon = status.icon;

  const handleStatusClick = (newStatus: 'completed' | 'partial' | 'skipped') => {
    setFeedbackStatus(newStatus);
    setShowFeedback(true);
  };

  const submitFeedback = async () => {
    setLoading(true);
    try {
      await onUpdateStatus(session.id, feedbackStatus, { notes, effectiveness });
      setShowFeedback(false);
      setNotes('');
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <>
        <div 
          className={`p-2 rounded-lg ${status.bg} border border-border/30 cursor-pointer hover:border-primary/50 transition-colors`}
          onClick={() => session.status === 'pending' && handleStatusClick('completed')}
        >
          <div className="flex items-center gap-2 mb-1">
            <TypeIcon className={`h-3 w-3 ${typeConfig.color}`} />
            <span className="text-xs font-medium truncate">{session.topic}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{session.duration_minutes}{t('m', 'मि')}</span>
            <StatusIcon className={`h-3 w-3 ${status.color}`} />
          </div>
        </div>

        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('Session Feedback', 'सत्र प्रतिक्रिया')}</DialogTitle>
              <DialogDescription>
                {session.subject}: {session.topic}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t('How did it go?', 'कैसा रहा?')}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['completed', 'partial', 'skipped'] as const).map((s) => (
                    <Button
                      key={s}
                      variant={feedbackStatus === s ? 'default' : 'outline'}
                      className="capitalize"
                      onClick={() => setFeedbackStatus(s)}
                    >
                      {s === 'completed' && '✅ '}
                      {s === 'partial' && '⚠️ '}
                      {s === 'skipped' && '❌ '}
                      {s === 'completed' ? t('Completed', 'पूर्ण') : s === 'partial' ? t('Partial', 'आंशिक') : t('Skipped', 'छोड़ा')}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('Effectiveness (1-5)', 'प्रभावशीलता (1-5)')}</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEffectiveness(star)}
                    >
                      <Star 
                        className={`h-5 w-5 ${
                          star <= effectiveness ? 'text-warning fill-warning' : 'text-muted-foreground'
                        }`} 
                      />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('Notes (optional)', 'नोट्स (वैकल्पिक)')}</Label>
                <Textarea
                  placeholder={t('Any thoughts about this session...', 'इस सत्र के बारे में कोई विचार...')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFeedback(false)}>{t('Cancel', 'रद्द करें')}</Button>
              <Button onClick={submitFeedback} disabled={loading}>
                {loading ? t('Saving...', 'सेव हो रहा है...') : t('Save Feedback', 'प्रतिक्रिया सेव करें')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Full card view
  return (
    <>
      <div className={`p-4 rounded-xl ${status.bg} border border-border/50`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeConfig.bg}`}>
              <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
            </div>
            <div>
              <h4 className="font-medium">{session.topic}</h4>
              <p className="text-sm text-muted-foreground">{session.subject}</p>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {session.session_type === 'study' ? t('Study', 'अध्ययन') : 
             session.session_type === 'revision' ? t('Revision', 'पुनरावृत्ति') : 
             t('Buffer', 'बफर')}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {session.scheduled_time || t('Flexible', 'लचीला')}
          </span>
          <span>{session.duration_minutes} {t('mins', 'मिनट')}</span>
          <span>{t('Difficulty', 'कठिनाई')}: {session.difficulty}/5</span>
        </div>

        {session.status === 'pending' ? (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => handleStatusClick('completed')}
            >
              <Check className="h-4 w-4 mr-1" />
              {t('Completed', 'पूर्ण')}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleStatusClick('partial')}
            >
              {t('Partial', 'आंशिक')}
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => handleStatusClick('skipped')}
            >
              {t('Skip', 'छोड़ें')}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${status.color}`} />
            <span className={`text-sm font-medium capitalize ${status.color}`}>
              {session.status === 'completed' ? t('Completed', 'पूर्ण') : 
               session.status === 'partial' ? t('Partial', 'आंशिक') : 
               t('Skipped', 'छोड़ा')}
            </span>
            {session.effectiveness_score && (
              <div className="flex items-center gap-1 ml-auto">
                {[...Array(session.effectiveness_score)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-warning fill-warning" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('Session Feedback', 'सत्र प्रतिक्रिया')}</DialogTitle>
            <DialogDescription>
              {session.subject}: {session.topic}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t('How did it go?', 'कैसा रहा?')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['completed', 'partial', 'skipped'] as const).map((s) => (
                  <Button
                    key={s}
                    variant={feedbackStatus === s ? 'default' : 'outline'}
                    className="capitalize"
                    onClick={() => setFeedbackStatus(s)}
                  >
                    {s === 'completed' && '✅ '}
                    {s === 'partial' && '⚠️ '}
                    {s === 'skipped' && '❌ '}
                    {s === 'completed' ? t('Completed', 'पूर्ण') : s === 'partial' ? t('Partial', 'आंशिक') : t('Skipped', 'छोड़ा')}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('Effectiveness (1-5)', 'प्रभावशीलता (1-5)')}</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEffectiveness(star)}
                  >
                    <Star 
                      className={`h-5 w-5 ${
                        star <= effectiveness ? 'text-warning fill-warning' : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('Notes (optional)', 'नोट्स (वैकल्पिक)')}</Label>
              <Textarea
                placeholder={t('Any thoughts about this session...', 'इस सत्र के बारे में कोई विचार...')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedback(false)}>{t('Cancel', 'रद्द करें')}</Button>
            <Button onClick={submitFeedback} disabled={loading}>
              {loading ? t('Saving...', 'सेव हो रहा है...') : t('Save Feedback', 'प्रतिक्रिया सेव करें')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
