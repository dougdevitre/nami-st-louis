document.addEventListener("DOMContentLoaded", () => {

  // ── Module definitions ──
  const MODULES = [
    { id: "programs", label: "Programs" },
    { id: "calendar", label: "Calendar" },
    { id: "volunteers", label: "Volunteers" },
    { id: "resources", label: "Resources" },
    { id: "safetyplan", label: "Safety plan" },
    { id: "coping", label: "Coping tools" },
    { id: "checkin", label: "Check-in" },
    { id: "supporter", label: "Helping someone" },
    { id: "community", label: "Community" },
    { id: "policy", label: "Policy" },
    { id: "advocacy", label: "Advocacy" },
    { id: "stories", label: "My stories" },
  ];

  const moduleNav = document.getElementById("module-nav");
  const moduleContainer = document.getElementById("modules");

  // Insert a search trigger above the module nav
  const searchTrigger = document.createElement("button");
  searchTrigger.type = "button";
  searchTrigger.id = "search-trigger";
  searchTrigger.className = "search-trigger";
  searchTrigger.setAttribute("aria-label", "Search the site");
  searchTrigger.innerHTML = `<span class="search-trigger-ico" aria-hidden="true">&#9906;</span><span class="search-trigger-text">Search programs, resources, advocacy…</span><kbd class="search-trigger-kbd">/</kbd>`;
  moduleNav.parentNode.insertBefore(searchTrigger, moduleNav);

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
      case "checkin": renderCheckin(panel); break;
      case "supporter": renderSupporter(panel); break;
      case "community": renderCommunity(panel); break;
      case "policy": renderPolicy(panel, sub); break;
      case "advocacy": renderAdvocacy(panel); break;
      case "stories": renderStories(panel); break;
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
      return document.querySelector(".detail-overlay.open, .form-overlay.open, .search-overlay.open");
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
        <a class="help-action" href="#supporter" id="help-open-sup">
          <span class="help-action-body"><span class="help-action-title">I'm helping someone else</span><span class="help-action-sub">What to say, what to do, 988 vs. 911, how to request mobile crisis</span></span>
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
    const supLink = document.getElementById("help-open-sup");
    if (supLink) supLink.addEventListener("click", () => overlay.classList.remove("open"));
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
  //  MOOD CHECK-IN MODULE (private, on-device)
  // ════════════════════════════════════════
  const MOOD_FACES = [
    { v: 1, face: "😞", label: "Awful" },
    { v: 2, face: "😕", label: "Rough" },
    { v: 3, face: "😐", label: "Okay" },
    { v: 4, face: "🙂", label: "Good" },
    { v: 5, face: "😊", label: "Great" },
  ];
  const MOOD_TAGS = [
    "Slept well", "Slept poorly", "Took meds", "Missed meds",
    "Exercised", "Ate well", "Anxious", "Low", "Overwhelmed",
    "Grateful", "Reached out", "Isolated",
  ];
  const MOOD_CHART_DAYS = 21;

  function renderCheckin(el) {
    const entries = (Store.get("mood") || []).slice().sort((a, b) => a.when.localeCompare(b.when));
    const today = new Date().toISOString().slice(0, 10);
    const todays = entries.filter((e) => e.when.slice(0, 10) === today);

    let html = `<div class="sec-hdr"><h2>How are you?</h2>
      <p>A 30-second mood check-in. Everything stays on this device — nothing is sent anywhere. Bring the chart to a clinician appointment if it helps.</p></div>
      <div class="sp-intro">Private: stored only in your browser. Clearing browser data deletes it. Use <em>Export CSV</em> below to keep a copy.</div>

      <div class="ci-card">
        <div class="ci-prompt">Right now, you feel…</div>
        <div class="ci-faces" role="radiogroup" aria-label="Mood">
          ${MOOD_FACES.map((m) => `
            <button type="button" class="ci-face" data-mood="${m.v}" role="radio" aria-checked="false" aria-label="${m.label}">
              <span class="ci-face-emoji" aria-hidden="true">${m.face}</span>
              <span class="ci-face-label">${m.label}</span>
            </button>`).join("")}
        </div>
        <label class="form-label" for="ci-note" style="margin-top:10px; display:block">Add a note (optional)</label>
        <textarea class="form-textarea" id="ci-note" placeholder="What's going on? Triggers, wins, anything."></textarea>
        <div class="ci-tags" role="group" aria-label="Tags">
          ${MOOD_TAGS.map((t) => `<button type="button" class="ci-tag" data-tag="${esc(t)}">${esc(t)}</button>`).join("")}
        </div>
        <div class="ci-actions">
          <button class="cal-btn primary" id="ci-save" type="button" disabled>Save check-in</button>
          <span class="ci-hint" id="ci-hint">Pick a face to save.</span>
        </div>
      </div>`;

    if (todays.length) {
      html += `<div class="ci-today"><strong>Today:</strong> ${todays.length} check-in${todays.length === 1 ? "" : "s"} already — latest was ${MOOD_FACES.find((m) => m.v === todays[todays.length - 1].mood)?.label.toLowerCase()}.</div>`;
    }

    html += renderMoodChart(entries);
    html += renderMoodEntries(entries);

    html += `<div class="ci-actions" style="margin-top:1rem">
      <button class="cal-btn" id="ci-export" type="button">Export CSV</button>
      <button class="cal-btn" id="ci-clear" type="button" style="color:var(--tag-danger-tx)">Clear all check-ins</button>
    </div>`;

    el.innerHTML = html;
    wireCheckin(el);
  }

  function wireCheckin(el) {
    let mood = null;
    const chosenTags = new Set();
    const hint = el.querySelector("#ci-hint");
    const saveBtn = el.querySelector("#ci-save");

    el.querySelectorAll(".ci-face").forEach((b) => {
      b.addEventListener("click", () => {
        mood = Number(b.dataset.mood);
        el.querySelectorAll(".ci-face").forEach((x) => { x.classList.remove("selected"); x.setAttribute("aria-checked", "false"); });
        b.classList.add("selected");
        b.setAttribute("aria-checked", "true");
        saveBtn.disabled = false;
        hint.textContent = "Add context, or just save.";
      });
    });

    el.querySelectorAll(".ci-tag").forEach((t) => {
      t.addEventListener("click", () => {
        const tag = t.dataset.tag;
        if (chosenTags.has(tag)) { chosenTags.delete(tag); t.classList.remove("selected"); }
        else { chosenTags.add(tag); t.classList.add("selected"); }
      });
    });

    saveBtn.addEventListener("click", () => {
      if (!mood) return;
      const entry = {
        id: Store.uid(),
        when: new Date().toISOString(),
        mood,
        note: el.querySelector("#ci-note").value.trim(),
        tags: [...chosenTags],
      };
      Store.push("mood", entry);
      toast("Check-in saved.");
      renderCheckin(el);
    });

    el.querySelector("#ci-export").addEventListener("click", exportMoodCsv);
    el.querySelector("#ci-clear").addEventListener("click", () => {
      if (!confirm("Clear every mood check-in from this device? This can't be undone.")) return;
      Store.delete("mood");
      renderCheckin(el);
      toast("Check-ins cleared.");
    });
  }

  function renderMoodChart(entries) {
    if (!entries.length) return `<div class="ci-empty">No check-ins yet. Save one above to start tracking.</div>`;
    const end = new Date(); end.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = MOOD_CHART_DAYS - 1; i >= 0; i--) {
      const d = new Date(end); d.setDate(end.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const dayEntries = entries.filter((e) => e.when.slice(0, 10) === iso);
      const avg = dayEntries.length ? dayEntries.reduce((a, b) => a + b.mood, 0) / dayEntries.length : null;
      days.push({ d, iso, avg, count: dayEntries.length });
    }
    const bars = days.map((day) => {
      if (day.avg == null) return `<div class="ci-bar-col"><div class="ci-bar empty" title="No check-in" style="height:8%"></div><div class="ci-bar-lbl">${day.d.getDate()}</div></div>`;
      const pct = (day.avg / 5) * 100;
      const cls = day.avg >= 4 ? "good" : day.avg >= 3 ? "mid" : day.avg >= 2 ? "low" : "bad";
      return `<div class="ci-bar-col"><div class="ci-bar ${cls}" style="height:${Math.max(14, pct)}%" title="${day.d.toDateString()}: avg ${day.avg.toFixed(1)} (${day.count})"></div><div class="ci-bar-lbl">${day.d.getDate()}</div></div>`;
    }).join("");
    return `<div class="ci-chart-wrap">
      <div class="ci-chart-hdr">Last ${MOOD_CHART_DAYS} days</div>
      <div class="ci-chart" role="img" aria-label="Mood trend over the last ${MOOD_CHART_DAYS} days">${bars}</div>
      <div class="ci-chart-legend">
        <span class="ci-key bad"></span> Awful
        <span class="ci-key low"></span> Rough
        <span class="ci-key mid"></span> Okay
        <span class="ci-key good"></span> Good+
      </div>
    </div>`;
  }

  function renderMoodEntries(entries) {
    if (!entries.length) return "";
    const recent = entries.slice().reverse().slice(0, 10);
    const rows = recent.map((e) => {
      const face = MOOD_FACES.find((m) => m.v === e.mood);
      const when = new Date(e.when);
      const dateLbl = when.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const timeLbl = when.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const tagStr = e.tags && e.tags.length ? e.tags.map((t) => `<span class="ci-entry-tag">${esc(t)}</span>`).join("") : "";
      return `<div class="ci-entry">
        <div class="ci-entry-face" title="${face?.label}">${face?.face || ""}</div>
        <div class="ci-entry-body">
          <div class="ci-entry-meta">${dateLbl} &middot; ${timeLbl}</div>
          ${e.note ? `<div class="ci-entry-note">${esc(e.note)}</div>` : ""}
          ${tagStr ? `<div class="ci-entry-tags">${tagStr}</div>` : ""}
        </div>
        <button class="ci-entry-del" data-del="${e.id}" aria-label="Delete entry">&times;</button>
      </div>`;
    }).join("");
    return `<div class="sec-hdr" style="margin-top:1.5rem"><h3>Recent check-ins</h3></div>
      <div class="ci-entries">${rows}</div>`;
  }

  // Delegate entry deletes (list re-renders each save)
  document.addEventListener("click", (e) => {
    const del = e.target.closest && e.target.closest(".ci-entry-del");
    if (!del) return;
    const id = del.dataset.del;
    if (!id) return;
    if (!confirm("Remove this check-in?")) return;
    Store.removeById("mood", id);
    const panel = document.getElementById("mod-checkin");
    if (panel) renderCheckin(panel);
  });

  function exportMoodCsv() {
    const rows = Store.get("mood") || [];
    if (!rows.length) { toast("No check-ins to export yet."); return; }
    const header = "timestamp,mood,label,note,tags\n";
    const body = rows.slice().sort((a, b) => a.when.localeCompare(b.when)).map((e) => {
      const label = (MOOD_FACES.find((m) => m.v === e.mood) || {}).label || "";
      const note = (e.note || "").replace(/"/g, '""');
      const tags = (e.tags || []).join("; ").replace(/"/g, '""');
      return `"${e.when}",${e.mood},"${label}","${note}","${tags}"`;
    }).join("\n");
    const blob = new Blob([header + body + "\n"], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nami-stl-mood-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
  }

  // ════════════════════════════════════════
  //  ADVOCACY MODULE (Missouri mental health)
  // ════════════════════════════════════════
  const MO_COMMITTEES = [
    { chamber: "Senate", name: "Health and Welfare",                       covers: "988 sustainment, Medicaid behavioral health, workforce", url: "https://www.senate.mo.gov/committees" },
    { chamber: "Senate", name: "Appropriations",                           covers: "Department of Mental Health budget, CCBHC funding",     url: "https://www.senate.mo.gov/committees" },
    { chamber: "Senate", name: "Judiciary and Civil and Criminal Jurisprudence", covers: "Involuntary commitment (96-hour hold) reform, crisis diversion", url: "https://www.senate.mo.gov/committees" },
    { chamber: "House",  name: "Health and Mental Health Policy",          covers: "Crisis response, CIT funding, parity enforcement",      url: "https://house.mo.gov/CommitteeHearings.aspx" },
    { chamber: "House",  name: "Children and Families",                    covers: "Youth mental health, school-based services",            url: "https://house.mo.gov/CommitteeHearings.aspx" },
    { chamber: "House",  name: "Budget",                                   covers: "DMH appropriations, mobile crisis funding",             url: "https://house.mo.gov/CommitteeHearings.aspx" },
  ];

  const AD_TEMPLATES = [
    {
      id: "988",
      title: "Sustained 988 & mobile crisis funding",
      ask: "Vote yes on dedicated state funding for 988 and mobile crisis response.",
      subject: "Please fund Missouri's 988 Crisis Lifeline",
      body: `Dear [Representative/Senator last name],

My name is [your name] and I'm a constituent in [your city or ZIP].

Since 988 launched, it has answered thousands of calls from Missourians who had nowhere else to turn. But 988's long-term success depends on sustained state funding — and Missouri's investment is still uncertain year to year.

I'm asking you to support dedicated, recurring state funding for 988 and for mobile crisis response teams like Behavioral Health Response (BHR) in St. Louis.

[One paragraph here is more powerful than anything I can tell you: if 988, BHR, or a crisis line has affected you, someone you love, or your community, say so — briefly, honestly.]

Mental health care delayed is often mental health care denied. Please help make sure a Missourian in crisis can always reach someone who can help.

Thank you for your time and for representing us.

[Your name]
[Your address or ZIP]
[Your phone or email, optional]`,
    },
    {
      id: "cit",
      title: "Crisis Intervention Team (CIT) training",
      ask: "Support sustained funding for CIT training for Missouri law enforcement.",
      subject: "Fund Crisis Intervention Team training for Missouri law enforcement",
      body: `Dear [Representative/Senator last name],

My name is [your name] and I live in [your city or ZIP].

When someone has a mental health crisis, the first responder is often a police officer. CIT training gives officers the skills to de-escalate and connect the person to care — instead of to jail or a hospital emergency room.

The Missouri CIT Council has trained thousands of officers, but funding is patchy and many rural departments can't afford to send people. I'm asking you to support sustained, statewide CIT funding — both initial 40-hour training and ongoing refreshers.

[If you or someone you love has been in a mental health crisis and had contact with police, a brief personal story here is the most persuasive part of this letter.]

CIT saves lives, reduces use of force, and keeps people out of the criminal justice system where they don't belong. Please help make it available everywhere in Missouri.

Thank you.

[Your name]
[Your address or ZIP]`,
    },
    {
      id: "parity",
      title: "Enforce mental health parity",
      ask: "Support stronger state enforcement of mental-health parity in insurance coverage.",
      subject: "Enforce mental health parity in Missouri insurance plans",
      body: `Dear [Representative/Senator last name],

My name is [your name] and I'm writing from [your city or ZIP].

Federal law (the Mental Health Parity and Addiction Equity Act) requires insurance plans to cover mental health and substance use care on the same terms as physical health care. In practice, families still run into narrow networks, "ghost" provider lists, and prior-authorization rules that don't apply to other conditions.

I'm asking you to support stronger state parity enforcement — including reporting requirements, provider-directory audits, and meaningful consequences when insurers fall short.

[Brief story, if you have one: "When I tried to find a therapist covered by my plan, the list of in-network providers had [how many] that were actually accepting patients…"]

People with mental illness deserve the same access to care as anyone else. Please help close the gap between what the law says and what families experience.

Thank you for your work.

[Your name]
[Your address or ZIP]`,
    },
    {
      id: "holds",
      title: "Reform involuntary commitment (96-hour hold)",
      ask: "Support reforms that reduce police-led responses and expand civil alternatives.",
      subject: "Reform Missouri's 96-hour hold process",
      body: `Dear [Representative/Senator last name],

My name is [your name] and I live in [your city or ZIP].

Missouri's 96-hour hold under RSMo 632.305 is meant to get people in crisis to care, but in practice it often runs through police transport, emergency departments, and long waits — experiences that can be traumatic and discourage people from seeking help again.

I'm asking you to support reforms that expand civil, non-police crisis response (like mobile crisis teams), shorten ED boarding, and protect the civil rights of people on holds — while preserving the ability to get help to someone who truly needs it.

[If you or someone you love has been through a 96-hour hold, a short personal description of what worked and what didn't is more persuasive than any advocacy framing.]

Thank you for considering this.

[Your name]
[Your address or ZIP]`,
    },
    {
      id: "youth",
      title: "Youth mental health in schools",
      ask: "Support dedicated funding for school-based mental health in Missouri.",
      subject: "Invest in school-based mental health for Missouri students",
      body: `Dear [Representative/Senator last name],

My name is [your name] and I live in [your city or ZIP].

Missouri students are facing a mental health crisis. Schools are often the first place a young person can be reached — but most Missouri districts don't have enough counselors, social workers, or psychologists to meet recommended ratios.

I'm asking you to support dedicated state funding for school-based mental health: counselors in every building, partnerships with community providers, and training for teachers to recognize warning signs.

[If you're a parent, teacher, or student with a story about a school that got this right or missed a chance to get it right, please include that.]

Early support prevents crises later. Please invest in it.

[Your name]
[Your address or ZIP]`,
    },
  ];

  const CALL_SCRIPT = `"Hi, my name is [your name] and I'm a constituent in [your city or ZIP]. I'm calling to ask [Senator/Representative Last Name] to [your ask, one sentence]. Mental health care matters to me because [one sentence — your reason, your connection]. Could you pass that along? Thank you."`;

  const TESTIMONY_TEMPLATE = {
    id: "testimony",
    title: "Written testimony (any bill)",
    ask: "Formally submit your views on a bill for the public record.",
    subject: "Testimony re: [Bill number] — [Support / Oppose]",
    body: `[Your name]
[Your address]
[Today's date]

The Honorable [Chair last name], Chair
[Committee name]
State Capitol, 201 W Capitol Ave
Jefferson City, MO 65101

Re: [Bill number] — [Support / Oppose / Support with amendment]

Dear Chair [Last name] and Members of the Committee,

My name is [your name] and I am a resident of [your city or ZIP]. I am writing in [support of / opposition to] [bill number], [bill short title].

[One sentence on your personal connection — why you're submitting testimony on this bill.]

I offer three reasons for my position:

1. [First reason — a fact, a number, or a piece of lived experience.]
2. [Second reason.]
3. [Third reason.]

[Optional personal story — one paragraph. This is the most persuasive part of most testimony. See the "Insert my story" button below.]

I respectfully ask the committee to [vote do-pass / vote do-not-pass / adopt the following amendment: ...].

Thank you for your time and for your service to Missouri.

Sincerely,
[Your name]
[Your phone or email — optional]`,
  };

  function renderAdvocacy(el) {
    const log = (Store.get("advocacy_log") || []).slice().sort((a, b) => b.when.localeCompare(a.when));
    const templatesHtml = AD_TEMPLATES.map((t) => `
      <details class="ad-tmpl">
        <summary>
          <div>
            <div class="ad-tmpl-title">${esc(t.title)}</div>
            <div class="ad-tmpl-ask">${esc(t.ask)}</div>
          </div>
          <span class="ad-tmpl-chev" aria-hidden="true">▾</span>
        </summary>
        <div class="ad-tmpl-body">
          <div class="ad-tmpl-meta"><strong>Subject:</strong> ${esc(t.subject)}</div>
          <textarea class="form-textarea ad-tmpl-text" data-tmpl="${t.id}" rows="14" readonly>${esc(t.body)}</textarea>
          <div class="ad-tmpl-actions">
            <button class="cal-btn primary" type="button" data-copy="${t.id}">Copy letter</button>
            <button class="cal-btn" type="button" data-insertstory="${t.id}">Insert my story</button>
            <a class="cal-btn" href="mailto:?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body)}">Open in email</a>
            <button class="cal-btn" type="button" data-logbtn="${t.id}" data-logtopic="${esc(t.title)}">Log that I sent this</button>
          </div>
        </div>
      </details>`).join("");

    const committeeRows = MO_COMMITTEES.map((c) => `
      <a class="res-item" href="${c.url}" target="_blank" rel="noopener noreferrer">
        <div>
          <div class="res-name"><span class="ad-chamber ${c.chamber.toLowerCase()}">${c.chamber}</span> ${esc(c.name)}</div>
          <div class="res-detail">${esc(c.covers)}</div>
        </div>
        <span class="res-arrow">&rarr;</span>
      </a>`).join("");

    const logRows = log.length
      ? log.slice(0, 10).map((e) => `
          <div class="ad-log-row">
            <div class="ad-log-date">${new Date(e.when).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
            <div class="ad-log-body">
              <div class="ad-log-head"><span class="ad-log-type">${esc(e.type)}</span> <span class="ad-log-recipient">${esc(e.recipient || "")}</span></div>
              <div class="ad-log-topic">${esc(e.topic || "")}</div>
              ${e.note ? `<div class="ad-log-note">${esc(e.note)}</div>` : ""}
            </div>
            <button class="ci-entry-del" data-logdel="${e.id}" aria-label="Delete entry">&times;</button>
          </div>`).join("")
      : `<div class="ci-empty">No advocacy actions logged yet. Make a call or send a letter, then log it here.</div>`;

    el.innerHTML = `<div class="sec-hdr"><h2>Advocate for mental health in Missouri</h2>
      <p>Concrete ways to push for the policy changes the <a href="#policy">Policy</a> tab tracks. Everything on this page is optional — pick the one thing that feels doable today.</p></div>

      <div class="ad-hero">
        <div class="ad-hero-step">Step 1</div>
        <h3>Find your legislators</h3>
        <p>Your state Senator and Representative both represent you. Enter your address at either lookup:</p>
        <div class="ad-hero-actions">
          <a class="cal-btn primary" href="https://www.senate.mo.gov/LegisLookup/Default.aspx" target="_blank" rel="noopener">Missouri Senate lookup &rarr;</a>
          <a class="cal-btn" href="https://house.mo.gov/MemberGridCluster.aspx?filter=clear" target="_blank" rel="noopener">Missouri House directory &rarr;</a>
        </div>
        <div class="ad-hero-switchboard">
          Main switchboards: Senate <a href="tel:15737513824">573-751-3824</a> &middot; House <a href="tel:15737513659">573-751-3659</a>
        </div>
      </div>

      <div class="sec-hdr" style="margin-top:1.5rem"><h3>Step 2 — Key committees for mental health</h3>
        <p>If a bill you care about is in one of these committees, contacting <em>its members</em> matters more than emailing every legislator.</p></div>
      <div class="res-list">${committeeRows}</div>

      <div class="sec-hdr" style="margin-top:1.5rem"><h3>Step 3 — Send a letter</h3>
        <p>Tap a topic, copy the draft, edit to make it yours, send it from your own email. Personal stories are the most persuasive part — one sentence is enough.</p></div>
      <div class="ad-tmpl-list">${templatesHtml}</div>

      <div class="sec-hdr" style="margin-top:1.5rem"><h3>Step 4 — Make a call</h3>
        <p>A call takes two minutes and carries more weight than an email. Don't worry about getting the policy details perfect — staff just want to know where constituents stand.</p></div>
      <div class="ad-script">${esc(CALL_SCRIPT)}</div>

      <div class="sec-hdr" style="margin-top:1.5rem"><h3>Step 5 — My advocacy log</h3>
        <p>Track what you've done and who you've contacted. Stays on this device. Export a CSV for NAMI STL advocacy team reporting if you want.</p></div>
      <div class="ad-log-form">
        <select class="form-select" id="ad-type">
          <option value="Call">Call</option>
          <option value="Email">Email</option>
          <option value="Letter">Letter</option>
          <option value="Visit">In-person visit</option>
          <option value="Testimony">Testimony / witness slip</option>
          <option value="Social">Social media post</option>
          <option value="Meeting">Meeting attended</option>
        </select>
        <input class="form-input" id="ad-recipient" placeholder="Recipient (e.g., Sen. Smith, HB 123 chair, NAMI STL advocacy)" />
        <input class="form-input" id="ad-topic" placeholder="Topic (e.g., 988 funding, CIT training)" />
        <textarea class="form-textarea" id="ad-note" placeholder="Notes (optional)" rows="2"></textarea>
        <div class="ad-log-actions">
          <button class="cal-btn primary" type="button" id="ad-log-save">Log action</button>
          <button class="cal-btn" type="button" id="ad-log-export">Export CSV</button>
          <button class="cal-btn" type="button" id="ad-log-clear" style="color:var(--tag-danger-tx)">Clear log</button>
        </div>
      </div>
      <div class="ad-log">${logRows}</div>

      <div class="sec-hdr" style="margin-top:1.5rem" id="ad-testimony"><h3>Step 6 — Submit testimony on a specific bill</h3>
        <p>In Missouri you don't have to travel to Jefferson City to be heard. Written testimony counts the same as in-person, and committee chairs distribute it to every member.</p></div>

      <div class="ad-howto">
        <div class="ad-howto-col">
          <div class="ad-howto-title">How to submit written testimony</div>
          <ol class="sup-steps" style="margin-top:10px">
            <li>Find the bill and its committee at <a href="https://www.senate.mo.gov/bills" target="_blank" rel="noopener">senate.mo.gov/bills</a> or <a href="https://house.mo.gov/BillList.aspx" target="_blank" rel="noopener">house.mo.gov/BillList</a>. Note the bill number (e.g., <em>SB 123</em> or <em>HB 456</em>) and the committee name.</li>
            <li>Check when it's being heard on the committee's hearings page: <a href="https://www.senate.mo.gov/committees" target="_blank" rel="noopener">Senate committees</a> · <a href="https://house.mo.gov/CommitteeHearings.aspx" target="_blank" rel="noopener">House hearings</a>. The committee page lists the chair's contact.</li>
            <li>Keep your testimony to <strong>one page</strong>. Use the template below. Name, address, bill number, position, 2–3 reasons, an optional personal story, ask.</li>
            <li>Email it to the <strong>committee chair</strong> and CC your own Senator and Representative. Try to send at least 24 hours before the hearing.</li>
            <li>Log it in Step 5 above — type <em>Testimony / witness slip</em> — so you can remember what you submitted.</li>
          </ol>
        </div>
        <div class="ad-howto-col">
          <div class="ad-howto-title">If you're testifying in person</div>
          <ul class="sup-selflist" style="margin-top:10px">
            <li>Sign up at the committee room's witness form when you arrive (or the online form if the committee offers one).</li>
            <li>Time limit is usually <strong>3 minutes per witness</strong>. Practice to 2:30 so you have buffer.</li>
            <li>Bring about <strong>15 paper copies</strong> of your written testimony for committee members and staff.</li>
            <li>Stick to the bill. If members ask a general question, answer briefly and steer back to the bill.</li>
            <li>"I respectfully urge a vote do-pass / do-not-pass on [bill number]" is a good closing.</li>
            <li>If you can't travel, ask the committee whether <strong>virtual testimony</strong> is available — some committees now accept it.</li>
          </ul>
        </div>
      </div>

      <details class="ad-tmpl" id="ad-testimony-tmpl">
        <summary>
          <div>
            <div class="ad-tmpl-title">${esc(TESTIMONY_TEMPLATE.title)}</div>
            <div class="ad-tmpl-ask">${esc(TESTIMONY_TEMPLATE.ask)}</div>
          </div>
          <span class="ad-tmpl-chev" aria-hidden="true">▾</span>
        </summary>
        <div class="ad-tmpl-body">
          <div class="ad-tmpl-meta"><strong>Subject line idea:</strong> ${esc(TESTIMONY_TEMPLATE.subject)}</div>
          <textarea class="form-textarea ad-tmpl-text" data-tmpl="${TESTIMONY_TEMPLATE.id}" rows="22" readonly>${esc(TESTIMONY_TEMPLATE.body)}</textarea>
          <div class="ad-tmpl-actions">
            <button class="cal-btn primary" type="button" data-copy="${TESTIMONY_TEMPLATE.id}">Copy testimony</button>
            <button class="cal-btn" type="button" data-insertstory="${TESTIMONY_TEMPLATE.id}">Insert my story</button>
            <a class="cal-btn" href="mailto:?subject=${encodeURIComponent(TESTIMONY_TEMPLATE.subject)}&body=${encodeURIComponent(TESTIMONY_TEMPLATE.body)}">Open in email</a>
            <button class="cal-btn" type="button" data-logbtn="${TESTIMONY_TEMPLATE.id}" data-logtopic="${esc(TESTIMONY_TEMPLATE.title)}">Log that I submitted this</button>
          </div>
        </div>
      </details>

      <div class="sp-privacy" style="margin-top:1.5rem">For organizers: the companion <a href="https://github.com/dougdevitre/mo-gov" target="_blank" rel="noopener">mo-gov toolkit</a> has legislator rosters, committee maps, and an Airtable-ready outreach pipeline schema if you're coordinating a campaign at scale.</div>`;

    wireAdvocacy(el);
  }

  function wireAdvocacy(el) {
    const findTemplate = (id) => AD_TEMPLATES.find((x) => x.id === id) || (TESTIMONY_TEMPLATE.id === id ? TESTIMONY_TEMPLATE : null);

    el.querySelectorAll("[data-copy]").forEach((b) => {
      b.addEventListener("click", async () => {
        const t = findTemplate(b.dataset.copy);
        if (!t) return;
        try {
          await navigator.clipboard.writeText(t.body);
          toast("Letter copied — paste into email.");
        } catch {
          const ta = el.querySelector(`.ad-tmpl-text[data-tmpl="${t.id}"]`);
          if (ta) { ta.removeAttribute("readonly"); ta.select(); document.execCommand && document.execCommand("copy"); ta.setAttribute("readonly", ""); toast("Letter copied."); }
        }
      });
    });

    el.querySelectorAll("[data-logbtn]").forEach((b) => {
      b.addEventListener("click", () => {
        el.querySelector("#ad-type").value = "Email";
        el.querySelector("#ad-topic").value = b.dataset.logtopic;
        el.querySelector("#ad-recipient").focus();
      });
    });

    el.querySelectorAll("[data-insertstory]").forEach((b) => {
      b.addEventListener("click", () => openStoryPicker(b.dataset.insertstory));
    });

    el.querySelector("#ad-log-save").addEventListener("click", () => {
      const type = el.querySelector("#ad-type").value;
      const recipient = el.querySelector("#ad-recipient").value.trim();
      const topic = el.querySelector("#ad-topic").value.trim();
      const note = el.querySelector("#ad-note").value.trim();
      if (!topic && !recipient) { toast("Add at least a topic or recipient."); return; }
      Store.push("advocacy_log", {
        id: Store.uid(), when: new Date().toISOString(), type, recipient, topic, note,
      });
      toast("Advocacy action logged.");
      renderAdvocacy(el);
    });

    el.querySelector("#ad-log-export").addEventListener("click", () => {
      const rows = Store.get("advocacy_log") || [];
      if (!rows.length) { toast("No actions logged yet."); return; }
      const header = "timestamp,type,recipient,topic,note\n";
      const body = rows.slice().sort((a, b) => a.when.localeCompare(b.when)).map((e) => {
        const esc = (s) => `"${String(s || "").replace(/"/g, '""')}"`;
        return [esc(e.when), esc(e.type), esc(e.recipient), esc(e.topic), esc(e.note)].join(",");
      }).join("\n");
      const blob = new Blob([header + body + "\n"], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nami-stl-advocacy-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
    });

    el.querySelector("#ad-log-clear").addEventListener("click", () => {
      if (!confirm("Clear your entire advocacy log? This can't be undone.")) return;
      Store.delete("advocacy_log");
      renderAdvocacy(el);
      toast("Advocacy log cleared.");
    });
  }

  // Delegate advocacy-log deletes
  document.addEventListener("click", (e) => {
    const del = e.target.closest && e.target.closest("[data-logdel]");
    if (!del) return;
    if (!confirm("Remove this logged action?")) return;
    Store.removeById("advocacy_log", del.dataset.logdel);
    const panel = document.getElementById("mod-advocacy");
    if (panel && panel.classList.contains("visible")) renderAdvocacy(panel);
  });

  // ════════════════════════════════════════
  //  SUPPORTER GUIDE (helping someone in crisis)
  // ════════════════════════════════════════
  function renderSupporter(el) {
    el.innerHTML = `
    <div class="sec-hdr"><h2>Helping someone in crisis</h2>
      <p>If you're reading this, you're already doing something right. Here's what to do and what to step back from — written for families, friends, and anyone standing with a person in a mental health crisis.</p></div>

    <div class="sp-intro">Everything below is guidance, not a substitute for crisis professionals. When in doubt, <a href="tel:988" style="color:inherit">call or text 988</a> — you don't have to be the person in crisis to call, and the line is for you too.</div>

    <div class="sup-jump">
      <a href="#sup-triage">Which number do I call?</a>
      <a href="#sup-suicide">They said they want to die</a>
      <a href="#sup-mobile">Mobile crisis vs. police</a>
      <a href="#sup-say">What to say / not say</a>
      <a href="#sup-after">After the crisis</a>
      <a href="#sup-self">Take care of yourself</a>
    </div>

    <div class="sup-section" id="sup-triage">
      <h3>Which number do I call?</h3>
      <p class="sup-lede">Three different lines for three different situations. You can always start with 988 and be redirected.</p>
      <div class="sup-triage">
        <div class="sup-triage-card call988">
          <div class="sup-triage-num"><a href="tel:988">988</a></div>
          <div class="sup-triage-tag">Call or text, 24/7</div>
          <ul>
            <li>They're expressing suicidal thoughts or feelings</li>
            <li>They're overwhelmed but safe</li>
            <li>You, the supporter, need to talk to someone</li>
            <li>You're not sure what to do next</li>
          </ul>
          <div class="sup-triage-note">Free, confidential. Text 988 or text <strong>HOME to 741741</strong> if talking feels too hard.</div>
        </div>
        <div class="sup-triage-card callbhr">
          <div class="sup-triage-num"><a href="tel:3144696644">314-469-6644</a></div>
          <div class="sup-triage-tag">BHR — St. Louis mobile crisis</div>
          <ul>
            <li>They're in active crisis and need in-person help</li>
            <li>Symptoms are escalating but not immediately life-threatening</li>
            <li>You want de-escalation and evaluation without police</li>
            <li>They'd benefit from a warm handoff to care</li>
          </ul>
          <div class="sup-triage-note">Behavioral Health Response sends trained clinicians. Serves the STL metro area.</div>
        </div>
        <div class="sup-triage-card call911">
          <div class="sup-triage-num"><a href="tel:911">911</a></div>
          <div class="sup-triage-tag">Only when life is in immediate danger</div>
          <ul>
            <li>They've attempted or are about to attempt suicide</li>
            <li>They're seriously injured</li>
            <li>A weapon is involved</li>
            <li>Someone's in immediate physical danger</li>
          </ul>
          <div class="sup-triage-note"><strong>Ask explicitly</strong> for a CIT-trained officer or mental-health response — and stay on the line to describe the situation. See the mobile-crisis section below.</div>
        </div>
      </div>
    </div>

    <div class="sup-section" id="sup-suicide">
      <h3>Someone just told me they want to die</h3>
      <p class="sup-lede">The single most important thing is that you're there. You're not expected to be a clinician.</p>
      <ol class="sup-steps">
        <li><strong>Take them seriously.</strong> Don't brush it off, don't look for the "real" meaning, don't argue with how they feel. Even if you're not sure they mean it literally, respond as if they do.</li>
        <li><strong>Ask directly.</strong> "Are you thinking about killing yourself?" Asking does not plant the idea — decades of research shows it reduces risk because the person feels seen. Use plain, direct words.</li>
        <li><strong>Listen more than you talk.</strong> Let silence happen. You don't have to fix anything in this conversation.</li>
        <li><strong>Don't leave them alone if you can help it.</strong> Stay physically present, or on the phone, or on video. If you can't be there, connect them with someone who can.</li>
        <li><strong>Reduce access to means.</strong> If there's a firearm, medication stockpile, or anything specific they've mentioned, ask if they'll let you move it somewhere else — a relative's house, a locked box, a pharmacy take-back. Means reduction is one of the most effective suicide-prevention steps that exists.</li>
        <li><strong>Call 988 together.</strong> Offer to dial it. If they say yes, put it on speaker. If they say no, ask if you can call for guidance on their behalf — you can.</li>
        <li><strong>Call 911 only if life is in immediate danger</strong> (attempt in progress, weapon being used, serious injury). Tell dispatch "this is a mental health emergency" and ask for a CIT officer.</li>
        <li><strong>Make a plan for the next 24 hours.</strong> Who will be with them tonight? Who will check in tomorrow morning? Write it down.</li>
      </ol>
      <p class="sup-footnote">Don't promise you won't tell anyone. Their safety is more important than that promise, and they usually understand that when they've calmed down.</p>
    </div>

    <div class="sup-section" id="sup-mobile">
      <h3>How to get mobile crisis instead of police</h3>
      <p class="sup-lede">Police aren't always the right first responder to a mental-health crisis. In St. Louis, you usually have better options.</p>
      <ol class="sup-steps">
        <li><strong>If the situation allows any wait at all</strong>, call BHR first at <a href="tel:3144696644">314-469-6644</a>. Mobile clinicians are trained for this; police are trained for a different job.</li>
        <li><strong>When you call, tell them plainly:</strong> "I need a mobile crisis response for a mental health emergency. No weapons. No immediate danger to life. I'm the [relationship] of the person." Give the address.</li>
        <li><strong>If you do have to call 911</strong> — because there's a weapon, an attempt in progress, or a risk to others — the words you use matter:
          <ul>
            <li>"This is a mental health emergency, not a crime."</li>
            <li>"Please send a CIT-trained officer or co-responder team."</li>
            <li>"The person is not violent. Lights and sirens will make things worse."</li>
            <li>"Please don't draw weapons. They are [holding / unarmed / in their room]."</li>
          </ul>
        </li>
        <li><strong>Stay on the line</strong> to keep updating dispatch. You're giving officers context they need.</li>
        <li><strong>Meet responders outside</strong> if safe. Brief them calmly before they enter. Tell them what de-escalates this person, what their triggers are, and what their diagnoses are if you know them.</li>
        <li><strong>Know your rights about the 96-hour hold.</strong> In Missouri (RSMo 632.305), a person can be held up to 96 hours for evaluation if a clinician believes they're a danger to self or others. They keep their civil rights throughout — including the right to a hearing, a lawyer, and to refuse most non-emergency treatment.</li>
      </ol>
    </div>

    <div class="sup-section" id="sup-say">
      <h3>What to say / not say</h3>
      <div class="sup-saysplit">
        <div class="sup-saycol do">
          <div class="sup-saycol-hd">Helpful</div>
          <ul>
            <li>"I'm so glad you told me."</li>
            <li>"You don't have to explain it perfectly."</li>
            <li>"I want to understand what this is like for you."</li>
            <li>"You're not alone in this. I'm staying."</li>
            <li>"Let's figure out the next hour together."</li>
            <li>"Have you been thinking about suicide?" (direct, calm)</li>
            <li>"What would help most right now?"</li>
            <li>"You don't have to feel better to be worth staying."</li>
          </ul>
        </div>
        <div class="sup-saycol dont">
          <div class="sup-saycol-hd">Step back from</div>
          <ul>
            <li>"It could be worse / other people have it harder."</li>
            <li>"You have so much to live for."</li>
            <li>"Just think positive / don't dwell on it."</li>
            <li>"Promise me you won't do anything."</li>
            <li>"I won't tell anyone, I promise."</li>
            <li>Arguing about whether the feelings are rational.</li>
            <li>Making it about you: "How could you do this to me?"</li>
            <li>Trying to talk them out of hopelessness with logic.</li>
          </ul>
        </div>
      </div>
      <p class="sup-footnote">Everything on the left side is doing one thing: telling the person they're a human being worth being with. That is the job.</p>
    </div>

    <div class="sup-section" id="sup-after">
      <h3>After the crisis</h3>
      <p class="sup-lede">The hours and days after an acute crisis are where relapse prevention lives.</p>
      <ol class="sup-steps">
        <li><strong>Follow up within 24 hours.</strong> A text, a drive-by, a meal. Research on "caring contacts" shows that simple follow-ups reduce re-attempt rates.</li>
        <li><strong>Help them build a safety plan</strong> (we have a builder at <a href="#safetyplan">Safety plan</a>). Doing it together is a connecting act and a clinical intervention at once.</li>
        <li><strong>Encourage — don't push — professional care.</strong> Offer to help find a therapist, go to a first appointment, or call to schedule. People in recovery tell us the scheduling step is often the hardest.</li>
        <li><strong>Pay attention to the anniversary.</strong> The date of an attempt or a loss can be a risk window years later. Reach out proactively.</li>
        <li><strong>Avoid "the talk."</strong> Don't schedule a heavy sit-down every time — ongoing small check-ins are more sustainable and less shame-inducing.</li>
      </ol>
    </div>

    <div class="sup-section" id="sup-self">
      <h3>Take care of yourself</h3>
      <p class="sup-lede">You are not responsible for keeping another person alive through willpower. You can only be a consistent, caring presence — which is a lot.</p>
      <ul class="sup-selflist">
        <li><strong>Join a family support group.</strong> NAMI St. Louis runs free ones. <a href="#programs">See programs</a>.</li>
        <li><strong>Take NAMI Family-to-Family.</strong> Eight free sessions taught by family members who've been where you are. <a href="#programs">Programs</a>.</li>
        <li><strong>Call the NAMI HelpLine</strong> — <a href="tel:18009506264">1-800-950-NAMI (6264)</a>, Mon–Fri 9am–9pm CT. It's for supporters too.</li>
        <li><strong>Notice your own warning signs.</strong> Caregiving without care goes bad. Sleep, eat, move, tell your own doctor, keep your own therapist.</li>
        <li><strong>Set boundaries you can keep.</strong> "I love you and I can't drive over at 3am anymore — but I'll call every morning at 8." A kept small promise beats a broken big one.</li>
      </ul>
    </div>`;
  }

  // ════════════════════════════════════════
  //  PERSONAL STORY BANK (reusable testimony)
  // ════════════════════════════════════════
  const STORY_TOPICS = [
    "988 / crisis",
    "Police / CIT",
    "Insurance / parity",
    "96-hour hold",
    "Youth / school",
    "Family / caregiver",
    "Recovery / peer",
    "Housing",
    "General",
  ];

  let storyEditingId = null;

  function renderStories(el) {
    const stories = (Store.get("stories") || []).slice().sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));
    const filter = sessionStorage.getItem("nami_stories_filter") || "";
    const filtered = filter ? stories.filter((s) => (s.topics || []).includes(filter)) : stories;

    let html = `<div class="sec-hdr"><h2>Your story bank</h2>
      <p>A personal story — even two sentences — is often the most persuasive part of any advocacy letter, testimony, or social post. Write your paragraphs here once, then reuse them everywhere.</p></div>
      <div class="sp-intro">Stays on this device. Nothing is sent anywhere. Use <em>Export</em> below to keep a copy. On the <a href="#advocacy">Advocacy</a> page, each letter template has an <em>Insert my story</em> button that pulls from this bank.</div>

      <details class="story-help">
        <summary>Writing prompts — if you're stuck</summary>
        <ul>
          <li>What pulled you into caring about mental health? The one moment.</li>
          <li>A time the system failed you, or someone you love.</li>
          <li>A time care worked — and what was different about it.</li>
          <li>What do you wish your state legislator understood? One sentence.</li>
          <li>Why Missouri specifically — something you've seen here.</li>
          <li>If you had sixty seconds at a committee hearing, what would you say?</li>
        </ul>
      </details>

      <details class="story-help">
        <summary>A note on safe storytelling</summary>
        <ul>
          <li>Focus on your feelings and what you did — not specific methods or graphic descriptions.</li>
          <li>"I was struggling" or "I was in a very dark place" is enough.</li>
          <li>Say someone "died by suicide" rather than using graphic language.</li>
          <li>You own your story. Share what's safe — and only what's safe — for you.</li>
          <li>If your story mentions someone else, consider whether they'd want it shared.</li>
        </ul>
      </details>

      <div class="sec-hdr" style="margin-top:1.25rem"><h3>${storyEditingId ? "Edit story" : "Write a story"}</h3></div>
      <div class="story-form">
        <input class="form-input" id="story-title" placeholder="Title (optional — e.g. 'Why 988 matters to me')" />
        <div class="story-topic-picker" role="group" aria-label="Topics">
          ${STORY_TOPICS.map((t) => `<button type="button" class="ci-tag" data-storytopic="${esc(t)}">${esc(t)}</button>`).join("")}
        </div>
        <textarea class="form-textarea" id="story-body" placeholder="Write as much or as little as feels right. One paragraph is often more powerful than a page." rows="6"></textarea>
        <div class="story-form-actions">
          <button type="button" class="cal-btn primary" id="story-save">${storyEditingId ? "Save changes" : "Save story"}</button>
          ${storyEditingId ? `<button type="button" class="cal-btn" id="story-cancel">Cancel edit</button>` : ""}
        </div>
      </div>

      <div class="sec-hdr" style="margin-top:1.5rem"><h3>Your stories${stories.length ? ` (${stories.length})` : ""}</h3></div>`;

    if (stories.length) {
      html += `<div class="story-filter" role="group" aria-label="Filter by topic">
        <button type="button" class="ci-tag ${!filter ? "selected" : ""}" data-storyfilter="">All</button>
        ${STORY_TOPICS.map((t) => `<button type="button" class="ci-tag ${filter === t ? "selected" : ""}" data-storyfilter="${esc(t)}">${esc(t)}</button>`).join("")}
      </div>`;
    }

    if (!filtered.length) {
      html += `<div class="ci-empty">${stories.length ? "No stories with that topic yet." : "No stories yet. Write your first one above."}</div>`;
    } else {
      html += `<div class="story-list">`;
      filtered.forEach((s) => {
        const topics = (s.topics || []).map((t) => `<span class="ci-entry-tag">${esc(t)}</span>`).join("");
        const preview = esc((s.body || "").slice(0, 320)) + ((s.body || "").length > 320 ? "…" : "");
        const when = new Date(s.updated || s.created || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        html += `<article class="story-card" data-id="${s.id}">
          <div class="story-card-head">
            <div class="story-card-headings">
              ${s.title ? `<div class="story-card-title">${esc(s.title)}</div>` : `<div class="story-card-title story-untitled">(Untitled)</div>`}
              <div class="story-card-meta">${when}</div>
            </div>
            <div class="story-card-actions">
              <button type="button" class="cal-btn" data-storycopy="${s.id}">Copy</button>
              <button type="button" class="cal-btn" data-storyedit="${s.id}">Edit</button>
              <button type="button" class="cal-btn" data-storydel="${s.id}" style="color:var(--tag-danger-tx)">Delete</button>
            </div>
          </div>
          <div class="story-card-body">${preview}</div>
          ${topics ? `<div class="ci-entry-tags">${topics}</div>` : ""}
        </article>`;
      });
      html += `</div>`;
    }

    html += `<div class="ci-actions" style="margin-top:1rem">
      <button type="button" class="cal-btn" id="story-export">Export all as text</button>
      <button type="button" class="cal-btn" id="story-clear" style="color:var(--tag-danger-tx)">Clear all stories</button>
    </div>`;

    el.innerHTML = html;
    wireStories(el, stories);
  }

  function wireStories(el, stories) {
    const titleEl = el.querySelector("#story-title");
    const bodyEl = el.querySelector("#story-body");
    const pickedTopics = new Set();

    const setTopicButtons = () => {
      el.querySelectorAll("[data-storytopic]").forEach((b) => b.classList.toggle("selected", pickedTopics.has(b.dataset.storytopic)));
    };

    if (storyEditingId) {
      const cur = stories.find((x) => x.id === storyEditingId);
      if (cur) {
        titleEl.value = cur.title || "";
        bodyEl.value = cur.body || "";
        (cur.topics || []).forEach((t) => pickedTopics.add(t));
        setTopicButtons();
      } else {
        storyEditingId = null;
      }
    }

    el.querySelectorAll("[data-storytopic]").forEach((b) => {
      b.addEventListener("click", () => {
        const t = b.dataset.storytopic;
        if (pickedTopics.has(t)) pickedTopics.delete(t); else pickedTopics.add(t);
        setTopicButtons();
      });
    });

    el.querySelector("#story-save").addEventListener("click", () => {
      const title = titleEl.value.trim();
      const body = bodyEl.value.trim();
      if (!body) { toast("Write something first."); bodyEl.focus(); return; }
      const now = new Date().toISOString();
      const current = Store.get("stories") || [];
      if (storyEditingId) {
        const idx = current.findIndex((s) => s.id === storyEditingId);
        if (idx >= 0) {
          current[idx] = { ...current[idx], title, body, topics: [...pickedTopics], updated: now };
          Store.set("stories", current);
          storyEditingId = null;
          toast("Story updated.");
        }
      } else {
        current.push({ id: Store.uid(), title, body, topics: [...pickedTopics], created: now, updated: now });
        Store.set("stories", current);
        toast("Story saved.");
      }
      renderStories(el);
    });

    const cancelBtn = el.querySelector("#story-cancel");
    if (cancelBtn) cancelBtn.addEventListener("click", () => { storyEditingId = null; renderStories(el); });

    el.querySelectorAll("[data-storyfilter]").forEach((b) => {
      b.addEventListener("click", () => {
        sessionStorage.setItem("nami_stories_filter", b.dataset.storyfilter);
        renderStories(el);
      });
    });

    el.querySelectorAll("[data-storycopy]").forEach((b) => {
      b.addEventListener("click", async () => {
        const s = (Store.get("stories") || []).find((x) => x.id === b.dataset.storycopy);
        if (!s) return;
        try {
          await navigator.clipboard.writeText(s.body || "");
          toast("Story copied to clipboard.");
        } catch {
          toast("Couldn't access clipboard — select and copy manually.");
        }
      });
    });

    el.querySelectorAll("[data-storyedit]").forEach((b) => {
      b.addEventListener("click", () => {
        storyEditingId = b.dataset.storyedit;
        renderStories(el);
        setTimeout(() => el.querySelector("#story-title")?.focus(), 0);
        el.querySelector(".story-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    el.querySelectorAll("[data-storydel]").forEach((b) => {
      b.addEventListener("click", () => {
        if (!confirm("Delete this story? This can't be undone.")) return;
        Store.removeById("stories", b.dataset.storydel);
        toast("Story deleted.");
        renderStories(el);
      });
    });

    el.querySelector("#story-export").addEventListener("click", () => {
      const rows = Store.get("stories") || [];
      if (!rows.length) { toast("No stories to export yet."); return; }
      const body = rows.slice().sort((a, b) => (b.updated || "").localeCompare(a.updated || "")).map((s) => {
        const when = new Date(s.updated || s.created).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const tags = (s.topics || []).length ? `Topics: ${(s.topics || []).join(", ")}\n` : "";
        return `${"=".repeat(60)}\n${s.title || "(Untitled)"}\nUpdated: ${when}\n${tags}\n${s.body}\n`;
      }).join("\n");
      const blob = new Blob([`My story bank — NAMI STL Community Hub\nExported ${new Date().toLocaleString()}\n\n${body}\n`], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nami-stl-stories-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
    });

    el.querySelector("#story-clear").addEventListener("click", () => {
      if (!confirm("Clear every story from this device? This can't be undone.")) return;
      Store.delete("stories");
      storyEditingId = null;
      sessionStorage.removeItem("nami_stories_filter");
      renderStories(el);
      toast("Stories cleared.");
    });
  }

  // Picker overlay for inserting a story into an advocacy template
  function openStoryPicker(templateId) {
    const stories = Store.get("stories") || [];
    if (!stories.length) {
      if (confirm("You haven't written any stories yet. Open the Stories page to write one?")) location.hash = "stories";
      return;
    }
    let overlay = document.getElementById("detail-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "detail-overlay";
      overlay.className = "detail-overlay";
      overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
      document.body.appendChild(overlay);
    }
    const list = stories.slice().sort((a, b) => (b.updated || "").localeCompare(a.updated || "")).map((s) => {
      const preview = esc((s.body || "").slice(0, 220)) + ((s.body || "").length > 220 ? "…" : "");
      return `<button type="button" class="story-pick" data-pickid="${s.id}">
        <div class="story-pick-title">${esc(s.title || "(Untitled)")}</div>
        <div class="story-pick-body">${preview}</div>
      </button>`;
    }).join("");
    overlay.innerHTML = `<div class="detail-panel" role="dialog" aria-modal="true" aria-labelledby="sp-title">
      <button class="detail-close" aria-label="Close" onclick="document.getElementById('detail-overlay').classList.remove('open')">&times;</button>
      <h3 id="sp-title" style="font-size:18px; font-weight:700; margin-bottom:4px">Pick a story to insert</h3>
      <p style="font-size:13px; color:var(--tx-1); line-height:1.55; margin-bottom:12px">It will replace the first <code>[bracketed prompt]</code> in the letter. You can edit before copying.</p>
      <div class="story-pick-list">${list}</div>
      <p style="font-size:12px; color:var(--tx-2); margin-top:12px">Need to write a new one? <a href="#stories" onclick="document.getElementById('detail-overlay').classList.remove('open')">Go to Stories &rarr;</a></p>
    </div>`;
    overlay.classList.add("open");
    overlay.querySelectorAll("[data-pickid]").forEach((b) => {
      b.addEventListener("click", () => {
        const s = (Store.get("stories") || []).find((x) => x.id === b.dataset.pickid);
        if (s) insertStoryIntoTemplate(templateId, s.body || "");
        overlay.classList.remove("open");
      });
    });
  }

  function insertStoryIntoTemplate(templateId, storyBody) {
    const ta = document.querySelector(`.ad-tmpl-text[data-tmpl="${templateId}"]`);
    if (!ta) return;
    ta.removeAttribute("readonly");
    const text = ta.value;
    const open = text.indexOf("[");
    const close = text.indexOf("]", open + 1);
    if (open >= 0 && close > open) {
      ta.value = text.slice(0, open) + storyBody + text.slice(close + 1);
    } else {
      ta.value = text + "\n\n" + storyBody;
    }
    ta.focus();
    toast("Story inserted — edit and copy when ready.");
  }

  // ════════════════════════════════════════
  //  GLOBAL SEARCH (offline-safe, static index)
  // ════════════════════════════════════════
  function buildSearchIndex() {
    const ix = [];

    (window.PROGRAMS_DATA || []).forEach((p) => {
      ix.push({
        title: p.name,
        cat: "Program",
        sub: p.category,
        body: [p.summary, p.description, (p.tags || []).join(" "), p.audience, p.format, p.cost].filter(Boolean).join(" "),
        hash: "#programs",
        action: () => window.showProgramDetail && window.showProgramDetail(p.id),
      });
    });

    Object.keys(window.RESOURCES_DATA || {}).forEach((k) => {
      const sec = window.RESOURCES_DATA[k] || {};
      (sec.items || []).forEach((it) => {
        ix.push({
          title: it.name,
          cat: "Resource",
          sub: sec.title || "",
          body: (it.detail || "") + " " + (sec.title || ""),
          hash: "#resources",
          href: it.url,
        });
      });
    });

    Object.keys(window.POLICY_DATA || {}).forEach((k) => {
      const pol = window.POLICY_DATA[k] || {};
      ix.push({
        title: pol.title || k,
        cat: "Policy",
        sub: pol.tab || "",
        body: [pol.description, ...(pol.stats || []).map((s) => `${s.label} ${s.sub || ""}`), ...(pol.cards || []).map((c) => `${c.title || ""} ${c.body || ""}`)].filter(Boolean).join(" "),
        hash: "#policy/" + k,
      });
    });

    AD_TEMPLATES.forEach((t) => {
      ix.push({
        title: t.title,
        cat: "Advocacy letter",
        sub: "Copy + send",
        body: (t.ask || "") + " " + (t.subject || "") + " " + (t.body || "").slice(0, 400),
        hash: "#advocacy",
      });
    });

    ix.push({
      title: "Written testimony (any bill)",
      cat: "Advocacy letter",
      sub: "Template + how-to",
      body: "testimony witness slip committee hearing written submit chair bill support oppose Jefferson City",
      hash: "#advocacy",
      scrollTo: "ad-testimony",
    });
    ix.push({
      title: "How to testify on a Missouri bill",
      cat: "Advocacy",
      sub: "Step 6 — testimony guide",
      body: "written testimony in-person three minutes committee hearing chair email virtual testimony bill number position support oppose Jefferson City witness form",
      hash: "#advocacy",
      scrollTo: "ad-testimony",
    });

    MO_COMMITTEES.forEach((c) => {
      ix.push({
        title: `${c.chamber} — ${c.name}`,
        cat: "Committee",
        sub: "Missouri legislature",
        body: c.covers,
        hash: "#advocacy",
      });
    });

    Object.keys(COPE_TOOLS).forEach((k) => {
      const t = COPE_TOOLS[k];
      ix.push({
        title: t.title,
        cat: "Coping tool",
        sub: "Grounding exercise",
        body: t.desc,
        hash: "#coping/" + k,
      });
    });

    const supSections = [
      { title: "Which number do I call? (988 / BHR / 911)", anchor: "sup-triage", body: "988 mobile crisis BHR 314-469-6644 911 Behavioral Health Response triage call text" },
      { title: "Someone just told me they want to die", anchor: "sup-suicide", body: "suicide suicidal thoughts ask directly Columbia protocol means reduction stay safety plan" },
      { title: "How to get mobile crisis instead of police", anchor: "sup-mobile", body: "BHR CIT police dispatch 911 mental health emergency 96-hour hold RSMo" },
      { title: "What to say / not say to someone in crisis", anchor: "sup-say", body: "helpful unhelpful phrases validation listen don't promise secrecy" },
      { title: "After the crisis (caring contacts)", anchor: "sup-after", body: "caring contacts follow up safety plan anniversary therapist" },
      { title: "Take care of yourself (for supporters)", anchor: "sup-self", body: "family support group Family-to-Family NAMI HelpLine burnout boundaries caregiver" },
    ];
    supSections.forEach((s) => {
      ix.push({ title: s.title, cat: "Helping someone", sub: "Supporter guide", body: s.body, hash: "#supporter", scrollTo: s.anchor });
    });

    [
      { title: "Safety plan", sub: "Build yours", body: "Stanley-Brown suicide plan reasons for living warning signs coping supports professionals means", hash: "#safetyplan" },
      { title: "Wallet crisis card", sub: "Fold-and-carry", body: "printable fold pocket wallet card crisis 988 BHR 911 carry", hash: "#safetyplan/wallet" },
      { title: "Mood check-in", sub: "Private, on-device", body: "mood tracking check-in chart CSV export faces emotions clinician", hash: "#checkin" },
      { title: "My advocacy log", sub: "Personal tracker", body: "advocacy log letters calls legislators export CSV testimony", hash: "#advocacy" },
      { title: "Community board", sub: "Share with the community", body: "community posts announcements stories questions", hash: "#community" },
      { title: "Community calendar", sub: "Events and groups", body: "events calendar support groups trainings fundraisers volunteer meetings", hash: "#calendar" },
      { title: "Volunteer opportunities", sub: "Give a few hours", body: "volunteer NAMI walks helpline peer-to-peer family-to-family registration", hash: "#volunteers" },
      { title: "Display & reading options", sub: "Accessibility", body: "text size large XL contrast high motion reduced", hash: "" },
    ].forEach((p) => { p.cat = "Page"; ix.push(p); });

    return ix;
  }

  let SEARCH_INDEX = null;
  function getIndex() { if (!SEARCH_INDEX) SEARCH_INDEX = buildSearchIndex(); return SEARCH_INDEX; }

  function runSearch(query) {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    const results = [];
    getIndex().forEach((item) => {
      const title = (item.title || "").toLowerCase();
      const sub = (item.sub || "").toLowerCase();
      const body = (item.body || "").toLowerCase();
      let score = 0;
      let allMatch = true;
      for (const t of tokens) {
        const inTitle = title.includes(t);
        const inSub = sub.includes(t);
        const inBody = body.includes(t);
        if (!inTitle && !inSub && !inBody) { allMatch = false; break; }
        score += (inTitle ? 6 : 0) + (inSub ? 3 : 0) + (inBody ? 1 : 0);
        if (title.startsWith(t)) score += 4;
      }
      if (allMatch) results.push({ item, score });
    });
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 12).map((r) => r.item);
  }

  let searchSelected = 0;
  function openSearch() {
    let ov = document.getElementById("search-overlay");
    if (!ov) {
      ov = document.createElement("div");
      ov.id = "search-overlay";
      ov.className = "search-overlay";
      ov.innerHTML = `<div class="search-panel" role="dialog" aria-modal="true" aria-label="Search">
          <div class="search-input-wrap">
            <span class="search-input-ico" aria-hidden="true">&#9906;</span>
            <input type="search" id="search-input" placeholder="Search programs, resources, advocacy templates, committees…" autocomplete="off" spellcheck="false" />
            <button type="button" class="search-close" aria-label="Close">&times;</button>
          </div>
          <div class="search-results" id="search-results" role="listbox" aria-label="Results"></div>
          <div class="search-hint"><kbd>&uarr;</kbd><kbd>&darr;</kbd> navigate &middot; <kbd>Enter</kbd> open &middot; <kbd>Esc</kbd> close</div>
        </div>`;
      document.body.appendChild(ov);
      ov.addEventListener("click", (e) => { if (e.target === ov) closeSearch(); });
      ov.querySelector(".search-close").addEventListener("click", closeSearch);
      const input = ov.querySelector("#search-input");
      input.addEventListener("input", () => { searchSelected = 0; paintResults(input.value); });
      input.addEventListener("keydown", handleSearchKey);
    }
    ov.classList.add("open");
    const input = ov.querySelector("#search-input");
    input.value = "";
    searchSelected = 0;
    paintResults("");
    setTimeout(() => input.focus(), 10);
  }

  function closeSearch() {
    const ov = document.getElementById("search-overlay");
    if (ov) ov.classList.remove("open");
  }

  function paintResults(q) {
    const list = document.getElementById("search-results");
    if (!list) return;
    const results = runSearch(q);
    if (!q) {
      list.innerHTML = `<div class="search-empty">Type to search across programs, resources, policy, advocacy, coping tools, and the supporter guide.</div>`;
      return;
    }
    if (!results.length) {
      list.innerHTML = `<div class="search-empty">No matches for "${esc(q)}". Try a different word, or <a href="#resources">browse resources</a>.</div>`;
      return;
    }
    list.innerHTML = results.map((r, i) => `
      <button type="button" class="search-result ${i === searchSelected ? "selected" : ""}" data-i="${i}" role="option" aria-selected="${i === searchSelected}">
        <div class="search-result-main">
          <div class="search-result-title">${esc(r.title)}</div>
          <div class="search-result-sub">${esc(r.sub || "")}</div>
        </div>
        <div class="search-result-cat">${esc(r.cat || "")}</div>
      </button>`).join("");
    list.querySelectorAll(".search-result").forEach((btn) => {
      btn.addEventListener("click", () => gotoResult(results[Number(btn.dataset.i)]));
      btn.addEventListener("mouseenter", () => { searchSelected = Number(btn.dataset.i); markSelected(); });
    });
  }

  function markSelected() {
    document.querySelectorAll(".search-result").forEach((el, i) => {
      el.classList.toggle("selected", i === searchSelected);
      el.setAttribute("aria-selected", i === searchSelected ? "true" : "false");
      if (i === searchSelected) el.scrollIntoView({ block: "nearest" });
    });
  }

  function handleSearchKey(e) {
    const list = document.getElementById("search-results");
    const count = list ? list.querySelectorAll(".search-result").length : 0;
    if (e.key === "ArrowDown") { e.preventDefault(); if (count) { searchSelected = (searchSelected + 1) % count; markSelected(); } }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (count) { searchSelected = (searchSelected - 1 + count) % count; markSelected(); } }
    else if (e.key === "Enter") {
      e.preventDefault();
      const current = document.querySelector(".search-result.selected");
      if (current) current.click();
    }
  }

  function gotoResult(r) {
    closeSearch();
    if (r.href) { window.open(r.href, "_blank", "noopener,noreferrer"); return; }
    if (r.hash) {
      if (location.hash === r.hash) {
        const route = getRoute();
        showModule(route.module, route.sub);
      } else {
        location.hash = r.hash;
      }
    }
    setTimeout(() => {
      if (r.scrollTo) {
        const el = document.getElementById(r.scrollTo);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (r.action) r.action();
    }, 120);
  }

  function isTypingTarget(t) {
    if (!t) return false;
    if (t.isContentEditable) return true;
    const tag = t.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !isTypingTarget(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      openSearch();
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
  });

  const st = document.getElementById("search-trigger");
  if (st) st.addEventListener("click", openSearch);

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
