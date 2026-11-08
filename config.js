/**
 * TooManyJobs.com - Central Configuration
 * Shared between index.html and admin.html
 */

window.TMJ_CONFIG = {
  portalName: "TooManyJobs.com",
  masterAdminEmail: "dilip.bath@gmail.com",
  storageKeys: {
    jobs: "TMJ_JOBS_CATALOG_V1",
    applications: "TMJ_APPLICATIONS_V1",
    candidateProfile: "TMJ_CANDIDATE_PROFILE_V1",
    employerProfile: "TMJ_EMPLOYER_PROFILE_V1",
    adminSession: "TMJ_ADMIN_TOKEN_V1"
  },
  
  defaultJobs: [
    {
      id: "tmj-101",
      title: "Senior Capacity & Performance Manager - AI Ops",
      company: "Cognitive Cloud Solutions",
      location: "Hyderabad, India (Hybrid)",
      experience: "8+ Years",
      salary: "₹28 - 36 LPA",
      category: "AI / Data Science",
      skills: ["Python", "LangGraph", "Capacity Management", "Prompt Ops", "SRE"],
      snippet: "Architect high-performance telemetry pipelines, predictive capacity forecasting models, and site reliability automation for generative AI workloads.",
      postedBy: "dilip.bath@gmail.com",
      date: "Today"
    },
    {
      id: "tmj-102",
      title: "Site Reliability Engineer (SRE) - Multi-Cloud Platforms",
      company: "Enterprise Cloud Systems",
      location: "Hyderabad / Bengaluru",
      experience: "3-7 Years",
      salary: "₹18 - 25 LPA",
      category: "Cloud / DevOps",
      skills: ["Kubernetes", "AWS", "Terraform", "Prometheus", "Linux"],
      snippet: "Own cluster uptime, SLO/SLA tracking, infrastructure as code pipelines, and automated zero-downtime failover systems across distributed multi-cloud nodes.",
      postedBy: "recruiter@enterprise.com",
      date: "1 day ago"
    },
    {
      id: "tmj-103",
      title: "Full Stack Engineer (Python & React / Streamlit)",
      company: "TechNext Digital",
      location: "Hyderabad / Remote",
      experience: "1-3 Years",
      salary: "₹9 - 14 LPA",
      category: "Software / IT",
      skills: ["Python", "FastAPI", "React", "PostgreSQL", "Git"],
      snippet: "Design and implement responsive web apps, modular frontend components, and high-speed data microservices with real-time analytics.",
      postedBy: "hr@technext.com",
      date: "2 days ago"
    }
  ]
};
