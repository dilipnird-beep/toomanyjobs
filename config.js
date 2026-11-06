/**
 * TooManyJobs.com - Central Configuration
 * By default runs with zero server friction (LocalStorage).
 * To switch to cloud sync, toggle USE_CLOUD = true and connect your Supabase/Firebase URL.
 */

window.TMJ_CONFIG = {
  portalName: "TooManyJobs.com",
  adminCredentials: {
    user: "admin@toomanyjobs.com",
    pass: "admin123" // Change this to your secure password
  },
  
  // Initial seed jobs matching popular high-demand IT/Data/Cloud openings
  defaultJobs: [
    {
      id: "tmj-101",
      title: "Senior AI Ops & Capacity Manager",
      company: "Cognitive Scale Networks",
      location: "Hyderabad, India (Hybrid)",
      experience: "8+ Years",
      salary: "₹28 - 36 LPA",
      category: "AI / Data Science",
      skills: ["Python", "LangGraph", "Capacity Planning", "Prometheus", "SLOs"],
      snippet: "Lead multi-cloud capacity management, automated telemetry anomaly detection, and prompt orchestration across high-throughput production clusters.",
      date: "Today"
    },
    {
      id: "tmj-102",
      title: "Site Reliability Engineer (SRE) - Cloud Platforms",
      company: "CloudScale Technologies",
      location: "Bengaluru / Remote",
      experience: "3-7 Years",
      salary: "₹18 - 25 LPA",
      category: "Cloud / DevOps",
      skills: ["Kubernetes", "AWS", "Terraform", "CI/CD", "Linux"],
      snippet: "Responsible for cluster health, automated failover pipelines, zero-downtime deployment strategies, and incident response.",
      date: "1 day ago"
    },
    {
      id: "tmj-103",
      title: "Full Stack Web Application Developer",
      company: "Innovate Labs",
      location: "Hyderabad, India",
      experience: "1-3 Years",
      salary: "₹8 - 14 LPA",
      category: "Software / IT",
      skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "REST APIs"],
      snippet: "Design and implement lightning-fast web applications, real-time dashboards, and reusable UI component toolkits.",
      date: "2 days ago"
    }
  ]
};
