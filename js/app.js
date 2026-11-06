const JOBS_STORAGE_KEY = 'TMJ_ACTIVE_JOBS_DB_V1';
const APPS_STORAGE_KEY = 'TMJ_CANDIDATE_APPLICATIONS_V1';

let allJobs = [];
let selectedTag = 'All';

document.addEventListener("DOMContentLoaded", () => {
  // Load jobs from storage or load defaults
  const stored = localStorage.getItem(JOBS_STORAGE_KEY);
  if (stored) {
    allJobs = JSON.parse(stored);
  } else {
    allJobs = [...window.TMJ_CONFIG.defaultJobs];
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(allJobs));
  }

  renderJobs(allJobs);
});

// Render cards
function renderJobs(jobsToRender) {
  const container = document.getElementById("job-cards-wrapper");
  document.getElementById("job-count").innerText = jobsToRender.length;

  if (jobsToRender.length === 0) {
    container.innerHTML = `
      <div style="background:#fff; padding:3rem; text-align:center; border-radius:12px; border:1px solid #e2e8f0;">
        <h3 style="color:#64748b;">No matching openings found</h3>
        <p style="color:#94a3b8; font-size:0.9rem; margin-top:0.5rem;">Try adjusting your skill keyword or location filter.</p>
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
        <button class="btn-apply" onclick="openApplyModal('${job.id}')">Apply Now</button>
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
        <span>Posted: <strong>${job.date || 'Recent'}</strong></span>
        <span>Verified Employer ✓</span>
      </div>
    </article>
  `).join("");
}

// Multi-facet filtering (Naukri style)
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

// Pill filter
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
  document.querySelectorAll(".pill-tag").forEach((el, idx) => {
    el.classList.toggle("active", idx === 0);
  });
  renderJobs(allJobs);
}

// Application Modal
function openApplyModal(jobId) {
  const job = allJobs.find(j => j.id === jobId);
  if (!job) return;

  document.getElementById("apply-job-id").value = job.id;
  document.getElementById("modal-job-title").innerText = `Apply: ${job.title}`;
  document.getElementById("modal-job-company").innerText = `${job.company} • ${job.location}`;
  document.getElementById("apply-modal").classList.add("active");
}

function closeApplyModal() {
  document.getElementById("apply-modal").classList.remove("active");
  document.getElementById("apply-form").reset();
}

function handleApplySubmit(e) {
  e.preventDefault();
  const jobId = document.getElementById("apply-job-id").value;
  const job = allJobs.find(j => j.id === jobId);

  const newApplication = {
    appId: "APP-" + Date.now(),
    jobId: jobId,
    jobTitle: job ? job.title : "Direct Opening",
    company: job ? job.company : "N/A",
    name: document.getElementById("applicant-name").value,
    email: document.getElementById("applicant-email").value,
    phone: document.getElementById("applicant-phone").value,
    exp: document.getElementById("applicant-exp").value,
    ctc: document.getElementById("applicant-ctc").value,
    resume: document.getElementById("applicant-resume").value,
    note: document.getElementById("applicant-note").value,
    appliedAt: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
  };

  // Save to Application Storage
  const existingApps = JSON.parse(localStorage.getItem(APPS_STORAGE_KEY) || "[]");
  existingApps.unshift(newApplication);
  localStorage.setItem(APPS_STORAGE_KEY, JSON.stringify(existingApps));

  alert(`Application successfully submitted for ${job.title}! The recruitment team will reach out to you.`);
  closeApplyModal();
}
