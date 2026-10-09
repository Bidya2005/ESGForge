import React, { useMemo, useState } from "react";
import "./Dashboard.css";

const DASHBOARD_DATA = {
  organization: "ESGForge Demo Organization",
  company: "ESGForge Manufacturing & Infrastructure",
  reportingYear: "2025–26",
  reportingPeriod: "01 Apr 2025 – 31 Mar 2026",

  readiness: 82,

  activities: {
    total: 6,
    scope1: 2,
    scope2: 2,
    scope3: 2,
  },

  emissions: {
    scope1: 11.66,
    scope2: 150.84,
    scope3: 70.98,
    total: 233.48,
  },

  validation: {
    total: 6,
    valid: 4,
    review: 2,
    pending: 0,
  },

  intelligence: {
    improving: 3,
    stable: 2,
    attention: 1,
  },

  sections: [
    {
      name: "Environmental",
      score: 88,
      status: "READY",
    },
    {
      name: "Energy & Emissions",
      score: 84,
      status: "READY",
    },
    {
      name: "Water Management",
      score: 78,
      status: "REVIEW",
    },
    {
      name: "Waste Management",
      score: 76,
      status: "REVIEW",
    },
    {
      name: "Social",
      score: 81,
      status: "READY",
    },
  ],

  activitiesList: [
    {
      id: "S1-001",
      scope: "Scope 1",
      activity: "Diesel Consumption",
      quantity: "2,500 L",
      emissions: "6.70",
      evidence: "Verified",
      status: "VALID",
    },
    {
      id: "S1-002",
      scope: "Scope 1",
      activity: "Diesel Generator",
      quantity: "1,850 L",
      emissions: "4.96",
      evidence: "Verified",
      status: "VALID",
    },
    {
      id: "S2-001",
      scope: "Scope 2",
      activity: "Purchased Electricity",
      quantity: "125,000 kWh",
      emissions: "90.00",
      evidence: "Verified",
      status: "VALID",
    },
    {
      id: "S2-002",
      scope: "Scope 2",
      activity: "Purchased Electricity",
      quantity: "84,500 kWh",
      emissions: "60.84",
      evidence: "Pending",
      status: "REVIEW",
    },
    {
      id: "S3-001",
      scope: "Scope 3",
      activity: "Upstream Material Transportation",
      quantity: "800 tonne-km",
      emissions: "35.28",
      evidence: "Verified",
      status: "VALID",
    },
    {
      id: "S3-002",
      scope: "Scope 3",
      activity: "Waste Generated",
      quantity: "420 tonnes",
      emissions: "35.70",
      evidence: "Missing",
      status: "REVIEW",
    },
  ],
};

const STATUS_CONFIG = {
  VALID: {
    label: "Validated",
    className: "status-valid",
  },
  REVIEW: {
    label: "Needs Review",
    className: "status-review",
  },
  READY: {
    label: "Ready",
    className: "status-ready",
  },
};

function StatusBadge({ status }) {
  const config =
    STATUS_CONFIG[status] || STATUS_CONFIG.REVIEW;

  return (
    <span className={`dashboard-status ${config.className}`}>
      <span className="status-dot" />
      {config.label}
    </span>
  );
}

function ScopeBadge({ scope }) {
  const scopeNumber = scope.replace("Scope ", "");

  return (
    <span
      className={`dashboard-scope scope-${scopeNumber}`}
    >
      {scope}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="dashboard-progress">
      <div
        className="dashboard-progress-fill"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function Dashboard({ user, onNavigate }) {
  const [activityFilter, setActivityFilter] =
    useState("All");

  const filteredActivities = useMemo(() => {
    if (activityFilter === "All") {
      return DASHBOARD_DATA.activitiesList;
    }

    return DASHBOARD_DATA.activitiesList.filter(
      (activity) =>
        activity.scope === `Scope ${activityFilter}`
    );
  }, [activityFilter]);

  const userName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    "ESG Reviewer";

  const navigate = (page) => {
    if (typeof onNavigate === "function") {
      onNavigate(page);
    }
  };

  return (
    <div className="dashboard-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="dashboard-hero">

        <div className="dashboard-hero-content">

          <div className="dashboard-eyebrow">
            ESGFORGE · ESG CONTROL CENTER
          </div>

          <h1>
            Welcome back, {userName}
          </h1>

          <p>
            Monitor ESG data quality, emissions,
            validation and BRSR reporting readiness
            from one central workspace.
          </p>

          <div className="dashboard-context">

            <div className="context-item">
              <span>Organization</span>
              <strong>
                {DASHBOARD_DATA.company}
              </strong>
            </div>

            <div className="context-divider" />

            <div className="context-item">
              <span>Reporting Year</span>
              <strong>
                {DASHBOARD_DATA.reportingYear}
              </strong>
            </div>

            <div className="context-divider" />

            <div className="context-item">
              <span>Reporting Period</span>
              <strong>
                {DASHBOARD_DATA.reportingPeriod}
              </strong>
            </div>

          </div>

        </div>

        <div className="dashboard-hero-readiness">

          <div className="readiness-ring">

            <div className="readiness-ring-inner">
              <strong>
                {DASHBOARD_DATA.readiness}%
              </strong>

              <span>Ready</span>
            </div>

          </div>

          <div className="readiness-copy">
            <span>OVERALL BRSR READINESS</span>
            <strong>Good progress</strong>
            <p>
              {DASHBOARD_DATA.readiness >= 80
                ? "Most disclosures are ready for review."
                : "Additional review is recommended."}
            </p>
          </div>

        </div>

      </section>

      {/* =====================================================
          TOP METRICS
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <span className="section-kicker">
              AT A GLANCE
            </span>

            <h2>ESG Performance Overview</h2>

            <p>
              Current reporting-period performance
              across activities and emissions.
            </p>
          </div>
        </div>

        <div className="dashboard-metrics">

          <button
            type="button"
            className="dashboard-metric-card"
            onClick={() =>
              navigate("data-entry")
            }
          >
            <div className="metric-icon metric-blue">
              ◫
            </div>

            <div className="metric-content">
              <span>Total Activities</span>
              <strong>
                {DASHBOARD_DATA.activities.total}
              </strong>
              <small>
                Scope 1 · 2 · 3
              </small>
            </div>

            <span className="metric-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="dashboard-metric-card"
            onClick={() =>
              navigate("analytics")
            }
          >
            <div className="metric-icon metric-green">
              ♨
            </div>

            <div className="metric-content">
              <span>Total GHG Emissions</span>
              <strong>
                {DASHBOARD_DATA.emissions.total}
              </strong>
              <small>
                tCO₂e
              </small>
            </div>

            <span className="metric-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="dashboard-metric-card"
            onClick={() =>
              navigate("validation")
            }
          >
            <div className="metric-icon metric-purple">
              ✓
            </div>

            <div className="metric-content">
              <span>Validated Activities</span>
              <strong>
                {DASHBOARD_DATA.validation.valid}
                <small className="metric-total">
                  /{DASHBOARD_DATA.validation.total}
                </small>
              </strong>
              <small>
                {Math.round(
                  (DASHBOARD_DATA.validation.valid /
                    DASHBOARD_DATA.validation.total) *
                    100
                )}
                % validated
              </small>
            </div>

            <span className="metric-arrow">
              →
            </span>
          </button>

          <button
            type="button"
            className="dashboard-metric-card"
            onClick={() =>
              navigate("brsr-readiness")
            }
          >
            <div className="metric-icon metric-orange">
              ◎
            </div>

            <div className="metric-content">
              <span>BRSR Readiness</span>
              <strong>
                {DASHBOARD_DATA.readiness}%
              </strong>
              <small>
                Review status
              </small>
            </div>

            <span className="metric-arrow">
              →
            </span>
          </button>

        </div>

      </section>

      {/* =====================================================
          EMISSIONS
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <span className="section-kicker">
              CARBON ACCOUNTING
            </span>

            <h2>Emissions by Scope</h2>

            <p>
              Project-level emissions consolidated
              into the three GHG reporting scopes.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-outline-button"
            onClick={() =>
              navigate("analytics")
            }
          >
            View Analytics →
          </button>
        </div>

        <div className="emissions-grid">

          <div className="emission-card scope-card-one">
            <div className="emission-card-top">
              <ScopeBadge scope="Scope 1" />
              <span>Direct</span>
            </div>

            <strong>
              {DASHBOARD_DATA.emissions.scope1}
            </strong>

            <span>tCO₂e</span>

            <div className="emission-bottom">
              <span>
                {DASHBOARD_DATA.activities.scope1}
                activities
              </span>

              <span>
                {(
                  (DASHBOARD_DATA.emissions.scope1 /
                    DASHBOARD_DATA.emissions.total) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>

          <div className="emission-card scope-card-two">
            <div className="emission-card-top">
              <ScopeBadge scope="Scope 2" />
              <span>Energy</span>
            </div>

            <strong>
              {DASHBOARD_DATA.emissions.scope2}
            </strong>

            <span>tCO₂e</span>

            <div className="emission-bottom">
              <span>
                {DASHBOARD_DATA.activities.scope2}
                activities
              </span>

              <span>
                {(
                  (DASHBOARD_DATA.emissions.scope2 /
                    DASHBOARD_DATA.emissions.total) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>

          <div className="emission-card scope-card-three">
            <div className="emission-card-top">
              <ScopeBadge scope="Scope 3" />
              <span>Value Chain</span>
            </div>

            <strong>
              {DASHBOARD_DATA.emissions.scope3}
            </strong>

            <span>tCO₂e</span>

            <div className="emission-bottom">
              <span>
                {DASHBOARD_DATA.activities.scope3}
                activities
              </span>

              <span>
                {(
                  (DASHBOARD_DATA.emissions.scope3 /
                    DASHBOARD_DATA.emissions.total) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>

          <div className="emission-total-card">

            <span>Total GHG Emissions</span>

            <strong>
              {DASHBOARD_DATA.emissions.total}
            </strong>

            <small>tCO₂e</small>

            <div className="total-line">
              <span />
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("traceability")
              }
            >
              Trace emissions →
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          INTELLIGENCE + READINESS
      ===================================================== */}

      <section className="dashboard-two-column">

        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <span className="section-kicker">
                ESG INTELLIGENCE
              </span>

              <h2>Performance Signals</h2>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("kpi-results")
              }
            >
              KPI Results →
            </button>
          </div>

          <div className="intelligence-grid">

            <div className="intelligence-card improving">
              <span className="signal-icon">
                ↗
              </span>

              <strong>
                {DASHBOARD_DATA.intelligence.improving}
              </strong>

              <span>Improving</span>
            </div>

            <div className="intelligence-card stable">
              <span className="signal-icon">
                →
              </span>

              <strong>
                {DASHBOARD_DATA.intelligence.stable}
              </strong>

              <span>Stable</span>
            </div>

            <div className="intelligence-card attention">
              <span className="signal-icon">
                !
              </span>

              <strong>
                {DASHBOARD_DATA.intelligence.attention}
              </strong>

              <span>Needs Attention</span>
            </div>

          </div>

          <div className="intelligence-message">
            <span>●</span>

            <p>
              Most ESG indicators are progressing
              positively. One KPI currently requires
              additional review.
            </p>
          </div>

        </div>

        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <span className="section-kicker">
                BRSR READINESS
              </span>

              <h2>Disclosure Readiness</h2>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("brsr-readiness")
              }
            >
              Open →
            </button>
          </div>

          <div className="readiness-list">

            {DASHBOARD_DATA.sections.map(
              (section) => (
                <div
                  className="readiness-row"
                  key={section.name}
                >
                  <div className="readiness-row-info">
                    <div>
                      <strong>
                        {section.name}
                      </strong>

                      <StatusBadge
                        status={section.status}
                      />
                    </div>

                    <span>
                      {section.score}%
                    </span>
                  </div>

                  <ProgressBar
                    value={section.score}
                  />
                </div>
              )
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          REPORTING PIPELINE
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <span className="section-kicker">
              AUDIT-READY WORKFLOW
            </span>

            <h2>Reporting Pipeline</h2>

            <p>
              Every reported figure follows a
              traceable path from activity to disclosure.
            </p>
          </div>
        </div>

        <div className="dashboard-pipeline">

          <button
            type="button"
            onClick={() =>
              navigate("data-entry")
            }
            className="pipeline-step"
          >
            <span className="pipeline-number">
              01
            </span>
            <strong>Activity Data</strong>
            <small>
              Capture Scope 1, 2 & 3
            </small>
          </button>

          <span className="pipeline-arrow">
            →
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("evidence")
            }
            className="pipeline-step"
          >
            <span className="pipeline-number">
              02
            </span>
            <strong>Evidence</strong>
            <small>
              Link supporting documents
            </small>
          </button>

          <span className="pipeline-arrow">
            →
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("data-entry")
            }
            className="pipeline-step"
          >
            <span className="pipeline-number">
              03
            </span>
            <strong>Emission Factor</strong>
            <small>
              Apply factor & GWP
            </small>
          </button>

          <span className="pipeline-arrow">
            →
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("kpi-results")
            }
            className="pipeline-step"
          >
            <span className="pipeline-number">
              04
            </span>
            <strong>Calculation</strong>
            <small>
              Convert activity to CO₂e
            </small>
          </button>

          <span className="pipeline-arrow">
            →
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("validation")
            }
            className="pipeline-step"
          >
            <span className="pipeline-number">
              05
            </span>
            <strong>Validation</strong>
            <small>
              Verify & approve data
            </small>
          </button>

        </div>

      </section>

      {/* =====================================================
          RECENT ACTIVITIES
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">

          <div>
            <span className="section-kicker">
              ACTIVITY REGISTER
            </span>

            <h2>Recent ESG Activities</h2>

            <p>
              Latest activity-level records
              contributing to the current report.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-outline-button"
            onClick={() =>
              navigate("data-entry")
            }
          >
            View All Activities →
          </button>

        </div>

        <div className="activity-toolbar">

          <div className="activity-filters">

            {["All", "1", "2", "3"].map(
              (filter) => (
                <button
                  type="button"
                  key={filter}
                  className={
                    activityFilter === filter
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActivityFilter(filter)
                  }
                >
                  {filter === "All"
                    ? "All Scopes"
                    : `Scope ${filter}`}
                </button>
              )
            )}

          </div>

        </div>

        <div className="dashboard-table-wrapper">

          <table className="dashboard-table">

            <thead>
              <tr>
                <th>Activity</th>
                <th>Scope</th>
                <th>Quantity</th>
                <th>CO₂e</th>
                <th>Evidence</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredActivities.map(
                (activity) => (
                  <tr key={activity.id}>

                    <td>
                      <div className="activity-name">
                        <strong>
                          {activity.activity}
                        </strong>

                        <span>
                          {activity.id}
                        </span>
                      </div>
                    </td>

                    <td>
                      <ScopeBadge
                        scope={activity.scope}
                      />
                    </td>

                    <td>
                      {activity.quantity}
                    </td>

                    <td>
                      <strong>
                        {activity.emissions}
                      </strong>{" "}
                      tCO₂e
                    </td>

                    <td>
                      <span
                        className={
                          activity.evidence ===
                          "Verified"
                            ? "evidence-verified"
                            : "evidence-pending"
                        }
                      >
                        {activity.evidence}
                      </span>
                    </td>

                    <td>
                      <StatusBadge
                        status={activity.status}
                      />
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-heading">
          <div>
            <span className="section-kicker">
              QUICK ACTIONS
            </span>

            <h2>Continue Your ESG Workflow</h2>
          </div>
        </div>

        <div className="quick-actions">

          <button
            type="button"
            onClick={() =>
              navigate("data-entry")
            }
          >
            <span>＋</span>
            <div>
              <strong>Add Activity</strong>
              <small>
                Capture ESG activity data
              </small>
            </div>
            <b>→</b>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("validation")
            }
          >
            <span>✓</span>
            <div>
              <strong>Validate Data</strong>
              <small>
                Review pending records
              </small>
            </div>
            <b>→</b>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("traceability")
            }
          >
            <span>⌁</span>
            <div>
              <strong>Trace Data</strong>
              <small>
                Follow complete lineage
              </small>
            </div>
            <b>→</b>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("reports")
            }
          >
            <span>▤</span>
            <div>
              <strong>Generate Report</strong>
              <small>
                Prepare BRSR reporting output
              </small>
            </div>
            <b>→</b>
          </button>

        </div>

      </section>

      {/* =====================================================
          FOOTER NOTICE
      ===================================================== */}

      <div className="dashboard-demo-notice">
        <span>●</span>
        <div>
          <strong>Frontend Demo Environment</strong>
          <p>
            Dashboard values are demonstration data
            designed to showcase the ESGForge reporting
            workflow. Emission factors are demo
            visualization values and require authoritative
            source confirmation for production reporting.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;