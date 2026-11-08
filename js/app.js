/**
 * EXAM COMPANION - LOGIC & REACTIVE STATE
 * Handles countdown, chronology (Labs first, then DL Lab, then Theory),
 * checklist persistence, and Google Calendar links.
 */

const EXAM_DATA = {
  student: {
    name: "Vimal J Mathew",
    department: "CSE (AI & ML)",
    university: "APJ Abdul Kalam Technological University (KTU)",
    college: "VISAT Engineering College, Elanji",
    semester: "Semester 5 (S5)",
    rollNo: "30",
    studentId: "VIT24AM035"
  },
  // Unified chronology: Earliest exam is the Computer Networks Lab on 17th Nov!
  allExams: [
    {
      id: "lab-net",
      code: "CST507 / KTU-NET-LAB",
      title: "Computer Networks Lab",
      type: "Practical Lab / Viva",
      slot: "NET LAB",
      dateStr: "2026-11-17T09:30:00+05:30",
      endDateStr: "2026-11-17T16:30:00+05:30",
      day: "Tuesday",
      dateFormatted: "17 Nov 2026",
      time: "09:30 AM onwards",
      note: "Confirmed on 17.11.2026. Nearest upcoming examination on schedule!",
      accent: "#8B5CF6",
      isLab: true,
      badge: "Nearest Upcoming Exam"
    },
    {
      id: "lab-dl",
      code: "PCCML504 (Expected)",
      title: "Deep Learning & Practical AI Lab",
      type: "Practical Lab / Viva",
      slot: "DL LAB",
      dateStr: "2026-11-20T09:30:00+05:30", // Expected shortly around/after Networks lab
      endDateStr: "2026-11-20T16:30:00+05:30",
      day: "Expected Mid/Late Nov",
      dateFormatted: "Mid/Late Nov 2026 (Approx after Net Lab)",
      time: "09:30 AM onwards",
      note: "Date awaiting KTU External Examiner choice.",
      accent: "#F43F5E",
      isLab: true,
      badge: "Date to be confirmed"
    },
    {
      id: "cn",
      code: "PCCST501",
      title: "Computer Network",
      type: "Theory (Slot A)",
      slot: "A",
      dateStr: "2026-11-23T13:30:00+05:30",
      endDateStr: "2026-11-23T16:00:00+05:30",
      day: "Monday",
      dateFormatted: "23 Nov 2026",
      time: "1:30 PM - 4:00 PM",
      gap: "Theory Series Opener",
      accent: "#6366F1",
      badge: "Slot A"
    },
    {
      id: "daa",
      code: "PCCST502",
      title: "Design and Analysis of Algorithm",
      type: "Theory (Slot B)",
      slot: "B",
      dateStr: "2026-11-27T14:00:00+05:30",
      endDateStr: "2026-11-27T16:30:00+05:30",
      day: "Friday",
      dateFormatted: "27 Nov 2026",
      time: "2:00 PM - 4:30 PM",
      gap: "3 Days Gap (24, 25, 26 Nov)",
      accent: "#06B6D4",
      badge: "Slot B"
    },
    {
      id: "dlc",
      code: "PCCMT503",
      title: "Deep Learning Concepts",
      type: "Theory (Slot C)",
      slot: "C",
      dateStr: "2026-12-01T13:30:00+05:30",
      endDateStr: "2026-12-01T16:00:00+05:30",
      day: "Tuesday",
      dateFormatted: "01 Dec 2026",
      time: "1:30 PM - 4:00 PM",
      gap: "3 Days Gap (28, 29, 30 Nov)",
      accent: "#EC4899",
      badge: "Slot C"
    },
    {
      id: "cv",
      code: "PBCMS04",
      title: "Introduction to Computer Vision",
      type: "Theory (Slot D)",
      slot: "D",
      dateStr: "2026-12-03T13:30:00+05:30",
      endDateStr: "2026-12-03T16:00:00+05:30",
      day: "Thursday",
      dateFormatted: "03 Dec 2026",
      time: "1:30 PM - 4:00 PM",
      gap: "⚠️ Tight 1-Day Revision Gap (Only 2nd Dec available)",
      isTight: true,
      accent: "#F59E0B",
      badge: "Slot D"
    },
    {
      id: "spm",
      code: "PECST521",
      title: "Software Project Management",
      type: "Theory (Slot E)",
      slot: "E",
      dateStr: "2026-12-07T13:30:00+05:30",
      endDateStr: "2026-12-07T16:00:00+05:30",
      day: "Monday",
      dateFormatted: "07 Dec 2026",
      time: "1:30 PM - 4:00 PM",
      gap: "3 Days Gap (4, 5, 6 Dec)",
      accent: "#10B981",
      badge: "Slot E"
    }
  ]
};

// 1. Live Countdown Logic Targeting the true nearest exam (Lab Exam Nov 9th)
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
    
    // Nearest upcoming exam across both practical and theory
    let nextExam = EXAM_DATA.allExams.find(ex => new Date(ex.dateStr).getTime() > now);
    if (!nextExam) {
      nextExam = EXAM_DATA.allExams[0];
    }

    if (targetLabelEl) {
      targetLabelEl.textContent = `${nextExam.title}`;
    }
    if (targetDateEl) {
      targetDateEl.textContent = `${nextExam.day} • ${nextExam.dateFormatted} (${nextExam.time})`;
    }
    if (targetTypeEl) {
      targetTypeEl.textContent = nextExam.type.toUpperCase();
    }

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

// 2. Checklist State Handler
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

// 3. Google Calendar
function generateCalendarEvent(subjectId) {
  const exam = EXAM_DATA.allExams.find(e => e.id === subjectId);
  if (!exam) return;

  const title = encodeURIComponent(`KTU S5 Exam: ${exam.title} (${exam.code})`);
  const details = encodeURIComponent(`Type: ${exam.type}\nCandidate: Vimal J Mathew (Roll: 30, VIT24AM035)\nCollege: VISAT Engineering College, Elanji\nTime: ${exam.time}`);
  const location = encodeURIComponent("VISAT Engineering College, Elanji");
  
  const start = new Date(exam.dateStr).toISOString().replace(/-|:|\.\d\d\d/g,"");
  const end = new Date(exam.endDateStr).toISOString().replace(/-|:|\.\d\d\d/g,"");
  
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  window.open(gcalUrl, '_blank');
}

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initChecklist();
});
