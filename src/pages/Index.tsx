import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, Target, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-10" />
        <div className="absolute inset-0 bg-hero-pattern" />
        
        <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SkillForge AI</span>
          </div>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button variant={user ? "default" : "outline"}>
              {user ? "Dashboard" : "Sign In"}
            </Button>
          </Link>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" /> AI-Powered Learning Gap Analysis
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Discover Your{' '}
              <span className="text-gradient">Learning Gaps</span>
              <br />Master New Skills
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI agents diagnose your knowledge gaps, create personalized improvement plans, 
              and track your progress to mastery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={user ? "/dashboard" : "/auth"}>
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto">
                  {user ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-2">Three AI agents working together for your success</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Diagnostic Agent",
                description: "Takes adaptive assessments to identify your exact knowledge gaps and skill deficiencies.",
                color: "text-primary",
              },
              {
                icon: Zap,
                title: "Recommendation Agent",
                description: "Creates personalized skill improvement roadmaps with prioritized learning resources.",
                color: "text-warning",
              },
              {
                icon: TrendingUp,
                title: "Progress Agent",
                description: "Tracks your improvement over time and triggers re-assessments when needed.",
                color: "text-success",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-card rounded-xl p-8 border border-border hover:shadow-lg transition-shadow">
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Ready to Master Your Skills?</h2>
            <p className="text-muted-foreground">
              Join students who are discovering their learning gaps and building personalized paths to mastery.
            </p>
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2024 SkillForge AI. Built with ❤️ for learners everywhere.</p>
        </div>
      </footer>
    </div>
  );
}
