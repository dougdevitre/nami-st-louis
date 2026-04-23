const RESOURCES_DATA = {
  crisis: {
    title: "Crisis resources",
    icon: "alert",
    items: [
      { name: "988 Suicide & Crisis Lifeline", detail: "Call or text 988 — free, confidential, 24/7", url: "https://988lifeline.org", urgent: true },
      { name: "Crisis Text Line", detail: "Text HOME to 741741", url: "https://www.crisistextline.org", urgent: true },
      { name: "Behavioral Health Response (STL)", detail: "314-469-6644 — 24/7 mobile crisis team", url: "https://bhrstl.org", urgent: true },
      { name: "National Domestic Violence Hotline", detail: "1-800-799-7233 or text START to 88788", url: "https://www.thehotline.org", urgent: false },
      { name: "Veterans Crisis Line", detail: "Dial 988, press 1 — or text 838255", url: "https://www.veteranscrisisline.net", urgent: false },
    ],
  },
  treatment: {
    title: "Treatment & providers",
    icon: "medical",
    items: [
      { name: "SAMHSA Treatment Locator", detail: "Find treatment facilities and programs nationwide", url: "https://findtreatment.gov" },
      { name: "Missouri DMH Provider Directory", detail: "State-funded mental health service providers", url: "https://dmh.mo.gov/mental-illness/program" },
      { name: "Psychology Today Therapist Finder", detail: "Search by location, insurance, specialty", url: "https://www.psychologytoday.com/us/therapists/missouri" },
      { name: "Federally Qualified Health Centers", detail: "Sliding-scale community health centers", url: "https://findahealthcenter.hrsa.gov" },
    ],
  },
  housing: {
    title: "Housing & basic needs",
    icon: "home",
    items: [
      { name: "United Way 211", detail: "Dial 211 for housing, food, utility assistance", url: "https://www.211.org" },
      { name: "St. Louis Housing Authority", detail: "Public housing and voucher programs", url: "https://www.slha.org" },
      { name: "Places for People (STL)", detail: "Housing and services for adults with mental illness", url: "https://www.placesforpeople.org" },
      { name: "St. Patrick Center", detail: "Homeless services, workforce, and housing", url: "https://www.stpatrickcenter.org" },
    ],
  },
  legal: {
    title: "Legal aid & advocacy",
    icon: "scale",
    items: [
      { name: "Legal Services of Eastern Missouri", detail: "Free civil legal aid for low-income residents", url: "https://lsem.org" },
      { name: "Missouri Protection & Advocacy", detail: "Disability rights and advocacy services", url: "https://www.moadvocacy.org" },
      { name: "NAMI Policy Resources", detail: "Federal and state mental health policy updates", url: "https://www.nami.org/advocacy" },
      { name: "Disability Rights Section (DOJ)", detail: "ADA and mental health discrimination complaints", url: "https://www.ada.gov" },
    ],
  },
  benefits: {
    title: "Benefits & insurance",
    icon: "shield",
    items: [
      { name: "MO HealthNet (Missouri Medicaid)", detail: "Apply for Missouri Medicaid coverage", url: "https://mydss.mo.gov" },
      { name: "Healthcare.gov", detail: "Marketplace insurance plans", url: "https://www.healthcare.gov" },
      { name: "SSA Disability Benefits", detail: "SSDI and SSI for mental health conditions", url: "https://www.ssa.gov/disability" },
      { name: "NAMI Insurance Help", detail: "Navigating insurance for mental health treatment", url: "https://www.nami.org/Your-Journey/Individuals-with-Mental-Illness/Understanding-Health-Insurance" },
    ],
  },
  family: {
    title: "Family & caregiver support",
    icon: "family",
    items: [
      { name: "NAMI Family Support Group", detail: "Peer-led groups for families — find local meetings", url: "https://www.nami.org/Support-Education/Support-Groups/NAMI-Family-Support-Group" },
      { name: "Caregiver Action Network", detail: "Tools and support for family caregivers", url: "https://www.caregiveraction.org" },
      { name: "Al-Anon / Nar-Anon", detail: "Support for families affected by substance use", url: "https://al-anon.org" },
      { name: "NAMI Basics", detail: "Education for parents of children with mental health conditions", url: "https://www.nami.org/Support-Education/Mental-Health-Education/NAMI-Basics" },
    ],
  },
};
