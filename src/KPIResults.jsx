import React, { useMemo, useState } from "react";
import "./KPIResults.css";

/* =========================================================
   FRONTEND DEMO KPI DATA
   ========================================================= */

const KPI_DATA = [
  {
    id: "KPI-001",
    code: "C-EN-01",
    name: "Total GHG Emissions",
    category: "Environmental",
    current: 233.48,
    previous: 245.12,
    unit: "tCO₂e",
    status: "IMPROVING",
    description:
      "Total greenhouse gas emissions across Scope 1, Scope 2 and Scope 3.",
    formula: "Scope 1 + Scope 2 + Scope 3",
    sourceActivity: "All Scope 1, 2 & 3 activities",
    evidence: "Multiple verified evidence records",
    factor: "Multiple emission factors",
    brsr: "BRSR Section C — GHG Emissions",
    scope: "Scope 1 + 2 + 3",
  },

  {
    id: "KPI-002",
    code: "C-EN-02",
    name: "Scope 1 Emissions",
    category: "Environmental",
    current: 11.66,
    previous: 11.66,
    unit: "tCO₂e",
    status: "STABLE",
    description:
      "Direct emissions from owned or controlled fuel-consuming activities.",
    formula: "Fuel Quantity × Emission Factor",
    sourceActivity: "Diesel Consumption + Diesel Generator",
    evidence: "diesel_invoice_april.pdf",
    factor: "2.68 kg CO₂e/L",
    brsr: "BRSR Section C — Scope 1",
    scope: "Scope 1",
  },

  {
    id: "KPI-003",
    code: "C-EN-03",
    name: "Scope 2 Emissions",
    category: "Energy",
    current: 150.84,
    previous: 142.25,
    unit: "tCO₂e",
    status: "NEEDS_ATTENTION",
    description:
      "Indirect emissions associated with purchased electricity consumption.",
    formula: "Electricity Consumption × Grid Emission Factor",
    sourceActivity: "Purchased Electricity",
    evidence: "electricity_bill_march.pdf",
    factor: "0.72 kg CO₂e/kWh",
    brsr: "BRSR Section C — Scope 2",
    scope: "Scope 2",
  },

  {
    id: "KPI-004",
    code: "C-EN-04",
    name: "Scope 3 Emissions",
    category: "Environmental",
    current: 70.98,
    previous: 82.45,
    unit: "tCO₂e",
    status: "IMPROVING",
    description:
      "Selected value-chain emissions from transportation and waste activities.",
    formula: "Activity Quantity × Emission Factor",
    sourceActivity:
      "Upstream Material Transportation + Waste Generated",
    evidence: "supplier_transport.pdf",
    factor: "0.105 kg CO₂e/tonne-km",
    brsr: "BRSR Section C — Scope 3",
    scope: "Scope 3",
  },

  {
    id: "KPI-005",
    code: "C-EN-05",
    name: "Renewable Energy Share",
    category: "Energy",
    current: 34.22,
    previous: 36.38,
    unit: "%",
    status: "NEEDS_ATTENTION",
    description:
      "Share of total energy consumption supplied through renewable sources.",
    formula:
      "(Renewable Energy Consumption ÷ Total Energy Consumption) × 100",
    sourceActivity: "Energy Consumption Records",
    evidence: "renewable_energy_certificate.pdf",
    factor: "Derived KPI",
    brsr: "BRSR Principle 6 — Energy",
    scope: "Energy",
  },

  {
    id: "KPI-006",
    code: "C-EN-06",
    name: "Water Recycling",
    category: "Water",
    current: 24.66,
    previous: 25.20,
    unit: "%",
    status: "NEEDS_ATTENTION",
    description:
      "Percentage of withdrawn water that is recycled or reused.",
    formula:
      "(Water Recycled ÷ Water Withdrawn) × 100",
    sourceActivity: "Water Withdrawal & Recycling Records",
    evidence: "water_recycling_log.pdf",
    factor: "Derived KPI",
    brsr: "BRSR Principle 6 — Water",
    scope: "Water",
  },

  {
    id: "KPI-007",
    code: "C-EN-07",
    name: "Waste Recycling",
    category: "Waste",
    current: 39.45,
    previous: 41.89,
    unit: "%",
    status: "NEEDS_ATTENTION",
    description:
      "Percentage of generated waste that is recycled.",
    formula:
      "(Recycled Waste ÷ Total Waste Generated) × 100",
    sourceActivity: "Waste Generated Records",
    evidence: "waste_manifest_q4.pdf",
    factor: "Derived KPI",
    brsr: "BRSR Principle 6 — Waste",
    scope: "Waste",
  },

  {
    id: "KPI-008",
    code: "C-SO-01",
    name: "Female Workforce",
    category: "Social",
    current: 21.81,
    previous: 20.10,
    unit: "%",
    status: "IMPROVING",
    description:
      "Percentage of total workforce represented by female employees.",
    formula:
      "(Female Employees ÷ Total Employees) × 100",
    sourceActivity: "Workforce Records",
    evidence: "employee_master_report.pdf",
    factor: "Derived KPI",
    brsr: "BRSR Principle 3 — Workforce",
    scope: "Social",
  },

  {
    id: "KPI-009",
    code: "C-SO-02",
    name: "Training Coverage",
    category: "Social",
    current: 78.40,
    previous: 74.10,
    unit: "%",
    status: "IMPROVING",
    description:
      "Percentage of employees covered by relevant training programs.",
    formula:
      "(Employees Trained ÷ Total Employees) × 100",
    sourceActivity: "Employee Training Records",
    evidence: "training_register_2025.pdf",
    factor: "Derived KPI",
    brsr: "BRSR Principle 3 — Training",
    scope: "Social",
  },

  {
    id: "KPI-010",
    code: "C-SO-03",
    name: "Grievance Resolution",
    category: "Social",
    current: 92.30,
    previous: 89.50,
    unit: "%",
    status: "IMPROVING",
    description:
      "Percentage of received employee or stakeholder grievances resolved.",
    formula:
      "(Grievances Resolved ÷ Grievances Received) × 100",
    sourceActivity: "Grievance Register",
    evidence: "grievance_register.pdf",
    factor: "Derived KPI",
    brsr: "BRSR Principle 3 — Grievances",
    scope: "Social",
  },

  {
    id: "KPI-011",
    code: "C-GV-01",
    name: "Ethics Incidents",
    category: "Governance",
    current: 2,
    previous: 3,
    unit: "incidents",
    status: "IMPROVING",
    description:
      "Reported ethics, anti-corruption or compliance incidents.",
    formula: "Count of Reported Incidents",
    sourceActivity: "Ethics & Compliance Register",
    evidence: "ethics_compliance_report.pdf",
    factor: "Direct Count",
    brsr: "BRSR Principle 1 — Ethics",
    scope: "Governance",
  },

  {
    id: "KPI-012",
    code: "C-GV-02",
    name: "Data Privacy Incidents",
    category: "Governance",
    current: 1,
    previous: 1,
    unit: "incidents",
    status: "STABLE",
    description:
      "Number of reported data privacy and information security incidents.",
    formula: "Count of Reported Incidents",
    sourceActivity: "Data Privacy Register",
    evidence: "privacy_incident_log.pdf",
    factor: "Direct Count",
    brsr: "BRSR Principle 1 — Data Privacy",
    scope: "Governance",
  },

  {
    id: "KPI-013",
    code: "C-EN-08",
    name: "Energy Consumption",
    category: "Energy",
    current: 209500,
    previous: 218000,
    unit: "kWh",
    status: "IMPROVING",
    description:
      "Total recorded electricity consumption during the reporting period.",
    formula: "Sum of Reported Electricity Consumption",
    sourceActivity: "Purchased Electricity Activities",
    evidence: "electricity_bill_march.pdf",
    factor: "Not applicable",
    brsr: "BRSR Principle 6 — Energy",
    scope: "Energy",
  },

  {
    id: "KPI-014",
    code: "C-EN-09",
    name: "Water Withdrawal",
    category: "Water",
    current: 18420,
    previous: 17680,
    unit: "kL",
    status: "NEEDS_ATTENTION",
    description:
      "Total water withdrawn across reporting activities.",
    formula: "Sum of Water Withdrawal",
    sourceActivity: "Water Withdrawal Records",
    evidence: "water_meter_records.pdf",
    factor: "Not applicable",
    brsr: "BRSR Principle 6 — Water",
    scope: "Water",
  },

  {
    id: "KPI-015",
    code: "C-EN-10",
    name: "Total Waste Generated",
    category: "Waste",
    current: 420,
    previous: 445,
    unit: "tonnes",
    status: "IMPROVING",
    description:
      "Total waste generated across reporting activities.",
    formula: "Sum of Reported Waste Quantities",
    sourceActivity: "Waste Generated Activities",
    evidence: "waste_manifest_q4.pdf",
    factor: "Not applicable",
    brsr: "BRSR Principle 6 — Waste",
    scope: "Waste",
  },
];

/* =========================================================
   STATUS CONFIG
   ========================================================= */

const STATUS_CONFIG = {
  IMPROVING: {
    label: "Improving",
    className: "improving",
    icon: "↗",
  },

  STABLE: {
    label: "Stable",
    className: "stable",
    icon: "→",
  },

  NEEDS_ATTENTION: {
    label: "Needs Attention",
    className: "attention",
    icon: "!",
  },
};

/* =========================================================
   HELPERS
   ========================================================= */

function getTrend(current, previous) {
  if (
    current === null ||
    previous === null ||
    previous === 0
  ) {
    return null;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  if (Number.isInteger(value)) {
    return value.toLocaleString();
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({ status }) {
  const config =
    STATUS_CONFIG[status] || STATUS_CONFIG.STABLE;

  return (
    <span
      className={`kpi-status-badge ${config.className}`}
    >
      <b>{config.icon}</b>
      {config.label}
    </span>
  );
}

/* =========================================================
   KPI RESULTS
   ========================================================= */

function KPIResults({ onNavigate }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedKPI, setSelectedKPI] = useState(null);

  /* -------------------------------------------------------
     SUMMARY
     ------------------------------------------------------- */

  const stats = useMemo(() => {
    const improving = KPI_DATA.filter(
      (item) => item.status === "IMPROVING"
    ).length;

    const stable = KPI_DATA.filter(
      (item) => item.status === "STABLE"
    ).length;

    const attention = KPI_DATA.filter(
      (item) => item.status === "NEEDS_ATTENTION"
    ).length;

    return {
      total: KPI_DATA.length,
      improving,
      stable,
      attention,
    };
  }, []);

  const healthPercentage = Math.round(
    ((stats.improving + stats.stable) /
      stats.total) *
      100
  );

  /* -------------------------------------------------------
     CATEGORY COUNTS
     ------------------------------------------------------- */

  const categories = useMemo(() => {
    const result = {};

    KPI_DATA.forEach((item) => {
      result[item.category] =
        (result[item.category] || 0) + 1;
    });

    return result;
  }, []);

  /* -------------------------------------------------------
     FILTER
     ------------------------------------------------------- */

  const filteredResults = useMemo(() => {
    return KPI_DATA.filter((item) => {
      const matchesFilter =
        filter === "ALL" ||
        item.category.toUpperCase() ===
          filter.toUpperCase();

      const query = search.toLowerCase();

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  /* -------------------------------------------------------
     NAVIGATION
     ------------------------------------------------------- */

  const handleTrace = () => {
    setSelectedKPI(null);

    if (onNavigate) {
      onNavigate("traceability");
    }
  };

  const handleEvidence = () => {
    setSelectedKPI(null);

    if (onNavigate) {
      onNavigate("evidence");
    }
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="kpi-page">

      {/* =================================================
          HERO
          ================================================= */}

      <section className="kpi-hero">

        <div className="kpi-hero-content">

          <div className="kpi-eyebrow">
            <span></span>
            ESG INTELLIGENCE
          </div>

          <h1>KPI Results</h1>

          <p>
            Transform ESG activity data into measurable
            performance indicators, BRSR disclosures and
            audit-ready intelligence.
          </p>

          <div className="kpi-hero-meta">

            <span className="kpi-period">
              ◷ FY 2025–26 · Annual
            </span>

            <span className="kpi-live">
              <i></i>
              Frontend Demo
            </span>

            <span className="kpi-live">
              <i></i>
              15 KPIs Calculated
            </span>

          </div>

        </div>

        <div className="kpi-hero-visual">

          <div className="hero-orbit orbit-one"></div>
          <div className="hero-orbit orbit-two"></div>

          <div className="hero-kpi-center">
            <strong>{stats.total}</strong>
            <span>KPIs</span>
          </div>

        </div>

      </section>

      {/* =================================================
          SUMMARY CARDS
          ================================================= */}

      <section className="kpi-summary-grid">

        <div className="kpi-summary-card total">

          <div className="summary-icon">
            ◈
          </div>

          <div>
            <span>Total KPIs</span>
            <strong>{stats.total}</strong>
            <small>Calculated indicators</small>
          </div>

        </div>

        <div className="kpi-summary-card improving">

          <div className="summary-icon">
            ↗
          </div>

          <div>
            <span>Improving</span>
            <strong>{stats.improving}</strong>
            <small>Positive performance</small>
          </div>

        </div>

        <div className="kpi-summary-card stable">

          <div className="summary-icon">
            →
          </div>

          <div>
            <span>Stable</span>
            <strong>{stats.stable}</strong>
            <small>Consistent performance</small>
          </div>

        </div>

        <div className="kpi-summary-card attention">

          <div className="summary-icon">
            !
          </div>

          <div>
            <span>Needs Attention</span>
            <strong>{stats.attention}</strong>
            <small>Requires review</small>
          </div>

        </div>

      </section>

      {/* =================================================
          HEALTH + CATEGORY
          ================================================= */}

      <section className="kpi-overview-grid">

        {/* HEALTH */}

        <div className="performance-card">

          <div className="card-heading">

            <div>
              <span className="card-kicker">
                PERFORMANCE OVERVIEW
              </span>

              <h2>KPI Health</h2>
            </div>

            <span className="health-percent">
              {healthPercentage}%
            </span>

          </div>

          <div className="health-visual">

            <div
              className="health-ring"
              style={{
                background: `conic-gradient(
                  #4d91d1 ${
                    healthPercentage * 3.6
                  }deg,
                  #e9edf2 0deg
                )`,
              }}
            >

              <div>
                <strong>
                  {healthPercentage}%
                </strong>

                <span>
                  Healthy
                </span>
              </div>

            </div>

            <div className="health-details">

              <div>
                <span className="health-dot green"></span>
                <label>Improving</label>
                <strong>{stats.improving}</strong>
              </div>

              <div>
                <span className="health-dot blue"></span>
                <label>Stable</label>
                <strong>{stats.stable}</strong>
              </div>

              <div>
                <span className="health-dot orange"></span>
                <label>Attention</label>
                <strong>{stats.attention}</strong>
              </div>

            </div>

          </div>

        </div>

        {/* CATEGORY */}

        <div className="category-card">

          <div className="card-heading">

            <div>
              <span className="card-kicker">
                ESG CATEGORIES
              </span>

              <h2>KPI Distribution</h2>
            </div>

            <span className="live-mini">
              LIVE
            </span>

          </div>

          <div className="category-list">

            <div className="category-row">

              <div className="category-info">

                <span className="category-symbol environmental">
                  🌱
                </span>

                <div>
                  <strong>Environmental</strong>
                  <small>
                    Climate, energy & emissions
                  </small>
                </div>

              </div>

              <div className="category-number">
                <strong>
                  {categories.Environmental || 0}
                </strong>
                <span>KPIs</span>
              </div>

            </div>

            <div className="category-row">

              <div className="category-info">

                <span className="category-symbol social">
                  ♧
                </span>

                <div>
                  <strong>Social</strong>
                  <small>
                    Workforce & community
                  </small>
                </div>

              </div>

              <div className="category-number">
                <strong>
                  {categories.Social || 0}
                </strong>
                <span>KPIs</span>
              </div>

            </div>

            <div className="category-row">

              <div className="category-info">

                <span className="category-symbol governance">
                  ◈
                </span>

                <div>
                  <strong>Governance</strong>
                  <small>
                    Ethics & compliance
                  </small>
                </div>

              </div>

              <div className="category-number">
                <strong>
                  {categories.Governance || 0}
                </strong>
                <span>KPIs</span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          EMISSIONS INTELLIGENCE
          ================================================= */}

      <section className="kpi-emissions-panel">

        <div className="emissions-heading">

          <div>
            <span className="card-kicker">
              EMISSIONS INTELLIGENCE
            </span>

            <h2>GHG Performance by Scope</h2>

            <p>
              Activity-level emissions consolidated into
              reporting KPIs.
            </p>
          </div>

          <span className="emissions-total">
            233.48 tCO₂e
          </span>

        </div>

        <div className="emissions-scope-grid">

          <div className="emission-scope-card scope-one">

            <div className="scope-number">
              01
            </div>

            <div>
              <span>Scope 1</span>
              <strong>11.66</strong>
              <small>tCO₂e · Direct emissions</small>
            </div>

            <b>5.0%</b>

          </div>

          <div className="emission-scope-card scope-two">

            <div className="scope-number">
              02
            </div>

            <div>
              <span>Scope 2</span>
              <strong>150.84</strong>
              <small>tCO₂e · Purchased energy</small>
            </div>

            <b>64.6%</b>

          </div>

          <div className="emission-scope-card scope-three">

            <div className="scope-number">
              03
            </div>

            <div>
              <span>Scope 3</span>
              <strong>70.98</strong>
              <small>tCO₂e · Value chain</small>
            </div>

            <b>30.4%</b>

          </div>

        </div>

      </section>

      {/* =================================================
          RESULTS
          ================================================= */}

      <section className="results-section">

        <div className="results-heading">

          <div>

            <span className="card-kicker">
              CALCULATED INDICATORS
            </span>

            <h2>ESG KPI Results</h2>

            <p>
              Explore performance, calculations and BRSR
              mapping for every KPI.
            </p>

          </div>

        </div>

        {/* TOOLBAR */}

        <div className="kpi-toolbar">

          <div className="kpi-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search KPI, code or category..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>

          <div className="filter-group">

            {[
              ["ALL", "All"],
              ["ENVIRONMENTAL", "Environmental"],
              ["ENERGY", "Energy"],
              ["WATER", "Water"],
              ["WASTE", "Waste"],
              ["SOCIAL", "Social"],
              ["GOVERNANCE", "Governance"],
            ].map(([value, label]) => (

              <button
                key={value}
                className={
                  filter === value
                    ? "active"
                    : ""
                }
                onClick={() => setFilter(value)}
              >
                {label}
              </button>

            ))}

          </div>

        </div>

        {/* RESULT COUNT */}

        <div className="result-count">
          Showing{" "}
          <strong>
            {filteredResults.length}
          </strong>{" "}
          of {KPI_DATA.length} KPIs
        </div>

        {/* CARDS */}

        {filteredResults.length === 0 ? (

          <div className="kpi-empty">

            <div className="empty-icon">
              ◌
            </div>

            <h3>
              No KPI results found
            </h3>

            <p>
              Try changing your search or category filter.
            </p>

          </div>

        ) : (

          <div className="kpi-result-grid">

            {filteredResults.map((item) => {

              const trend = getTrend(
                item.current,
                item.previous
              );

              const config =
                STATUS_CONFIG[item.status];

              return (

                <article
                  className={`kpi-result-card ${config.className}`}
                  key={item.id}
                >

                  <div className="result-top">

                    <div className="result-category">
                      {item.category}
                    </div>

                    <StatusBadge
                      status={item.status}
                    />

                  </div>

                  <h3>
                    {item.name}
                  </h3>

                  <div className="kpi-code">
                    {item.code}
                  </div>

                  <div className="result-value">

                    <strong>
                      {formatNumber(item.current)}
                    </strong>

                    <span>
                      {item.unit}
                    </span>

                  </div>

                  {trend !== null && (

                    <div
                      className={`trend ${
                        item.status === "IMPROVING"
                          ? "positive"
                          : item.status ===
                            "NEEDS_ATTENTION"
                          ? "warning"
                          : "neutral"
                      }`}
                    >

                      <span>
                        {trend > 0
                          ? "↗"
                          : trend < 0
                          ? "↘"
                          : "→"}
                      </span>

                      {Math.abs(trend).toFixed(1)}%

                      <small>
                        vs previous period
                      </small>

                    </div>

                  )}

                  <div className="kpi-mini-line">
                    <span>
                      BRSR Mapping
                    </span>

                    <strong>
                      {item.brsr}
                    </strong>
                  </div>

                  <div className="result-footer">

                    <span>
                      {item.scope}
                    </span>

                    <button
                      onClick={() =>
                        setSelectedKPI(item)
                      }
                    >
                      View Details →
                    </button>

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </section>

      {/* =================================================
          KPI TRACEABILITY
          ================================================= */}

      <section className="kpi-trace-panel">

        <div className="trace-panel-icon">
          ◎
        </div>

        <div className="trace-panel-content">

          <span className="card-kicker">
            AUDIT-READY TRACEABILITY
          </span>

          <h2>
            Every KPI can be traced back to its source.
          </h2>

          <p>
            Follow the complete lineage from BRSR disclosure
            to KPI result, calculation, activity, evidence
            and emission factor.
          </p>

          <div className="trace-chain-mini">

            <span>BRSR</span>
            <b>→</b>
            <span>KPI</span>
            <b>→</b>
            <span>Calculation</span>
            <b>→</b>
            <span>Activity</span>
            <b>→</b>
            <span>Evidence</span>
            <b>→</b>
            <span>Factor</span>

          </div>

        </div>

        <button
          className="trace-panel-button"
          onClick={() =>
            onNavigate &&
            onNavigate("traceability")
          }
        >
          Open Traceability
          <span>→</span>
        </button>

      </section>

      {/* =================================================
          WORKFLOW
          ================================================= */}

      <section className="kpi-workflow">

        <div className="workflow-heading">

          <span className="card-kicker">
            ESG DATA FLOW
          </span>

          <h2>
            From Activity to Disclosure
          </h2>

        </div>

        <div className="workflow-steps">

          <div className="workflow-step">

            <span>01</span>

            <strong>
              Activity Data
            </strong>

            <small>
              Quantity & unit
            </small>

          </div>

          <b>→</b>

          <div className="workflow-step">

            <span>02</span>

            <strong>
              Validation
            </strong>

            <small>
              Quality checks
            </small>

          </div>

          <b>→</b>

          <div className="workflow-step active">

            <span>03</span>

            <strong>
              KPI Calculation
            </strong>

            <small>
              Current page
            </small>

          </div>

          <b>→</b>

          <div className="workflow-step">

            <span>04</span>

            <strong>
              BRSR Mapping
            </strong>

            <small>
              Disclosure
            </small>

          </div>

          <b>→</b>

          <div className="workflow-step">

            <span>05</span>

            <strong>
              Reporting
            </strong>

            <small>
              Audit-ready output
            </small>

          </div>

        </div>

      </section>

      {/* =================================================
          FRONTEND DEMO NOTICE
          ================================================= */}

      <section className="kpi-demo-notice">

        <span>i</span>

        <div>

          <strong>
            Frontend demonstration mode
          </strong>

          <p>
            KPI values, trends and calculations shown here
            are demonstration data designed to illustrate
            the ESGForge reporting workflow. They are not
            live regulatory or backend-generated values.
          </p>

        </div>

      </section>

      {/* =================================================
          ACTION BAR
          ================================================= */}

      <section className="kpi-actions">

        <div>

          <strong>
            Continue your ESG workflow
          </strong>

          <span>
            Review evidence or explore the complete KPI
            traceability chain.
          </span>

        </div>

        <div className="kpi-action-buttons">

          {onNavigate && (

            <button
              className="kpi-secondary-button"
              onClick={() =>
                onNavigate("validation")
              }
            >
              ← Validation
            </button>

          )}

          <button
            className="kpi-primary-button"
            onClick={() =>
              onNavigate &&
              onNavigate("brsr-readiness")
            }
          >
            BRSR Readiness
            <span>→</span>
          </button>

        </div>

      </section>

      {/* =================================================
          KPI DETAIL MODAL
          ================================================= */}

      {selectedKPI && (

        <div
          className="kpi-modal-overlay"
          onClick={() =>
            setSelectedKPI(null)
          }
        >

          <div
            className="kpi-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="kpi-modal-close"
              onClick={() =>
                setSelectedKPI(null)
              }
            >
              ×
            </button>

            <div className="modal-header">

              <div>

                <span className="card-kicker">
                  KPI DETAIL
                </span>

                <h2>
                  {selectedKPI.name}
                </h2>

                <p>
                  {selectedKPI.code} ·{" "}
                  {selectedKPI.category}
                </p>

              </div>

              <StatusBadge
                status={selectedKPI.status}
              />

            </div>

            <div className="modal-value">

              <span>Current Value</span>

              <strong>
                {formatNumber(
                  selectedKPI.current
                )}
              </strong>

              <b>
                {selectedKPI.unit}
              </b>

            </div>

            <div className="modal-grid">

              <div>
                <span>Previous Period</span>
                <strong>
                  {formatNumber(
                    selectedKPI.previous
                  )}{" "}
                  {selectedKPI.unit}
                </strong>
              </div>

              <div>
                <span>Source Activity</span>
                <strong>
                  {selectedKPI.sourceActivity}
                </strong>
              </div>

              <div>
                <span>Evidence</span>
                <strong>
                  {selectedKPI.evidence}
                </strong>
              </div>

              <div>
                <span>Emission Factor</span>
                <strong>
                  {selectedKPI.factor}
                </strong>
              </div>

            </div>

            <div className="modal-section">

              <span className="card-kicker">
                CALCULATION
              </span>

              <div className="formula-box">
                {selectedKPI.formula}
              </div>

              <p>
                {selectedKPI.description}
              </p>

            </div>

            <div className="modal-section">

              <span className="card-kicker">
                BRSR MAPPING
              </span>

              <div className="brsr-mapping">
                {selectedKPI.brsr}
              </div>

            </div>

            <div className="modal-actions">

              <button
                className="modal-secondary"
                onClick={handleEvidence}
              >
                View Evidence
              </button>

              <button
                className="modal-primary"
                onClick={handleTrace}
              >
                Trace KPI →
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default KPIResults;