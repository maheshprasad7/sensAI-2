export interface RoadmapNode {
  id: string;
  title: string;
  track: string;
  stageNum: number;
  maxStages: number;
  difficulty: "Easy" | "Medium" | "Hard";
  growth: "Medium" | "High" | "Very High";
  stress: "Low" | "Medium" | "High";
  growthPotential: number;
  timeline: {
    firstRole: string;
    midLevel: string;
    senior: string;
  };
  description: string;
  careerProgression: {
    role: string;
    duration: string;
    isCurrent?: boolean;
  }[];
  milestones: {
    period: string;
    subtitle: string;
    tasks: string[];
  }[];
  children: string[];
}

export const careerDb: Record<string, RoadmapNode> = {
  // ==========================================
  // BACKEND ENGINEER TRACK
  // ==========================================
  "back-stage-1": {
    id: "back-stage-1",
    title: "Junior Backend Engineer",
    track: "Backend Systems Core",
    stageNum: 1,
    maxStages: 6,
    difficulty: "Easy",
    growth: "High",
    stress: "Low",
    growthPotential: 82,
    timeline: {
      firstRole: "Immediate",
      midLevel: "1-2 years",
      senior: "3-5 years"
    },
    description: "Launch your career by mastering the foundational components of servers. Manage standard API endpoints, route logic, server status checks, and data query pools.",
    careerProgression: [
      { role: "Junior Backend Engineer", duration: "Day 1-5", isCurrent: true },
      { role: "Backend Developer", duration: "Month 1-6" },
      { role: "Senior Backend Developer", duration: "Year 2" },
      { role: "Staff Backend Engineer", duration: "Year 4" },
      { role: "Principal Architect", duration: "Year 5+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Weeks 1-2",
        tasks: [
          "Research what Backend Engineer roles require",
          "Start a small project using C++ or Node.js",
          "Set up a portfolio or GitHub"
        ]
      },
      {
        period: "MONTH 2",
        subtitle: "Weeks 3-4",
        tasks: [
          "Build a project combining SQL database connections",
          "Write a case study on database concurrency",
          "Get feedback from senior engineers in the field"
        ]
      },
      {
        period: "MONTH 3",
        subtitle: "Weeks 5-8",
        tasks: [
          "Lean Docker containerization basics",
          "Create a continuous integration pipeline (GitHub Actions)",
          "Deploy your first microservice to a cloud provider"
        ]
      }
    ],
    children: ["back-stage-2-dev", "back-stage-2-api", "back-stage-2-data"]
  },

  // STAGE 2
  "back-stage-2-dev": {
    id: "back-stage-2-dev",
    title: "Backend Developer",
    track: "Backend Systems Core",
    stageNum: 2,
    maxStages: 6,
    difficulty: "Medium",
    growth: "High",
    stress: "Medium",
    growthPotential: 86,
    timeline: {
      firstRole: "3-6 months",
      midLevel: "2-4 years",
      senior: "5-7 years"
    },
    description: "Unify scalable server architectures with modular data layer components. Build highly reliable servers, structure transactional ACID operations, and configure caching networks.",
    careerProgression: [
      { role: "Junior Backend Engineer", duration: "Completed Node" },
      { role: "Backend Developer", duration: "Day 1-10", isCurrent: true },
      { role: "Senior Backend Developer", duration: "Year 2" },
      { role: "Staff Backend Engineer", duration: "Year 4" },
      { role: "Principal Developer", duration: "Year 6+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Database Mechanics",
        tasks: [
          "Refactor raw SQL queries using optimal indexing keys",
          "Structure complex Redis cache invalidation policies",
          "Achieve over 90% test coverage using standard testing suites"
        ]
      },
      {
        period: "MONTH 2",
        subtitle: "Systems Modeling",
        tasks: [
          "Integrate asynchronous bull queues or custom task scheduling",
          "Establish robust, secure JWT sessions tracking",
          "Profile performance bottlenecks using system CPU metrics"
        ]
      }
    ],
    children: ["back-stage-3-sr-dev", "back-stage-3-cloud", "back-stage-3-platform"]
  },
  "back-stage-2-api": {
    id: "back-stage-2-api",
    title: "API Developer",
    track: "API Platforms",
    stageNum: 2,
    maxStages: 6,
    difficulty: "Medium",
    growth: "High",
    stress: "Medium",
    growthPotential: 85,
    timeline: {
      firstRole: "2-5 months",
      midLevel: "2-3 years",
      senior: "5-6 years"
    },
    description: "Specialise in constructing high-performance data contracts, API gateway routing protocols, deep security layers, rate limits, and clear developer integrations.",
    careerProgression: [
      { role: "Junior Backend Engineer", duration: "Completed Node" },
      { role: "API Developer", duration: "Day 1-5", isCurrent: true },
      { role: "API Architect", duration: "Year 2" },
      { role: "Enterprise Integration Lead", duration: "Year 4" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Protocol Auditing",
        tasks: [
          "Establish a GraphQL dynamic schema layer",
          "Configure CORS protocols and security response headers",
          "Implement fine-grained IP throttles and rate-limit scopes"
        ]
      },
      {
        period: "MONTH 2",
        subtitle: "Developer Experience",
        tasks: [
          "Generate interactive Swagger/OpenAPI documentation trees",
          "Structure standard mock APIs for parallel frontend development",
          "Write robust and human-readable API response schemas"
        ]
      }
    ],
    children: ["back-stage-3-api-arch", "back-stage-3-integration"]
  },
  "back-stage-2-data": {
    id: "back-stage-2-data",
    title: "Junior Data Engineer",
    track: "Data Infrastructures",
    stageNum: 2,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 90,
    timeline: {
      firstRole: "4-7 months",
      midLevel: "2-4 years",
      senior: "5-8 years"
    },
    description: "Architect efficient, high-speed data feeds. Construct data pipelines, connect messaging networks, and execute ETL scripts on cloud servers.",
    careerProgression: [
      { role: "Junior Backend Engineer", duration: "Completed Node" },
      { role: "Junior Data Engineer", duration: "Day 1-5", isCurrent: true },
      { role: "Data Pipeline Engineer", duration: "Year 1-2" },
      { role: "Senior Data Architect", duration: "Year 4+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Ingestion Core",
        tasks: [
          "Write ingestion cron routines parsing large raw JSON fields",
          "Deploy local PostgreSQL databases for big dataset modeling",
          "Verify optimal connection pooling limits under parallel load"
        ]
      }
    ],
    children: ["back-stage-3-data-pipeline", "back-stage-3-db-admin"]
  },

  // STAGE 3
  "back-stage-3-sr-dev": {
    id: "back-stage-3-sr-dev",
    title: "Senior Backend Developer",
    track: "Backend Systems Core",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Medium",
    growth: "High",
    stress: "Medium",
    growthPotential: 88,
    timeline: {
      firstRole: "1-2 years",
      midLevel: "3-5 years",
      senior: "6-8 years"
    },
    description: "Take command of large scaling business servers. Direct microservice clusters, design multi-process frameworks, and guarantee low-latency query returns.",
    careerProgression: [
      { role: "Backend Developer", duration: "Completed Node" },
      { role: "Senior Backend Developer", duration: "Month 1", isCurrent: true },
      { role: "Staff Backend Engineer", duration: "Year 2" },
      { role: "Principal Developer", duration: "Year 4+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Scaling Structures",
        tasks: [
          "Migrate monolithic servers into separate microservices",
          "Implement high-performance inter-service gRPC brokers",
          "Construct a centralized metrics reporting system"
        ]
      }
    ],
    children: ["back-stage-4-staff", "back-stage-4-tech-lead"]
  },
  "back-stage-3-cloud": {
    id: "back-stage-3-cloud",
    title: "Cloud Backend Engineer",
    track: "Cloud & DevOps",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 92,
    timeline: {
      firstRole: "1-2 years",
      midLevel: "2-4 years",
      senior: "5-7 years"
    },
    description: "Translate containerized applications into reliable, redundant cloud environments. Master serverless architecture, load buffers, and virtual networks.",
    careerProgression: [
      { role: "Backend Developer", duration: "Completed Node" },
      { role: "Cloud Backend Engineer", duration: "Day 1-15", isCurrent: true },
      { role: "Cloud Architect", duration: "Year 2" },
      { role: "SRE Director", duration: "Year 5+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Terraform & AWS Integration",
        tasks: [
          "Write clean Infrastructure-as-code scripts via Terraform",
          "Configure AWS EC2 auto-scaling groups based on CPU use",
          "Set up redundant multi-region AWS S3 resource replications"
        ]
      }
    ],
    children: ["back-stage-4-devops", "back-stage-4-cloud-arch"]
  },
  "back-stage-3-platform": {
    id: "back-stage-3-platform",
    title: "Platform Engineer",
    track: "Platform Infrastructure",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "High",
    stress: "High",
    growthPotential: 90,
    timeline: {
      firstRole: "1-2 years",
      midLevel: "3-4 years",
      senior: "5-7 years"
    },
    description: "Construct stable base workspaces and shared developer interfaces. Create central auth portals, log analyzers, and deployment structures.",
    careerProgression: [
      { role: "Backend Developer", duration: "Completed Node" },
      { role: "Platform Engineer", duration: "Day 1", isCurrent: true },
      { role: "Platform Architect", duration: "Year 2" },
      { role: "Systems Automation Engineer", duration: "Year 4" }
    ],
    milestones: [
      {
        period: "FIRST 45 DAYS",
        subtitle: "Internal Platforming",
        tasks: [
          "Create a central base template generator for new company projects",
          "Assemble an internal secure SSH credentials vault",
          "Implement unified logs aggregating server metrics"
        ]
      }
    ],
    children: ["back-stage-4-platform-arch", "back-stage-4-automation"]
  },
  "back-stage-3-api-arch": {
    id: "back-stage-3-api-arch",
    title: "API Architect",
    track: "API Platforms",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Medium",
    growth: "High",
    stress: "Medium",
    growthPotential: 89,
    timeline: {
      firstRole: "1 year",
      midLevel: "2-4 years",
      senior: "5-7 years"
    },
    description: "Design enterprise-grade API structures, micro-gateways, high-bandwidth streaming endpoints, and comprehensive integration security policies.",
    careerProgression: [
      { role: "API Developer", duration: "Completed Stage" },
      { role: "API Architect", duration: "Month 1", isCurrent: true },
      { role: "Enterprise Integration Lead", duration: "Year 2+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Gateway Optimization",
        tasks: [
          "Configure enterprise-grade API Gateways (Kong/Apigee)",
          "Implement robust OAuth2 federation schemas",
          "Establish structured API security sanitization layers"
        ]
      }
    ],
    children: ["back-stage-4-ent-integration", "back-stage-4-solutions-arch"]
  },
  "back-stage-3-integration": {
    id: "back-stage-3-integration",
    title: "Backend Integration Engineer",
    track: "API Platforms",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Medium",
    growth: "High",
    stress: "Medium",
    growthPotential: 87,
    timeline: {
      firstRole: "1 year",
      midLevel: "2-4 years",
      senior: "5-6 years"
    },
    description: "Specialise in linking external vendor systems, third-party databases, financial gateways, and corporate directories securely.",
    careerProgression: [
      { role: "API Developer", duration: "Completed Stage" },
      { role: "Backend Integration Engineer", duration: "Month 1-2", isCurrent: true },
      { role: "Solutions Architect", duration: "Year 2" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Integration Flow",
        tasks: [
          "Deploy secure webhook subscription registries",
          "Execute financial ledger validation handlers",
          "Build robust retry queues handling vendor downtime"
        ]
      }
    ],
    children: ["back-stage-4-solutions-arch", "back-stage-4-dist-sys"]
  },
  "back-stage-3-data-pipeline": {
    id: "back-stage-3-data-pipeline",
    title: "Data Pipeline Engineer",
    track: "Data Infrastructures",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 92,
    timeline: {
      firstRole: "1 year",
      midLevel: "2-4 years",
      senior: "5-7 years"
    },
    description: "Build streaming ETL grids utilizing Kafka, Spark, and Redshift to route massive datasets instantly across cloud servers.",
    careerProgression: [
      { role: "Junior Data Engineer", duration: "Completed Stage" },
      { role: "Data Pipeline Engineer", duration: "Month 1", isCurrent: true },
      { role: "Senior Data Engineer", duration: "Year 2" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Streaming Infrastructure",
        tasks: [
          "Configure high-throughput multi-node Kafka pipelines",
          "Deploy Apache Spark stream processing filters",
          "Optimize Redshift/BigQuery analytics structures"
        ]
      }
    ],
    children: ["back-stage-4-sr-data-eng", "back-stage-4-dist-sys"]
  },
  "back-stage-3-db-admin": {
    id: "back-stage-3-db-admin",
    title: "Database Administrator",
    track: "Data Infrastructures",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Medium",
    stress: "High",
    growthPotential: 83,
    timeline: {
      firstRole: "1 year",
      midLevel: "2-3 years",
      senior: "4-6 years"
    },
    description: "Command critical enterprise database clusters, configure replication systems, and guarantee zero-downtime backups.",
    careerProgression: [
      { role: "Junior Data Engineer", duration: "Completed Stage" },
      { role: "Database Administrator", duration: "Month 1", isCurrent: true },
      { role: "Senior Platform DBA", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "DB Administration",
        tasks: [
          "Establish standard master-slave write replicas",
          "Execute non-blocking database migrations live under full load",
          "Deploy automatic point-in-time backup vaults"
        ]
      }
    ],
    children: ["back-stage-4-sr-data-eng", "back-stage-4-automation"]
  },

  // STAGE 4
  "back-stage-4-staff": {
    id: "back-stage-4-staff",
    title: "Staff Backend Engineer",
    track: "Backend Systems Core",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 94,
    timeline: {
      firstRole: "2-4 years",
      midLevel: "4-6 years",
      senior: "7-10 years"
    },
    description: "Guide multi-team codebase conventions, establish base libraries, tune database shard models, and lead large architectural rewrites.",
    careerProgression: [
      { role: "Senior Backend Developer", duration: "Completed Node" },
      { role: "Staff Backend Engineer", duration: "Month 1", isCurrent: true },
      { role: "Principal Backend Engineer", duration: "Year 2+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "High Scale Governance",
        tasks: [
          "Audit distributed locks using Redis keys across parallel worker VMs",
          "Design system-wide horizontal database sharding models",
          "Mentor senior engineers on optimal architectural principles"
        ]
      }
    ],
    children: ["back-stage-5-principal-dev", "back-stage-5-tech-director"]
  },
  "back-stage-4-tech-lead": {
    id: "back-stage-4-tech-lead",
    title: "Technical Lead",
    track: "Backend Systems Core",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Medium",
    growth: "Very High",
    stress: "High",
    growthPotential: 93,
    timeline: {
      firstRole: "2-3 years",
      midLevel: "4-5 years",
      senior: "6-8 years"
    },
    description: "Bridge system design requirements with project management. Lead team delivery metrics, run agile sprints, and coordinate team task assignments.",
    careerProgression: [
      { role: "Senior Backend Developer", duration: "Completed Node" },
      { role: "Technical Lead", duration: "Month 1", isCurrent: true },
      { role: "VP of Engineering", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Team Leadership",
        tasks: [
          "Establish automated code sprint monitoring panels",
          "Lead detailed technical spec blueprints reviews",
          "Refine cross-team API agreement documents"
        ]
      }
    ],
    children: ["back-stage-5-tech-director", "back-stage-5-vp-eng"]
  },
  "back-stage-4-devops": {
    id: "back-stage-4-devops",
    title: "DevOps Engineer",
    track: "Cloud & DevOps",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "High",
    growthPotential: 95,
    timeline: {
      firstRole: "1-3 years",
      midLevel: "3-5 years",
      senior: "6-8 years"
    },
    description: "Maintain continuous system integration grids. Master Kubernetes clusters orchestration, ArgoCD registries, and secure secret injects.",
    careerProgression: [
      { role: "Cloud Backend Engineer", duration: "Completed Node" },
      { role: "DevOps Engineer", duration: "Month 1", isCurrent: true },
      { role: "VP of Infrastructure", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Kubernetes Orchestration",
        tasks: [
          "Deploy high-availability multi-zone Kubernetes grids",
          "Structure automated secure secrets injection filters",
          "Configure continuous delivery pipelines via ArgoCD tools"
        ]
      }
    ],
    children: ["back-stage-5-infra-lead", "back-stage-5-reliability-dir"]
  },
  "back-stage-4-cloud-arch": {
    id: "back-stage-4-cloud-arch",
    title: "Cloud Architect",
    track: "Cloud & DevOps",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 96,
    timeline: {
      firstRole: "2-4 years",
      midLevel: "4-6 years",
      senior: "7-9 years"
    },
    description: "Design scalable cloud infrastructure and guide enterprise cloud strategy. Command global CDNs, VPC tunnels, and multi-cloud resilience plans.",
    careerProgression: [
      { role: "Cloud Backend Engineer", duration: "Completed Node" },
      { role: "Cloud Architect", duration: "Month 1", isCurrent: true },
      { role: "Principal Cloud Architect", duration: "Year 2+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Enterprise Topology",
        tasks: [
          "Draft multi-cloud virtual network topologies",
          "Structure corporate access and IP isolation domains",
          "Profile cost-saving strategies across large server clusters"
        ]
      }
    ],
    children: ["back-stage-5-principal-arch", "back-stage-5-infra-lead"]
  },
  "back-stage-4-platform-arch": {
    id: "back-stage-4-platform-arch",
    title: "Platform Architect",
    track: "Platform Infrastructure",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 95,
    timeline: {
      firstRole: "2-3 years",
      midLevel: "4-5 years",
      senior: "6-8 years"
    },
    description: "Architect shared enterprise service portals, shared central login systems, internal libraries, and container base layouts.",
    careerProgression: [
      { role: "Platform Engineer", duration: "Completed Node" },
      { role: "Platform Architect", duration: "Month 1-3", isCurrent: true },
      { role: "Principal Architect", duration: "Year 2" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Internal Ecosystem",
        tasks: [
          "Create a secure central Single-Sign-On core architecture",
          "Establish internal base NPM/pip artifact registry pools",
          "Optimize resource limits in shared container templates"
        ]
      }
    ],
    children: ["back-stage-5-principal-arch", "back-stage-5-tech-director"]
  },
  "back-stage-4-automation": {
    id: "back-stage-4-automation",
    title: "Systems Automation Engineer",
    track: "Platform Infrastructure",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "High",
    stress: "Medium",
    growthPotential: 91,
    timeline: {
      firstRole: "1-2 years",
      midLevel: "3-5 years",
      senior: "6-7 years"
    },
    description: "Automate manual tasks across servers. Build custom Ansible systems, write server monitoring scripts, and maintain automation bridges.",
    careerProgression: [
      { role: "Platform Engineer", duration: "Completed Node" },
      { role: "Systems Automation Engineer", duration: "Month 1", isCurrent: true },
      { role: "VP of Infrastructure", duration: "Year 4+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Automation Scripts",
        tasks: [
          "Deploy Ansible automation plays updating parallel nodes",
          "Write Python memory/CPU alert notification hooks",
          "Build server patch schedulers minimizing active downtime"
        ]
      }
    ],
    children: ["back-stage-5-infra-lead", "back-stage-5-reliability-dir"]
  },
  "back-stage-4-ent-integration": {
    id: "back-stage-4-ent-integration",
    title: "Enterprise Integration Lead",
    track: "API Platforms",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "High",
    stress: "Medium",
    growthPotential: 91,
    timeline: {
      firstRole: "2 years",
      midLevel: "3-5 years",
      senior: "6-8 years"
    },
    description: "Orchestrate enterprise service buses, coordinate multi-region system links, and lead API schema standardizations.",
    careerProgression: [
      { role: "API Architect", duration: "Completed Node" },
      { role: "Enterprise Integration Lead", duration: "Month 1", isCurrent: true },
      { role: "Principal Architect", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Enterprise Messaging",
        tasks: [
          "Design enterprise message schema standards (JSON/Protobuf)",
          "Deploy multi-region Apache Camel integration routes",
          "Enforce company-wide API endpoint validation requirements"
        ]
      }
    ],
    children: ["back-stage-5-principal-arch", "back-stage-5-vp-eng"]
  },
  "back-stage-4-solutions-arch": {
    id: "back-stage-4-solutions-arch",
    title: "Solutions Architect",
    track: "API Platforms",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Medium",
    growth: "Very High",
    stress: "High",
    growthPotential: 94,
    timeline: {
      firstRole: "2-3 years",
      midLevel: "4-6 years",
      senior: "7-8 years"
    },
    description: "Map software systems to real commercial business requests. Consult on cloud platforms, select database types, and design reliable software architectures.",
    careerProgression: [
      { role: "Integration Engineer", duration: "Completed Node" },
      { role: "Solutions Architect", duration: "Month 1", isCurrent: true },
      { role: "Principal Architect", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Commercial Architecture",
        tasks: [
          "Lead detailed technical requirements capture sprints",
          "Map complete physical network data flow maps",
          "Present architectural blueprints to executive sponsors"
        ]
      }
    ],
    children: ["back-stage-5-principal-arch", "back-stage-5-tech-director"]
  },
  "back-stage-4-dist-sys": {
    id: "back-stage-4-dist-sys",
    title: "Distributed Systems Engineer",
    track: "Backend Systems Core",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 96,
    timeline: {
      firstRole: "2 years",
      midLevel: "3-5 years",
      senior: "6-8 years"
    },
    description: "Solve complex scaling challenges like network consensus, multi-region replication, and raft algorithms.",
    careerProgression: [
      { role: "Software Developer", duration: "Completed Node" },
      { role: "Distributed Systems Engineer", duration: "Month 1", isCurrent: true },
      { role: "Technical Fellow", duration: "Year 4+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Consensus Tuning",
        tasks: [
          "Write multi-node data consensus simulation protocols",
          "Deploy custom data sharding systems on live database grids",
          "Audit network partitions failover lag statistics"
        ]
      }
    ],
    children: ["back-stage-5-principal-dev", "back-stage-5-principal-arch"]
  },
  "back-stage-4-sr-data-eng": {
    id: "back-stage-4-sr-data-eng",
    title: "Senior Data Engineer",
    track: "Data Infrastructures",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 93,
    timeline: {
      firstRole: "2 years",
      midLevel: "3-5 years",
      senior: "6-8 years"
    },
    description: "Lead enterprise big data deployments. Secure massive storage structures and verify precise data compliance.",
    careerProgression: [
      { role: "Data Pipeline Engineer", duration: "Completed Node" },
      { role: "Senior Data Engineer", duration: "Month 1", isCurrent: true },
      { role: "Director of Data Engineering", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Compliance & Lakes",
        tasks: [
          "Deploy Delta Lake structures on distributed cloud drives",
          "Audit data privacy and GDPR compliance triggers",
          "Configure massive stream indexing layouts"
        ]
      }
    ],
    children: ["back-stage-5-data-director", "back-stage-5-principal-arch"]
  },

  // STAGE 5
  "back-stage-5-principal-dev": {
    id: "back-stage-5-principal-dev",
    title: "Principal Backend Engineer",
    track: "Backend Systems Core",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 97,
    timeline: {
      firstRole: "3-5 years",
      midLevel: "5-7 years",
      senior: "8-12 years"
    },
    description: "Drive technical roadmap decisions across the whole enterprise. Author core base packages, review language selections, and spearhead technical innovation.",
    careerProgression: [
      { role: "Staff Backend Engineer", duration: "Completed Stage" },
      { role: "Principal Backend Developer", duration: "Month 1-6", isCurrent: true },
      { role: "Technical Fellow", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Strategic Tech Choices",
        tasks: [
          "Draft the 5-year enterprise tech stack transition model",
          "Create a customized, ultra-high-speed networking framework",
          "Consult with CTO on key distributed infrastructure decisions"
        ]
      }
    ],
    children: ["back-stage-6-tech-fellow"]
  },
  "back-stage-5-infra-lead": {
    id: "back-stage-5-infra-lead",
    title: "Infrastructure Lead",
    track: "Cloud & DevOps",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "High",
    growthPotential: 96,
    timeline: {
      firstRole: "2-4 years",
      midLevel: "5-6 years",
      senior: "7-10 years"
    },
    description: "Command the collective server budget, physical network layouts, server room setups, and distributed cloud deployments.",
    careerProgression: [
      { role: "DevOps Engineer", duration: "Completed Stage" },
      { role: "Infrastructure Lead", duration: "Month 1", isCurrent: true },
      { role: "VP of Infrastructure", duration: "Year 2+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Global Scale",
        tasks: [
          "Negotiate cloud platform enterprise consumption allowances",
          "Audit latency profiles across all active global datacenters",
          "Draft multi-zone catastrophic disaster recovery policies"
        ]
      }
    ],
    children: ["back-stage-6-vp-infra"]
  },
  "back-stage-5-principal-arch": {
    id: "back-stage-5-principal-arch",
    title: "Principal Architect",
    track: "Architecture & Systems Design",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 98,
    timeline: {
      firstRole: "3-4 years",
      midLevel: "5-6 years",
      senior: "8-10 years"
    },
    description: "Determine base software architectural guidelines across multiple departments. Audit key data channels and evaluate cloud platforms.",
    careerProgression: [
      { role: "Cloud Architect", duration: "Completed Stage" },
      { role: "Principal Architect", duration: "Day 1", isCurrent: true },
      { role: "Chief Architect", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Architecture Governance",
        tasks: [
          "Validate security isolation models across all enterprise divisions",
          "Analyze high-latency query bottlenecks in core databases",
          "Review legacy architectures and design microservice migration paths"
        ]
      }
    ],
    children: ["back-stage-6-chief-architect"]
  },
  "back-stage-5-tech-director": {
    id: "back-stage-5-tech-director",
    title: "Technical Director",
    track: "Management Track",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Medium",
    growth: "Very High",
    stress: "High",
    growthPotential: 97,
    timeline: {
      firstRole: "3 years",
      midLevel: "4-6 years",
      senior: "7-10 years"
    },
    description: "Command software delivery schedules across multiple departments. Align teams' output with product roadmaps and lead high-level staffing decisions.",
    careerProgression: [
      { role: "Technical Lead", duration: "Completed Stage" },
      { role: "Technical Director", duration: "Month 1", isCurrent: true },
      { role: "Chief Technology Officer", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Director Operations",
        tasks: [
          "Establish multi-department software delivery metric systems",
          "Manage engineering staffing allocations for scaling sectors",
          "Design technical skill growth tracks across all teams"
        ]
      }
    ],
    children: ["back-stage-6-cto"]
  },
  "back-stage-5-vp-eng": {
    id: "back-stage-5-vp-eng",
    title: "VP of Engineering",
    track: "Management Track",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Medium",
    growth: "Very High",
    stress: "High",
    growthPotential: 98,
    timeline: {
      firstRole: "3 years",
      midLevel: "5-7 years",
      senior: "8-10 years"
    },
    description: "Lead the corporate engineering department. Structure engineering culture, manage budget allocations, and represent tech teams in board reviews.",
    careerProgression: [
      { role: "Engineering Lead", duration: "Completed Stage" },
      { role: "VP of Engineering", duration: "Month 1", isCurrent: true },
      { role: "Chief Technology Officer", duration: "Year 2+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Executive Governance",
        tasks: [
          "Design department-wide salary bands and hiring plans",
          "Construct the annual global engineering budget allocation spreadsheet",
          "Structure the corporate intellectual property defense protocol"
        ]
      }
    ],
    children: ["back-stage-6-cto"]
  },
  "back-stage-5-reliability-dir": {
    id: "back-stage-5-reliability-dir",
    title: "Reliability Director",
    track: "Platform Infrastructure",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "High",
    growthPotential: 95,
    timeline: {
      firstRole: "2 years",
      midLevel: "4-6 years",
      senior: "7-9 years"
    },
    description: "Guarantee that the global enterprise network achieves over 99.99% overall uptime. Oversee active incident response hubs.",
    careerProgression: [
      { role: "SRE Engineer", duration: "Completed Stage" },
      { role: "Reliability Director", duration: "Month 1", isCurrent: true },
      { role: "VP of Infrastructure", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Uptime Auditing",
        tasks: [
          "Deploy regional failover structures live via DNS tools",
          "Command high-stress simulated disaster rehearsals",
          "Structure service-level agreements and alert rules"
        ]
      }
    ],
    children: ["back-stage-6-vp-infra"]
  },
  "back-stage-5-data-director": {
    id: "back-stage-5-data-director",
    title: "Director of Data Engineering",
    track: "Data Infrastructures",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 96,
    timeline: {
      firstRole: "2 years",
      midLevel: "5-6 years",
      senior: "7-10 years"
    },
    description: "Lead the corporate data storage ecosystem. Direct analytics warehouse projects and manage data lake maintenance clusters.",
    careerProgression: [
      { role: "Senior Data Engineer", duration: "Completed Stage" },
      { role: "Director of Data Engineering", duration: "Month 1", isCurrent: true },
      { role: "Chief Data Officer", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Data Lakes Governance",
        tasks: [
          "Deploy lakehouses aggregating multi-department datasets",
          "Negotiate corporate platform service contracts",
          "Implement unified meta-tag security rules"
        ]
      }
    ],
    children: ["back-stage-6-chief-data-officer"]
  },

  // STAGE 6 - ULTIMATE NODES
  "back-stage-6-tech-fellow": {
    id: "back-stage-6-tech-fellow",
    title: "Technical Fellow",
    track: "Backend Systems Core",
    stageNum: 6,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Low",
    growthPotential: 99,
    timeline: { firstRole: "5+ years", midLevel: "8+ years", senior: "12+ years" },
    description: "Achieve the highest non-management engineering rank. Drive industry standard protocols and represent the firm's technical leadership globally.",
    careerProgression: [
      { role: "Principal Engineer", duration: "Completed Stage" },
      { role: "Technical Fellow", duration: "Ultimate Rank", isCurrent: true }
    ],
    milestones: [
      {
        period: "FOREVER",
        subtitle: "Visionary Track",
        tasks: [
          "Publish breakthrough software design blueprints",
          "Participate in global open-source tech standard boards",
          "Advise core board of directors on game-changing technology"
        ]
      }
    ],
    children: []
  },
  "back-stage-6-vp-infra": {
    id: "back-stage-6-vp-infra",
    title: "VP of Infrastructure",
    track: "Cloud & DevOps",
    stageNum: 6,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "High",
    growthPotential: 98,
    timeline: { firstRole: "5+ years", midLevel: "8+ years", senior: "10+ years" },
    description: "Manage global physical operations, edge datacenters, satellite arrays, and coordinate multi-hundred-million-dollar infrastructure investments.",
    careerProgression: [
      { role: "Infrastructure Lead", duration: "Completed Stage" },
      { role: "VP of Infrastructure", duration: "Executive Level", isCurrent: true }
    ],
    milestones: [
      {
        period: "ONGOING",
        subtitle: "Global Operations",
        tasks: [
          "Oversee physical datacenters setup and power contracts",
          "Coordinate massive cross-continental submarine cable bandwidth agreements",
          "Set company-wide standards for physical security and cloud isolation"
        ]
      }
    ],
    children: []
  },
  "back-stage-6-chief-architect": {
    id: "back-stage-6-chief-architect",
    title: "Chief Architect",
    track: "Architecture & Systems Design",
    stageNum: 6,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "High",
    growthPotential: 99,
    timeline: { firstRole: "5+ years", midLevel: "8+ years", senior: "12+ years" },
    description: "Define the visual design of the entire corporate systems catalog. Maintain high security protocols, database layouts, and cloud standard configurations.",
    careerProgression: [
      { role: "Principal Architect", duration: "Completed Stage" },
      { role: "Chief Architect", duration: "Ultimate Blueprints", isCurrent: true }
    ],
    milestones: [
      {
        period: "ONGOING",
        subtitle: "Grand Blueprints",
        tasks: [
          "Validate all cross-department software integrations blueprints",
          "Sign off on multi-million dollar third-party software purchases",
          "Lead tech evaluation trials of emerging platforms"
        ]
      }
    ],
    children: []
  },
  "back-stage-6-cto": {
    id: "back-stage-6-cto",
    title: "Chief Technology Officer",
    track: "C-Suite",
    stageNum: 6,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "High",
    growthPotential: 99,
    timeline: { firstRole: "8+ years", midLevel: "10+ years", senior: "15+ years" },
    description: "Represent the final technical authority in the corporation. Steer the product strategy and coordinate multi-million-dollar tech investments.",
    careerProgression: [
      { role: "Engineering Director / VP", duration: "Completed Stage" },
      { role: "Chief Technology Officer", duration: "C-Suite Role", isCurrent: true }
    ],
    milestones: [
      {
        period: "ONGOING",
        subtitle: "Executive Vision",
        tasks: [
          "Steer corporate software delivery schedules",
          "Report tech milestones directly to the board of directors",
          "Enforce strategic cybersecurity response policies"
        ]
      }
    ],
    children: []
  },
  "back-stage-6-chief-data-officer": {
    id: "back-stage-6-chief-data-officer",
    title: "Chief Data Officer",
    track: "C-Suite",
    stageNum: 6,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 98,
    timeline: { firstRole: "5+ years", midLevel: "8+ years", senior: "12+ years" },
    description: "Govern the multi-region storage systems, analytics data stores, company privacy rules, and manage metadata search engines.",
    careerProgression: [
      { role: "Director of Data Eng", duration: "Completed Stage" },
      { role: "Chief Data Officer", duration: "C-Suite Role", isCurrent: true }
    ],
    milestones: [
      {
        period: "ONGOING",
        subtitle: "Data Governance",
        tasks: [
          "Steer data sovereignty strategies across multi-nation operations",
          "Audit automated predictive model bias variables",
          "Design secure external developer metadata sharing standards"
        ]
      }
    ],
    children: []
  },


  // ==========================================
  // FRONTEND ENGINEER TRACK
  // ==========================================
  "front-stage-1": {
    id: "front-stage-1",
    title: "Junior Frontend Engineer",
    track: "Frontend Interface Core",
    stageNum: 1,
    maxStages: 6,
    difficulty: "Easy",
    growth: "High",
    stress: "Low",
    growthPotential: 84,
    timeline: {
      firstRole: "Immediate",
      midLevel: "1-2 years",
      senior: "3-5 years"
    },
    description: "Step into web visual architecture. Build beautiful component hierarchies, refine user-input fields, manage local states, and master fluid transitions.",
    careerProgression: [
      { role: "Junior Frontend Engineer", duration: "Day 1-5", isCurrent: true },
      { role: "Frontend Developer", duration: "Month 1-6" },
      { role: "Senior Frontend Developer", duration: "Year 2" },
      { role: "Staff Frontend Engineer", duration: "Year 4" },
      { role: "Principal UI Architect", duration: "Year 5+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Weeks 1-2",
        tasks: [
          "Master core HTML5, semantic elements and basic DOM layout rules",
          "Configure standard responsive viewports with fluid Tailwind grids",
          "Establish high-contrast dark transitions using CSS custom variables"
        ]
      },
      {
        period: "MONTH 2",
        subtitle: "Weeks 3-4",
        tasks: [
          "Build multi-step responsive forms with real-time UI inputs validation",
          "Audit WCAG 2.1 accessibility tags achieving AA-level compliance stars",
          "Write clean unit test suites targeting isolated visual buttons objects"
        ]
      }
    ],
    children: ["front-stage-2-dev", "front-stage-2-ui", "front-stage-2-mobile"]
  },

  // STAGE 2
  "front-stage-2-dev": {
    id: "front-stage-2-dev",
    title: "Frontend Developer",
    track: "Frontend Interface Core",
    stageNum: 2,
    maxStages: 6,
    difficulty: "Medium",
    growth: "High",
    stress: "Medium",
    growthPotential: 87,
    timeline: {
      firstRole: "3-6 months",
      midLevel: "2-4 years",
      senior: "5-7 years"
    },
    description: "Build high-performance web applications using modern frameworks. Structure complex asynchronous hook triggers and optimize client-side data stores.",
    careerProgression: [
      { role: "Junior Frontend Engineer", duration: "Completed Stage" },
      { role: "Frontend Developer", duration: "Day 1-10", isCurrent: true },
      { role: "Senior Frontend Developer", duration: "Year 2" },
      { role: "Staff Frontend Architect", duration: "Year 5" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "State Optimization",
        tasks: [
          "Configure strict unidirectional client data stores (Redux Toolkit/Zustand)",
          "Implement lazy-loaded page route triggers to minimize code size",
          "Verify that dynamic DOM renders prevent infinite rendering loops"
        ]
      }
    ],
    children: ["front-stage-3-sr-dev", "front-stage-3-performance"]
  },
  "front-stage-2-ui": {
    id: "front-stage-2-ui",
    title: "UI Designer Developer",
    track: "Design Systems",
    stageNum: 2,
    maxStages: 6,
    difficulty: "Medium",
    growth: "High",
    stress: "Low",
    growthPotential: 85,
    timeline: {
      firstRole: "2-5 months",
      midLevel: "2-3 years",
      senior: "4-6 years"
    },
    description: "Translate high-fidelity Figma blueprints into robust codebase tokens. Design responsive layout guidelines and establish company styling sheets.",
    careerProgression: [
      { role: "Junior Frontend Engineer", duration: "Completed Stage" },
      { role: "UI Designer Developer", duration: "Day 1-5", isCurrent: true },
      { role: "Design Systems Architect", duration: "Year 2" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Visual Tokens",
        tasks: [
          "Export and compile JSON style tokens from Figma collections",
          "Construct reusable, atomic web inputs components using Radix UI bases",
          "Configure absolute theme switching options without flickering"
        ]
      }
    ],
    children: ["front-stage-3-systems", "front-stage-3-creative"]
  },
  "front-stage-2-mobile": {
    id: "front-stage-2-mobile",
    title: "Mobile Developer",
    track: "Cross-Platform UI",
    stageNum: 2,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 89,
    timeline: {
      firstRole: "3-6 months",
      midLevel: "2-4 years",
      senior: "5-7 years"
    },
    description: "Apply your web layout assets to phone screens. Build cross-platform apps using React Native or Flutter, and coordinate offline database syncing.",
    careerProgression: [
      { role: "Junior Frontend Engineer", duration: "Completed Stage" },
      { role: "Mobile Developer", duration: "Day 1-5", isCurrent: true },
      { role: "Lead iOS/Android Architect", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Native Viewports",
        tasks: [
          "Implement high-performance longlists using native view recyclers",
          "Write background local database hooks for offline work models",
          "Deploy test releases inside iOS TestFlight portals"
        ]
      }
    ],
    children: ["front-stage-3-mobile-arch"]
  },

  // STAGE 3
  "front-stage-3-sr-dev": {
    id: "front-stage-3-sr-dev",
    title: "Senior Frontend Developer",
    track: "Frontend Interface Core",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Medium",
    growth: "High",
    stress: "Medium",
    growthPotential: 88,
    timeline: { firstRole: "1-2 years", midLevel: "3-5 years", senior: "6-8 years" },
    description: "Command large single-page applications. Build scalable micro-frontend architectures, design multi-app portals, and optimize app startup times.",
    careerProgression: [
      { role: "Frontend Developer", duration: "Completed Stage" },
      { role: "Senior Frontend Developer", duration: "Month 1", isCurrent: true },
      { role: "Staff Frontend Architect", duration: "Year 3" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Micro-Frontends",
        tasks: [
          "Configure runtime module federation splitting core dependencies",
          "Structure standard multi-repository visual token systems",
          "Optimize webpack/Vite module chunking algorithms"
        ]
      }
    ],
    children: ["front-stage-4-staff", "front-stage-4-lead"]
  },
  "front-stage-3-performance": {
    id: "front-stage-3-performance",
    title: "Performance Engineer",
    track: "Web Performance & Scale",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 92,
    timeline: { firstRole: "1 year", midLevel: "2-4 years", senior: "5-6 years" },
    description: "Optimize web load speeds to achieve perfect Core Web Vitals scores. Tune layout rendering, set up asset caches, and minimize main-thread execution blocks.",
    careerProgression: [
      { role: "Frontend Developer", duration: "Completed Stage" },
      { role: "Performance Engineer", duration: "Day 1-5", isCurrent: true },
      { role: "Principal Web Optimizer", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 45 DAYS",
        subtitle: "Lighthouse Mastery",
        tasks: [
          "Exceed a 98 score on Lighthouse performance mobile tests",
          "Configure edge cached images fetching systems",
          "Refactor blocking React layouts into efficient CSS grid templates"
        ]
      }
    ],
    children: ["front-stage-4-perf-arch"]
  },
  "front-stage-3-systems": {
    id: "front-stage-3-systems",
    title: "Design Systems Architect",
    track: "Design Systems",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Medium",
    growth: "High",
    stress: "Low",
    growthPotential: 89,
    timeline: { firstRole: "1 year", midLevel: "2-3 years", senior: "4-6 years" },
    description: "Construct accessible web component libraries used across multiple company divisions. Review style guide updates and document component code.",
    careerProgression: [
      { role: "UI Designer Developer", duration: "Completed Stage" },
      { role: "Design Systems Architect", duration: "Day 1", isCurrent: true },
      { role: "Principal Design Technologist", duration: "Year 3" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Enterprise Components",
        tasks: [
          "Deploy custom component docs portals with interactive sandbox blocks",
          "Structure system tokens supporting accessible custom contrast modes",
          "Coordinate design component conventions across all design teams"
        ]
      }
    ],
    children: ["front-stage-4-systems-lead"]
  },
  "front-stage-3-creative": {
    id: "front-stage-3-creative",
    title: "Creative Technologist",
    track: "Design Systems",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Medium",
    growth: "High",
    stress: "Low",
    growthPotential: 86,
    timeline: { firstRole: "1 year", midLevel: "2-3 years", senior: "5-7 years" },
    description: "Design highly interactive web experiences. Write WebGL/Three.js render code, code interactive canvas scenes, and build engaging transitions.",
    careerProgression: [
      { role: "UI Designer Developer", duration: "Completed Stage" },
      { role: "Creative Technologist", duration: "Day 1-10", isCurrent: true },
      { role: "Creative Tech Principal", duration: "Year 4+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Immersive Shaders",
        tasks: [
          "Deploy customized WebGL vertex shaders for unique mouse hover layouts",
          "Perform fluid canvas vector loops at stable 60fps refresh limits",
          "Verify responsive physics scaling across standard phone screens"
        ]
      }
    ],
    children: ["front-stage-4-systems-lead"]
  },
  "front-stage-3-mobile-arch": {
    id: "front-stage-3-mobile-arch",
    title: "Lead Mobile Architect",
    track: "Cross-Platform UI",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 91,
    timeline: { firstRole: "1 year", midLevel: "2-4 years", senior: "5-7 years" },
    description: "Align multiple platform build pipelines. Set standards for mobile data caches, push notification networks, and manage app store release setups.",
    careerProgression: [
      { role: "Mobile Developer", duration: "Completed Stage" },
      { role: "Lead Mobile Architect", duration: "Day 1", isCurrent: true },
      { role: "Director of Phone Platforms", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Native Bridges",
        tasks: [
          "Write performant native bridge plugins targeting direct iOS hardware API",
          "Set up automated code push pipelines bypass app store processing timelines",
          "Implement fine-grained analytics click-stream collectors inside native code layout"
        ]
      }
    ],
    children: ["front-stage-4-lead"]
  },

  // STAGE 4
  "front-stage-4-staff": {
    id: "front-stage-4-staff",
    title: "Staff Frontend Architect",
    track: "Frontend Interface Core",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 95,
    timeline: { firstRole: "2-3 years", midLevel: "4-6 years", senior: "7-9 years" },
    description: "Govern web platform standards across multiple product divisions. Standardize frameworks, manage state management models, and establish security guidelines.",
    careerProgression: [
      { role: "Senior Frontend Developer", duration: "Completed Stage" },
      { role: "Staff Frontend Architect", duration: "Month 1", isCurrent: true },
      { role: "Principal UI Architect", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Architectural Blueprinting",
        tasks: [
          "Formulate enterprise state sync designs across distinct domain routes",
          "Implement secure Content Security Policies (CSP) guarding client routes",
          "Lead tech evaluation trials targeting emerging meta-framework systems"
        ]
      }
    ],
    children: ["front-stage-5-principal-ui", "front-stage-5-fe-director"]
  },
  "front-stage-4-lead": {
    id: "front-stage-4-lead",
    title: "Frontend Engineering Lead",
    track: "Frontend Interface Core",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Medium",
    growth: "Very High",
    stress: "High",
    growthPotential: 94,
    timeline: { firstRole: "2-3 years", midLevel: "3-5 years", senior: "6-8 years" },
    description: "Lead frontend engineering teams. Coordinate layout updates, review developer pull requests, and manage task assignments.",
    careerProgression: [
      { role: "Senior Frontend Developer", duration: "Completed Stage" },
      { role: "Frontend Engineering Lead", duration: "Month 1", isCurrent: true },
      { role: "Director of Frontend Engineering", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Dev Growth Ops",
        tasks: [
          "Structure automated code quality checks (Linters/Formatters)",
          "Formulate continuous visual regression test suites",
          "Design streamlined developer onboarding guides"
        ]
      }
    ],
    children: ["front-stage-5-fe-director"]
  },
  "front-stage-4-perf-arch": {
    id: "front-stage-4-perf-arch",
    title: "Web Performance Architect",
    track: "Web Performance & Scale",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 96,
    timeline: { firstRole: "2 years", midLevel: "3-5 years", senior: "6-8 years" },
    description: "Design optimized global web delivery solutions. Standardize service worker designs, manage asset pre-fetch systems, and reduce backend load.",
    careerProgression: [
      { role: "Performance Engineer", duration: "Completed Stage" },
      { role: "Web Performance Architect", duration: "Month 1", isCurrent: true },
      { role: "Principal Performance Architect", duration: "Year 2+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Core Automation",
        tasks: [
          "Deploy custom performance metric collectors monitoring live user runs",
          "Implement offline-first client syncing layouts",
          "Reduce main-bundle load size using tree-shaking"
        ]
      }
    ],
    children: ["front-stage-5-principal-ui"]
  },
  "front-stage-4-systems-lead": {
    id: "front-stage-4-systems-lead",
    title: "Principal Design Systems Technologist",
    track: "Design Systems",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "High",
    stress: "Medium",
    growthPotential: 92,
    timeline: { firstRole: "2 years", midLevel: "3-5 years", senior: "6-7 years" },
    description: "Lead the corporate design-system team. Review design token schema proposals and maintain alignment with product divisions.",
    careerProgression: [
      { role: "Design Systems Architect", duration: "Completed Stage" },
      { role: "Principal Design Systems Technologist", duration: "Day 1", isCurrent: true },
      { role: "VP of User Experience", duration: "Year 4+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Ecosystem Launch",
        tasks: [
          "Lead the release of major style design updates cross-company",
          "Deploy tools validating styling rules in CI/CD pipeline",
          "Coordinate style conventions syncing between design and dev systems"
        ]
      }
    ],
    children: ["front-stage-5-principal-ui", "front-stage-5-fe-director"]
  },

  // STAGE 5
  "front-stage-5-principal-ui": {
    id: "front-stage-5-principal-ui",
    title: "Principal UI Architect",
    track: "Frontend Interface Core",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 98,
    timeline: { firstRole: "3-5 years", midLevel: "5-6 years", senior: "8-10 years" },
    description: "Set the global user experience architecture and visual guidelines. Audit app performance metrics, select modern rendering frameworks, and guide engineering direction.",
    careerProgression: [
      { role: "Staff Frontend Architect", duration: "Completed Stage" },
      { role: "Principal UI Architect", duration: "Month 1", isCurrent: true },
      { role: "Technical Fellow", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "UX Strategy Blueprinting",
        tasks: [
          "Validate security rules on all public web routes",
          "Audit slow-rendering layouts in key company apps",
          "Collaborate with CTO on evaluating emerging rendering frameworks"
        ]
      }
    ],
    children: ["back-stage-6-tech-fellow"]
  },
  "front-stage-5-fe-director": {
    id: "front-stage-5-fe-director",
    title: "Director of Frontend Engineering",
    track: "Management Track",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Medium",
    growth: "Very High",
    stress: "High",
    growthPotential: 97,
    timeline: { firstRole: "3 years", midLevel: "5-6 years", senior: "7-10 years" },
    description: "Manage multiple frontend development divisions. Set hiring bands, evaluate framework updates, and align user interface releases with major product timelines.",
    careerProgression: [
      { role: "Frontend Lead", duration: "Completed Stage" },
      { role: "Director of Frontend Engineering", duration: "Month 1-3", isCurrent: true },
      { role: "Chief Technology Officer", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Enterprise Strategy",
        tasks: [
          "Establish frontend developer performance and evaluation frameworks",
          "Coordinate feature resource allocations across product lines",
          "Structure corporate brand alignment style reviews"
        ]
      }
    ],
    children: ["back-stage-6-cto"]
  },


  // ==========================================
  // AI ENGINEER TRACK
  // ==========================================
  "ai-stage-1": {
    id: "ai-stage-1",
    title: "Junior AI Engineer",
    track: "Cognitive Applications",
    stageNum: 1,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 93,
    timeline: {
      firstRole: "Immediate",
      midLevel: "1-2 years",
      senior: "3-5 years"
    },
    description: "Step into modern AI application systems. Understand prompt engineering loops, execute text embedding logic, handle vector retrieval calls, and manage context windows.",
    careerProgression: [
      { role: "Junior AI Engineer", duration: "Day 1-5", isCurrent: true },
      { role: "AI Systems Developer", duration: "Month 1-6" },
      { role: "Generative AI Architect", duration: "Year 2" },
      { role: "Cognitive Solutions Specialist", duration: "Year 4" },
      { role: "Director of AI Systems", duration: "Year 5+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Weeks 1-2",
        tasks: [
          "Audit natural language API parameters (Temperature, TopK limits)",
          "Build a customized server-side proxy route API for Gemini requests",
          "Generate prompt templates utilizing system instruction tags"
        ]
      },
      {
        period: "MONTH 2",
        subtitle: "Weeks 3-4",
        tasks: [
          "Deploy local vector search embeddings database nodes",
          "Configure cosine similarity ranking scripts for text datasets",
          "Build multi-step context memory agents preserving chat histories"
        ]
      }
    ],
    children: ["ai-stage-2-nlp", "ai-stage-2-cv", "ai-stage-2-agents"]
  },

  // STAGE 2
  "ai-stage-2-nlp": {
    id: "ai-stage-2-nlp",
    title: "NLP Specialist",
    track: "Cognitive Systems",
    stageNum: 2,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 94,
    timeline: {
      firstRole: "3-6 months",
      midLevel: "2-4 years",
      senior: "5-7 years"
    },
    description: "Deploy highly efficient text processors. Learn dataset pre-processing, tokenize custom strings, and manage model training runs.",
    careerProgression: [
      { role: "Junior AI Engineer", duration: "Completed Stage" },
      { role: "NLP Specialist", duration: "Day 1-10", isCurrent: true },
      { role: "LLM Fine-Tuning Expert", duration: "Year 2" },
      { role: "Cognitive Systems Architect", duration: "Year 5" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Model Sizing",
        tasks: [
          "Implement tokenization routines using HuggingFace libraries",
          "Tune PyTorch attention weights using local custom texts",
          "Profile memory allocation on parallel GPU training devices"
        ]
      }
    ],
    children: ["ai-stage-3-transformer", "ai-stage-3-llm-fine-tune"]
  },
  "ai-stage-2-cv": {
    id: "ai-stage-2-cv",
    title: "Computer Vision Specialist",
    track: "Visual Cognitive Systems",
    stageNum: 2,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 92,
    timeline: {
      firstRole: "3-5 months",
      midLevel: "2-4 years",
      senior: "5-7 years"
    },
    description: "Build robust systems to analyze visual data. Program item objection detection arrays, structure video processing tools, and utilize neural networks.",
    careerProgression: [
      { role: "Junior AI Engineer", duration: "Completed Stage" },
      { role: "Computer Vision Specialist", duration: "Day 1-5", isCurrent: true },
      { role: "Image Generation Architect", duration: "Year 2" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Image Ingestion",
        tasks: [
          "Train target classification parameters using OpenCV grids",
          "Deploy bounding boxes labels processing pipelines",
          "Configure video frame capture engines with low processing lag"
        ]
      }
    ],
    children: ["ai-stage-3-detection", "ai-stage-3-gen-ai-vision"]
  },
  "ai-stage-2-agents": {
    id: "ai-stage-2-agents",
    title: "AI Agent Developer",
    track: "Autonomous Agents",
    stageNum: 2,
    maxStages: 6,
    difficulty: "Medium",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 96,
    timeline: {
      firstRole: "2-4 months",
      midLevel: "1-3 years",
      senior: "4-6 years"
    },
    description: "Design autonomous software agents capable of routing user requests, accessing APIs, and writing logical scripts dynamically.",
    careerProgression: [
      { role: "Junior AI Engineer", duration: "Completed Stage" },
      { role: "AI Agent Developer", duration: "Day 1-5", isCurrent: true },
      { role: "Cognitive Solutions Specialist", duration: "Year 2" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Agent Memory",
        tasks: [
          "Deploy multi-step task planner agents (LangChain/Autogen)",
          "Integrate real-time software execute blocks in agent loops",
          "Configure state registers storing chat histories"
        ]
      }
    ],
    children: ["ai-stage-3-multi-agent", "ai-stage-3-rag-specialist"]
  },

  // STAGE 3
  "ai-stage-3-transformer": {
    id: "ai-stage-3-transformer",
    title: "Transformer Architect",
    track: "Cognitive Systems",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 96,
    timeline: { firstRole: "1-2 years", midLevel: "3-4 years", senior: "5-6 years" },
    description: "Design custom neural attention networks. Optimize self-attention calculations to build highly efficient specialized text models.",
    careerProgression: [
      { role: "NLP Specialist", duration: "Completed Stage" },
      { role: "Transformer Architect", duration: "Month 1", isCurrent: true },
      { role: "Cognitive Systems Architect", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Attention Mechanics",
        tasks: [
          "Write optimized self-attention tensor components from scratch",
          "Implement flash attenuation matrices reducing process sizes",
          "Evaluate context retrieval quality on large language datasets"
        ]
      }
    ],
    children: ["ai-stage-4-cognitive-arch", "ai-stage-4-prompt-ops"]
  },
  "ai-stage-3-llm-fine-tune": {
    id: "ai-stage-3-llm-fine-tune",
    title: "LLM Fine-Tuning Expert",
    track: "Cognitive Systems",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 97,
    timeline: { firstRole: "1 year", midLevel: "2-3 years", senior: "4-5 years" },
    description: "Specialize in fine-tuning open-weights models for highly complex targets. Configure LoRA parameters and manage model alignment pipelines.",
    careerProgression: [
      { role: "NLP Specialist", duration: "Completed Stage" },
      { role: "LLM Fine-Tuning Expert", duration: "Day 1-10", isCurrent: true },
      { role: "Cognitive Systems Architect", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "LoRA Sizing",
        tasks: [
          "Execute parameter-efficient model updates (QLoRA) on target datasets",
          "Assess model alignment metrics (RLHF/DPO runs)",
          "Verify model performance using standard evaluation boards"
        ]
      }
    ],
    children: ["ai-stage-4-cognitive-arch", "ai-stage-4-prompt-ops"]
  },
  "ai-stage-3-detection": {
    id: "ai-stage-3-detection",
    title: "Object Detection Engineer",
    track: "Visual Cognitive Systems",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "High",
    stress: "Medium",
    growthPotential: 91,
    timeline: { firstRole: "1 year", midLevel: "2-3 years", senior: "5-6 years" },
    description: "Create object tracking designs for safety nodes and physical security robots. Optimize visual analysis algorithms for low-latency runs.",
    careerProgression: [
      { role: "Vision Specialist", duration: "Completed Stage" },
      { role: "Object Detection Engineer", duration: "Day 1", isCurrent: true },
      { role: "Senior Vision Architect", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "YOLO Optimization",
        tasks: [
          "Deploy high-speed object detection models (YOLO base) on local chip sets",
          "Implement multi-camera frame alignment processing scripts",
          "Optimize rendering speeds for real-time video feeds"
        ]
      }
    ],
    children: ["ai-stage-4-vector-db-arch"]
  },
  "ai-stage-3-gen-ai-vision": {
    id: "ai-stage-3-gen-ai-vision",
    title: "Generative AI Vision Architect",
    track: "Visual Cognitive Systems",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 95,
    timeline: { firstRole: "1 year", midLevel: "2-4 years", senior: "5-7 years" },
    description: "Build visual generation tools. Fine-tune diffusion models, compile graphic prompt styles, and optimize image render speeds.",
    careerProgression: [
      { role: "Vision Specialist", duration: "Completed Stage" },
      { role: "Generative AI Vision Architect", duration: "Day 1-5", isCurrent: true },
      { role: "Senior Vision Architect", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Diffusion Systems",
        tasks: [
          "Fine-tune visual generation systems using custom style catalogs",
          "Configure image rendering tools for faster response times",
          "Deploy interactive image resizing utilities on public web routes"
        ]
      }
    ],
    children: ["ai-stage-4-vector-db-arch"]
  },
  "ai-stage-3-multi-agent": {
    id: "ai-stage-3-multi-agent",
    title: "Multi-Agent Coordinator",
    track: "Autonomous Agents",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 96,
    timeline: { firstRole: "1 year", midLevel: "2-3 years", senior: "4-6 years" },
    description: "Design group agent systems where specialized software nodes consult, distribute, and verify complex technical requests.",
    careerProgression: [
      { role: "Agent Developer", duration: "Completed Stage" },
      { role: "Multi-Agent Coordinator", duration: "Day 1", isCurrent: true },
      { role: "Cognitive Systems Architect", duration: "Year 2+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Mesh Communication",
        tasks: [
          "Configure secure peer-to-peer data channels for group agents",
          "Deploy central task dispatcher nodes resolving deadlocks",
          "Set up automatic cost limits on cloud API runs"
        ]
      }
    ],
    children: ["ai-stage-4-cognitive-arch", "ai-stage-4-prompt-ops"]
  },
  "ai-stage-3-rag-specialist": {
    id: "ai-stage-3-rag-specialist",
    title: "RAG Specialist",
    track: "Autonomous Agents",
    stageNum: 3,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 95,
    timeline: { firstRole: "1 year", midLevel: "2-3 years", senior: "4-5 years" },
    description: "Connect Large Language Models with verified enterprise storage systems. Optimize search indexing and enhance text search matching.",
    careerProgression: [
      { role: "Agent Developer", duration: "Completed Stage" },
      { role: "RAG Specialist", duration: "Day 1-10", isCurrent: true },
      { role: "Vector DB Architect", duration: "Year 2+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Semantic Retrieval",
        tasks: [
          "Implement advanced search layouts (Parent-Child indexing)",
          "Formulate semantic search ranking metrics",
          "Configure enterprise-grade data search pipelines"
        ]
      }
    ],
    children: ["ai-stage-4-vector-db-arch", "ai-stage-4-prompt-ops"]
  },

  // STAGE 4
  "ai-stage-4-cognitive-arch": {
    id: "ai-stage-4-cognitive-arch",
    title: "Cognitive Systems Architect",
    track: "Cognitive Systems",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 97,
    timeline: { firstRole: "2-3 years", midLevel: "4-6 years", senior: "7-10 years" },
    description: "Design secure, multi-layer AI application grids. Coordinate prompt deployments, evaluate custom models, and set model safety guidelines.",
    careerProgression: [
      { role: "Model Specialist", duration: "Completed Stage" },
      { role: "Cognitive Systems Architect", duration: "Month 1", isCurrent: true },
      { role: "Chief AI Scientist", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Ecosystem Strategy",
        tasks: [
          "Deploy custom model evaluators monitoring text quality",
          "Draft strict guidelines preventing model prompt leaks",
          "Design scalable API routing schemas handling parallel runs"
        ]
      }
    ],
    children: ["ai-stage-5-chief-ai-scientist", "ai-stage-5-ai-director"]
  },
  "ai-stage-4-prompt-ops": {
    id: "ai-stage-4-prompt-ops",
    title: "PromptOps Engineer",
    track: "Cognitive Systems",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Medium",
    growth: "Very High",
    stress: "High",
    growthPotential: 93,
    timeline: { firstRole: "1-2 years", midLevel: "3-4 years", senior: "5-7 years" },
    description: "Manage prompts deployment catalogs. Set up continuous version controls, design automated test prompts, and optimize API costs.",
    careerProgression: [
      { role: "Model Specialist", duration: "Completed Stage" },
      { role: "PromptOps Engineer", duration: "Month 1", isCurrent: true },
      { role: "Director of AI Platforms", duration: "Year 4+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "CI/CD Prompts",
        tasks: [
          "Establish version controls tracking prompt modifications",
          "Deploy automated regressions validating prompt responses",
          "Monitor model token usage metrics across teams"
        ]
      }
    ],
    children: ["ai-stage-5-ai-platform-director"]
  },
  "ai-stage-4-vector-db-arch": {
    id: "ai-stage-4-vector-db-arch",
    title: "Vector Database Architect",
    track: "Autonomous Agents",
    stageNum: 4,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 96,
    timeline: { firstRole: "2 years", midLevel: "4-5 years", senior: "6-8 years" },
    description: "Design highly efficient data clustering structures. Configure massive vector indexes, design system backup guides, and reduce query speeds.",
    careerProgression: [
      { role: "Search Specialist", duration: "Completed Stage" },
      { role: "Vector Database Architect", duration: "Month 1", isCurrent: true },
      { role: "Director of AI Platforms", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "HNSW Optimizations",
        tasks: [
          "Optimize HNSW graphing variables on multi-million node sets",
          "Implement automatic schema backups without interrupting active search queries",
          "Coordinate fast vector syncing models across databases"
        ]
      }
    ],
    children: ["ai-stage-5-ai-platform-director"]
  },

  // STAGE 5
  "ai-stage-5-chief-ai-scientist": {
    id: "ai-stage-5-chief-ai-scientist",
    title: "Chief AI Scientist",
    track: "Frontier Cognitive Models",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Low",
    growthPotential: 99,
    timeline: { firstRole: "3-5 years", midLevel: "6-8 years", senior: "10-12 years" },
    description: "Direct cognitive research programs, investigate model behaviors, patent advanced indexing models, and represent corporate data vision.",
    careerProgression: [
      { role: "Cognitive Architect", duration: "Completed Stage" },
      { role: "Chief AI Scientist", duration: "Frontier Role", isCurrent: true }
    ],
    milestones: [
      {
        period: "NEXT 90 DAYS",
        subtitle: "Research Directives",
        tasks: [
          "Draft breakthrough software research blueprint documents",
          "Establish partnerships with academic research labs",
          "Formulate strategic models training guidelines"
        ]
      }
    ],
    children: ["back-stage-6-tech-fellow"]
  },
  "ai-stage-5-ai-director": {
    id: "ai-stage-5-ai-director",
    title: "Director of AI Engineering",
    track: "Management Track",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Medium",
    growth: "Very High",
    stress: "High",
    growthPotential: 98,
    timeline: { firstRole: "3 years", midLevel: "5-6 years", senior: "8-10 years" },
    description: "Govern AI systems applications departments. Evaluate scaling API budgets, design framework strategies, and manage coordination with product lines.",
    careerProgression: [
      { role: "Cognitive Architect", duration: "Completed Stage" },
      { role: "Director of AI Engineering", duration: "Month 1-3", isCurrent: true },
      { role: "Chief Technology Officer", duration: "Year 3+" }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Enterprise Models",
        tasks: [
          "Establish performance benchmarks across different API versions",
          "Structure corporate user privacy and data security filters",
          "Coordinate model resource allocations for production apps"
        ]
      }
    ],
    children: ["back-stage-6-cto"]
  },
  "ai-stage-5-ai-platform-director": {
    id: "ai-stage-5-ai-platform-director",
    title: "AI Platform Director",
    track: "C-Suite",
    stageNum: 5,
    maxStages: 6,
    difficulty: "Hard",
    growth: "Very High",
    stress: "Medium",
    growthPotential: 97,
    timeline: { firstRole: "3 years", midLevel: "5-7 years", senior: "8-11 years" },
    description: "Steer shared platform divisions. Oversee data retrieval models, version controls systems, and manage coordination with other engineering groups.",
    careerProgression: [
      { role: "Platform Architect", duration: "Completed Stage" },
      { role: "AI Platform Director", duration: "C-Suite Role", isCurrent: true }
    ],
    milestones: [
      {
        period: "NEXT 30 DAYS",
        subtitle: "Platform Scaling",
        tasks: [
          "Set standard configurations across corporate search engines",
          "Optimize resource limits in shared containers templates",
          "Formulate standard guidelines for prompt versioning controls"
        ]
      }
    ],
    children: ["back-stage-6-chief-data-officer"]
  }
};
