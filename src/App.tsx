import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Navbar } from "@/components/navbar";
import { 
    HeroSection, 
    FeaturesSection,
    ShowcaseSection,
    CtaSection, 
    Footer 
  } from "@/components/landing";
import { OnboardingSection } from "@/components/onboarding";
import { DashboardComponent } from "@/components/dashboard";
import { CursorFollower } from "@/components/ui/cursor-follower";
import { ReactLenis } from "lenis/react";

type ViewState = 'landing' | 'onboarding' | 'dashboard';

export default function App() {
  const [viewHistory, setViewHistory] = useState<ViewState[]>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/skill-checker') {
      return ['landing', 'dashboard'];
    }
    return ['landing'];
  });

  const view = viewHistory[viewHistory.length - 1];

  const navigate = (newView: ViewState) => {
    setViewHistory(prev => [...prev, newView]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setViewHistory(prev => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setViewHistory(['landing']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
          if (profile) {
            setOnboardingData({
              email: session.user.email,
              firstName: profile.first_name,
              github: profile.github_username,
              educationLevel: profile.education_level,
              fieldOfStudy: profile.field_of_study,
              currentStatus: profile.current_status,
              careerStage: profile.career_stage,
              skills: profile.skills || [],
              interests: profile.interests || [],
              goal: profile.goal
            });
          }
        }
      } catch (err) {
        console.warn('Supabase not configured, running in offline mode:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setOnboardingData(null);
        goHome();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleOnboardingComplete = (data: any) => {
    setOnboardingData(data);
    navigate('dashboard');
  };

  const handleGetStarted = () => {
    if (onboardingData) {
      navigate('dashboard');
    } else {
      navigate('onboarding');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#207ae2] via-[#12519e] to-[#092c5c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ffcc00]/30 border-t-[#ffcc00] rounded-full animate-spin" />
          <p className="text-white/70 text-sm font-semibold tracking-wide">Loading SENSAI...</p>
        </div>
      </div>
    );
  }

  return (
    <ReactLenis root>
      <div className="min-h-screen bg-gradient-to-b from-[#207ae2] via-[#12519e] to-[#092c5c] text-white selection:bg-[#ffcc00]/35 font-sans">
        <CursorFollower />
        <Navbar 
          onLogoClick={goHome} 
          showBack={viewHistory.length > 1}
          onBackClick={goBack}
        />

        <main className={view !== 'landing' ? 'pt-16 md:pt-20' : ''}>
          {view === 'landing' ? (
            <>
              <HeroSection />
              <FeaturesSection />
              <ShowcaseSection />
              <CtaSection onGetStarted={handleGetStarted} />
            </>
          ) : view === 'onboarding' ? (
            <OnboardingSection 
              onBackToHome={goHome} 
              onOnboardingComplete={handleOnboardingComplete}
            />
          ) : (
            <DashboardComponent 
              formData={onboardingData || {}} 
              onBackToHome={goHome} 
            />
          )}
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
}
