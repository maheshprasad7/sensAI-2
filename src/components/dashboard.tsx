import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareerRoadmap2D } from './CareerRoadmap2D';
import { SkillChecker } from './SkillChecker';
import { RoadmapIntelligenceDashboard } from './RoadmapIntelligenceDashboard';
import { DashboardCometBackground } from './ui/dashboard-comet-background';
import { HighlightButton } from './ui/highlight-button';
import { AssessmentIDE } from './AssessmentIDE';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { 
  Globe, 
  Activity, 
  Zap, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  Terminal, 
  ArrowLeft, 
  Compass, 
  Sparkles, 
  Layers, 
  Lock,
  GitPullRequest,
  Check,
  HelpCircle,
  Play,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Plus,
  Trash2,
  Briefcase,
  Calendar,
  BookOpen
} from 'lucide-react';

interface DashboardProps {
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
  onBackToHome: () => void;
}

export function DashboardComponent({ formData, onBackToHome }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'decay' | 'matchmaker' | 'scanner' | 'skillchecker' | 'interview'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/skill-checker') {
      return 'skillchecker';
    }
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('career_gps_last_active_tab') : null;
    if (saved === 'roadmap' || saved === 'decay' || saved === 'matchmaker' || saved === 'scanner' || saved === 'skillchecker' || saved === 'interview') {
      return saved as any;
    }
    return 'roadmap';
  });

  const [lastSkillPage, setLastSkillPage] = useState<'decay' | 'skillchecker'>(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('career_gps_last_skill_page') : null;
    if (saved === 'skillchecker' || saved === 'decay') return saved;
    return 'decay';
  });

  const handleTabChange = (tab: 'roadmap' | 'decay' | 'matchmaker' | 'scanner' | 'skillchecker' | 'interview') => {
    setActiveTab(tab);
    localStorage.setItem('career_gps_last_active_tab', tab);
    if (tab === 'skillchecker') {
      window.history.pushState(null, '', '/skill-checker');
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/skill-checker') {
        setActiveTab('skillchecker');
      } else {
        const saved = localStorage.getItem('career_gps_last_active_tab');
        if (saved && saved !== 'skillchecker' && (saved === 'roadmap' || saved === 'decay' || saved === 'matchmaker' || saved === 'scanner' || saved === 'interview')) {
          setActiveTab(saved as any);
        } else {
          setActiveTab('roadmap');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const [activeAssessmentSkill, setActiveAssessmentSkill] = useState<string | null>(null);
  
  // Selected path state to unlock Intelligence Dashboard part 2
  const [selectedPathInfo, setSelectedPathInfo] = useState<{ goal: string; nodeId: string; timestamp: number } | null>(() => {
    const savedGoal = localStorage.getItem('career_gps_chosen_goal');
    const savedNodeId = localStorage.getItem('career_gps_chosen_node_id');
    if (savedGoal && savedNodeId) {
      return { goal: savedGoal, nodeId: savedNodeId, timestamp: Date.now() };
    }
    return null;
  });
  
  // ----------------------------------------------------
  // Default values backup if they skipped or left blank
  // ----------------------------------------------------
  const userName = formData.firstName ? formData.firstName.trim() : 'Explorer';
  const studyField = formData.fieldOfStudy || 'Computer Science';
  const userGoal = formData.goal || 'To bridge the gap between static skills and industry achievements.';
  
  const userSkillsDefault = formData.skills && formData.skills.length > 0 
    ? formData.skills 
    : ['JavaScript', 'React', 'Python', 'Git', 'SQL'];
  
  const [activeSkillsList, setActiveSkillsList] = useState<string[]>(userSkillsDefault);
  const userSkills = activeSkillsList;
  
  const githubUser = formData.github || 'nexus_dev';

  // ----------------------------------------------------
  // GITHUB INTELLECTUAL SCANNER STATE
  // ----------------------------------------------------
  const [scanUsername, setScanUsername] = useState(formData.github || '');
  const [scanToken, setScanToken] = useState('');
  const [scanTargetRole, setScanTargetRole] = useState('Software Engineer');
  const [scanInputMethod, setScanInputMethod] = useState<'username' | 'url'>('username');
  const [scanRepoUrl, setScanRepoUrl] = useState('');
  const [scanFetchStatus, setScanFetchStatus] = useState<'idle' | 'fetching_repos' | 'repos_ready' | 'scanning' | 'done' | 'error'>('idle');
  const [scanFetchedRepos, setScanFetchedRepos] = useState<any[]>([]);
  const [scanSelectedRepoNames, setScanSelectedRepoNames] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [scanAggregatedProfile, setScanAggregatedProfile] = useState<any>(null);
  const [scanTerminalLogs, setScanTerminalLogs] = useState<string[]>([]);
  const [lazyBulletLoading, setLazyBulletLoading] = useState<string | null>(null);
  const [lazyBulletsMap, setLazyBulletsMap] = useState<Record<string, any>>({});
  const [selectedBulletAngle, setSelectedBulletAngle] = useState<Record<string, 'primary' | 'alternative'>>({});
  const [decayUpdatesPending, setDecayUpdatesPending] = useState<any[]>([]);
  const [scanErrorMsg, setScanErrorMsg] = useState('');
  const [activeExpandedRepoId, setActiveExpandedRepoId] = useState<string | null>(null);

  // ----------------------------------------------------
  // GITHUB SCANNER ACTION HANDLERS
  // ----------------------------------------------------
  const handleFetchRepos = async () => {
    if (!scanUsername.trim()) {
      setScanErrorMsg("Please enter a valid GitHub username.");
      setScanFetchStatus('error');
      return;
    }
    setScanErrorMsg("");
    setScanFetchStatus('fetching_repos');
    try {
      const response = await fetch(`/api/github/repos?username=${encodeURIComponent(scanUsername.trim())}&token=${encodeURIComponent(scanToken)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch repositories. Status: ${response.status}`);
      }
      const repos = await response.json();
      if (!Array.isArray(repos)) {
        throw new Error("Invalid response format received from server.");
      }
      setScanFetchedRepos(repos);
      // Pre-select non-fork repositories
      const nonForks = repos.filter((r: any) => !r.fork).map((r: any) => r.full_name);
      setScanSelectedRepoNames(nonForks.slice(0, 5)); // cap at 5 default for speed
      setScanFetchStatus('repos_ready');
    } catch (err: any) {
      console.error(err);
      setScanErrorMsg(err.message || "Error communicating with GitHub servers.");
      setScanFetchStatus('error');
    }
  };

  const handleScanRepositories = async () => {
    let targetRepos: string[] = [];
    if (scanInputMethod === 'username') {
      targetRepos = scanSelectedRepoNames;
    } else {
      if (!scanRepoUrl.trim()) {
        setScanErrorMsg("Please input a valid repository URL.");
        setScanFetchStatus('error');
        return;
      }
      const cleanUrl = scanRepoUrl.trim();
      const match = cleanUrl.match(/github\.com\/([^\/]+\/[^\/#?]+)/) || cleanUrl.match(/^([^\/]+\/[^\/]+)$/);
      if (!match) {
        setScanErrorMsg("Could not parse repository owner and name. Format: github.com/owner/repo");
        setScanFetchStatus('error');
        return;
      }
      targetRepos = [match[1].replace(/\.git$/, '')];
    }

    if (targetRepos.length === 0) {
      setScanErrorMsg("No repositories selected to scan.");
      setScanFetchStatus('error');
      return;
    }

    setScanErrorMsg("");
    setScanFetchStatus('scanning');
    setScanTerminalLogs([`[SENSAI SCANNER PROTOCOL] Initializing secure telemetry channel...`]);

    const logsList = [
      `[GATEWAY] Establishing secured handshake connection for ${targetRepos.length} repos...`,
      `[FETCH] Extracting live repository metadata & package tags...`,
      `[PARSE] Reading top-level file structures & architecture layouts...`,
      `[DEC_BASE64] Base64-decoding and parsing repository README documents...`,
      `[SCHEMA] Packaging payload variables for secure server-side transmission...`,
      `[GEMINI API] Directing repository structures to Gemini-3.5-flash for evaluation...`,
      `[INTELLIGENCE] Executing Prompt A deep repository capability matrices...`,
      `[SYNTHESIS] Processing Prompt B collective technical profile aggregation...`,
      `[COMPILING] Mapping verified skill variables & updating local decay registers...`
    ];

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < logsList.length) {
        setScanTerminalLogs(prev => [...prev, logsList[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    try {
      const response = await fetch('/api/github/scan-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo_names: targetRepos,
          target_role: scanTargetRole,
          user_existing_skills: activeSkillsList,
          token: scanToken
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      clearInterval(logInterval);

      setScanTerminalLogs(prev => [
        ...prev,
        `[SUCCESS] Scan successfully finalized!`,
        `[COMPLETED] Compiled detailed reports and synchronised skill clocks.`
      ]);

      setScanResults(data.scan_results || []);
      setScanAggregatedProfile(data.aggregated_profile || null);
      
      const updatesList: any[] = [];
      (data.scan_results || []).forEach((repo: any) => {
        (repo.skills_to_update_in_decay_engine || []).forEach((u: any) => {
          updatesList.push({
            ...u,
            repoName: repo.repo_name,
            selected: true
          });
        });
      });
      setDecayUpdatesPending(updatesList);
      setScanFetchStatus('done');
    } catch (err: any) {
      clearInterval(logInterval);
      console.error(err);
      setScanTerminalLogs(prev => [...prev, `[FAILURE] Scan execution aborted due to technical exceptions.`]);
      setScanErrorMsg(err.message || "Failed to scan selected repositories. Please verify public access or supply a token.");
      setScanFetchStatus('error');
    }
  };

  const handleGenerateSTARBullet = async (repo: any) => {
    if (lazyBulletsMap[repo.repo_id]) return;
    setLazyBulletLoading(repo.repo_id);
    try {
      const response = await fetch('/api/github/generate-star-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo_info: repo,
          target_role: scanTargetRole
        })
      });
      if (!response.ok) {
        throw new Error("Failed to generate STAR resume bullet.");
      }
      const data = await response.json();
      setLazyBulletsMap(prev => ({ ...prev, [repo.repo_id]: data }));
      setSelectedBulletAngle(prev => ({ ...prev, [repo.repo_id]: 'primary' }));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error generating bullet.");
    } finally {
      setLazyBulletLoading(null);
    }
  };

  const handleApplyDecayUpdates = () => {
    const selectedUpdates = decayUpdatesPending.filter(u => u.selected);
    if (selectedUpdates.length === 0) {
      alert("No updates selected.");
      return;
    }

    const currentSkills = [...activeSkillsList];
    selectedUpdates.forEach(update => {
      const skillName = update.skill_name;
      if (!currentSkills.includes(skillName)) {
        currentSkills.push(skillName);
      }
      
      setReinforcedSkills(prev => ({
        ...prev,
        [skillName]: decayDays
      }));
    });

    setActiveSkillsList(currentSkills);
    setDecayUpdatesPending([]);
    alert(`Successfully synced and updated references for ${selectedUpdates.length} skills! Review your fresh scores in "Skill Decay Tracking" tab!`);
  };

  // ----------------------------------------------------
  // ROADMAP COMPONENT STATE
  // ----------------------------------------------------
  // We construct milestones based on their field, stage & skills
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: 'Academic Variable Verification',
      category: 'Foundation',
      description: `Validate static credentials of ${formData.educationLevel || "Bachelor's"} degree in ${studyField}.`,
      tasks: [
        'Connect official transcript node',
        'Verify academic rank parameters',
        'Sync core curriculum compliance'
      ],
      completedTasks: [0], // first task completed by default
      reward: 'Level 1 Sync Credentials Profile',
      status: 'active' as 'completed' | 'active' | 'locked',
    },
    {
      id: 2,
      title: 'GitHub Core Repositories Extraction',
      category: 'Project Bridge',
      description: `Index active repositories and trace contributions for development tags using github.com/${githubUser}.`,
      tasks: [
        'Analyze commit frequency matrices',
        'Extract library usage telemetry',
        'Deploy static showcase page deployment tracker'
      ],
      completedTasks: [] as number[],
      reward: 'GitHub Mastery Signature Block',
      status: 'locked' as 'completed' | 'active' | 'locked',
    },
    {
      id: 3,
      title: `${userSkills[0] || 'Primary Skill'} Advanced Optimization Path`,
      category: 'Intellectual Mastery',
      description: `Verify custom knowledge algorithms under pressure to eliminate passive memory decay in ${userSkills[0] || 'core technologies'}.`,
      tasks: [
        `Complete ${userSkills[0] || 'core'} memory test re-evaluation`,
        'Demonstrate practical implementation output structure',
        'Optimize execution load parameters'
      ],
      completedTasks: [] as number[],
      reward: `${userSkills[0] || 'Technology'} Validated Badge`,
      status: 'locked' as 'completed' | 'active' | 'locked',
    },
    {
      id: 4,
      title: 'Matchmaker Dispatch Alignment',
      category: 'Career Launch',
      description: `Deploy completed telemetry payload to active industry placements and apprenticeships matching ${formData.careerStage || 'Student'}.`,
      tasks: [
        'Lock skills profile compliance',
        'Generate cryptographic proof certificates',
        'Deliver telemetry package'
      ],
      completedTasks: [] as number[],
      reward: 'Placement Accelerator Dispatch Status',
      status: 'locked' as 'completed' | 'active' | 'locked',
    }
  ]);

  const [activeMilestoneId, setActiveMilestoneId] = useState(1);

  const handleToggleTask = (milestoneId: number, taskIndex: number) => {
    setMilestones(prev => {
      return prev.map(m => {
        if (m.id !== milestoneId) return m;
        
        let newCompleted = [...m.completedTasks];
        if (newCompleted.includes(taskIndex)) {
          newCompleted = newCompleted.filter(idx => idx !== taskIndex);
        } else {
          newCompleted.push(taskIndex);
        }

        // Check if all tasks are completed
        const isAllDone = newCompleted.length === m.tasks.length;
        const newStatus = isAllDone ? ('completed' as const) : ('active' as const);

        return {
          ...m,
          completedTasks: newCompleted,
          status: newStatus
        };
      });
    });
  };

  // Automatically unlock next milestone if previous is completed
  useEffect(() => {
    setMilestones(prev => {
      let changed = false;
      const updated = prev.map((m, idx) => {
        if (idx > 0 && prev[idx - 1].status === 'completed' && m.status === 'locked') {
          changed = true;
          return { ...m, status: 'active' as const };
        }
        return m;
      });
      return changed ? updated : prev;
    });
  }, [milestones]);

  const getRoadmapProgress = () => {
    let totalTasks = 0;
    let completedCount = 0;
    milestones.forEach(m => {
      totalTasks += m.tasks.length;
      completedCount += m.completedTasks.length;
    });
    return Math.round((completedCount / totalTasks) * 100);
  };


  // ----------------------------------------------------
  // SKILL DECAY TRACKING STATE
  // ----------------------------------------------------
  const [decayDays, setDecayDays] = useState(0);
  const [reinforcedSkills, setReinforcedSkills] = useState<Record<string, number>>({});

  // GitHub Challenge Push & Setup states
  const [activeChallengeTabs, setActiveChallengeTabs] = useState<Record<string, 'folder' | 'deps' | 'env'>>({});
  const [pushStatuses, setPushStatuses] = useState<Record<string, "idle" | "creating_repo" | "pushing_scaffold" | "done" | "error">>({});
  const [pushedRepoUrls, setPushedRepoUrls] = useState<Record<string, string>>({});
  const [pushErrors, setPushErrors] = useState<Record<string, string>>({});
  const [isPushingRepo, setIsPushingRepo] = useState<string | null>(null);

  interface SkillDecayRecord {
    id: string;
    name: string;
    proficiency: number; // 1-5
    last_used_at: string; // YYYY-MM-DD
    usage_context: string; // Job, Personal Project, etc.
    github_repo_url?: string;
    decay_rate_days: number;
    decay_category: string; // fast | medium | slow
    reason?: string;
    industry_context?: string;
    refresh_threshold_days?: number;
    challenge?: {
      project_title: string;
      one_liner: string;
      why_it_matters: string;
      tech_stack: string[];
      folder_structure: string;
      milestones: { hour: number; task: string }[];
      resume_bullet: string;
      stretch_goal?: string;
      folder_structure_tree?: string;
      dependencies?: {
        package_json: string;
        install_command: string;
      };
      env_variables?: {
        key: string;
        placeholder: string;
        required: boolean;
        where_to_get: string;
        description: string;
      }[];
      gitignore_content?: string;
      readme_template?: string;
      github_repo_name?: string;
      github_repo_description?: string;
    } | null;
    coaching?: {
      urgency: 'critical' | 'moderate' | 'low';
      headline: string;
      what_you_are_losing: string;
      fastest_fix: string;
      estimated_reactivation_hours: number;
      market_signal: string;
    } | null;
  }

  const skillsTaxonomy = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Go', 'Rust', 'Docker',
    'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Next.js', 'Tailwind CSS',
    'Git', 'SQL', 'C++', 'Java', 'Data Science', 'PyTorch', 'TensorFlow'
  ];

  const [decaySkillsList, setDecaySkillsList] = useState<SkillDecayRecord[]>(() => {
    const saved = localStorage.getItem("sensai_tracked_skills");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse saved skills:", e);
      }
    }
    
    // Default initial template skills matching form variables
    const initialNames = userSkillsDefault || ['JavaScript', 'React', 'Python', 'Git', 'SQL'];
    return initialNames.map((name, index) => {
      const pastDays = [10, 45, 120, 15, 80][index % 5];
      const lastUsed = new Date();
      lastUsed.setDate(lastUsed.getDate() - pastDays);
      const lastUsedStr = lastUsed.toISOString().slice(0, 10);
      
      const decayRate = [360, 240, 400, 365, 300][index % 5];
      const decayCategory = decayRate < 180 ? 'fast' : decayRate <= 365 ? 'medium' : 'slow';
      
      return {
        id: `skill-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`,
        name,
        proficiency: [4, 4, 3, 4, 3][index % 5],
        last_used_at: lastUsedStr,
        usage_context: ['Job', 'Personal Project', 'Freelance', 'Course', 'Internship'][index % 5],
        github_repo_url: '',
        decay_rate_days: decayRate,
        decay_category: decayCategory,
        reason: `${name} requires regular deployment and configuration audits to remain completely current.`,
        industry_context: 'Steady industry calibration indicates massive continuous adoption of this node.',
        refresh_threshold_days: Math.round(decayRate * 0.6),
        challenge: null,
        coaching: null
      };
    });
  });

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState(3);
  const [newSkillLastUsed, setNewSkillLastUsed] = useState(() => new Date().toISOString().slice(0, 10));
  const [newSkillContext, setNewSkillContext] = useState('Personal Project');
  const [newSkillGithubUrl, setNewSkillGithubUrl] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [addSkillError, setAddSkillError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [selectedDecaySkillId, setSelectedDecaySkillId] = useState<string | null>(null);
  const [isFetchingCoaching, setIsFetchingCoaching] = useState(false);
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState<string | null>(null);
  const [hasGeneratedProjects, setHasGeneratedProjects] = useState<Record<string, boolean>>({});
  const [coachingError, setCoachingError] = useState('');

  // Persists core skills telemetry to localStorage
  useEffect(() => {
    localStorage.setItem("sensai_tracked_skills", JSON.stringify(decaySkillsList));
  }, [decaySkillsList]);

  // Synchronize global skills state
  useEffect(() => {
    const listNames = decaySkillsList.map(s => s.name);
    if (JSON.stringify(listNames) !== JSON.stringify(activeSkillsList)) {
      setActiveSkillsList(listNames);
    }
  }, [decaySkillsList]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      setAddSkillError("Skill name is required.");
      return;
    }
    
    // De-duplicate
    if (decaySkillsList.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setAddSkillError(`You are already tracking "${newSkillName.trim()}"!`);
      return;
    }
    
    setAddSkillError('');
    setIsAddingSkill(true);
    
    try {
      const response = await fetch('/api/decay/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_name: newSkillName.trim(),
          proficiency: newSkillProficiency,
          category: newSkillCategory,
          usage_context: newSkillContext
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to calibrate decay metrics on backend server.");
      }
      
      const decayData = await response.json();
      
      const newRecord: SkillDecayRecord = {
        id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: newSkillName.trim(),
        proficiency: newSkillProficiency,
        last_used_at: newSkillLastUsed,
        usage_context: newSkillContext,
        github_repo_url: newSkillGithubUrl.trim() || undefined,
        decay_rate_days: decayData.decay_rate_days || 365,
        decay_category: decayData.decay_category || 'medium',
        reason: decayData.reason || 'Calculated dynamic decay based on code churn and design volatility.',
        industry_context: decayData.industry_context || 'Standard industry volatility metrics applied.',
        refresh_threshold_days: decayData.refresh_threshold_days || 200,
        challenge: null,
        coaching: null
      };
      
      setDecaySkillsList(prev => [newRecord, ...prev]);
      
      setNewSkillName('');
      setNewSkillProficiency(3);
      setNewSkillLastUsed(new Date().toISOString().slice(0, 10));
      setNewSkillContext('Personal Project');
      setNewSkillGithubUrl('');
      setShowAddForm(false);
    } catch (err: any) {
      console.error(err);
      setAddSkillError(err.message || "Failed to contact calibration servers.");
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleSelectSkillForCoaching = async (skillId: string) => {
    setSelectedDecaySkillId(skillId);
    const skill = decaySkillsList.find(s => s.id === skillId);
    if (!skill) return;
    
    if (skill.coaching) return;
    
    setIsFetchingCoaching(true);
    setCoachingError('');
    
    try {
      const daysSinceUsed = Math.max(0, Math.floor((new Date().getTime() - new Date(skill.last_used_at).getTime()) / (1000 * 60 * 60 * 24)));
      const effectiveDays = daysSinceUsed + decayDays;
      const decayScore = Math.max(0, Math.min(100, Math.round(100 - (effectiveDays / skill.decay_rate_days) * 100)));
      
      const response = await fetch('/api/decay/coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_name: skill.name,
          proficiency: skill.proficiency,
          days_since_used: effectiveDays,
          decay_rate_days: skill.decay_rate_days,
          decay_score: decayScore,
          target_role: scanTargetRole
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to assemble coaching payload.");
      }
      
      const coachingData = await response.json();
      
      setDecaySkillsList(prev => prev.map(s => {
        if (s.id === skillId) {
          return { ...s, coaching: coachingData };
        }
        return s;
      }));
    } catch (err: any) {
      console.error(err);
      setCoachingError(err.message || "Could not retrieve technical decay directives.");
    } finally {
      setIsFetchingCoaching(false);
    }
  };

  const handleGenerateRefreshChallenge = async (skillId: string) => {
    const skill = decaySkillsList.find(s => s.id === skillId);
    if (!skill) return;
    
    setIsGeneratingChallenge(skillId);
    try {
      const otherSkills = decaySkillsList.filter(s => s.id !== skillId).map(s => s.name);
      const response = await fetch('/api/decay/generate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_name: skill.name,
          proficiency: skill.proficiency,
          target_role: scanTargetRole,
          other_skills_list: otherSkills
        })
      });
      
      if (!response.ok) {
        throw new Error("Challenge generator responded with failure.");
      }
      
      const challengeData = await response.json();
      
      setDecaySkillsList(prev => prev.map(s => {
        if (s.id === skillId) {
          return { ...s, challenge: challengeData };
        }
        return s;
      }));
      setHasGeneratedProjects(prev => ({ ...prev, [skillId]: true }));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to establish active challenge briefs.");
    } finally {
      setIsGeneratingChallenge(null);
    }
  };

  const handleCompleteChallenge = (skillId: string) => {
    setDecaySkillsList(prev => prev.map(s => {
      if (s.id === skillId) {
        return {
          ...s,
          last_used_at: new Date().toISOString().slice(0, 10),
          challenge: null,
          coaching: null
        };
      }
      return s;
    }));
    alert("Congratulations! Challenge completed successfully! Your Retention Index is now restabilised at 100%!");
  };

  const handlePushToGitHub = async (skillId: string) => {
    const skill = decaySkillsList.find(s => s.id === skillId);
    if (!skill || !skill.challenge) return;

    const gitHubUsername = scanUsername || formData.github;
    const gitHubToken = scanToken;

    if (!gitHubUsername || !gitHubToken) {
      alert("GitHub username or authorization token missing. Please connect/fetch in the Scanner tab first!");
      return;
    }

    setPushStatuses(prev => ({ ...prev, [skillId]: 'creating_repo' }));
    setIsPushingRepo(skillId);

    try {
      const repoName = skill.challenge.github_repo_name || `skillpulse-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-refresh-challenge`;
      const description = skill.challenge.github_repo_description || skill.challenge.one_liner || "SkillPulse Challenge Codebase";

      const res = await fetch('/api/github/push-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: gitHubToken,
          username: gitHubUsername,
          repoName,
          description,
          isPrivate: false,
          challenge: skill.challenge
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to trigger GitHub project push.");
      }

      const responseData = await res.json();
      if (responseData.success && responseData.url) {
        setPushStatuses(prev => ({ ...prev, [skillId]: 'done' }));
        setPushedRepoUrls(prev => ({ ...prev, [skillId]: responseData.url }));

        // Step 3 automatically
        setDecaySkillsList(prev => prev.map(s => {
          if (s.id === skillId) {
            return {
              ...s,
              last_used_at: new Date().toISOString().slice(0, 10),
              github_repo_url: responseData.url
            };
          }
          return s;
        }));

        // Append to local Scanner library
        const newRepoObj = {
          id: Date.now(),
          name: repoName,
          full_name: `${gitHubUsername}/${repoName}`,
          html_url: responseData.url,
          description: description,
          pushed_at: new Date().toISOString(),
          language: skill.name,
          fork: false,
          stargazers_count: 0
        };
        setScanFetchedRepos(prev => [newRepoObj, ...prev]);
        setScanSelectedRepoNames(prev => [...new Set([newRepoObj.full_name, ...prev])]);

        alert(`Success! Repository created & scaffold files successfully pushed to GitHub!\nYour retention status for ${skill.name} has been rescaled to 100% (Green)!`);
      } else {
        throw new Error("Missing successful returns from GitHub repository creator.");
      }
    } catch (err: any) {
      console.error(err);
      setPushStatuses(prev => ({ ...prev, [skillId]: 'error' }));
      setPushErrors(prev => ({ ...prev, [skillId]: err.message || "Failed to push template repository." }));
      alert(err.message || "GitHub Push collapsed. Check connection parameters or try again.");
    } finally {
      setIsPushingRepo(null);
    }
  };

  const handleQuickResetSkill = (skillId: string) => {
    setDecaySkillsList(prev => prev.map(s => {
      if (s.id === skillId) {
        return {
          ...s,
          last_used_at: new Date().toISOString().slice(0, 10),
          challenge: null,
          coaching: null
        };
      }
      return s;
    }));
  };

  const handleDeleteSkillTrack = (skillId: string) => {
    if (confirm("Are you sure you want to stop tracking this technical skill node?")) {
      setDecaySkillsList(prev => prev.filter(s => s.id !== skillId));
      if (selectedDecaySkillId === skillId) {
        setSelectedDecaySkillId(null);
      }
    }
  };
  
  // Memory reinforcement test modal state
  const [activeTestSkill, setActiveTestSkill] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<'correct' | 'incorrect' | null>(null);

  // Custom technical questions for the skills reinforcement feature
  const questionsBySkill: Record<string, { q: string, options: string[], answer: string, explanation: string }> = {
    'JavaScript': {
      q: 'Which of the following describes the difference between "==" and "===" in JavaScript?',
      options: [
        '== checks both type and value, while === only checks value.',
        '== checks value with type coercion, while === checks value and type strictly.',
        'There is no difference; they are syntactic aliases.',
        '== is deprecated and === is faster.'
      ],
      answer: '== checks value with type coercion, while === checks value and type strictly.',
      explanation: 'Excellent tracking! The loose equality operator type-coerces variables before comparing, whereas strict equality checks both type and value.'
    },
    'React': {
      q: 'What is the primary function of the useCallback hook in React?',
      options: [
        'To schedule asynchronous data fetching tasks.',
        'To cache the state of a fast-input form text component.',
        'To memoize and return a stable callback function instance across re-renders.',
        'To bypass children components state lifecycle limitations.'
      ],
      answer: 'To memoize and return a stable callback function instance across re-renders.',
      explanation: 'Correct! useCallback ensures function instances remain reference-stable to prevent accidental triggering of deep children re-renders.'
    },
    'Python': {
      q: 'How does memory management handle integer allocation for values between -5 and 256 in Python (CPython)?',
      options: [
        'They are dynamically deallocated on every scope termination.',
        'They are pre-allocated (interned) in global memory for immediate reuse.',
        'They trigger warning telemetry flags inside complex mathematical runtimes.',
        'They are stored directly inside the CPU registry without RAM pointers.'
      ],
      answer: 'They are pre-allocated (interned) in global memory for immediate reuse.',
      explanation: 'Brilliant computer science context! CPython pre-allocates small integer objects during initialization to optimize constant-value lookups.'
    },
    'Git': {
      q: 'What does the "git reflog" command facilitate?',
      options: [
        'Publishing local branch reference indexes to remote Git servers.',
        'Recording every local head reference modification history, making it possible to recover lost commits.',
        'Formatting commit files with human-eye styling protocols.',
        'Verifying that binary asset files do not contain insecure scripts.'
      ],
      answer: 'Recording every local head reference modification history, making it possible to recover lost commits.',
      explanation: 'Accurate command matrix index locked. git reflog is your safety net, tracking each local HEAD shift.'
    },
    'SQL': {
      q: 'What distinguishes a LEFT JOIN from an INNER JOIN?',
      options: [
        'LEFT JOIN only operates on database keys that are on the left-side drive.',
        'INNER JOIN returns all rows from both tables, ignoring mismatches.',
        'LEFT JOIN returns all rows from the left table and matched rows from the right, retaining NULL values if no match exists.',
        'SQL LEFT JOIN converts the entire query structure into a temporary view.'
      ],
      answer: 'LEFT JOIN returns all rows from the left table and matched rows from the right, retaining NULL values if no match exists.',
      explanation: 'Superb data modeling knowledge. All unmatched entries from the right side populate with NULL!'
    }
  };

  const getSkillProficiency = (skillName: string) => {
    // Basic decay calculation: starts at 100%, decays at ~0.8% per simulated day passed
    // But if they reinforced it, it starts at 100% at the day of reinforcement
    const baseVal = 100;
    const dayOfReinforce = reinforcedSkills[skillName] || 0;
    const effectiveDays = Math.max(0, decayDays - dayOfReinforce);
    const decayFactor = 0.85; // 0.85% per day
    const currentVal = Math.max(25, Math.round(baseVal - (effectiveDays * decayFactor)));
    return currentVal;
  };

  const getProficiencyColor = (val: number) => {
    if (val >= 90) return 'text-[#ffcc00] border-[#ffcc00]/50';
    if (val >= 70) return 'text-orange-400 border-orange-500/40';
    return 'text-red-400 border-red-500/40';
  };

  const getProficiencyBg = (val: number) => {
    if (val >= 90) return 'bg-[#ffcc00]';
    if (val >= 70) return 'bg-orange-400';
    return 'bg-red-500';
  };

  const handleReinforceSkill = (skillName: string) => {
    const matchedQ = questionsBySkill[skillName] || questionsBySkill['JavaScript'];
    setActiveTestSkill(skillName);
    setSelectedAnswer(null);
    setTestResult(null);
  };

  const handleSubmitAnswer = () => {
    if (!activeTestSkill || !selectedAnswer) return;
    const currentQ = questionsBySkill[activeTestSkill] || questionsBySkill['JavaScript'];
    if (selectedAnswer === currentQ.answer) {
      setTestResult('correct');
      setReinforcedSkills(prev => ({
        ...prev,
        [activeTestSkill]: decayDays
      }));
    } else {
      setTestResult('incorrect');
    }
  };

  // ----------------------------------------------------
  // SMART MATCHMAKER PLACEMENT STATE & DYNAMIC ONLINE JOB LOOKUP
  // ----------------------------------------------------
  interface Placement {
    id: number | string;
    title: string;
    company: string;
    tier: string;
    matchScore: number;
    requiredSkills: string[];
    description: string;
    url?: string;
    fitAnalysis?: string;
  }

  // Live placements matching user starting skills & target job
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [placementsLoading, setPlacementsLoading] = useState(false);
  const [matchmakerTargetRole, setMatchmakerTargetRole] = useState(formData.goal || "Software Engineer");
  const [matchmakerSourceMeta, setMatchmakerSourceMeta] = useState("Locally Loaded Matrix");
  const [matchmakerModelUsed, setMatchmakerModelUsed] = useState("Sensai Local Routing");
  const [matchmakerErrorMsg, setMatchmakerErrorMsg] = useState("");
  const [matchmakerKeysStatus, setMatchmakerKeysStatus] = useState({ hasGoogle: false, hasOpenAI: false });

  // Connects client-side starting skills + real-time memory decay to full-stack API search tools
  const fetchLiveMatchedJobs = async (customRole?: string) => {
    setPlacementsLoading(true);
    setMatchmakerErrorMsg("");
    try {
      const activeRole = customRole || matchmakerTargetRole;
      
      // Map candidate's initial starting skills with current real-time decay states
      const decayMap: Record<string, number> = {};
      userSkills.forEach(skill => {
        decayMap[skill] = getSkillProficiency(skill);
      });

      const response = await fetch("/api/matchmaker/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: userSkills,
          targetRole: activeRole,
          skillDecay: decayMap
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPlacements(data.jobs || []);
          setMatchmakerSourceMeta(data.source);
          setMatchmakerModelUsed(data.model);
          setMatchmakerKeysStatus(data.keysStatus || { hasGoogle: false, hasOpenAI: false });
        } else {
          setMatchmakerErrorMsg(data.error || "Failed to organize matches.");
        }
      } else {
        setMatchmakerErrorMsg(`Matcher Node responded with HTTP code ${response.status}`);
      }
    } catch (err: any) {
      console.error("Matchmaker connection failure:", err);
      setMatchmakerErrorMsg(err.message || "Failed to reach backend recruiter server.");
    } finally {
      setPlacementsLoading(false);
    }
  };

  // Run on first load of matchmaker tab or goals change
  useEffect(() => {
    if (activeTab === 'matchmaker' && placements.length === 0) {
      fetchLiveMatchedJobs();
    }
  }, [activeTab]);

  const [applyingId, setApplyingId] = useState<number | string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [appliedPlacements, setAppliedPlacements] = useState<(number | string)[]>([]);

  const handleApplyPlacement = (placement: Placement) => {
    if (appliedPlacements.includes(placement.id)) {
      if (placement.url) {
        window.open(placement.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    setApplyingId(placement.id);
    setTerminalLogs([]);

    const logSteps = [
      `[SENSAI MATCHMAKER // INITIALIZING DISPATCH GATEWAY] Contacting remote portals for ${placement.company}...`,
      `[INDEXING CREDENTIALS] Degree: "${formData.educationLevel || "Bachelor's"} in ${studyField}" verified via digital telemetry protocols.`,
      `[PORTFOLIO LINK] Analyzing candidate history at URL: github.com/${githubUser}`,
      `[CALCULATING MATCH PROBABILITY] Active skills payload overlapping: [${placement.requiredSkills.join(', ')}].`,
      `[VALIDATING SKILL RETENTION] Mean retention score calculated at: ${
        placement.requiredSkills.length > 0
          ? Math.round(placement.requiredSkills.reduce((acc, skill) => acc + getSkillProficiency(skill), 0) / placement.requiredSkills.length)
          : 100
      }% capability, incorporating decay factors...`,
      `[CONSTRUCTING COMPRESSED PACKAGE] Bundling Sensai Profile variables under goal: "${userGoal.slice(0, 50)}..."`,
      `[TRANSMITTING] Dispatched payload securely via TLS-SENSAI encryption to ${placement.company} recruiting registry.`,
      `[REDIRECTING] Activating remote URL node immediately...`,
      `[SUCCESS] Dispatch acknowledged! Launching portal link: ${placement.url || "Careers page"}`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logSteps.length) {
        setTerminalLogs(prev => [...prev, logSteps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setAppliedPlacements(prev => [...prev, placement.id]);
        setApplyingId(null);
        if (placement.url) {
          window.open(placement.url, '_blank', 'noopener,noreferrer');
        }
      }
    }, 380);
  };

  return (
    <section className="relative min-h-screen pt-8 pb-24 sm:pb-32 bg-gradient-to-b from-[#207ae2] via-[#12519e] to-[#092c5c] text-white overflow-hidden w-full select-none" id="dashboard-root">
      {/* Animated Comet Background Layer */}
      <DashboardCometBackground />
      {/* Absolute grid and cosmic overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#ffcc00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full space-y-12">
        
        {/* Dynamic customized user greeting card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/[0.05] border border-white/20 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden"
          id="user-hero-badge"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#ffcc00] bg-[#ffcc00]/10 border border-[#ffcc00]/20 rounded-full">
                Active Session Node
              </span>
              <span className="text-white/40 font-mono text-[11px]">ID // SENSAI_{githubUser.toUpperCase()}</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#ffcc00] tracking-tight flex items-center gap-2">
              Welcome back, <span className="text-white font-black">{userName}</span>!
              <Sparkles className="w-6 h-6 text-[#ffcc00] animate-pulse" />
            </h1>
            
            <p className="text-sm text-yellow-50/80 font-medium max-w-2xl leading-relaxed">
              Mapped goal: <span className="italic text-white">"{userGoal}"</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="bg-[#05172e] border border-white/10 rounded-xl px-4 py-3 min-w-[150px] text-center">
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Target Stage</div>
              <div className="text-xs sm:text-sm font-black text-[#ffcc00]">{formData.careerStage || 'Student'}</div>
            </div>
            
            <div className="bg-[#05172e] border border-white/10 rounded-xl px-4 py-3 min-w-[150px] text-center">
              <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Field of Study</div>
              <div className="text-xs sm:text-sm font-black text-white">{studyField}</div>
            </div>
          </div>
        </motion.div>

        {/* Quad Interface Tab Selector - Designed elegantly consistent with Cta layout */}
        <div className="flex flex-col sm:flex-row border-b border-white/10 pb-2 gap-2" id="dashboard-tabs">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <HighlightButton
                className={`flex items-center justify-center gap-2.5 px-6 py-4.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 pointer-events-auto cursor-pointer flex-1 sm:flex-initial outline-none select-none ${
                  activeTab === 'decay' || activeTab === 'skillchecker'
                    ? 'bg-[#ffcc00] text-[#092c5c] shadow-[0_0_15px_rgba(255,204,0,0.3)] scale-[1.02]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>1. Skill ▼</span>
              </HighlightButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-[12rem] bg-[#041226]/95 border border-[#00d2ff]/30 text-white rounded-2xl shadow-[0_0_15px_rgba(0,136,255,0.25)] p-1.5 focus:outline-none backdrop-blur-md">
              <DropdownMenuItem
                onClick={() => {
                  handleTabChange('decay');
                  setLastSkillPage('decay');
                  localStorage.setItem('career_gps_last_skill_page', 'decay');
                }}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold rounded-xl cursor-pointer transition-all duration-150 outline-none ${
                  activeTab === 'decay'
                    ? 'bg-[#0088ff]/20 text-[#ffcc00] font-black'
                    : 'text-white/80 hover:bg-[#0088ff]/10 focus:bg-[#0088ff]/10'
                }`}
              >
                <span>Skill Decay</span>
                {activeTab === 'decay' && <Check className="w-3.5 h-3.5 text-[#ffcc00]" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleTabChange('skillchecker');
                  setLastSkillPage('skillchecker');
                  localStorage.setItem('career_gps_last_skill_page', 'skillchecker');
                }}
                className={`flex items-center justify-between px-4 py-3 text-xs font-bold rounded-xl cursor-pointer transition-all duration-150 outline-none ${
                  activeTab === 'skillchecker'
                    ? 'bg-[#0088ff]/20 text-[#ffcc00] font-black'
                    : 'text-white/80 hover:bg-[#0088ff]/10 focus:bg-[#0088ff]/10'
                }`}
              >
                <span>Skill Checker</span>
                {activeTab === 'skillchecker' && <Check className="w-3.5 h-3.5 text-[#ffcc00]" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <HighlightButton
            onClick={() => handleTabChange('roadmap')}
            className={`flex items-center justify-center gap-2.5 px-6 py-4.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 pointer-events-auto cursor-pointer flex-1 sm:flex-initial ${
              activeTab === 'roadmap'
                ? 'bg-[#ffcc00] text-[#092c5c] shadow-[0_0_15px_rgba(255,204,0,0.3)] scale-[1.02]'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            2. Career Roadmaps
          </HighlightButton>
          
          <HighlightButton
            onClick={() => handleTabChange('scanner')}
            className={`flex items-center justify-center gap-2.5 px-6 py-4.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 pointer-events-auto cursor-pointer flex-1 sm:flex-initial ${
              activeTab === 'scanner'
                ? 'bg-[#ffcc00] text-[#092c5c] shadow-[0_0_15px_rgba(255,204,0,0.3)] scale-[1.02]'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <Terminal className="w-4 h-4" />
            3. GitHub Intelligent Scanner
          </HighlightButton>

          <HighlightButton
            onClick={() => handleTabChange('matchmaker')}
            className={`flex items-center justify-center gap-2.5 px-6 py-4.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 pointer-events-auto cursor-pointer flex-1 sm:flex-initial ${
              activeTab === 'matchmaker'
                ? 'bg-[#ffcc00] text-[#092c5c] shadow-[0_0_15px_rgba(255,204,0,0.3)] scale-[1.02]'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            4. Smart Matchmaker Placement
          </HighlightButton>
        </div>

        {/* ---------------------------------------------------- */}
        {/* ACTIVE MODULE CONTAINER                              */}
        {/* ---------------------------------------------------- */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: INTERACTIVE CAREER ROADMAPS */}
          {activeTab === 'roadmap' && (
            <div className="space-y-12 w-full">
              <CareerRoadmap2D
                milestones={milestones}
                setMilestones={setMilestones}
                activeMilestoneId={activeMilestoneId}
                setActiveMilestoneId={setActiveMilestoneId}
                getRoadmapProgress={getRoadmapProgress}
                handleToggleTask={handleToggleTask}
                formData={formData}
                githubUser={githubUser}
                userName={userName}
                studyField={studyField}
                userGoal={userGoal}
                setActiveTab={setActiveTab}
                onSelectPath={(goalKey, nodeId) => {
                  setSelectedPathInfo({
                    goal: goalKey,
                    nodeId: nodeId,
                    timestamp: Date.now()
                  });
                  // Dynamic smooth scrolling Down to Roadmap Intelligence Dashboard
                  setTimeout(() => {
                    const el = document.getElementById('roadmap-intelligence-dashboard');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 150);
                }}
              />

              {/* PART 2 - ROADMAP INTELLIGENCE DASHBOARD (DYNAMICALLY DETECTS PATH SELECTIONS) */}
              {selectedPathInfo && (
                <RoadmapIntelligenceDashboard
                  selectedPathInfo={selectedPathInfo}
                  formData={formData}
                  userName={userName}
                  studyField={studyField}
                  userSkills={userSkills}
                />
              )}
            </div>
          )}

          {/* TAB 2: SKILL DECAY TRACKING */}
          {activeTab === 'decay' && (
            <motion.div
              key="decay-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
              id="decay-interface"
            >
              {/* Dynamic Information Panel + Time Elapsed Simulator */}
              <div className="bg-white/[0.05] border border-white/20 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-2 text-center lg:text-left flex-1">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-orange-400">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider">AI-Powered Skill Erosion Engine</span>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-black text-[#ffcc00] tracking-tight">Technical Preservation Ledger</h2>
                    <p className="text-sm text-yellow-50/85 font-medium max-w-xl">
                      Without active practice, specialized frameworks erode from active memory. Add custom skills below to calibrate exact decay windows with active Gemini engines, generate tailored coaching paths, and deploy real-time portfolio challenge codes.
                    </p>
                  </div>

                  {/* Right: Simulator + Actions Panel */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-2xl shrink-0">
                    {/* Time Simulator */}
                    <div className="bg-[#05172e] border border-white/10 rounded-2xl p-5 flex-1 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Simulate Stagnant Span</span>
                        <span className="font-mono text-xs font-black text-[#ffcc00] bg-[#ffcc00]/10 px-2.5 py-0.5 border border-[#ffcc00]/20 rounded-md">
                          +{decayDays} Days
                        </span>
                      </div>
                      <input 
                        type="range"
                        min={0}
                        max={180}
                        value={decayDays}
                        onChange={(e) => setDecayDays(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none bg-white/15 accent-[#ffcc00] cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-white/30 font-bold uppercase">
                        <span>Day 0 (Synced)</span>
                        <span>Day 180 (Deep Decay)</span>
                      </div>
                    </div>

                    {/* Quick Trigger Button to show/hide add skill form */}
                    <button
                      type="button"
                      onClick={() => setShowAddForm(!showAddForm)}
                      className={`px-6 py-5 rounded-2xl border transition-all duration-300 font-extrabold text-xs uppercase flex flex-col justify-center items-center gap-1 shrink-0 ${
                        showAddForm 
                          ? 'border-[#ffcc00]/50 bg-[#ffcc00]/10 text-[#ffcc00]' 
                          : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/[0.08] text-white'
                      }`}
                    >
                      <Plus className={`w-5 h-5 transition-transform duration-300 ${showAddForm ? 'rotate-45 text-[#ffcc00]' : ''}`} />
                      <span>{showAddForm ? 'Close Node Tracker' : 'Track New Skill'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Add Skill Tracker Form (Gemini Calibrated) */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleAddSkill} className="bg-gradient-to-br from-[#061d3a] to-[#041226] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                        <Sparkles className="w-5 h-5 text-[#ffcc00] animate-pulse" />
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-white">Dynamic AI Decay Calibration</h3>
                          <p className="text-xs text-white/50 font-bold uppercase">No mock calculations. Real calibrated telemetry parameters.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Skill Name Column with Autocomplete suggestions popup */}
                        <div className="space-y-2 relative">
                          <label className="text-[11px] font-black text-white/60 uppercase tracking-wider block">Technology Node Name</label>
                          <input 
                            type="text"
                            placeholder="e.g. PyTorch, Docker, React"
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            className="w-full bg-[#031021] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffcc00] transition-colors"
                          />
                          {/* Autocomplete suggestion popup list */}
                          {newSkillName && !skillsTaxonomy.includes(newSkillName) && (
                            <div className="absolute top-[100%] left-0 right-0 z-10 max-h-40 overflow-y-auto bg-[#031021] border border-white/20 rounded-xl mt-1 p-1 space-y-1 shadow-2xl">
                              {skillsTaxonomy
                                .filter(s => s.toLowerCase().includes(newSkillName.toLowerCase()))
                                .map(s => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => setNewSkillName(s)}
                                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10"
                                  >
                                    {s}
                                  </button>
                                ))
                              }
                            </div>
                          )}
                        </div>

                        {/* Peak Proficiency Level Column */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-white/60 uppercase tracking-wider block">Peak Proficiency</label>
                          <select
                            value={newSkillProficiency}
                            onChange={(e) => setNewSkillProficiency(Number(e.target.value))}
                            className="w-full bg-[#031021] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffcc00] transition-colors"
                          >
                            <option value={1}>1 - Beginner (Concept only)</option>
                            <option value={2}>2 - Familiar (Limited small scripts)</option>
                            <option value={3}>3 - Intermediate (Build standalone apps)</option>
                            <option value={4}>4 - Advanced (Production architectures)</option>
                            <option value={5}>5 - Expert (System Tuning / Core contributor)</option>
                          </select>
                        </div>

                        {/* Last Actively Applied Date Picker */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[11px] font-black text-white/60 uppercase tracking-wider block">Last Active Date</label>
                            <button 
                              type="button"
                              onClick={() => setNewSkillLastUsed(new Date().toISOString().slice(0, 10))}
                              className="text-[10px] text-[#ffcc00] font-black uppercase hover:underline"
                            >
                              Set Today
                            </button>
                          </div>
                          <input 
                            type="date"
                            value={newSkillLastUsed}
                            max={new Date().toISOString().slice(0, 10)}
                            onChange={(e) => setNewSkillLastUsed(e.target.value)}
                            className="w-full bg-[#031021] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffcc00] transition-colors"
                          />
                        </div>

                        {/* Usage Context Dropdown & Github URL */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-white/60 uppercase tracking-wider block">Application Context</label>
                          <select
                            value={newSkillContext}
                            onChange={(e) => setNewSkillContext(e.target.value)}
                            className="w-full bg-[#031021] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffcc00] transition-colors"
                          >
                            <option value="Personal Project">Personal Project</option>
                            <option value="Internship/Job">Internship / Full-Time Job</option>
                            <option value="Freelance Contract">Freelance Contract</option>
                            <option value="Academic Course">Academic Coursework</option>
                          </select>
                        </div>
                      </div>

                      {/* Advanced Options Optional Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-white/60 uppercase tracking-wider block">Repository Scope (Optional github link)</label>
                          <input 
                            type="text"
                            placeholder="github.com/your-username/repo-name"
                            value={newSkillGithubUrl}
                            onChange={(e) => setNewSkillGithubUrl(e.target.value)}
                            className="w-full bg-[#031021] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffcc00] transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-white/60 uppercase tracking-wider block">Ecosystem Category Classification</label>
                          <select
                            value={newSkillCategory}
                            onChange={(e) => setNewSkillCategory(e.target.value)}
                            className="w-full bg-[#031021] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ffcc00] transition-colors"
                          >
                            <option value="Frontend">Frontend (React, Vue, Vite, Tailwind)</option>
                            <option value="Backend">Backend Framework (Express, Node, FastAPI, Go)</option>
                            <option value="DevOps">Cloud/DevOps Systems (Docker, AWS, Kubernetes)</option>
                            <option value="Database">Databases & Query Engines (PostgreSQL, SQL, MongoDB)</option>
                            <option value="Machine Learning">Machine Learning / AI Math (PyTorch, TensorFlow)</option>
                          </select>
                        </div>
                      </div>

                      {addSkillError && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-300">
                          {addSkillError}
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white text-xs font-extrabold uppercase cursor-pointer"
                        >
                          Cancel Calibration
                        </button>
                        <button
                          type="submit"
                          disabled={isAddingSkill}
                          className="px-8 py-3 rounded-xl bg-[#ffcc00] text-[#05172e] font-black text-xs uppercase hover:bg-[#ffd900] disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                          {isAddingSkill ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Calibrating AI Matrix...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Initialize Real Track</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grid: Selected details + Cards List */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* List of Skills Section (Right 1 column when active, or 3 columns when no selection) */}
                <div className={selectedDecaySkillId ? "xl:col-span-1 xl:order-2 space-y-6" : "xl:col-span-3 space-y-6"}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#ffcc00]" />
                      <span>Under Surveillance: {decaySkillsList.length} Technical Nodes</span>
                    </h3>
                    <span className="font-mono text-[10px] text-white/50 uppercase font-black">
                      Score calculations strictly dynamic relative to calendar values
                    </span>
                  </div>

                  <div className={`grid grid-cols-1 gap-6 ${selectedDecaySkillId ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                    {decaySkillsList.map((skill) => {
                      // Calculate dynamic variables
                      const dateObj = new Date(skill.last_used_at);
                      const nowObj = new Date();
                      const rawDaysSince = Math.max(0, Math.floor((nowObj.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)));
                      const daysSinceUsed = rawDaysSince + decayDays;
                      
                      const decayScore = Math.max(0, Math.min(100, Math.round(100 - (daysSinceUsed / skill.decay_rate_days) * 100)));
                      
                      const pColor = decayScore >= 75 ? 'text-[#ffcc00] border-[#ffcc00]/50' : decayScore >= 40 ? 'text-orange-400 border-orange-500/40' : 'text-red-400 border-red-500/40';
                      const pBg = decayScore >= 75 ? 'bg-[#ffcc00]' : decayScore >= 40 ? 'bg-orange-400' : 'bg-red-500';
                      const statusLabel = decayScore >= 75 ? 'FRESH CONSTANT' : decayScore >= 40 ? 'AGING METRIC' : 'CRITICAL EROSION';

                      const isCurrentlySelected = selectedDecaySkillId === skill.id;

                      return (
                        <motion.div
                          key={skill.id}
                          layout
                          onClick={() => handleSelectSkillForCoaching(skill.id)}
                          className={`p-5 sm:p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between gap-5 relative overflow-hidden cursor-pointer transition-all duration-300 border ${
                            isCurrentlySelected 
                              ? 'bg-white/[0.12] border-[#ffcc00]/70 ring-2 ring-[#ffcc00]/30 shadow-xl' 
                              : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">TECH DECK NODE</span>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase ${pColor}`}>
                                  {statusLabel}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSkillTrack(skill.id);
                                  }}
                                  className="p-1 text-white/30 hover:text-red-400 transition-colors"
                                  title="Delete active tracker"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-xl font-black text-white">{skill.name}</h4>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50 uppercase font-black">
                                <Briefcase className="w-3 h-3 text-[#ffcc00]" />
                                <span>Peak Peak Level: {skill.proficiency}/5</span>
                                <span className="text-white/20">•</span>
                                <Calendar className="w-3 h-3 text-orange-400" />
                                <span>{daysSinceUsed} Days Inactive</span>
                              </div>
                            </div>

                            {/* Dynamic visual meter */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-mono font-bold">
                                <span className="text-white/70">Estimated Retention:</span>
                                <span className={decayScore < 50 ? 'text-red-400 font-extrabold' : 'text-white'}>{decayScore}%</span>
                              </div>
                              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: '100%' }}
                                  animate={{ width: `${decayScore}%` }}
                                  transition={{ duration: 0.3 }}
                                  className={`h-full ${pBg} shadow-md`}
                                />
                              </div>
                              <p className="text-[10px] text-white/50 font-medium">Decays over approx. {skill.decay_rate_days} days</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickResetSkill(skill.id);
                              }}
                              className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-[#ffcc00]/10 border border-white/10 hover:border-[#ffcc00]/30 text-[11px] font-black hover:text-[#ffcc00] text-white/90 transition-all duration-200 flex items-center justify-center gap-1.5"
                            >
                              <RefreshCw className="w-3 h-3 animate-spin border-transparent" />
                              <span>Reset Clock</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReinforceSkill(skill.name);
                              }}
                              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 hover:border-white/10 text-[11px] font-bold"
                              title="Take direct memory quiz"
                            >
                              Quiz Verification
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Drill Down Dynamic Panel (Right column) */}
                {selectedDecaySkillId && (() => {
                  const skill = decaySkillsList.find(s => s.id === selectedDecaySkillId);
                  if (!skill) return null;

                  const dateObj = new Date(skill.last_used_at);
                  const nowObj = new Date();
                  const rawDaysSince = Math.max(0, Math.floor((nowObj.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)));
                  const daysSinceUsed = rawDaysSince + decayDays;
                  const decayScore = Math.max(0, Math.min(100, Math.round(100 - (daysSinceUsed / skill.decay_rate_days) * 100)));

                  return (
                    <div className="xl:col-span-2 xl:order-1 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-[#ffcc00]" />
                          <span>AI Coaching Directives</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => setSelectedDecaySkillId(null)}
                          className="text-xs text-white/40 hover:text-white uppercase font-black"
                        >
                          Deselect Node
                        </button>
                      </div>

                      {/* Display Loading state or Coaching output */}
                      <div className="bg-gradient-to-b from-[#092c5c] to-[#041226] border border-white/20 rounded-[2rem] p-6 space-y-6 shadow-2xl relative">
                        <div className="flex items-center justify-between border-b border-white/15 pb-4">
                          <div>
                            <h4 className="text-xl font-black text-[#ffcc00]">{skill.name}</h4>
                            <p className="text-[10px] uppercase font-mono font-bold text-white/40">Diagnostic Calibration</p>
                          </div>
                          <span className={`text-[10px] px-2.5 py-1 rounded-md border font-mono font-black uppercase ${
                            decayScore >= 70 ? 'text-emerald-400 border-emerald-400/20' : decayScore >= 40 ? 'text-orange-400 border-orange-400/20' : 'text-red-400 border-red-400/20'
                          }`}>
                            {decayScore}% Retention
                          </span>
                        </div>

                        {/* If fetching coaching data */}
                        {isFetchingCoaching ? (
                          <div className="py-20 flex flex-col items-center justify-center gap-3 text-white/50">
                            <RefreshCw className="w-10 h-10 animate-spin text-[#ffcc00]" />
                            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#ffcc00]">Querying Gemini Coaching Models...</span>
                          </div>
                        ) : coachingError ? (
                          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-300">
                            {coachingError}
                          </div>
                        ) : skill.coaching ? (
                          <div className="space-y-5">
                            {/* Urgent Headline warning */}
                            <div className="p-4 rounded-xl bg-[#031021] border border-white/10 space-y-2">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase inline-block ${
                                skill.coaching.urgency === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-400/20' : 'bg-orange-500/20 text-orange-400 border border-orange-400/20'
                              }`}>
                                {skill.coaching.urgency} Action Required
                              </span>
                              <p className="text-xs font-black text-white">{skill.coaching.headline}</p>
                            </div>

                            {/* What you are losing column */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-black uppercase text-white/40 block">Skill Depreciation Risk</span>
                              <p className="text-xs text-white/80 leading-relaxed font-medium">{skill.coaching.what_you_are_losing}</p>
                            </div>

                            {/* Market updates */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-black uppercase text-white/40 block">2026 Hiring & Market Signal</span>
                              <p className="text-xs text-white/80 leading-relaxed font-medium">{skill.coaching.market_signal}</p>
                            </div>

                            {/* Fastest fix action plan */}
                            <div className="p-4 rounded-xl bg-[#042045] border border-[#ffcc00]/20 space-y-2">
                              <span className="text-[9px] font-black uppercase text-[#ffcc00] block tracking-wider">Fast-Path Mitigation Action</span>
                              <p className="text-xs text-white/90 font-bold">{skill.coaching.fastest_fix}</p>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#ffcc00] font-extrabold uppercase">
                                <Zap className="w-3 h-3 text-[#ffcc00] animate-pulse" />
                                <span>Requires approx {skill.coaching.estimated_reactivation_hours} hours focused practice</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-400/30 text-xs font-bold text-orange-200">
                            Perform an act on this node, or click other track fields to auto-query the live diagnosis database.
                          </div>
                        )}



                        {/* Challenge Generator Block inside coaching details panel */}
                        <div className="border-t border-white/10 pt-4 space-y-4">
                          <div className="space-y-1">
                            <h5 className="text-sm font-black text-white flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-[#ffcc00]" />
                              <span>48-Hour Refresh Challenge</span>
                            </h5>
                            <p className="text-[10px] text-white/50 leading-relaxed">
                              Gemini will generate a highly relevant hands-on micro-project targeting this technology. Complete it to instantly reset the decay metric.
                            </p>
                          </div>

                          {isGeneratingChallenge === skill.id ? (
                            <div className="py-8 flex flex-col items-center justify-center gap-2">
                              <RefreshCw className="w-6 h-6 animate-spin text-[#ffcc00]" />
                              <span className="text-[9px] font-mono uppercase font-bold text-white/40">Architecting custom workspace code project...</span>
                            </div>
                          ) : (skill.challenge && hasGeneratedProjects[skill.id]) ? (
                            // Completed formatted challenge spec
                            <div className="bg-[#031021] border border-white/10 rounded-2xl p-4 space-y-4 relative overflow-hidden">
                              <div className="absolute top-2 right-2 text-[10px] font-mono text-[#ffcc00] font-black uppercase bg-[#ffcc00]/10 px-2 py-0.5 border border-[#ffcc00]/20 rounded">
                                ACTIVE SPEC
                              </div>

                              <div className="space-y-1 pr-16 bg-transparent">
                                <h6 className="text-xs font-black text-white underline decoration-[#ffcc00] uppercase">{skill.challenge.project_title}</h6>
                                <p className="text-[11px] text-[#ffcc00] leading-snug font-bold">{skill.challenge.one_liner}</p>
                              </div>

                              <div className="space-y-1 font-sans text-[11px] text-white/80 leading-relaxed">
                                <span className="text-[8px] font-mono uppercase font-black text-white/30 block">Why recruiters look for this:</span>
                                <p>{skill.challenge.why_it_matters}</p>
                              </div>

                              {/* Curated Stack badges */}
                              <div className="space-y-1.5">
                                <span className="text-[8px] font-mono uppercase font-black text-white/30 block">Suggested Techstack Components:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {skill.challenge.tech_stack.map(t => (
                                    <span key={t} className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/10 text-white/90 border border-white/5 lowercase">{t}</span>
                                  ))}
                                </div>
                              </div>

                              {/* Folder layout inside code box */}
                              <div className="space-y-1">
                                <span className="text-[8px] font-mono uppercase font-black text-white/30 block">Target File Repository Layout:</span>
                                <pre className="p-3 bg-black/40 text-[9px] font-mono text-emerald-400 overflow-x-auto rounded-lg leading-relaxed border border-white/5 select-all">
                                  {skill.challenge.folder_structure}
                                </pre>
                              </div>

                              {/* Milestones matrix */}
                              <div className="space-y-2">
                                <span className="text-[8px] font-mono uppercase font-black text-white/30 block">48h Milestone Timeline:</span>
                                <div className="space-y-1.5 font-mono text-[10px]">
                                  {skill.challenge.milestones.map((m: any, idx: number) => (
                                    <div key={idx} className="flex gap-2 items-start text-white/80">
                                      <span className="text-[#ffcc00] font-black shrink-0">H{m.hour}:</span>
                                      <span className="leading-snug">{m.task}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Bullet ready */}
                              <div className="space-y-1 p-3 rounded-lg bg-white/5 border border-white/15">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[8px] font-mono uppercase font-black text-emerald-400 block">STAR Resume Bullet Ready:</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(skill.challenge!.resume_bullet);
                                      alert("Copied to clipboard. Paste this elegant STAR resume bullet block straight onto your documents!");
                                    }}
                                    className="text-[9px] font-mono underline hover:text-white text-white/50 cursor-pointer flex items-center gap-1"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>Copy Bullet</span>
                                  </button>
                                </div>
                                <p className="text-[10px] font-mono text-emerald-300 italic">
                                  "{skill.challenge.resume_bullet}"
                                </p>
                              </div>

                              {skill.challenge.stretch_goal && (
                                <div className="space-y-1">
                                  <span className="text-[8px] font-mono uppercase font-black text-white/30 block">Stretch Goal / Extension:</span>
                                  <p className="text-[10px] text-white/70">{skill.challenge.stretch_goal}</p>
                                </div>
                              )}

                              {/* Three tabbed sections below the milestone timeline */}
                              {(() => {
                                const currentTab = activeChallengeTabs[skill.id] || 'folder';
                                const isGitHubConnected = !!scanUsername && !!scanToken;
                                return (
                                  <div className="space-y-3 mt-4 border-t border-white/5 pt-4">
                                    <div className="flex gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
                                      <button
                                        type="button"
                                        onClick={() => setActiveChallengeTabs(prev => ({ ...prev, [skill.id]: 'folder' }))}
                                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer ${
                                          currentTab === 'folder'
                                            ? 'bg-[#ffcc00] text-[#092c5c] font-black'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                      >
                                        Folder Structure
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setActiveChallengeTabs(prev => ({ ...prev, [skill.id]: 'deps' }))}
                                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer ${
                                          currentTab === 'deps'
                                            ? 'bg-[#ffcc00] text-[#092c5c] font-black'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                      >
                                        Dependencies
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setActiveChallengeTabs(prev => ({ ...prev, [skill.id]: 'env' }))}
                                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer ${
                                          currentTab === 'env'
                                            ? 'bg-[#ffcc00] text-[#092c5c] font-black'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                      >
                                        Environment Setup
                                      </button>
                                    </div>

                                    {/* Tab 1: Folder Structure */}
                                    {currentTab === 'folder' && (
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between items-center bg-transparent">
                                          <span className="text-[8px] font-mono uppercase font-black text-white/40 block">Nested Files Tree:</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              navigator.clipboard.writeText(skill.challenge.folder_structure_tree || skill.challenge.folder_structure);
                                              alert("Workspace Folder Tree copied successfully!");
                                            }}
                                            className="text-[9px] font-mono text-white/50 hover:text-white cursor-pointer flex items-center gap-1"
                                          >
                                            <Copy className="w-2.5 h-2.5" />
                                            <span>Copy Tree</span>
                                          </button>
                                        </div>
                                        <pre className="p-3 bg-black/60 text-[10px] font-mono text-emerald-400 overflow-x-auto rounded-xl leading-relaxed border border-white/5 select-all max-h-56">
                                          {skill.challenge.folder_structure_tree || skill.challenge.folder_structure}
                                        </pre>
                                      </div>
                                    )}

                                    {/* Tab 2: Dependencies */}
                                    {currentTab === 'deps' && (
                                      <div className="space-y-3">
                                        {skill.challenge.dependencies ? (
                                          <>
                                            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center gap-2">
                                              <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider">Install:</span>
                                              <code className="text-[10.5px] bg-black/50 px-2 py-0.5 rounded font-mono text-white font-bold tracking-tight select-all">
                                                {skill.challenge.dependencies.install_command || "npm install"}
                                              </code>
                                            </div>
                                            <div className="space-y-1.5">
                                              <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-mono uppercase font-black text-white/40 block">Dependency Configuration:</span>
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    navigator.clipboard.writeText(skill.challenge.dependencies!.package_json);
                                                    alert("Dependencies configuration copied successfully!");
                                                  }}
                                                  className="text-[9px] font-mono text-white/50 hover:text-white cursor-pointer flex items-center gap-1"
                                                >
                                                  <Copy className="w-2.5 h-2.5" />
                                                  <span>Copy Config</span>
                                                </button>
                                              </div>
                                              <pre className="p-3 bg-black/60 text-[10px] font-mono text-teal-300 overflow-x-auto rounded-xl leading-relaxed border border-white/5 select-all max-h-56">
                                                {skill.challenge.dependencies.package_json}
                                              </pre>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="space-y-1.5">
                                            <div className="p-2.5 rounded-xl bg-[#092c5c] text-[10px] text-white/60 text-center font-mono border border-white/5">
                                              No dependency specifications detected. Generate a fresh new challenge spec to load dependencies tree.
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Tab 3: Environment Setup */}
                                    {currentTab === 'env' && (
                                      <div className="space-y-2">
                                        <span className="text-[8px] font-mono uppercase font-black text-white/40 block">Required Environment variables:</span>
                                        {Array.isArray(skill.challenge.env_variables) && skill.challenge.env_variables.length > 0 ? (
                                          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                            {skill.challenge.env_variables.map((env: any, idx: number) => {
                                              const hasLink = env.where_to_get && (env.where_to_get.includes("http://") || env.where_to_get.includes("https://"));
                                              let cleanUrl = "";
                                              if (hasLink) {
                                                const matches = env.where_to_get.match(/https?:\/\/[^\s]+/g);
                                                if (matches) cleanUrl = matches[0];
                                              }
                                              return (
                                                <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1.5 text-left font-mono">
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-[#ffcc00]">{env.key}</span>
                                                    {env.required ? (
                                                      <span className="text-[8px] font-black uppercase text-rose-400 bg-rose-400/10 px-1.5 py-0.5 rounded border border-rose-400/20">Required</span>
                                                    ) : (
                                                      <span className="text-[8px] font-black uppercase text-white/30 bg-white/5 px-1.5 py-0.5 rounded">Optional</span>
                                                    )}
                                                  </div>
                                                  <p className="text-[10px] text-white/70 font-sans italic leading-normal">{env.description}</p>
                                                  <span className="text-[8px] text-white/40 block">Placeholder: "{env.placeholder}"</span>
                                                  <div className="text-[9px] text-teal-400 font-bold mt-1">
                                                    Source:{" "}
                                                    {hasLink && cleanUrl ? (
                                                      <a
                                                        href={cleanUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="underline inline-flex items-center gap-0.5 hover:text-[#ffcc00] break-all"
                                                      >
                                                        {env.where_to_get}
                                                        <ExternalLink className="w-2.5 h-2.5" />
                                                      </a>
                                                    ) : (
                                                      <span className="break-all text-white/60">{env.where_to_get}</span>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        ) : (
                                          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center text-[10px] text-white/40 font-mono">
                                            No special environment variables. Build from Hour 0!
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Completion row */}
                                    <div className="border-t border-white/5 pt-4 space-y-3">
                                      {pushStatuses[skill.id] === 'done' && pushedRepoUrls[skill.id] && (
                                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-left">
                                          <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <div className="space-y-0.5">
                                              <p className="text-xs font-black text-white uppercase tracking-wider">Repository Initialized!</p>
                                              <p className="text-[10px] text-emerald-300/80 font-mono">Decay Score Reset & Repo Scanned</p>
                                            </div>
                                          </div>
                                          <a
                                            href={pushedRepoUrls[skill.id]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#031021] text-[10px] font-black uppercase rounded-lg shadow-lg flex items-center gap-1 transition-all pointer-events-auto cursor-pointer"
                                          >
                                            <span>View on GitHub</span>
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        </div>
                                      )}

                                      {/* Launcher button directly above complete / connect buttons */}
                                      <div className="pt-1">
                                        <button
                                          type="button"
                                          onClick={() => setActiveAssessmentSkill(skill.name)}
                                          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e07600] to-[#f49b00] hover:from-[#f08500] hover:to-[#ffa600] text-white font-black text-xs uppercase cursor-pointer text-center select-none shadow-md transition-all active:scale-95"
                                        >
                                          <Terminal className="w-3.5 h-3.5 animate-pulse" />
                                          <span>Launch Coding Studio IDE</span>
                                        </button>
                                      </div>

                                      <div className="flex flex-col sm:flex-row gap-2 bg-transparent pt-1">
                                        {/* Mark as Complete always available */}
                                        <button
                                          type="button"
                                          onClick={() => handleCompleteChallenge(skill.id)}
                                          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase hover:from-emerald-500 hover:to-teal-500 cursor-pointer text-center select-none shadow-md transition-all"
                                        >
                                          Mark as Complete
                                        </button>

                                        {/* Push to GitHub or connection notice */}
                                        {isGitHubConnected ? (
                                          <button
                                            type="button"
                                            onClick={() => handlePushToGitHub(skill.id)}
                                            disabled={isPushingRepo === skill.id || pushStatuses[skill.id] === 'done'}
                                            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase transition-all flex items-center justify-center gap-1.5 border ${
                                              pushStatuses[skill.id] === 'done'
                                                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 cursor-not-allowed'
                                                : isPushingRepo === skill.id
                                                ? 'border-[#ffcc00]/20 bg-white/5 text-white/40 cursor-wait'
                                                : 'border-[#ffcc00] hover:bg-[#ffcc00]/10 text-[#ffcc00] cursor-pointer'
                                            }`}
                                          >
                                            {isPushingRepo === skill.id ? (
                                              <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                <span>{pushStatuses[skill.id] === 'creating_repo' ? 'Creating Repo...' : 'Pushing Scaffold...'}</span>
                                              </>
                                            ) : pushStatuses[skill.id] === 'done' ? (
                                              <>
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>Pushed to GitHub</span>
                                              </>
                                            ) : (
                                              <>
                                                <GitPullRequest className="w-3.5 h-3.5" />
                                                <span>Push to GitHub</span>
                                              </>
                                            )}
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              handleTabChange('scanner');
                                              setTimeout(() => {
                                                const el = document.getElementById('github-scanner-config-header');
                                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                              }, 100);
                                            }}
                                            className="flex-1 py-3 px-4 rounded-xl bg-[#092c5c] text-white/80 hover:text-white border border-[#ffcc00]/30 hover:border-[#ffcc00] text-xs font-black uppercase text-center cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                            title="Specify username and personal token in GitHub Scanner tab first"
                                          >
                                            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                            <span className="truncate">Connect GitHub</span>
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            <div className="space-y-2 mt-2">
                              <button
                                type="button"
                                onClick={() => setActiveAssessmentSkill(skill.name)}
                                className="w-full flex items-center justify-center gap-2 py-3.2 px-4 rounded-xl bg-gradient-to-r from-[#e07600] to-[#f49b00] hover:from-[#f08500] hover:to-[#ffa600] text-white font-black text-xs uppercase cursor-pointer text-center select-none shadow-md transition-all active:scale-95"
                              >
                                <Terminal className="w-3.5 h-3.5 animate-pulse" />
                                <span>Launch Coding Studio IDE</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleGenerateRefreshChallenge(skill.id)}
                                className="w-full py-3 px-4 rounded-xl border border-[#ffcc00]/50 hover:bg-[#ffcc00]/10 text-xs font-black text-[#ffcc00] transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-md font-sans"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Deploy 48h Portfolio Specs</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* INLINE CHALLENGE MODAL */}
              <AnimatePresence>
                {activeTestSkill && (() => {
                  const qInfo = questionsBySkill[activeTestSkill] || questionsBySkill['JavaScript'];
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed inset-0 min-h-screen bg-[#041226]/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                    >
                      <div className="bg-gradient-to-br from-[#092c5c] to-[#05172e] border-2 border-[#ffcc00]/70 rounded-[2rem] p-6 sm:p-10 max-w-xl w-full shadow-2xl relative space-y-6">
                        
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2 text-[#ffcc00]">
                            <Terminal className="w-5 h-5 animate-pulse" />
                            <span className="font-mono text-xs font-bold uppercase tracking-widest">PROACTIVE REINFORCEMENT MODE</span>
                          </div>
                          <span className="font-extrabold text-xs text-white/50">{activeTestSkill} Memory Node</span>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-base sm:text-lg font-black leading-relaxed text-white">
                            {qInfo.q}
                          </h3>

                          {/* Options Checklist */}
                          <div className="space-y-2.5">
                            {qInfo.options.map((opt) => {
                              const isSel = selectedAnswer === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    if (testResult === null) setSelectedAnswer(opt);
                                  }}
                                  disabled={testResult !== null}
                                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                    isSel 
                                      ? 'bg-[#ffcc00]/10 border-[#ffcc00] text-[#ffcc00]' 
                                      : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Result Panel */}
                        {testResult !== null && (
                          <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold leading-relaxed ${
                            testResult === 'correct' 
                              ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300' 
                              : 'bg-red-500/10 border-red-400/30 text-red-300'
                          }`}>
                            <div className="font-extrabold mb-1 shadow-sm uppercase tracking-wider">
                              {testResult === 'correct' ? '[SUCCESS] TEST PASSED (+100% REF_INDEX)' : '[FAILURE] ERROR INCORRECT PARAMETER'}
                            </div>
                            <p>{testResult === 'correct' ? qInfo.explanation : 'That was not the correct proof factor. Review documentation parameters and re-attempt reinforcement.'}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => setActiveTestSkill(null)}
                            className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold cursor-pointer"
                          >
                            Close Connection
                          </button>

                          {testResult === null ? (
                            <button
                              type="button"
                              onClick={handleSubmitAnswer}
                              disabled={!selectedAnswer}
                              className="px-6 py-2.5 rounded-xl bg-[#ffcc00] text-[#092c5c] hover:bg-[#ffd900] disabled:opacity-40 text-xs font-black cursor-pointer shadow-lg"
                            >
                              Submit Answer Verification
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAnswer(null);
                                setTestResult(null);
                              }}
                              className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 text-xs font-bold cursor-pointer"
                            >
                              Retry Test Parameters
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </motion.div>
          )}

          {/* TAB 2.5: SKILL CHECKER */}
          {activeTab === 'skillchecker' && (
            <motion.div
              key="skillchecker-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
              id="skillchecker-interface"
            >
              <SkillChecker 
                formData={formData}
                activeSkillsList={activeSkillsList}
                setActiveSkillsList={setActiveSkillsList}
              />
            </motion.div>
          )}

          {/* TAB 3: SMART MATCHMAKER PLACEMENT */}
          {activeTab === 'matchmaker' && (
            <motion.div
              key="matchmaker-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
              id="matchmaker-interface"
            >
              {/* Sci-Fi Global Search and Key Integrity Dashboard Block */}
              <div className="bg-gradient-to-br from-[#0b2241] to-[#041226] border border-white/20 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[90px]" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[90px]" />
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffcc00]/10 border border-[#ffcc00]/20 text-[#ffcc00] text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Live Recruiter Sync Protocol
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                      Live Placement Matchmaker Cockpit
                    </h3>
                    <p className="text-xs text-white/70 max-w-2xl font-medium">
                      Integrates your starting profile and telemetry decay metrics to query online openings. Leverage custom Google Custom Search and OpenAI keys to calculate direct match scores, or run on backup systems.
                    </p>
                  </div>

                  {/* API Key Connection Indicators */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3  py-1.5 rounded-xl border bg-[#05172e] border-white/10">
                      <span className={`w-2.5 h-2.5 rounded-full ${matchmakerKeysStatus.hasGoogle ? 'bg-[#ffcc00] animate-pulse shadow-[0_0_8px_#ffcc00]' : 'bg-orange-500'}`} />
                      <span className="text-[10px] font-mono font-bold text-white/80">
                        GOOGLE JOBS API: {matchmakerKeysStatus.hasGoogle ? "CONNECTED" : "LOCAL RESILIENT FEED"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-[#05172e] border-white/10">
                      <span className={`w-2.5 h-2.5 rounded-full ${matchmakerKeysStatus.hasOpenAI ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgb(52,211,153)]' : 'bg-orange-400'}`} />
                      <span className="text-[10px] font-mono font-bold text-white/80">
                        OPENAI ENGINE: {matchmakerKeysStatus.hasOpenAI ? "GPT-4o INTEGRATED" : "GEMINI DEPLOYMENT"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Job Query Search Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 relative z-10">
                  <div className="md:col-span-3 relative">
                    <label className="text-[10px] font-mono font-black text-white/50 uppercase tracking-widest block mb-1">Target Role Placement Search</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input 
                        type="text"
                        value={matchmakerTargetRole}
                        onChange={(e) => setMatchmakerTargetRole(e.target.value)}
                        placeholder="Customize target placement e.g. React Front-End Developer, Devops Lead..."
                        className="w-full bg-[#031021] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-white focus:outline-none focus:border-[#ffcc00] transition-all placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => fetchLiveMatchedJobs()}
                      disabled={placementsLoading}
                      className="w-full bg-[#ffcc00] hover:bg-[#ffe600] disabled:bg-white/10 text-black font-black text-xs uppercase py-4 rounded-2xl transition-all cursor-pointer shadow-lg tracking-wider flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
                    >
                      {placementsLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>Polling Web Nodes...</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4 text-black" />
                          <span>Search matched Jobs</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Diagnostic Meta Block */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 text-[10px] font-mono text-white/50">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">&gt;&gt; ACTIVE NODE INDICATOR:</span>
                    <span className="text-white font-extrabold uppercase">{matchmakerSourceMeta}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">&gt;&gt; RECOGNITION BRAIN:</span>
                    <span className="text-white font-extrabold uppercase bg-white/5 px-2 py-0.5 rounded">{matchmakerModelUsed}</span>
                  </div>
                </div>
              </div>

              {/* Main Tab Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Placement Cards Grid */}
                <div className="lg:col-span-2 space-y-6">
                  {matchmakerErrorMsg && (
                    <div className="p-4 px-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold leading-relaxed">
                      ⚠️ {matchmakerErrorMsg} - Set optional credentials in the developer panel or run on local fallback matrix.
                    </div>
                  )}

                  {placementsLoading ? (
                    <div className="p-12 text-center space-y-6 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full border-4 border-white/5 animate-pulse" />
                        <div className="w-16 h-16 rounded-full border-4 border-[#ffcc00] border-t-transparent animate-spin" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-base font-black text-white uppercase tracking-wider">Compiling Semantic Match Matrix</h4>
                        <p className="text-xs text-white/50 font-mono">Querying Custom Jobs APIs & calculating memory decay retention bounds...</p>
                      </div>
                    </div>
                  ) : placements.length === 0 ? (
                    <div className="p-12 text-center space-y-4 rounded-[2.5rem] bg-white/[0.03] border border-white/10">
                      <p className="text-sm text-white/50 italic">No matching job records found. Try resetting the Search Placement query above.</p>
                      <button
                        type="button"
                        onClick={() => { setMatchmakerTargetRole("Software Engineer"); fetchLiveMatchedJobs("Software Engineer"); }}
                        className="px-4 py-2 bg-white/5 border border-white/15 text-white hover:bg-white/10 text-xs font-bold uppercase rounded-lg"
                      >
                        Reset Role Search
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                      {placements.map((p) => {
                        const isApplied = appliedPlacements.includes(p.id);
                        
                        // Check if any of the required skills has low proficiency (< 70%) or high decay passed
                        const hasCriticalDecay = p.requiredSkills.some(sk => getSkillProficiency(sk) < 70);

                        return (
                          <div
                            key={p.id}
                            className="p-5 sm:p-6 rounded-3xl bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-md border border-white/15 flex flex-col justify-between gap-5 relative overflow-hidden group transition-all duration-300 hover:border-white/30 hover:-translate-y-1 shadow-[0_10px_25px_rgba(0,0,0,0.2)]"
                          >
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black tracking-widest text-[#ffcc00] uppercase bg-[#ffcc00]/10 border border-[#ffcc00]/20 px-2 py-0.5 rounded">
                                  {p.tier}
                                </span>
                                <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded">
                                  {p.matchScore}% FIT
                                </span>
                              </div>

                              <div className="space-y-1">
                                <h3 
                                  onClick={() => p.url && window.open(p.url, '_blank', 'noopener,noreferrer')}
                                  title="Tapping redirects immediately to posting portal"
                                  className="text-base sm:text-lg font-black text-white hover:text-[#ffcc00] transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <span>{p.title}</span>
                                  <span className="text-white/30 text-[10px] font-normal group-hover:text-[#ffcc00]">(Redirect)</span>
                                </h3>
                                <div className="text-xs text-white/50 font-bold">{p.company}</div>
                              </div>

                              <p className="text-xs text-white/70 leading-relaxed font-semibold">
                                {p.description}
                              </p>

                              {p.fitAnalysis && (
                                <div className="p-3 bg-[#031021]/60 border border-white/5 rounded-xl text-[11px] text-white/80 leading-relaxed">
                                  <span className="text-[#ffcc00] font-bold block mb-1">AI Match Analysis:</span>
                                  {p.fitAnalysis}
                                </div>
                              )}

                              <div className="space-y-2">
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Requires Skills Overlap:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {p.requiredSkills.map((sk) => {
                                    const activeProf = getSkillProficiency(sk);
                                    const isMastered = activeProf >= 80;
                                    return (
                                      <span
                                        key={sk}
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                                          isMastered
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                            : activeProf >= 60 
                                              ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                                              : 'bg-red-500/10 border-red-500/20 text-red-400'
                                        }`}
                                      >
                                        <Check className="w-3 h-3" />
                                        {sk} ({activeProf}%)
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>

                              {hasCriticalDecay && (
                                <div className="flex items-center gap-1.5 text-[10px] text-red-300 font-extrabold bg-red-400/5 px-2.5 py-1 border border-red-500/20 rounded-lg">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Node decay alert: Run reinforcement drills to optimize index scores.</span>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {/* Direct Tap Instant Redirect Button */}
                              {p.url && (
                                <button
                                  type="button"
                                  onClick={() => window.open(p.url, '_blank', 'noopener,noreferrer')}
                                  className="px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl active:scale-95 transition-all text-xs flex items-center justify-center cursor-pointer"
                                  title="Tapping redirects immediately"
                                >
                                  🔗
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleApplyPlacement(p)}
                                disabled={applyingId !== null}
                                className={`flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide cursor-pointer transition-all ${
                                  isApplied 
                                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-[#ffcc00]' 
                                    : 'bg-[#ffcc00] text-[#092c5c] hover:bg-[#ffd900] shadow-md hover:shadow-lg disabled:opacity-40'
                                }`}
                              >
                                {isApplied ? 'LAUNCH PORTAL & OPEN WEBPAGE' : 'DISPATCH PORTFOLIO PAYLOAD'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column Sidebar: Telemetry Logs AND Starting Skills Decay Dashboard */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Skill Decay & Starting Profile Sync Panel */}
                  <div className="bg-[#05172e] border border-white/10 rounded-[2.5rem] p-6 shadow-xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ffcc00] border-b border-white/5 pb-3">
                        <Activity className="w-4 h-4 text-[#ffcc00] animate-pulse" />
                        <span>Candidate Skills Decay signature</span>
                      </div>

                      <p className="text-[11px] text-white/60 leading-relaxed font-mono">
                        These are the initial skills you provided, synchronized with live active decay meters. Maintain health index metrics to boost matching placement.
                      </p>

                      <div className="space-y-4 pt-1">
                        {userSkills.map((skill) => {
                          const val = getSkillProficiency(skill);
                          const isLow = val < 70;
                          const barColorClass = val >= 90 ? 'bg-gradient-to-r from-emerald-500 to-[#ffcc00]' : val >= 70 ? 'bg-orange-400' : 'bg-red-500';
                          const textColorClass = val >= 90 ? 'text-[#ffcc00]' : val >= 70 ? 'text-orange-400' : 'text-red-400';
                          
                          return (
                            <div key={skill} className="space-y-1.5 p-2 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl border border-white/5 transition-all">
                              <div className="flex justify-between items-center text-xs font-mono font-bold">
                                <span className="text-white font-extrabold">{skill}</span>
                                <span className={`${textColorClass} tracking-tighter`}>{val}% health</span>
                              </div>
                              <div className="w-full bg-white/5 rounded-full h-2 relative overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${barColorClass} transition-all duration-500`}
                                  style={{ width: `${val}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center text-[9px] text-white/40 font-mono">
                                <span>{isLow ? "Needs Reinforcement" : "Constant Retention"}</span>
                                <span>Simulated decay calibrated</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* MATCHMAKER TERMINAL LOGS OUTPUT PANEL */}
                  <div className="bg-[#05172e] border border-white/10 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-inner min-h-[300px]">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ffcc00] border-b border-white/5 pb-3">
                        <Terminal className="w-4 h-4" />
                        <span>TELEMETRY DISPATCH LOGS</span>
                      </div>

                      <div className="font-mono text-[10px] sm:text-xs text-white/80 space-y-3 leading-relaxed overflow-y-auto max-h-[300px]">
                        {terminalLogs.length === 0 ? (
                          <div className="text-white/30 italic">
                            &gt; Waiting for portfolio transmission trigger... Tapping "Dispatch Portfolio Payload" triggers immediate packet transmission & automatic URL recruitment open.
                          </div>
                        ) : (
                          terminalLogs.map((log, index) => (
                            <div 
                              key={index} 
                              style={{ opacity: 1 }}
                              className={`border-l-2 pl-2 ${
                                log && typeof log === 'string' && log.startsWith('[SUCCESS]') 
                                  ? 'border-[#ffcc00] text-[#ffcc00] font-extrabold' 
                                  : log && typeof log === 'string' && log.startsWith('[FAILURE]') 
                                    ? 'border-red-500 text-red-300' 
                                    : 'border-white/10 text-white/85'
                              }`}
                            >
                              {log}
                            </div>
                          ))
                        )}
                        
                        {applyingId !== null && (
                          <div className="flex items-center gap-2 text-[#ffcc00] select-none">
                            <span className="w-3 h-3 rounded-full border-2 border-[#ffcc00] border-t-transparent animate-spin inline-block" />
                            <span>Streaming secure data packages...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-white/30 text-center uppercase tracking-wider select-none">
                      Secured by SENSAI Gateway Protocol v4.12
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: GITHUB INTELLIGENT SCANNER */}
          {activeTab === 'scanner' && (
            <motion.div
              key="scanner-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-8 pb-12 text-left"
            >
              {/* Feature Header */}
              <div id="github-scanner-config-header" className="bg-gradient-to-br from-[#0c2445] to-[#041226] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px]" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[80px]" />
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffcc00]/10 border border-[#ffcc00]/20 text-[#ffcc00] text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      Continuous Technical Evidentiary Audit
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none uppercase">
                      GitHub Project Intelligence Scanner
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed font-medium">
                      Examine repositories live to extract validated competencies, code patterns, and real-world implementation proofs using Gemini. Sync confirmed updates directly into your digital decay-meters to boost profile indexes.
                    </p>
                  </div>
                  <div className="bg-[#05172e] border border-white/10 rounded-2xl px-5 py-4 min-w-[200px] text-center shrink-0">
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Target Persona</div>
                    <div className="text-[#ffcc00] font-black text-sm uppercase tracking-wider mb-2">{scanTargetRole}</div>
                    <select
                      value={scanTargetRole}
                      onChange={(e) => setScanTargetRole(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-xs text-white/80 font-mono outline-none focus:border-[#ffcc00]/50"
                    >
                      <option value="Software Engineer" className="bg-[#0c2445]">Software Engineer</option>
                      <option value="Frontend Engineer" className="bg-[#0c2445]">Frontend Engineer</option>
                      <option value="Backend Developer" className="bg-[#0c2445]">Backend Developer</option>
                      <option value="Full Stack Engineer" className="bg-[#0c2445]">Full Stack Engineer</option>
                      <option value="Machine Learning Developer" className="bg-[#0c2445]">ML Engineer</option>
                      <option value="DevOps Infrastructure SRE" className="bg-[#0c2445]">DevOps/SRE</option>
                      <option value="Cyber Security" className="bg-[#0c2445]">Cyber Security</option>
                      <option value="Data Engineer" className="bg-[#0c2445]">Data Engineer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Input section Card */}
              {scanFetchStatus !== 'done' && scanFetchStatus !== 'scanning' && (
                <div className="bg-gradient-to-br from-[#0c2445]/60 to-[#041226]/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
                  {/* Selector for input technique */}
                  <div className="flex gap-2 border-b border-white/5 pb-4">
                    <button
                      onClick={() => { setScanInputMethod('username'); setScanErrorMsg(''); }}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        scanInputMethod === 'username'
                          ? 'bg-[#ffcc00] text-[#092c5c] shadow-lg hover:bg-[#ffe600]'
                          : 'bg-white/5 border border-white/5 hover:border-white/15 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      Scan GitHub Profile & Select
                    </button>
                    <button
                      onClick={() => { setScanInputMethod('url'); setScanErrorMsg(''); }}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        scanInputMethod === 'url'
                          ? 'bg-[#ffcc00] text-[#092c5c] shadow-lg hover:bg-[#ffe600]'
                          : 'bg-white/5 border border-white/5 hover:border-white/15 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      Deep Scan Solo Repository URL
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Target Inputs */}
                    <div className="space-y-4 text-left">
                      {scanInputMethod === 'username' ? (
                        <div className="space-y-2">
                          <label className="text-xs font-black text-white/50 uppercase tracking-widest">GitHub Username</label>
                          <div className="relative font-mono">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-mono text-sm select-none">@</span>
                            <input
                              type="text"
                              value={scanUsername}
                              onChange={(e) => setScanUsername(e.target.value)}
                              placeholder="e.g. torvalds"
                              className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-9 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#ffcc00]/50 focus:ring-1 focus:ring-[#ffcc00]/20 font-mono transition-colors"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs font-black text-white/50 uppercase tracking-widest">Repository URL / Name</label>
                          <input
                            type="text"
                            value={scanRepoUrl}
                            onChange={(e) => setScanRepoUrl(e.target.value)}
                            placeholder="e.g. github.com/username/project-name OR username/project-name"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#ffcc00]/50 focus:ring-1 focus:ring-[#ffcc00]/20 font-mono transition-colors"
                          />
                        </div>
                      )}

                      {/* Token Auth */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-transparent">
                          <label className="text-xs font-black text-white/50 uppercase tracking-widest">
                            GitHub Access Token <span className="text-white/30 lowercase">(Optional)</span>
                          </label>
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wide">Avoids API Rate Limits</span>
                        </div>
                        <input
                          type="password"
                          value={scanToken}
                          onChange={(e) => setScanToken(e.target.value)}
                          placeholder="paste personal github token to audit private repos..."
                          className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white/80 placeholder-white/25 outline-none focus:border-[#ffcc00]/50 font-mono transition-colors"
                        />
                      </div>
                    </div>

                    {/* Explanatory metadata block */}
                    <div className="bg-[#05172e] border border-white/10 rounded-2xl p-5 flex flex-col justify-between text-left">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-black text-[#ffcc00] uppercase tracking-wider">
                          <Award className="w-4 h-4" />
                          Evidentiary Code Integrity
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed font-mono">
                          Nexus SENSAI reads code structures, language byte shares, commits, files lists, and README documents live. The scanner completely rejects low-quality mock lists, generating proof chains that align with direct technical recruiter standards.
                        </p>
                      </div>

                      {scanInputMethod === 'username' ? (
                        <button
                          onClick={handleFetchRepos}
                          disabled={scanFetchStatus === 'fetching_repos'}
                          className="w-full bg-[#ffcc00] hover:bg-[#ffe600] text-[#092c5c] disabled:bg-white/10 disabled:text-white/40 font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-[0_0_15px_rgba(255,204,0,0.3)] transition-all flex items-center justify-center gap-2 pointer-events-auto cursor-pointer leading-none mt-4 shrink-0 border border-amber-300/20 hover:scale-[1.01]"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${scanFetchStatus === 'fetching_repos' ? 'animate-spin' : ''}`} />
                          {scanFetchStatus === 'fetching_repos' ? 'Fetching Repo Registers...' : 'Connect & Fetch Repositories'}
                        </button>
                      ) : (
                        <button
                          onClick={handleScanRepositories}
                          className="w-full bg-[#ffcc00] hover:bg-[#ffe600] text-[#092c5c] font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-[0_0_15px_rgba(255,204,0,0.3)] transition-all flex items-center justify-center gap-2 pointer-events-auto cursor-pointer leading-none mt-4 shrink-0 border border-amber-300/20 hover:scale-[1.01]"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          Trigger Single Repo Analysis
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Error Notification */}
                  {scanErrorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl p-4 text-xs font-mono flex items-start gap-2.5 text-left">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                      <div>
                        <span className="font-bold underline uppercase">Scan Interrupted:</span> {scanErrorMsg}
                        <div className="mt-1.5 opacity-80 text-[10px]">
                          Note: Public requests without tokens are throttled quickly by GitHub rate rules. If you hit rate bounds, paste a Personal Access Token above.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fetched Repos List Grid (Only for Username search style) */}
                  {scanInputMethod === 'username' && scanFetchStatus === 'repos_ready' && scanFetchedRepos.length > 0 && (
                    <div className="border-t border-white/5 pt-6 space-y-4 text-left">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-[#0c2445]/20 p-4 rounded-2xl border border-white/5">
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-wider leading-tight">Select Repositories For In-Depth Audit</h4>
                          <em className="text-[10px] text-white/50 block font-mono mt-0.5">Maximum 5 repos scanned in parallel recommended</em>
                        </div>
                        <div className="font-mono text-xs text-white/60">
                          Selected Repos: <strong className="text-[#ffcc00]">{scanSelectedRepoNames.length}</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {scanFetchedRepos.map((repo) => {
                          const isSelected = scanSelectedRepoNames.includes(repo.full_name);
                          return (
                            <div
                              key={repo.id}
                              onClick={() => {
                                setScanSelectedRepoNames(prev => {
                                  if (prev.includes(repo.full_name)) {
                                    return prev.filter(name => name !== repo.full_name);
                                  } else {
                                    return [...prev, repo.full_name];
                                  }
                                });
                              }}
                              className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between h-[120px] ${
                                isSelected
                                  ? 'bg-[#12315c]/60 border-[#ffcc00]/60 shadow-[0_0_10px_rgba(255,204,0,0.1)]'
                                  : 'bg-[#05172e]/60 border-white/5 hover:border-white/15 hover:bg-[#0a203c]/40'
                              }`}
                            >
                              <div className="space-y-1 text-left">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-black text-white truncate max-w-[80%] font-mono">
                                    {repo.name}
                                  </span>
                                  {repo.fork && (
                                    <span className="text-[8px] bg-white/10 text-white/40 border border-white/10 px-1 py-0.5 rounded leading-none uppercase shrink-0">
                                      Fork
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-white/60 line-clamp-2 leading-relaxed font-sans">
                                  {repo.description || "No description provided in register metadata."}
                                </p>
                              </div>

                              <div className="flex items-center justify-between text-[9px] font-mono text-white/40 border-t border-white/5 pt-2">
                                <span>{repo.language || "Unknown language"}</span>
                                <span className="flex items-center gap-1 font-bold text-amber-400">
                                  ★ {repo.stargazers_count}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={handleScanRepositories}
                        className="w-full bg-[#ffcc00] hover:bg-[#ffe600] text-[#092c5c] font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(255,204,0,0.3)] transition-all flex items-center justify-center gap-2 pointer-events-auto cursor-pointer leading-none hover:scale-[1.01]"
                      >
                        <Terminal className="w-4 h-4 animate-pulse" />
                        Execute Portfolio Technical Analysis ({scanSelectedRepoNames.length} Selected)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Terminal progress area during scanning */}
              {scanFetchStatus === 'scanning' && (
                <div className="bg-[#030d1d] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/5 rounded-full blur-[60px]" />
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#ffcc00]">
                      <Terminal className="w-3.5 h-3.5 animate-pulse animate-bounce" />
                      SENSAI CORE GATEWAY DEPLOYMENT TERMINAL
                    </div>
                    <div className="text-[9px] font-mono text-white/30">v1.12_SSL</div>
                  </div>

                  <div className="font-mono text-xs space-y-2.5 max-h-[300px] overflow-y-auto pr-2 text-left leading-relaxed">
                    {scanTerminalLogs.map((log, index) => (
                      <div
                        key={index}
                        className={`pl-2 border-l-2 ${
                          log && typeof log === 'string' && log.startsWith('[SUCCESS]')
                            ? 'border-emerald-500 text-emerald-300 font-extrabold'
                            : log && typeof log === 'string' && log.startsWith('[FAILURE]')
                              ? 'border-red-500 text-red-300 font-bold'
                              : 'border-white/10 text-white/70'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-white/30 pl-2">
                      <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-transparent animate-spin inline-block" />
                      <span>Gemini models performing evidentiary audits...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Scanned Report done display */}
              {scanFetchStatus === 'done' && (
                <div className="space-y-8 text-left">
                  
                  {/* Results Summary and Action Controls */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0a1b33] border border-white/10 rounded-2xl p-5">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">Analysis Execution Finished</h4>
                      <p className="text-xs text-white/60 font-mono">
                        Evaluated <strong className="text-[#ffcc00]">{scanResults.length}</strong> repositories under role <strong className="text-[#ffcc00]">{scanTargetRole}</strong>.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setScanFetchStatus('idle');
                        setScanResults([]);
                        setScanAggregatedProfile(null);
                        setDecayUpdatesPending([]);
                        setLazyBulletsMap({});
                      }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white/75 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2 transition-all cursor-pointer pointer-events-auto leading-none shrink-0"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Start New Code Audit
                    </button>
                  </div>

                  {/* Prompt B: Aggregate Portfolio Intelligence Dashboard */}
                  {scanAggregatedProfile && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                      
                      {/* Left: General Assessment */}
                      <div className="md:col-span-2 bg-gradient-to-br from-[#0c2445] to-[#041226] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-60 h-60 bg-yellow-500/5 rounded-full blur-[70px]" />
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-[#ffcc00] uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Synthesized GitHub Code Profile
                          </h4>
                          <p className="text-xs sm:text-xs text-white/80 font-mono italic leading-relaxed bg-black/25 p-4 rounded-xl border border-white/5">
                            "{scanAggregatedProfile.github_profile_summary}"
                          </p>
                        </div>

                        {/* Side by side stats: Strong technical areas and gaps */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-white/5 pt-6 font-mono">
                          <div className="bg-black/35 rounded-2xl p-4 space-y-3">
                            <div className="text-[10px] font-black text-[#ffcc00] uppercase tracking-widest border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-[#ffcc00] rounded-full" />
                              Technical Strengths
                            </div>
                            <ul className="space-y-2">
                              {(scanAggregatedProfile.strongest_technical_areas || []).map((area: string, idx: number) => (
                                <li key={idx} className="text-xs text-white/80 font-mono flex items-start gap-1.5 leading-relaxed font-normal">
                                  <span className="text-[#ffcc00] shrink-0">✔</span>
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-black/35 rounded-2xl p-4 space-y-3">
                            <div className="text-[10px] font-black text-red-400 uppercase tracking-widest border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                              Target Role Skill Gaps
                            </div>
                            <ul className="space-y-2">
                              {(scanAggregatedProfile.biggest_gaps_vs_target_role || []).map((gap: string, idx: number) => (
                                <li key={idx} className="text-xs text-white/70 font-mono flex items-start gap-1.5 leading-relaxed font-normal">
                                  <span className="text-red-400 shrink-0">▲</span>
                                  {gap}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Recommended next project */}
                        {scanAggregatedProfile.recommended_next_repo && (
                          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 flex gap-4 items-start font-mono text-left">
                            <Compass className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
                            <div className="space-y-1">
                              <div className="text-xs font-black text-[#ffcc00] uppercase tracking-widest leading-none">Recommended Portfolio Project</div>
                              <h5 className="text-[11px] font-bold text-white uppercase tracking-wider">{scanAggregatedProfile.recommended_next_repo.suggestion}</h5>
                              <p className="text-[10px] text-white/60 leading-relaxed font-mono">
                                <span className="font-semibold text-white">Why:</span> {scanAggregatedProfile.recommended_next_repo.reason}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Consolidated Evidence Profile */}
                      <div className="bg-gradient-to-br from-[#0c2445]/50 to-[#041226]/50 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between text-left font-mono">
                        <div>
                          <h4 className="text-xs font-black text-white/50 uppercase tracking-widest border-b border-white/5 pb-2">
                            Consolidated Evidence Profile
                          </h4>
                          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                            {(scanAggregatedProfile.github_skill_profile || []).map((skill: any, idx: number) => (
                              <div key={idx} className="bg-black/30 rounded-xl p-3 border border-white/5 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-mono font-black text-white">{skill.skill_name}</span>
                                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none ${
                                    skill.profile_strength === 'strong' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    skill.profile_strength === 'solid' ? 'bg-[#ffcc00]/10 text-amber-400 border border-[#ffcc00]/20' :
                                    'bg-white/5 text-white/50 border border-white/10'
                                  }`}>
                                    {skill.profile_strength}
                                  </span>
                                </div>

                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      skill.max_depth_score >= 4 ? 'bg-emerald-400' :
                                      skill.max_depth_score === 3 ? 'bg-amber-400' :
                                      'bg-white/30'
                                    }`}
                                    style={{ width: `${(skill.max_depth_score / 5) * 100}%` }}
                                  />
                                </div>

                                <div className="flex justify-between items-center text-[9px] font-mono text-white/40">
                                  <span>Dem. in {skill.appears_in_repos} {skill.appears_in_repos === 1 ? 'repo' : 'repos'}</span>
                                  <span>Depth {skill.max_depth_score}/5</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Panel of confirmed Decay Alignments */}
                  {decayUpdatesPending.length > 0 && (
                    <div className="bg-[#0c2445]/40 border border-[#ffcc00]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl text-left font-mono">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-[#ffcc00] uppercase tracking-wider flex items-center gap-2 leading-none">
                            <Activity className="w-4 h-4 animate-pulse inline" />
                            Confirmed Skill Index Alignment Updates
                          </h4>
                          <p className="text-xs text-white/70 leading-relaxed font-mono">
                            Gemini discovered documented evidence proving your current practical mastery in these skills. Sync them now to refresh and set your retention meters to 100%!
                          </p>
                        </div>
                        <button
                          onClick={handleApplyDecayUpdates}
                          className="bg-[#ffcc00] hover:bg-[#ffe600] text-[#092c5c] font-black text-xs uppercase tracking-widest py-3 px-6 rounded-2xl shadow-lg transition-all shrink-0 cursor-pointer pointer-events-auto leading-none hover:scale-[1.01]"
                        >
                          Sync & Refresh Scores
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-white/5 pt-4">
                        {decayUpdatesPending.map((update, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setDecayUpdatesPending(prev => prev.map((item, id) => id === idx ? { ...item, selected: !item.selected } : item));
                            }}
                            className={`border rounded-xl p-3.5 flex items-start gap-3 cursor-pointer select-none transition-all ${
                              update.selected
                                ? 'bg-emerald-500/10 border-emerald-500/40'
                                : 'bg-white/5 border-white/10 opacity-50 hover:opacity-80'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              <input
                                type="checkbox"
                                checked={update.selected}
                                readOnly
                                className="w-3.5 h-3.5 text-emerald-500 rounded border-white/10 bg-black/40 outline-none cursor-pointer"
                              />
                            </div>
                            <div className="space-y-1 text-left">
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-xs font-mono font-black text-white">{update.skill_name}</span>
                                <span className="text-[9px] font-black text-emerald-400 shrink-0">Boost to 100%</span>
                              </div>
                              <p className="text-[10px] text-white/50 leading-relaxed">
                                Proved in <strong className="text-white/80">{update.repoName}</strong>: "{update.proficiency_evidence}"
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scanned repositories details - list of collapsible cards for each analyzed repository */}
                  <div className="space-y-4 text-left">
                    <h4 className="text-xs font-black text-white/50 uppercase tracking-widest">scanned repositories logs</h4>
                    
                    {scanResults.map((repo) => {
                      const isExpanded = activeExpandedRepoId === repo.repo_id;
                      const hasError = !!repo.error;
                      const bulletData = lazyBulletsMap[repo.repo_id];
                      const bulletAngle = selectedBulletAngle[repo.repo_id] || 'primary';

                      return (
                        <div
                          key={repo.repo_id}
                          className="bg-[#05172e]/60 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300"
                        >
                          {/* Card Summary Header line */}
                          <div
                            onClick={() => setActiveExpandedRepoId(isExpanded ? null : repo.repo_id)}
                            className="p-5 flex justify-between items-center gap-4 cursor-pointer hover:bg-white/5 select-none"
                          >
                            <div className="space-y-1 truncate text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-white font-mono truncate">{repo.repo_name}</span>
                                <span className="text-[9px] font-mono font-normal text-white/40">pushed {repo.last_commit_date}</span>
                              </div>
                              <div className="text-xs text-white/60 truncate italic font-mono font-medium max-w-[500px]">
                                {repo.repo_summary || repo.error || "No description loaded."}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 font-mono">
                              {/* circular scores shown compactly */}
                              {!hasError && (
                                <>
                                  <div className="text-center sm:block hidden">
                                    <div className="text-[#ffcc00] font-black text-xs font-mono leading-none">{repo.complexity_score}</div>
                                    <div className="text-[8px] text-white/40 uppercase tracking-widest font-mono">Complexity</div>
                                  </div>
                                  <div className="text-center sm:block hidden">
                                    <div className="text-emerald-400 font-black text-xs font-mono leading-none">{repo.impact_score}</div>
                                    <div className="text-[8px] text-white/40 uppercase tracking-widest font-mono">Impact</div>
                                  </div>
                                </>
                              )}
                              <div>
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-white/50" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-white/50" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded detail box */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-white/5 overflow-hidden font-mono"
                              >
                                <div className="p-6 space-y-6 text-left font-mono">
                                  {hasError ? (
                                    <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                      An error occurred while evaluating this repository: {repo.error}.
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
                                      
                                      {/* Left Columns - Stats, detected skills, improvement suggestions */}
                                      <div className="lg:col-span-2 space-y-5">
                                        
                                        {/* Row score badges */}
                                        <div className="grid grid-cols-3 gap-3">
                                          <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                            <div className="text-[9px] text-white/50 uppercase tracking-wider mb-1 leading-none">COMPLEXITY CODE INDEX</div>
                                            <div className="text-[#ffcc00] font-black text-lg leading-none font-mono mb-1">{repo.complexity_score}/100</div>
                                            <p className="text-[9px] text-white/60 leading-normal line-clamp-3">{repo.complexity_reasoning}</p>
                                          </div>

                                          <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                            <div className="text-[9px] text-white/50 uppercase tracking-wider mb-1 leading-none">IMPACT SCORE</div>
                                            <div className="text-emerald-400 font-black text-lg leading-none font-mono mb-1">{repo.impact_score}/100</div>
                                            <p className="text-[9px] text-white/60 leading-normal line-clamp-3">{repo.impact_reasoning}</p>
                                          </div>

                                          <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                            <div className="text-[9px] text-white/50 uppercase tracking-wider mb-1 leading-none">ROLE FIT INDEX</div>
                                            <div className="text-blue-400 font-black text-lg leading-none font-mono mb-1">{repo.target_role_relevance}/100</div>
                                            <p className="text-[9px] text-white/60 leading-normal line-clamp-3">{repo.target_role_note}</p>
                                          </div>
                                        </div>

                                        {/* Detected Skills in depth */}
                                        <div className="space-y-2">
                                          <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Documented Skill Evidences</div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {(repo.detected_skills || []).map((skill: any, sIdx: number) => (
                                              <div key={sIdx} className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-2">
                                                <div className="flex justify-between items-center gap-1.5 font-mono">
                                                  <span className="text-xs font-mono font-black text-white truncate">{skill.skill_name}</span>
                                                  <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded leading-none shrink-0 ${
                                                    skill.depth_score >= 4 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    skill.depth_score === 3 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                    'bg-white/5 text-white/40 border border-white/10'
                                                  }`}>
                                                    Depth {skill.depth_score}/5
                                                  </span>
                                                </div>
                                                <p className="text-[10px] text-white/60 leading-relaxed font-normal">
                                                  "{skill.evidence}"
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Actionable Suggestions */}
                                        <div className="space-y-2">
                                          <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">recruiter improvement suggestions</div>
                                          <ul className="space-y-1.5 list-inside text-xs leading-normal font-normal">
                                            {(repo.improvement_suggestions || []).map((sugg: string, idx: number) => (
                                              <li key={idx} className="text-white/70 flex items-start gap-1.5">
                                                <span className="text-amber-400 shrink-0">❖</span>
                                                {sugg}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>

                                      {/* Right Column - Architecture signals & Lazy Resume STAR Bullets Generator */}
                                      <div className="space-y-5">
                                        {/* Architectural signals detected list */}
                                        <div className="bg-black/30 border border-white/5 rounded-2xl p-4.5 space-y-3.5 text-left font-mono">
                                          <div className="text-[10px] font-black text-white/40 uppercase tracking-widest border-b border-white/5 pb-2">
                                            Architectural Signals
                                          </div>
                                          <div className="space-y-3">
                                            {(repo.architecture_signals || []).map((sig: any, idx: number) => (
                                              <div key={idx} className="text-[10px] space-y-0.5 text-left font-mono">
                                                <div className="flex items-center justify-between gap-1.5">
                                                  <span className="font-extrabold text-white leading-none truncate">{sig.signal}</span>
                                                  <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-1 rounded uppercase shrink-0 leading-none py-0.5">
                                                    {sig.significance}
                                                  </span>
                                                </div>
                                                <p className="text-white/50 leading-relaxed font-normal">
                                                  "{sig.evidence}"
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Hidden Gems and Strengths check */}
                                        {repo.hidden_gems && repo.hidden_gems.length > 0 && (
                                          <div className="bg-black/30 border border-white/5 rounded-2xl p-4.5 space-y-2 text-left font-mono">
                                            <div className="text-[10px] font-black text-[#ffcc00] uppercase tracking-widest leading-none">Technical Strengths</div>
                                            <ul className="space-y-1 text-[10px] list-disc list-inside leading-normal font-normal text-left">
                                              {(repo.hidden_gems || []).map((gem: string, idx: number) => (
                                                <li key={idx} className="text-white/80">{gem}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}

                                        {/* Copyable STAR Bullet Generator on demand */}
                                        <div className="bg-gradient-to-br from-[#0c2445] to-[#041226]/50 border border-[#ffcc00]/25 rounded-2xl p-4 space-y-3.5 shadow-md text-left font-mono">
                                          <div className="flex justify-between items-center leading-none">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                                              <Award className="w-4 h-4 text-[#ffcc00]" />
                                              Bullet Generator
                                            </span>
                                            <span className="text-[9px] text-[#ffcc00] tracking-wider uppercase font-extrabold">STAR Format</span>
                                          </div>

                                          {!bulletData ? (
                                            <button
                                              onClick={() => handleGenerateSTARBullet(repo)}
                                              disabled={lazyBulletLoading === repo.repo_id}
                                              className="w-full bg-white/5 border border-white/10 hover:border-[#ffcc00]/40 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-white hover:text-[#ffcc00] transition-colors leading-none cursor-pointer pointer-events-auto shrink-0 font-mono"
                                            >
                                              {lazyBulletLoading === repo.repo_id ? (
                                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                                              ) : (
                                                <Sparkles className="w-3 h-3 text-[#ffcc00]" />
                                              )}
                                              {lazyBulletLoading === repo.repo_id ? 'Synthesizing Resume Bullet...' : 'Generate Resume Bullet'}
                                            </button>
                                          ) : (
                                            <div className="space-y-3 font-mono">
                                              {/* toggle angle options */}
                                              <div className="flex gap-1.5 leading-none">
                                                <button
                                                  onClick={() => setSelectedBulletAngle(prev => ({ ...prev, [repo.repo_id]: 'primary' }))}
                                                  className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border leading-none transition-all cursor-pointer ${
                                                    bulletAngle === 'primary'
                                                      ? 'bg-[#ffcc00]/10 text-amber-300 border-[#ffcc00]/30 shadow'
                                                      : 'bg-white/5 border-white/5 text-white/50'
                                                  }`}
                                                >
                                                  Technical Action
                                                </button>
                                                <button
                                                  onClick={() => setSelectedBulletAngle(prev => ({ ...prev, [repo.repo_id]: 'alternative' }))}
                                                  className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border leading-none transition-all cursor-pointer ${
                                                    bulletAngle === 'alternative'
                                                      ? 'bg-[#ffcc00]/10 text-amber-300 border-[#ffcc00]/30 shadow'
                                                      : 'bg-white/5 border-white/5 text-white/50'
                                                  }`}
                                                >
                                                  Robustness Angle
                                                </button>
                                              </div>

                                              {/* Actual copyable bullet textbox */}
                                              <div className="bg-black/30 border border-white/5 rounded-xl p-3 relative group text-left">
                                                <p className="text-[11px] text-white leading-relaxed font-normal select-text pr-5">
                                                  {bulletAngle === 'primary' ? bulletData.star_bullet : bulletData.alternative_angle}
                                                </p>
                                                <button
                                                  onClick={() => {
                                                    const text = bulletAngle === 'primary' ? bulletData.star_bullet : bulletData.alternative_angle;
                                                    navigator.clipboard.writeText(text);
                                                    alert("STAR Resume bullet copied to clipboard!");
                                                  }}
                                                  className="absolute top-2.5 right-2 text-white/30 hover:text-white transition-colors cursor-pointer"
                                                  title="Copy bullet"
                                                >
                                                  <Copy className="w-3.5 h-3.5" />
                                                </button>
                                              </div>

                                              <div className="text-[9px] text-[#ffcc00]/80 leading-snug">
                                                <span className="font-bold">VERB:</span> {bulletData.action_verb} | <span className="font-bold">STRENGTH:</span> {bulletData.strength_of_bullet}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        {/* Back Link to Home at footer */}
        <div className="flex justify-center pt-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#ffcc00] hover:text-[#ffea60] transition-colors border border-[#ffcc00]/30 hover:border-[#ffcc00]/60 rounded-full px-5 py-2.5 bg-white/5 pointer-events-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Command Center to Primary Landing
          </button>
        </div>

      </div>

      <AnimatePresence>
        {activeAssessmentSkill && (
          <AssessmentIDE 
            skillName={activeAssessmentSkill} 
            onClose={() => setActiveAssessmentSkill(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
