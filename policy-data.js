const POLICY_DATA = {
  access: {
    id: "access", tab: "Access to care", title: "Expanding access to mental health care",
    description: "Missouri House Bill 2088 proposes expanding Assisted Outpatient Treatment (AOT) while the behavioral health workforce remains critically understaffed.",
    sources: [
      { label: "HB 2088", url: "https://house.mo.gov/Bill.aspx?bill=HB2088&year=2026&code=R" },
      { label: "NY AOT / Kendra's Law", url: "https://omh.ny.gov/omhweb/psychiatric_rehabilitation/aot/" },
      { label: "HRSA Behavioral Health", url: "https://bhw.hrsa.gov/data-research" },
    ],
    stats: [
      { label: "Hospitalization reduction (NY AOT)", value: "77%", sub: "Kendra's Law evidence" },
      { label: "Arrest reduction", value: "83%", sub: "NY AOT outcomes" },
      { label: "MO workforce ranking", value: "Bottom 25%", sub: "BH workers per capita" },
    ],
    cards: [
      { labelText: "Policy", labelColor: "info", title: "HB 2088 — AOT expansion", body: "Broadens court authority to mandate outpatient psychiatric treatment. Expands petition authority to physicians, guardians, and DMH officials.", tag: "Proposed legislation", tagColor: "info" },
      { labelText: "Structural gap", labelColor: "danger", title: "Mandate outpaces capacity", body: "Missouri is expanding legal obligations without proportional increases in outpatient staffing, case management, or supportive housing.", tag: "High risk", tagColor: "danger" },
    ],
  },
  medicaid: {
    id: "medicaid", tab: "Medicaid risk", title: "Medicaid coverage risks",
    description: "Federal policy shifts and Missouri's HJR 173 tax restructuring threaten Medicaid behavioral health funding.",
    sources: [{ label: "KFF Medicaid", url: "https://www.kff.org/medicaid/" }],
    stats: [
      { label: "Missourians at risk", value: "170,000", sub: "Potential coverage loss" },
      { label: "BH share of Medicaid", value: "25–30%", sub: "National average" },
      { label: "Income tax share of GR", value: "~60%", sub: "Missouri general revenue" },
    ],
    cards: [
      { labelText: "Budget risk", labelColor: "warning", title: "HJR 173 — income tax elimination", body: "Proposed elimination of state income tax could create a multi-billion dollar gap threatening mental health services.", tag: "Under review", tagColor: "warning" },
      { labelText: "Cascade", labelColor: "danger", title: "Downstream effects", body: "Coverage loss drives increased ER use, higher incarceration of untreated individuals, and increased uncompensated care burden.", tag: "High impact", tagColor: "danger" },
    ],
  },
  crisis: {
    id: "crisis", tab: "988 crisis line", title: "Strengthening 988 and crisis response",
    description: "Missouri's 988 Lifeline performs well on call response but faces growing demand and mobile crisis funding gaps.",
    sources: [{ label: "MO 988 telecom fee proposal", url: "https://www.wgem.com/video/2026/03/20/missouri-lawmakers-propose-phone-fee-support-growing-988-crisis-line-demand/" }],
    stats: [
      { label: "MO in-state answer rate", value: "94%", sub: "Calls answered in-state" },
      { label: "Average answer time", value: "~17s", sub: "Seconds" },
      { label: "Call volume growth", value: "+42%", sub: "67K → 95K (FY24→FY25)" },
    ],
    bars: [
      { label: "Annual contacts (national)", value: "5 million", pct: 100, color: "info" },
      { label: "YoY growth", value: "30–40%", pct: 70, color: "warning" },
    ],
    cards: [
      { labelText: "Funding", labelColor: "info", title: "MO telecom fee — $0.65/month per line", body: "Proposed to support 988 demand. Peer states generate $20–60M annually. Limitation: funding restricted to call centers, not mobile crisis teams or follow-up.", tag: "Funding gap", tagColor: "warning" },
    ],
  },
  cj: {
    id: "cj", tab: "Criminal justice", title: "Criminal justice reform and mental health diversion",
    description: "Missouri's jails serve as de facto mental health providers with 524 individuals awaiting competency restoration.",
    sources: [
      { label: "BJS", url: "https://bjs.ojp.gov/" },
      { label: "CSG Justice Center", url: "https://csgjusticecenter.org/" },
      { label: "KCUR — MO backlog", url: "https://www.kcur.org/health/2026-02-17/missouri-lawmakers-confront-mental-health-backlog-in-jails-it-sure-looks-like-a-crisis" },
    ],
    stats: [
      { label: "Jail pop. with mental illness", value: "44%", sub: "Bureau of Justice Statistics" },
      { label: "Awaiting restoration", value: "524", sub: "Missouri backlog" },
      { label: "Incarcerated while waiting", value: "446", sub: "Of 524 backlogged" },
    ],
    cards: [
      { labelText: "Evidence-based", labelColor: "success", title: "Mental health courts", body: "Operating in multiple MO jurisdictions. Associated with 20–25% recidivism reductions in U.S. meta-analyses.", tag: "Evidence-based", tagColor: "success" },
      { labelText: "Crisis", labelColor: "danger", title: "Forensic capacity fully utilized", body: "446 people incarcerated while awaiting psychiatric treatment — creating constitutional risk and humanitarian harm.", tag: "Crisis level", tagColor: "danger" },
    ],
  },
  veterans: {
    id: "veterans", tab: "Veterans", title: "Veterans and military mental health",
    description: "Veterans face disproportionate suicide risk. VA Community Care expands access but wait times persist.",
    sources: [
      { label: "VA Suicide Data", url: "https://www.mentalhealth.va.gov/suicide_prevention/data.asp" },
      { label: "VA Community Care", url: "https://www.va.gov/communitycare/" },
    ],
    stats: [
      { label: "Veteran suicides/day", value: "17", sub: "VA data (national)" },
      { label: "Community Care", value: "Active", sub: "Non-VA provider access" },
    ],
    cards: [
      { labelText: "Policy", labelColor: "info", title: "VA Community Care expansion", body: "Extends access to non-VA providers. Implementation quality varies by region.", tag: "Active", tagColor: "info" },
      { labelText: "Opportunity", labelColor: "warning", title: "NAMI STL veteran peer support", body: "Peer-to-Peer and Family Support Groups can reach veterans who disengage from VA services.", tag: "Engagement gap", tagColor: "warning" },
    ],
  },
  workforce: {
    id: "workforce", tab: "Workforce", title: "Mental health workforce capacity",
    description: "Missouri mandates access to care while workforce and inpatient infrastructure fall short of demand.",
    sources: [
      { label: "HRSA Workforce", url: "https://bhw.hrsa.gov/" },
      { label: "TAC — Bed Shortage", url: "https://www.treatmentadvocacycenter.org/key-issues/psychiatric-bed-shortage" },
    ],
    stats: [
      { label: "Projected shortage by 2030", value: "250K", sub: "BH workers (HRSA)" },
      { label: "MO psych beds vs avg", value: "−15–20%", sub: "Below national avg" },
      { label: "MO workforce ranking", value: "Bottom 25%", sub: "BH workers per capita" },
    ],
    bars: [
      { label: "ER boarding duration", value: "24–72+ hours", pct: 90, color: "danger" },
      { label: "Jail-to-hospital cycling", value: "Persistent", pct: 85, color: "danger" },
      { label: "LE emergency drop-offs", value: "Common", pct: 75, color: "warning" },
    ],
    cards: [
      { labelText: "Core tension", labelColor: "danger", title: "Mandates without capacity", body: "Missouri expands court-ordered treatment, 988, and mental health courts while operating below national averages on beds, workforce, and inpatient capacity.", tag: "Systemic risk", tagColor: "danger" },
    ],
  },
};
