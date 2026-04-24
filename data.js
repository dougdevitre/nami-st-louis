// Unified data layer for the NAMI STL Community Hub.
//
// Two backends behind one API:
//   - "local"    — browser localStorage via Store (the historical behavior)
//   - "supabase" — Postgres + auth via supabase-js, loaded from CDN
//
// Which one runs is decided at boot by the presence of window.NAMI_CONFIG
// (populated from config.js, which is gitignored). With no config the site
// behaves exactly as it always has. With config present, the shared calendar
// switches to the remote backend; every other module stays on-device.
//
// Public surface:
//   NamiData.mode                                 "local" | "supabase"
//   NamiData.events.cached()                      sync read of current list
//   NamiData.events.refresh()                     pull latest, emit change
//   NamiData.events.create(event)                 async; may throw if unauthed
//   NamiData.events.deleteById(id)                async
//   NamiData.events.approve(id)                   async; moderator-only server-side
//   NamiData.events.listPending()                 async; moderator-only
//   NamiData.events.onChange(cb)                  returns an unsubscribe fn
//   NamiData.auth.user() / isModerator()          sync cached accessors
//   NamiData.auth.signIn(email)                   async; magic-link
//   NamiData.auth.signOut()                       async
//   NamiData.auth.onChange(cb)                    returns an unsubscribe fn

(function () {
  const cfg = (typeof window !== "undefined" && window.NAMI_CONFIG) || {};
  const mode = cfg.supabaseUrl && cfg.supabaseAnonKey ? "supabase" : "local";

  // === Tiny event bus ===
  const listeners = {};
  function on(event, cb) { (listeners[event] = listeners[event] || []).push(cb); return () => off(event, cb); }
  function off(event, cb) { listeners[event] = (listeners[event] || []).filter((f) => f !== cb); }
  function emit(event) { (listeners[event] || []).slice().forEach((cb) => { try { cb(); } catch (e) { console.error(e); } }); }

  // === Sync cache (so render functions stay synchronous) ===
  const cache = { events: null, user: null, isModerator: false };

  // === Local implementation — mirrors the legacy Store behavior ===
  const localBackend = {
    async listEvents() { return (Store.get("events") || []).slice(); },
    async listPending() { return []; },
    async createEvent(event) {
      const full = { ...event, id: Store.uid(), created: new Date().toISOString(), status: "approved" };
      Store.push("events", full);
      return full;
    },
    async deleteEvent(id) { Store.removeById("events", id); return true; },
    async approveEvent() { return true; },
    async getUser() { return null; },
    async isModerator() { return false; },
    async signIn() { throw new Error("Sign-in is only available when the site is connected to Supabase."); },
    async signOut() {},
  };

  // === Supabase implementation — lazy-loaded from CDN ===
  let client = null;
  let supabaseLoad = null;

  function loadSupabaseSdk() {
    if (window.supabase) return Promise.resolve();
    if (supabaseLoad) return supabaseLoad;
    supabaseLoad = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js";
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Couldn't load supabase-js"));
      document.head.appendChild(s);
    });
    return supabaseLoad;
  }

  async function ensureClient() {
    if (client) return client;
    await loadSupabaseSdk();
    client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    client.auth.onAuthStateChange(async (_evt, session) => {
      cache.user = session ? session.user : null;
      cache.isModerator = await refreshModeratorFlag();
      emit("auth:change");
      // Re-pull events after auth change so pending rows appear/disappear correctly
      refreshEvents();
    });
    const { data: { session } } = await client.auth.getSession();
    cache.user = session ? session.user : null;
    cache.isModerator = await refreshModeratorFlag();
    return client;
  }

  async function refreshModeratorFlag() {
    if (!client || !cache.user) return false;
    const { data, error } = await client.from("user_roles").select("role").eq("user_id", cache.user.id);
    if (error) { console.warn("user_roles check failed", error.message); return false; }
    return (data || []).some((r) => r.role === "moderator" || r.role === "admin");
  }

  function toLocalShape(row) {
    return {
      id: row.id,
      title: row.title || "",
      date: row.date,
      time: row.time || "",
      type: row.type || "other",
      location: row.location || "",
      description: row.description || "",
      author: row.author_name || "",
      status: row.status || "approved",
      created: row.created_at || new Date().toISOString(),
    };
  }

  const remoteBackend = {
    async listEvents() {
      const c = await ensureClient();
      // RLS will include approved events + the caller's own pending rows
      const { data, error } = await c.from("events").select("*").order("date", { ascending: true });
      if (error) { console.error(error); return Store.get("events") || []; }
      return (data || []).map(toLocalShape);
    },
    async listPending() {
      const c = await ensureClient();
      if (!cache.isModerator) return [];
      const { data, error } = await c.from("events").select("*").eq("status", "pending").order("created_at", { ascending: false });
      if (error) { console.error(error); return []; }
      return (data || []).map(toLocalShape);
    },
    async createEvent(event) {
      const c = await ensureClient();
      if (!cache.user) throw new Error("Sign in to post an event.");
      const row = {
        title: event.title,
        date: event.date,
        time: event.time || null,
        type: event.type || null,
        location: event.location || null,
        description: event.description || null,
        author_id: cache.user.id,
        author_name: event.author || (cache.user.email || "").split("@")[0] || null,
        status: "pending",
      };
      const { data, error } = await c.from("events").insert(row).select();
      if (error) throw error;
      return toLocalShape(data[0]);
    },
    async deleteEvent(id) {
      const c = await ensureClient();
      const { error } = await c.from("events").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    async approveEvent(id) {
      const c = await ensureClient();
      const { error } = await c.from("events").update({ status: "approved" }).eq("id", id);
      if (error) throw error;
      return true;
    },
    async getUser() { return cache.user; },
    async isModerator() { return cache.isModerator; },
    async signIn(email) {
      const c = await ensureClient();
      const { error } = await c.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href } });
      if (error) throw error;
    },
    async signOut() {
      const c = await ensureClient();
      await c.auth.signOut();
    },
  };

  const backend = mode === "supabase" ? remoteBackend : localBackend;

  async function refreshEvents() {
    try {
      cache.events = await backend.listEvents();
    } catch (e) {
      console.error("refreshEvents", e);
      cache.events = cache.events || [];
    }
    emit("events:change");
  }

  // === Public API ===
  const NamiData = {
    mode,
    events: {
      cached() { return Array.isArray(cache.events) ? cache.events.slice() : null; },
      async refresh() { await refreshEvents(); return cache.events; },
      async create(event) { const row = await backend.createEvent(event); await refreshEvents(); return row; },
      async deleteById(id) { await backend.deleteEvent(id); await refreshEvents(); },
      async approve(id) { await backend.approveEvent(id); await refreshEvents(); },
      async listPending() { return backend.listPending(); },
      onChange(cb) { return on("events:change", cb); },
    },
    auth: {
      user() { return cache.user; },
      isModerator() { return cache.isModerator; },
      async signIn(email) { await backend.signIn(email); },
      async signOut() { await backend.signOut(); },
      onChange(cb) { return on("auth:change", cb); },
    },
  };

  window.NamiData = NamiData;

  // === Boot ===
  if (mode === "supabase") {
    ensureClient().then(refreshEvents).catch((e) => {
      console.error("Supabase init failed — falling back to local events.", e);
      backend.listEvents = localBackend.listEvents;
      refreshEvents();
    });
  } else {
    refreshEvents();
  }
})();
