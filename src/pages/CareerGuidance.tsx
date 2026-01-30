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
  } = useCareerGuidance();

  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchRecommendations(language);
    }
  }, [profile?.id, language, fetchRecommendations]);

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
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3">
              <Compass className="h-8 w-8 text-primary" />
              Career Guidance
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover careers that match your skills and interests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={(v) => setLanguage(v as 'English' | 'Hindi')}>
              <SelectTrigger className="w-[140px]">
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
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Chatbot */}
          <div className="lg:col-span-1 space-y-6">
            {profile && <ProfileSummaryCard profile={profile} />}
            <div className="h-[500px]">
              <CareerChatbot
                messages={chatMessages}
                loading={chatLoading}
                onSendMessage={sendChatMessage}
              />
            </div>
          </div>

          {/* Right Column - Career Recommendations */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Your Top Career Matches</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-3 p-5 border rounded-xl">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((career) => (
                  <CareerCard
                    key={career.career_id}
                    career={career}
                    onClick={() => handleCareerClick(career)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-xl bg-muted/30">
                <Compass className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground mb-2">No recommendations yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete some diagnostic tests to get personalized career matches
                </p>
                <Button onClick={() => fetchRecommendations(language)}>
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
