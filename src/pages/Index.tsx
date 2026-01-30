import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Target, 
  MessageCircle,
  TrendingUp,
  BookOpen,
  Users,
  Rocket,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  Brain,
  BarChart3,
} from 'lucide-react';

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <header className="relative">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/25">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">CareerPath</span>
              <span className="text-xs text-muted-foreground block">AI Career Guide</span>
            </div>
          </div>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button className="bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 shadow-lg shadow-primary/25">
              {user ? "Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-16 lg:py-28">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4" /> 
              AI-Powered Career Discovery & Study Planning
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Discover Your{' '}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Perfect Career
              </span>
              <br />
              <span className="text-3xl lg:text-5xl">Plan Your Success</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Take a 3-minute assessment to find careers that match you. Get AI mentoring, 
              personalized study plans, and track your progress to success.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to={user ? "/career" : "/auth"}>
                <Button size="lg" className="bg-gradient-to-r from-primary via-purple-500 to-cyan-500 hover:opacity-90 w-full sm:w-auto shadow-xl shadow-primary/25 text-lg px-8 py-6">
                  <Compass className="mr-2 h-5 w-5" />
                  Find Your Career Path
                </Button>
              </Link>
              <Link to={user ? "/planner" : "/auth"}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/30 hover:bg-primary/5 text-lg px-8 py-6">
                  <Calendar className="mr-2 h-5 w-5" />
                  Create Study Plan
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Free Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>AI Career Mentor</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Smart Study Planner</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Hindi & English</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Two Main Features */}
      <section className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-primary" /> Two Powerful Tools
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Discover your ideal career and plan your studies with AI-powered intelligence
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Career Guidance Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-card rounded-3xl p-8 border border-border hover:border-primary/30 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
                    <Compass className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Career Guidance</h3>
                    <p className="text-muted-foreground">Find your perfect career match</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Target, text: "15-question personality assessment" },
                    { icon: Brain, text: "AI-powered career matching" },
                    { icon: MessageCircle, text: "Chat with AI mentor in Hindi/English" },
                    { icon: BarChart3, text: "Detailed career insights & roadmaps" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Link to={user ? "/career" : "/auth"}>
                  <Button className="w-full bg-gradient-to-r from-primary to-purple-500 hover:opacity-90">
                    Start Career Discovery <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Study Planner Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-emerald-500/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-card rounded-3xl p-8 border border-border hover:border-cyan-500/30 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Study Planner</h3>
                    <p className="text-muted-foreground">AI-powered study schedules</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  {[
                    { icon: BookOpen, text: "Add topics you want to improve" },
                    { icon: Clock, text: "Personalized session scheduling" },
                    { icon: TrendingUp, text: "Adaptive plans based on your pace" },
                    { icon: CheckCircle2, text: "Track progress & get feedback" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-cyan-600" />
                      </div>
                      <span className="text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Link to={user ? "/planner" : "/auth"}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90">
                    Create Study Plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Your Journey to Success</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              A simple process designed for students after 10th & 12th grade
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Target,
                step: "1",
                title: "Take Assessment",
                description: "Answer 15 questions about your interests and skills",
                gradient: "from-primary to-purple-500",
              },
              {
                icon: Compass,
                step: "2",
                title: "Get Matches",
                description: "See careers that fit your personality",
                gradient: "from-purple-500 to-cyan-500",
              },
              {
                icon: BookOpen,
                step: "3",
                title: "Plan Studies",
                description: "Create personalized weekly study schedule",
                gradient: "from-cyan-500 to-emerald-500",
              },
              {
                icon: Rocket,
                step: "4",
                title: "Achieve Goals",
                description: "Track progress and reach your dreams",
                gradient: "from-emerald-500 to-primary",
              },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-xs font-bold text-primary mb-2">STEP {feature.step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium">
                <GraduationCap className="w-4 h-4" /> Built for Indian Students
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Confused About Your Future?
                <br />
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  We've Got You Covered
                </span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you just completed 10th or 12th, choosing the right stream and career 
                is overwhelming. Our AI understands the Indian education system and helps you 
                make informed decisions.
              </p>
              
              <div className="space-y-4 pt-4">
                {[
                  { icon: Users, text: "Science, Commerce, Arts, or Diploma guidance" },
                  { icon: TrendingUp, text: "Real salary data & job market trends" },
                  { icon: Calendar, text: "Smart study plans that adapt to your pace" },
                  { icon: MessageCircle, text: "24/7 AI mentor in Hindi & English" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-background hover:bg-muted transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-foreground font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Planner Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-emerald-500/20 to-primary/20 rounded-3xl blur-2xl" />
              <div className="relative bg-card border border-border rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Today's Study Plan</p>
                    <p className="text-sm text-muted-foreground">3 sessions scheduled</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { subject: "Mathematics", topic: "Quadratic Equations", time: "45 mins", type: "study", done: true },
                    { subject: "Physics", topic: "Newton's Laws", time: "30 mins", type: "revision", done: false },
                    { subject: "Chemistry", topic: "Organic Reactions", time: "40 mins", type: "study", done: false },
                  ].map((session, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${session.done ? 'bg-emerald-500/10' : 'bg-muted/50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          session.type === 'study' ? 'bg-primary/20' : 'bg-cyan-500/20'
                        }`}>
                          {session.type === 'study' ? (
                            <BookOpen className="w-4 h-4 text-primary" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-cyan-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{session.topic}</p>
                          <p className="text-xs text-muted-foreground">{session.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{session.time}</span>
                        {session.done && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </div>
                    </div>
                  ))}
                </div>

                <Link to={user ? "/planner" : "/auth"}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90">
                    Create Your Plan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-cyan-500/5" />
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto shadow-xl shadow-primary/25">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Start Your Success Journey Today
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of students who discovered their ideal career path and 
              mastered their studies. It's free and takes just 3 minutes to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to={user ? "/career" : "/auth"}>
                <Button size="lg" className="bg-gradient-to-r from-primary via-purple-500 to-cyan-500 hover:opacity-90 shadow-xl shadow-primary/25 text-lg px-10 py-6">
                  <Compass className="mr-2 h-5 w-5" />
                  Career Assessment
                </Button>
              </Link>
              <Link to={user ? "/planner" : "/auth"}>
                <Button size="lg" variant="outline" className="border-primary/30 text-lg px-10 py-6">
                  <Calendar className="mr-2 h-5 w-5" />
                  Study Planner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-foreground">CareerPath AI</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 CareerPath. Helping students find their path. 🚀
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
