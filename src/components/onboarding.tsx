import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Github, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  X, 
  Award, 
  Heart, 
  Sparkles,
  Terminal,
  Compass,
  ArrowBigRightDash
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface OnboardingProps {
  onBackToHome: () => void;
  onOnboardingComplete: (data: any) => void;
}

export function OnboardingSection({ onBackToHome, onOnboardingComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    github: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    educationLevel: "Bachelor's",
    fieldOfStudy: "Computer Science",
    currentStatus: "Student",
    careerStage: "Student",
    skills: [] as string[],
    interests: [] as string[],
    goal: ''
  });

  // Mode toggles inside Step 1
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  // Skills input state
  const [customSkill, setCustomSkill] = useState('');
  const [customInterest, setCustomInterest] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Constants
  const educationOptions = ['High School', "Bachelor's", "Master's", 'Other'];
  
  const studyFields = [
    'Computer Science', 'IT', 'Engineering', 'Science', 
    'Management', 'Commerce', 'Arts', 'Biology', 'Other'
  ];

  const statusOptions = ['Student', 'Recent Graduate', 'Working Professional', 'Career Switcher'];
  
  const stageOptions = ['Just Exploring', 'Student', 'Intern Trainee', 'Junior Entry-level', 'Mid-level', 'Senior Lead'];

  const quickSkills = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Git'];
  const quickInterests = ['AI/ML', 'Web Development', 'Mobile Apps', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'Game Development', 'DevOps'];

  // Helper actions
  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (isLoginMode) {
        if (!loginEmail.trim()) newErrors.loginEmail = 'Email is required';
        if (!loginPassword) newErrors.loginPassword = 'Password is required';
      } else {
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
        
        if (!formData.github.trim()) newErrors.github = 'GitHub username is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Must be at least 6 characters';
        
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    } else if (currentStep === 2) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
    } else if (currentStep === 4) {
      if (!formData.goal.trim()) {
        newErrors.goal = 'Please enter what you are trying to achieve';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(step)) {
      if (step === 1 && !isLoginMode) {
        if (!isSupabaseConfigured) {
          // Supabase not configured — skip auth and proceed as guest
          setStep(step + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        try {
          const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
          });
          if (error) {
            setErrors({ email: error.message });
            return;
          }
        } catch (err: any) {
          setErrors({ email: 'Sign-up failed: ' + (err.message || 'Network error. Check your Supabase configuration.') });
          return;
        }
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (step < 4) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Trigger synthesis animation on step 4 submit
        setIsSynthesizing(true);
        
        // Save to supabase profiles table (only if configured)
        if (isSupabaseConfigured) {
          try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            console.log("Supabase getUser before upsert:", { userData, userError });
            
            if (userData?.user) {
              const { data: upsertData, error: upsertError } = await supabase.from('profiles').upsert({
                id: userData.user.id,
                email: formData.email,
                first_name: formData.firstName,
                github_username: formData.github,
                education_level: formData.educationLevel,
                field_of_study: formData.fieldOfStudy,
                current_status: formData.currentStatus,
                career_stage: formData.careerStage,
                skills: formData.skills,
                interests: formData.interests,
                goal: formData.goal
              }, { onConflict: 'id' });
              
              if (upsertError) {
                console.error("Supabase Upsert Error:", upsertError);
              } else {
                console.log("Profile successfully saved to Supabase:", upsertData);
              }
            } else {
              console.warn("No active user session found to attach profile data. Is Email Confirmation enabled in Supabase?");
            }
          } catch (err) {
            console.warn('Failed to save profile to Supabase (Exception):', err);
          }
        }

        setTimeout(() => {
          setIsSynthesizing(false);
          onOnboardingComplete(formData);
        }, 1200);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBackToHome();
    }
  };

  const handleSimulatedLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1)) return;

    if (!isSupabaseConfigured) {
      setErrors({ loginPassword: 'Supabase is not configured. Please add your credentials to .env to enable login.' });
      return;
    }

    setLoginMessage('Authenticating...');
    let data: any, error: any;
    try {
      const result = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      data = result.data;
      error = result.error;
    } catch (err: any) {
      setErrors({ loginPassword: 'Login failed: ' + (err.message || 'Network error. Check your Supabase configuration.') });
      setLoginMessage('');
      return;
    }

    if (error) {
      setErrors({ loginPassword: error.message });
      setLoginMessage('');
      return;
    }

    setLoginMessage('Welcome back to SENSAI! Loading your dashboard...');
    
    // Fetch profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
    
    let updatedFormData = { ...formData, email: loginEmail };
    if (profile) {
       updatedFormData = {
         ...updatedFormData,
         firstName: profile.first_name || '',
         github: profile.github_username || '',
         educationLevel: profile.education_level || "Bachelor's",
         fieldOfStudy: profile.field_of_study || "Computer Science",
         currentStatus: profile.current_status || "Student",
         careerStage: profile.career_stage || "Student",
         skills: profile.skills || [],
         interests: profile.interests || [],
         goal: profile.goal || ''
       };
       setFormData(updatedFormData);
    } else {
      updatedFormData = {
        ...updatedFormData,
        firstName: loginEmail.split('@')[0], 
      };
      setFormData(updatedFormData);
    }

    setTimeout(() => {
      if (profile && profile.goal) {
         onOnboardingComplete(updatedFormData);
      } else {
         setStep(2);
         setIsLoginMode(false);
         setLoginMessage('');
      }
    }, 1200);
  };

  // Add tag skills/interests
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
    }
    setCustomSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleAddInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, trimmed]
      }));
    }
    setCustomInterest('');
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  // Get current percentage completed based on specification
  const getProgressPercent = () => {
    if (step === 1) return 17;
    if (step === 2) return 33;
    if (step === 3) return 50;
    return 100;
  };

  return (
    <section className="relative min-h-screen py-24 sm:py-32 flex items-center justify-center bg-gradient-to-b from-[#185fb8] via-[#12519e] to-[#092c5c] overflow-hidden text-white w-full">
      {/* Absolute grid and cosmic overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#ffcc00]/10 to-transparent blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto px-6 relative z-10">
        
        {/* Main interactive state machine container */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-white/[0.05] border border-white/20 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
            id="onboarding-panel"
          >
              <div className="absolute top-0 inset-x-0 h-1 bg-white/5" />
              
              {/* Header section with active stats metadata */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#ffcc00]" />
                  <span className="font-mono text-xs text-[#ffcc00] font-bold tracking-widest uppercase">
                    Onboarding Node // Step {step} of 4
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-black text-[#ffcc00] bg-[#ffcc00]/10 border border-[#ffcc00]/20 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(255,204,0,0.15)]">
                    {getProgressPercent()}%
                  </span>
                </div>
              </div>

              {/* Progress Bar styled after our custom theme */}
              <div className="w-full bg-white/10 h-1.5 rounded-full mb-10 overflow-hidden relative">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${getProgressPercent()}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-[#ffcc00] to-[#ffd900] shadow-[0_0_12px_rgba(255,204,0,0.6)]"
                />
              </div>

              {/* Step Forms */}
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Create Account / Login */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                    id="step-1-form"
                  >
                    {!isLoginMode ? (
                      <>
                        <div className="space-y-2">
                          <h2 className="text-2xl sm:text-3xl font-bold text-[#ffcc00] tracking-tight">Create Account</h2>
                          <p className="text-sm text-yellow-50/85 font-medium leading-relaxed">
                            Form your professional profile to generate maps and matchmaker opportunities.
                          </p>
                        </div>

                        <div className="space-y-4">
                          {/* Email input */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Email Address</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                                <Mail className="w-4 h-4" />
                              </span>
                              <input 
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="name@example.com"
                                className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-[#ffcc00]/70'} text-white placeholder-white/30 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold outline-none transition-all duration-300 focus:bg-white/10`}
                              />
                            </div>
                            {errors.email && <p className="text-xs text-red-400 font-bold mt-1">{errors.email}</p>}
                          </div>

                          {/* GitHub input */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/70">GitHub Username</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                                <Github className="w-4 h-4" />
                              </span>
                              <input 
                                type="text"
                                value={formData.github}
                                onChange={(e) => setFormData({...formData, github: e.target.value})}
                                placeholder="github_dev"
                                className={`w-full bg-white/5 border ${errors.github ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-[#ffcc00]/70'} text-white placeholder-white/30 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold outline-none transition-all duration-300 focus:bg-white/10`}
                              />
                            </div>
                            {errors.github && <p className="text-xs text-red-400 font-bold mt-1">{errors.github}</p>}
                          </div>

                          {/* Password input */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Password</label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                                  <Lock className="w-4 h-4" />
                                </span>
                                <input 
                                  type="password"
                                  value={formData.password}
                                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                                  placeholder="••••••••"
                                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-[#ffcc00]/70'} text-white placeholder-white/30 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold outline-none transition-all duration-300 focus:bg-white/10`}
                                />
                              </div>
                              {errors.password && <p className="text-xs text-red-400 font-bold mt-1">{errors.password}</p>}
                            </div>

                            <div className="space-y-1">
                              <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Confirm Password</label>
                              <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                                  <Lock className="w-4 h-4" />
                                </span>
                                <input 
                                  type="password"
                                  value={formData.confirmPassword}
                                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                  placeholder="••••••••"
                                  className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-[#ffcc00]/70'} text-white placeholder-white/30 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold outline-none transition-all duration-300 focus:bg-white/10`}
                                />
                              </div>
                              {errors.confirmPassword && <p className="text-xs text-red-400 font-bold mt-1">{errors.confirmPassword}</p>}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={() => setIsLoginMode(true)}
                            className="text-xs font-semibold text-[#ffcc00] hover:text-[#ffea60] underline transition-all decoration-[#ffcc00]/50"
                          >
                            Already have an account? Log in here
                          </button>
                          
                          <button
                            type="button"
                            onClick={handleNext}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ffcc00] hover:bg-[#ffd900] text-[#092c5c] font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(255,204,0,0.25)] hover:shadow-[0_0_25px_rgba(255,204,0,0.45)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                          >
                            Next step 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </>
                    ) : (
                      // Interactive simulated Login node
                      <form onSubmit={handleSimulatedLogin} className="space-y-6">
                        <div className="space-y-2">
                          <h2 className="text-2xl sm:text-3xl font-bold text-[#ffcc00] tracking-tight">Welcome Sign In</h2>
                          <p className="text-sm text-yellow-50/85 font-semibold leading-relaxed">
                            Simulated node verification interface
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Email Address</label>
                            <input 
                              type="email"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="name@example.com"
                              className={`w-full bg-white/5 border ${errors.loginEmail ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-[#ffcc00]/70'} text-white placeholder-white/30 rounded-xl py-3 px-4 text-sm font-semibold outline-none transition-all duration-300`}
                            />
                            {errors.loginEmail && <p className="text-xs text-red-400 font-bold mt-1">{errors.loginEmail}</p>}
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Password</label>
                            <input 
                              type="password"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              placeholder="••••••••"
                              className={`w-full bg-white/5 border ${errors.loginPassword ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-[#ffcc00]/70'} text-white placeholder-white/30 rounded-xl py-3 px-4 text-sm font-semibold outline-none transition-all duration-300`}
                            />
                            {errors.loginPassword && <p className="text-xs text-red-400 font-bold mt-1">{errors.loginPassword}</p>}
                          </div>
                        </div>

                        {loginMessage && (
                          <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-300 font-bold">
                            {loginMessage}
                          </div>
                        )}

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={() => setIsLoginMode(false)}
                            className="text-xs font-semibold text-[#ffcc00] hover:text-[#ffea60] underline transition-all"
                          >
                            Need to register? Back to account creation
                          </button>
                          
                          <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ffcc00] hover:bg-[#ffd900] text-[#092c5c] font-black text-sm tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            Authenticate
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                )}

                {/* STEP 2: About You */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                    id="step-2-form"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#ffcc00] tracking-tight">About You</h2>
                      <p className="text-sm text-yellow-50/85 font-medium leading-relaxed">
                        Introduce yourself to allow custom indexing of maps and courses.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/70">First Name</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                            <User className="w-4 h-4" />
                          </span>
                          <input 
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            placeholder="Alex"
                            className={`w-full bg-white/5 border ${errors.firstName ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-[#ffcc00]/70'} text-white placeholder-white/30 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold outline-none transition-all duration-300 focus:bg-white/10`}
                          />
                        </div>
                        {errors.firstName && <p className="text-xs text-red-400 font-bold mt-1">{errors.firstName}</p>}
                      </div>

                      {/* Education Level (custom styled toggles) */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Education Level</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {educationOptions.map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setFormData({...formData, educationLevel: level})}
                              className={`p-3 rounded-xl border text-xs font-extrabold uppercase transition-all duration-300 flex items-center justify-center cursor-pointer ${
                                formData.educationLevel === level 
                                  ? 'bg-[#ffcc00]/15 border-[#ffcc00] text-[#ffcc00] shadow-[0_0_12px_rgba(255,204,0,0.15)]Scale-[1.03]' 
                                  : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Field of Study */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Field of Study</label>
                        <select
                          value={formData.fieldOfStudy}
                          onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})}
                          className="w-full bg-[#092c5c] border border-white/15 focus:border-[#ffcc00]/70 focus:ring-1 focus:ring-[#ffcc00] text-white rounded-xl py-3 px-4 text-sm font-semibold outline-none transition-all duration-300"
                        >
                          {studyFields.map((field) => (
                            <option key={field} value={field} className="bg-[#09356d] text-white font-semibold">
                              {field}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Current Status & Career Stage */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Current Status</label>
                          <div className="space-y-1.5">
                            {statusOptions.map((status) => (
                              <div
                                key={status}
                                onClick={() => setFormData({...formData, currentStatus: status})}
                                className={`p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center justify-between ${
                                  formData.currentStatus === status
                                    ? 'bg-[#ffcc00]/10 border-[#ffcc00]/60 text-[#ffcc00]'
                                    : 'bg-white/5 border-white/5 hover:border-white/10 text-white/80'
                                }`}
                              >
                                <span>{status}</span>
                                {formData.currentStatus === status && <Check className="w-3.5 h-3.5 text-[#ffcc00]" />}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-white/70">Career Stage Target</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {stageOptions.map((stage) => (
                              <button
                                key={stage}
                                type="button"
                                onClick={() => setFormData({...formData, careerStage: stage})}
                                className={`p-2.5 rounded-lg border text-[10px] font-bold text-center leading-xs transition-all duration-200 cursor-pointer ${
                                  formData.careerStage === stage
                                    ? 'bg-[#ffcc00]/10 border-[#ffcc00]/60 text-[#ffcc00] shadow-[0_0_8px_rgba(255,204,0,0.1)]'
                                    : 'bg-white/5 border-white/5 hover:border-white/15 text-white/70'
                                }`}
                              >
                                {stage}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-3 rounded-xl bg-[#ffcc00] hover:bg-[#ffd900] text-[#092c5c] font-bold text-sm tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        Next step
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Skills & Interests */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-7"
                    id="step-3-form"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#ffcc00] tracking-tight">Skills & Interests</h2>
                      <p className="text-sm text-yellow-50/85 font-medium leading-relaxed">
                        Input your technical competencies and high-interest vectors to enable semantic filtering.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Section: Skills */}
                      <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#ffcc00]/90">
                          <Award className="w-4 h-4" />
                          <span>Your Skills Mastery Matrix</span>
                        </div>
                        
                        {/* Custom customSkill entry */}
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={customSkill}
                            onChange={(e) => setCustomSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(customSkill)}
                            placeholder="Add custom skill (e.g. Docker)"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold placeholder-white/30 text-white outline-none focus:border-[#ffcc00]/50"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSkill(customSkill)}
                            className="bg-white/10 border border-white/10 hover:bg-[#ffcc00] hover:text-[#092c5c] rounded-xl px-4 py-2 transition-all duration-300 flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Active Added Skills List */}
                        {formData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-white/5">
                            {formData.skills.map((s) => (
                              <span 
                                key={s} 
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ffcc00]/15 text-[#ffcc00] text-[11px] font-extrabold border border-[#ffcc00]/25"
                              >
                                {s}
                                <button type="button" onClick={() => handleRemoveSkill(s)} className="text-[#ffcc00] hover:text-white ml-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quick Add Chips */}
                        <div className="space-y-1">
                          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Quick Suggestions</p>
                          <div className="flex flex-wrap gap-1.5">
                            {quickSkills.map((qs) => {
                              const exists = formData.skills.includes(qs);
                              return (
                                <button
                                  key={qs}
                                  type="button"
                                  onClick={() => exists ? handleRemoveSkill(qs) : handleAddSkill(qs)}
                                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border transition-all duration-200 cursor-pointer ${
                                    exists
                                      ? 'bg-[#ffcc00] text-[#092c5c] border-[#ffcc00] shadow-[0_0_8px_rgba(255,204,0,0.2)]'
                                      : 'bg-white/5 text-white/80 border-white/5 hover:border-white/15'
                                  }`}
                                >
                                  {qs}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Section: Interests */}
                      <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#ffcc00]/90">
                          <Heart className="w-4 h-4" />
                          <span>Domains of Core Interest</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={customInterest}
                            onChange={(e) => setCustomInterest(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddInterest(customInterest)}
                            placeholder="Add custom interest (e.g. Blockchain)"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold placeholder-white/30 text-white outline-none focus:border-[#ffcc00]/50"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddInterest(customInterest)}
                            className="bg-white/10 border border-white/10 hover:bg-[#ffcc00] hover:text-[#092c5c] rounded-xl px-4 py-2 transition-all duration-300 flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Active Added Interests List */}
                        {formData.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-white/5">
                            {formData.interests.map((it) => (
                              <span 
                                key={it} 
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ffcc00]/15 text-[#ffcc00] text-[11px] font-extrabold border border-[#ffcc00]/25"
                              >
                                {it}
                                <button type="button" onClick={() => handleRemoveInterest(it)} className="text-[#ffcc00] hover:text-white ml-0.5">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quick-add Interests suggestions */}
                        <div className="space-y-1">
                          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Quick Suggestions</p>
                          <div className="flex flex-wrap gap-1.5">
                            {quickInterests.map((qi) => {
                              const exists = formData.interests.includes(qi);
                              return (
                                <button
                                  key={qi}
                                  type="button"
                                  onClick={() => exists ? handleRemoveInterest(qi) : handleAddInterest(qi)}
                                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border transition-all duration-200 cursor-pointer ${
                                    exists
                                      ? 'bg-[#ffcc00] text-[#092c5c] border-[#ffcc00] shadow-[0_0_8px_rgba(255,204,0,0.2)]'
                                      : 'bg-white/5 text-white/80 border-white/5 hover:border-white/15'
                                  }`}
                                >
                                  {qi}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-3 rounded-xl bg-[#ffcc00] hover:bg-[#ffd900] text-[#092c5c] font-bold text-sm tracking-wide shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        Next step
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Your Goal */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                    id="step-4-form"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#ffcc00] tracking-tight">Your Ultimate Goal</h2>
                      <p className="text-sm text-yellow-50/85 font-medium leading-relaxed">
                        Provide raw parameters about what you desire to manifest with SENSAI.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                        What are you trying to achieve?
                      </label>
                      
                      <div className="relative">
                        <textarea
                          rows={6}
                          value={formData.goal}
                          onChange={(e) => setFormData({...formData, goal: e.target.value})}
                          placeholder="Example: I want to secure a remote Junior React developer role or secure high-impact AI research internships by bridging my open-source projects."
                          className={`w-full bg-white/5 border ${
                            errors.goal ? 'border-red-500/80 focus:border-red-500' : 'border-white/15 focus:border-[#ffcc00]/70'
                          } text-white placeholder-white/30 rounded-2xl p-4 text-sm font-semibold outline-none transition-all duration-300 focus:bg-white/10 focus:ring-1 focus:ring-[#ffcc00]/40`}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 font-mono text-[9px] text-white/40">
                          <Terminal className="w-3 h-3 text-[#ffcc00]" />
                          <span>SYNTACTIC ENTRY</span>
                        </div>
                      </div>
                      {errors.goal && <p className="text-xs text-red-400 font-bold mt-1">{errors.goal}</p>}
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        disabled={isSynthesizing}
                        onClick={handleBack}
                        className="px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      
                      <button
                        type="button"
                        disabled={isSynthesizing}
                        onClick={handleNext}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#ffcc00] to-[#ffd900] text-[#092c5c] font-black text-sm tracking-wide shadow-[0_0_20px_rgba(255,204,0,0.3)] hover:shadow-[0_0_30px_rgba(255,204,0,0.6)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
                      >
                        {isSynthesizing ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-[#092c5c] border-t-transparent animate-spin inline-block" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Complete Onboarding</span>
                            <Sparkles className="w-4 h-4 text-[#092c5c]" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
