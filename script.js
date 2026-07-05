const eventInfo = {
  title: "Lễ tốt nghiệp của Ngô Khánh Hoa",
  start: "2026-07-11T13:30:00+07:00",
  end: "2026-07-11T16:00:00+07:00",
  location: "Hội trường Ngụy Như Kon Tum, số 19 Lê Thánh Tông, phường Cửa Nam, Hà Nội",
};

const groupLabels = {
  friend: "Bạn bè",
  teacher: "Thầy cô",
  family: "Gia đình / người thân",
  guest: "Khách mời",
};

const thankYouNotesByGroup = {
  friend: [
    "{name}, cảm ơn bạn vì đã dành thời gian tới chung vui trong một ngày rất quan trọng của Khánh Hoa. Có bạn ở đó, ngày này chắc chắn sẽ nhiều tiếng cười hơn.",
    "Gửi {name}, cảm ơn bạn đã đi cùng Khánh Hoa qua một phần thanh xuân rất đẹp. Mong chúng ta sẽ có thật nhiều ảnh kỷ niệm trong ngày tốt nghiệp.",
    "{name} thân mến, cảm ơn bạn vì đã góp mặt trong ngày tốt nghiệp của Khánh Hoa. Sự hiện diện của bạn làm khoảnh khắc này ấm áp hơn rất nhiều.",
    "Cảm ơn {name} vì đã nhận lời mời này. Khánh Hoa rất vui khi được chia sẻ cột mốc tốt nghiệp cùng một người bạn đáng quý.",
  ],
  teacher: [
    "Kính gửi {name}, em xin chân thành cảm ơn thầy/cô đã dành thời gian tới chung vui trong ngày tốt nghiệp của em. Sự hiện diện của thầy/cô là niềm vinh dự và là lời động viên rất lớn với em.",
    "Kính gửi {name}, em rất trân trọng sự quan tâm và dìu dắt của thầy/cô trong hành trình học tập. Được đón thầy/cô trong ngày tốt nghiệp là một điều vô cùng ý nghĩa với em.",
    "Kính gửi {name}, em xin gửi lời cảm ơn sâu sắc vì thầy/cô đã góp mặt trong cột mốc quan trọng này. Sự hiện diện của thầy/cô giúp ngày tốt nghiệp của em thêm trang trọng và đáng nhớ.",
  ],
  family: [
    "{name}, con/em cảm ơn vì đã luôn ở bên, yêu thương và tin tưởng trong suốt hành trình này. Ngày tốt nghiệp sẽ trọn vẹn hơn rất nhiều khi có gia đình ở đó.",
    "Gửi {name}, cảm ơn vì đã là điểm tựa bình yên nhất trong những năm tháng học tập. Khoảnh khắc tốt nghiệp này cũng là niềm vui con/em muốn chia sẻ cùng gia đình.",
    "{name}, cảm ơn vì những yêu thương thầm lặng, những lần động viên và cả sự kiên nhẫn dành cho con/em. Sự có mặt của gia đình là món quà lớn nhất trong ngày này.",
  ],
  guest: [
    "{name}, cảm ơn bạn vì đã dành thời gian tới chung vui trong ngày tốt nghiệp của Khánh Hoa. Sự hiện diện của bạn là một món quà rất đáng quý.",
    "Gửi {name}, Khánh Hoa rất vui khi được đón bạn trong buổi lễ tốt nghiệp. Cảm ơn bạn đã góp thêm niềm vui cho một ngày thật đặc biệt.",
    "{name}, cảm ơn bạn đã nhận lời mời và cùng Khánh Hoa lưu lại cột mốc này. Mong chúng ta sẽ có một buổi chiều thật đẹp tại hội trường.",
  ],
};

const target = new Date(eventInfo.start);
const countdownFields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};
const toast = document.querySelector("#toast");
const guestbookKey = "khanh-hoa-graduation-guestbook";

function pad(value) {
  return String(value).padStart(2, "0");
}

function normalizeName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeGroup(value) {
  return Object.prototype.hasOwnProperty.call(groupLabels, value) ? value : "friend";
}

function getGroupNotes(group) {
  return thankYouNotesByGroup[normalizeGroup(group)];
}

function getRandomThankIndex(group) {
  return Math.floor(Math.random() * getGroupNotes(group).length);
}

function normalizeThankIndex(value, group) {
  const notes = getGroupNotes(group);
  const index = Number.parseInt(value, 10);

  if (Number.isInteger(index) && index >= 0 && index < notes.length) {
    return index;
  }

  return getRandomThankIndex(group);
}

function getThankYouNote(name, group, index) {
  const safeGroup = normalizeGroup(group);
  const notes = getGroupNotes(safeGroup);
  const safeIndex = normalizeThankIndex(index, safeGroup);
  return notes[safeIndex].replaceAll("{name}", name);
}

function updateCountdown() {
  const now = new Date();
  const distance = target.getTime() - now.getTime();

  if (distance <= 0) {
    countdownFields.days.textContent = "00";
    countdownFields.hours.textContent = "00";
    countdownFields.minutes.textContent = "00";
    countdownFields.seconds.textContent = "00";
    return;
  }

  const seconds = Math.floor(distance / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  countdownFields.days.textContent = pad(days);
  countdownFields.hours.textContent = pad(hours);
  countdownFields.minutes.textContent = pad(minutes);
  countdownFields.seconds.textContent = pad(remainingSeconds);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
}

function toCalendarUtc(dateString) {
  return new Date(dateString).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function getGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventInfo.title,
    dates: `${toCalendarUtc(eventInfo.start)}/${toCalendarUtc(eventInfo.end)}`,
    details: "Trân trọng mời bạn tới chung vui trong lễ tốt nghiệp của Ngô Khánh Hoa.",
    location: eventInfo.location,
    ctz: "Asia/Ho_Chi_Minh",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadCalendarInvite() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Graduation Invitation//Ngo Khanh Hoa//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}-ngo-khanh-hoa-graduation`,
    `DTSTAMP:${toCalendarUtc(new Date().toISOString())}`,
    `DTSTART:${toCalendarUtc(eventInfo.start)}`,
    `DTEND:${toCalendarUtc(eventInfo.end)}`,
    `SUMMARY:${eventInfo.title}`,
    `LOCATION:${eventInfo.location}`,
    "DESCRIPTION:Trân trọng mời bạn tới chung vui trong lễ tốt nghiệp của Ngô Khánh Hoa.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "le-tot-nghiep-ngo-khanh-hoa.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Đã tạo file lịch");
}

function buildInviteText() {
  return [
    "Trân trọng mời bạn tới chung vui trong lễ tốt nghiệp của Ngô Khánh Hoa.",
    "Thời gian: 13h30 - 16h00, Thứ bảy ngày 11 tháng 7 năm 2026.",
    `Địa điểm: ${eventInfo.location}.`,
  ].join("\n");
}

function buildPersonalInviteText(name, group, thankIndex) {
  return [
    `Trân trọng kính mời ${name} tới dự lễ tốt nghiệp của Ngô Khánh Hoa.`,
    "Thời gian: 13h30 - 16h00, Thứ bảy ngày 11 tháng 7 năm 2026.",
    `Địa điểm: ${eventInfo.location}.`,
    getThankYouNote(name, group, thankIndex),
  ].join("\n");
}

function getPersonalInviteUrl(name, group, thankIndex) {
  const url = new URL(window.location.href);
  url.searchParams.set("guest", name);
  url.searchParams.set("group", normalizeGroup(group));
  url.searchParams.set("thanks", String(thankIndex));
  return url.toString();
}

function setupMapAndCalendar() {
  const mapLink = document.querySelector("#mapLink");
  const mapToggleBtn = document.querySelector("#mapToggleBtn");
  const mapPanel = document.querySelector("#mapPanel");
  const mapFrame = document.querySelector("#mapFrame");
  const googleCalendarUrl = getGoogleCalendarUrl();
  const googleCalendarLink = document.querySelector("#googleCalendarLink");
  const eventGoogleCalendarLink = document.querySelector("#eventGoogleCalendarLink");
  const query = encodeURIComponent(eventInfo.location);

  mapLink.href = `https://www.google.com/maps/search/?api=1&query=${query}`;

  if (googleCalendarLink) {
    googleCalendarLink.href = googleCalendarUrl;
  }

  if (eventGoogleCalendarLink) {
    eventGoogleCalendarLink.href = googleCalendarUrl;
  }

  if (!mapToggleBtn || !mapPanel || !mapFrame) {
    return;
  }

  const embedUrl = `https://www.google.com/maps?q=${query}&output=embed`;

  mapToggleBtn.addEventListener("click", () => {
    const isOpening = mapPanel.hidden;
    mapPanel.hidden = !isOpening;
    mapToggleBtn.setAttribute("aria-expanded", String(isOpening));
    mapToggleBtn.textContent = isOpening ? "Ẩn bản đồ" : "Bật bản đồ";

    if (isOpening) {
      if (!mapFrame.src) {
        mapFrame.src = embedUrl;
      }
      mapPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

function updateGuestUrl(name, group, thankIndex) {
  window.history.replaceState({}, "", getPersonalInviteUrl(name, group, thankIndex));
}

function syncGuestInputs(name, group) {
  const guestNameInput = document.querySelector("#guestName");
  const heroGuestNameInput = document.querySelector("#heroGuestName");
  const guestGroupInput = document.querySelector("#guestGroup");
  const heroGuestGroupInput = document.querySelector("#heroGuestGroup");

  if (guestNameInput) {
    guestNameInput.value = name;
  }

  if (heroGuestNameInput) {
    heroGuestNameInput.value = name;
  }

  if (guestGroupInput) {
    guestGroupInput.value = group;
  }

  if (heroGuestGroupInput) {
    heroGuestGroupInput.value = group;
  }
}

function renderPersonalCard(name, options = {}) {
  const guestName = normalizeName(name);
  const group = normalizeGroup(options.group);
  const thankIndex = normalizeThankIndex(options.thankIndex, group);
  const card = document.querySelector("#personalCard");
  const cardGuestName = document.querySelector("#cardGuestName");
  const cardInviteText = document.querySelector("#cardInviteText");
  const thankYouText = document.querySelector("#thankYouText");

  if (!guestName) {
    showToast("Bạn nhập họ tên trước nhé");
    return;
  }

  cardGuestName.textContent = guestName;
  cardInviteText.textContent = `Tới chung vui trong lễ tốt nghiệp của Ngô Khánh Hoa. Thiệp này được gửi riêng tới ${guestName}.`;
  thankYouText.textContent = getThankYouNote(guestName, group, thankIndex);
  card.dataset.guestName = guestName;
  card.dataset.group = group;
  card.dataset.thankIndex = String(thankIndex);
  card.hidden = false;
  card.classList.add("reveal", "visible");
  syncGuestInputs(guestName, group);

  if (options.updateUrl !== false) {
    updateGuestUrl(guestName, group, thankIndex);
  }

  if (options.confetti !== false) {
    launchConfetti();
  }
}

function setupRsvp() {
  const form = document.querySelector("#rsvpForm");
  const guestNameInput = document.querySelector("#guestName");
  const guestGroupInput = document.querySelector("#guestGroup");
  const heroForm = document.querySelector("#heroRsvpForm");
  const heroGuestNameInput = document.querySelector("#heroGuestName");
  const heroGuestGroupInput = document.querySelector("#heroGuestGroup");
  const copyInviteBtn = document.querySelector("#copyInviteBtn");
  const calendarBtn = document.querySelector("#calendarBtn");
  const copyPersonalBtn = document.querySelector("#copyPersonalBtn");
  const copyPersonalLinkBtn = document.querySelector("#copyPersonalLinkBtn");
  const printCardBtn = document.querySelector("#printCardBtn");
  const personalCard = document.querySelector("#personalCard");
  const closePersonalCardBtn = document.querySelector("#closePersonalCardBtn");

  function closePersonalCard() {
    personalCard.hidden = true;
  }

  copyInviteBtn.addEventListener("click", async () => {
    await copyText(buildInviteText());
    showToast("Đã sao chép lời mời");
  });

  calendarBtn.addEventListener("click", downloadCalendarInvite);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderPersonalCard(guestNameInput.value, { group: guestGroupInput.value });
  });

  heroForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderPersonalCard(heroGuestNameInput.value, { group: heroGuestGroupInput.value });
  });

  copyPersonalBtn.addEventListener("click", async () => {
    const name = personalCard.dataset.guestName;
    if (!name) {
      showToast("Bạn tạo thiệp trước nhé");
      return;
    }

    const group = normalizeGroup(personalCard.dataset.group);
    const thankIndex = normalizeThankIndex(personalCard.dataset.thankIndex, group);
    await copyText(buildPersonalInviteText(name, group, thankIndex));
    showToast("Đã sao chép thiệp mời");
  });

  copyPersonalLinkBtn.addEventListener("click", async () => {
    const name = personalCard.dataset.guestName;
    if (!name) {
      showToast("Bạn tạo thiệp trước nhé");
      return;
    }

    const group = normalizeGroup(personalCard.dataset.group);
    const thankIndex = normalizeThankIndex(personalCard.dataset.thankIndex, group);
    await copyText(getPersonalInviteUrl(name, group, thankIndex));
    showToast("Đã sao chép link thiệp");
  });

  printCardBtn.addEventListener("click", () => {
    window.print();
  });

  closePersonalCardBtn.addEventListener("click", closePersonalCard);
  personalCard.addEventListener("click", (event) => {
    if (event.target === personalCard) {
      closePersonalCard();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !personalCard.hidden) {
      closePersonalCard();
    }
  });

  const params = new URLSearchParams(window.location.search);
  const guestFromUrl = normalizeName(params.get("guest"));
  if (guestFromUrl) {
    const group = normalizeGroup(params.get("group"));
    const thankParam = params.get("thanks");
    const thankIndex = normalizeThankIndex(thankParam, group);
    renderPersonalCard(guestFromUrl, {
      group,
      thankIndex,
      scroll: false,
      updateUrl: thankParam === null || !params.get("group"),
      confetti: false,
    });
  }
}

function setupYearTimeline() {
  const tabs = Array.from(document.querySelectorAll(".year-tab"));
  const panels = Array.from(document.querySelectorAll(".year-block[data-year]"));

  if (!tabs.length || !panels.length) {
    return;
  }

  function activateYear(year) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.yearTarget === year;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.year === year;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));

      if (isActive) {
        panel.classList.add("visible");
      }
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateYear(tab.dataset.yearTarget));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + step + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      activateYear(tabs[nextIndex].dataset.yearTarget);
    });
  });

  activateYear(tabs.find((tab) => tab.classList.contains("is-active"))?.dataset.yearTarget || tabs[0].dataset.yearTarget);
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 },
  );

  elements.forEach((element) => observer.observe(element));
}

function setupMilestoneToggle() {
  const toggle = document.querySelector("#milestoneToggle");
  const panel = document.querySelector("#milestonePanel");

  if (!toggle || !panel) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpening = panel.hidden;
    panel.hidden = !isOpening;
    toggle.setAttribute("aria-expanded", String(isOpening));
    toggle.textContent = isOpening ? "Ẩn mốc học bổng" : "Xem mốc học bổng";

    if (isOpening) {
      panel.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

function setupLightbox() {
  const lightbox = document.querySelector("#lightbox");
  const image = document.querySelector("#lightboxImage");
  const caption = document.querySelector("#lightboxCaption");
  const closeBtn = document.querySelector("#lightboxClose");
  const prevBtn = document.querySelector("#lightboxPrev");
  const nextBtn = document.querySelector("#lightboxNext");
  const images = Array.from(
    document.querySelectorAll(".enrollment-media img, .year-card img, .memory-card img, .milestone-card img"),
  );
  let currentIndex = 0;

  function getCaption(source) {
    const figureCaption = source.closest("figure")?.querySelector("figcaption")?.textContent.trim();
    const cardTitle = source.closest("article")?.querySelector("h3")?.textContent.trim();
    return source.dataset.caption || figureCaption || cardTitle || source.alt || "";
  }

  function open(index) {
    currentIndex = index;
    const source = images[currentIndex];
    image.src = source.currentSrc || source.src;
    image.alt = source.alt || "";
    caption.textContent = getCaption(source);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.hidden = true;
    image.removeAttribute("src");
    document.body.style.overflow = "";
  }

  function move(step) {
    const nextIndex = (currentIndex + step + images.length) % images.length;
    open(nextIndex);
  }

  images.forEach((item, index) => {
    item.style.cursor = "zoom-in";
    item.addEventListener("click", () => open(index));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => move(-1));
  nextBtn.addEventListener("click", () => move(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      close();
    } else if (event.key === "ArrowLeft") {
      move(-1);
    } else if (event.key === "ArrowRight") {
      move(1);
    }
  });
}

function getGuestbookEntries() {
  try {
    const entries = JSON.parse(localStorage.getItem(guestbookKey) || "[]");
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

function saveGuestbookEntries(entries) {
  localStorage.setItem(guestbookKey, JSON.stringify(entries.slice(0, 20)));
}

function renderGuestbook() {
  const list = document.querySelector("#guestbookList");
  const entries = getGuestbookEntries();

  if (!entries.length) {
    list.innerHTML = '<p class="guestbook-empty">Chưa có lời nhắn nào. Hãy là người đầu tiên viết vào sổ lưu bút.</p>';
    return;
  }

  list.innerHTML = entries
    .map((entry) => {
      const date = new Date(entry.createdAt).toLocaleDateString("vi-VN");
      return `
        <article class="guestbook-note">
          <strong>${escapeHtml(entry.name)}</strong>
          <p>${escapeHtml(entry.message)}</p>
          <time>${date}</time>
        </article>
      `;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setupGuestbook() {
  const form = document.querySelector("#guestbookForm");
  const nameInput = document.querySelector("#guestbookName");
  const messageInput = document.querySelector("#guestbookMessage");

  renderGuestbook();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = normalizeName(nameInput.value);
    const message = String(messageInput.value || "").trim();

    if (!name || !message) {
      showToast("Bạn nhập đủ tên và lời nhắn nhé");
      return;
    }

    const entries = getGuestbookEntries();
    entries.unshift({ name, message, createdAt: new Date().toISOString() });
    saveGuestbookEntries(entries);
    form.reset();
    renderGuestbook();
    launchConfetti();
    showToast("Đã lưu lời nhắn");
  });
}

const musicState = {
  context: null,
  timer: null,
  isPlaying: false,
};

function playSoftNote(frequency, delay = 0, duration = 1.8, volume = 0.034) {
  const context = musicState.context;
  const start = context.currentTime + delay;
  const end = start + duration;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, end);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.08);
}

function scheduleMusicPhrase() {
  const melody = [392, 494, 587, 659, 740, 659, 587, 494, 440, 392];

  melody.forEach((frequency, index) => {
    const delay = index * 0.36;
    playSoftNote(frequency, delay, 1.7, index % 4 === 0 ? 0.038 : 0.03);

    if (index % 3 === 0) {
      playSoftNote(frequency / 2, delay + 0.04, 2.05, 0.014);
    }
  });
}

function setupMusic() {
  const button = document.querySelector("#musicToggle");

  button.addEventListener("click", async () => {
    if (musicState.isPlaying) {
      window.clearInterval(musicState.timer);
      musicState.timer = null;
      musicState.isPlaying = false;
      button.setAttribute("aria-pressed", "false");
      button.textContent = "Nhạc nền";
      if (musicState.context) {
        await musicState.context.close();
        musicState.context = null;
      }
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      showToast("Trình duyệt không hỗ trợ nhạc nền");
      return;
    }

    musicState.context = new AudioContext();
    scheduleMusicPhrase();
    musicState.timer = window.setInterval(scheduleMusicPhrase, 5200);
    musicState.isPlaying = true;
    button.setAttribute("aria-pressed", "true");
    button.textContent = "Tắt nhạc";
  });
}

function launchConfetti() {
  const canvas = document.querySelector("#confettiCanvas");
  const context = canvas.getContext("2d");
  const colors = ["#720007", "#c2923f", "#0e5964", "#fffdf8"];
  const pieces = Array.from({ length: 42 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.35,
    size: 6 + Math.random() * 8,
    speed: 2 + Math.random() * 4,
    drift: -1.5 + Math.random() * 3,
    rotation: Math.random() * Math.PI,
    spin: -0.12 + Math.random() * 0.24,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  const startedAt = performance.now();

  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  function frame(now) {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.rotation += piece.spin;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotation);
      context.fillStyle = piece.color;
      context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
      context.restore();
    });

    if (now - startedAt < 1100) {
      requestAnimationFrame(frame);
    } else {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  requestAnimationFrame(frame);
}

updateCountdown();
setupMapAndCalendar();
setupRsvp();
setupYearTimeline();
setupReveal();
setupMilestoneToggle();
setupLightbox();
setupGuestbook();
setupMusic();
setInterval(updateCountdown, 1000);
