import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Flame, 
  Activity, 
  Zap, 
  BookOpen, 
  ExternalLink, 
  User, 
  Shield 
} from 'lucide-react';

interface SelectedPathInfo {
  goal: string;
  nodeId: string;
  timestamp: number;
}

interface RoadmapIntelligenceDashboardProps {
  selectedPathInfo: SelectedPathInfo;
  formData: {
    email: string;
    github: string;
    firstName: string;
    educationLevel: string;
    fieldOfStudy: string;
    currentStatus: string;
    careerStage: string;
    skills: string[];
    interests: string[];
    goal: string;
  };
  userName: string;
  studyField: string;
  userSkills: string[];
}

export function RoadmapIntelligenceDashboard({
  selectedPathInfo,
  formData,
  userName,
  studyField,
  userSkills
}: RoadmapIntelligenceDashboardProps) {

  // Dynamic Career Path recommenders from user's current track & skills & interests
  const getCareerPaths = () => {
    const skillsList = userSkills && userSkills.length > 0 ? userSkills : ['C++', 'Java', 'Python'];
    const skillsStr = skillsList.slice(0, 3).join(', ');
    const firstSkill = skillsList[0] || 'C++';
    const fieldStr = studyField || 'Computer Science';
    const eduStr = formData.educationLevel || "Bachelor's";

    if (selectedPathInfo.goal === 'frontend') {
      return [
        {
          id: 'frontend',
          title: 'Frontend Developer',
          isTopMatch: true,
          difficulty: 'Medium',
          stress: 'Low',
          growth: 'High',
          explanation: `Your skills in ${skillsStr} combined with your academic background in ${fieldStr} make frontend development a highly strategic starting base.`,
          progression: ['Junior Frontend...', 'Frontend Devel...', 'Senior Fronten...'],
          extraRoles: 2
        },
        {
          id: 'designsystems',
          title: 'Design Systems Engineer',
          isTopMatch: false,
          difficulty: 'Medium',
          stress: 'Low',
          growth: 'Medium',
          explanation: `Leverage your ${firstSkill} engineering discipline to create pristine modular tokens and highly accessible atomic layouts.`,
          progression: ['Component Specialist...', 'Design Tokens Architect...', 'Principal Design...'],
          extraRoles: 1
        },
        {
          id: 'fullstack',
          title: 'Full Stack Developer',
          isTopMatch: false,
          difficulty: 'Hard',
          stress: 'High',
          growth: 'Very High',
          explanation: `Unify modern client interfaces with secure proxy routes using your full toolset of ${firstSkill} databases and visual hooks.`,
          progression: ['Associate Full Stack...', 'Lead Core Architect...', 'Technical Officer...'],
          extraRoles: 3
        }
      ];
    } else if (selectedPathInfo.goal === 'aiengineer') {
      return [
        {
          id: 'aiengineer',
          title: 'AI Engineer',
          isTopMatch: true,
          difficulty: 'Hard',
          stress: 'High',
          growth: 'Very High',
          explanation: `Your ${eduStr} in ${fieldStr} with Python and interest in cognitive agents enables you to build cutting-edge model chains and LLM applications.`,
          progression: ['Emerging AI Tech...', 'Generative Architect...', 'Chief Cognitive...'],
          extraRoles: 3
        },
        {
          id: 'datascientist',
          title: 'Data Scientist / ML Engineer',
          isTopMatch: false,
          difficulty: 'Hard',
          stress: 'Medium',
          growth: 'High',
          explanation: `Unlock valuable data insights and train robust predictive classifiers matching your ${firstSkill} fundamentals and analytical skills.`,
          progression: ['Data Analyst...', 'Junior Data Sci...', 'Data Scientist...'],
          extraRoles: 2
        },
        {
          id: 'backend',
          title: 'Backend Engineer',
          isTopMatch: false,
          difficulty: 'Medium',
          stress: 'Low',
          growth: 'Medium',
          explanation: `Establish stable database connections and scale containerized environments by applying sound design principles in ${skillsStr}.`,
          progression: ['Junior Backend...', 'Backend Devel...', 'Senior Backend...'],
          extraRoles: 2
        }
      ];
    } else {
      // Backend / Default
      return [
        {
          id: 'backend',
          title: 'Backend Engineer',
          isTopMatch: true,
          difficulty: 'High',
          stress: 'Low',
          growth: 'Medium',
          explanation: `With ${skillsStr} in your toolkit, backend engineering leverages your problem-solving abilities and aligns optimally with your computer science background.`,
          progression: ['Junior Backend...', 'Backend Devel...', 'Senior Backend...'],
          extraRoles: 2
        },
        {
          id: 'datascientist',
          title: 'Data Scientist / ML Engineer',
          isTopMatch: false,
          difficulty: 'Hard',
          stress: 'Medium',
          growth: 'High',
          explanation: `Your background in ${eduStr} in ${fieldStr} combined with skills in Python positions you well for data science and ML roles.`,
          progression: ['Data Analyst...', 'Junior Data Sci...', 'Data Scientist...'],
          extraRoles: 2
        },
        {
          id: 'frontend',
          title: 'Frontend Developer',
          isTopMatch: false,
          difficulty: 'Medium',
          stress: 'Medium',
          growth: 'High',
          explanation: `Your skills in ${firstSkill} combined with your interest in interactive animations make frontend development a strong alternative track.`,
          progression: ['Junior Frontend...', 'Frontend Devel...', 'Senior Fronten...'],
          extraRoles: 2
        }
      ];
    }
  };

  const getFocusDetails = () => {
    const list = userSkills && userSkills.length > 0 ? userSkills : ['C++', 'Java', 'Python'];
    const p0 = list[0] || 'C++';
    const p1 = list[1] || 'Java';
    const p2 = list[2] || 'Python';

    if (selectedPathInfo.goal === 'frontend') {
      return {
        title: 'Master Responsive Layouts & Hooks',
        desc: `Build fluid interface components and configure stable state metrics for your Frontend track.`,
        chips: [
          'Deliver an interactive React project',
          'Optimize rendering paint thresholds',
          'Verify accessibility contrast indices'
        ],
        resources: [
          { name: 'React Official Documentation', type: 'Official Docs', url: 'https://react.dev' },
          { name: 'MDN Web Docs — CSS Layout Guide', type: 'Course', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Layout' },
          { name: 'Frontend Mentor Layout Challenges', type: 'Project', url: 'https://www.frontendmentor.io' },
          { name: 'JavaScript.info — Direct DOM Walkthrough', type: 'Article', url: 'https://javascript.info' }
        ]
      };
    } else if (selectedPathInfo.goal === 'aiengineer') {
      return {
        title: 'Build Cognitive LLM Chains',
        desc: `Engineer prompt context payloads, orchestrate agent memory lists, and connect secure APIs.`,
        chips: [
          'Scaffold a local vector query index',
          'Deploy safe server-side API proxy routes',
          'Integrate conversational chain logic'
        ],
        resources: [
          { name: 'Hugging Face Transformers Course', type: 'Course', url: 'https://huggingface.co/learn' },
          { name: 'DeepLearning.AI — Prompt Engineering', type: 'Course', url: 'https://www.deeplearning.ai/short-courses/' },
          { name: 'LangChain Orchestration Python Docs', type: 'Article', url: 'https://python.langchain.com' },
          { name: 'FastAI Practical Deep Learning for Coders', type: 'Project', url: 'https://course.fast.ai' }
        ]
      };
    } else {
      // Backend / Default
      return {
        title: 'Excel as Junior Backend Dev',
        desc: `Build expertise in ${p0} and ${p1} for your Backend Engineer track.`,
        chips: [
          'Deliver a project as Junior Backend Dev',
          'Get feedback from a mentor',
          'Identify one skill gap to close'
        ],
        resources: [
          { name: 'Node.js — The Complete Guide (Udemy)', type: 'Course', url: 'https://www.udemy.com/course/nodejs-the-complete-guide/' },
          { name: 'Build a REST API from Scratch', type: 'Project', url: 'https://www.freecodecamp.org/news/build-a-rest-api-from-scratch-with-node-express-and-mongodb/' },
          { name: 'System Design Primer (GitHub)', type: 'Article', url: 'https://github.com/donnemartin/system-design-primer' },
          { name: 'Traversy Media — Express.js Crash Course', type: 'Youtube', url: 'https://www.youtube.com/watch?v=L72fhGm1TFg' }
        ]
      };
    }
  };

  const careerPaths = getCareerPaths();
  const focus = getFocusDetails();

  // User details
  const displayEdu = `${formData.educationLevel || "Bachelor's"} in ${studyField}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="space-y-12 mt-16 text-left border-t border-white/5 pt-12"
      id="roadmap-intelligence-dashboard"
    >
      {/* SECTION 1 — CAREER PATHS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-black tracking-[0.15em] text-white/50 text-left">
            CAREER PATHS ({careerPaths.length})
          </h3>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all cursor-pointer">
              &lt;
            </button>
            <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all cursor-pointer">
              &gt;
            </button>
          </div>
        </div>

        {/* 3 Career Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerPaths.map((path, idx) => (
            <motion.div
              key={path.id}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-neutral-900/40 border border-white/10 backdrop-blur-xl rounded-2xl p-6 relative flex flex-col justify-between shadow-xl min-h-[250px]"
              id={`recommendation-card-${path.id}`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-lg font-black text-white leading-tight">
                    {path.title}
                  </h4>
                  {path.isTopMatch && (
                    <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      TOP MATCH
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="font-semibold">{path.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="font-semibold">{path.stress}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold">{path.growth}</span>
                  </div>
                </div>

                {/* Personalized Explanation */}
                <p className="text-xs text-white/60 leading-relaxed font-normal">
                  {path.explanation}
                </p>
              </div>

              {/* Career Progression list preview */}
              <div className="mt-6 border-t border-white/5 pt-4">
                <div className="flex flex-wrap items-center gap-1.5 font-sans text-xs text-white/50">
                  {path.progression.map((stage, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <span className="font-semibold text-white/70 whitespace-nowrap">
                        {stage}
                      </span>
                      {sIdx < path.progression.length - 1 && (
                        <span className="text-[#38bdf8] font-bold">→</span>
                      )}
                    </React.Fragment>
                  ))}
                  {path.extraRoles > 0 && (
                    <span className="text-[#3a86f5] font-bold px-1 py-0.2 bg-[#3a86f5]/10 rounded-md text-[10px] whitespace-nowrap">
                      +{path.extraRoles} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION 2 — ROADMAP & RESOURCES */}
      <div className="space-y-6">
        <h3 className="text-xs uppercase font-black tracking-[0.15em] text-white/50 text-left">
          ROADMAP & RESOURCES
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next 30-Day Focus Large Card (Col span 2) */}
          <motion.div 
            whileHover={{ scale: 1.002 }}
            className="lg:col-span-2 bg-[#17171e]/70 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
            id="next-focus-card"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-400">
                <Zap className="w-5 h-5 text-[#38bdf8] fill-[#38bdf8]/10" />
                <span className="text-xs uppercase font-black tracking-widest text-[#38bdf8]">
                  NEXT 30-DAY FOCUS
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  {focus.title}
                </h4>
                <p className="text-sm text-white/60 max-w-xl font-normal leading-relaxed">
                  {focus.desc}
                </p>
              </div>
            </div>

            {/* Chips rows */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {focus.chips.map((chip, idx) => (
                <div 
                  key={idx} 
                  className="px-4 py-2.5 bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-xl text-xs font-semibold text-white/80 transition-all cursor-default select-none"
                >
                  {chip}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Resources Card (Col span 1) */}
          <motion.div 
            whileHover={{ scale: 1.002 }}
            className="bg-[#17171e]/70 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col space-y-6"
            id="top-resources-card"
          >
            <div className="flex items-center gap-2 text-indigo-400">
              <BookOpen className="w-5 h-5 text-[#ffcc00] shrink-0" />
              <span className="text-xs uppercase font-black tracking-widest text-[#ffcc00]">
                TOP RESOURCES
              </span>
            </div>

            {/* Respectable destination links */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {focus.resources.map((res, rIdx) => (
                <a
                  key={rIdx}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block group p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-all cursor-pointer"
                  id={`resource-link-${rIdx}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-sm font-bold text-white group-hover:text-[#ffcc00] transition-colors leading-snug">
                      {res.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-[#ffcc00]/80 shrink-0 transition-colors mt-0.5" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono font-medium mt-1.5 block">
                    {res.type}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* SECTION 3 — QUICK LINKS */}
      <div className="space-y-6">
        <h3 className="text-xs uppercase font-black tracking-[0.15em] text-white/50 text-left">
          QUICK LINKS
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Burnout monitor card */}
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className="bg-[#111115]/80 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-8 cursor-pointer relative group"
            id="burnout-monitor-link-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400">
                <Shield className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-xs uppercase font-black tracking-widest text-sky-400">
                  BURNOUT MONITOR
                </span>
              </div>
              <span className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all">
                →
              </span>
            </div>

            {/* Score info */}
            <div className="flex items-center gap-6">
              <span className="text-5xl sm:text-6xl font-black text-[#f87171] tracking-tighter shrink-0 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                60
              </span>
              <div className="text-left space-y-0.5">
                <h4 className="text-lg font-black text-white leading-snug">
                  High Risk
                </h4>
                <p className="text-xs text-white/50 leading-relaxed font-normal">
                  2-4 weeks if current pace continues
                </p>
              </div>
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px] font-black uppercase rounded-full">
                10h/week total workload
              </span>
              <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-black uppercase rounded-full">
                Feeling stuck
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase rounded-full">
                fair sleep quality
              </span>
            </div>
          </motion.div>

          {/* User profile card */}
          <motion.div 
            whileHover={{ scale: 1.005 }}
            className="bg-[#111115]/80 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-8 cursor-pointer relative group"
            id="user-profile-summary-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <User className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs uppercase font-black tracking-widest text-emerald-400">
                  YOUR PROFILE
                </span>
              </div>
              <span className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all">
                →
              </span>
            </div>

            {/* Avatar & text */}
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-sky-500/10">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-lg font-black text-white leading-snug">
                  {userName}
                </h4>
                <p className="text-xs text-white/50 leading-relaxed font-normal">
                  {displayEdu}
                </p>
              </div>
            </div>

            {/* Bottom skills row */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {formData.skills && formData.skills.length > 0 ? (
                formData.skills.map((skill, sIdx) => (
                  <span 
                    key={sIdx} 
                    className="px-3 py-1 bg-white/5 border border-white/5 text-white/70 text-[10px] font-bold uppercase rounded-lg"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                ['C++', 'Java', 'Python'].map((skill, sIdx) => (
                  <span 
                    key={sIdx} 
                    className="px-3 py-1 bg-white/5 border border-white/5 text-white/70 text-[10px] font-bold uppercase rounded-lg"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
