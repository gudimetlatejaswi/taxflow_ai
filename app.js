(() => {
  "use strict";

  const $app = document.getElementById("app");

  const roles = {
    preparer: { name: "Tax Preparer", person: "Tejaswi ", initials: "TG", subtitle: "Northstar Tax Group" },
    reviewer: { name: "Reviewer", person: "Maya Patel", initials: "MP", subtitle: "Quality & Compliance" },
    client: { name: "Individual Client", person: "Avery Chen", initials: "AC", subtitle: "2025 Personal Return" },
    owner: { name: "Business Owner", person: "Jordan Lee", initials: "JL", subtitle: "Morgan & Lee Consulting" },
    admin: { name: "Firm Administrator", person: "Noah Williams", initials: "NW", subtitle: "Northstar Tax Group" },
    seasonal: { name: "Seasonal Staff", person: "Elena Garcia", initials: "EG", subtitle: "Restricted access" }
  };

  const statusLabels = {
    intake: "Intake",
    gathering: "Gathering documents",
    preparation: "In preparation",
    client_action: "Waiting on client",
    review: "Ready for review",
    changes: "Changes requested",
    signature: "Ready for signature",
    filed: "Filed"
  };

  const returns = [
    {
      id: "RET-1048", client: "Morgan & Lee Consulting LLC", type: "1120-S", year: 2025,
      deadline: "Sep 15", status: "client_action", progress: 62, owner: "Tejaswi Rao", reviewer: "Maya Patel",
      blocker: "Missing contractor income confirmation", next: "Client confirms 1099-NEC discrepancy", priority: 97,
      risk: 89, openItems: 3, docs: 38, messages: 7, updated: "12 min ago", segment: "Business"
    },
    {
      id: "RET-1039", client: "Avery Chen", type: "1040", year: 2025,
      deadline: "Apr 15", status: "review", progress: 81, owner: "Tejaswi Rao", reviewer: "Maya Patel",
      blocker: "None", next: "Reviewer validates Schedule C", priority: 91,
      risk: 76, openItems: 2, docs: 24, messages: 3, updated: "26 min ago", segment: "Individual"
    },
    {
      id: "RET-1055", client: "Brightside Studio LLC", type: "1065", year: 2025,
      deadline: "Sep 15", status: "preparation", progress: 48, owner: "Elena Garcia", reviewer: "Maya Patel",
      blocker: "Depreciation schedule incomplete", next: "Preparer completes fixed asset review", priority: 84,
      risk: 71, openItems: 5, docs: 47, messages: 9, updated: "1 hr ago", segment: "Business"
    },
    {
      id: "RET-1017", client: "Nora Thompson", type: "1040", year: 2025,
      deadline: "Apr 15", status: "changes", progress: 74, owner: "Tejaswi Rao", reviewer: "Maya Patel",
      blocker: "Mileage evidence not attached", next: "Preparer responds to reviewer", priority: 79,
      risk: 64, openItems: 4, docs: 19, messages: 12, updated: "2 hrs ago", segment: "Individual"
    },
    {
      id: "RET-1061", client: "Orchard Wellness Inc.", type: "1120", year: 2025,
      deadline: "Oct 15", status: "gathering", progress: 29, owner: "Elena Garcia", reviewer: "Unassigned",
      blocker: "Bank statements missing for Q4", next: "Client uploads Q4 statements", priority: 68,
      risk: 58, openItems: 8, docs: 31, messages: 5, updated: "Yesterday", segment: "Business"
    },
    {
      id: "RET-1004", client: "Daniel Brooks", type: "1040", year: 2025,
      deadline: "Apr 15", status: "signature", progress: 94, owner: "Tejaswi Rao", reviewer: "Maya Patel",
      blocker: "None", next: "Client signs e-file authorization", priority: 61,
      risk: 22, openItems: 1, docs: 17, messages: 2, updated: "Yesterday", segment: "Individual"
    },
    {
      id: "RET-0998", client: "Alpine Makers Co.", type: "1065", year: 2025,
      deadline: "Mar 15", status: "filed", progress: 100, owner: "Tejaswi Rao", reviewer: "Maya Patel",
      blocker: "None", next: "No action required", priority: 5,
      risk: 18, openItems: 0, docs: 52, messages: 11, updated: "Jul 29", segment: "Business"
    }
  ];

  const traceFields = [
    {
      id: "gross-receipts", name: "Gross receipts or sales", form: "Form 1120-S · Line 1a", value: "$842,315", raw: "$842,315.00",
      document: "2025 Income Summary.pdf", page: 2, section: "Annual income summary", confidence: 96,
      state: "ai", sourceLine: 2, sourceLabel: "Gross receipts", sourceValue: "$842,315.00",
      transformation: [
        ["Extract", "Detected annual gross receipts in the income summary."],
        ["Normalize", "Removed currency formatting and converted to decimal."],
        ["Map", "Mapped to Form 1120-S, Line 1a using the document label and entity context."]
      ],
      why: "The source label exactly matches the target concept and the annual total reconciles to the monthly revenue schedule.",
      uncertainty: "The document is client-generated rather than bank-issued. Reviewer confirmation is recommended.",
      recommendation: "Accept the extracted value after confirming it agrees with the general ledger export."
    },
    {
      id: "officer-comp", name: "Compensation of officers", form: "Form 1120-S · Line 7", value: "$126,000", raw: "$126,000.00",
      document: "Officer Payroll Register.pdf", page: 4, section: "YTD payroll by employee", confidence: 99,
      state: "verified", sourceLine: 4, sourceLabel: "Jordan Lee — Officer wages", sourceValue: "$126,000.00",
      transformation: [
        ["Extract", "Read year-to-date gross wages for the identified officer."],
        ["Validate", "Matched officer name against the shareholder and officer roster."],
        ["Map", "Mapped total officer wages to Form 1120-S, Line 7."]
      ],
      why: "Employee classification, officer roster, and payroll total all agree.",
      uncertainty: "No material uncertainty detected.",
      recommendation: "No action required. This field was verified by Maya Patel."
    },
    {
      id: "interest", name: "Interest income", form: "Form 1120-S · Schedule K, Line 4", value: "$2,418", raw: "$2,418.17",
      document: "Consolidated 1099-INT.pdf", page: 1, section: "Box 1 — Interest income", confidence: 98,
      state: "editable", sourceLine: 1, sourceLabel: "Box 1. Interest income", sourceValue: "$2,418.17",
      transformation: [
        ["Extract", "Read Box 1 from the consolidated 1099-INT."],
        ["Round", "Rounded to the nearest whole dollar for return presentation."],
        ["Map", "Mapped to Schedule K, Line 4."]
      ],
      why: "The tax form box and target return line have a direct mapping.",
      uncertainty: "A second bank account may still be outstanding based on the prior-year document list.",
      recommendation: "Keep the value, but ask the client whether the closed Horizon Bank account generated a final 1099-INT."
    },
    {
      id: "meals", name: "Deductible meals", form: "Form 1120-S · Line 12", value: "$9,320", raw: "$18,640.00",
      document: "Expense Detail.xlsx", page: 1, section: "Meals & entertainment", confidence: 87,
      state: "approval", sourceLine: 3, sourceLabel: "Business meals total", sourceValue: "$18,640.00",
      transformation: [
        ["Extract", "Summed expense rows categorized as business meals."],
        ["Apply rule", "Applied a 50% deductibility limit to the source total."],
        ["Calculate", "$18,640 × 50% = $9,320."],
        ["Map", "Mapped the deductible amount to Form 1120-S, Line 12."]
      ],
      why: "The calculation uses the standard 50% treatment configured for business meals in this prototype.",
      uncertainty: "Two transactions totaling $1,280 are labeled as client events and may qualify for different treatment.",
      recommendation: "Review the two client-event transactions before approving the $9,320 deduction."
    },
    {
      id: "contract-labor", name: "Contract labor", form: "Form 1120-S · Line 11", value: "$74,500", raw: "$74,500.00",
      document: "Vendor Payments.csv", page: 1, section: "Contractor payment summary", confidence: 72,
      state: "ai", sourceLine: 5, sourceLabel: "Independent contractors", sourceValue: "$81,000.00",
      transformation: [
        ["Extract", "Summed vendor payments tagged as independent contractor expense."],
        ["Exclude", "Removed $6,500 paid to an incorporated vendor based on entity type."],
        ["Calculate", "$81,000 − $6,500 = $74,500."],
        ["Map", "Mapped adjusted total to Form 1120-S, Line 11."]
      ],
      why: "Vendor entity metadata indicates one payment should not be included in the contractor total.",
      uncertainty: "A 1099-NEC from Delta Creative shows $12,000, while the ledger shows $15,500. Client confirmation is outstanding.",
      recommendation: "Request client confirmation for the $3,500 Delta Creative difference before verification."
    }
  ];

  const threads = [
    {
      id: "TH-18", title: "Delta Creative payment mismatch", object: "Contract labor · Line 11", visibility: "client", owner: "Jordan Lee", status: "Waiting on client", updated: "12 min",
      messages: [
        { from: "Tejaswi Rao", initials: "TR", mine: true, type: "client", time: "Today, 9:14 AM", text: "We found a difference between the Delta Creative 1099-NEC ($12,000) and your vendor ledger ($15,500). Which amount reflects the payments made during 2025?" },
        { from: "Jordan Lee", initials: "JL", mine: false, type: "client", time: "Today, 9:42 AM", text: "I believe the ledger includes a January 2026 payment. I am checking the bank activity and will confirm today." },
        { from: "Maya Patel", initials: "MP", mine: false, type: "internal", time: "Today, 9:47 AM", text: "Internal note: do not verify Line 11 until the bank date is confirmed. The AI exclusion for the incorporated vendor looks reasonable." }
      ]
    },
    {
      id: "TH-11", title: "Client event meal receipts", object: "Deductible meals · Line 12", visibility: "internal", owner: "Tejaswi Rao", status: "Preparer action", updated: "1 hr",
      messages: [
        { from: "Maya Patel", initials: "MP", mine: false, type: "internal", time: "Today, 8:18 AM", text: "Please inspect the two client-event transactions. The current 50% rule may not be appropriate for both." },
        { from: "Tejaswi Rao", initials: "TR", mine: true, type: "internal", time: "Today, 8:26 AM", text: "I linked both receipts and will classify them after confirming the event details." }
      ]
    },
    {
      id: "TH-07", title: "Horizon Bank final tax form", object: "Interest income · Schedule K", visibility: "client", owner: "Jordan Lee", status: "Open request", updated: "Yesterday",
      messages: [
        { from: "Tejaswi Rao", initials: "TR", mine: true, type: "client", time: "Yesterday, 2:10 PM", text: "Did the Horizon Bank account generate a final 1099-INT after it was closed? Please upload it if one was issued." }
      ]
    }
  ];

  const onboardingTasks = [
    { id: "OB-1", title: "Confirm your personal details", desc: "Review your address, filing status, dependents, and contact information.", time: "2 min", due: "Due today", done: true, group: "About you" },
    { id: "OB-2", title: "Upload your W-2", desc: "Add the W-2 from Cascadia Labs. We will extract the tax fields automatically.", time: "3 min", due: "Due today", done: false, group: "Income" },
    { id: "OB-3", title: "Answer 4 life-change questions", desc: "Tell us about moves, dependents, education, and health coverage during 2025.", time: "5 min", due: "Due Aug 9", done: false, group: "Questionnaire" },
    { id: "OB-4", title: "Connect your bank account", desc: "Optional: securely confirm estimated-tax payments made during the year.", time: "2 min", due: "Optional", done: false, group: "Payments" },
    { id: "OB-5", title: "Review uploaded documents", desc: "Check the two documents already received from your employer and bank.", time: "3 min", due: "After upload", done: false, group: "Review" }
  ];

  function buildDocuments() {
    const names = ["Payroll Register", "Bank Statement", "Income Summary", "Vendor Ledger", "1099-INT", "1099-NEC", "Expense Detail", "Fixed Asset Schedule", "Shareholder Basis", "Prior-Year Return", "Client Organizer", "Loan Statement"];
    const types = ["PDF", "PDF", "XLSX", "CSV", "PDF", "PDF"];
    const statuses = ["Extracted", "Needs review", "Verified", "Missing metadata"];
    const clients = returns.map(r => r.client);
    return Array.from({ length: 260 }, (_, i) => ({
      id: `DOC-${String(i + 1).padStart(4, "0")}`,
      name: `${names[i % names.length]} ${String((i % 9) + 1).padStart(2, "0")}`,
      type: types[i % types.length],
      status: statuses[i % statuses.length],
      client: clients[i % clients.length],
      year: i % 7 === 0 ? 2024 : 2025,
      pages: (i % 18) + 1,
      confidence: 65 + (i * 7) % 35,
      uploaded: i < 12 ? "Today" : i < 40 ? "This week" : "Earlier"
    }));
  }

  const allDocuments = buildDocuments();

  const state = {
    role: "preparer",
    view: "dashboard",
    roleMenuOpen: false,
    mobileNavOpen: false,
    selectedReturnId: "RET-1048",
    selectedFieldId: "gross-receipts",
    workspaceTab: "trace",
    returnFilter: "all",
    returnSearch: "",
    threadId: "TH-18",
    messageVisibility: "client",
    onboarding: structuredClone(onboardingTasks),
    documentSearch: "",
    documentStatus: "all",
    documentType: "all",
    documentPage: 1,
    modal: null,
    toasts: [],
    guideOpen: false,
    aiStates: {},
    history: ["dashboard"]
  };

  const icons = {
    dashboard: "⌂", returns: "▤", documents: "▱", collaboration: "✉", clients: "◎", ai: "✦", admin: "⚙", onboarding: "→", profile: "◉"
  };

  function navForRole(role) {
    const commonStaff = [
      ["dashboard", "Work dashboard"],
      ["returns", "Returns"],
      ["documents", "Documents"],
      ["collaboration", "Collaboration"],
      ["ai", "AI review queue"]
    ];
    if (role === "client" || role === "owner") {
      return [
        ["onboarding", "My next steps"],
        ["returns", "My return"],
        ["documents", "My documents"],
        ["collaboration", "Messages"]
      ];
    }
    if (role === "admin") return [...commonStaff, ["admin", "Firm settings"]];
    if (role === "seasonal") return [["dashboard", "Assigned work"], ["returns", "Returns"], ["documents", "Documents"], ["collaboration", "Questions"]];
    return commonStaff;
  }

  function titleForView(view) {
    return ({
      dashboard: "Work dashboard", returns: "Returns", documents: "Document library", collaboration: "Contextual collaboration",
      onboarding: "Your 2025 tax return", ai: "AI review queue", admin: "Firm administration", workspace: "Return review workspace"
    })[view] || "TaxFlow AI";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);
  }

  function selectedReturn() { return returns.find(r => r.id === state.selectedReturnId) || returns[0]; }
  function selectedField() { return traceFields.find(f => f.id === state.selectedFieldId) || traceFields[0]; }
  function selectedThread() { return threads.find(t => t.id === state.threadId) || threads[0]; }

  function statusBadge(status) {
    const map = { client_action:"danger", review:"approval", changes:"danger", signature:"editable", filed:"verified", preparation:"ai", gathering:"neutral", intake:"neutral" };
    return `<span class="badge ${map[status] || "neutral"}">${escapeHtml(statusLabels[status] || status)}</span>`;
  }

  function fieldBadge(field) {
    const override = state.aiStates[field.id];
    const value = override || field.state;
    const map = {
      ai: ["ai", "✦ AI-generated"], verified: ["verified", "✓ Verified"], editable: ["editable", "✎ Editable"],
      locked: ["locked", "🔒 Locked"], approval: ["approval", "◷ Needs approval"], dismissed: ["neutral", "AI suggestion dismissed"]
    };
    const item = map[value] || map.ai;
    return `<span class="badge ${item[0]}">${item[1]}</span>`;
  }

  function renderShell(content) {
    const role = roles[state.role];
    const nav = navForRole(state.role);
    return `
      <div class="app-shell">
        <aside class="sidebar ${state.mobileNavOpen ? "open" : ""}">
          <div class="brand">
            <div class="brand-mark">T</div>
            <div><div class="brand-name">TaxFlow AI</div><span class="brand-sub">Case study prototype</span></div>
          </div>
          <nav class="nav-section" aria-label="Primary navigation">
            <div class="nav-label">Workspace</div>
            ${nav.map(([view,label]) => `
              <button class="nav-item ${state.view === view || (state.view === "workspace" && view === "returns") ? "active" : ""}" data-action="navigate" data-view="${view}">
                <span class="nav-icon">${icons[view] || "•"}</span><span>${label}</span>
                ${view === "collaboration" ? `<span class="nav-count">3</span>` : view === "ai" ? `<span class="nav-count">8</span>` : ""}
              </button>`).join("")}
          </nav>
          <div class="sidebar-foot">
            <div class="demo-note"><strong>Interactive prototype</strong>All data, documents, and AI outputs are simulated for the candidate case study.</div>
          </div>
        </aside>

        <header class="topbar">
          <div class="topbar-left">
            <button class="btn icon-only mobile-menu" data-action="toggle-mobile-nav" aria-label="Open menu">☰</button>
            <div>
              <div class="breadcrumbs">${renderBreadcrumbs()}</div>
              <div class="page-context">${escapeHtml(titleForView(state.view))}</div>
            </div>
          </div>
          <div class="topbar-actions">
            <div class="search-global"><span class="search-symbol">⌕</span><input aria-label="Global search" placeholder="Search clients, returns, documents" /><kbd>⌘K</kbd></div>
            <button class="btn icon-only" data-action="show-notifications" aria-label="Notifications">◌</button>
            <div class="role-switcher">
              <button class="role-button" data-action="toggle-role-menu" aria-expanded="${state.roleMenuOpen}">
                <span class="avatar">${role.initials}</span>
                <span class="role-copy"><strong>${escapeHtml(role.person)}</strong><span>${escapeHtml(role.name)}</span></span>
                <span>⌄</span>
              </button>
              ${state.roleMenuOpen ? renderRoleMenu() : ""}
            </div>
          </div>
        </header>

        <main class="main">${content}</main>
        ${renderModal()}
        ${renderToasts()}
        ${renderGuide()}
      </div>`;
  }

  function renderBreadcrumbs() {
    if (state.view === "workspace") {
      const ret = selectedReturn();
      return `<button data-action="navigate" data-view="returns">Returns</button><span>›</span><span>${escapeHtml(ret.client)}</span><span>›</span><span>Review</span>`;
    }
    return `<span>Northstar Tax Group</span><span>›</span><span>${escapeHtml(titleForView(state.view))}</span>`;
  }

  function renderRoleMenu() {
    return `<div class="role-menu" role="menu">
      ${Object.entries(roles).map(([key,r]) => `
        <button class="role-option ${state.role === key ? "active" : ""}" data-action="switch-role" data-role="${key}">
          <span class="mini-avatar">${r.initials}</span><span><strong>${escapeHtml(r.name)}</strong><span>${escapeHtml(r.person)} · ${escapeHtml(r.subtitle)}</span></span>
        </button>`).join("")}
    </div>`;
  }

  function pageHead(title, copy, actions = "") {
    return `<div class="page-head"><div><h1>${title}</h1><p>${copy}</p></div><div class="head-actions">${actions}</div></div>`;
  }

  function renderDashboard() {
    if (state.role === "client" || state.role === "owner") return renderOnboarding();
    const assigned = state.role === "seasonal" ? returns.slice(2,5) : returns;
    const urgent = [...assigned].sort((a,b) => b.priority - a.priority).slice(0,4);
    return renderShell(`
      ${pageHead(
        state.role === "reviewer" ? "Review work that needs your judgment" : state.role === "seasonal" ? "Your assigned work" : "What should you work on right now?",
        "Work is ranked by deadline pressure, blockers, risk, and who owns the next action—not by a decorative reporting metric.",
        `<button class="btn" data-action="open-priority-explanation">How ranking works</button><button class="btn primary" data-action="open-top-priority">Open top priority →</button>`
      )}
      <div class="grid stats">
        <div class="card stat-card"><div class="stat-icon">⚑</div><div><div class="stat-number">8</div><div class="stat-label">Need action today</div><div class="stat-delta warn">3 blocked by clients</div></div></div>
        <div class="card stat-card"><div class="stat-icon">✓</div><div><div class="stat-number">6</div><div class="stat-label">Ready for review</div><div class="stat-delta">2 completed this morning</div></div></div>
        <div class="card stat-card"><div class="stat-icon">✦</div><div><div class="stat-number">11</div><div class="stat-label">AI findings to evaluate</div><div class="stat-delta warn">4 low confidence</div></div></div>
        <div class="card stat-card"><div class="stat-icon">◷</div><div><div class="stat-number">4.2d</div><div class="stat-label">Median time to file</div><div class="stat-delta">0.8d faster this week</div></div></div>
      </div>
      <div class="grid two">
        <section class="card">
          <div class="card-head"><div><h2>Prioritized work queue</h2><p>Every item explains why it is ranked and who must act next.</p></div><button class="btn small" data-action="navigate" data-view="returns">View all</button></div>
          <div class="card-body">
            ${urgent.map((r,idx) => `
              <div class="priority-item">
                <span class="priority-stripe ${r.priority > 90 ? "high" : r.priority > 75 ? "medium" : "low"}"></span>
                <div>
                  <div class="priority-title">${idx + 1}. ${escapeHtml(r.client)} · ${r.type}</div>
                  <div class="priority-meta">${statusBadge(r.status)}<span>${escapeHtml(r.next)}</span><span>•</span><span>${r.openItems} open items</span></div>
                  <div class="cell-sub" style="margin-top:7px"><strong>Why now:</strong> ${r.priority > 90 ? "Deadline risk plus an unresolved client discrepancy" : r.status === "review" ? "Review-ready and holding downstream filing work" : "Multiple open items with a near-term deadline"}</div>
                </div>
                <div class="priority-score"><strong>${r.priority}</strong><span>priority</span><button class="btn small soft" style="margin-top:7px" data-action="open-return" data-id="${r.id}">Open</button></div>
              </div>`).join("")}
          </div>
        </section>
        <div class="grid">
          <section class="card">
            <div class="card-head"><div><h2>Flow health</h2><p>Where work is waiting, not just where it exists.</p></div></div>
            <div class="card-body">
              <div class="timeline">
                <div class="timeline-step done"><div class="timeline-dot">✓</div><div><div class="timeline-title">Intake complete</div><div class="timeline-copy">18 returns moved forward this week.</div></div></div>
                <div class="timeline-step current"><div class="timeline-dot">2</div><div><div class="timeline-title">Client-dependent work</div><div class="timeline-copy">9 returns are waiting on a document or answer.</div><div class="timeline-owner"><span class="badge client">Client owns next action</span></div></div></div>
                <div class="timeline-step blocked"><div class="timeline-dot">!</div><div><div class="timeline-title">Review bottleneck</div><div class="timeline-copy">6 returns are ready for Maya's review.</div><div class="timeline-owner"><span class="badge approval">Reviewer owns next action</span></div></div></div>
                <div class="timeline-step"><div class="timeline-dot">4</div><div><div class="timeline-title">Signature and filing</div><div class="timeline-copy">3 returns are waiting for signatures.</div></div></div>
              </div>
            </div>
          </section>
          <section class="card">
            <div class="card-head"><div><h2>Recent client activity</h2><p>Contextual updates, not a generic inbox.</p></div></div>
            <div class="card-body">
              <div class="priority-item"><span class="priority-stripe low"></span><div><div class="priority-title">Jordan replied about Delta Creative</div><div class="priority-meta"><span>Linked to Contract labor · Line 11</span></div></div><button class="btn small" data-action="navigate" data-view="collaboration">Open</button></div>
              <div class="priority-item"><span class="priority-stripe low"></span><div><div class="priority-title">Nora uploaded mileage evidence</div><div class="priority-meta"><span>Linked to Schedule C · Vehicle expenses</span></div></div><button class="btn small">Review</button></div>
            </div>
          </section>
        </div>
      </div>`);
  }

  function renderReturns() {
    let list = returns.filter(r => {
      if ((state.role === "client" || state.role === "owner") && !["RET-1039","RET-1048"].includes(r.id)) return false;
      const filterOk = state.returnFilter === "all" || r.status === state.returnFilter;
      const q = state.returnSearch.toLowerCase();
      const searchOk = !q || `${r.client} ${r.id} ${r.type}`.toLowerCase().includes(q);
      return filterOk && searchOk;
    });
    return renderShell(`
      ${pageHead(
        state.role === "client" || state.role === "owner" ? "Your return" : "Returns",
        "Each status has a shared meaning, visible next action, owner, and blocker.",
        state.role === "admin" ? `<button class="btn primary" data-action="new-return">+ New return</button>` : ""
      )}
      <section class="card">
        <div class="toolbar">
          <input class="input search" id="return-search" placeholder="Search client, return ID, or type" value="${escapeHtml(state.returnSearch)}" />
          <select class="select" id="return-filter">
            <option value="all" ${state.returnFilter === "all" ? "selected" : ""}>All statuses</option>
            ${Object.entries(statusLabels).map(([v,l]) => `<option value="${v}" ${state.returnFilter === v ? "selected" : ""}>${l}</option>`).join("")}
          </select>
          <span class="badge neutral">${list.length} returns</span>
          <button class="btn small" style="margin-left:auto" data-action="status-legend">Status definitions</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Client / Return</th><th>Shared status</th><th>Progress</th><th>Next action</th><th>Owner</th><th>Risk</th><th></th></tr></thead>
            <tbody>
            ${list.map(r => `<tr class="clickable" data-action="open-return" data-id="${r.id}">
              <td><div class="cell-title">${escapeHtml(r.client)}</div><div class="cell-sub">${r.id} · ${r.type} · ${r.year}</div></td>
              <td>${statusBadge(r.status)}${r.blocker !== "None" ? `<div class="cell-sub">Blocked: ${escapeHtml(r.blocker)}</div>` : ""}</td>
              <td><strong>${r.progress}%</strong><div class="risk-track" style="width:90px;margin-top:5px"><div class="risk-fill" style="width:${r.progress}%;background:var(--brand)"></div></div></td>
              <td><div class="cell-title">${escapeHtml(r.next)}</div><div class="cell-sub">Updated ${escapeHtml(r.updated)}</div></td>
              <td><div class="cell-title">${escapeHtml(r.owner)}</div><div class="cell-sub">Reviewer: ${escapeHtml(r.reviewer)}</div></td>
              <td><div class="risk"><div class="risk-track"><div class="risk-fill" style="width:${r.risk}%"></div></div><div class="risk-label">${r.risk}/100</div></div></td>
              <td><button class="btn small soft" data-action="open-return" data-id="${r.id}">Open →</button></td>
            </tr>`).join("") || `<tr><td colspan="7"><div class="empty"><div class="empty-icon">⌕</div><strong>No returns found</strong>Change the search or status filter.</div></td></tr>`}
            </tbody>
          </table>
        </div>
      </section>`);
  }

  function renderWorkspace() {
    const ret = selectedReturn();
    return renderShell(`
      <div class="page-head">
        <div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${statusBadge(ret.status)}<span class="badge neutral">${ret.id}</span><span class="badge neutral">${ret.type} · ${ret.year}</span></div>
          <h1 style="margin-top:8px">${escapeHtml(ret.client)}</h1>
          <p><strong>Next:</strong> ${escapeHtml(ret.next)} · <strong>Owner:</strong> ${escapeHtml(ret.status === "client_action" ? "Jordan Lee (client)" : ret.owner)}</p>
        </div>
        <div class="head-actions"><button class="btn" data-action="open-status-modal">View progress</button><button class="btn primary" data-action="open-collab-for-return">Message about return</button></div>
      </div>
      ${ret.blocker !== "None" ? `<div class="alert danger" style="margin-bottom:14px"><span>!</span><div><strong>Completion is blocked</strong>${escapeHtml(ret.blocker)}. The client owns the next action; the preparer will be notified when they respond.</div></div>` : ""}
      <section class="card workspace">
        <div class="tabs">
          <button class="tab ${state.workspaceTab === "trace" ? "active" : ""}" data-action="workspace-tab" data-tab="trace">Return & source trace</button>
          <button class="tab ${state.workspaceTab === "status" ? "active" : ""}" data-action="workspace-tab" data-tab="status">Status & progress</button>
          <button class="tab ${state.workspaceTab === "issues" ? "active" : ""}" data-action="workspace-tab" data-tab="issues">Open items <span class="badge danger">${ret.openItems}</span></button>
          <button class="tab ${state.workspaceTab === "activity" ? "active" : ""}" data-action="workspace-tab" data-tab="activity">Activity</button>
        </div>
        ${state.workspaceTab === "trace" ? renderTraceWorkspace() : state.workspaceTab === "status" ? renderStatusWorkspace(ret) : state.workspaceTab === "issues" ? renderIssuesWorkspace() : renderActivityWorkspace()}
      </section>`);
  }

  function renderTraceWorkspace() {
    const field = selectedField();
    const aiState = state.aiStates[field.id];
    return `<div class="workspace-grid">
      <section class="workspace-pane">
        <div class="pane-head"><div><h3>Return fields</h3><p>Select a number to see its complete evidence chain.</p></div><span class="badge neutral">5 shown</span></div>
        <div class="field-list">
          ${traceFields.map(f => `<div class="field-row ${f.id === field.id ? "active" : ""}" data-action="select-field" data-id="${f.id}">
            <div><div class="field-name">${escapeHtml(f.name)}</div><div class="field-form">${escapeHtml(f.form)}</div><div style="margin-top:6px">${fieldBadge(f)}</div></div>
            <div><div class="field-value">${escapeHtml(f.value)}</div><div class="field-confidence">${f.confidence}% confidence</div></div>
          </div>`).join("")}
        </div>
      </section>
      <section class="workspace-pane">
        <div class="pane-head"><div><h3>${escapeHtml(field.document)}</h3><p>Page ${field.page} · ${escapeHtml(field.section)}</p></div><button class="btn small" data-action="fake-open-document">Open full document ↗</button></div>
        ${renderFakeDocument(field)}
      </section>
      <aside class="workspace-pane detail">
        <div class="pane-head"><div><h3>Evidence & decision</h3><p>Enough transparency to verify without exposing model internals.</p></div>${fieldBadge(field)}</div>
        <div class="detail-panel">
          <div>
            <div class="detail-title"><div><h3>${escapeHtml(field.name)}</h3><div class="cell-sub">${escapeHtml(field.form)}</div></div><button class="btn small icon-only" data-action="copy-field-link" title="Copy deep link">↗</button></div>
            <div class="detail-value">${escapeHtml(field.value)}</div>
            <div class="cell-sub">Source value ${escapeHtml(field.raw)} · page ${field.page}</div>
          </div>
          <div class="detail-block">
            <h4>Confidence</h4>
            <div style="display:flex;justify-content:space-between;font-size:10px"><strong>${field.confidence}%</strong><span>${field.confidence >= 95 ? "High" : field.confidence >= 80 ? "Moderate" : "Needs review"}</span></div>
            <div class="confidence-bar"><div class="confidence-fill" style="width:${field.confidence}%"></div></div>
          </div>
          <div class="detail-block">
            <h4>Source evidence</h4>
            <div class="evidence-row"><div class="evidence-icon">▱</div><div><strong>${escapeHtml(field.document)}</strong><span>Page ${field.page} · ${escapeHtml(field.section)}</span></div></div>
            <div class="evidence-row"><div class="evidence-icon">⌖</div><div><strong>${escapeHtml(field.sourceLabel)}</strong><span>Highlighted in the document viewer · ${escapeHtml(field.sourceValue)}</span></div></div>
          </div>
          <div class="detail-block">
            <h4>Transformation history</h4>
            ${field.transformation.map((step,i) => `<div class="calc-step"><div class="calc-num">${i+1}</div><div class="calc-copy"><strong>${escapeHtml(step[0])}</strong><span>${escapeHtml(step[1])}</span></div></div>`).join("")}
          </div>
          <div class="detail-block">
            <h4>AI recommendation</h4>
            <div class="ai-card">
              <div class="ai-head"><div class="ai-orb">✦</div><div><strong>TaxFlow AI</strong><span>Recommendation · evidence-backed · simulated</span></div></div>
              <div class="ai-body">
                <div class="ai-recommendation">${escapeHtml(field.recommendation)}</div>
                <div class="ai-why"><strong>Why:</strong> ${escapeHtml(field.why)}</div>
                <div class="ai-why" style="background:#fff7e8;color:#745000"><strong>Uncertainty:</strong> ${escapeHtml(field.uncertainty)}</div>
                ${aiState ? `<div class="alert success" style="margin-top:10px"><span>✓</span><div><strong>Decision recorded</strong>${escapeHtml(aiState === "verified" ? "Accepted and marked verified." : aiState === "dismissed" ? "Suggestion dismissed; source data unchanged." : "Correction saved for review.")}</div></div>` : `
                <div class="ai-actions">
                  <button class="btn small primary" data-action="accept-ai" data-id="${field.id}">✓ Accept</button>
                  <button class="btn small" data-action="correct-field" data-id="${field.id}">✎ Correct</button>
                  <button class="btn small" data-action="request-client" data-id="${field.id}">✉ Ask client</button>
                  <button class="btn small ghost" data-action="dismiss-ai" data-id="${field.id}">Dismiss</button>
                </div>`}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>`;
  }

  function renderFakeDocument(field) {
    const lines = [
      ["Taxpayer identification", "XX-XXX4821"],
      [field.id === "interest" ? "Box 1. Interest income" : "Gross receipts", field.id === "interest" ? "$2,418.17" : "$842,315.00"],
      [field.id === "meals" ? "Business meals total" : "Returns and allowances", field.id === "meals" ? "$18,640.00" : "$4,200.00"],
      [field.id === "officer-comp" ? "Jordan Lee — Officer wages" : "Net sales", field.id === "officer-comp" ? "$126,000.00" : "$838,115.00"],
      [field.id === "contract-labor" ? "Independent contractors" : "Other operating income", field.id === "contract-labor" ? "$81,000.00" : "$12,900.00"],
      ["Cost of services", "$263,481.00"], ["Gross profit", "$587,534.00"], ["Operating expenses", "$341,206.00"], ["Net operating income", "$246,328.00"]
    ];
    let highlightIndex = field.sourceLine;
    if (field.id === "interest") highlightIndex = 1;
    if (field.id === "meals") highlightIndex = 2;
    if (field.id === "officer-comp") highlightIndex = 3;
    if (field.id === "contract-labor") highlightIndex = 4;
    if (field.id === "gross-receipts") highlightIndex = 1;
    return `<div class="doc-shell"><div class="doc-page">
      <div class="doc-header"><strong>${escapeHtml(field.document.replace(/\.(pdf|xlsx|csv)$/i,""))}</strong><span>MORGAN & LEE CONSULTING LLC · TAX YEAR 2025</span></div>
      ${lines.map((line,i) => `<div class="doc-line ${i === highlightIndex ? "highlight" : ""}"><span>${escapeHtml(line[0])}</span><strong>${escapeHtml(line[1])}</strong></div>`).join("")}
      <div style="margin-top:24px;font-family:Georgia,serif;font-size:9px;color:#6c7781">Prepared from the client's bookkeeping export. Amounts are unaudited and subject to tax review.</div>
      <div class="doc-footer">Page ${field.page} of 6 · Simulated source document</div>
    </div></div>`;
  }

  function renderStatusWorkspace(ret) {
    const steps = [
      ["done","Intake completed","Engagement accepted and organizer sent.","Completed Jul 18"],
      ["done","Documents received","38 documents received and classified.","Completed Jul 29"],
      ["done","Preparation completed","Draft return created from verified data.","Completed Aug 4"],
      [ret.status === "client_action" ? "blocked" : "done","Open items resolved",ret.blocker !== "None" ? ret.blocker : "All client questions resolved.",ret.status === "client_action" ? "Jordan Lee owns next action" : "Completed"],
      [ret.status === "review" ? "current" : "","Quality review","Reviewer validates high-risk fields and AI decisions.",ret.status === "review" ? "Maya Patel owns next action" : "Starts after open items"],
      [ret.status === "signature" ? "current" : "","Signature","Client signs e-file authorization.","Client action"],
      [ret.status === "filed" ? "done" : "","Filed & accepted","Return transmitted and agency acceptance recorded.","Final step"]
    ];
    return `<div style="padding:18px"><div class="grid equal">
      <section>
        <div class="section-title">Shared progress</div>
        <div class="timeline">${steps.map((s,i) => `<div class="timeline-step ${s[0]}"><div class="timeline-dot">${s[0] === "done" ? "✓" : s[0] === "blocked" ? "!" : i+1}</div><div><div class="timeline-title">${s[1]}</div><div class="timeline-copy">${s[2]}</div><div class="timeline-owner">${s[3]}</div></div></div>`).join("")}</div>
      </section>
      <section>
        <div class="alert info"><span>i</span><div><strong>What the client sees</strong>Plain-language milestones, the next action, owner, and blockers. Internal review assignments and risk scores stay hidden.</div></div>
        <div class="card" style="margin-top:14px;box-shadow:none"><div class="card-head"><div><h3>Current milestone</h3><p>A status is a state with entry and exit criteria, not a vague label.</p></div>${statusBadge(ret.status)}</div><div class="card-body">
          <div class="section-title">Entry criteria</div><div class="cell-title">Preparation is complete and one client discrepancy remains.</div>
          <div class="section-title" style="margin-top:15px">Exit criteria</div><div class="cell-title">Client confirms the payment date and the preparer verifies Line 11.</div>
          <div class="section-title" style="margin-top:15px">Next-action owner</div><span class="badge client">Jordan Lee · Client</span>
          <div class="section-title" style="margin-top:15px">Expected handoff</div><div class="cell-title">Back to Tejaswi Rao for verification, then Maya Patel for review.</div>
        </div></div>
      </section>
    </div></div>`;
  }

  function renderIssuesWorkspace() {
    const issues = [
      ["High","Delta Creative payment mismatch","Contract labor · Line 11","Client","Due today"],
      ["Medium","Review client event meal classification","Deductible meals · Line 12","Preparer","Due tomorrow"],
      ["Medium","Confirm final Horizon Bank 1099-INT","Interest income · Schedule K","Client","Due Aug 9"]
    ];
    return `<div style="padding:18px"><div class="alert warning" style="margin-bottom:14px"><span>◷</span><div><strong>3 open items affect completion</strong>Each item is linked to the exact field, source document, conversation, owner, and due date.</div></div><section class="card" style="box-shadow:none"><div class="table-wrap"><table><thead><tr><th>Priority</th><th>Issue</th><th>Context</th><th>Next owner</th><th>Due</th><th></th></tr></thead><tbody>${issues.map((i,idx) => `<tr><td><span class="badge ${i[0] === "High" ? "danger" : "approval"}">${i[0]}</span></td><td><div class="cell-title">${i[1]}</div></td><td>${i[2]}</td><td><span class="badge ${i[3] === "Client" ? "client" : "internal"}">${i[3]}</span></td><td>${i[4]}</td><td><button class="btn small" data-action="issue-open" data-index="${idx}">Open context →</button></td></tr>`).join("")}</tbody></table></div></section></div>`;
  }

  function renderActivityWorkspace() {
    const activity = [
      ["9:47 AM","Maya added an internal note","Contract labor · Line 11"],
      ["9:42 AM","Jordan replied to a client-visible request","Delta Creative payment mismatch"],
      ["9:14 AM","Tejaswi requested client confirmation","Vendor Payments.csv"],
      ["Yesterday","TaxFlow AI flagged a payment discrepancy","Contract labor · Line 11"],
      ["Aug 4","Preparation milestone completed","Return status"]
    ];
    return `<div style="padding:20px;max-width:760px"><div class="timeline">${activity.map((a,i) => `<div class="timeline-step ${i===0?"current":"done"}"><div class="timeline-dot">${i===0?"•":"✓"}</div><div><div class="timeline-title">${a[1]}</div><div class="timeline-copy">${a[2]}</div><div class="timeline-owner">${a[0]}</div></div></div>`).join("")}</div></div>`;
  }

  function renderCollaboration() {
    const thread = selectedThread();
    return renderShell(`
      ${pageHead("Collaboration in context", "Every conversation belongs to a return field, document, issue, or request. Internal notes and client-visible messages are unmistakably different.", `<button class="btn primary" data-action="new-thread">+ New contextual request</button>`)}
      <section class="card">
        <div class="thread-layout">
          <aside class="thread-list">
            <div class="thread-filter"><input class="input" style="width:100%" placeholder="Search conversations" /></div>
            ${threads.map(t => `<div class="thread-item ${t.id === thread.id ? "active" : ""}" data-action="select-thread" data-id="${t.id}">
              <div class="thread-top"><div class="thread-title">${escapeHtml(t.title)}</div><div class="thread-time">${escapeHtml(t.updated)}</div></div>
              <div class="thread-preview">${escapeHtml(t.messages[t.messages.length-1].text)}</div>
              <div class="thread-meta"><span class="badge ${t.visibility === "client" ? "client" : "internal"}">${t.visibility === "client" ? "Client-visible" : "Internal only"}</span><span class="badge neutral">${escapeHtml(t.status)}</span></div>
            </div>`).join("")}
          </aside>
          <section class="conversation">
            <div class="conversation-head"><div><h3>${escapeHtml(thread.title)}</h3><p>Linked to ${escapeHtml(thread.object)} · Return RET-1048 · Next owner: ${escapeHtml(thread.owner)}</p></div><button class="btn small" data-action="open-linked-context">Open linked field →</button></div>
            <div class="message-stream" id="message-stream">
              ${thread.messages.map(m => `<div class="message ${m.mine ? "mine" : ""} ${m.type === "internal" ? "internal" : ""}"><div class="message-avatar">${m.initials}</div><div class="message-bubble"><div class="message-name">${escapeHtml(m.from)} <span class="badge ${m.type === "internal" ? "internal" : "client"}">${m.type === "internal" ? "Internal" : "Client-visible"}</span></div><div class="message-text">${escapeHtml(m.text)}</div><div class="message-time">${escapeHtml(m.time)}</div></div></div>`).join("")}
            </div>
            <div class="composer">
              <div class="composer-top"><div class="visibility-toggle"><button class="${state.messageVisibility === "client" ? "active" : ""}" data-action="set-visibility" data-value="client">Client-visible</button><button class="${state.messageVisibility === "internal" ? "active" : ""}" data-action="set-visibility" data-value="internal">Internal note</button></div><span class="cell-sub">${state.messageVisibility === "client" ? "Jordan Lee will be notified" : "Firm staff only"}</span></div>
              <div class="composer-row"><textarea id="message-input" class="textarea" placeholder="Write a message about ${escapeHtml(thread.object)}..."></textarea><button class="btn primary" data-action="send-message">Send</button></div>
            </div>
          </section>
        </div>
      </section>`);
  }

  function renderOnboarding() {
    const done = state.onboarding.filter(t => t.done).length;
    const pct = Math.round(done / state.onboarding.length * 100);
    const next = state.onboarding.find(t => !t.done);
    return renderShell(`
      <section class="onboarding-hero">
        <div><span class="badge" style="background:rgba(255,255,255,.15);color:white;border-color:rgba(255,255,255,.2)">2025 Individual Return</span><h1 style="margin-top:10px">Good morning, Avery.</h1><p>You are on track. Complete the next step below and we will take care of the rest. No tax knowledge is required.</p>
          ${next ? `<div class="next-action"><div class="next-action-icon">${icons.documents}</div><div style="flex:1"><strong>Next: ${escapeHtml(next.title)}</strong><span>${escapeHtml(next.desc)} · About ${escapeHtml(next.time)}</span></div><button class="btn primary" data-action="do-next-onboarding" data-id="${next.id}">Start →</button></div>` : `<div class="next-action"><div class="next-action-icon">✓</div><div><strong>You are all caught up</strong><span>Your tax team will contact you when the draft is ready.</span></div></div>`}
        </div>
        <div class="progress-ring" style="background:conic-gradient(#78f1df 0 ${pct}%, rgba(255,255,255,.17) ${pct}% 100%)"><div class="progress-ring-inner"><strong>${pct}%</strong><span>${done} of ${state.onboarding.length} steps complete</span></div></div>
      </section>
      <div class="grid two" style="margin-top:18px">
        <section class="card">
          <div class="card-head"><div><h2>Your checklist</h2><p>Only tasks relevant right now are shown. Later steps appear when they become actionable.</p></div><span class="badge verified">On track</span></div>
          <div>
            ${state.onboarding.map(t => `<div class="task-card" style="border-top:1px solid var(--line)"><button class="task-check ${t.done ? "done" : ""}" data-action="toggle-onboarding" data-id="${t.id}" aria-label="${t.done ? "Mark incomplete" : "Mark complete"}">${t.done ? "✓" : ""}</button><div><div class="task-title">${escapeHtml(t.title)}</div><div class="task-desc">${escapeHtml(t.desc)}</div><div style="margin-top:7px"><span class="badge neutral">${escapeHtml(t.group)}</span></div></div><div class="task-side"><strong style="font-size:10px">${escapeHtml(t.time)}</strong><div class="task-due">${escapeHtml(t.due)}</div></div></div>`).join("")}
          </div>
        </section>
        <div class="grid">
          <section class="card"><div class="card-head"><div><h2>Where your return stands</h2><p>The same milestones your tax team uses, translated for you.</p></div></div><div class="card-body"><div class="timeline"><div class="timeline-step done"><div class="timeline-dot">✓</div><div><div class="timeline-title">Account created</div><div class="timeline-copy">Your secure workspace is ready.</div></div></div><div class="timeline-step current"><div class="timeline-dot">2</div><div><div class="timeline-title">Collecting your information</div><div class="timeline-copy">You own the next action: upload your W-2.</div><div class="timeline-owner"><span class="badge client">You</span></div></div></div><div class="timeline-step"><div class="timeline-dot">3</div><div><div class="timeline-title">Tax team prepares your return</div><div class="timeline-copy">This starts automatically after required items are complete.</div></div></div><div class="timeline-step"><div class="timeline-dot">4</div><div><div class="timeline-title">Review and sign</div><div class="timeline-copy">We will show a plain-language summary before filing.</div></div></div></div></div></section>
          <section class="card"><div class="card-head"><div><h2>Need help?</h2><p>Your questions stay attached to the task or document they concern.</p></div></div><div class="card-body"><button class="btn soft" style="width:100%" data-action="navigate" data-view="collaboration">Message your tax team →</button></div></section>
        </div>
      </div>`);
  }

  function renderDocuments() {
    const q = state.documentSearch.toLowerCase();
    const filtered = allDocuments.filter(d => {
      if ((state.role === "client" || state.role === "owner") && !["Avery Chen","Morgan & Lee Consulting LLC"].includes(d.client)) return false;
      return (!q || `${d.name} ${d.client} ${d.id}`.toLowerCase().includes(q)) &&
        (state.documentStatus === "all" || d.status === state.documentStatus) &&
        (state.documentType === "all" || d.type === state.documentType);
    });
    const perPage = 24;
    const totalPages = Math.max(1, Math.ceil(filtered.length/perPage));
    state.documentPage = Math.min(state.documentPage,totalPages);
    const docs = filtered.slice((state.documentPage-1)*perPage,state.documentPage*perPage);
    return renderShell(`
      ${pageHead("A document library that still works at scale", "This prototype generates 260 records to prove search, filtering, hierarchy, summary-to-detail navigation, and persistent context.", `<button class="btn primary" data-action="upload-document">+ Upload document</button>`)}
      <section class="card">
        <div class="doc-library">
          <aside class="filter-panel">
            <div class="filter-group"><div class="filter-title">Search</div><input id="document-search" class="input" style="width:100%" placeholder="Name, client, or ID" value="${escapeHtml(state.documentSearch)}" /></div>
            <div class="filter-group"><div class="filter-title">Review state</div><label class="check-row"><input type="radio" name="docstatus" value="all" ${state.documentStatus === "all" ? "checked" : ""}/> All documents</label>${["Extracted","Needs review","Verified","Missing metadata"].map(s => `<label class="check-row"><input type="radio" name="docstatus" value="${s}" ${state.documentStatus === s ? "checked" : ""}/> ${s}</label>`).join("")}</div>
            <div class="filter-group"><div class="filter-title">File type</div><label class="check-row"><input type="radio" name="doctype" value="all" ${state.documentType === "all" ? "checked" : ""}/> All types</label>${["PDF","XLSX","CSV"].map(s => `<label class="check-row"><input type="radio" name="doctype" value="${s}" ${state.documentType === s ? "checked" : ""}/> ${s}</label>`).join("")}</div>
            <div class="alert info"><span>i</span><div><strong>Progressive disclosure</strong>Cards show only identification and review state. Extraction details appear after opening a document.</div></div>
          </aside>
          <div class="library-main">
            <div class="library-summary"><div><strong>${filtered.length} documents</strong><div class="cell-sub">Page ${state.documentPage} of ${totalPages}</div></div><div style="display:flex;gap:7px"><button class="btn small" data-action="doc-page" data-delta="-1" ${state.documentPage<=1?"disabled":""}>← Previous</button><button class="btn small" data-action="doc-page" data-delta="1" ${state.documentPage>=totalPages?"disabled":""}>Next →</button></div></div>
            <div class="library-grid">
              ${docs.map(d => `<article class="doc-card" data-action="open-library-document" data-id="${d.id}"><div class="doc-thumb"><span class="doc-type">${d.type}</span></div><h3>${escapeHtml(d.name)}</h3><p>${escapeHtml(d.client)} · ${d.year} · ${d.pages} page${d.pages===1?"":"s"}</p><div class="doc-card-foot"><span class="badge ${d.status === "Verified" ? "verified" : d.status === "Needs review" ? "approval" : d.status === "Missing metadata" ? "danger" : "ai"}">${escapeHtml(d.status)}</span><span class="cell-sub">${d.confidence}%</span></div></article>`).join("") || `<div class="empty" style="grid-column:1/-1"><div class="empty-icon">▱</div><strong>No matching documents</strong>Clear one or more filters.</div>`}
            </div>
          </div>
        </div>
      </section>`);
  }

  function renderAIQueue() {
    const items = traceFields.filter(f => (state.aiStates[f.id] || f.state) !== "verified");
    return renderShell(`
      ${pageHead("AI review queue", "AI output is never presented as authority. Every finding includes evidence, uncertainty, a recommended action, and a correction path.", `<button class="btn" data-action="ai-policy">View AI decision policy</button>`)}
      <div class="grid stats">
        <div class="card stat-card"><div class="stat-icon">✦</div><div><div class="stat-number">${items.length}</div><div class="stat-label">Open AI findings</div></div></div>
        <div class="card stat-card"><div class="stat-icon">!</div><div><div class="stat-number">2</div><div class="stat-label">Below 80% confidence</div></div></div>
        <div class="card stat-card"><div class="stat-icon">✓</div><div><div class="stat-number">23</div><div class="stat-label">Accepted this week</div></div></div>
        <div class="card stat-card"><div class="stat-icon">↺</div><div><div class="stat-number">4</div><div class="stat-label">Corrected by reviewers</div></div></div>
      </div>
      <section class="card"><div class="card-head"><div><h2>Findings requiring human judgment</h2><p>Ranked by potential tax impact, confidence, and workflow blockage.</p></div></div><div class="table-wrap"><table><thead><tr><th>Finding</th><th>Return field</th><th>Confidence</th><th>Evidence</th><th>Uncertainty</th><th>Recommended action</th><th></th></tr></thead><tbody>${items.map(f => `<tr><td>${fieldBadge(f)}</td><td><div class="cell-title">${escapeHtml(f.name)}</div><div class="cell-sub">RET-1048 · ${escapeHtml(f.form)}</div></td><td><strong>${f.confidence}%</strong><div class="confidence-bar" style="width:90px"><div class="confidence-fill" style="width:${f.confidence}%"></div></div></td><td><div class="cell-title">${escapeHtml(f.document)}</div><div class="cell-sub">Page ${f.page} · ${escapeHtml(f.sourceLabel)}</div></td><td><div class="cell-sub" style="max-width:260px;white-space:normal">${escapeHtml(f.uncertainty)}</div></td><td><div class="cell-sub" style="max-width:260px;white-space:normal">${escapeHtml(f.recommendation)}</div></td><td><button class="btn small soft" data-action="review-ai-field" data-id="${f.id}">Review →</button></td></tr>`).join("")}</tbody></table></div></section>`);
  }

  function renderAdmin() {
    return renderShell(`
      ${pageHead("Firm administration", "Role-aware configuration keeps one cohesive product while making permissions and context explicit.", `<button class="btn primary" data-action="invite-user">+ Invite user</button>`)}
      <div class="grid equal">
        <section class="card"><div class="card-head"><div><h2>Role permission model</h2><p>Permissions are communicated where they affect the user's work.</p></div></div><div class="table-wrap"><table><thead><tr><th>Role</th><th>Return access</th><th>Client messages</th><th>Internal notes</th><th>Verify AI</th></tr></thead><tbody>
          <tr><td><strong>Tax preparer</strong></td><td>Assigned + team</td><td>Write</td><td>Write</td><td>Within threshold</td></tr>
          <tr><td><strong>Reviewer</strong></td><td>Firm-wide review</td><td>Write</td><td>Write</td><td>Final approval</td></tr>
          <tr><td><strong>Client</strong></td><td>Own return only</td><td>Write</td><td><span class="badge locked">No access</span></td><td><span class="badge locked">No access</span></td></tr>
          <tr><td><strong>Seasonal staff</strong></td><td>Assigned only</td><td>Draft only</td><td>Write</td><td>Cannot finalize</td></tr>
        </tbody></table></div></section>
        <section class="card"><div class="card-head"><div><h2>Context switching</h2><p>A firm employee who also has a personal return does not need a second product.</p></div></div><div class="card-body"><div class="alert info"><span>◉</span><div><strong>Current work context</strong>Northstar Tax Group · Tax Preparer permissions</div></div><div style="height:10px"></div><div class="alert success"><span>✓</span><div><strong>Personal return context available</strong>Switch from the top-right role menu. Firm data is hidden while personal context is active.</div></div><div class="section-title" style="margin-top:18px">Design rule</div><p style="font-size:11px;color:var(--muted)">The shell, visual language, and object model remain consistent. Navigation, actions, and disclosure adapt to the active role and workspace.</p></div></section>
      </div>`);
  }

  function renderModal() {
    if (!state.modal) return "";
    const m = state.modal;
    if (m.type === "correct") {
      const field = traceFields.find(f => f.id === m.fieldId);
      return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Correct AI-extracted value</h2><button class="btn small icon-only" data-action="close-modal">×</button></div><div class="modal-body"><div class="alert info" style="margin-bottom:14px"><span>i</span><div><strong>Your correction becomes feedback</strong>The original value and evidence remain in the audit trail. The corrected value is routed for approval.</div></div><div class="form-row"><label class="field-label">Return field</label><input class="input" value="${escapeHtml(field.name)}" disabled /></div><div class="form-row"><label class="field-label">Corrected value</label><input id="corrected-value" class="input" value="${escapeHtml(field.value)}" /></div><div class="form-row"><label class="field-label">Reason for correction</label><select id="correction-reason" class="select"><option>Source was interpreted incorrectly</option><option>Wrong tax treatment</option><option>Missing source document</option><option>Other</option></select></div><div class="form-row"><label class="field-label">Reviewer note</label><textarea id="correction-note" class="textarea" placeholder="Explain what should change and why..."></textarea></div></div><div class="modal-foot"><button class="btn" data-action="close-modal">Cancel</button><button class="btn primary" data-action="save-correction" data-id="${field.id}">Save correction</button></div></div></div>`;
    }
    if (m.type === "priority") return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Defensible prioritization logic</h2><button class="btn small icon-only" data-action="close-modal">×</button></div><div class="modal-body"><p style="margin-top:0;font-size:12px">The dashboard score is intentionally simple and visible. It combines:</p><div class="grid equal"><div class="alert danger"><span>35%</span><div><strong>Deadline pressure</strong>Days remaining and filing extension state.</div></div><div class="alert warning"><span>30%</span><div><strong>Workflow blockage</strong>Whether the item prevents review, signature, or filing.</div></div><div class="alert info"><span>20%</span><div><strong>Tax risk</strong>Potential impact and confidence of unresolved findings.</div></div><div class="alert success"><span>15%</span><div><strong>Action ownership</strong>Whether the current user can resolve it now.</div></div></div><p style="font-size:10px;color:var(--muted);margin-bottom:0">In production, weights would be configurable by firm policy and tested against completion outcomes. The prototype uses deterministic mock scores.</p></div><div class="modal-foot"><button class="btn primary" data-action="close-modal">Got it</button></div></div></div>`;
    if (m.type === "status") return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Status definitions</h2><button class="btn small icon-only" data-action="close-modal">×</button></div><div class="modal-body">${Object.entries(statusLabels).map(([k,v]) => `<div style="padding:10px 0;border-bottom:1px solid var(--line)">${statusBadge(k)}<div class="cell-sub" style="margin-top:5px">${({intake:"Engagement exists; required setup is not complete.",gathering:"Required client information is still being collected.",preparation:"A preparer is actively building the draft return.",client_action:"A specific client-owned item blocks forward movement.",review:"Preparation is complete and assigned for independent review.",changes:"Reviewer requested changes from the preparer.",signature:"Return passed review and awaits client authorization.",filed:"Transmission and agency acceptance are recorded."})[k]}</div></div>`).join("")}</div><div class="modal-foot"><button class="btn primary" data-action="close-modal">Close</button></div></div></div>`;
    if (m.type === "document") {
      const d = allDocuments.find(x => x.id === m.id);
      return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>${escapeHtml(d.name)}</h2><button class="btn small icon-only" data-action="close-modal">×</button></div><div class="modal-body"><div class="grid equal"><div><div class="section-title">Document</div><p class="cell-title">${d.id} · ${d.type} · ${d.pages} pages</p><p class="cell-sub">${escapeHtml(d.client)} · Tax year ${d.year}</p></div><div><div class="section-title">AI extraction</div><p>${d.status === "Verified" ? `<span class="badge verified">Verified</span>` : `<span class="badge ai">${escapeHtml(d.status)}</span>`}</p><div class="confidence-bar"><div class="confidence-fill" style="width:${d.confidence}%"></div></div><p class="cell-sub">${d.confidence}% document confidence</p></div></div><div class="alert info" style="margin-top:14px"><span>⌖</span><div><strong>Persistent context</strong>Opening a document from a return would preserve the return, field, issue, and message context in a production route.</div></div></div><div class="modal-foot"><button class="btn" data-action="close-modal">Close</button><button class="btn primary" data-action="open-return-from-doc">Open linked return →</button></div></div></div>`;
    }
    if (m.type === "request") {
      const field = traceFields.find(f => f.id === m.fieldId);
      return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Request client confirmation</h2><button class="btn small icon-only" data-action="close-modal">×</button></div><div class="modal-body"><div class="form-row"><label class="field-label">Linked context</label><input class="input" value="${escapeHtml(field.name)} · ${escapeHtml(field.form)}" disabled /></div><div class="form-row"><label class="field-label">Message to Jordan Lee</label><textarea id="request-message" class="textarea">Please confirm the supporting detail for ${escapeHtml(field.name)}. We linked the source document and highlighted the value that needs clarification.</textarea></div><div class="form-row"><label class="field-label">Due date</label><input id="request-due" class="input" type="date" value="2026-08-08" /></div></div><div class="modal-foot"><button class="btn" data-action="close-modal">Cancel</button><button class="btn primary" data-action="send-client-request" data-id="${field.id}">Create request</button></div></div></div>`;
    }
    return "";
  }

  function renderToasts() {
    return `<div class="toast-stack">${state.toasts.map(t => `<div class="toast"><span>${t.icon || "✓"}</span><div><strong>${escapeHtml(t.title)}</strong><span>${escapeHtml(t.copy)}</span></div></div>`).join("")}</div>`;
  }

  function renderGuide() {
    if (!state.guideOpen) return `<div class="demo-guide"><button class="guide-button" data-action="toggle-guide" title="Open demo guide">?</button></div>`;
    const steps = [
      ["dashboard","Actionable dashboard","See why work is ranked, then open the top return."],
      ["workspace","Source traceability","Click a field to trace value → source → calculation → AI decision."],
      ["collaboration","Contextual collaboration","Compare client-visible messages with internal notes."],
      ["onboarding","First-run client experience","Switch to Client and see a clear next action within seconds."],
      ["documents","Scale & navigation","Search and filter 260 generated documents."],
      ["admin","Role-aware product","Switch roles without leaving the same product shell."]
    ];
    return `<div class="demo-guide"><button class="guide-button" data-action="toggle-guide">×</button><div class="guide-panel"><div class="guide-head"><strong>Suggested 5-minute walkthrough</strong><span>Click any step to jump to that part of the prototype.</span></div>${steps.map((s,i) => `<div class="guide-step" data-action="guide-step" data-view="${s[0]}"><div class="guide-num">${i+1}</div><div><strong>${s[1]}</strong><span>${s[2]}</span></div></div>`).join("")}</div></div>`;
  }

  function showToast(title, copy, icon="✓") {
    const id = Date.now() + Math.random();
    state.toasts.push({ id,title,copy,icon });
    render();
    window.setTimeout(() => { state.toasts = state.toasts.filter(t => t.id !== id); render(); }, 3200);
  }

  function navigate(view) {
    if (view === "workspace") state.view = "workspace";
    else state.view = view;
    state.mobileNavOpen = false;
    state.roleMenuOpen = false;
    state.history.push(view);
    window.scrollTo({top:0,behavior:"smooth"});
    render();
  }

  function render() {
    let html;
    switch (state.view) {
      case "dashboard": html = renderDashboard(); break;
      case "returns": html = renderReturns(); break;
      case "workspace": html = renderWorkspace(); break;
      case "documents": html = renderDocuments(); break;
      case "collaboration": html = renderCollaboration(); break;
      case "onboarding": html = renderOnboarding(); break;
      case "ai": html = renderAIQueue(); break;
      case "admin": html = renderAdmin(); break;
      default: html = renderDashboard();
    }
    $app.innerHTML = html;
  }

  $app.addEventListener("click", e => {
    const el = e.target.closest("[data-action]");
    if (!el) {
      if (state.roleMenuOpen && !e.target.closest(".role-switcher")) { state.roleMenuOpen = false; render(); }
      return;
    }
    const action = el.dataset.action;
    if (action === "navigate") navigate(el.dataset.view);
    else if (action === "toggle-role-menu") { state.roleMenuOpen = !state.roleMenuOpen; render(); }
    else if (action === "switch-role") {
      state.role = el.dataset.role; state.roleMenuOpen = false;
      state.view = ["client","owner"].includes(state.role) ? "onboarding" : "dashboard";
      showToast("Context switched", `You are now viewing the product as ${roles[state.role].name}.`, "◉");
    }
    else if (action === "toggle-mobile-nav") { state.mobileNavOpen = !state.mobileNavOpen; render(); }
    else if (action === "open-return" || action === "open-top-priority") {
      state.selectedReturnId = el.dataset.id || "RET-1048"; state.workspaceTab = "trace"; state.view = "workspace"; state.history.push("workspace"); render();
    }
    else if (action === "workspace-tab") { state.workspaceTab = el.dataset.tab; render(); }
    else if (action === "select-field") { state.selectedFieldId = el.dataset.id; render(); }
    else if (action === "accept-ai") { state.aiStates[el.dataset.id] = "verified"; showToast("AI decision accepted", "The value is marked verified and the reviewer action is recorded in the audit trail."); }
    else if (action === "dismiss-ai") { state.aiStates[el.dataset.id] = "dismissed"; showToast("Suggestion dismissed", "The field remains unchanged and the dismissal reason would be retained.", "↺"); }
    else if (action === "correct-field") { state.modal = {type:"correct",fieldId:el.dataset.id}; render(); }
    else if (action === "request-client") { state.modal = {type:"request",fieldId:el.dataset.id}; render(); }
    else if (action === "close-modal") { state.modal = null; render(); }
    else if (action === "save-correction") { state.aiStates[el.dataset.id] = "approval"; state.modal = null; showToast("Correction saved", "The original AI output remains visible and the corrected value is queued for reviewer approval.", "✎"); }
    else if (action === "send-client-request") { state.modal = null; state.threadId = "TH-18"; showToast("Client request created", "Jordan Lee now owns the next action. The request is linked to the exact return field.", "✉"); }
    else if (action === "open-priority-explanation") { state.modal = {type:"priority"}; render(); }
    else if (action === "status-legend" || action === "open-status-modal") { state.modal = {type:"status"}; render(); }
    else if (action === "select-thread") { state.threadId = el.dataset.id; render(); }
    else if (action === "set-visibility") { state.messageVisibility = el.dataset.value; render(); }
    else if (action === "send-message") {
      const input = document.getElementById("message-input");
      const text = input?.value.trim();
      if (!text) return showToast("Message is empty", "Write a message before sending.", "!");
      selectedThread().messages.push({from: roles[state.role].person, initials:roles[state.role].initials, mine:true, type:state.messageVisibility, time:"Just now", text});
      showToast(state.messageVisibility === "internal" ? "Internal note added" : "Client message sent", state.messageVisibility === "internal" ? "Only authorized firm staff can see it." : "The client was notified and owns the next action when a response is required.", "✉");
    }
    else if (action === "open-linked-context") { state.selectedReturnId="RET-1048"; state.selectedFieldId = state.threadId === "TH-11" ? "meals" : state.threadId === "TH-07" ? "interest" : "contract-labor"; state.view="workspace"; state.workspaceTab="trace"; render(); }
    else if (action === "open-collab-for-return") { state.view="collaboration"; render(); }
    else if (action === "toggle-onboarding" || action === "do-next-onboarding") {
      const t = state.onboarding.find(x => x.id === el.dataset.id); if (t) t.done = !t.done;
      showToast(t?.done ? "Step completed" : "Step reopened", t?.done ? "Your tax team can see the update immediately." : "The step is back on your checklist.");
    }
    else if (action === "doc-page") { state.documentPage += Number(el.dataset.delta); render(); }
    else if (action === "open-library-document") { state.modal = {type:"document",id:el.dataset.id}; render(); }
    else if (action === "open-return-from-doc") { state.modal=null; state.selectedReturnId="RET-1048"; state.view="workspace"; state.workspaceTab="trace"; render(); }
    else if (action === "review-ai-field") { state.selectedReturnId="RET-1048"; state.selectedFieldId=el.dataset.id; state.view="workspace"; state.workspaceTab="trace"; render(); }
    else if (action === "issue-open") { state.selectedFieldId = ["contract-labor","meals","interest"][Number(el.dataset.index)] || "contract-labor"; state.workspaceTab="trace"; render(); }
    else if (action === "copy-field-link") { showToast("Deep link copied", `Return RET-1048 · ${selectedField().form} · source page ${selectedField().page}`,"↗"); }
    else if (action === "fake-open-document") { showToast("Document opened", "This prototype keeps the return field and issue context attached while viewing the source.","▱"); }
    else if (action === "upload-document") { showToast("Upload simulated", "A production version would virus-scan, classify, extract, and route the document for review.","↑"); }
    else if (action === "new-thread") { showToast("Context required", "Start a conversation from a return field, document, or issue so it never becomes a generic inbox.","✉"); }
    else if (action === "new-return") { showToast("New return flow", "Firm setup, client invitation, and organizer selection would begin here.","+"); }
    else if (action === "show-notifications") { showToast("3 relevant updates", "One client response, one reviewer note, and one document upload need attention.","◌"); }
    else if (action === "toggle-guide") { state.guideOpen = !state.guideOpen; render(); }
    else if (action === "guide-step") {
      const v = el.dataset.view;
      if (v === "workspace") { state.selectedReturnId="RET-1048"; state.view="workspace"; state.workspaceTab="trace"; }
      else if (v === "onboarding") { state.role="client"; state.view="onboarding"; }
      else if (v === "admin") { state.role="admin"; state.view="admin"; }
      else { if (["client","owner"].includes(state.role) && ["dashboard","ai"].includes(v)) state.role="preparer"; state.view=v; }
      state.guideOpen=false; render();
    }
    else if (action === "ai-policy") { showToast("Human-in-the-loop policy", "AI can suggest and extract. High-impact or low-confidence decisions require a qualified reviewer.","✦"); }
    else if (action === "invite-user") { showToast("Invitation flow simulated", "The invite would assign a role, scope, and activation date.","+"); }
  });

  $app.addEventListener("input", e => {
    if (e.target.id === "return-search") { state.returnSearch = e.target.value; render(); }
    if (e.target.id === "document-search") { state.documentSearch = e.target.value; state.documentPage=1; render(); }
  });

  $app.addEventListener("change", e => {
    if (e.target.id === "return-filter") { state.returnFilter = e.target.value; render(); }
    if (e.target.name === "docstatus") { state.documentStatus=e.target.value; state.documentPage=1; render(); }
    if (e.target.name === "doctype") { state.documentType=e.target.value; state.documentPage=1; render(); }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (state.modal) state.modal=null;
      else if (state.roleMenuOpen) state.roleMenuOpen=false;
      else if (state.mobileNavOpen) state.mobileNavOpen=false;
      render();
    }
  });

  render();
})();
