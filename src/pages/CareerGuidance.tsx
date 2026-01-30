import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import { useCareerGuidance, CareerRecommendation } from '@/hooks/useCareerGuidance';
import { CareerCard } from '@/components/career/CareerCard';
import { CareerDetailDrawer } from '@/components/career/CareerDetailDrawer';
import { CareerChatbot } from '@/components/career/CareerChatbot';
import { ProfileSummaryCard } from '@/components/career/ProfileSummaryCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Compass,
  RefreshCw,
  Globe,
  Sparkles,
  Loader2,
} from 'lucide-react';

export default function CareerGuidance() {
  const { profile } = useAuth();
  const {
    recommendations,
    loading,
    chatMessages,
    chatLoading,
    fetchRecommendations,
    getCareerDetail,
    sendChatMessage,
    clearChat,
  } = useCareerGuidance();

  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchRecommendations(language);
    }
  }, [profile?.id, fetchRecommendations]);

  const handleLanguageChange = (newLanguage: 'English' | 'Hindi') => {
    setLanguage(newLanguage);
    fetchRecommendations(newLanguage);
  };

  const handleCareerClick = async (career: CareerRecommendation) => {
    setSelectedCareer(career);
    setDrawerOpen(true);
    setDetailLoading(true);

    const detail = await getCareerDetail(career.career_id, language);
    if (detail) {
      setSelectedCareer(prev => prev ? { ...prev, ...detail } : null);
    }
    setDetailLoading(false);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Compass className="h-5 w-5 text-primary-foreground" />
              </div>
              Career Guidance
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover careers that match your skills and interests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={(v) => handleLanguageChange(v as 'English' | 'Hindi')}>
              <SelectTrigger className="w-[130px]">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => fetchRecommendations(language)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Chatbot */}
          <div className="lg:col-span-1 space-y-6">
            {profile && <ProfileSummaryCard profile={profile} />}
            <div className="h-[520px]">
              <CareerChatbot
                messages={chatMessages}
                loading={chatLoading}
                onSendMessage={sendChatMessage}
                onClearChat={clearChat}
              />
            </div>
          </div>

          {/* Right Column - Career Recommendations */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Your Top Career Matches</h2>
              {recommendations.length > 0 && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {recommendations.length} careers
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-3 p-5 border rounded-xl bg-card">
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.map((career, index) => (
                  <CareerCard
                    key={career.career_id}
                    career={career}
                    onClick={() => handleCareerClick(career)}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-xl bg-muted/30">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Compass className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">No recommendations yet</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  Complete some diagnostic tests to get personalized career matches based on your skills
                </p>
                <Button onClick={() => fetchRecommendations(language)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Recommendations
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Career Detail Drawer */}
        <CareerDetailDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          career={selectedCareer}
          loading={detailLoading}
          studentSkills={profile?.interests || []}
        />
      </div>
    </AppLayout>
  );
}
