/**
 * TooManyJobs.com - Central Configuration & Seeds
 * Naukri.com Architecture Implementation
 */

window.NAUKRI_CONFIG = {
  portalName: "TooManyJobs.com",
  masterAdminEmail: "dilip.bath@gmail.com",
  storageKeys: {
    jobs: "NAUKRI_TMJ_JOBS_CATALOG_V2",
    applications: "NAUKRI_TMJ_APPLICATIONS_V2",
    candidateProfile: "NAUKRI_TMJ_CANDIDATE_V2",
    employerProfile: "NAUKRI_TMJ_EMPLOYER_V2",
    adminSession: "NAUKRI_TMJ_ADMIN_TOKEN_V2"
  },
  
  // Real-world enterprise tech openings
  defaultJobs: [
    {
      id: "nj-101",
      title: "Senior Capacity & Performance Manager - AI Ops",
      company: "Cognizant Technology Solutions",
      location: "Hyderabad (Financial District)",
      experience: "8-12 Yrs",
      salary: "28 - 38 Lacs PA",
      category: "IT / Data Science",
      skills: ["Python", "LangGraph", "Capacity Planning", "Multi-Cloud", "Prometheus", "SRE"],
      snippet: "Lead multi-cloud capacity management, automated telemetry anomaly forecasting, and agentic AI prompt operations across hybrid clusters.",
      postedBy: "dilip.bath@gmail.com",
      companyLogoText: "CTS",
      date: "Just Now",
      workMode: "Hybrid"
    },
    {
      id: "nj-102",
      title: "Site Reliability Engineer (SRE) - Cloud Infrastructure",
      company: "Kyndryl Global Solutions",
      location: "Hyderabad / Bengaluru",
      experience: "4-8 Yrs",
      salary: "18 - 25 Lacs PA",
      category: "Cloud / DevOps",
      skills: ["Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "ITIL"],
      snippet: "Responsible for cluster availability, automated failover pipelines, SLO/SLA monitoring, zero-downtime releases, and incident management.",
      postedBy: "recruiter@kyndryl.com",
      companyLogoText: "KYN",
      date: "1 day ago",
      workMode: "Hybrid"
    },
    {
      id: "nj-103",
      title: "Lead Full Stack AI Web Developer",
      company: "IBM India Software Labs",
      location: "Hyderabad / Remote",
      experience: "3-6 Yrs",
      salary: "14 - 22 Lacs PA",
      category: "Software / Engineering",
      skills: ["Python", "FastAPI", "React", "Docker", "PostgreSQL", "REST APIs"],
      snippet: "Build high-speed enterprise dashboards, real-time agent monitoring toolchains, and scalable customer-facing applications.",
      postedBy: "talent@ibm.com",
      companyLogoText: "IBM",
      date: "2 days ago",
      workMode: "Work From Home"
    }
  ]
};
