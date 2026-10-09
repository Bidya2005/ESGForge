import React, { useMemo, useState } from "react";
import "./Reports.css";

const REPORT_DATA = {
  organization: "ESGForge Demo Organization",
  company: "ESGForge Manufacturing & Infrastructure",
  reportingYear: "2025–26",
  period: "Annual",
  periodStart: "01 Apr 2025",
  periodEnd: "31 Mar 2026",

  readiness: 82,

  emissions: {
    scope1: 11.66,
    scope2: 150.84,
    scope3: 70.98,
    total: 233.48,
  },

  activities: {
    total: 6,
    scope1: 2,
    scope2: 2,
    scope3: 2,
  },

  validation: {
    total: 6,
    valid: 4,
    review: 2,
    pending: 0,
  },

  kpis: [
    {
      name: "Total GHG Emissions",
      value: "233.48",
      unit: "tCO₂e",
      status: "IMPROVING",
    },
    {
      name: "Scope 1 Emissions",
      value: "11.66",
      unit: "tCO₂e",
      status: "STABLE",
    },
    {
      name: "Scope 2 Emissions",
      value: "150.84",
      unit: "tCO₂e",
      status: "NEEDS ATTENTION",
    },
    {
      name: "Scope 3 Emissions",
      value: "70.98",
      unit: "tCO₂e",
      status: "IMPROVING",
    },
    {
      name: "Renewable Energy Share",
      value: "34.22",
      unit: "%",
      status: "IMPROVING",
    },
    {
      name: "Water Recycling",
      value: "24.66",
      unit: "%",
      status: "STABLE",
    },
    {
      name: "Waste Recycling",
      value: "39.45",
      unit: "%",
      status: "IMPROVING",
    },
    {
      name: "Female Workforce",
      value: "21.81",
      unit: "%",
      status: "IMPROVING",
    },
    {
      name: "Training Coverage",
      value: "78.40",
      unit: "%",
      status: "STABLE",
    },
  ],

  disclosures: [
    {
      name: "Environmental Performance",
      readiness: 92,
      status: "READY",
    },
    {
      name: "GHG Emissions",
      readiness: 88,
      status: "READY",
    },
    {
      name: "Energy Management",
      readiness: 76,
      status: "REVIEW",
    },
    {
      name: "Water Management",
      readiness: 72,
      status: "REVIEW",
    },
    {
      name: "Waste Management",
      readiness: 68,
      status: "REVIEW",
    },
    {
      name: "Employee Wellbeing",
      readiness: 84,
      status: "READY",
    },
  ],

  activitiesList: [
    {
      id: "S1-001",
      scope: "Scope 1",
      activity: "Diesel Consumption",
      quantity: "2,500 L",
      factor: "2.68 kg CO₂e/L",
      emissions: "6.70 tCO₂e",
      evidence: "diesel_invoice_april.pdf",
      status: "VALID",
    },
    {
      id: "S1-002",
      scope: "Scope 1",
      activity: "Diesel Generator",
      quantity: "1,850 L",
      factor: "2.68 kg CO₂e/L",
      emissions: "4.96 tCO₂e",
      evidence: "generator_fuel.pdf",
      status: "VALID",
    },
    {
      id: "S2-001",
      scope: "Scope 2",
      activity: "Purchased Electricity",
      quantity: "125,000 kWh",
      factor: "0.72 kg CO₂e/kWh",
      emissions: "90.00 tCO₂e",
      evidence: "electricity_bill_march.pdf",
      status: "VALID",
    },
    {
      id: "S2-002",
      scope: "Scope 2",
      activity: "Purchased Electricity",
      quantity: "84,500 kWh",
      factor: "0.72 kg CO₂e/kWh",
      emissions: "60.84 tCO₂e",
      evidence: "electricity_bill_feb.pdf",
      status: "REVIEW",
    },
    {
      id: "S3-001",
      scope: "Scope 3",
      activity: "Upstream Material Transportation",
      quantity: "800 t × 420 km",
      factor: "0.105 kg CO₂e/t-km",
      emissions: "35.28 tCO₂e",
      evidence: "supplier_transport.pdf",
      status: "VALID",
    },
    {
      id: "S3-002",
      scope: "Scope 3",
      activity: "Waste Generated",
      quantity: "420 tonnes",
      factor: "0.085 kg CO₂e/kg",
      emissions: "35.70 tCO₂e",
      evidence: "Evidence required",
      status: "REVIEW",
    },
  ],
};

function StatusBadge({ status }) {
  const normalized = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`report-status status-${normalized}`}>
      {status}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="report-progress">
      <div
        className="report-progress-fill"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ScopeCard({ scope, value, description, icon }) {
  return (
    <div className={`scope-report-card scope-${scope.toLowerCase().replace(" ", "")}`}>
      <div className="scope-card-top">
        <div className="scope-icon">{icon}</div>
        <span>{scope}</span>
      </div>

      <div className="scope-value">
        {value.toFixed(2)}
        <small> tCO₂e</small>
      </div>

      <p>{description}</p>
    </div>
  );
}

export default function Reports({ onTrace }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showGeneratedReport, setShowGeneratedReport] = useState(false);
  const [generatedAt, setGeneratedAt] = useState(null);

  const filteredKPIs = useMemo(() => {
    return REPORT_DATA.kpis.filter((kpi) => {
      const matchesSearch = kpi.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        kpi.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const handleGenerateReport = () => {
    setGeneratedAt(
      new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    setShowGeneratedReport(true);

    setTimeout(() => {
      document
        .getElementById("generated-brsr-report")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleTrace = (activity) => {
    if (onTrace) {
      onTrace(activity);
      return;
    }

    alert(
      `Traceability opened for ${activity.id}: Activity → Evidence → Factor → CO₂e → KPI → BRSR`
    );
  };

  return (
    <div className="reports-page">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="reports-hero">
        <div className="reports-hero-content">

          <div className="reports-breadcrumb">
            ESGForge
            <span>/</span>
            Reports
          </div>

          <div className="reports-hero-row">

            <div>
              <div className="reports-eyebrow">
                BRSR REPORTING CENTER
              </div>

              <h1>
                ESG Report
                <span> & BRSR Intelligence</span>
              </h1>

              <p>
                Review validated ESG information, emissions,
                KPI performance and disclosure readiness before
                generating the final reporting view.
              </p>
            </div>

            <div className="hero-readiness">
              <div className="readiness-ring">
                <div>
                  <strong>{REPORT_DATA.readiness}%</strong>
                  <span>Ready</span>
                </div>
              </div>

              <div>
                <small>Overall BRSR Readiness</small>
                <strong>Good Progress</strong>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          REPORT IDENTITY
      ========================================================= */}
      <section className="report-container">

        <div className="report-identity-card">

          <div className="identity-main">
            <div className="company-logo">E</div>

            <div>
              <span className="identity-label">
                REPORTING ORGANIZATION
              </span>

              <h2>{REPORT_DATA.organization}</h2>

              <p>{REPORT_DATA.company}</p>
            </div>
          </div>

          <div className="identity-details">

            <div>
              <span>REPORTING YEAR</span>
              <strong>{REPORT_DATA.reportingYear}</strong>
            </div>

            <div>
              <span>PERIOD</span>
              <strong>{REPORT_DATA.period}</strong>
            </div>

            <div>
              <span>PERIOD START</span>
              <strong>{REPORT_DATA.periodStart}</strong>
            </div>

            <div>
              <span>PERIOD END</span>
              <strong>{REPORT_DATA.periodEnd}</strong>
            </div>

          </div>
        </div>

        {/* =========================================================
            ACTION BAR
        ========================================================= */}
        <div className="report-action-bar">

          <div>
            {showGeneratedReport ? (
              <>
                <div className="generated-success">
                  <span>✓</span>
                  BRSR report generated successfully
                </div>

                <small>
                  Generated {generatedAt}
                </small>
              </>
            ) : (
              <>
                <strong>Ready to generate report</strong>
                <span>
                  Review the reporting summary before generating.
                </span>
              </>
            )}
          </div>

          <div className="report-actions">

            <button
              className="secondary-report-btn"
              onClick={handlePrintReport}
            >
              🖨 Print / Save PDF
            </button>

            <button
              className={`generate-report-btn ${
                showGeneratedReport ? "generated" : ""
              }`}
              onClick={handleGenerateReport}
            >
              {showGeneratedReport
                ? "✓ Report Generated"
                : "Generate BRSR Report"}
            </button>

          </div>
        </div>

        {/* =========================================================
            EMISSIONS OVERVIEW
        ========================================================= */}
        <section className="report-section">

          <div className="section-heading">
            <div>
              <span className="section-kicker">
                ENVIRONMENTAL PERFORMANCE
              </span>

              <h2>GHG Emissions Overview</h2>

              <p>
                Consolidated Scope 1, Scope 2 and Scope 3
                emissions captured from activity-level records.
              </p>
            </div>

            <div className="total-emissions">
              <span>Total GHG</span>
              <strong>
                {REPORT_DATA.emissions.total.toFixed(2)}
              </strong>
              <small>tCO₂e</small>
            </div>
          </div>

          <div className="scope-grid">

            <ScopeCard
              scope="Scope 1"
              value={REPORT_DATA.emissions.scope1}
              description="Direct emissions from owned or controlled sources."
              icon="🔥"
            />

            <ScopeCard
              scope="Scope 2"
              value={REPORT_DATA.emissions.scope2}
              description="Indirect emissions from purchased electricity."
              icon="⚡"
            />

            <ScopeCard
              scope="Scope 3"
              value={REPORT_DATA.emissions.scope3}
              description="Value-chain emissions from upstream activities."
              icon="🔗"
            />

          </div>

        </section>

        {/* =========================================================
            ACTIVITY SNAPSHOT
        ========================================================= */}
        <section className="metric-strip">

          <div className="mini-metric">
            <span>Activities</span>
            <strong>{REPORT_DATA.activities.total}</strong>
            <small>Total captured</small>
          </div>

          <div className="mini-metric">
            <span>Scope 1</span>
            <strong>{REPORT_DATA.activities.scope1}</strong>
            <small>Activities</small>
          </div>

          <div className="mini-metric">
            <span>Scope 2</span>
            <strong>{REPORT_DATA.activities.scope2}</strong>
            <small>Activities</small>
          </div>

          <div className="mini-metric">
            <span>Scope 3</span>
            <strong>{REPORT_DATA.activities.scope3}</strong>
            <small>Activities</small>
          </div>

          <div className="mini-metric">
            <span>Validated</span>
            <strong>
              {REPORT_DATA.validation.valid}/{REPORT_DATA.validation.total}
            </strong>
            <small>Records</small>
          </div>

        </section>

        {/* =========================================================
            REPORTING PIPELINE
        ========================================================= */}
        <section className="report-section">

          <div className="section-heading">
            <div>
              <span className="section-kicker">
                DATA GOVERNANCE
              </span>

              <h2>Reporting Pipeline</h2>

              <p>
                Every reported number follows a traceable
                activity-to-disclosure workflow.
              </p>
            </div>
          </div>

          <div className="pipeline">

            {[
              ["01", "Activity Data", "Operational activity captured"],
              ["02", "Evidence", "Source document attached"],
              ["03", "Emission Factor", "Factor selected and displayed"],
              ["04", "CO₂e Calculation", "Quantity × factor"],
              ["05", "Validation", "Data quality reviewed"],
              ["06", "BRSR Disclosure", "Ready for reporting"],
            ].map(([number, title, text], index) => (
              <React.Fragment key={number}>

                <div className="pipeline-step">
                  <div className="pipeline-number">
                    {number}
                  </div>

                  <strong>{title}</strong>

                  <span>{text}</span>
                </div>

                {index < 5 && (
                  <div className="pipeline-arrow">→</div>
                )}

              </React.Fragment>
            ))}

          </div>
        </section>

        {/* =========================================================
            BRSR DISCLOSURES
        ========================================================= */}
        <section className="report-section">

          <div className="section-heading">
            <div>
              <span className="section-kicker">
                BRSR SECTION C
              </span>

              <h2>Disclosure Readiness</h2>

              <p>
                Readiness of major reporting areas based on
                captured, validated and traceable data.
              </p>
            </div>
          </div>

          <div className="disclosure-grid">

            {REPORT_DATA.disclosures.map((item) => (
              <div
                className="disclosure-card"
                key={item.name}
              >

                <div className="disclosure-top">
                  <div className="disclosure-icon">
                    ✓
                  </div>

                  <StatusBadge status={item.status} />
                </div>

                <h3>{item.name}</h3>

                <div className="disclosure-score">
                  <strong>{item.readiness}%</strong>
                  <span>readiness</span>
                </div>

                <ProgressBar value={item.readiness} />

              </div>
            ))}

          </div>
        </section>

        {/* =========================================================
            KPI TABLE
        ========================================================= */}
        <section className="report-section">

          <div className="section-heading">
            <div>
              <span className="section-kicker">
                KPI INTELLIGENCE
              </span>

              <h2>KPI Results</h2>

              <p>
                Consolidated ESG indicators used for reporting
                and management review.
              </p>
            </div>
          </div>

          <div className="kpi-toolbar">

            <input
              type="text"
              placeholder="Search KPI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="IMPROVING">Improving</option>
              <option value="STABLE">Stable</option>
              <option value="NEEDS ATTENTION">
                Needs Attention
              </option>
            </select>

          </div>

          <div className="table-wrapper">

            <table className="kpi-table">

              <thead>
                <tr>
                  <th>KPI</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredKPIs.map((kpi) => (
                  <tr key={kpi.name}>

                    <td>
                      <strong>{kpi.name}</strong>
                    </td>

                    <td className="table-value">
                      {kpi.value}
                    </td>

                    <td>{kpi.unit}</td>

                    <td>
                      <StatusBadge status={kpi.status} />
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>

        </section>

        {/* =========================================================
            VALIDATION
        ========================================================= */}
        <section className="report-section">

          <div className="validation-card">

            <div className="validation-icon">
              ✓
            </div>

            <div className="validation-main">

              <span className="section-kicker">
                DATA QUALITY
              </span>

              <h2>Validation Summary</h2>

              <p>
                {REPORT_DATA.validation.valid} of{" "}
                {REPORT_DATA.validation.total} activity records
                have passed validation.
              </p>

              <div className="validation-bar">
                <div
                  style={{
                    width: `${
                      (REPORT_DATA.validation.valid /
                        REPORT_DATA.validation.total) *
                      100
                    }%`,
                  }}
                />
              </div>

            </div>

            <div className="validation-numbers">

              <div>
                <strong>
                  {REPORT_DATA.validation.valid}
                </strong>
                <span>Valid</span>
              </div>

              <div>
                <strong>
                  {REPORT_DATA.validation.review}
                </strong>
                <span>Review</span>
              </div>

              <div>
                <strong>
                  {REPORT_DATA.validation.pending}
                </strong>
                <span>Pending</span>
              </div>

            </div>

          </div>

        </section>

        {/* =========================================================
            ACTIVITY TRACEABILITY
        ========================================================= */}
        <section className="report-section">

          <div className="section-heading">
            <div>
              <span className="section-kicker">
                TRACEABILITY
              </span>

              <h2>Activity-Level Reporting Lineage</h2>

              <p>
                Every reported emission can be traced back to
                its source activity and evidence.
              </p>
            </div>
          </div>

          <div className="trace-table-wrapper">

            <table className="trace-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Scope</th>
                  <th>Activity</th>
                  <th>Quantity</th>
                  <th>Factor</th>
                  <th>CO₂e</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {REPORT_DATA.activitiesList.map((activity) => (
                  <tr key={activity.id}>

                    <td>
                      <span className="activity-id">
                        {activity.id}
                      </span>
                    </td>

                    <td>{activity.scope}</td>

                    <td>
                      <strong>{activity.activity}</strong>
                      <small>
                        {activity.evidence}
                      </small>
                    </td>

                    <td>{activity.quantity}</td>

                    <td>{activity.factor}</td>

                    <td className="co2-value">
                      {activity.emissions}
                    </td>

                    <td>
                      <StatusBadge status={activity.status} />
                    </td>

                    <td>
                      <button
                        className="trace-btn"
                        onClick={() =>
                          handleTrace(activity)
                        }
                      >
                        Trace →
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          <div className="trace-chain">

            <span>Activity</span>
            <b>→</b>
            <span>Evidence</span>
            <b>→</b>
            <span>Emission Factor</span>
            <b>→</b>
            <span>CO₂e</span>
            <b>→</b>
            <span>KPI</span>
            <b>→</b>
            <span>BRSR</span>

          </div>

        </section>

        {/* =========================================================
            GENERATED REPORT
        ========================================================= */}
        {showGeneratedReport && (
          <section
            id="generated-brsr-report"
            className="generated-report"
          >

            <div className="generated-report-header">

              <div className="generated-report-brand">
                <div className="generated-logo">
                  E
                </div>

                <div>
                  <span>ESGFORGE</span>
                  <strong>
                    BUSINESS RESPONSIBILITY & SUSTAINABILITY REPORT
                  </strong>
                </div>
              </div>

              <div className="generated-status">
                <span>REPORT STATUS</span>
                <strong>GENERATED ✓</strong>
              </div>

            </div>

            <div className="generated-cover">

              <span>ANNUAL ESG REPORT</span>

              <h1>
                Business Responsibility &
                <br />
                Sustainability Report
              </h1>

              <h2>{REPORT_DATA.organization}</h2>

              <p>
                Reporting Period:{" "}
                <strong>{REPORT_DATA.reportingYear}</strong>
              </p>

              <div className="cover-divider" />

              <div className="cover-meta">

                <div>
                  <span>Reporting Period</span>
                  <strong>
                    {REPORT_DATA.periodStart} —{" "}
                    {REPORT_DATA.periodEnd}
                  </strong>
                </div>

                <div>
                  <span>Overall Readiness</span>
                  <strong>{REPORT_DATA.readiness}%</strong>
                </div>

                <div>
                  <span>Total GHG Emissions</span>
                  <strong>
                    {REPORT_DATA.emissions.total} tCO₂e
                  </strong>
                </div>

              </div>

            </div>

            {/* EXECUTIVE SUMMARY */}
            <div className="generated-section">

              <div className="generated-section-title">
                <span>01</span>
                <div>
                  <small>EXECUTIVE SUMMARY</small>
                  <h2>ESG Performance Overview</h2>
                </div>
              </div>

              <p className="generated-text">
                This report presents the consolidated ESG
                performance information captured for the
                {` ${REPORT_DATA.reportingYear}`} reporting
                period. The reporting view consolidates
                activity-level emissions, evidence,
                emission factors, validation results and
                KPI outcomes into a traceable BRSR reporting
                workflow.
              </p>

              <div className="generated-stat-grid">

                <div>
                  <span>Total Activities</span>
                  <strong>{REPORT_DATA.activities.total}</strong>
                </div>

                <div>
                  <span>Total GHG</span>
                  <strong>
                    {REPORT_DATA.emissions.total}
                    <small> tCO₂e</small>
                  </strong>
                </div>

                <div>
                  <span>Validated Records</span>
                  <strong>
                    {REPORT_DATA.validation.valid}/
                    {REPORT_DATA.validation.total}
                  </strong>
                </div>

                <div>
                  <span>BRSR Readiness</span>
                  <strong>
                    {REPORT_DATA.readiness}%
                  </strong>
                </div>

              </div>

            </div>

            {/* EMISSIONS */}
            <div className="generated-section">

              <div className="generated-section-title">
                <span>02</span>
                <div>
                  <small>ENVIRONMENTAL PERFORMANCE</small>
                  <h2>GHG Emissions by Scope</h2>
                </div>
              </div>

              <table className="generated-table">

                <thead>
                  <tr>
                    <th>Emission Category</th>
                    <th>Activities</th>
                    <th>Emissions</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Scope 1 — Direct Emissions</td>
                    <td>{REPORT_DATA.activities.scope1}</td>
                    <td>
                      {REPORT_DATA.emissions.scope1} tCO₂e
                    </td>
                  </tr>

                  <tr>
                    <td>Scope 2 — Purchased Energy</td>
                    <td>{REPORT_DATA.activities.scope2}</td>
                    <td>
                      {REPORT_DATA.emissions.scope2} tCO₂e
                    </td>
                  </tr>

                  <tr>
                    <td>Scope 3 — Value Chain</td>
                    <td>{REPORT_DATA.activities.scope3}</td>
                    <td>
                      {REPORT_DATA.emissions.scope3} tCO₂e
                    </td>
                  </tr>

                  <tr className="generated-total-row">
                    <td>Total GHG Emissions</td>
                    <td>{REPORT_DATA.activities.total}</td>
                    <td>
                      {REPORT_DATA.emissions.total} tCO₂e
                    </td>
                  </tr>
                </tbody>

              </table>

            </div>

            {/* KPI */}
            <div className="generated-section">

              <div className="generated-section-title">
                <span>03</span>
                <div>
                  <small>ESG KPI PERFORMANCE</small>
                  <h2>Key Performance Indicators</h2>
                </div>
              </div>

              <table className="generated-table">

                <thead>
                  <tr>
                    <th>KPI</th>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {REPORT_DATA.kpis.map((kpi) => (
                    <tr key={kpi.name}>
                      <td>{kpi.name}</td>
                      <td>
                        <strong>{kpi.value}</strong>
                      </td>
                      <td>{kpi.unit}</td>
                      <td>
                        <StatusBadge status={kpi.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

            {/* DISCLOSURES */}
            <div className="generated-section">

              <div className="generated-section-title">
                <span>04</span>
                <div>
                  <small>BRSR SECTION C</small>
                  <h2>Disclosure Readiness</h2>
                </div>
              </div>

              <div className="generated-disclosures">

                {REPORT_DATA.disclosures.map((item) => (
                  <div
                    className="generated-disclosure"
                    key={item.name}
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.readiness}% ready</span>
                    </div>

                    <ProgressBar
                      value={item.readiness}
                    />

                    <StatusBadge status={item.status} />
                  </div>
                ))}

              </div>

            </div>

            {/* VALIDATION */}
            <div className="generated-section">

              <div className="generated-section-title">
                <span>05</span>
                <div>
                  <small>DATA QUALITY</small>
                  <h2>Validation & Assurance</h2>
                </div>
              </div>

              <div className="generated-validation">

                <div className="generated-validation-score">
                  <strong>
                    {Math.round(
                      (REPORT_DATA.validation.valid /
                        REPORT_DATA.validation.total) *
                        100
                    )}%
                  </strong>

                  <span>
                    Records validated
                  </span>
                </div>

                <div className="generated-validation-details">

                  <div>
                    <strong>
                      {REPORT_DATA.validation.valid}
                    </strong>
                    <span>Valid</span>
                  </div>

                  <div>
                    <strong>
                      {REPORT_DATA.validation.review}
                    </strong>
                    <span>Requires Review</span>
                  </div>

                  <div>
                    <strong>
                      {REPORT_DATA.validation.pending}
                    </strong>
                    <span>Pending</span>
                  </div>

                </div>

              </div>

            </div>

            {/* TRACEABILITY */}
            <div className="generated-section">

              <div className="generated-section-title">
                <span>06</span>
                <div>
                  <small>TRACEABILITY</small>
                  <h2>Reporting Lineage</h2>
                </div>
              </div>

              <div className="generated-lineage">

                {[
                  "Activity Data",
                  "Evidence",
                  "Emission Factor",
                  "CO₂e Calculation",
                  "Validation",
                  "KPI Result",
                  "BRSR Disclosure",
                ].map((item, index) => (
                  <React.Fragment key={item}>

                    <div className="lineage-item">
                      <span>{index + 1}</span>
                      <strong>{item}</strong>
                    </div>

                    {index < 6 && (
                      <b>→</b>
                    )}

                  </React.Fragment>
                ))}

              </div>

            </div>

            {/* REPORT FOOTER */}
            <div className="generated-report-footer">

              <div>
                <strong>ESGForge</strong>
                <span>
                  Frontend Demonstration Report
                </span>
              </div>

              <div>
                <span>
                  Generated {generatedAt}
                </span>
                <small>
                  Demo visualization — emission factors
                  require authoritative confirmation before
                  production reporting.
                </small>
              </div>

            </div>

          </section>
        )}

        {/* =========================================================
            DEMO NOTICE
        ========================================================= */}
        <div className="report-demo-notice">

          <span>ℹ</span>

          <div>
            <strong>Frontend demonstration mode</strong>

            <p>
              This report uses ESGForge demo data to
              demonstrate the reporting workflow.
              Emission factors shown here are visualization
              values and require authoritative confirmation
              before production reporting.
            </p>
          </div>

        </div>

      </section>
    </div>
  );
}