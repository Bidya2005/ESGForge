// ============================================================
// ESGFORGE FRONTEND DEMO DATA
// Frontend-only demo data for hackathon presentation.
// No backend/API dependency.
// ============================================================

export const demoOrganization = {
  groupName: "ESGForge Infrastructure Group",
  companyName: "ESGForge Industries Ltd.",
  businessUnit: "Infrastructure Projects",
  projectName: "Odisha Green Infrastructure Project",
  reportingYear: "2025–26",
  reportingPeriod: "April 2025 – March 2026",
};

export const demoSummary = {
  totalActivities: 18,
  scope1Activities: 6,
  scope2Activities: 5,
  scope3Activities: 7,

  scope1Emissions: 4820,
  scope2Emissions: 7230,
  scope3Emissions: 6370,

  totalEmissions: 18420,

  validatedActivities: 14,
  pendingActivities: 3,
  attentionActivities: 1,

  brsrReadiness: 82,
};

// ============================================================
// SCOPE 1
// ============================================================

export const demoScope1Activities = [
  {
    id: "S1-001",
    scope: 1,
    activityType: "Diesel Consumption",
    category: "Mobile Combustion",
    description: "Diesel consumed by project construction vehicles",
    quantity: 2500,
    unit: "L",
    period: "Apr 2025 – Mar 2026",

    source: "Fuel Invoice",
    evidence: "diesel_invoice_april.pdf",

    emissionFactor: 2.68,
    emissionFactorUnit: "kg CO₂e / L",
    factorSource: "Demo India-context emission factor",

    calculatedEmission: 6.70,
    calculatedEmissionUnit: "tCO₂e",

    status: "Validated",
    validationMessage: "Activity data and evidence verified",

    colorType: "scope1",
  },

  {
    id: "S1-002",
    scope: 1,
    activityType: "Diesel Generator",
    category: "Stationary Combustion",
    description: "Diesel consumption for backup generator",
    quantity: 1850,
    unit: "L",
    period: "Apr 2025 – Mar 2026",

    source: "Generator Log",
    evidence: "dg_consumption_log.pdf",

    emissionFactor: 2.68,
    emissionFactorUnit: "kg CO₂e / L",
    factorSource: "Demo India-context emission factor",

    calculatedEmission: 4.96,
    calculatedEmissionUnit: "tCO₂e",

    status: "Validated",
    validationMessage: "Complete activity record",

    colorType: "scope1",
  },
];

// ============================================================
// SCOPE 2
// ============================================================

export const demoScope2Activities = [
  {
    id: "S2-001",
    scope: 2,
    activityType: "Purchased Electricity",
    category: "Purchased Energy",
    description: "Grid electricity consumed at project facilities",
    quantity: 125000,
    unit: "kWh",
    period: "Apr 2025 – Mar 2026",

    source: "Electricity Bill",
    evidence: "electricity_bill_march.pdf",

    accountingMethod: "Location Based",
    gridRegion: "Odisha",

    emissionFactor: 0.72,
    emissionFactorUnit: "kg CO₂e / kWh",
    factorSource: "Demo factor for visualization",

    calculatedEmission: 90.00,
    calculatedEmissionUnit: "tCO₂e",

    status: "Validated",
    validationMessage: "Electricity consumption record validated",

    colorType: "scope2",
  },

  {
    id: "S2-002",
    scope: 2,
    activityType: "Purchased Electricity",
    category: "Purchased Energy",
    description: "Electricity consumption from administrative facility",
    quantity: 84500,
    unit: "kWh",
    period: "Apr 2025 – Mar 2026",

    source: "Meter Reading",
    evidence: "facility_meter_report.pdf",

    accountingMethod: "Market Based",
    gridRegion: "Odisha",

    emissionFactor: 0.68,
    emissionFactorUnit: "kg CO₂e / kWh",
    factorSource: "Demo factor for visualization",

    calculatedEmission: 57.46,
    calculatedEmissionUnit: "tCO₂e",

    status: "Review",
    validationMessage: "Supporting evidence requires review",

    colorType: "scope2",
  },
];

// ============================================================
// SCOPE 3
// ============================================================

export const demoScope3Activities = [
  {
    id: "S3-001",
    scope: 3,
    categoryNumber: 4,
    activityType: "Upstream Material Transportation",
    category: "Category 4 — Upstream Transportation",
    description: "Transportation of construction material to project site",

    material: "Cement",
    transportMode: "Road",
    quantity: 800,
    unit: "tonnes",
    distance: 420,
    distanceUnit: "km",

    period: "Apr 2025 – Mar 2026",

    source: "Supplier Transport Record",
    evidence: "supplier_transport.pdf",

    emissionFactor: 0.105,
    emissionFactorUnit: "kg CO₂e / tonne-km",
    factorSource: "Demo factor for visualization",

    calculatedEmission: 35.28,
    calculatedEmissionUnit: "tCO₂e",

    status: "Validated",
    validationMessage: "Transportation activity validated",

    colorType: "scope3",
  },

  {
    id: "S3-002",
    scope: 3,
    categoryNumber: 5,
    activityType: "Waste Generated in Operations",
    category: "Category 5 — Waste Generated",
    description: "Waste generated during project operations",

    material: "Construction Waste",
    transportMode: "Waste Treatment",
    quantity: 320,
    unit: "tonnes",

    period: "Apr 2025 – Mar 2026",

    source: "Waste Vendor Record",
    evidence: "waste_treatment_certificate.pdf",

    emissionFactor: 0.18,
    emissionFactorUnit: "kg CO₂e / kg waste",
    factorSource: "Demo factor for visualization",

    calculatedEmission: 57.60,
    calculatedEmissionUnit: "tCO₂e",

    status: "Pending",
    validationMessage: "Awaiting evidence review",

    colorType: "scope3",
  },
];

// ============================================================
// EVIDENCE
// ============================================================

export const demoEvidence = [
  {
    id: "EV-001",
    activityId: "S1-001",
    fileName: "diesel_invoice_april.pdf",
    type: "Fuel Invoice",
    uploadedBy: "Project User",
    uploadedDate: "02 Apr 2026",
    status: "Verified",
  },

  {
    id: "EV-002",
    activityId: "S2-001",
    fileName: "electricity_bill_march.pdf",
    type: "Electricity Bill",
    uploadedBy: "Project User",
    uploadedDate: "04 Apr 2026",
    status: "Verified",
  },

  {
    id: "EV-003",
    activityId: "S3-001",
    fileName: "supplier_transport.pdf",
    type: "Supplier Record",
    uploadedBy: "Project User",
    uploadedDate: "06 Apr 2026",
    status: "Verified",
  },
];

// ============================================================
// EMISSION FACTORS
// ============================================================

export const demoEmissionFactors = [
  {
    id: "EF-S1-001",
    activityId: "S1-001",
    factorName: "Diesel Combustion",
    factorValue: 2.68,
    unit: "kg CO₂e / L",
    source: "Demo India-context reference",
    version: "2025.1",
    geography: "India",
    status: "Approved",
  },

  {
    id: "EF-S2-001",
    activityId: "S2-001",
    factorName: "Purchased Electricity",
    factorValue: 0.72,
    unit: "kg CO₂e / kWh",
    source: "Demo factor for visualization",
    version: "2025.1",
    geography: "Odisha",
    status: "Approved",
  },

  {
    id: "EF-S3-001",
    activityId: "S3-001",
    factorName: "Road Material Transportation",
    factorValue: 0.105,
    unit: "kg CO₂e / tonne-km",
    source: "Demo factor for visualization",
    version: "2025.1",
    geography: "India",
    status: "Approved",
  },
];

// ============================================================
// VALIDATION
// ============================================================

export const demoValidation = [
  {
    activityId: "S1-001",
    activity: "Diesel Consumption",
    scope: "Scope 1",
    status: "VALID",
    checks: 6,
    passed: 6,
    issues: 0,
  },

  {
    activityId: "S2-001",
    activity: "Purchased Electricity",
    scope: "Scope 2",
    status: "VALID",
    checks: 7,
    passed: 7,
    issues: 0,
  },

  {
    activityId: "S3-001",
    activity: "Upstream Material Transportation",
    scope: "Scope 3",
    status: "VALID",
    checks: 8,
    passed: 8,
    issues: 0,
  },

  {
    activityId: "S3-002",
    activity: "Waste Generated in Operations",
    scope: "Scope 3",
    status: "PENDING",
    checks: 8,
    passed: 6,
    issues: 2,
  },
];

// ============================================================
// BRSR READINESS
// ============================================================

export const demoReadiness = {
  overall: 82,

  sections: [
    {
      name: "Environmental",
      score: 88,
      status: "Ready",
    },

    {
      name: "Energy & Emissions",
      score: 84,
      status: "Ready",
    },

    {
      name: "Water",
      score: 78,
      status: "Review",
    },

    {
      name: "Waste",
      score: 76,
      status: "Review",
    },

    {
      name: "Social",
      score: 81,
      status: "Ready",
    },
  ],

  gaps: [
    "Scope 3 evidence review pending",
    "Waste disclosure requires supporting document",
    "One emission record requires validation",
  ],
};

// ============================================================
// BRSR DISCLOSURES
// ============================================================

export const demoBRSR = [
  {
    id: "BRSR-E-001",
    section: "Environmental",
    principle: "Principle 6",
    disclosure: "Energy consumption and emissions",
    value: "18,420 tCO₂e",
    status: "Ready",
    sourceActivities: ["S1-001", "S2-001", "S3-001"],
  },

  {
    id: "BRSR-E-002",
    section: "Environmental",
    principle: "Principle 6",
    disclosure: "Scope 1 emissions",
    value: "4,820 tCO₂e",
    status: "Ready",
    sourceActivities: ["S1-001", "S1-002"],
  },

  {
    id: "BRSR-E-003",
    section: "Environmental",
    principle: "Principle 6",
    disclosure: "Scope 2 emissions",
    value: "7,230 tCO₂e",
    status: "Ready",
    sourceActivities: ["S2-001", "S2-002"],
  },

  {
    id: "BRSR-E-004",
    section: "Environmental",
    principle: "Principle 6",
    disclosure: "Scope 3 emissions",
    value: "6,370 tCO₂e",
    status: "Review",
    sourceActivities: ["S3-001", "S3-002"],
  },
];

// ============================================================
// TRACEABILITY
// ============================================================

export const demoTraceability = [
  {
    disclosure: "Scope 1 Emissions",
    brsr: "BRSR Environmental Disclosure",
    calculation: "Calculation Run #CAL-S1-001",
    factor: "Diesel Combustion",
    activity: "Diesel Consumption",
    evidence: "diesel_invoice_april.pdf",
    status: "Complete",
  },

  {
    disclosure: "Scope 2 Emissions",
    brsr: "BRSR Environmental Disclosure",
    calculation: "Calculation Run #CAL-S2-001",
    factor: "Purchased Electricity",
    activity: "Purchased Electricity",
    evidence: "electricity_bill_march.pdf",
    status: "Complete",
  },

  {
    disclosure: "Scope 3 Emissions",
    brsr: "BRSR Environmental Disclosure",
    calculation: "Calculation Run #CAL-S3-001",
    factor: "Road Material Transportation",
    activity: "Upstream Material Transportation",
    evidence: "supplier_transport.pdf",
    status: "Complete",
  },
];

// ============================================================
// EXPORT ALL DEMO DATA
// ============================================================

export const ESGFORGE_DEMO_DATA = {
  organization: demoOrganization,
  summary: demoSummary,

  scope1: demoScope1Activities,
  scope2: demoScope2Activities,
  scope3: demoScope3Activities,

  evidence: demoEvidence,
  emissionFactors: demoEmissionFactors,
  validation: demoValidation,

  readiness: demoReadiness,
  brsr: demoBRSR,
  traceability: demoTraceability,
};