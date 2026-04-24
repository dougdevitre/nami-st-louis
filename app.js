document.addEventListener("DOMContentLoaded", () => {

  // ── Module definitions ──
  const MODULES = [
    { id: "programs", label: "Programs" },
    { id: "calendar", label: "Calendar" },
    { id: "volunteers", label: "Volunteers" },
    { id: "resources", label: "Resources" },
    { id: "safetyplan", label: "Safety plan" },
    { id: "coping", label: "Coping tools" },
    { id: "community", label: "Community" },
    { id: "policy", label: "Policy" },
  ];

  const moduleNav = document.getElementById("module-nav");
  const moduleContainer = document.getElementById("modules");

  // Seed sample data on first load
  seedSampleData();

  // Build module tabs
  MODULES.forEach((m) => {
    const btn = document.createElement("button");
    btn.className = "mod-btn";
    btn.textContent = m.label;
    btn.dataset.mod = m.id;
    btn.addEventListener("click", () => showModule(m.id));
    moduleNav.appendChild(btn);
  });

  // Build module panels
  MODULES.forEach((m) => {
    const div = document.createElement("div");
    div.className = "module";
    div.id = `mod-${m.id}`;
    moduleContainer.appendChild(div);
  });

  // ── Routing ──
  function getRoute() {
    const h = location.hash.replace("#", "") || "programs";
    const parts = h.split("/");
    return { module: parts[0], sub: parts[1] || null };
  }

  function showModule(id, sub) {
    const panel = document.getElementById(`mod-${id}`);
    if (!panel) return;
    if (!sub) location.hash = id;
    document.querySelectorAll(".module").forEach((m) => m.classList.remove("visible"));
    document.querySelectorAll(".mod-btn").forEach((b) => b.classList.remove("active"));
    panel.classList.add("visible");
    renderModule(id, sub);
    document.querySelectorAll(".mod-btn").forEach((b) => b.removeAttribute("aria-current"));
    const btn = document.querySelector(`.mod-btn[data-mod="${id}"]`);
    if (btn) { btn.classList.add("active"); btn.setAttribute("aria-current", "page"); }
  }

  window.addEventListener("hashchange", () => {
    const r = getRoute();
    showModule(r.module, r.sub);
  });

  // ── Render dispatcher ──
  function renderModule(id, sub) {
    const panel = document.getElementById(`mod-${id}`);
    switch (id) {
      case "programs": renderPrograms(panel); break;
      case "calendar": renderCalendar(panel); break;
      case "volunteers": renderVolunteers(panel); break;
      case "resources": renderResources(panel); break;
      case "safetyplan": renderSafetyPlan(panel, sub); break;
      case "coping": renderCoping(panel, sub); break;
      case "community": renderCommunity(panel); break;
      case "policy": renderPolicy(panel, sub); break;
    }
  }

  // ════════════════════════════════════════
  //  PROGRAMS MODULE
  // ════════════════════════════════════════
  function renderPrograms(el) {
    let html = `<div class="sec-hdr"><h2>Programs and services</h2>
      <p>Free education, support, and advocacy programs offered by NAMI St. Louis. Click any program for full details.</p></div>`;
    html += `<div class="program-grid">`;
    PROGRAMS_DATA.forEach((p) => {
      const colorVar = `--tag-${p.color === "red" ? "danger" : p.color === "green" ? "success" : p.color === "amber" ? "warn" : p.color}-tx`;
      html += `<div class="program-card" onclick="showProgramDetail('${p.id}')">
        <div class="program-cat" style="color: var(${colorVar})">${p.category}</div>
        <div class="program-name">${p.name}</div>
        <div class="program-summary">${p.summary}</div>
        <div class="program-tags">${p.tags.map((t) => `<span class="program-tag">${t}</span>`).join("")}</div>
      </div>`;
    });
    html += `</div>`;
    el.innerHTML = html;
  }

  // Program detail overlay
  window.showProgramDetail = function (id) {
    const p = PROGRAMS_DATA.find((x) => x.id === id);
    if (!p) return;
    let overlay = document.getElementById("detail-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "detail-overlay";
      overlay.className = "detail-overlay";
      overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div class="detail-panel">
      <button class="detail-close" onclick="document.getElementById('detail-overlay').classList.remove('open')">&times;</button>
      <div class="program-cat" style="color: var(--tag-${p.color === "red" ? "danger" : p.color === "green" ? "success" : p.color === "amber" ? "warn" : p.color}-tx); margin-bottom: 4px;">${p.category}</div>
      <h3 style="font-size: 19px; font-weight: 600; margin-bottom: 12px;">${p.name}</h3>
      <p style="font-size: 14px; color: var(--tx-1); line-height: 1.6; margin-bottom: 16px;">${p.description}</p>
      <hr class="divider">
      <div class="detail-row"><div class="detail-key">Audience</div><div class="detail-val">${p.audience}</div></div>
      <div class="detail-row"><div class="detail-key">Format</div><div class="detail-val">${p.format}</div></div>
      <div class="detail-row"><div class="detail-key">Cost</div><div class="detail-val">${p.cost}</div></div>
      <div class="detail-row"><div class="detail-key">Registration</div><div class="detail-val">${p.registration}</div></div>
      <div class="detail-row"><div class="detail-key">Contact</div><div class="detail-val">${p.contact}</div></div>
    </div>`;
    overlay.classList.add("open");
  };

  // ════════════════════════════════════════
  //  CALENDAR MODULE
  // ════════════════════════════════════════
  let calDate = new Date();

  function renderCalendar(el) {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const monthName = calDate.toLocaleString("default", { month: "long", year: "numeric" });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const events = Store.get("events") || [];

    let html = `<div class="sec-hdr"><h2>Community calendar</h2>
      <p>Events, meetings, trainings, and activities. Add events to share with the community.</p></div>`;

    html += `<div class="cal-controls">
      <button class="cal-btn" onclick="calNav(-1)">&larr;</button>
      <span class="cal-month">${monthName}</span>
      <button class="cal-btn" onclick="calNav(1)">&rarr;</button>
      <div style="flex:1"></div>
      <button class="cal-btn primary" onclick="openEventForm()">+ Add event</button>
    </div>`;

    html += `<div class="cal-grid">`;
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((d) => {
      html += `<div class="cal-day-hdr">${d}</div>`;
    });

    // Previous month padding
    const prevDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="cal-cell other-month"><span class="cal-num">${prevDays - i}</span></div>`;
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const dayEvents = events.filter((e) => e.date === dateStr);
      html += `<div class="cal-cell${isToday ? " today" : ""}" onclick="openEventForm('${dateStr}')">
        <span class="cal-num">${d}</span>`;
      dayEvents.slice(0, 2).forEach((ev) => {
        html += `<div class="cal-event ${ev.type}" title="${esc(ev.title)}" onclick="event.stopPropagation(); showEventDetail('${ev.id}')">${esc(ev.title)}</div>`;
      });
      if (dayEvents.length > 2) {
        html += `<div style="font-size:10px; color:var(--tx-2);">+${dayEvents.length - 2} more</div>`;
      }
      html += `</div>`;
    }

    // Next month padding
    const totalCells = firstDay + daysInMonth;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
      html += `<div class="cal-cell other-month"><span class="cal-num">${i}</span></div>`;
    }
    html += `</div>`;

    // Upcoming events list
    const upcoming = events
      .filter((e) => e.date >= today.toISOString().slice(0, 10))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 8);

    if (upcoming.length) {
      html += `<div class="sec-hdr"><h3>Upcoming events</h3></div><div class="card-stack">`;
      upcoming.forEach((ev) => {
        const d = new Date(ev.date + "T12:00:00");
        const dateLabel = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        html += `<div class="card" style="cursor:pointer" onclick="showEventDetail('${ev.id}')">
          <div style="display:flex; justify-content:space-between; align-items:center">
            <div>
              <div class="card-title" style="margin-bottom:2px">${esc(ev.title)}</div>
              <div style="font-size:12px; color:var(--tx-2)">${dateLabel}${ev.time ? " at " + esc(ev.time) : ""} &middot; ${ev.type}</div>
            </div>
            <span class="cal-event ${ev.type}" style="white-space:nowrap">${ev.type}</span>
          </div>
          ${ev.description ? `<div style="font-size:13px; color:var(--tx-1); margin-top:6px">${esc(ev.description)}</div>` : ""}
        </div>`;
      });
      html += `</div>`;
    }

    el.innerHTML = html;
  }

  window.calNav = function (dir) {
    calDate.setMonth(calDate.getMonth() + dir);
    renderCalendar(document.getElementById("mod-calendar"));
  };

  window.openEventForm = function (prefillDate) {
    let overlay = document.getElementById("form-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "form-overlay";
      overlay.className = "form-overlay";
      overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
      document.body.appendChild(overlay);
    }
    const dateVal = prefillDate || new Date().toISOString().slice(0, 10);
    overlay.innerHTML = `<div class="form-panel">
      <button class="detail-close" onclick="document.getElementById('form-overlay').classList.remove('open')">&times;</button>
      <div class="form-title">Add event</div>
      <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="ev-title" placeholder="Event name" /></div>
      <div class="form-group"><label class="form-label">Date</label><input class="form-input" id="ev-date" type="date" value="${dateVal}" /></div>
      <div class="form-group"><label class="form-label">Time (optional)</label><input class="form-input" id="ev-time" type="time" /></div>
      <div class="form-group"><label class="form-label">Type</label>
        <select class="form-select" id="ev-type">
          <option value="meeting">Meeting</option>
          <option value="support">Support group</option>
          <option value="training">Training / education</option>
          <option value="fundraiser">Fundraiser</option>
          <option value="volunteer">Volunteer event</option>
          <option value="other">Other</option>
        </select></div>
      <div class="form-group"><label class="form-label">Location (optional)</label><input class="form-input" id="ev-location" placeholder="Address or virtual link" /></div>
      <div class="form-group"><label class="form-label">Description (optional)</label><textarea class="form-textarea" id="ev-desc" placeholder="Details about this event..."></textarea></div>
      <div class="form-group"><label class="form-label">Your name</label><input class="form-input" id="ev-author" placeholder="Name" /></div>
      <div class="form-actions">
        <button class="cal-btn" onclick="document.getElementById('form-overlay').classList.remove('open')">Cancel</button>
        <button class="cal-btn primary" onclick="saveEvent()">Save event</button>
      </div>
    </div>`;
    overlay.classList.add("open");
    setTimeout(() => document.getElementById("ev-title").focus(), 100);
  };

  window.saveEvent = function () {
    const title = document.getElementById("ev-title").value.trim();
    const date = document.getElementById("ev-date").value;
    if (!title || !date) { toast("Please enter a title and date."); return; }
    const ev = {
      id: Store.uid(),
      title,
      date,
      time: document.getElementById("ev-time").value || "",
      type: document.getElementById("ev-type").value,
      location: document.getElementById("ev-location").value.trim(),
      description: document.getElementById("ev-desc").value.trim(),
      author: document.getElementById("ev-author").value.trim() || "Community member",
      created: new Date().toISOString(),
    };
    Store.push("events", ev);
    document.getElementById("form-overlay").classList.remove("open");
    renderCalendar(document.getElementById("mod-calendar"));
    toast("Event added to the community calendar.");
  };

  window.showEventDetail = function (id) {
    const events = Store.get("events") || [];
    const ev = events.find((e) => e.id === id);
    if (!ev) return;
    let overlay = document.getElementById("detail-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "detail-overlay";
      overlay.className = "detail-overlay";
      overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
      document.body.appendChild(overlay);
    }
    const d = new Date(ev.date + "T12:00:00");
    const dateLabel = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    overlay.innerHTML = `<div class="detail-panel">
      <button class="detail-close" onclick="document.getElementById('detail-overlay').classList.remove('open')">&times;</button>
      <span class="cal-event ${ev.type}" style="margin-bottom:8px; display:inline-block">${ev.type}</span>
      <h3 style="font-size:19px; font-weight:600; margin-bottom:12px">${esc(ev.title)}</h3>
      <div class="detail-row"><div class="detail-key">Date</div><div class="detail-val">${dateLabel}</div></div>
      ${ev.time ? `<div class="detail-row"><div class="detail-key">Time</div><div class="detail-val">${ev.time}</div></div>` : ""}
      ${ev.location ? `<div class="detail-row"><div class="detail-key">Location</div><div class="detail-val">${esc(ev.location)}</div></div>` : ""}
      ${ev.description ? `<div style="margin-top:12px; font-size:14px; color:var(--tx-1); line-height:1.6">${esc(ev.description)}</div>` : ""}
      <hr class="divider">
      <div style="font-size:12px; color:var(--tx-2)">Posted by ${esc(ev.author)}</div>
      <div class="form-actions" style="margin-top:12px">
        <button class="cal-btn" style="color:var(--tag-danger-tx)" onclick="deleteEvent('${ev.id}')">Remove event</button>
      </div>
    </div>`;
    overlay.classList.add("open");
  };

  window.deleteEvent = function (id) {
    Store.removeById("events", id);
    document.getElementById("detail-overlay").classList.remove("open");
    renderCalendar(document.getElementById("mod-calendar"));
    toast("Event removed.");
  };

  // ════════════════════════════════════════
  //  VOLUNTEERS MODULE
  // ════════════════════════════════════════
  function renderVolunteers(el) {
    const opps = Store.get("volunteer_opps") || [];
    let html = `<div class="sec-hdr"><h2>Volunteer opportunities</h2>
      <p>Find ways to give your time — or post a need for your program or event.</p></div>`;
    html += `<div style="margin-bottom:1.25rem"><button class="cal-btn primary" onclick="openVolunteerForm()">+ Post volunteer need</button></div>`;

    if (opps.length === 0) {
      html += `<div class="empty-state"><div class="empty-icon">&#9734;</div>No volunteer opportunities posted yet.<br>Click above to add one.</div>`;
    } else {
      opps.sort((a, b) => (a.date || "").localeCompare(b.date || "")).forEach((v) => {
        const signups = (Store.get(`vol_signups_${v.id}`) || []);
        const spotsLeft = v.spots - signups.length;
        html += `<div class="vol-card">
          <div class="vol-header">
            <div>
              <div class="vol-title">${esc(v.title)}</div>
              <div class="vol-meta">${v.date ? new Date(v.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Ongoing"}${v.time ? " at " + esc(v.time) : ""} &middot; ${esc(v.program)}</div>
            </div>
            <span class="vol-spots ${spotsLeft > 0 ? "open" : "full"}">${spotsLeft > 0 ? spotsLeft + " spots" : "Full"}</span>
          </div>
          <div class="vol-body">${esc(v.description)}</div>
          ${v.location ? `<div style="font-size:12px; color:var(--tx-2); margin-top:4px">Location: ${esc(v.location)}</div>` : ""}
          ${spotsLeft > 0 ? `<div class="vol-signup"><button class="cal-btn" onclick="openSignupForm('${v.id}')">Sign up</button></div>` : ""}
          <div style="margin-top:8px; font-size:11px; color:var(--tx-2)">
            ${signups.length} signed up &middot; Contact: ${esc(v.contact)}
            <button class="cal-btn" style="font-size:11px; padding:2px 8px; margin-left:6px; color:var(--tag-danger-tx)" onclick="deleteVolOpp('${v.id}')">Remove</button>
          </div>
        </div>`;
      });
    }
    el.innerHTML = html;
  }

  window.openVolunteerForm = function () {
    let overlay = document.getElementById("form-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "form-overlay";
      overlay.className = "form-overlay";
      overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div class="form-panel">
      <button class="detail-close" onclick="document.getElementById('form-overlay').classList.remove('open')">&times;</button>
      <div class="form-title">Post volunteer need</div>
      <div class="form-group"><label class="form-label">Opportunity title</label><input class="form-input" id="vol-title" placeholder="What do you need help with?" /></div>
      <div class="form-group"><label class="form-label">Program or event</label><input class="form-input" id="vol-program" placeholder="e.g. NAMIWalks, Peer-to-Peer" /></div>
      <div class="form-group"><label class="form-label">Date (optional)</label><input class="form-input" id="vol-date" type="date" /></div>
      <div class="form-group"><label class="form-label">Time (optional)</label><input class="form-input" id="vol-time" type="time" /></div>
      <div class="form-group"><label class="form-label">Location (optional)</label><input class="form-input" id="vol-location" placeholder="Address or virtual" /></div>
      <div class="form-group"><label class="form-label">Spots needed</label><input class="form-input" id="vol-spots" type="number" min="1" value="5" /></div>
      <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="vol-desc" placeholder="Describe the volunteer role and what's needed..."></textarea></div>
      <div class="form-group"><label class="form-label">Contact name / email</label><input class="form-input" id="vol-contact" placeholder="How should volunteers reach you?" /></div>
      <div class="form-actions">
        <button class="cal-btn" onclick="document.getElementById('form-overlay').classList.remove('open')">Cancel</button>
        <button class="cal-btn primary" onclick="saveVolOpp()">Post opportunity</button>
      </div>
    </div>`;
    overlay.classList.add("open");
  };

  window.saveVolOpp = function () {
    const title = document.getElementById("vol-title").value.trim();
    if (!title) { toast("Please enter a title."); return; }
    const opp = {
      id: Store.uid(),
      title,
      program: document.getElementById("vol-program").value.trim() || "General",
      date: document.getElementById("vol-date").value || "",
      time: document.getElementById("vol-time").value || "",
      location: document.getElementById("vol-location").value.trim(),
      spots: parseInt(document.getElementById("vol-spots").value) || 5,
      description: document.getElementById("vol-desc").value.trim(),
      contact: document.getElementById("vol-contact").value.trim() || "NAMI STL",
      created: new Date().toISOString(),
    };
    Store.push("volunteer_opps", opp);
    document.getElementById("form-overlay").classList.remove("open");
    renderVolunteers(document.getElementById("mod-volunteers"));
    toast("Volunteer opportunity posted.");
  };

  window.openSignupForm = function (oppId) {
    let overlay = document.getElementById("form-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "form-overlay";
      overlay.className = "form-overlay";
      overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div class="form-panel">
      <button class="detail-close" onclick="document.getElementById('form-overlay').classList.remove('open')">&times;</button>
      <div class="form-title">Volunteer sign-up</div>
      <div class="form-group"><label class="form-label">Your name</label><input class="form-input" id="signup-name" placeholder="Name" /></div>
      <div class="form-group"><label class="form-label">Email or phone</label><input class="form-input" id="signup-contact" placeholder="How to reach you" /></div>
      <div class="form-group"><label class="form-label">Note (optional)</label><textarea class="form-textarea" id="signup-note" placeholder="Anything the organizer should know..."></textarea></div>
      <div class="form-actions">
        <button class="cal-btn" onclick="document.getElementById('form-overlay').classList.remove('open')">Cancel</button>
        <button class="cal-btn primary" onclick="saveSignup('${oppId}')">Sign up</button>
      </div>
    </div>`;
    overlay.classList.add("open");
  };

  window.saveSignup = function (oppId) {
    const name = document.getElementById("signup-name").value.trim();
    if (!name) { toast("Please enter your name."); return; }
    const signup = {
      id: Store.uid(),
      name,
      contact: document.getElementById("signup-contact").value.trim(),
      note: document.getElementById("signup-note").value.trim(),
      created: new Date().toISOString(),
    };
    Store.push(`vol_signups_${oppId}`, signup);
    document.getElementById("form-overlay").classList.remove("open");
    renderVolunteers(document.getElementById("mod-volunteers"));
    toast("You're signed up! The organizer will follow up.");
  };

  window.deleteVolOpp = function (id) {
    Store.removeById("volunteer_opps", id);
    Store.delete(`vol_signups_${id}`);
    renderVolunteers(document.getElementById("mod-volunteers"));
    toast("Volunteer opportunity removed.");
  };

  // ════════════════════════════════════════
  //  RESOURCES MODULE
  // ════════════════════════════════════════
  function renderResources(el) {
    let html = `<div class="sec-hdr"><h2>Mental health resources</h2>
      <p>Crisis support, treatment providers, housing, legal aid, insurance navigation, and family support — curated for the St. Louis region and Missouri.</p></div>`;

    Object.keys(RESOURCES_DATA).forEach((key) => {
      const section = RESOURCES_DATA[key];
      html += `<div class="res-section">
        <div class="res-section-title">${section.title}</div>
        <div class="res-list">`;
      section.items.forEach((item) => {
        html += `<a class="res-item${item.urgent ? " urgent" : ""}" href="${item.url}" target="_blank" rel="noopener noreferrer">
          <div>
            <div class="res-name">${item.name}</div>
            <div class="res-detail">${item.detail}</div>
          </div>
          <span class="res-arrow">&rarr;</span>
        </a>`;
      });
      html += `</div></div>`;
    });
    el.innerHTML = html;
  }

  // ════════════════════════════════════════
  //  COMMUNITY BOARD MODULE
  // ════════════════════════════════════════
  function renderCommunity(el) {
    const posts = Store.get("posts") || [];
    let html = `<div class="sec-hdr"><h2>Community board</h2>
      <p>Share announcements, stories, questions, and resources with the NAMI St. Louis community.</p></div>`;
    html += `<div style="margin-bottom:1.25rem"><button class="cal-btn primary" onclick="openPostForm()">+ New post</button></div>`;

    if (posts.length === 0) {
      html += `<div class="empty-state"><div class="empty-icon">&#9998;</div>No posts yet. Be the first to share.</div>`;
    } else {
      const sorted = [...posts].sort((a, b) => b.created.localeCompare(a.created));
      sorted.forEach((p) => {
        const ago = timeAgo(p.created);
        html += `<div class="post-card">
          <div style="display:flex; align-items:center; flex-wrap:wrap">
            <span class="post-author">${esc(p.author)}</span>
            <span class="post-time">${ago}</span>
            <span class="post-type-tag ${p.type}">${p.type}</span>
          </div>
          ${p.title ? `<div style="font-size:15px; font-weight:600; margin-top:6px">${esc(p.title)}</div>` : ""}
          <div class="post-body">${esc(p.body)}</div>
          <div class="post-actions">
            <button class="post-action" onclick="deletePost('${p.id}')">remove</button>
          </div>
        </div>`;
      });
    }
    el.innerHTML = html;
  }

  window.openPostForm = function () {
    let overlay = document.getElementById("form-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "form-overlay";
      overlay.className = "form-overlay";
      overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div class="form-panel">
      <button class="detail-close" onclick="document.getElementById('form-overlay').classList.remove('open')">&times;</button>
      <div class="form-title">New post</div>
      <div class="form-group"><label class="form-label">Type</label>
        <select class="form-select" id="post-type">
          <option value="announcement">Announcement</option>
          <option value="story">Story / experience</option>
          <option value="question">Question</option>
          <option value="resource">Resource to share</option>
        </select></div>
      <div class="form-group"><label class="form-label">Title (optional)</label><input class="form-input" id="post-title" placeholder="Subject or headline" /></div>
      <div class="form-group"><label class="form-label">Message</label><textarea class="form-textarea" id="post-body" placeholder="Share with the community..." style="min-height:120px"></textarea></div>
      <div class="form-group"><label class="form-label">Your name</label><input class="form-input" id="post-author" placeholder="Name or alias" /></div>
      <div class="form-actions">
        <button class="cal-btn" onclick="document.getElementById('form-overlay').classList.remove('open')">Cancel</button>
        <button class="cal-btn primary" onclick="savePost()">Post</button>
      </div>
    </div>`;
    overlay.classList.add("open");
  };

  window.savePost = function () {
    const body = document.getElementById("post-body").value.trim();
    if (!body) { toast("Please write a message."); return; }
    const post = {
      id: Store.uid(),
      type: document.getElementById("post-type").value,
      title: document.getElementById("post-title").value.trim(),
      body,
      author: document.getElementById("post-author").value.trim() || "Anonymous",
      created: new Date().toISOString(),
    };
    Store.push("posts", post);
    document.getElementById("form-overlay").classList.remove("open");
    renderCommunity(document.getElementById("mod-community"));
    toast("Post shared with the community.");
  };

  window.deletePost = function (id) {
    Store.removeById("posts", id);
    renderCommunity(document.getElementById("mod-community"));
    toast("Post removed.");
  };

  // ════════════════════════════════════════
  //  POLICY MODULE (from previous build)
  // ════════════════════════════════════════
  function renderPolicy(el, activeSub) {
    const keys = Object.keys(POLICY_DATA);
    const activeKey = keys.includes(activeSub) ? activeSub : keys[0];

    let html = `<div class="sec-hdr"><h2>Missouri mental health policy</h2>
      <p>Six public policy focus areas — data, risks, sources, and advocacy context.</p></div>`;

    // Sub-tabs
    html += `<div class="sub-tabs">`;
    keys.forEach((k) => {
      const d = POLICY_DATA[k];
      html += `<button class="sub-btn${k === activeKey ? " active" : ""}" onclick="showPolicySub('${k}')">${d.tab}</button>`;
    });
    html += `</div>`;

    // Sub-panels
    keys.forEach((k) => {
      const d = POLICY_DATA[k];
      html += `<div class="sub-panel${k === activeKey ? " visible" : ""}" id="pol-${k}">`;
      html += `<div class="sec-hdr"><h3>${d.title}</h3><p>${d.description}</p></div>`;

      // Stats
      if (d.stats) {
        html += `<div class="stat-grid">`;
        d.stats.forEach((s) => {
          html += `<div class="stat-card"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-sub">${s.sub}</div></div>`;
        });
        html += `</div>`;
      }

      // Bars
      if (d.bars) {
        html += `<hr class="divider"><div class="bar-section"><div class="bar-title">System indicators</div>`;
        d.bars.forEach((b) => {
          html += `<div class="bar-row"><span class="bar-key">${b.label}</span><div class="bar-track"><div class="bar-fill ${b.color}" style="width:${b.pct}%"></div></div><span class="bar-val">${b.value}</span></div>`;
        });
        html += `</div>`;
      }

      // Cards
      if (d.cards) {
        html += `<div class="card-stack">`;
        d.cards.forEach((c) => {
          html += `<div class="card"><div class="card-label ${c.labelColor}">${c.labelText}</div><div class="card-title">${c.title}</div><div class="card-body">${c.body}</div><span class="risk-tag ${c.tagColor}">${c.tag}</span></div>`;
        });
        html += `</div>`;
      }

      // Sources
      if (d.sources) {
        html += `<div class="source-list">`;
        d.sources.forEach((s) => {
          html += `<a class="source-pill" href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`;
        });
        html += `</div>`;
      }

      html += `</div>`;
    });

    el.innerHTML = html;
  }

  window.showPolicySub = function (key) {
    document.querySelectorAll("#mod-policy .sub-panel").forEach((p) => p.classList.remove("visible"));
    document.querySelectorAll("#mod-policy .sub-btn").forEach((b) => b.classList.remove("active"));
    document.getElementById(`pol-${key}`).classList.add("visible");
    const keys = Object.keys(POLICY_DATA);
    document.querySelectorAll("#mod-policy .sub-btn")[keys.indexOf(key)].classList.add("active");
  };

  // ════════════════════════════════════════
  //  SEED SAMPLE DATA
  // ════════════════════════════════════════
  function seedSampleData() {
    if (Store.get("seeded")) return;

    const today = new Date();
    const fmt = (offset) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offset);
      return d.toISOString().slice(0, 10);
    };

    Store.set("events", [
      { id: Store.uid(), title: "NAMI Family Support Group", date: fmt(2), time: "18:30", type: "support", location: "Behavioral Health Response — 1034 S. Brentwood, Clayton", description: "Free support group for families of individuals living with mental illness. Drop-in welcome.", author: "NAMI STL", created: today.toISOString() },
      { id: Store.uid(), title: "988 Awareness Day — Volunteer Briefing", date: fmt(5), time: "10:00", type: "volunteer", location: "Zoom (link provided after signup)", description: "Orientation for volunteers supporting our 988 Awareness community outreach campaign.", author: "NAMI STL Events", created: today.toISOString() },
      { id: Store.uid(), title: "Peer-to-Peer Session 4 of 8", date: fmt(7), time: "14:00", type: "training", location: "NAMI STL Office", description: "Continuing education session on wellness and recovery strategies.", author: "Peer-to-Peer Team", created: today.toISOString() },
      { id: Store.uid(), title: "NAMI Smarts Advocacy Workshop", date: fmt(12), time: "09:00", type: "training", location: "Missouri State Capitol — Jefferson City", description: "Half-day workshop on communicating with legislators about mental health funding.", author: "NAMI STL Advocacy", created: today.toISOString() },
      { id: Store.uid(), title: "NAMIWalks Planning Committee", date: fmt(14), time: "17:00", type: "meeting", location: "Virtual — Microsoft Teams", description: "Monthly planning meeting for the NAMIWalks St. Louis event team.", author: "Walk Committee", created: today.toISOString() },
      { id: Store.uid(), title: "Community Resource Fair", date: fmt(20), time: "11:00", type: "fundraiser", location: "Forest Park Community Center", description: "Free community event connecting families to mental health, housing, and legal resources.", author: "NAMI STL Programs", created: today.toISOString() },
    ]);

    Store.set("volunteer_opps", [
      { id: "vol1", title: "NAMIWalks Registration Table Volunteers", program: "NAMIWalks STL", date: fmt(30), time: "07:00", location: "Forest Park", spots: 12, description: "Help check in walkers, hand out t-shirts, and direct participants to the start line. Training provided the morning of.", contact: "walks@namistl.org", created: today.toISOString() },
      { id: "vol2", title: "Family-to-Family Class Facilitator (Training Provided)", program: "Family-to-Family", date: "", time: "", location: "Various STL locations", spots: 4, description: "Become a trained facilitator for our flagship family education program. Requires completion of Family-to-Family as a participant and a 3-day facilitator training.", contact: "programs@namistl.org", created: today.toISOString() },
      { id: "vol3", title: "Helpline Phone Volunteers", program: "NAMI HelpLine", date: "", time: "", location: "Remote / from home", spots: 8, description: "Answer calls from individuals and families seeking mental health information and referrals. 20-hour training provided. Minimum 4 hours/week commitment.", contact: "helpline@namistl.org", created: today.toISOString() },
    ]);

    Store.set("posts", [
      { id: Store.uid(), type: "announcement", title: "New Peer-to-Peer cohort starting in May", body: "We're opening registration for our next 8-session Peer-to-Peer education course. If you or someone you know would benefit from learning recovery strategies alongside peers, please reach out. Completely free.", author: "NAMI STL Programs", created: new Date(today.getTime() - 86400000 * 2).toISOString() },
      { id: Store.uid(), type: "story", title: "", body: "I completed Family-to-Family last month and it changed how I understand what my sister is going through. I wish I had found this program years ago. If you're a family member and feeling lost, please consider signing up.", author: "Maria T.", created: new Date(today.getTime() - 86400000 * 4).toISOString() },
      { id: Store.uid(), type: "resource", title: "Free CIT training for law enforcement — May dates", body: "Missouri CIT Council is offering free Crisis Intervention Team training for law enforcement in the St. Louis region this May. This is the training that helps officers respond to mental health crises. Contact the MO CIT Council for details.", author: "NAMI STL Advocacy", created: new Date(today.getTime() - 86400000 * 6).toISOString() },
    ]);

    Store.set("seeded", true);
  }

  // ── Utilities ──
  function esc(str) {
    if (!str) return "";
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function timeAgo(isoStr) {
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + "h ago";
    const days = Math.floor(hrs / 24);
    if (days < 30) return days + "d ago";
    return Math.floor(days / 30) + "mo ago";
  }

  function toast(msg) {
    let t = document.getElementById("app-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "app-toast";
      t.className = "toast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2500);
  }

  // ════════════════════════════════════════
  //  SAFETY PLAN MODULE (Stanley-Brown-style)
  // ════════════════════════════════════════
  const SAFETY_PLAN_SECTIONS = [
    { key: "reasons",  label: "My reasons for living",              help: "People, goals, things I care about — what gives my life meaning. Read this first if things get dark.", placeholder: "My kids. Finishing my degree. My dog Rosie. Seeing my sister again." },
    { key: "warnings", label: "Warning signs",                      help: "Thoughts, moods, situations, or behaviors that tell me a crisis may be building.",                      placeholder: "Thoughts like 'nobody would miss me'. Not sleeping. Isolating. Drinking more." },
    { key: "coping",   label: "Things I can do on my own",          help: "Internal coping strategies — things I can do without contacting anyone else.",                          placeholder: "Walk around the block. Cold shower. 5 minutes of box breathing. Play the 'safe' playlist." },
    { key: "distract", label: "People and places that distract me", help: "Social settings or people who take my mind off the crisis — they don't need to know what's happening.",  placeholder: "Kaldi's Coffee. Call my friend Sam. The library. Sunday service." },
    { key: "support",  label: "People I can ask for help",          help: "People I trust enough to tell when I'm struggling. Include their phone numbers.",                         placeholder: "Mom — 314-555-0110. My sponsor Dana — 314-555-0188." },
    { key: "pros",     label: "Professionals and agencies",         help: "My therapist, psychiatrist, clinic, and crisis lines — with phone numbers and hours.",                 placeholder: "Dr. Patel — 314-555-0133 (M–F 9–5). 988. BHR — 314-469-6644." },
    { key: "safe",     label: "Making my environment safer",        help: "Steps to reduce access to things I could use to hurt myself — who holds them, where they go.",         placeholder: "Give pills to my partner. Store firearm at Dad's. Remove alcohol from the kitchen." },
  ];

  function renderSafetyPlan(el, sub) {
    if (sub === "wallet") return renderWalletCard(el);
    const plan = Store.get("safety_plan") || {};
    let html = `<div class="sec-hdr"><h2>My safety plan</h2>
      <p>A personal plan, based on the Stanley-Brown Safety Planning Intervention, for getting through the hardest moments. Fill in what makes sense — you can always change it.</p></div>
      <div class="sp-intro"><strong>This stays on your device.</strong> Nothing you type here is sent anywhere. Clearing your browser data will delete it, so use <em>Print / Save as PDF</em> to keep a copy you can share with a trusted person or your clinician.</div>`;

    SAFETY_PLAN_SECTIONS.forEach((s, i) => {
      const val = esc(plan[s.key] || "");
      html += `<div class="sp-section">
        <div class="sp-step">Step ${i + 1}</div>
        <div class="sp-label"><label for="sp-${s.key}">${s.label}</label></div>
        <div class="sp-help">${s.help}</div>
        <textarea class="sp-textarea" id="sp-${s.key}" data-sp="${s.key}" placeholder="${esc(s.placeholder)}">${val}</textarea>
      </div>`;
    });

    const savedLabel = plan._saved ? "Last saved " + timeAgo(plan._saved) : "Not yet saved";
    html += `<div class="sp-actions">
      <button class="cal-btn primary" id="sp-save" type="button">Save plan</button>
      <button class="cal-btn" id="sp-print" type="button">Print / Save as PDF</button>
      <a class="cal-btn" href="#safetyplan/wallet">Print wallet card</a>
      <button class="cal-btn" id="sp-clear" type="button" style="color:var(--tag-danger-tx)">Clear plan</button>
      <span class="sp-status" id="sp-status">${savedLabel}</span>
    </div>
    <div class="sp-privacy">If you're on a shared or unsafe device, tap <strong>Quick exit</strong> (top right) — or double-tap <kbd>Esc</kbd> — to leave this page fast.</div>`;

    el.innerHTML = html;

    el.querySelectorAll(".sp-textarea").forEach((ta) => {
      ta.addEventListener("blur", saveSafetyPlan);
    });
    document.getElementById("sp-save").addEventListener("click", () => {
      saveSafetyPlan();
      toast("Safety plan saved on this device.");
    });
    document.getElementById("sp-print").addEventListener("click", () => {
      saveSafetyPlan();
      window.print();
    });
    document.getElementById("sp-clear").addEventListener("click", () => {
      if (!confirm("Clear your entire safety plan from this device? This can't be undone.")) return;
      Store.delete("safety_plan");
      renderSafetyPlan(el);
      toast("Safety plan cleared.");
    });
  }

  function saveSafetyPlan() {
    const plan = { _saved: new Date().toISOString() };
    document.querySelectorAll(".sp-textarea").forEach((ta) => {
      plan[ta.dataset.sp] = ta.value;
    });
    const ok = Store.set("safety_plan", plan);
    const s = document.getElementById("sp-status");
    if (s) s.textContent = ok ? "Last saved just now" : "Couldn't save — browser storage may be full";
  }

  function planToBullets(str, max) {
    if (!str) return [];
    return str.split(/[\r\n]+|\.\s+|;\s+|\s•\s+/)
      .map((s) => s.trim().replace(/^[-•*]\s*/, ""))
      .filter(Boolean)
      .slice(0, max || 3);
  }

  function renderWalletCard(el) {
    const plan = Store.get("safety_plan") || {};
    const supports = planToBullets(plan.support, 3);
    const helps = planToBullets(plan.coping, 3);
    const name = (Store.get("prefs") || {}).displayName || "";

    const supportsHtml = supports.length
      ? supports.map((s) => `<li>${esc(s)}</li>`).join("")
      : `<li class="wc-empty">Add people you can call in your safety plan &rarr; they appear here.</li>`;
    const helpsHtml = helps.length
      ? helps.map((s) => `<li>${esc(s)}</li>`).join("")
      : `<li class="wc-empty">Add coping strategies in your safety plan &rarr; they appear here.</li>`;

    el.innerHTML = `<div class="sec-hdr"><h2>Wallet crisis card</h2>
      <p>A fold-and-carry card with every crisis number plus your personal supports from your safety plan. Print on any paper, cut out, fold along the dashed line, carry.</p></div>

      <div class="wc-actions no-print">
        <button class="cal-btn primary" id="wc-print" type="button">Print this card</button>
        <a class="cal-btn" href="#safetyplan">&larr; Back to safety plan</a>
      </div>

      <div class="wc-stage">
        <article class="wallet-card" aria-label="Printable crisis card">
          <section class="wc-front">
            <div class="wc-label">If I'm in crisis</div>
            <div class="wc-big"><span class="wc-line-label">Call or text</span><span class="wc-number">988</span></div>
            <div class="wc-row"><span>Crisis text</span><span class="wc-mono">HOME to 741741</span></div>
            <div class="wc-row"><span>STL mobile crisis</span><span class="wc-mono">314-469-6644</span></div>
            <div class="wc-row"><span>Life-threatening</span><span class="wc-mono">911</span></div>
            ${name ? `<div class="wc-foot">For ${esc(name)}</div>` : `<div class="wc-foot">You're not alone.</div>`}
          </section>
          <section class="wc-back">
            <div class="wc-sec-title">People I can call</div>
            <ul class="wc-list">${supportsHtml}</ul>
            <div class="wc-sec-title">Things that help</div>
            <ul class="wc-list">${helpsHtml}</ul>
          </section>
        </article>
      </div>

      <p class="wc-tip no-print">Tip: choose <em>Scale: 100%</em> (or "Actual size") in the print dialog so the card comes out at real wallet size. Fold on the dashed line.</p>`;

    document.getElementById("wc-print").addEventListener("click", () => {
      document.body.classList.add("wallet-print");
      window.print();
      setTimeout(() => document.body.classList.remove("wallet-print"), 0);
    });
    window.addEventListener("afterprint", () => document.body.classList.remove("wallet-print"), { once: true });
  }

  // ════════════════════════════════════════
  //  QUICK EXIT (leave site fast)
  // ════════════════════════════════════════
  (function wireQuickExit() {
    const NEUTRAL = "https://www.google.com/search?q=weather";
    function bail() {
      try { history.replaceState(null, "", "/"); } catch (_) {}
      location.replace(NEUTRAL);
    }
    function openOverlay() {
      return document.querySelector(".detail-overlay.open, .form-overlay.open");
    }
    const btn = document.getElementById("quick-exit");
    if (btn) btn.addEventListener("click", bail);
    let lastEsc = 0;
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const overlay = openOverlay();
      if (overlay) { overlay.classList.remove("open"); lastEsc = 0; return; }
      const now = Date.now();
      if (now - lastEsc < 500) bail();
      lastEsc = now;
    });
  })();

  // ════════════════════════════════════════
  //  "I NEED HELP NOW" FLOATING ACTION
  // ════════════════════════════════════════
  const helpFab = document.getElementById("help-fab");
  if (helpFab) helpFab.addEventListener("click", openHelpOverlay);

  function openHelpOverlay() {
    let overlay = document.getElementById("detail-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "detail-overlay";
      overlay.className = "detail-overlay";
      overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div class="detail-panel" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <button class="detail-close" aria-label="Close" onclick="document.getElementById('detail-overlay').classList.remove('open')">&times;</button>
      <h3 id="help-title" style="font-size:19px; font-weight:600; margin-bottom:6px">Get help right now</h3>
      <p style="font-size:13px; color:var(--tx-1); line-height:1.55; margin-bottom:4px">You don't have to explain yourself. Pick whatever feels right — all of these are free and confidential.</p>
      <div class="help-actions">
        <a class="help-action urgent" href="tel:988">
          <span class="help-action-body"><span class="help-action-title">Call 988</span><span class="help-action-sub">Suicide &amp; Crisis Lifeline — 24/7</span></span>
          <span aria-hidden="true">&rarr;</span>
        </a>
        <a class="help-action urgent" href="sms:988">
          <span class="help-action-body"><span class="help-action-title">Text 988</span><span class="help-action-sub">If texting feels easier than talking</span></span>
          <span aria-hidden="true">&rarr;</span>
        </a>
        <a class="help-action" href="sms:741741?&body=HOME">
          <span class="help-action-body"><span class="help-action-title">Text HOME to 741741</span><span class="help-action-sub">Crisis Text Line — 24/7, any crisis</span></span>
          <span aria-hidden="true">&rarr;</span>
        </a>
        <a class="help-action" href="tel:3144696644">
          <span class="help-action-body"><span class="help-action-title">Call 314-469-6644</span><span class="help-action-sub">Behavioral Health Response — St. Louis mobile crisis (not police-led)</span></span>
          <span aria-hidden="true">&rarr;</span>
        </a>
        <a class="help-action urgent" href="tel:911">
          <span class="help-action-body"><span class="help-action-title">Call 911</span><span class="help-action-sub">Only if someone's life is in immediate danger</span></span>
          <span aria-hidden="true">&rarr;</span>
        </a>
        <a class="help-action" href="#safetyplan" id="help-open-plan">
          <span class="help-action-body"><span class="help-action-title">Open my safety plan</span><span class="help-action-sub">The plan you wrote for moments like this</span></span>
          <span aria-hidden="true">&rarr;</span>
        </a>
        <a class="help-action" href="#coping/breath" id="help-open-breath">
          <span class="help-action-body"><span class="help-action-title">Try a grounding exercise</span><span class="help-action-sub">Box breathing or 5-4-3-2-1 — when a phone call feels like too much</span></span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <p class="help-note">Not in crisis but want to talk? NAMI HelpLine — <a href="tel:18009506264">1-800-950-NAMI (6264)</a>, Mon–Fri 9am–9pm CT.</p>
    </div>`;
    overlay.classList.add("open");
    const planLink = document.getElementById("help-open-plan");
    if (planLink) planLink.addEventListener("click", () => overlay.classList.remove("open"));
    const breathLink = document.getElementById("help-open-breath");
    if (breathLink) breathLink.addEventListener("click", () => overlay.classList.remove("open"));
    const close = overlay.querySelector(".detail-close");
    if (close) close.focus();
  }

  // ════════════════════════════════════════
  //  COPING TOOLS MODULE (grounding / breathing)
  // ════════════════════════════════════════
  const COPE_TOOLS = {
    breath: {
      title: "Box breathing",
      desc: "Inhale 4, hold 4, exhale 4, hold 4. Four cycles take about a minute. Slows your heart rate and brings your prefrontal cortex back online.",
    },
    fivefour: {
      title: "5-4-3-2-1 grounding",
      desc: "Name things you can see, feel, hear, smell, and taste. Anchors you in the room when your mind is spiraling.",
    },
    remind: {
      title: "Things that won't change",
      desc: "A short list of steady truths to come back to when nothing feels stable.",
    },
  };

  function renderCoping(el, sub) {
    if (sub && COPE_TOOLS[sub]) return renderCopeTool(el, sub);

    let html = `<div class="sec-hdr"><h2>Coping tools</h2>
      <p>Quick, private exercises for when the feeling is too big to think through. None of these replace real care — they just give you something to do while you ride it out.</p></div>
      <div class="cope-grid">`;
    Object.keys(COPE_TOOLS).forEach((k) => {
      const t = COPE_TOOLS[k];
      html += `<button type="button" class="cope-card" data-cope="${k}">
        <div class="cope-ico" aria-hidden="true">${k === "breath" ? "&#9901;" : k === "fivefour" ? "&#9737;" : "&#9775;"}</div>
        <div class="cope-title">${esc(t.title)}</div>
        <div class="cope-sub">${esc(t.desc)}</div>
      </button>`;
    });
    html += `</div>
      <div class="sp-privacy">If any of this feels like too much, stop. Call or text <a href="tel:988" style="color:inherit">988</a>, or tap the <strong>I need help now</strong> button.</div>`;
    el.innerHTML = html;

    el.querySelectorAll(".cope-card").forEach((c) => {
      c.addEventListener("click", () => {
        location.hash = `coping/${c.dataset.cope}`;
      });
    });
  }

  function renderCopeTool(el, key) {
    const t = COPE_TOOLS[key];
    let body = "";
    if (key === "breath") body = `
      <div class="breath-stage">
        <div class="breath-label" id="breath-label">Get comfortable</div>
        <div class="breath-count" id="breath-count">—</div>
        <div class="breath-circle-wrap"><div class="breath-circle" id="breath-circle"></div></div>
        <div class="breath-cycle" id="breath-cycle">Tap start when you're ready.</div>
      </div>
      <div class="cope-actions">
        <button class="cal-btn primary" id="breath-start" type="button">Start</button>
        <button class="cal-btn" id="breath-stop" type="button" disabled>Stop</button>
      </div>`;
    else if (key === "fivefour") body = `
      <div class="five-four-three" id="ff-list"></div>
      <div class="cope-actions"><button class="cal-btn" id="ff-reset" type="button">Start over</button></div>`;
    else body = `
      <div class="ground-list">
        <div class="ground-item">I am in this room, in this body, in this moment.</div>
        <div class="ground-item">This feeling is not a prediction. It is weather passing through.</div>
        <div class="ground-item">I have survived every worst day I've had so far.</div>
        <div class="ground-item">People I love exist, whether or not I can feel them right now.</div>
        <div class="ground-item">There is nothing I have to solve in the next five minutes.</div>
        <div class="ground-item">I am allowed to ask for help. 988 answers any time of day.</div>
      </div>`;

    el.innerHTML = `<div class="sec-hdr"><h2>${esc(t.title)}</h2></div>
      <div class="cope-view">
        <p class="cope-desc">${esc(t.desc)}</p>
        ${body}
      </div>
      <div class="cope-actions"><a class="cal-btn" href="#coping">&larr; All coping tools</a></div>`;

    if (key === "breath") wireBreathing();
    else if (key === "fivefour") wireFiveFour();
  }

  function wireBreathing() {
    const phases = [
      { label: "Breathe in",  state: "expand",   secs: 4 },
      { label: "Hold",        state: "hold",     secs: 4 },
      { label: "Breathe out", state: "contract", secs: 4 },
      { label: "Hold",        state: "rest",     secs: 4 },
    ];
    const circle = document.getElementById("breath-circle");
    const label = document.getElementById("breath-label");
    const count = document.getElementById("breath-count");
    const cycleEl = document.getElementById("breath-cycle");
    const startBtn = document.getElementById("breath-start");
    const stopBtn = document.getElementById("breath-stop");
    let timer = null, cycle = 0, pi = 0, secsLeft = 0;

    function tick() {
      if (secsLeft <= 0) {
        pi = (pi + 1) % phases.length;
        if (pi === 0) { cycle += 1; cycleEl.textContent = `Cycle ${cycle + 1} of 4`; if (cycle >= 4) return stop(true); }
        const p = phases[pi];
        circle.classList.remove("expand", "hold", "contract", "rest");
        circle.classList.add(p.state);
        label.textContent = p.label;
        secsLeft = p.secs;
      }
      count.textContent = secsLeft;
      secsLeft -= 1;
    }

    function start() {
      cycle = 0; pi = -1; secsLeft = 0;
      cycleEl.textContent = "Cycle 1 of 4";
      startBtn.disabled = true; stopBtn.disabled = false;
      tick();
      timer = setInterval(tick, 1000);
    }
    function stop(finished) {
      if (timer) clearInterval(timer);
      timer = null;
      startBtn.disabled = false; stopBtn.disabled = true;
      label.textContent = finished ? "Nice work." : "Stopped";
      count.textContent = finished ? "✓" : "—";
      cycleEl.textContent = finished ? "That's four cycles. How do you feel?" : "Tap start when you're ready.";
      circle.classList.remove("expand", "hold", "contract"); circle.classList.add("rest");
    }
    startBtn.addEventListener("click", start);
    stopBtn.addEventListener("click", () => stop(false));
  }

  function wireFiveFour() {
    const STEPS = [
      { count: "5", prompt: "Five things you can see",  hint: "Let your eyes move around slowly. Name them to yourself." },
      { count: "4", prompt: "Four things you can feel", hint: "Feet on the floor, fabric on your skin, temperature, the weight of your phone." },
      { count: "3", prompt: "Three things you can hear", hint: "Your breath counts. So does the hum of a fridge or a car outside." },
      { count: "2", prompt: "Two things you can smell", hint: "Or two you wish you could — coffee, rain, a specific person's shampoo." },
      { count: "1", prompt: "One thing you can taste",  hint: "Or something you want to taste next. Water counts." },
    ];
    const list = document.getElementById("ff-list");
    const render = () => {
      const done = JSON.parse(sessionStorage.getItem("nami_ff_done") || "[]");
      list.innerHTML = STEPS.map((s, i) => `
        <div class="ff-step${done.includes(i) ? " done" : ""}">
          <div class="ff-count">${s.count}</div>
          <div class="ff-prompt">${s.prompt}</div>
          <div class="ff-hint">${s.hint}</div>
          <button class="ff-done" type="button" data-step="${i}">${done.includes(i) ? "Done &#10003;" : "Mark done"}</button>
        </div>`).join("");
      list.querySelectorAll(".ff-done").forEach((b) => {
        b.addEventListener("click", () => {
          const d = JSON.parse(sessionStorage.getItem("nami_ff_done") || "[]");
          const i = Number(b.dataset.step);
          const next = d.includes(i) ? d.filter((x) => x !== i) : [...d, i];
          sessionStorage.setItem("nami_ff_done", JSON.stringify(next));
          render();
        });
      });
    };
    render();
    document.getElementById("ff-reset").addEventListener("click", () => {
      sessionStorage.removeItem("nami_ff_done");
      render();
    });
  }

  // ════════════════════════════════════════
  //  DISPLAY / READING PREFERENCES (a11y)
  // ════════════════════════════════════════
  const PREF_KEYS = ["text", "contrast", "motion"];
  function loadPrefs() {
    const p = Store.get("prefs") || {};
    PREF_KEYS.forEach((k) => {
      if (p[k]) document.documentElement.setAttribute(`data-${k}`, p[k]);
      else document.documentElement.removeAttribute(`data-${k}`);
    });
  }
  function setPref(key, value) {
    const p = Store.get("prefs") || {};
    if (!value || value === "default") delete p[key];
    else p[key] = value;
    Store.set("prefs", p);
    loadPrefs();
  }
  loadPrefs();

  function openA11yDialog() {
    let overlay = document.getElementById("detail-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "detail-overlay";
      overlay.className = "detail-overlay";
      overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
      document.body.appendChild(overlay);
    }
    const current = Store.get("prefs") || {};
    overlay.innerHTML = `<div class="detail-panel a11y-panel" role="dialog" aria-modal="true" aria-labelledby="a11y-title">
      <button class="detail-close" aria-label="Close" onclick="document.getElementById('detail-overlay').classList.remove('open')">&times;</button>
      <h3 id="a11y-title">Display &amp; reading options</h3>
      <div class="a11y-sub">Your choices stay on this device.</div>
      ${a11yRow("text",     "Text size",  [["default","Normal"],["large","Large"],["xlarge","XL"]], current.text)}
      ${a11yRow("contrast", "Contrast",   [["default","Default"],["high","High"]],                    current.contrast)}
      ${a11yRow("motion",   "Motion",     [["default","Default"],["reduce","Reduced"]],              current.motion)}
      <div style="margin-top:16px; font-size:12px; color:var(--tx-2); line-height:1.5">Reduced motion turns off the breathing animation and page transitions. High contrast sharpens borders and deepens text color.</div>
    </div>`;
    overlay.classList.add("open");
    overlay.querySelectorAll(".a11y-choice").forEach((b) => {
      b.addEventListener("click", () => {
        setPref(b.dataset.pref, b.dataset.value);
        overlay.querySelectorAll(`.a11y-choice[data-pref="${b.dataset.pref}"]`).forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      });
    });
  }
  function a11yRow(pref, label, choices, value) {
    const cur = value || "default";
    return `<div class="a11y-row">
      <div><div class="a11y-row-label">${label}</div></div>
      <div class="a11y-choices" role="group" aria-label="${label}">${choices.map(([v, l]) =>
        `<button type="button" class="a11y-choice" data-pref="${pref}" data-value="${v}" aria-pressed="${v === cur ? "true" : "false"}">${l}</button>`
      ).join("")}</div>
    </div>`;
  }
  const a11yBtn = document.getElementById("a11y-open");
  if (a11yBtn) a11yBtn.addEventListener("click", openA11yDialog);

  // ════════════════════════════════════════
  //  SERVICE WORKER (offline)
  // ════════════════════════════════════════
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  // ── Init ──
  const r = getRoute();
  showModule(r.module, r.sub);
});
