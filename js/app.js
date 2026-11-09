/**
 * EXAM COMPANION - FULL CALENDAR TIMELINE & STUDY PLANNER LOGIC
 * Manages daily continuous timeline from Nov 9 to Dec 7, 2026.
 * Tracks gaps, today indicator, editable daily plans saved to localStorage.
 */

const TIMELINE_CONFIG = {
  startDate: "2026-11-09",
  endDate: "2026-12-07",
  exams: {
    "2026-11-17": {
      title: "Networks Lab",
      code: "PCCSL507",
      slot: "PCCSL507",
      time: "09:30 AM onwards",
      type: "Practical Exam",
      venue: "VISAT Network Lab",
      accent: "#8B5CF6",
      isExam: true,
      badge: "Practical Exam 1"
    },
    "2026-11-20": {
      title: "Deep Learning Lab",
      code: "PCCML508",
      slot: "PCCML508",
      time: "09:30 AM onwards",
      type: "Practical Exam",
      venue: "VISAT AI Lab",
      accent: "#F43F5E",
      isExam: true,
      badge: "Practical Exam 2"
    },
    "2026-11-23": {
      title: "Computer Network",
      code: "PCCST501",
      slot: "Slot A",
      time: "1:30 PM - 4:00 PM",
      type: "University Theory",
      venue: "VISAT Exam Hall",
      accent: "#6366F1",
      isExam: true,
      badge: "Theory Series Opener"
    },
    "2026-11-27": {
      title: "Design and Analysis of Algorithm",
      code: "PCCST502",
      slot: "Slot B",
      time: "2:00 PM - 4:30 PM",
      type: "University Theory",
      venue: "VISAT Exam Hall",
      accent: "#0284c7",
      isExam: true,
      badge: "Slot B (Friday Timing)"
    },
    "2026-12-01": {
      title: "Deep Learning Concepts",
      code: "PCCMT503",
      slot: "Slot C",
      time: "1:30 PM - 4:00 PM",
      type: "University Theory",
      venue: "VISAT Exam Hall",
      accent: "#ec4899",
      isExam: true,
      badge: "Slot C"
    },
    "2026-12-03": {
      title: "Introduction to Computer Vision",
      code: "PBCMS04",
      slot: "Slot D",
      time: "1:30 PM - 4:00 PM",
      type: "University Theory",
      venue: "VISAT Exam Hall",
      accent: "#d97706",
      isExam: true,
      isTightGap: true,
      badge: "Slot D (Tight 1-Day Gap!)"
    },
    "2026-12-07": {
      title: "Software Project Management",
      code: "PECST521",
      slot: "Slot E",
      time: "1:30 PM - 4:00 PM",
      type: "University Theory",
      venue: "VISAT Exam Hall",
      accent: "#059669",
      isExam: true,
      badge: "Final Theory Paper"
    }
  }
};

// Target countdown nearest exam list
const ALL_EXAMS_LIST = [
  {
    id: "lab-net",
    title: "Networks Lab (PCCSL507)",
    dateStr: "2026-11-17T09:30:00+05:30",
    dateFormatted: "17 Nov 2026",
    day: "Tuesday",
    time: "09:30 AM onwards",
    type: "PRACTICAL LAB / VIVA"
  },
  {
    id: "lab-dl",
    title: "Deep Learning Lab (PCCML508)",
    dateStr: "2026-11-20T09:30:00+05:30",
    dateFormatted: "20 Nov 2026",
    day: "Friday",
    time: "09:30 AM onwards",
    type: "PRACTICAL LAB / VIVA"
  },
  {
    id: "cn",
    title: "Computer Network (PCCST501)",
    dateStr: "2026-11-23T13:30:00+05:30",
    dateFormatted: "23 Nov 2026",
    day: "Monday",
    time: "1:30 PM - 4:00 PM",
    type: "UNIVERSITY THEORY"
  },
  {
    id: "daa",
    title: "Design & Analysis of Algorithm (PCCST502)",
    dateStr: "2026-11-27T14:00:00+05:30",
    dateFormatted: "27 Nov 2026",
    day: "Friday",
    time: "2:00 PM - 4:30 PM",
    type: "UNIVERSITY THEORY"
  },
  {
    id: "dlc",
    title: "Deep Learning Concepts (PCCMT503)",
    dateStr: "2026-12-01T13:30:00+05:30",
    dateFormatted: "01 Dec 2026",
    day: "Tuesday",
    time: "1:30 PM - 4:00 PM",
    type: "UNIVERSITY THEORY"
  },
  {
    id: "cv",
    title: "Introduction to Computer Vision (PBCMS04)",
    dateStr: "2026-12-03T13:30:00+05:30",
    dateFormatted: "03 Dec 2026",
    day: "Thursday",
    time: "1:30 PM - 4:00 PM",
    type: "UNIVERSITY THEORY"
  },
  {
    id: "spm",
    title: "Software Project Management (PECST521)",
    dateStr: "2026-12-07T13:30:00+05:30",
    dateFormatted: "07 Dec 2026",
    day: "Monday",
    time: "1:30 PM - 4:00 PM",
    type: "UNIVERSITY THEORY"
  }
];

// Helper: Format Date string YYYY-MM-DD
function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 1. Live Countdown for Overview & Timetable top
function initCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const targetLabelEl = document.getElementById("target-exam-label");
  const targetDateEl = document.getElementById("target-exam-date");
  const targetTypeEl = document.getElementById("target-exam-type");

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    let nextExam = ALL_EXAMS_LIST.find(ex => new Date(ex.dateStr).getTime() > now);
    if (!nextExam) nextExam = ALL_EXAMS_LIST[0];

    if (targetLabelEl) targetLabelEl.textContent = nextExam.title;
    if (targetDateEl) targetDateEl.textContent = `${nextExam.day} • ${nextExam.dateFormatted} (${nextExam.time})`;
    if (targetTypeEl) targetTypeEl.textContent = nextExam.type;

    const targetTime = new Date(nextExam.dateStr).getTime();
    const diff = targetTime - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// 2. Continuous Day-by-Day Calendar Timeline Generator
function initCalendarTimeline() {
  const container = document.getElementById("timeline-road-container");
  if (!container) return;

  const savedPlans = JSON.parse(localStorage.getItem("vimal_study_plans") || "{}");

  const start = new Date(TIMELINE_CONFIG.startDate + "T00:00:00");
  const end = new Date(TIMELINE_CONFIG.endDate + "T00:00:00");
  const todayStr = formatDateISO(new Date());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let html = "";
  let curr = new Date(start);

  while (curr <= end) {
    const dateKey = formatDateISO(curr);
    const dayName = daysOfWeek[curr.getDay()];
    const monthName = months[curr.getMonth()];
    const dayNum = curr.getDate();

    const exam = TIMELINE_CONFIG.exams[dateKey];
    const isToday = (dateKey === todayStr);
    const isPast = (dateKey < todayStr);

    // Calculate next exam from this specific day
    const nextExamEntry = Object.entries(TIMELINE_CONFIG.exams).find(([d]) => d > dateKey);
    let nextExamDistanceText = "";
    if (nextExamEntry && !exam) {
      const nextDate = new Date(nextExamEntry[0] + "T00:00:00");
      const diffDays = Math.round((nextDate - curr) / (1000 * 60 * 60 * 24));
      nextExamDistanceText = `${diffDays} Day${diffDays > 1 ? 's' : ''} until ${nextExamEntry[1].title}`;
    }

    const isTight = (dateKey === "2026-12-02"); // The single revision day between DL and Vision!

    // Determine card classes
    let cardClass = "day-node";
    if (isPast) {
      cardClass += " is-passed";
    } else if (isToday) {
      cardClass += " is-today";
    }
    
    if (exam) {
      cardClass += " is-exam-day";
    } else {
      cardClass += " is-study-day";
    }
    if (isTight && !isPast) cardClass += " is-tight-gap";

    const customPlan = savedPlans[dateKey] || { text: "", done: isPast }; // Past days are automatically done/concluded

    html += `
      <div class="${cardClass}" id="day-${dateKey}" style="--node-accent: ${exam ? exam.accent : (isPast ? '#e11d48' : '#059669')};">
        <div class="day-node-header">
          <div class="day-date-group">
            <div class="date-badge">
              <div class="date-badge-day">${dayName}</div>
              <div class="date-badge-num">${dayNum}</div>
              <div style="font-size:0.68rem; font-weight:700; color:#64748b;">${monthName}</div>
            </div>
            <div class="day-info-text">
              <h3>
                ${exam ? `⚡ ${exam.title} (${exam.code})` : (isTight ? `⚠️ Critical Revision Buffer: Computer Vision` : `📖 Study & Preparation Day`)}
                ${isToday ? `<span class="pill-tag emerald" style="font-size:0.75rem; padding:2px 10px;">🌟 TODAY</span>` : ''}
                ${isPast ? `<span class="pill-tag rose" style="font-size:0.72rem; padding:2px 8px;">🔒 CONCLUDED / PASSED</span>` : ''}
              </h3>
              <p>
                ${exam ? `⏰ <strong>${exam.time}</strong> • 🏛️ ${exam.venue} • ${exam.slot}` : (isPast ? '✅ Day Concluded' : (nextExamDistanceText ? `⏳ <strong>${nextExamDistanceText}</strong>` : '🎯 Final Preparation Buffer'))}
              </p>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            ${exam ? `<span class="pill-tag" style="background:${exam.accent}20; color:${exam.accent}; border-color:${exam.accent}40;">${exam.badge}</span>` : (isPast ? `<span class="pill-tag rose">Completed</span>` : `<span class="pill-tag emerald">Study Session</span>`)}
            ${exam && !isPast ? `<button onclick="generateGCalFromDate('${dateKey}')" class="clay-btn" style="padding:6px 14px; font-size:0.78rem;">🗓️ GCal</button>` : ''}
          </div>
        </div>

        <!-- Interactive Study Planner Block -->
        <div class="day-planner-box">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div style="font-size:0.82rem; font-weight:700; color:#475569;">
              📝 <strong>Day Plan & Goal:</strong> ${isPast ? '<span style="color:#e11d48;">(Concluded & Locked)</span>' : ''}
            </div>
            <!-- Quick Subject Tags -->
            ${!isPast ? `
            <div class="planner-quick-tags">
              <span style="font-size:0.72rem; color:#94a3b8; font-weight:700;">Quick add:</span>
              <button class="quick-tag-btn" onclick="addQuickGoal('${dateKey}', 'Networks')">Networks</button>
              <button class="quick-tag-btn" onclick="addQuickGoal('${dateKey}', 'DAA Algorithms')">DAA</button>
              <button class="quick-tag-btn" onclick="addQuickGoal('${dateKey}', 'Deep Learning')">Deep Learning</button>
              <button class="quick-tag-btn" onclick="addQuickGoal('${dateKey}', 'Computer Vision')">Vision</button>
              <button class="quick-tag-btn" onclick="addQuickGoal('${dateKey}', 'SPM')">SPM</button>
            </div>
            ` : ''}
          </div>

          <div class="planner-input-row">
            <input type="text" 
                   id="plan-input-${dateKey}" 
                   class="planner-input" 
                   ${isPast ? 'readonly' : ''}
                   placeholder="${isPast ? 'Day finished and concluded' : (exam ? 'Morning revision checklist before hall...' : 'What will you master today?...')}"
                   value="${escapeHtml(customPlan.text)}"
                   oninput="handlePlanChange('${dateKey}', this.value)"
            />
            <button class="clay-btn ${(customPlan.done || isPast) ? 'primary' : ''}" 
                    id="plan-check-${dateKey}" 
                    ${isPast ? 'disabled' : ''}
                    onclick="togglePlanDone('${dateKey}')" 
                    style="padding: 10px 18px; font-size: 0.85rem;"
                    title="${isPast ? 'Concluded' : 'Mark today target achieved'}">
              <span>${(customPlan.done || isPast) ? '✅ Goal Achieved' : '⭕ Mark Done'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Increment 1 day
    curr.setDate(curr.getDate() + 1);
  }

  container.innerHTML = html;
}

// Study Planner State Handlers
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function handlePlanChange(dateKey, text) {
  const savedPlans = JSON.parse(localStorage.getItem("vimal_study_plans") || "{}");
  if (!savedPlans[dateKey]) savedPlans[dateKey] = { text: "", done: false };
  savedPlans[dateKey].text = text;
  localStorage.setItem("vimal_study_plans", JSON.stringify(savedPlans));
  updateTotalPlanCount();
}

function addQuickGoal(dateKey, subjectTag) {
  const input = document.getElementById(`plan-input-${dateKey}`);
  if (!input) return;
  const current = input.value.trim();
  const addition = `[${subjectTag}] `;
  if (!current.includes(addition)) {
    input.value = current ? `${addition}${current}` : `${addition}Module revision`;
    handlePlanChange(dateKey, input.value);
  }
}

function togglePlanDone(dateKey) {
  const savedPlans = JSON.parse(localStorage.getItem("vimal_study_plans") || "{}");
  if (!savedPlans[dateKey]) savedPlans[dateKey] = { text: "", done: false };
  savedPlans[dateKey].done = !savedPlans[dateKey].done;
  localStorage.setItem("vimal_study_plans", JSON.stringify(savedPlans));

  const btn = document.getElementById(`plan-check-${dateKey}`);
  if (btn) {
    if (savedPlans[dateKey].done) {
      btn.classList.add("primary");
      btn.innerHTML = "<span>✅ Goal Achieved</span>";
    } else {
      btn.classList.remove("primary");
      btn.innerHTML = "<span>⭕ Mark Done</span>";
    }
  }
  updateTotalPlanCount();
}

function updateTotalPlanCount() {
  const savedPlans = JSON.parse(localStorage.getItem("vimal_study_plans") || "{}");
  const countEl = document.getElementById("planned-goals-count");
  if (!countEl) return;
  const total = Object.values(savedPlans).filter(p => p.text && p.text.trim().length > 0).length;
  const completed = Object.values(savedPlans).filter(p => p.text && p.done).length;
  countEl.textContent = `${completed}/${total} Goals Done`;
}

// Google Calendar direct link from dateKey
function generateGCalFromDate(dateKey) {
  const exam = TIMELINE_CONFIG.exams[dateKey];
  if (!exam) return;
  const title = encodeURIComponent(`KTU S5 Exam: ${exam.title} (${exam.code})`);
  const details = encodeURIComponent(`Exam Slot: ${exam.slot}\nVenue: ${exam.venue}\nTime: ${exam.time}\nCandidate: Vimal J Mathew (Roll: 30)`);
  const location = encodeURIComponent("VISAT Engineering College, Elanji");
  
  // Create start and end ISO
  const startIso = `${dateKey.replace(/-/g, '')}T040000Z`; // approx morning UTC
  const endIso = `${dateKey.replace(/-/g, '')}T110000Z`;
  
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  window.open(gcalUrl, '_blank');
}

// Checklist State Handler
function initChecklist() {
  const items = document.querySelectorAll(".check-item");
  if (!items.length) return;

  const saved = JSON.parse(localStorage.getItem("vimal_exam_checklist") || "{}");

  items.forEach(item => {
    const key = item.getAttribute("data-id");
    if (saved[key]) {
      item.classList.add("done");
    }

    item.addEventListener("click", () => {
      item.classList.toggle("done");
      saved[key] = item.classList.contains("done");
      localStorage.setItem("vimal_exam_checklist", JSON.stringify(saved));
      updateChecklistCounter();
    });
  });

  updateChecklistCounter();
}

function updateChecklistCounter() {
  const total = document.querySelectorAll(".check-item").length;
  const done = document.querySelectorAll(".check-item.done").length;
  const counterEl = document.getElementById("checklist-summary");
  if (counterEl) {
    counterEl.textContent = `${done} of ${total} Ready`;
  }
}

function resetChecklist() {
  localStorage.removeItem("vimal_exam_checklist");
  document.querySelectorAll(".check-item").forEach(i => i.classList.remove("done"));
  updateChecklistCounter();
}

// 4. Dynamic Auto-State Updater for Static Calendar Grids on study-plan.html
function updateStaticCalendarPastStates() {
  const todayStr = formatDateISO(new Date());
  
  // Find all calendar cells with numbers in study-plan.html
  const cells = document.querySelectorAll(".calendar-view-card .cal-cell:not(.empty)");
  if (!cells.length) return;

  cells.forEach(cell => {
    const dayNumEl = cell.querySelector(".cal-day-num");
    if (!dayNumEl) return;
    const dayNum = parseInt(dayNumEl.textContent.trim(), 10);
    
    // Check if cell belongs to Nov or Dec
    const isNov = cell.closest(".calendar-view-card").textContent.includes("November");
    const mStr = isNov ? "11" : "12";
    const dateKey = `2026-${mStr}-${String(dayNum).padStart(2, '0')}`;

    if (dateKey < todayStr) {
      cell.classList.add("is-passed");
      cell.classList.remove("is-today-cell");
    } else if (dateKey === todayStr) {
      cell.classList.add("is-today-cell");
      cell.classList.remove("is-passed");
    } else {
      cell.classList.remove("is-passed");
      cell.classList.remove("is-today-cell");
    }
  });
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initCalendarTimeline();
  initChecklist();
  updateTotalPlanCount();
  updateStaticCalendarPastStates();
});
