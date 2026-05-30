import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HighlightButton } from './ui/highlight-button';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Folder, 
  File, 
  Trash2, 
  Plus, 
  Terminal as TerminalIcon, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  X, 
  FileCode, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Cpu, 
  Database,
  History
} from 'lucide-react';

interface AssessmentIDEProps {
  onClose: () => void;
  skillName?: string;
  targetRole?: string;
}

interface TestResult {
  name: string;
  passed: boolean;
  expected?: string;
  actual?: string;
  error?: string;
}

interface SolutionReport {
  success: boolean;
  score: number;
  runtime_ms: number;
  memory_kb: number;
  tests: TestResult[];
  console_output: string;
}

// Predefined Coding Assessment Problems
const PROBLEMS = [
  {
    id: 'lru-cache',
    title: 'Dynamic Cache storage (LRU + TTL)',
    language: 'javascript',
    targetFile: 'cache.js',
    difficulty: 'Medium',
    estimatedTime: '45 mins',
    skills: ['JavaScript', 'Algorithms', 'Caching'],
    description: `Design a high-capacity Least-Recently-Used (LRU) Cache which additionally enforces custom Time-To-Live (TTL) timestamps per key element.
    
### Specifications
Implement a class \`LRUCache\` that supports:
1. \`constructor(capacity, ttl)\`: Instantiates instance cache with a maximum storage capacity limit and static key expiration duration in milliseconds (ttl).
2. \`get(key)\`: Retrieves target value. Returns correct integer value if key exists and has not expired yet. Returns \`-1\` if key does not exist or has expired. Accessing an active unexpired key updates its freshness making it the most-recently-used node.
3. \`put(key, value)\`: Writes target key-value. If key already exists, update its value and reset its expiration timestamp. If insertion triggers capacity overflow, evict the least recently used key.

### Expected Files Structure
- \`cache.js\`: Core class definition module.
- \`index.js\`: Entry system evaluating cache calls.`,
    defaultFiles: {
      'README.md': `# Dynamic Cache storage (LRU + TTL)

Implement a robust LRU Caching engine that supports item TTL constraints.

### Guidelines
- File name must remain \`cache.js\`
- Class must export \`LRUCache\` as a CommonJS module (\`module.exports = { LRUCache };\`)
- Evict expired keys instantly on get, or evict least recently used elements on put.

### Test Signature
\`\`\`javascript
const { LRUCache } = require('./cache');
const cache = new LRUCache(2, 500); // Storage capacity: 2, TTL: 500ms
\`\`\`
`,
      'cache.js': `/**
 * High-Capacity LRU Cache with TTL constraints
 */
class LRUCache {
  constructor(capacity, ttl) {
    this.capacity = capacity;
    this.ttl = ttl;
    this.cache = new Map(); // Tip: maps preserve insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    
    const entry = this.cache.get(key);
    const now = Date.now();
    
    // Check TTL expiration
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return -1;
    }
    
    // Refresh priority
    this.cache.delete(key);
    this.cache.set(key, { value: entry.value, timestamp: now });
    return entry.value;
  }

  put(key, value) {
    const now = Date.now();
    
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least-recently used (the first key in Map)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, { value, timestamp: now });
  }
}

module.exports = { LRUCache };
`,
      'index.js': `const { LRUCache } = require('./cache');

console.log('--- Initialising Cache Testing Area ---');
const cache = new LRUCache(2, 500);

cache.put(1, 100);
cache.put(2, 200);

console.log('Get 1 (expected 100):', cache.get(1));

// Add third item triggering eviction of key 2
cache.put(3, 300);
console.log('Get 2 (expected -1):', cache.get(2));
console.log('Get 3 (expected 300):', cache.get(3));

console.log('--- Sandbox Test Completed ---');
`
    }
  },
  {
    id: 'log-aggregator',
    title: 'Real-time Log Stream Aggregator',
    language: 'python',
    targetFile: 'aggregator.py',
    difficulty: 'Medium',
    estimatedTime: '40 mins',
    skills: ['Python', 'Data Wrangling', 'Parsing'],
    description: `Construct a log aggregation system capable of cleaning raw computer cluster stdout channels and monitoring runtime anomaly statistics on the fly.

### Specifications
Write a Python function \`aggregate_logs(log_lines, log_level)\` returning dictionary results indicating:
1. \`count\`: total integer events filtered matching target log level case-insensitively (e.g., "ERROR", "WARNING").
2. \`unique_messages\`: unique error payload messages filtered for target level, sorted alphabetically in list formats.
3. \`errors_by_minute\`: a dictionary with key string timestamps formatted in minute indices \`YYYY-MM-DDTHH:MM\` mapping to integer occurrences count.

### Expected Files Structure
- \`aggregator.py\`: Core analysis program.
- \`main.py\`: Diagnostic pipeline launcher.`,
    defaultFiles: {
      'README.md': `# Real-time Log Stream Aggregator

Build a Python routine compiling cluster diagnostics.

### Input log logs format:
\`\`\`text
2026-05-29T19:20:15 [ERROR] Database timeout connection pool.
2026-05-29T19:21:05 [WARNING] Memory capacity over 85%.
\`\`\`
`,
      'aggregator.py': `def aggregate_logs(log_lines, log_level):
    """
    Parses a string list of log streams and aggregates matching metrics.
    Return dictionary with count, unique_messages, and errors_by_minute.
    """
    target = log_level.upper()
    count = 0
    messages = set()
    errors_by_min = {}
    
    for line in log_lines:
        if not line.strip():
            continue
            
        try:
            # Parse line: "TIMESTAMP [LEVEL] MSG"
            parts = line.split(" ", 2)
            if len(parts) < 3:
                continue
                
            timestamp, raw_level, message = parts
            parsed_level = raw_level.strip("[]").upper()
            
            if parsed_level != target:
                continue
                
            count += 1
            messages.add(message.strip())
            
            # Extract YYYY-MM-DDTHH:MM from timestamp
            minute_key = timestamp[:16] # up to minutes
            errors_by_min[minute_key] = errors_by_min.get(minute_key, 0) + 1
            
        except Exception:
            continue
            
    return {
        "count": count,
        "unique_messages": sorted(list(messages)),
        "errors_by_minute": errors_by_min
    }
`,
      'main.py': `from aggregator import aggregate_logs

raw_logs = [
    "2026-05-29T19:20:00 [ERROR] Connection lost on pool A",
    "2026-05-29T19:20:45 [ERROR] Connection lost on pool A",
    "2026-05-29T19:21:10 [WARNING] Heavy page swap warnings",
    "2026-05-29T19:21:30 [ERROR] Fatal memory deadlock exception"
]

print("Aggregating error reports...")
scores = aggregate_logs(raw_logs, "ERROR")
print("Total errors counted:", scores["count"])
print("Unique list:", scores["unique_messages"])
print("Timeline:", scores["errors_by_minute"])
`
    }
  },
  {
    id: 'deep-merge',
    title: 'Deep Merge Utility with Collision Strategy',
    language: 'javascript',
    targetFile: 'merge.js',
    difficulty: 'Hard',
    estimatedTime: '55 mins',
    skills: ['JavaScript', 'Objects', 'Security'],
    description: `Implement a secure enterprise application settings merger utility incorporating dynamic array override rules.
    
### Specifications
Construct a function \`deepMerge(target, source, arrayStrategy)\` obeying:
1. Deep clone variables recursively without mutations.
2. If properties on target and source are plain objects, recursively deep merge.
3. If array items target keys clash:
   - \`combine\`: concatenate arrays, filtering out duplicate values.
   - \`overwrite\`: completely discard target array, overwriting with source structures.
4. **Prototype Pollution Protection (Critical)**: Guard against hacking indices containing \`__proto__\` or \`constructor.prototype\`. Disallow overriding global properties to ensure security.`,
    defaultFiles: {
      'README.md': `# Deep Merge Utility with Collision Strategy

Secure object synthesis with array strategies. Exports standard function as:
\`\`\`javascript
module.exports = { deepMerge };
\`\`\`
`,
      'merge.js': `/**
 * Secure deep merge with custom array collisions
 */
function isObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

function deepMerge(target, source, arrayStrategy = 'combine') {
  // Deep clone to prevent mutations
  let output = Object.assign({}, target);
  
  if (!isObject(target) || !isObject(source)) {
    return source;
  }
  
  for (const key of Object.keys(source)) {
    // SECURITY: Prevent prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    
    const sourceVal = source[key];
    const targetVal = target[key];
    
    if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
      if (arrayStrategy === 'combine') {
        output[key] = Array.from(new Set([...targetVal, ...sourceVal]));
      } else {
        output[key] = [...sourceVal];
      }
    } else if (isObject(sourceVal) && isObject(targetVal)) {
      output[key] = deepMerge(targetVal, sourceVal, arrayStrategy);
    } else {
      output[key] = sourceVal;
    }
  }
  
  return output;
}

module.exports = { deepMerge };
`,
      'index.js': `const { deepMerge } = require('./merge');

const defaultSettings = {
  db: { host: 'localhost', ports: [3306, 3307] },
  active: true
};

const overrideSettings = {
  db: { ports: [3308] },
  version: '2.0.0'
};

console.log('Merging overwrite strategy:');
const res = deepMerge(defaultSettings, overrideSettings, 'overwrite');
console.log(JSON.stringify(res, null, 2));
`
    }
  },
  {
    id: 'schema-validator',
    title: 'Schema-Driven Validation Engine',
    language: 'python',
    targetFile: 'validator.py',
    difficulty: 'Hard',
    estimatedTime: '50 mins',
    skills: ['Python', 'JSON', 'Architecture'],
    description: `Construct a custom structured schema-validator. This validation layer checks dictionaries against nested rules to safeguard microservice contracts.

### Specifications
Write a Python function \`validate_schema(data, schema)\` returning \`(is_valid, error_message)\`:
1. Check types of values: \`'string'\`, \`'integer'\`, \`'boolean'\`, \`'array'\`, \`'object'\`.
2. Evaluate recursive field maps inside nesting \`'object'\` types.
3. Validate required checklist vectors declared in \`'required'\` schemas arrays.`,
    defaultFiles: {
      'README.md': `# Schema-Driven Validation Engine

Inspect Python dictionary contents against custom schemas mapping.

### Schema Spec layout:
\`\`\`python
schema = {
    "type": "object",
    "required": ["id", "username"],
    "properties": {
        "id": {"type": "integer"},
        "username": {"type": "string"}
    }
}
\`\`\`
`,
      'validator.py': `def validate_schema(data, schema):
    """
    Validates data against a light JSON schema validation tree.
    Returns (is_valid, error_message)
    """
    if not isinstance(schema, dict):
        return True, ""
        
    expected_type = schema.get("type")
    
    # Type validation
    if expected_type == "object":
        if not isinstance(data, dict):
            return False, f"Expected object, got {type(data).__name__}"
            
        # Required keys checks
        required_keys = schema.get("required", [])
        for r_key in required_keys:
            if r_key not in data:
                return False, f"Missing required parameter: {r_key}"
                
        # Validate child properties
        props = schema.get("properties", {})
        for prop_key, prop_schema in props.items():
            if prop_key in data:
                sub_valid, sub_err = validate_schema(data[prop_key], prop_schema)
                if not sub_valid:
                    return False, f"{prop_key}: {sub_err}"
                    
    elif expected_type == "integer":
        if not isinstance(data, int) or isinstance(data, bool):
            return False, f"Expected integer, got {type(data).__name__}"
    elif expected_type == "string":
        if not isinstance(data, str):
            return False, f"Expected string, got {type(data).__name__}"
    elif expected_type == "boolean":
        if not isinstance(data, bool):
            return False, f"Expected boolean, got {type(data).__name__}"
    elif expected_type == "array":
        if not isinstance(data, list):
            return False, f"Expected list, got {type(data).__name__}"
            
    return True, ""
`,
      'main.py': `from validator import validate_schema

spec = {
    "type": "object",
    "required": ["uid", "profile"],
    "properties": {
        "uid": {"type": "integer"},
        "profile": {
            "type": "object",
            "required": ["tag"],
            "properties": {
                "tag": {"type": "string"}
            }
        }
    }
}

payload = {
    "uid": 101,
    "profile": {
        "tag": "SENIOR_LEAD"
    }
}

ans, msg = validate_schema(payload, spec)
print("Is data valid?", ans)
print("Error (if any):", msg)
`
    }
  }
];

export function AssessmentIDE({ onClose, skillName, targetRole }: AssessmentIDEProps) {
  // Select optimal initial problem representing the skill or default to problem 1
  const initialProblemIndex = PROBLEMS.findIndex(p => 
    p.skills.some(s => s.toLowerCase() === (skillName || '').toLowerCase()) ||
    p.title.toLowerCase().includes((skillName || '').toLowerCase())
  );
  const matchedIndex = initialProblemIndex !== -1 ? initialProblemIndex : 0;
  
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[matchedIndex]);
  const [activeTab, setActiveTab] = useState<'problem' | 'files'>('problem');
  const [activeConsoleTab, setActiveConsoleTab] = useState<'console' | 'test' | 'terminal'>('console');
  
  // Virtual File System State
  const [files, setFiles] = useState<Record<string, string>>({ ...selectedProblem.defaultFiles });
  const [selectedFile, setSelectedFile] = useState<string>('README.md');
  const [fileList, setFileList] = useState<string[]>(Object.keys(selectedProblem.defaultFiles));
  
  // Virtual file system modification
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFileForm, setIsCreatingFileForm] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes duration
  const [timerRunning, setTimerRunning] = useState(true);
  
  // Terminal Custom Inputs/Outputs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '🧠 Skill Decay Assessment Sandbox v1.4.0 Online',
    '⚙️ Loaded active debugger profiles & virtual kernel wrappers',
    '👉 Type "help" or run "python main.py" / "node index.js" to test local components',
    ''
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  
  // Execution Outputs
  const [consoleOutput, setConsoleOutput] = useState<string>('System logs pending. Press "Run Code" trigger.');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [solutionReport, setSolutionReport] = useState<SolutionReport | null>(null);

  // Synchronise files when problem matches
  useEffect(() => {
    setFiles({ ...selectedProblem.defaultFiles });
    const keys = Object.keys(selectedProblem.defaultFiles);
    setFileList(keys);
    // Prefer opening README.md first
    if (keys.includes('README.md')) {
      setSelectedFile('README.md');
    } else {
      setSelectedFile(keys[0]);
    }
    // Clean states
    setConsoleOutput('System logs pending. Press "Run Code" trigger.');
    setSolutionReport(null);
    setTerminalLogs([
      `🧠 Skill Decay Assessment Sandbox v1.4.0 Online`,
      `⚙️ Active Workspace changed to: ${selectedProblem.title}`,
      `👉 Type Help / Run scripts locally inside node or python environments.`,
      ''
    ]);
  }, [selectedProblem]);

  // Timer Countdown loop
  useEffect(() => {
    let timer: any = null;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, timerRunning]);

  // Command input handlers for Terminal
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    const lowerCmd = cmd.toLowerCase();
    let newLogs = [...terminalLogs, `$ ${cmd}`];

    if (lowerCmd === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else if (lowerCmd === 'help') {
      newLogs = [
        ...newLogs,
        'Available terminal operations:',
        '  ls             List files in the virtual workspace directory',
        '  cat <file>     Display contents of a text file (e.g. cat README.md)',
        '  clear          Flush terminal viewport log history',
        '  node <file>    Execute a JavaScript file inside sandbox environment',
        '  python <file>  Execute a Python script inside sandbox environment',
        '  run            Shortcut action to execute main driver code processes',
        '  submit         Trigger official solution test validation suites'
      ];
    } else if (lowerCmd === 'ls') {
      newLogs = [
        ...newLogs,
        ...fileList.map(name => `  ${name.endsWith('.py') || name.endsWith('.js') ? '📄' : '📁'}  ${name}`)
      ];
    } else if (lowerCmd.startsWith('cat ')) {
      const targetName = cmd.substring(4).trim();
      if (files[targetName] !== undefined) {
        newLogs = [...newLogs, `--- ${targetName} ---`, files[targetName], ''];
      } else {
        newLogs = [...newLogs, `🚨 Error: File "${targetName}" does not exist in workspace tree.`];
      }
    } else if (lowerCmd === 'run' || lowerCmd === 'node index.js' || lowerCmd === 'python main.py') {
      newLogs = [...newLogs, '🚀 Initialising code sandbox runner context...', ''];
      setTerminalLogs(newLogs);
      setTerminalInput('');
      handleRunCode();
      return;
    } else if (lowerCmd === 'submit') {
      newLogs = [...newLogs, '🏁 Routing user solution to backend verification layers...', ''];
      setTerminalLogs(newLogs);
      setTerminalInput('');
      handleSubmitSolution();
      return;
    } else {
      // General match
      newLogs = [...newLogs, `⚠️ Unknown command syntax: "${cmd}". Type "help" for options.`];
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
    
    // Auto-scroll terminal
    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Add a new file to the workspace list
  const handleAddNewFile = () => {
    const fresh = newFileName.trim();
    if (!fresh) return;
    if (files[fresh] !== undefined) {
      alert('Error: File or directory structure matching this name already exists.');
      return;
    }
    
    const isPython = fresh.endsWith('.py');
    const isJS = fresh.endsWith('.js');
    const isMD = fresh.endsWith('.md');
    
    let defaultCode = `// Code file created recursively\n`;
    if (isPython) defaultCode = `# Python script file created recursively\n`;
    else if (isMD) defaultCode = `# ${fresh}\n`;
    
    setFiles(prev => ({
      ...prev,
      [fresh]: defaultCode
    }));
    setFileList(prev => [...prev, fresh]);
    setSelectedFile(fresh);
    setNewFileName('');
    setIsCreatingFileForm(false);
  };

  // Delete a file
  const handleDeleteFile = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (name === 'README.md' || name === selectedProblem.targetFile) {
      alert('Security lock active: Primary instruction and solution files are protected from deletions.');
      return;
    }
    
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const copy = { ...files };
      delete copy[name];
      setFiles(copy);
      setFileList(prev => prev.filter(f => f !== name));
      if (selectedFile === name) {
        setSelectedFile('README.md');
      }
    }
  };

  // Run user code on the backend sandbox
  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveConsoleTab('console');
    setConsoleOutput('🤖 Executing files on sandbox environment...\n');

    try {
      const response = await fetch('/api/assessment/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          language: selectedProblem.language,
          files: files,
          activeFile: selectedFile
        })
      });

      if (!response.ok) {
        throw new Error('Sandbox runner answered with state fail status.');
      }

      const report = await response.json();
      setConsoleOutput(report.console_output || 'Program compiled with clean output parameters.');
      
      // Push stdout log in terminal also
      setTerminalLogs(prev => [
        ...prev,
        `[PROCESS COMPLETE]`,
        `Duration: ${report.runtime_ms}ms`,
        `Output:`,
        report.console_output,
        ''
      ]);
    } catch (err: any) {
      setConsoleOutput(`🚨 Fail: Execution aborted.\n${err.message || 'Network anomaly.'}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit and verify against hidden test suites
  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    setActiveConsoleTab('test');
    
    try {
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          language: selectedProblem.language,
          files: files
        })
      });

      if (!response.ok) {
        throw new Error('Verification runner returned a fatal compilation failure.');
      }

      const report: SolutionReport = await response.json();
      setSolutionReport(report);
      
      // Update console logs
      setConsoleOutput(report.console_output || '');
      
      if (report.score === 100) {
        // Boost retention parameters or trigger success
        alert('🎉 PERFECT SCORE! 100/100!\n\nYou have fully conquered this technical decay challenge! Your brain retention nodes are restored to full capacity.');
      } else {
        alert(`🏁 Assessment Evaluated: Finished with a composite correctness score of ${report.score}/100.`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed code compilation validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refresh code editor files to original definitions
  const handleResetWorkspace = () => {
    if (confirm('Are you sure you want to reset ALL files back to original structural templates? Unsaved code revisions will be lost.')) {
      setFiles({ ...selectedProblem.defaultFiles });
      setFileList(Object.keys(selectedProblem.defaultFiles));
      setSelectedFile('README.md');
      setSolutionReport(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#07070b] overflow-hidden flex flex-col font-sans text-white text-left"
    >
      {/* SECTION 1: TOP NAVIGATION ROW */}
      <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-[#111116] select-none shrink-0" id="ide-navbar">
        <div className="flex items-center gap-4">
          <HighlightButton 
            onClick={onClose}
            className="p-2 cursor-pointer rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exits Dashboard</span>
          </HighlightButton>
          
          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Core App logo info */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#ffcc00]/10 border border-[#ffcc00]/20 text-[#ffcc00] font-mono text-[9px] font-bold uppercase tracking-wider">
              CODING LAB
            </span>
            <span className="text-sm font-semibold text-white/50 hidden md:inline">/ Active Challenge</span>
          </div>

          {/* Problem Selector Dropdown */}
          <select 
            value={selectedProblem.id}
            onChange={(e) => {
              const matched = PROBLEMS.find(p => p.id === e.target.value);
              if (matched) setSelectedProblem(matched);
            }}
            className="bg-white/5 border border-white/10 hover:border-white/15 px-3 py-1.5 rounded-lg text-xs font-bold text-white tracking-tight focus:outline-none focus:ring-1 focus:ring-[#ffcc00] cursor-pointer"
          >
            {PROBLEMS.map((prob) => (
              <option key={prob.id} value={prob.id} className="bg-[#111116] text-white py-2 font-semibold">
                {prob.title} ({prob.difficulty})
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Countdown Timer Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 shadow-inner">
            <Clock className={`w-4 h-4 ${timeLeft < 5 * 60 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
            <span className={`font-mono text-xs sm:text-sm font-black ${timeLeft < 5 * 60 ? 'text-red-400 font-extrabold' : 'text-emerald-400'}`}>
              {formatTime(timeLeft)}
            </span>
            <button 
              onClick={() => setTimerRunning(!timerRunning)}
              className="text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors cursor-pointer px-1 ml-1"
            >
              {timerRunning ? 'Pause' : 'Resume'}
            </button>
          </div>

          {/* Action trigger controls */}
          <div className="flex items-center gap-2">
            <HighlightButton
              onClick={handleRunCode}
              disabled={isRunning || isSubmitting}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white/90 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Run Code</span>
            </HighlightButton>

            <HighlightButton
              onClick={handleSubmitSolution}
              disabled={isRunning || isSubmitting}
              className="px-4 py-1.5 text-xs font-black uppercase tracking-wider bg-[#ffcc00] hover:bg-[#ffe600] active:scale-95 text-[#07070b] rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              <span>Submit Solution</span>
            </HighlightButton>
          </div>
        </div>
      </div>

      {/* SECTION 2: WORKSPACE THREE SPLIT CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 bg-[#09090e]">
        
        {/* LEFT COMPONENT - PANEL SIDEBAR (PROMPT DESCRIPTION OR FILE CHANGER TREE) */}
        <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-[#0d0d12] shrink-0" id="ide-sidebar">
          {/* Inner headers navigator tabs */}
          <div className="flex border-b border-white/10 bg-neutral-900/60 p-1">
            <button
              onClick={() => setActiveTab('problem')}
              className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === 'problem'
                  ? 'bg-white/5 text-white shadow-sm border border-white/5'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Problem Spec
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === 'files'
                  ? 'bg-white/5 text-white shadow-sm border border-white/5'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Files Manager
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 select-none scrollbar-thin min-h-0">
            <AnimatePresence mode="wait">
              {activeTab === 'problem' && (
                <motion.div
                  key="prob"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] uppercase font-mono font-black text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                        {selectedProblem.difficulty}
                      </span>
                      <span className="text-[10px] uppercase font-mono font-black text-[#ffcc00] bg-[#ffcc00]/5 border border-[#ffcc00]/15 px-2 py-0.5 rounded">
                        Limit: {selectedProblem.estimatedTime}
                      </span>
                      <span className="text-[10px] uppercase font-mono font-black text-sky-400 bg-sky-500/5 border border-sky-500/10 px-2 py-0.5 rounded">
                        {selectedProblem.language}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-white tracking-tight leading-snug">
                      {selectedProblem.title}
                    </h4>
                  </div>

                  {/* Body description formatted manually or markup keys */}
                  <div className="text-xs text-white/70 leading-relaxed space-y-4 font-sans whitespace-pre-line border-t border-white/5 pt-4">
                    {selectedProblem.description}
                  </div>

                  {/* Skills tags list */}
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/30 block">Core evaluated components</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProblem.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-white/70 border border-white/5 uppercase">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'files' && (
                <motion.div
                  key="files"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white/60">Workspace Files</span>
                    
                    {/* Add folder/file trigger icons */}
                    <button
                      onClick={() => setIsCreatingFileForm(!isCreatingFileForm)}
                      className="p-1 px-2.5 rounded bg-white/5 hover:bg-white/15 text-[#ffcc00] hover:text-white transition-all flex items-center gap-1 cursor-pointer text-[10px] font-black uppercase"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add file</span>
                    </button>
                  </div>

                  {isCreatingFileForm && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-3 bg-neutral-900 border border-white/10 rounded-xl space-y-2"
                    >
                      <input
                        type="text"
                        placeholder="e.g. index.js, helpers.py"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-xs font-bold font-mono focus:outline-none focus:border-[#ffcc00] text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddNewFile();
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddNewFile}
                          className="px-3 py-1 bg-[#ffcc00] text-black text-[10px] font-black uppercase rounded-lg cursor-pointer flex-1"
                        >
                          Create
                        </button>
                        <button
                          onClick={() => setIsCreatingFileForm(false)}
                          className="px-3 py-1 bg-white/5 text-white/70 text-[10px] font-semibold uppercase rounded-lg cursor-pointer text-center hover:bg-white/15"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Virtual File List mapping tree render */}
                  <div className="space-y-1">
                    {fileList.map((filename) => {
                      const isSelected = selectedFile === filename;
                      const isPrimary = filename === 'README.md' || filename === selectedProblem.targetFile;
                      
                      return (
                        <div
                          key={filename}
                          onClick={() => setSelectedFile(filename)}
                          className={`w-full group px-3.5 py-3 rounded-xl flex items-center justify-between border transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-800/80 text-[#ffcc00] border-[#ffcc00]/40 font-bold'
                              : 'bg-[#101015]/40 text-white/60 border-transparent hover:bg-white/[0.02] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {filename.endsWith('.md') ? (
                              <FileText className={`w-4 h-4 ${isSelected ? 'text-[#ffcc00]' : 'text-sky-400'}`} />
                            ) : filename.endsWith('.py') ? (
                              <FileCode className={`w-4 h-4 ${isSelected ? 'text-[#ffcc00]' : 'text-blue-400'}`} />
                            ) : (
                              <FileCode className={`w-4 h-4 ${isSelected ? 'text-[#ffcc00]' : 'text-yellow-400'}`} />
                            )}
                            <span className="text-xs font-mono font-medium truncate">
                              {filename}
                            </span>
                          </div>

                          {/* Delete option */}
                          {!isPrimary && (
                            <button
                              onClick={(e) => handleDeleteFile(filename, e)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-white/10 text-white/30 hover:text-red-400 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Settings footer resets */}
                  <div className="pt-8 border-t border-white/5">
                    <button
                      onClick={handleResetWorkspace}
                      className="w-full text-center py-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 text-red-300 font-bold text-xs uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-red-400" />
                      <span>Reset Workspace</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MIDDLE LAYER - PRIMARY CODEMIRROR 6 ENGINE */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#07070b]">
          {/* Editor Header Indicators tabs */}
          <div className="h-11 px-4 border-b border-white/5 flex items-center justify-between bg-[#0a0a0f] shrink-0 select-none">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-black shrink-0">
                ACTIVE FILE:
              </span>
              <span className="font-mono text-xs text-[#ffcc00] font-black truncate bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                {selectedFile}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-white/50">
              <span className="font-mono">tabS: 2 spaces</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-mono font-bold text-emerald-400 uppercase">EDITOR OK</span>
            </div>
          </div>

          {/* Actual CodeMirror Editor component */}
          <div className="flex-1 overflow-y-auto bg-[#07070a] text-left">
            <CodeMirror
              value={files[selectedFile] || ''}
              height="100%"
              theme="dark"
              extensions={
                selectedFile.endsWith('.py')
                  ? [python()]
                  : [javascript()]
              }
              onChange={(value) => {
                setFiles(prev => ({
                  ...prev,
                  [selectedFile]: value
                }));
              }}
              className="text-sm font-mono border-0 focus:outline-none"
            />
          </div>

          {/* BOTTOM LAYOUT - LIVE RUNS PANEL / TERMINAL */}
          <div className="h-64 border-t border-white/10 flex flex-col bg-[#0b0b10] shrink-0 min-h-0">
            {/* Split panel tabs navigator selectors */}
            <div className="h-11 border-b border-white/10 flex items-center justify-between bg-neutral-950/40 p-1 px-4 select-none shrink-0">
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setActiveConsoleTab('console')}
                  className={`px-3 py-1.5 font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    activeConsoleTab === 'console'
                      ? 'bg-white/5 text-[#ffcc00]'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Output Console
                </button>
                <button
                  onClick={() => setActiveConsoleTab('test')}
                  className={`px-3 py-1.5 font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer relative ${
                    activeConsoleTab === 'test'
                      ? 'bg-white/5 text-sky-400'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  Test Results
                  {solutionReport && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#f87171]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveConsoleTab('terminal')}
                  className={`px-3 py-1.5 font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeConsoleTab === 'terminal'
                      ? 'bg-white/5 text-emerald-400'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>Terminal</span>
                </button>
              </div>

              {/* Reset output */}
              <button
                onClick={() => setConsoleOutput('System console cleared.')}
                className="text-[10px] uppercase. tracking-wider text-white/30 hover:text-white font-black cursor-pointer font-mono"
              >
                Clear output
              </button>
            </div>

            {/* Inner viewports selection render */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-left scrollbar-thin min-h-0">
              
              {activeConsoleTab === 'console' && (
                <pre className="text-white/85 leading-relaxed font-mono whitespace-pre-wrap select-all">
                  {consoleOutput}
                </pre>
              )}

              {activeConsoleTab === 'test' && (
                <div className="space-y-4">
                  {solutionReport ? (
                    <div className="space-y-4">
                      {/* Grid metrics details */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-900/60 p-4 rounded-xl border border-white/5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-wider text-white/30 font-mono block">Correctness Score</span>
                          <span className={`text-2xl font-black ${solutionReport.score === 100 ? 'text-emerald-400' : 'text-[#ffcc00]'}`}>
                            {solutionReport.score}/100
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-wider text-white/30 font-mono block">Execution Latency</span>
                          <span className="text-2xl font-black text-sky-400">
                            {solutionReport.runtime_ms} ms
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-wider text-white/30 font-mono block">Allocated RAM usage</span>
                          <span className="text-2xl font-black text-purple-400">
                            {solutionReport.memory_kb} KB
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase tracking-wider text-white/30 font-mono block">Pass status</span>
                          <span className={`text-sm tracking-widest font-black uppercase inline-block px-2.5 py-0.5 mt-1 border rounded-md ${
                            solutionReport.success 
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                              : 'text-red-400 bg-red-500/10 border-red-500/20'
                          }`}>
                            {solutionReport.success ? 'CONQUERED' : 'EVALUATION FAILING'}
                          </span>
                        </div>
                      </div>

                      {/* Diagnostic test suites cases */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/30 block mb-1">Hidden Verification Suites Checklist</span>
                        <div className="space-y-1.5">
                          {solutionReport.tests.map((test, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded-xl border flex items-center justify-between gap-4 bg-[#101015]/40 ${
                                test.passed 
                                  ? 'border-emerald-500/20 hover:border-emerald-500/30' 
                                  : 'border-red-500/20 hover:border-red-500/30'
                              }`}
                            >
                              <div className="space-y-1">
                                <h6 className="font-bold text-white text-xs">{test.name}</h6>
                                {test.error && (
                                  <p className="text-[10px] text-red-400/80 font-mono leading-relaxed max-w-2xl">{test.error}</p>
                                )}
                              </div>
                              <span className={`px-2.5 py-0.5 rounded text-[9px] tracking-wider font-mono font-black uppercase ${
                                test.passed 
                                  ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' 
                                  : 'text-red-400 bg-red-400/10 border border-red-400/20'
                              }`}>
                                {test.passed ? 'PASSED' : 'FAILED'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-8 text-center">
                      <div className="max-w-md mx-auto space-y-2">
                        <AlertCircle className="w-8 h-8 text-[#ffcc00] mx-auto opacity-75" />
                        <h5 className="text-white font-bold font-sans text-sm">No solution compiled yet</h5>
                        <p className="text-xs text-white/40 leading-relaxed font-sans">
                          Build your modules, test them, and click the "Submit Solution" trigger in the top bar to run real hidden test checks.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeConsoleTab === 'terminal' && (
                <div className="flex flex-col min-h-full font-mono text-zinc-300">
                  <div className="flex-1 space-y-1 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                    <div ref={terminalBottomRef} />
                  </div>
                  
                  {/* CLI Prompt form inputs */}
                  <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1.5 mt-2 bg-neutral-900 border border-white/5 rounded-xl px-3 py-1 shrink-0">
                    <span className="text-emerald-400 font-extrabold select-none">$</span>
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-0 outline-none text-zinc-100 font-mono text-xs focus:ring-0 placeholder-zinc-600 focus:outline-none"
                      placeholder="Type clear, Help, ls, run, cat README.md, node index.js..."
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                    />
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
