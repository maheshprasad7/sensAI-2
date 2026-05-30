'use client';

import React, { useState, useMemo, useEffect } from "react";
import { HighlightButton } from "./ui/highlight-button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Briefcase, 
  Zap, 
  RefreshCcw, 
  ArrowRight, 
  Clock, 
  X, 
  Check, 
  Brain, 
  Cpu, 
  Shield, 
  Activity, 
  Gauge, 
  ExternalLink, 
  Calendar, 
  Award, 
  Layers, 
  Scale, 
  Search, 
  Lightbulb,
  BookOpen,
  Info
} from "lucide-react";
import { CardContainer, CardBody, CardItem } from "./ui/card-3d";

interface SkillCheckerProps {
  formData: {
    firstName?: string;
    goal?: string;
    educationLevel?: string;
    fieldOfStudy?: string;
    skills?: string[];
    interests?: string[];
  };
  activeSkillsList: string[];
  setActiveSkillsList: React.Dispatch<React.SetStateAction<string[]>>;
}

// --------------------------------------------------------------------------------
// STATIC DATASETS & SYSTEM COMPLIANCE
// --------------------------------------------------------------------------------

const SUPPORTED_ROLES = [
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Developer",
  "AI Engineer",
  "ML Engineer",
  "Data Scientist"
];

const ROLE_SKILLS_MAP: Record<string, string[]> = {
  "Backend Engineer": ["Python", "SQL", "Node.js", "Docker", "System Design", "Go", "PostgreSQL", "Redis", "Kafka"],
  "Frontend Engineer": ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Next.js", "Tailwind CSS", "Redux", "GraphQL"],
  "Full Stack Developer": ["React", "Node.js", "JavaScript", "TypeScript", "SQL", "Python", "Docker", "Next.js", "Express"],
  "AI Engineer": ["Python", "PyTorch", "LLMs", "RAG Systems", "Vector Databases", "Prompt Engineering", "LangChain", "Agentic AI", "Model Context Protocol"],
  "ML Engineer": ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Docker", "SQL", "MLOps", "Pandas", "NumPy"],
  "Data Scientist": ["Python", "SQL", "Pandas", "NumPy", "Machine Learning", "Data Visualization", "Tableau", "Statistics", "Spark"]
};

interface EmergingSkill {
  name: string;
  growth: string;
  confidence: string;
  timeline: string;
  trend: "Exponential" | "High" | "Steady" | "Critical" | "Explosive";
}

const EMERGING_SKILLS_FORECAST: EmergingSkill[] = [
  { name: "Model Context Protocol", growth: "+310%", confidence: "94%", timeline: "3-9 months", trend: "Explosive" },
  { name: "Agentic AI", growth: "+240%", confidence: "91%", timeline: "12-24 months", trend: "Exponential" },
  { name: "AI Infrastructure", growth: "+190%", confidence: "92%", timeline: "18-24 months", trend: "Critical" },
  { name: "Synthetic Data", growth: "+175%", confidence: "88%", timeline: "12-18 months", trend: "High" },
  { name: "AI Evaluation", growth: "+150%", confidence: "86%", timeline: "6-12 months", trend: "Steady" },
  { name: "Vector Databases", growth: "+160%", confidence: "85%", timeline: "6-12 months", trend: "High" },
  { name: "AI Agents", growth: "+215%", confidence: "90%", timeline: "9-15 months", trend: "Exponential" },
  { name: "Multimodal Systems", growth: "+165%", confidence: "87%", timeline: "12-18 months", trend: "Steady" }
];

interface EmergingCareer {
  title: string;
  readiness: number;
  confidence: number;
  mainstreamYear: number;
  requiredSkills: string[];
  missingSkills: string[];
}

const EMERGING_CAREERS_DATA: EmergingCareer[] = [
  {
    title: "AI Alignment Engineer",
    readiness: 68,
    confidence: 91,
    mainstreamYear: 2027,
    requiredSkills: ["Python", "LLMs", "AI Evaluation", "PyTorch", "Statistics"],
    missingSkills: ["AI Evaluation", "LLMs"]
  },
  {
    title: "Synthetic Data Engineer",
    readiness: 74,
    confidence: 87,
    mainstreamYear: 2027,
    requiredSkills: ["Python", "Synthetic Data", "Pandas", "SQL", "Statistics"],
    missingSkills: ["Synthetic Data"]
  },
  {
    title: "LLM Ops Specialist",
    readiness: 55,
    confidence: 84,
    mainstreamYear: 2026,
    requiredSkills: ["Docker", "Vector Databases", "Python", "LLMs", "System Design"],
    missingSkills: ["Vector Databases", "LLMs"]
  },
  {
    title: "Climate ML Engineer",
    readiness: 42,
    confidence: 79,
    mainstreamYear: 2028,
    requiredSkills: ["Statistics", "PyTorch", "Machine Learning", "Python", "Data Visualization"],
    missingSkills: ["PyTorch", "Machine Learning"]
  },
  {
    title: "AI Infrastructure Architect",
    readiness: 48,
    confidence: 90,
    mainstreamYear: 2027,
    requiredSkills: ["AI Infrastructure", "Docker", "System Design", "Python"],
    missingSkills: ["AI Infrastructure"]
  },
  {
    title: "Neuro-AI Research Engineer",
    readiness: 35,
    confidence: 72,
    mainstreamYear: 2028,
    requiredSkills: ["Python", "PyTorch", "Statistics", "Machine Learning"],
    missingSkills: ["PyTorch", "Computational Neuroscience"]
  },
  {
    title: "Agent Systems Engineer",
    readiness: 71,
    confidence: 89,
    mainstreamYear: 2026,
    requiredSkills: ["Python", "Agentic AI", "Model Context Protocol", "System Design"],
    missingSkills: ["Agentic AI", "Model Context Protocol"]
  }
];

export function SkillChecker({ formData, activeSkillsList, setActiveSkillsList }: SkillCheckerProps) {
  const [activeCardDeepDive, setActiveCardDeepDive] = useState<number | null>(null);

  // --------------------------------------------------------------------------------
  // PARSING REAL ONBOARDED GOALS & PRESETS
  // --------------------------------------------------------------------------------
  const initialGoal = useMemo(() => {
    const rawGoal = (formData.goal || "").toLowerCase();
    if (rawGoal.includes("front")) return "Frontend Engineer";
    if (rawGoal.includes("full")) return "Full Stack Developer";
    if (rawGoal.includes("ai")) return "AI Engineer";
    if (rawGoal.includes("machine") || rawGoal.includes("ml")) return "ML Engineer";
    if (rawGoal.includes("data")) return "Data Scientist";
    return "Backend Engineer";
  }, [formData.goal]);

  const [dreamRole, setDreamRole] = useState<string>(() => {
    const saved = localStorage.getItem("career_gps_selected_dream_role");
    return saved || initialGoal;
  });

  const [isChangingGoal, setIsChangingGoal] = useState(false);

  // --------------------------------------------------------------------------------
  // REUSED SKILL AGE & DECAY TELEMETRY
  // --------------------------------------------------------------------------------
  const [skillAges, setSkillAges] = useState<Record<string, number>>(() => {
    const defaultAges: Record<string, number> = {
      "Python": 1,
      "React": 2,
      "SQL": 3,
      "Java": 6,
      "C++": 14,
      "Docker": 2,
      "TypeScript": 1,
      "System Design": 4
    };
    // Seed and guarantee state exists for any user-added skill
    activeSkillsList.forEach(s => {
      if (defaultAges[s] === undefined) {
        defaultAges[s] = 0; // standard newly touch point
      }
    });
    return defaultAges;
  });

  // Sync skillAges when active list custom items are modified
  useEffect(() => {
    setSkillAges(prev => {
      const updated = { ...prev };
      let changed = false;
      activeSkillsList.forEach(s => {
        if (updated[s] === undefined) {
          updated[s] = 0;
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [activeSkillsList]);

  // Skill Age modifications
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillAge, setNewSkillAge] = useState<number>(0);

  const handleAddNewSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newSkillName.trim();
    if (!cleanName) return;

    if (!activeSkillsList.includes(cleanName)) {
      setActiveSkillsList(prev => [...prev, cleanName]);
      setSkillAges(prev => ({
        ...prev,
        [cleanName]: newSkillAge
      }));
    }
    setNewSkillName("");
    setNewSkillAge(0);
    setShowAddModal(false);
  };

  const handleRemoveSkill = (skill: string) => {
    setActiveSkillsList(prev => prev.filter(s => s !== skill));
    setSkillAges(prev => {
      const next = { ...prev };
      delete next[skill];
      return next;
    });
  };

  const handleSelectGoal = (role: string) => {
    setDreamRole(role);
    localStorage.setItem("career_gps_selected_dream_role", role);
    setIsChangingGoal(false);
  };

  // --------------------------------------------------------------------------------
  // COMPUTED METRICS GENERATORS
  // --------------------------------------------------------------------------------

  // CARD 5: Decay Registry lists
  const decayRegistryData = useMemo(() => {
    const fresh: string[] = [];
    const atRisk: string[] = [];
    const decayed: string[] = [];

    activeSkillsList.forEach(skill => {
      const age = skillAges[skill] !== undefined ? skillAges[skill] : 0;
      if (age < 3) {
        fresh.push(skill);
      } else if (age < 12) {
        atRisk.push(skill);
      } else {
        decayed.push(skill);
      }
    });

    const averageAge = activeSkillsList.length > 0 
      ? activeSkillsList.reduce((acc, s) => acc + (skillAges[s] || 0), 0) / activeSkillsList.length
      : 2;

    const decayRiskScore = Math.min(100, Math.round((atRisk.length * 30 + decayed.length * 80) / Math.max(1, activeSkillsList.length)));

    return { fresh, atRisk, decayed, decayRiskScore };
  }, [activeSkillsList, skillAges]);

  // CARD 6: Gap Telemetry core requirements
  const gapTelemetryData = useMemo(() => {
    // Current Dream role required core
    const required = ROLE_SKILLS_MAP[dreamRole] || ROLE_SKILLS_MAP["Backend Engineer"];
    const matchedLower = activeSkillsList.map(s => s.toLowerCase());

    const critical: string[] = [];
    const important: string[] = [];
    const optional: string[] = [];

    required.forEach((skill, index) => {
      if (!matchedLower.includes(skill.toLowerCase())) {
        if (index < 3) {
          critical.push(skill);
        } else if (index < 6) {
          important.push(skill);
        } else {
          optional.push(skill);
        }
      }
    });

    const missingCount = critical.length + important.length + optional.length;
    const gapSeverityScore = Math.min(100, Math.round((critical.length * 20 + important.length * 10 + optional.length * 5)));

    return { critical, important, optional, gapSeverityScore, missingCount, required };
  }, [dreamRole, activeSkillsList]);

  // CARD 2: Goal Orbit core computations
  const goalOrbitData = useMemo(() => {
    const required = gapTelemetryData.required;
    const mastered: string[] = [];
    const partial: string[] = [];
    const missing: string[] = [];

    required.forEach(skill => {
      const activeIdx = activeSkillsList.findIndex(s => s.toLowerCase() === skill.toLowerCase());
      if (activeIdx !== -1) {
        const skillName = activeSkillsList[activeIdx];
        const age = skillAges[skillName] || 0;
        if (age < 4) {
          mastered.push(skillName);
        } else {
          partial.push(skillName);
        }
      } else {
        missing.push(skill);
      }
    });

    // Orbit completion score
    const totalRequired = required.length;
    const completedRequired = mastered.length + partial.length * 0.5;
    const orbitCompletionPercent = totalRequired > 0 
      ? Math.round((completedRequired / totalRequired) * 100)
      : 50;

    const estimatedTimeToGoal = missing.length > 0 
      ? `${missing.length * 3} Weeks`
      : "1 Week";

    return { mastered, partial, missing, orbitCompletionPercent, estimatedTimeToGoal };
  }, [activeSkillsList, skillAges, gapTelemetryData]);

  // CARD 3: Credentials proof scoring
  const credentialsData = useMemo(() => {
    const numFiles = activeSkillsList.length;
    const hasGitHub = numFiles > 3;
    const hasProjects = numFiles > 2;

    const scores = {
      projects: hasProjects ? "Strong" : "Medium",
      github: hasGitHub ? "Medium" : "Weak",
      certificates: numFiles > 5 ? "Strong" : "Weak",
      portfolio: hasProjects && hasGitHub ? "Strong" : "Medium"
    };

    let totalPoints = 0;
    if (scores.projects === "Strong") totalPoints += 30;
    else totalPoints += 15;

    if (scores.github === "Strong") totalPoints += 25;
    else if (scores.github === "Medium") totalPoints += 18;
    else totalPoints += 10;

    if (scores.certificates === "Strong") totalPoints += 20;
    else totalPoints += 8;

    if (scores.portfolio === "Strong") totalPoints += 25;
    else totalPoints += 12;

    return { scores, credentialStrengthScore: totalPoints };
  }, [activeSkillsList]);

  // CARD 4: Calibration Scale mapping
  const calibrationData = useMemo(() => {
    const futureProofSet = ["python", "pytorch", "llms", "rag systems", "vector databases", "agentic ai", "model context protocol", "typescript", "next.js", "tailwind css"];
    const stableSet = ["react", "javascript", "sql", "node.js", "docker", "postgresql", "system design", "go", "git", "statistics"];
    const saturatedSet = ["css", "html", "redux", "figma", "bootstrap"];
    const decliningSet = ["jquery", "subversion", "php 5"];

    const futureProof: string[] = [];
    const stable: string[] = [];
    const saturated: string[] = [];
    const declining: string[] = [];

    activeSkillsList.forEach(s => {
      const lower = s.toLowerCase();
      if (futureProofSet.includes(lower)) futureProof.push(s);
      else if (stableSet.includes(lower)) stable.push(s);
      else if (saturatedSet.includes(lower)) saturated.push(s);
      else if (decliningSet.includes(lower)) declining.push(s);
      else stable.push(s); // fallback standard
    });

    const numerator = futureProof.length * 100 + stable.length * 80 + saturated.length * 50 + declining.length * 15;
    const count = activeSkillsList.length;
    const marketCalibrationScore = count > 0 ? Math.round(numerator / count) : 82;

    return { futureProof, stable, saturated, declining, marketCalibrationScore };
  }, [activeSkillsList]);

  // Active recall simulate refreshing
  const handleSimulateAgeDecay = () => {
    const randomized = { ...skillAges };
    activeSkillsList.forEach(s => {
      randomized[s] = Math.max(0, Math.floor(Math.random() * 20));
    });
    setSkillAges(randomized);
  };

  // --------------------------------------------------------------------------------
  // MAIN RENDERING INTERFACE
  // --------------------------------------------------------------------------------
  return (
    <div className="space-y-10 min-h-screen pb-16" id="sensai-skill-checker-engine">
      
      {/* GLOWING AMBIENT TOP BANNER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#041226]/90 to-[#020b18]/90 border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0088ff]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#ffcc00]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0088ff]/10 border border-[#0088ff]/20 text-[#00d2ff] text-[10px] font-black uppercase tracking-widest shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#ffcc00] animate-pulse" />
              SensaI // Skill Intelligence Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none font-sans">
              Skill Checker Workspace
            </h1>
            <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
              Analyze your competencies and forecast market relevance using our interactive 3D telemetry console. Click any card below to launch deep calculations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <HighlightButton
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0088ff] hover:bg-[#0077ee] text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </HighlightButton>
            <HighlightButton
              onClick={handleSimulateAgeDecay}
              className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-[#ffcc00] font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Simulate Decay
            </HighlightButton>
          </div>
        </div>
      </div>

      {/* QUICK INVENTORY DRAWER/STATUS */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Briefcase className="w-4.5 h-4.5 text-[#ffcc00]" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black text-white/40 tracking-widest">Active Horizon Target</div>
            <div className="text-sm font-black text-white tracking-wide">{dreamRole}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-xs text-white/50">Active Inventory ({activeSkillsList.length}):</div>
          <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto">
            {activeSkillsList.map(skill => {
              const age = skillAges[skill] || 0;
              return (
                <div 
                  key={skill} 
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase border flex items-center gap-1.5 ${
                    age < 3 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : age < 12 
                        ? 'bg-[#ffcc00]/10 border-[#ffcc00]/20 text-[#ffcc00]'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  }`}
                >
                  {skill}
                  <button 
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {isChangingGoal ? (
            <div className="flex items-center gap-1.5">
              {SUPPORTED_ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => handleSelectGoal(role)}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    dreamRole === role 
                      ? 'bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00]/30' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          ) : (
            <HighlightButton 
              onClick={() => setIsChangingGoal(true)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase text-[#ffcc00] tracking-wider hover:bg-white/10"
            >
              Toggle Goal
            </HighlightButton>
          )}
        </div>
      </div>

      {/* DETAILED MODAL PORTAL WINDOW FOR CARDS */}
      <div className="relative">
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm bg-gradient-to-br from-[#0c1f38] to-[#041226] border border-white/15 rounded-3xl p-6 shadow-2xl relative">
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">Add Competency Parameter</h3>
              <form onSubmit={handleAddNewSkill} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Skill Name</label>
                  <input
                    type="text"
                    placeholder="Enter skill (e.g. LLMs, Redis, Scala)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 text-white font-semibold rounded-xl p-3 outline-none focus:border-[#ffcc00]/50 text-sm"
                    required
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-white/50 tracking-wider">
                    <span>Recency Metrics</span>
                    <span className="text-[#ffcc00] font-mono">{newSkillAge} {newSkillAge === 0 ? 'Recently (Fresh)' : `${newSkillAge} Months ago`}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={newSkillAge}
                    onChange={(e) => setNewSkillAge(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ffcc00]"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-white/30">
                    <span>0m (ACTIVE)</span>
                    <span>12m</span>
                    <span>24m (DECAYED)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#ffcc00] hover:bg-white text-[#092c5c] font-black rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Insert to Inventory
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 21st.dev INTEGRATED 3D NAVIGATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="animated-3d-checker-grid">
        
        {/* CARD 1: EMERGING SKILLS + CAREERS (Flagship with Visual Emphasis & Stronger Glow) */}
        <CardContainer containerClassName="w-full" className="w-full group">
          <CardBody className="w-full h-full min-h-[440px] bg-gradient-to-br from-[#0c2240] to-[#041226] border-2 border-[#ffcc00]/40 group-hover:border-[#ffcc00]/80 rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 relative shadow-[0_0_35px_rgba(255,204,0,0.15)] group-hover:shadow-[0_0_45px_rgba(255,204,0,0.3)] select-none">
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffcc00]/10 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="px-3 py-1 rounded-full bg-[#ffcc00]/15 border border-[#ffcc00]/30 text-[#ffcc00] text-[9px] font-black uppercase tracking-widest animate-pulse">
                  Flagship Module
                </div>
                <Brain className="w-5 h-5 text-[#ffcc00]" />
              </div>

              <CardItem translateZ={50}>
                <h3 className="text-2xl font-black text-white hover:text-[#ffcc00] transition-colors leading-tight uppercase font-sans tracking-tight">
                  Emerging Skills<br />& Careers
                </h3>
              </CardItem>

              <CardItem translateZ={30} className="text-xs text-[#eeddaa] font-medium leading-relaxed">
                Predict emerging skills and careers before they become mainstream and measure readiness against future opportunities. Models occupational drifting logs.
              </CardItem>

              {/* Mini Preview telemetry */}
              <div className="pt-2 space-y-1.5 font-mono text-[10px] text-white/55">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffcc00] animate-ping" />
                  <span>Signals: ArXiv, Gists, Vocabulary Drift</span>
                </div>
                <div className="text-white/40">Model Context Protocol, Agentic AI (+310% growth)</div>
              </div>
            </div>

            <button
              onClick={() => setActiveCardDeepDive(1)}
              className="mt-6 w-full py-3 bg-[#ffcc00] hover:bg-white text-[#041226] font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#ffcc00]/25 group-hover:translate-y-[-2px]"
            >
              Analyze Forecaster
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardBody>
        </CardContainer>

        {/* CARD 2: GOAL ORBIT */}
        <CardContainer containerClassName="w-full" className="w-full group">
          <CardBody className="w-full h-full min-h-[440px] bg-gradient-to-br from-[#071d34] to-[#030e1c] border border-white/10 group-hover:border-[#0088ff]/50 rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 relative shadow-2xl select-none">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0088ff]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest font-mono">Module 02 // Horizon</span>
                <Cpu className="w-5 h-5 text-[#0088ff]" />
              </div>

              <CardItem translateZ={50}>
                <h3 className="text-2xl font-black text-white leading-tight uppercase font-sans tracking-tight">
                  Goal Orbit<br />Resonance
                </h3>
              </CardItem>

              <CardItem translateZ={30} className="text-xs text-neutral-300 leading-relaxed font-normal">
                Observe concentric structural layers directly mapping completed, partial, or completely missing competencies aligned with target careers.
              </CardItem>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <div className="text-[#00d2ff] font-mono text-xl font-black">{goalOrbitData.orbitCompletionPercent}%</div>
                  <div className="text-[8px] font-mono uppercase text-white/30 tracking-widest">Orbit Resonance</div>
                </div>
                <div>
                  <div className="text-amber-300 font-mono text-sm font-bold">{goalOrbitData.estimatedTimeToGoal}</div>
                  <div className="text-[8px] font-mono uppercase text-white/30 tracking-widest">Est. Convergence</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveCardDeepDive(2)}
              className="mt-6 w-full py-3 bg-white/5 border border-white/10 group-hover:bg-[#0088ff]/20 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Examine Orbit
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardBody>
        </CardContainer>

        {/* CARD 3: CREDENTIALS */}
        <CardContainer containerClassName="w-full" className="w-full group">
          <CardBody className="w-full h-full min-h-[440px] bg-gradient-to-br from-[#071d34] to-[#030e1c] border border-white/10 group-hover:border-[#0088ff]/50 rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 relative shadow-2xl select-none">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d2ff]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest font-mono">Module 03 // Audit</span>
                <Award className="w-5 h-5 text-[#00d2ff]" />
              </div>

              <CardItem translateZ={50}>
                <h3 className="text-2xl font-black text-white leading-tight uppercase font-sans tracking-tight">
                  Credentials<br />Evaluator
                </h3>
              </CardItem>

              <CardItem translateZ={30} className="text-xs text-neutral-300 leading-relaxed font-normal">
                Analyze projects, certificates, interactive GitHub pipelines, and active proof of competencies to secure credible engineering verification.
              </CardItem>

              {/* Status checklist preview */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[9px] font-mono uppercase text-white/60">
                <div className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Projects: Strong
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  GitHub: Medium
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveCardDeepDive(3)}
              className="mt-6 w-full py-3 bg-white/5 border border-white/10 group-hover:bg-[#00d2ff]/20 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Verify Credentials
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardBody>
        </CardContainer>

        {/* CARD 4: CALIBRATION SCALE */}
        <CardContainer containerClassName="w-full" className="w-full group">
          <CardBody className="w-full h-full min-h-[440px] bg-gradient-to-br from-[#071d34] to-[#030e1c] border border-white/10 group-hover:border-[#0088ff]/50 rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 relative shadow-2xl select-none">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest font-mono">Module 04 // Velocity</span>
                <Scale className="w-5 h-5 text-purple-400" />
              </div>

              <CardItem translateZ={50}>
                <h3 className="text-2xl font-black text-white leading-tight uppercase font-sans tracking-tight">
                  Calibration<br />Scale
                </h3>
              </CardItem>

              <CardItem translateZ={30} className="text-xs text-neutral-300 leading-relaxed font-normal">
                Measure physical industry viability of your credentials. Maps active assets into Future-Proof, Stable, Saturated or Declining quadrants.
              </CardItem>

              <div className="pt-2 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[8px] uppercase text-white/30 tracking-widest block">QUADRANT BIAS</span>
                  <span className="text-xs font-bold text-purple-400">FUTURE-PROOF MATRIX</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-white/30 tracking-widest block font-bold">SCORE</span>
                  <span className="text-md font-black text-white">{calibrationData.marketCalibrationScore}/100</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveCardDeepDive(4)}
              className="mt-6 w-full py-3 bg-white/5 border border-white/10 group-hover:bg-[#0088ff]/20 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Gauge Relevance
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardBody>
        </CardContainer>

        {/* CARD 5: DECAY REGISTRY */}
        <CardContainer containerClassName="w-full" className="w-full group">
          <CardBody className="w-full h-full min-h-[440px] bg-gradient-to-br from-[#071d34] to-[#030e1c] border border-white/10 group-hover:border-[#0088ff]/50 rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 relative shadow-2xl select-none">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest font-mono">Module 05 // Memory</span>
                <Activity className="w-5 h-5 text-rose-400" />
              </div>

              <CardItem translateZ={50}>
                <h3 className="text-2xl font-black text-white leading-tight uppercase font-sans tracking-tight">
                  Decay<br />Registry
                </h3>
              </CardItem>

              <CardItem translateZ={30} className="text-xs text-neutral-300 leading-relaxed font-normal">
                A non-repetitive intelligence snapshot. Maps Ebbinghaus memory curve tracking retention rates and triggering prioritization signals.
              </CardItem>

              <div className="pt-2 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[8px] uppercase text-white/30 tracking-widest block">DECAY RISK</span>
                  <span className={`text-xs font-bold ${decayRegistryData.decayRiskScore > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {decayRegistryData.decayRiskScore > 40 ? 'CRITICAL RISK' : 'NOMINAL SEVERITY'}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-white/30 tracking-widest block">AT RISK</span>
                  <span className="text-md font-black text-white">{decayRegistryData.atRisk.length} Assets</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveCardDeepDive(5)}
              className="mt-6 w-full py-3 bg-white/5 border border-white/10 group-hover:bg-[#0088ff]/20 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Analyze Decay
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardBody>
        </CardContainer>

        {/* CARD 6: GAP TELEMETRY */}
        <CardContainer containerClassName="w-full" className="w-full group">
          <CardBody className="w-full h-full min-h-[440px] bg-gradient-to-br from-[#071d34] to-[#030e1c] border border-white/10 group-hover:border-[#0088ff]/50 rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 relative shadow-2xl select-none">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-white/40 tracking-widest font-mono">Module 06 // Telemetry</span>
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>

              <CardItem translateZ={50}>
                <h3 className="text-2xl font-black text-white leading-tight uppercase font-sans tracking-tight">
                  Gap<br />Telemetry
                </h3>
              </CardItem>

              <CardItem translateZ={30} className="text-xs text-neutral-300 leading-relaxed font-normal">
                Unveil critical capability voids standing between your current active credentials and dream hiring profiles. Features learning sequence filters.
              </CardItem>

              <div className="pt-2 flex items-center justify-between font-mono">
                <div>
                  <span className="text-[8px] uppercase text-white/30 tracking-widest block">CRITICAL GAPS</span>
                  <span className="text-xs font-bold text-rose-400 font-mono uppercase">{gapTelemetryData.critical.length} Critical</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase text-white/30 tracking-widest block font-bold">SEVERITY</span>
                  <span className="text-md font-black text-[#ffcc00]">{gapTelemetryData.gapSeverityScore}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveCardDeepDive(6)}
              className="mt-6 w-full py-3 bg-white/5 border border-white/10 group-hover:bg-[#0088ff]/20 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Analyze Gap Severity
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardBody>
        </CardContainer>

      </div>

      {/* FULL DETAILED OVERLAY SECTION PANELS FOR CORE DEEP DIVES */}
      <AnimatePresence>
        {activeCardDeepDive !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 md:p-8 overflow-y-auto pt-[100px] pb-12"
            id="deep-dive-overlay-container"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-gradient-to-br from-[#08172c] to-[#010710] border border-white/15 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Overlay Accents */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#0088ff]/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

              {/* Header */}
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    {activeCardDeepDive === 1 && <Brain className="w-6 h-6 text-[#ffcc00] animate-pulse" />}
                    {activeCardDeepDive === 2 && <Cpu className="w-6 h-6 text-[#0088ff]" />}
                    {activeCardDeepDive === 3 && <Award className="w-6 h-6 text-[#00d2ff]" />}
                    {activeCardDeepDive === 4 && <Scale className="w-6 h-6 text-purple-400" />}
                    {activeCardDeepDive === 5 && <Activity className="w-6 h-6 text-rose-400" />}
                    {activeCardDeepDive === 6 && <Layers className="w-6 h-6 text-emerald-400" />}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                      {activeCardDeepDive === 1 && "Emerging Skills & Careers Forecast"}
                      {activeCardDeepDive === 2 && "Goal Orbit Analysis"}
                      {activeCardDeepDive === 3 && "Credentials proof assessment"}
                      {activeCardDeepDive === 4 && "Market Calibration scale"}
                      {activeCardDeepDive === 5 && "Decay Registry Snapshot"}
                      {activeCardDeepDive === 6 && "Gap Telemetry console"}
                    </h2>
                    <p className="text-xs text-white/50 font-mono">
                      {activeCardDeepDive === 1 && "PREDICTING MACRO-OCCUPATIONAL TRENDS & SIGNAL DEPLOYMENTS"}
                      {activeCardDeepDive === 2 && "MAPPING PLANETARY SYSTEM DISTANCES ALIGNED WITH GOALS"}
                      {activeCardDeepDive === 3 && "VERIFYING PORTFOLIO INTENSITY, COURSE MATRIX & GIT HISTORY"}
                      {activeCardDeepDive === 4 && "QUADRANT VELOCITIES BASED ON WORLDWIDE DEMAND METRICS"}
                      {activeCardDeepDive === 5 && "REUSING ACTIVE INVENTORY COMPACT RETENTION COEFFICIENTS"}
                      {activeCardDeepDive === 6 && "DETERMINING SYSTEM GAP COMPLIANCE & STUDY RETENTION STEPS"}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveCardDeepDive(null)}
                  className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Content scrollable body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-8 relative z-10 flex-1 scrollbar-thin scrollbar-thumb-white/10">
                
                {/* DETAIL VIEW 1: EMERGING SKILLS + CAREERS */}
                {activeCardDeepDive === 1 && (
                  <div className="space-y-8" id="deep-dive-emerging-skills-dashboard">
                    <div className="p-5 rounded-2xl bg-[#ffcc00]/5 border border-[#ffcc00]/15 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#ffcc00]">
                        <Info className="w-4 h-4" />
                        FLAGSHIP PREDICTIONS ENGINE ACTIVE
                      </div>
                      <p className="text-xs text-[#eeddaa] leading-relaxed">
                        Conceptually trained on <strong>ArXiv Publication Trends</strong>, <strong>GitHub Repository Momentum Indices</strong>, <strong>Startup Funding Signals</strong>, and <strong>Occupational Outlook Surveys</strong>. Displays anticipated demand horizons before conventional jobs list integration.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-2">I. Future-Ready Skills</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EMERGING_SKILLS_FORECAST.map(skill => (
                          <div key={skill.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex justify-between items-center">
                            <div>
                              <div className="text-sm font-black text-white">{skill.name}</div>
                              <div className="text-[10px] font-mono text-white/40">Growth Direction: <span className="text-[#ffcc00] font-bold">{skill.trend}</span></div>
                            </div>
                            <div className="text-right font-mono">
                              <div className="text-[#ffcc00] font-black text-sm">{skill.growth}</div>
                              <div className="text-[9px] text-white/50">Timeline: {skill.timeline}</div>
                              <div className="text-[8px] text-[#00d2ff] uppercase font-bold">Confidence: {skill.confidence}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-2">II. Anticipated Engineering Careers</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {EMERGING_CAREERS_DATA.map(career => (
                          <div key={career.title} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row justify-between gap-4">
                            <div className="space-y-2 max-w-md">
                              <h4 className="text-base font-black text-white uppercase tracking-tight">{career.title}</h4>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                <span className="text-[8px] font-black uppercase text-white/40 block w-full mb-1">Prerequisite Spectrum</span>
                                {career.requiredSkills.map(s => {
                                  const userHas = activeSkillsList.some(as => as.toLowerCase() === s.toLowerCase());
                                  return (
                                    <span key={s} className={`px-2 py-0.5 rounded text-[9px] font-bold ${userHas ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'}`}>
                                      {s} {userHas && "✓"}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="flex items-center gap-6 font-mono text-xs text-right">
                              <div>
                                <div className="text-[#ffcc00] font-black">{career.readiness}%</div>
                                <div className="text-[8px] text-white/30 uppercase">Readiness</div>
                              </div>
                              <div>
                                <div className="text-[#00d2ff] font-black">{career.confidence}%</div>
                                <div className="text-[8px] text-white/30 uppercase">Signal Confidence</div>
                              </div>
                              <div>
                                <div className="text-white font-black">{career.mainstreamYear}</div>
                                <div className="text-[8px] text-white/30 uppercase">Mainstream</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* DETAIL VIEW 2: GOAL ORBIT (Orbit diagram and visual mapping) */}
                {activeCardDeepDive === 2 && (
                  <div className="space-y-6" id="deep-dive-goal-orbit-dashboard">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      
                      {/* Interactive CSS & SVG Space Orbit Visualization */}
                      <div className="relative w-full max-w-[320px] mx-auto h-[320px] rounded-full border border-dashed border-white/5 flex items-center justify-center p-4">
                        
                        {/* Orbit Circles */}
                        <div className="absolute w-[280px] h-[280px] rounded-full border border-spaced border-white/10 animate-spin-slow" />
                        <div className="absolute w-[190px] h-[190px] rounded-full border border-dotted border-white/15 animate-spin-reverse" />
                        <div className="absolute w-[100px] h-[100px] rounded-full border border-dashed border-[#0088ff]/20" />
                        
                        {/* Mastered Node orbits (Layer 1) */}
                        {goalOrbitData.mastered.slice(0, 3).map((item, idx) => (
                          <div 
                            key={item} 
                            style={{
                              transform: `rotate(${idx * 120}deg) translateY(-50px) rotate(-${idx * 120}deg)`
                            }}
                            className="absolute px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded text-[9px] text-emerald-300 font-bold font-mono uppercase"
                          >
                            {item}
                          </div>
                        ))}

                        {/* Partial Node orbits (Layer 2) */}
                        {goalOrbitData.partial.slice(0, 3).map((item, idx) => (
                          <div 
                            key={item} 
                            style={{
                              transform: `rotate(${idx * 120 + 45}deg) translateY(-95px) rotate(-(${idx * 120 + 45})deg)`
                            }}
                            className="absolute px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded text-[9px] text-amber-300 font-bold font-mono uppercase"
                          >
                            {item}
                          </div>
                        ))}

                        {/* Missing Node orbits (Layer 3) */}
                        {goalOrbitData.missing.slice(0, 4).map((item, idx) => (
                          <div 
                            key={item} 
                            style={{
                              transform: `rotate(${idx * 90 + 30}deg) translateY(-140px) rotate(-(${idx * 90 + 30})deg)`
                            }}
                            className="absolute px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[9px] text-zinc-400 font-bold font-mono uppercase"
                          >
                            {item}
                          </div>
                        ))}

                        {/* Core center planet */}
                        <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-[#0c2240] to-black border-2 border-[#0088ff] rounded-full flex flex-col items-center justify-center text-center p-2 shadow-[0_0_15px_rgba(0,136,255,0.4)]">
                          <Zap className="w-4 h-4 text-[#ffcc00] animate-pulse" />
                          <div className="text-[8px] font-black text-white uppercase tracking-tight truncate max-w-full">
                            {dreamRole.split(" ")[0]}
                          </div>
                          <div className="text-[7px] text-[#ffcc00] font-bold uppercase tracking-widest text-[5px]">TARGET CORE</div>
                        </div>
                      </div>

                      {/* Summary Data */}
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <div className="text-xs uppercase font-black text-white/40 tracking-widest font-mono">Orbit Alignment Diagnostics</div>
                          <h3 className="text-xl font-black text-white uppercase tracking-tight">{dreamRole} Goal Sphere</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 font-mono text-sm leading-none pt-2">
                          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-[8px] uppercase text-white/40 block mb-1">Estimated Journey</span>
                            <span className="text-white font-black text-base">{goalOrbitData.estimatedTimeToGoal}</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-[8px] uppercase text-white/40 block mb-1">Compliance Rate</span>
                            <span className="text-[#0088ff] font-black text-base">{goalOrbitData.orbitCompletionPercent}%</span>
                          </div>
                        </div>

                        <div className="space-y-3.5">
                          <div>
                            <div className="text-[9px] uppercase font-black text-emerald-400/80 mb-1.5 tracking-wider">Level 1: Already Mastered ({goalOrbitData.mastered.length})</div>
                            <div className="flex flex-wrap gap-1">
                              {goalOrbitData.mastered.map(s => (
                                <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 uppercase">{s}</span>
                              ))}
                              {goalOrbitData.mastered.length === 0 && <span className="text-[10px] text-white/30 italic">No exact target skills mastered in inventory yet.</span>}
                            </div>
                          </div>

                          <div>
                            <div className="text-[9px] uppercase font-black text-[#ffcc00]/80 mb-1.5 tracking-wider">Level 2: Partially Developed ({goalOrbitData.partial.length})</div>
                            <div className="flex flex-wrap gap-1">
                              {goalOrbitData.partial.map(s => (
                                <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffcc00]/10 border border-[#ffcc00]/20 text-[#ffcc00] uppercase">{s}</span>
                              ))}
                              {goalOrbitData.partial.length === 0 && <span className="text-[10px] text-white/30 italic">No partial status skills.</span>}
                            </div>
                          </div>

                          <div>
                            <div className="text-[9px] uppercase font-black text-zinc-400 mb-1.5 tracking-wider">Level 3: Critical Void Gaps ({goalOrbitData.missing.length})</div>
                            <div className="flex flex-wrap gap-1">
                              {goalOrbitData.missing.map(s => (
                                <span key={s} className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/5 text-zinc-400 uppercase">{s}</span>
                              ))}
                              {goalOrbitData.missing.length === 0 && <span className="text-[10px] text-emerald-300 italic">Excellent! Zero critical voids remaining.</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* DETAIL VIEW 3: CREDENTIALS */}
                {activeCardDeepDive === 3 && (
                  <div className="space-y-6" id="deep-dive-credentials-dashboard">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-none font-mono">
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                        <h4 className="text-white/50 text-[10px] uppercase font-black tracking-widest">Dimension Power Matrix</h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white uppercase font-bold">Active Projects</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${credentialsData.scores.projects === "Strong" ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"}`}>
                              {credentialsData.scores.projects}
                            </span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: credentialsData.scores.projects === "Strong" ? "90%" : "60%" }} />
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white uppercase font-bold">Commit Frequency (GitHub)</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500/10 text-amber-300">
                              {credentialsData.scores.github}
                            </span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full" style={{ width: "65%" }} />
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white uppercase font-bold">Active Certifications</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${credentialsData.scores.certificates === "Strong" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
                              {credentialsData.scores.certificates}
                            </span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full" style={{ width: credentialsData.scores.certificates === "Strong" ? "80%" : "30%" }} />
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="text-white uppercase font-bold">Deployable Portfolio</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-300">
                              Strong
                            </span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full" style={{ width: "90%" }} />
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#0088ff]/5 border border-[#0088ff]/10 flex flex-col justify-between">
                        <div>
                          <div className="text-[9px] uppercase font-black text-[#00d2ff] tracking-widest">Aggregate Diagnostic Strength</div>
                          <div className="text-4xl font-black text-white mt-1">{credentialsData.credentialStrengthScore}<span className="text-xs text-white/30 font-normal">/100 PTS</span></div>
                          <div className="text-[10px] text-white/50 leading-relaxed mt-2 uppercase">
                            Calculated dynamically based on size of custom active inventory, commit profiles, and project validations. Recommended benchmarks below.
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 space-y-2">
                          <div className="text-[8px] font-black uppercase tracking-widest text-[#ffcc00]">Recommended Optimization steps</div>
                          <ul className="text-[10px] text-neutral-300 space-y-1">
                            <li>• Add a new deployable production code to active portfolio</li>
                            <li>• Deploy a full-stack {dreamRole} codebase directly to Cloud hosting</li>
                            <li>• Complete corresponding active cert benchmarks to strengthen credentials</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DETAIL VIEW 4: CALIBRATION SCALE */}
                {activeCardDeepDive === 4 && (
                  <div className="space-y-6" id="deep-dive-calibration-dashboard">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 leading-none font-mono text-center">
                      
                      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
                        <div className="p-2 bg-cyan-500/15 w-8 h-8 rounded-lg mx-auto flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="text-[10px] font-black text-cyan-300">FUTURE-PROOF</div>
                        <div className="text-sm font-black text-white">{calibrationData.futureProof.length}</div>
                        <div className="text-[8px] text-white/40 uppercase">Highly Resistant</div>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                        <div className="p-2 bg-emerald-500/15 w-8 h-8 rounded-lg mx-auto flex items-center justify-center">
                          <Check className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-[10px] font-black text-emerald-300">STABLE</div>
                        <div className="text-sm font-black text-white">{calibrationData.stable.length}</div>
                        <div className="text-[8px] text-white/40 uppercase">Secured Demand</div>
                      </div>

                      <div className="p-4 rounded-xl bg-[#ffcc00]/5 border border-[#ffcc00]/20 space-y-2">
                        <div className="p-2 bg-[#ffcc00]/15 w-8 h-8 rounded-lg mx-auto flex items-center justify-center">
                          <Info className="w-4 h-4 text-[#ffcc00]" />
                        </div>
                        <div className="text-[10px] font-black text-[#ffcc00]">SATURATED</div>
                        <div className="text-sm font-black text-white">{calibrationData.saturated.length}</div>
                        <div className="text-[8px] text-white/40 uppercase">High Competition</div>
                      </div>

                      <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                        <div className="p-2 bg-rose-500/15 w-8 h-8 rounded-lg mx-auto flex items-center justify-center">
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="text-[10px] font-black text-rose-300">DECLINING</div>
                        <div className="text-sm font-black text-white">{calibrationData.declining.length}</div>
                        <div className="text-[8px] text-white/40 uppercase">Deprecating</div>
                      </div>

                    </div>

                    <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-xs uppercase font-black text-white/60">Quadrants Assets Breakdown</span>
                        <span className="text-xs font-mono text-purple-400">Market Calibration Score: {calibrationData.marketCalibrationScore}/100</span>
                      </div>

                      <div className="space-y-3 text-xs leading-normal">
                        <div>
                          <strong className="text-cyan-300 uppercase block mb-1">Future-Ready Quadrant:</strong>
                          <div className="flex flex-wrap gap-1">
                            {calibrationData.futureProof.map(s => <span key={s} className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/20 rounded font-mono uppercase text-[10px]">{s}</span>)}
                            {calibrationData.futureProof.length === 0 && <span className="text-white/30 italic font-mono text-[10px]">None. Incorporate emerging AI skills list parameters.</span>}
                          </div>
                        </div>

                        <div>
                          <strong className="text-emerald-300 uppercase block mb-1">Stable Quadrant:</strong>
                          <div className="flex flex-wrap gap-1">
                            {calibrationData.stable.map(s => <span key={s} className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/20 rounded font-mono uppercase text-[10px]">{s}</span>)}
                            {calibrationData.stable.length === 0 && <span className="text-white/30 italic font-mono text-[10px]">None active.</span>}
                          </div>
                        </div>

                        <div>
                          <strong className="text-[#ffcc00] uppercase block mb-1">Saturated Quadrant:</strong>
                          <div className="flex flex-wrap gap-1">
                            {calibrationData.saturated.map(s => <span key={s} className="px-2 py-0.5 bg-yellow-950 text-[#ffcc00] border border-[#ffcc00]/20 rounded font-mono uppercase text-[10px]">{s}</span>)}
                            {calibrationData.saturated.length === 0 && <span className="text-white/30 italic font-mono text-[10px]">No saturated layout tags.</span>}
                          </div>
                        </div>

                        <div>
                          <strong className="text-rose-400 uppercase block mb-1">Declining Quadrant:</strong>
                          <div className="flex flex-wrap gap-1">
                            {calibrationData.declining.map(s => <span key={s} className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-500/20 rounded font-mono uppercase text-[10px]">{s}</span>)}
                            {calibrationData.declining.length === 0 && <span className="text-white/30 italic font-mono text-[10px]">None. Perfect! You do not harbor legacy deprecated assets.</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DETAIL VIEW 5: DECAY REGISTRY (snapshot of decay calculations) */}
                {activeCardDeepDive === 5 && (
                  <div className="space-y-6" id="deep-dive-decay-dashboard">
                    <div className="p-5 rounded-2xl bg-rose-950/10 border border-rose-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                        <Activity className="w-4 h-4" />
                        COMPACT RECALL ENGINESnap
                      </div>
                      <p className="text-xs text-rose-100/70 leading-relaxed uppercase font-mono">
                        Calculates memory decay factors using Ebbinghaus recall algorithms. Compares time since last touched against knowledge retention scales. Reuses active decay metrics.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs leading-none">
                      <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Active retention categorization</span>
                        
                        <div className="space-y-3.5">
                          <div>
                            <div className="text-emerald-400 font-bold uppercase tracking-wider mb-1">Fresh (touches &lt; 3 Months ago)</div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {decayRegistryData.fresh.map(s => <span key={s} className="px-2 py-1 bg-emerald-500/10 text-emerald-300 rounded text-[10px]">{s}</span>)}
                              {decayRegistryData.fresh.length === 0 && <span className="text-white/30 italic font-mono text-[10px]">Zero fresh skills.</span>}
                            </div>
                          </div>

                          <div>
                            <div className="text-amber-400 font-bold uppercase tracking-wider mb-1">At Risk (touches 3 to 12 Months ago)</div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {decayRegistryData.atRisk.map(s => <span key={s} className="px-2 py-1 bg-amber-500/10 text-amber-300 rounded text-[10px]">{s}</span>)}
                              {decayRegistryData.atRisk.length === 0 && <span className="text-white/30 italic font-mono text-[10px]">Zero aging skills.</span>}
                            </div>
                          </div>

                          <div>
                            <div className="text-rose-400 font-bold uppercase tracking-wider mb-1">Decayed (touches &gt; 12 Months ago)</div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {decayRegistryData.decayed.map(s => <span key={s} className="px-2 py-1 bg-rose-500/10 text-rose-300 rounded text-[10px]">{s}</span>)}
                              {decayRegistryData.decayed.length === 0 && <span className="text-white/30 italic font-mono text-[10px]">Zero decayed database parameters.</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                        <span className="text-[10px] font-black w-full block text-white/40 uppercase tracking-widest">Active Recall optimization Sequence</span>
                        
                        <div className="space-y-4 font-mono">
                          <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20">
                            <div className="text-[#00d2ff] font-black uppercase text-[9px] tracking-wider mb-0.5">Priority 01: Fresh recall trigger</div>
                            <p className="text-[10px] text-white/70 uppercase leading-relaxed">
                              Revive decayed components ({decayRegistryData.decayed.join(", ") || "None"}) immediately using deep technical project deployments to restore retention parameters.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                            <div className="text-[#ffcc00] font-black uppercase text-[9px] tracking-wider mb-0.5 font-bold">Priority 02: Risk mitigation scale</div>
                            <p className="text-[10px] text-white/70 uppercase leading-relaxed font-normal">
                              Initiate small sandbox builds for at risk skills ({decayRegistryData.atRisk.slice(0, 2).join(", ") || "None"}) within next 14 business cycles.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DETAIL VIEW 6: GAP TELEMETRY */}
                {activeCardDeepDive === 6 && (
                  <div className="space-y-6" id="deep-dive-gap-dashboard">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-center">
                      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-1">
                        <div className="text-sm font-black text-rose-400">{gapTelemetryData.critical.length}</div>
                        <div className="text-[8px] text-white/40 uppercase tracking-widest font-black">CRITICAL GAPS</div>
                      </div>
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                        <div className="text-sm font-black text-amber-300">{gapTelemetryData.important.length}</div>
                        <div className="text-[8px] text-white/40 uppercase tracking-widest font-black">IMPORTANT GAPS</div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-500/5 border border-zinc-500/20 space-y-1">
                        <div className="text-sm font-black text-zinc-300">{gapTelemetryData.optional.length}</div>
                        <div className="text-[8px] text-white/40 uppercase tracking-widest font-black">SUPPORTING GAPS</div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-5">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono text-xs">
                        <span className="uppercase font-black text-white/50">Comparative metrics vs target requirements</span>
                        <span className="text-rose-400 font-bold uppercase">{gapTelemetryData.gapSeverityScore}% Gap Severity</span>
                      </div>

                      <div className="space-y-4 text-xs leading-normal font-mono">
                        <div>
                          <strong className="text-rose-400 block mb-1 uppercase tracking-wider text-[11px]">Critical capability voids (Immediate priority)</strong>
                          <p className="text-[10px] text-white/50 lowercase mb-1.5 font-bold uppercase">missing essential core for {dreamRole}</p>
                          <div className="flex flex-wrap gap-1">
                            {gapTelemetryData.critical.map(s => <span key={s} className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded uppercase text-[10px]">{s}</span>)}
                            {gapTelemetryData.critical.length === 0 && <span className="text-emerald-300 font-bold text-[10px]">Zero critical gaps! Ready for production deployment.</span>}
                          </div>
                        </div>

                        <div>
                          <strong className="text-amber-400 block mb-1 uppercase tracking-wider text-[11px]">Important stack dependencies</strong>
                          <p className="text-[10px] text-white/50 lowercase mb-1.5 font-normal uppercase">strongly requested by industry for senior roles</p>
                          <div className="flex flex-wrap gap-1">
                            {gapTelemetryData.important.map(s => <span key={s} className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded uppercase text-[10px]">{s}</span>)}
                            {gapTelemetryData.important.length === 0 && <span className="text-white/30 italic text-[10px]">Zero intermediate voids.</span>}
                          </div>
                        </div>

                        <div>
                          <strong className="text-zinc-400 block mb-1 uppercase tracking-wider text-[11px]">Supporting/Optional extensions</strong>
                          <p className="text-[10px] text-white/50 lowercase mb-1.5 uppercase">nice-to-have capabilities for specialized horizons</p>
                          <div className="flex flex-wrap gap-1">
                            {gapTelemetryData.optional.map(s => <span key={s} className="px-2 py-0.5 bg-white/5 border border-white/5 text-zinc-400 rounded uppercase text-[10px]">{s}</span>)}
                            {gapTelemetryData.optional.length === 0 && <span className="text-white/30 italic text-[10px]">No peripheral gaps.</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer details */}
              <div className="p-6 border-t border-white/10 bg-black/40 text-center font-mono text-[9px] text-white/30 relative z-10 select-none">
                SENSAI ALTIMETRY LABORATORY DIAGNOSTICS SYSTEMS // SECURE WORKSPACE DEPLOYMENT // GMT-2026
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
