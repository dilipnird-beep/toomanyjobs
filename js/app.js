/**
 * TooManyJobs.com - Main Client Application
 */

let allJobs = [];
let selectedTag = 'All';
let currentCandidate = null;
let currentEmployer = null;

const { jobs: JOBS_KEY, applications: APPS_KEY, candidateProfile: CANDIDATE_KEY, employerProfile: EMPLOYER_KEY } = window.TMJ_CONFIG.storageKeys;

document.addEventListener("DOMContentLoaded", () => {
  const storedJobs = localStorage.getItem(JOBS_KEY);
  if (storedJobs) {
    try { allJobs = JSON.parse(storedJobs); } catch(e) { allJobs = [...window.TMJ_CONFIG.defaultJobs]; }
  } else {
    allJobs = [...window.TMJ_CONFIG.defaultJobs];
    localStorage.setItem(JOBS_KEY, JSON.stringify(allJobs));
  }

  const cand = localStorage.getItem(CANDIDATE_KEY);
  if (cand) {
    currentCandidate = JSON.parse(cand);
    updateCandidateUI();
  }

  const emp = localStorage.getItem(EMPLOYER_KEY);
  if (emp) {
    currentEmployer = JSON.parse(emp);
    updateEmployerUI();
  }

  renderJobs(allJobs);
});

function renderJobs(jobsToRender) {
  const container = document.getElementById("job-cards-wrapper");
  document.getElementById("job-count").innerText = jobsToRender.length;

  if (jobsToRender.length === 0) {
    container.innerHTML = `
      <div style="background:#fff; padding:3rem; text-align:center; border-radius:12px; border:1px solid #e2e8f0;">
        <h3 style="color:#64748b;">No matching job openings found</h3>
        <p style="color:#94a3b8; font-size:0.9rem; margin-top:0.5rem;">Try modifying your keyword, skill, or location search.</p>
      </div>`;
    return;
  }

  container.innerHTML = jobsToRender.map(job => `
    <article class="job-card">
      <div class="job-title-row">
        <div>
          <h3 class="job-title">${job.title}</h3>
          <div class="company-name">${job.company}</div>
        </div>
        <button class="btn-apply" onclick="handleApplyClick('${job.id}')">Apply Now</button>
      </div>

      <div class="job-meta-row">
        <div class="meta-item">💼 <strong>${job.experience}</strong></div>
        <div class="meta-item">💰 <strong>${job.salary}</strong></div>
        <div class="meta-item">📍 <strong>${job.location}</strong></div>
      </div>

      <p class="job-snippet">${job.snippet}</p>

      <div class="skill-tags">
        ${job.skills.map(s => `<span class="skill-badge">${s}</span>`).join('')}
      </div>

      <div class="job-footer-row">
        <span>Category: <strong>${job.category}</strong> • Posted: ${job.date || 'Recent'}</span>
        <span style="color:#16a34a; font-weight:600;">✓ Verified Recruiter Opening</span>
      </div>
    </article>
  `).join("");
}

function applyFilters() {
  const keyword = document.getElementById("search-keyword").value.toLowerCase().trim();
  const location = document.getElementById("search-location").value.toLowerCase().trim();
  const exp = document.getElementById("search-experience").value;

  const filtered = allJobs.filter(job => {
    const matchKeyword = !keyword || 
      job.title.toLowerCase().includes(keyword) || 
      job.company.toLowerCase().includes(keyword) ||
      job.skills.some(s => s.toLowerCase().includes(keyword));

    const matchLocation = !location || job.location.toLowerCase().includes(location);
    const matchExp = !exp || job.experience === exp;
    const matchTag = (selectedTag === 'All') || job.category.includes(selectedTag);

    return matchKeyword && matchLocation && matchExp && matchTag;
  });

  renderJobs(filtered);
}

function filterByTag(tag, element) {
  selectedTag = tag;
  document.querySelectorAll(".pill-tag").forEach(el => el.classList.remove("active"));
  if (element) element.classList.add("active");
  applyFilters();
}

function resetAllFilters() {
  document.getElementById("search-keyword").value = "";
  document.getElementById("search-location").value = "";
  document.getElementById("search-experience").value = "";
  selectedTag = 'All';
  document.querySelectorAll(".pill-tag").forEach((el, idx) => el.classList.toggle("active", idx === 0));
  renderJobs(allJobs);
}

function openCandidateModal() {
  document.getElementById("candidate-modal").classList.add("active");
}
function closeCandidateModal() {
  document.getElementById("candidate-modal").classList.remove("active");
}

function handleResumeFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  document.getElementById("parsing-status-msg").innerText = `⚡ Analyzing ${file.name}... auto-extracting profile details`;

  setTimeout(() => {
    if (!document.getElementById("cand-name").value) {
      document.getElementById("cand-name").value = "Dr. Dilip Bathena";
    }
    if (!document.getElementById("cand-email").value) {
      document.getElementById("cand-email").value = "dilip.bath@gmail.com";
    }
    if (!document.getElementById("cand-phone").value) {
      document.getElementById("cand-phone").value = "9618706066";
    }
    if (!document.getElementById("cand-skills").value) {
      document.getElementById("cand-skills").value = "Python, LangGraph, SRE, Capacity Management, AWS, Docker";
    }
    if (!document.getElementById("cand-exp").value) {
      document.getElementById("cand-exp").value = "8+ Years";
    }
    if (!document.getElementById("cand-resume-url").value) {
      document.getElementById("cand-resume-url").value = `https://toomanyjobs.com/uploads/${file.name}`;
    }

    document.getElementById("parsing-status-msg").innerText = `✅ Resume parsed successfully! Skills and profile prefilled below.`;
  }, 700);
}

function handleSaveCandidateProfile(e) {
  e.preventDefault();
  currentCandidate = {
    name: document.getElementById("cand-name").value,
    email: document.getElementById("cand-email").value,
    phone: document.getElementById("cand-phone").value,
    exp: document.getElementById("cand-exp").value,
    ctc: document.getElementById("cand-ctc").value,
    skills: document.getElementById("cand-skills").value,
    resume: document.getElementById("cand-resume-url").value
  };

  localStorage.setItem(CANDIDATE_KEY, JSON.stringify(currentCandidate));
  closeCandidateModal();
  updateCandidateUI();
  alert("Candidate Profile created! You can now 1-click apply to any job.");
}

function handleCandidateGoogleSignIn() {
  currentCandidate = {
    name: "Dr. Dilip Bathena",
    email: "dilip.bath@gmail.com",
    phone: "9618706066",
    exp: "8+ Years",
    ctc: "35 LPA",
    skills: "Python, AI Ops, LangGraph, AWS, Multi-Cloud SRE",
    resume: "https://github.com/dilipbathena"
  };
  localStorage.setItem(CANDIDATE_KEY, JSON.stringify(currentCandidate));
  closeCandidateModal();
  updateCandidateUI();
  alert("Signed in via Google as " + currentCandidate.email);
}

function handleCandidateLogout() {
  currentCandidate = null;
  localStorage.removeItem(CANDIDATE_KEY);
  updateCandidateUI();
}

function updateCandidateUI() {
  const banner = document.getElementById("candidate-banner");
  const nameSpan = document.getElementById("candidate-banner-name");
  const btnText = document.getElementById("cand-btn-text");

  if (currentCandidate) {
    banner.style.display = "flex";
    nameSpan.innerText = `${currentCandidate.name} (${currentCandidate.exp})`;
    btnText.innerText = "Candidate: " + currentCandidate.name.split(' ')[0];
  } else {
    banner.style.display = "none";
    btnText.innerText = "Candidate Login / Register";
  }
}

function openEmployerModal() {
  document.getElementById("employer-modal").classList.add("active");
}
function closeEmployerModal() {
  document.getElementById("employer-modal").classList.remove("active");
}

function handleEmployerGoogleSignIn() {
  currentEmployer = {
    company: "Cognitive Tech Enterprises",
    email: "recruiter@cognitivetech.com",
    role: "Hiring Manager"
  };
  localStorage.setItem(EMPLOYER_KEY, JSON.stringify(currentEmployer));
  updateEmployerUI();
  document.getElementById("emp-auth-section").style.display = "none";
}

function handlePostJob(e) {
  e.preventDefault();
  const title = document.getElementById("emp-job-title").value;
  const company = document.getElementById("emp-job-company").value;
  const location = document.getElementById("emp-job-location").value;
  const experience = document.getElementById("emp-job-exp").value;
  const salary = document.getElementById("emp-job-salary").value || "Not Disclosed";
  const category = document.getElementById("emp-job-category").value;
  const skills = document.getElementById("emp-job-skills").value.split(",").map(s => s.trim());
  const snippet = document.getElementById("emp-job-desc").value;

  const newJob = {
    id: "tmj-" + Date.now(),
    title, company, location, experience, salary, category, skills, snippet,
    postedBy: currentEmployer ? currentEmployer.email : "employer@toomanyjobs.com",
    date: "Just Now"
  };

  allJobs.unshift(newJob);
  localStorage.setItem(JOBS_KEY, JSON.stringify(allJobs));
  closeEmployerModal();
  e.target.reset();
  renderJobs(allJobs);
  alert("🎉 Job opening published live to TooManyJobs.com!");
}

function updateEmployerUI() {
  const btn = document.getElementById("emp-btn-text");
  if (currentEmployer) {
    btn.innerText = "Post Job (" + currentEmployer.company.split(' ')[0] + ")";
  } else {
    btn.innerText = "Post a Job / For Employers";
  }
}

function handleApplyClick(jobId) {
  const job = allJobs.find(j => j.id === jobId);
  if (!job) return;

  if (currentCandidate) {
    submitApplication(job, currentCandidate);
  } else {
    document.getElementById("apply-job-id").value = job.id;
    document.getElementById("modal-job-title").innerText = `Apply: ${job.title}`;
    document.getElementById("modal-job-company").innerText = `${job.company} • ${job.location}`;
    document.getElementById("apply-modal").classList.add("active");
  }
}

function closeApplyModal() {
  document.getElementById("apply-modal").classList.remove("active");
}

function handleApplySubmit(e) {
  e.preventDefault();
  const jobId = document.getElementById("apply-job-id").value;
  const job = allJobs.find(j => j.id === jobId);

  const candidateData = {
    name: document.getElementById("applicant-name").value,
    email: document.getElementById("applicant-email").value,
    phone: document.getElementById("applicant-phone").value,
    exp: document.getElementById("applicant-exp").value,
    ctc: document.getElementById("applicant-ctc").value,
    resume: document.getElementById("applicant-resume").value,
    note: document.getElementById("applicant-note").value
  };

  submitApplication(job, candidateData);
  closeApplyModal();
}

function submitApplication(job, candidate) {
  const applications = JSON.parse(localStorage.getItem(APPS_KEY) || "[]");
  
  const record = {
    id: "APP-" + Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    exp: candidate.exp,
    ctc: candidate.ctc || "N/A",
    resume: candidate.resume || "Attached Profile",
    appliedAt: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
  };

  applications.unshift(record);
  localStorage.setItem(APPS_KEY, JSON.stringify(applications));

  alert(`🎉 Application submitted for "${job.title}" at ${job.company}! Your profile has been sent to the recruiter.`);
}
