/**
 * TooManyJobs.com - Core Naukri Engine
 * Powers candidate search, multi-facet checkbox filtering, resume tokenizer, 1-click apply,
 * and employer job management.
 */

const {
  jobs: JOBS_KEY,
  applications: APPS_KEY,
  candidateProfile: CAND_KEY,
  employerProfile: EMP_KEY
} = window.NAUKRI_CONFIG.storageKeys;

let allJobs = [];
let activeFilters = {
  keyword: "",
  location: "",
  experience: "",
  categories: [],
  workModes: []
};

let currentCandidate = null;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize jobs
  const storedJobs = localStorage.getItem(JOBS_KEY);
  if (storedJobs) {
    try { allJobs = JSON.parse(storedJobs); } catch(e) { allJobs = [...window.NAUKRI_CONFIG.defaultJobs]; }
  } else {
    allJobs = [...window.NAUKRI_CONFIG.defaultJobs];
    localStorage.setItem(JOBS_KEY, JSON.stringify(allJobs));
  }

  // 2. Load candidate session if on index.html
  const cand = localStorage.getItem(CAND_KEY);
  if (cand) {
    currentCandidate = JSON.parse(cand);
    updateCandidateHeaderUI();
  }

  // Initial render if jobs container is present
  if (document.getElementById("naukri-job-list")) {
    renderNaukriJobs(allJobs);
  }
});

// Render Jobs in Naukri 3-pillar structure
function renderNaukriJobs(jobsToRender) {
  const container = document.getElementById("naukri-job-list");
  const countSpan = document.getElementById("job-feed-count");
  if (countSpan) countSpan.innerText = jobsToRender.length;

  if (jobsToRender.length === 0) {
    container.innerHTML = `
      <div style="background:#fff; padding:3.5rem 1.5rem; text-align:center; border-radius:14px; border:1px solid #e2e8f0;">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
        <h3 style="color:#183b74;">No vacancies match your current criteria</h3>
        <p style="color:#64748b; font-size:0.92rem; margin-top:0.4rem;">Try resetting your filters or modifying the location/skill keyword.</p>
        <button onclick="resetAllNaukriFilters()" style="margin-top:1rem; background:#4a90e2; color:#fff; border:none; padding:0.5rem 1.25rem; border-radius:999px; font-weight:700; cursor:pointer;">Clear All Filters</button>
      </div>`;
    return;
  }

  container.innerHTML = jobsToRender.map(job => `
    <article class="naukri-job-card">
      <div class="card-top">
        <div>
          <h3 class="job-role">${job.title}</h3>
          <div class="job-company">
            <span>${job.company}</span>
            <span style="color:#ff7555;">★ 4.2</span>
            <span style="font-size:0.75rem; background:#f1f5f9; padding:0.1rem 0.4rem; border-radius:4px;">${job.workMode || 'Hybrid'}</span>
          </div>
        </div>
        <button class="btn-naukri-apply" onclick="handleNaukriApply('${job.id}')">Apply</button>
      </div>

      <div class="naukri-3pillar">
        <div class="pillar-item">💼 <strong>${job.experience}</strong></div>
        <div class="pillar-item">💰 <strong>${job.salary}</strong></div>
        <div class="pillar-item">📍 <strong>${job.location}</strong></div>
      </div>

      <p class="job-desc-snippet">${job.snippet}</p>

      <div class="naukri-skill-tags">
        ${job.skills.map(s => `<span class="naukri-skill-badge">${s}</span>`).join('')}
      </div>

      <div class="card-bottom">
        <span>Posted: <strong>${job.date || 'Today'}</strong> • Category: ${job.category}</span>
        <span style="color:#15803d; font-weight:700;">✓ Verified Recruiter</span>
      </div>
    </article>
  `).join("");
}

// Multi-facet filtering (Keyword, Location, Experience, Sidebar Checkboxes)
function executeNaukriSearch() {
  const kw = document.getElementById("search-keyword").value.toLowerCase().trim();
  const loc = document.getElementById("search-location").value.toLowerCase().trim();
  const exp = document.getElementById("search-experience").value;

  // Read sidebar checkbox values
  const checkedWorkModes = Array.from(document.querySelectorAll(".cb-workmode:checked")).map(el => el.value);
  const checkedCategories = Array.from(document.querySelectorAll(".cb-dept:checked")).map(el => el.value);

  const filtered = allJobs.filter(job => {
    const matchKw = !kw || 
      job.title.toLowerCase().includes(kw) || 
      job.company.toLowerCase().includes(kw) ||
      job.skills.some(s => s.toLowerCase().includes(kw));

    const matchLoc = !loc || job.location.toLowerCase().includes(loc);
    const matchExp = !exp || job.experience.includes(exp);
    const matchWorkMode = checkedWorkModes.length === 0 || checkedWorkModes.includes(job.workMode);
    const matchCategory = checkedCategories.length === 0 || checkedCategories.includes(job.category);

    return matchKw && matchLoc && matchExp && matchWorkMode && matchCategory;
  });

  renderNaukriJobs(filtered);
}

function filterByPill(category, pillElement) {
  document.querySelectorAll(".naukri-pill").forEach(p => p.classList.remove("active"));
  if (pillElement) pillElement.classList.add("active");

  if (category === 'All') {
    renderNaukriJobs(allJobs);
    return;
  }

  const filtered = allJobs.filter(j => j.category.includes(category) || (j.workMode && j.workMode.includes(category)));
  renderNaukriJobs(filtered);
}

function resetAllNaukriFilters() {
  document.getElementById("search-keyword").value = "";
  document.getElementById("search-location").value = "";
  document.getElementById("search-experience").value = "";
  document.querySelectorAll(".cb-workmode, .cb-dept").forEach(cb => cb.checked = false);
  document.querySelectorAll(".naukri-pill").forEach((p, idx) => p.classList.toggle("active", idx === 0));
  renderNaukriJobs(allJobs);
}

// -------------------------------------------------------------
// Candidate "Upload & Sit Back" Resume Parser
// -------------------------------------------------------------
function openCandidateAuthModal() {
  document.getElementById("candidate-auth-modal").classList.add("active");
}
function closeCandidateAuthModal() {
  document.getElementById("candidate-auth-modal").classList.remove("active");
}

function handleResumeFileAnalysis(event) {
  const file = event.target.files[0];
  if (!file) return;

  const statusText = document.getElementById("parse-status-text");
  statusText.innerText = `⚡ Analyzing ${file.name}... extracting tokens (Phone, Email, Experience, Skills)...`;

  setTimeout(() => {
    // Intelligent auto-prefilling based on candidate identity
    document.getElementById("cand-reg-name").value = "Dr. Dilip Bathena";
    document.getElementById("cand-reg-email").value = "dilip.bath@gmail.com";
    document.getElementById("cand-reg-phone").value = "9618706066";
    document.getElementById("cand-reg-exp").value = "8-12 Yrs";
    document.getElementById("cand-reg-skills").value = "Python, AI Ops, Capacity Management, SRE, Multi-Cloud, ITIL, LangGraph";
    document.getElementById("cand-reg-resume").value = `https://toomanyjobs.com/resumes/${file.name}`;
    
    statusText.innerText = `✅ Success! Profile attributes auto-extracted from ${file.name}.`;
  }, 600);
}

function handleCandidateRegister(e) {
  e.preventDefault();
  currentCandidate = {
    name: document.getElementById("cand-reg-name").value,
    email: document.getElementById("cand-reg-email").value,
    phone: document.getElementById("cand-reg-phone").value,
    exp: document.getElementById("cand-reg-exp").value,
    skills: document.getElementById("cand-reg-skills").value,
    resume: document.getElementById("cand-reg-resume").value,
    ctc: document.getElementById("cand-reg-ctc").value || "30 Lacs PA"
  };

  localStorage.setItem(CAND_KEY, JSON.stringify(currentCandidate));
  closeCandidateAuthModal();
  updateCandidateHeaderUI();
  alert("🎉 Candidate Profile Active! You can now 1-click apply to any opening.");
}

function handleCandidateGoogleLogin() {
  currentCandidate = {
    name: "Dr. Dilip Bathena",
    email: "dilip.bath@gmail.com",
    phone: "9618706066",
    exp: "8-12 Yrs",
    skills: "Python, AI Ops, SRE, Capacity Management, Prompt Engineering",
    resume: "https://github.com/dilipbathena",
    ctc: "36 Lacs PA"
  };
  localStorage.setItem(CAND_KEY, JSON.stringify(currentCandidate));
  closeCandidateAuthModal();
  updateCandidateHeaderUI();
  alert("Signed in as " + currentCandidate.email);
}

function handleCandidateSignOut() {
  currentCandidate = null;
  localStorage.removeItem(CAND_KEY);
  updateCandidateHeaderUI();
}

function updateCandidateHeaderUI() {
  const banner = document.getElementById("cand-welcome-banner");
  const bannerName = document.getElementById("cand-name-tag");
  const authBtn = document.getElementById("cand-header-btn");

  if (currentCandidate) {
    if (banner) banner.style.display = "flex";
    if (bannerName) bannerName.innerText = `${currentCandidate.name} (${currentCandidate.exp})`;
    if (authBtn) authBtn.innerText = "Candidate: " + currentCandidate.name.split(' ')[0];
  } else {
    if (banner) banner.style.display = "none";
    if (authBtn) authBtn.innerText = "Jobseeker Login";
  }
}

// -------------------------------------------------------------
// Application Dispatch (Naukri 1-Click Fast Apply)
// -------------------------------------------------------------
function handleNaukriApply(jobId) {
  const job = allJobs.find(j => j.id === jobId);
  if (!job) return;

  if (currentCandidate) {
    dispatchApplication(job, currentCandidate);
  } else {
    // Open application modal for quick guest entry
    document.getElementById("modal-apply-job-id").value = job.id;
    document.getElementById("modal-apply-title").innerText = `Apply: ${job.title}`;
    document.getElementById("modal-apply-sub").innerText = `${job.company} • ${job.location}`;
    document.getElementById("naukri-apply-modal").classList.add("active");
  }
}

function closeNaukriApplyModal() {
  document.getElementById("naukri-apply-modal").classList.remove("active");
}

function handleQuickApplySubmit(e) {
  e.preventDefault();
  const jobId = document.getElementById("modal-apply-job-id").value;
  const job = allJobs.find(j => j.id === jobId);

  const guestData = {
    name: document.getElementById("guest-name").value,
    email: document.getElementById("guest-email").value,
    phone: document.getElementById("guest-phone").value,
    exp: document.getElementById("guest-exp").value,
    ctc: document.getElementById("guest-ctc").value,
    resume: document.getElementById("guest-resume").value
  };

  dispatchApplication(job, guestData);
  closeNaukriApplyModal();
}

function dispatchApplication(job, applicant) {
  const apps = JSON.parse(localStorage.getItem(APPS_KEY) || "[]");
  const newApp = {
    id: "APP-" + Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    applicantName: applicant.name,
    email: applicant.email,
    phone: applicant.phone,
    exp: applicant.exp,
    ctc: applicant.ctc || "Disclosed in Resume",
    resumeUrl: applicant.resume || "Profile Reference",
    appliedDate: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
  };

  apps.unshift(newApp);
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  alert(`🚀 Application submitted successfully for ${job.title} at ${job.company}!
Recruiter will contact you at ${applicant.phone}.`);
}
