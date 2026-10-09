import React, { useMemo, useState } from "react";
import "./DataValidation.css";

/* =========================================================
   FRONTEND-ONLY DEMO DATA
========================================================= */

const INITIAL_ACTIVITIES = [
  {
    id: "S1-001",
    scope: 1,
    activity: "Diesel Consumption",
    category: "Stationary / Mobile Combustion",
    quantity: 2500,
    unit: "L",
    source: "Fuel Invoice",
    evidence: "diesel_invoice_april.pdf",
    factor: 2.68,
    factorUnit: "kg CO₂e / L",
    co2e: 6.7,
    status: "VALID",
    approvalStatus: "APPROVED",
    reviewer: "ESG Reviewer",
    approvalDate: "08 Oct 2026, 10:42 AM",
    approvalNote: "Validated activity approved for reporting.",
    checks: {
      quantity: true,
      unit: true,
      evidence: true,
      factor: true,
      calculation: true,
    },
    message: "All required activity checks passed.",
  },

  {
    id: "S1-002",
    scope: 1,
    activity: "Diesel Generator",
    category: "Stationary Combustion",
    quantity: 1850,
    unit: "L",
    source: "Generator Log",
    evidence: "generator_log_march.pdf",
    factor: 2.68,
    factorUnit: "kg CO₂e / L",
    co2e: 4.958,
    status: "VALID",
    approvalStatus: "APPROVED",
    reviewer: "ESG Reviewer",
    approvalDate: "08 Oct 2026, 11:05 AM",
    approvalNote: "Generator activity approved after validation.",
    checks: {
      quantity: true,
      unit: true,
      evidence: true,
      factor: true,
      calculation: true,
    },
    message: "Activity is complete and calculation is traceable.",
  },

  {
    id: "S2-001",
    scope: 2,
    activity: "Purchased Electricity",
    category: "Location Based",
    quantity: 125000,
    unit: "kWh",
    source: "Electricity Bill",
    evidence: "electricity_bill_march.pdf",
    factor: 0.72,
    factorUnit: "kg CO₂e / kWh",
    co2e: 90,
    status: "VALID",
    approvalStatus: "APPROVED",
    reviewer: "ESG Reviewer",
    approvalDate: "08 Oct 2026, 11:28 AM",
    approvalNote: "Electricity record approved for consolidation.",
    checks: {
      quantity: true,
      unit: true,
      evidence: true,
      factor: true,
      calculation: true,
    },
    message: "Electricity activity has complete supporting evidence.",
  },

  {
    id: "S2-002",
    scope: 2,
    activity: "Purchased Electricity",
    category: "Market Based",
    quantity: 84500,
    unit: "kWh",
    source: "Energy Statement",
    evidence: "energy_statement.pdf",
    factor: 0.72,
    factorUnit: "kg CO₂e / kWh",
    co2e: 60.84,
    status: "REVIEW",
    approvalStatus: "PENDING",
    reviewer: "",
    approvalDate: "",
    approvalNote: "",
    checks: {
      quantity: true,
      unit: true,
      evidence: true,
      factor: false,
      calculation: true,
    },
    message:
      "Emission factor source needs reviewer confirmation before approval.",
  },

  {
    id: "S3-001",
    scope: 3,
    activity: "Upstream Material Transportation",
    category: "Purchased Goods & Services",
    quantity: 800,
    unit: "tonnes",
    source: "Supplier Transport Record",
    evidence: "supplier_transport.pdf",
    factor: 0.105,
    factorUnit: "kg CO₂e / tonne-km",
    co2e: 35.28,
    status: "VALID",
    approvalStatus: "PENDING",
    reviewer: "",
    approvalDate: "",
    approvalNote: "",
    checks: {
      quantity: true,
      unit: true,
      evidence: true,
      factor: true,
      calculation: true,
    },
    message: "Transportation activity passed all validation checks.",
  },

  {
    id: "S3-002",
    scope: 3,
    activity: "Waste Generated",
    category: "Waste Treatment",
    quantity: 420,
    unit: "tonnes",
    source: "Waste Vendor Report",
    evidence: "",
    factor: 0.085,
    factorUnit: "kg CO₂e / tonne",
    co2e: 35.7,
    status: "REVIEW",
    approvalStatus: "PENDING",
    reviewer: "",
    approvalDate: "",
    approvalNote: "",
    checks: {
      quantity: true,
      unit: true,
      evidence: false,
      factor: true,
      calculation: true,
    },
    message:
      "Evidence is missing. Upload supporting waste documentation.",
  },
];

/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_CONFIG = {
  VALID: {
    label: "Valid",
    className: "valid",
    icon: "✓",
  },

  REVIEW: {
    label: "Needs Review",
    className: "review",
    icon: "!",
  },

  PENDING: {
    label: "Pending",
    className: "pending",
    icon: "•",
  },
};

const APPROVAL_CONFIG = {
  PENDING: {
    label: "Pending Approval",
    className: "pending",
    icon: "◷",
  },

  APPROVED: {
    label: "Approved",
    className: "approved",
    icon: "✓",
  },

  REJECTED: {
    label: "Rejected",
    className: "rejected",
    icon: "×",
  },
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function DataValidation({ onNavigate }) {
  const [activities, setActivities] = useState(
    INITIAL_ACTIVITIES
  );

  const [selectedScope, setSelectedScope] =
    useState("ALL");

  const [selectedActivity, setSelectedActivity] =
    useState(null);

  const [search, setSearch] = useState("");

  const [success, setSuccess] = useState("");

  const [approvalFilter, setApprovalFilter] =
    useState("ALL");

  /* =======================================================
     STATISTICS
  ======================================================= */

  const stats = useMemo(() => {
    const total = activities.length;

    const valid = activities.filter(
      (item) => item.status === "VALID"
    ).length;

    const review = activities.filter(
      (item) => item.status === "REVIEW"
    ).length;

    const pending = activities.filter(
      (item) => item.status === "PENDING"
    ).length;

    const percentage =
      total > 0
        ? Math.round((valid / total) * 100)
        : 0;

    const approved = activities.filter(
      (item) => item.approvalStatus === "APPROVED"
    ).length;

    const pendingApproval = activities.filter(
      (item) =>
        item.approvalStatus === "PENDING"
    ).length;

    const rejected = activities.filter(
      (item) =>
        item.approvalStatus === "REJECTED"
    ).length;

    return {
      total,
      valid,
      review,
      pending,
      percentage,
      approved,
      pendingApproval,
      rejected,
    };
  }, [activities]);

  /* =======================================================
     FILTERED ACTIVITIES
  ======================================================= */

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const scopeMatch =
        selectedScope === "ALL" ||
        item.scope === Number(selectedScope);

      const searchMatch =
        !search ||
        item.activity
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.id
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.source
          .toLowerCase()
          .includes(search.toLowerCase());

      return scopeMatch && searchMatch;
    });
  }, [activities, selectedScope, search]);

  /* =======================================================
     APPROVAL FILTER
  ======================================================= */

  const approvalActivities = useMemo(() => {
    return activities.filter((item) => {
      if (approvalFilter === "ALL") {
        return true;
      }

      return (
        item.approvalStatus === approvalFilter
      );
    });
  }, [activities, approvalFilter]);

  /* =======================================================
     SUCCESS MESSAGE
  ======================================================= */

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateActivity = (id) => {
    setActivities((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;

        const allChecksPassed =
          Object.values(item.checks).every(Boolean);

        return {
          ...item,

          status: allChecksPassed
            ? "VALID"
            : "REVIEW",

          message: allChecksPassed
            ? "All validation checks passed successfully."
            : "One or more validation checks require attention.",

          approvalStatus: allChecksPassed
            ? "PENDING"
            : item.approvalStatus,
        };
      })
    );

    showSuccess(
      "Activity validation completed successfully."
    );
  };

  /* =======================================================
     APPROVE ACTIVITY
  ======================================================= */

  const approveActivity = (id) => {
    const now = new Date();

    const approvalTime =
      now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });

    setActivities((previous) =>
      previous.map((item) => {
        if (item.id !== id) return item;

        if (item.status !== "VALID") {
          return {
            ...item,
            approvalStatus: "PENDING",
            approvalNote:
              "Approval blocked until validation issues are resolved.",
          };
        }

        return {
          ...item,
          approvalStatus: "APPROVED",
          reviewer: "ESG Reviewer",
          approvalDate: approvalTime,
          approvalNote:
            "Activity approved for aggregation and BRSR reporting.",
          message:
            "Activity validated and approved by reviewer.",
        };
      })
    );

    setSelectedActivity(null);

    showSuccess(
      "Activity approved and marked ready for reporting."
    );
  };

  /* =======================================================
     REJECT ACTIVITY
  ======================================================= */

  const rejectActivity = (id) => {
    setActivities((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              approvalStatus: "REJECTED",
              reviewer: "ESG Reviewer",
              approvalDate: new Date().toLocaleString(
                "en-IN"
              ),
              approvalNote:
                "Activity rejected and returned for correction.",
              message:
                "Activity requires correction before approval.",
            }
          : item
      )
    );

    setSelectedActivity(null);

    showSuccess(
      "Activity rejected and returned for correction."
    );
  };

  /* =======================================================
     MARK FOR REVIEW
  ======================================================= */

  const markForReview = (id) => {
    setActivities((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "REVIEW",
              approvalStatus: "PENDING",
              message:
                "Activity has been marked for reviewer attention.",
            }
          : item
      )
    );

    setSelectedActivity(null);

    showSuccess(
      "Activity marked for review."
    );
  };

  /* =======================================================
     RUN ALL CHECKS
  ======================================================= */

  const runAllChecks = () => {
    setActivities((previous) =>
      previous.map((item) => {
        const allChecksPassed =
          Object.values(item.checks).every(Boolean);

        return {
          ...item,
          status: allChecksPassed
            ? "VALID"
            : "REVIEW",
          approvalStatus: allChecksPassed
            ? "PENDING"
            : item.approvalStatus,
          message: allChecksPassed
            ? "All validation checks passed successfully."
            : "One or more validation checks require attention.",
        };
      })
    );

    showSuccess(
      "All validation checks have been executed."
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="validation-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="validation-hero">

        <div className="hero-left">

          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            ESG DATA QUALITY
          </div>

          <h1>Data Validation</h1>

          <p>
            Review Scope 1, Scope 2 and Scope 3 activity
            records, verify evidence and emission factors,
            and confirm CO₂e calculation readiness.
          </p>

          <div className="hero-meta">

            <span className="period-pill">
              <span>◷</span>
              FY 2025–26 · Annual
            </span>

            <span className="backend-pill">
              <span className="pulse-dot"></span>
              Frontend Demo
            </span>

          </div>

        </div>

        <div className="hero-visual">

          <div className="validation-ring">

            <svg viewBox="0 0 120 120">

              <circle
                className="ring-track"
                cx="60"
                cy="60"
                r="48"
              />

              <circle
                className="ring-progress"
                cx="60"
                cy="60"
                r="48"
                strokeDasharray={`${
                  stats.percentage * 3.015
                } 301.5`}
              />

            </svg>

            <div className="ring-content">

              <strong>
                {stats.percentage}%
              </strong>

              <span>Validated</span>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div className="validation-alert success-alert">

          <div className="alert-icon">
            ✓
          </div>

          <div>
            <strong>
              Workflow updated
            </strong>

            <p>{success}</p>
          </div>

        </div>
      )}

      {/* =================================================
          VALIDATION STATS
      ================================================= */}

      <section className="validation-stats">

        <div className="validation-stat total-stat">

          <div className="stat-icon blue-icon">
            ◈
          </div>

          <div>
            <span>Total Activities</span>
            <strong>{stats.total}</strong>
            <small>
              Scope 1 / 2 / 3 records
            </small>
          </div>

        </div>

        <div className="validation-stat valid-stat">

          <div className="stat-icon green-icon">
            ✓
          </div>

          <div>
            <span>Valid</span>
            <strong>{stats.valid}</strong>
            <small>
              Passed validation
            </small>
          </div>

        </div>

        <div className="validation-stat invalid-stat">

          <div className="stat-icon red-icon">
            !
          </div>

          <div>
            <span>Needs Review</span>
            <strong>{stats.review}</strong>
            <small>
              Reviewer attention
            </small>
          </div>

        </div>

        <div className="validation-stat pending-stat">

          <div className="stat-icon orange-icon">
            ◌
          </div>

          <div>
            <span>Pending</span>
            <strong>{stats.pending}</strong>
            <small>
              Awaiting validation
            </small>
          </div>

        </div>

      </section>

      {/* =================================================
          APPROVAL SUMMARY
      ================================================= */}

      <section className="approval-summary">

        <div className="approval-summary-heading">

          <div>
            <span className="section-kicker">
              REVIEW & APPROVAL
            </span>

            <h2>
              Reporting Approval Status
            </h2>

            <p>
              Validated activities move through reviewer
              approval before entering aggregation and
              BRSR reporting.
            </p>
          </div>

          <div className="approval-summary-badge">
            FRONTEND WORKFLOW
          </div>

        </div>

        <div className="approval-summary-grid">

          <div className="approval-summary-card">

            <span className="approval-summary-icon pending">
              ◷
            </span>

            <div>
              <small>Pending Approval</small>
              <strong>
                {stats.pendingApproval}
              </strong>
              <span>
                Awaiting reviewer
              </span>
            </div>

          </div>

          <div className="approval-summary-card">

            <span className="approval-summary-icon approved">
              ✓
            </span>

            <div>
              <small>Approved</small>
              <strong>
                {stats.approved}
              </strong>
              <span>
                Ready for reporting
              </span>
            </div>

          </div>

          <div className="approval-summary-card">

            <span className="approval-summary-icon rejected">
              ×
            </span>

            <div>
              <small>Rejected</small>
              <strong>
                {stats.rejected}
              </strong>
              <span>
                Requires correction
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          WORKFLOW
      ================================================= */}

      <section className="workflow-card">

        <div className="section-heading">

          <div>

            <span className="section-kicker">
              QUALITY WORKFLOW
            </span>

            <h2>
              Validation & Approval Pipeline
            </h2>

          </div>

          <span className="workflow-status draft">
            FRONTEND DEMO
          </span>

        </div>

        <div className="workflow">

          <div className="workflow-step completed">

            <div className="workflow-circle">
              ✓
            </div>

            <div>
              <strong>Activity Data</strong>
              <span>
                Values recorded
              </span>
            </div>

          </div>

          <div className="workflow-line active"></div>

          <div className="workflow-step completed">

            <div className="workflow-circle">
              ✓
            </div>

            <div>
              <strong>Evidence</strong>
              <span>
                Supporting records
              </span>
            </div>

          </div>

          <div className="workflow-line active"></div>

          <div className="workflow-step completed">

            <div className="workflow-circle">
              ✓
            </div>

            <div>
              <strong>Calculation</strong>
              <span>
                CO₂e generated
              </span>
            </div>

          </div>

          <div className="workflow-line active"></div>

          <div className="workflow-step current">

            <div className="workflow-circle">
              4
            </div>

            <div>
              <strong>Validation</strong>
              <span>
                Quality checks
              </span>
            </div>

          </div>

          <div className="workflow-line"></div>

          <div className="workflow-step current">

            <div className="workflow-circle">
              5
            </div>

            <div>
              <strong>Approval</strong>
              <span>
                Reviewer decision
              </span>
            </div>

          </div>

          <div className="workflow-line"></div>

          <div className="workflow-step locked">

            <div className="workflow-circle">
              6
            </div>

            <div>
              <strong>BRSR Reporting</strong>
              <span>
                Disclosure output
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          VALIDATION CHECKS
      ================================================= */}

      <section className="workflow-card">

        <div className="section-heading">

          <div>

            <span className="section-kicker">
              VALIDATION RULES
            </span>

            <h2>
              What ESGForge Checks
            </h2>

          </div>

        </div>

        <div className="meil-features">

          <span>✓ Quantity & Unit</span>
          <span>✓ Evidence Availability</span>
          <span>✓ Emission Factor</span>
          <span>✓ CO₂e Calculation</span>
          <span>✓ Scope Classification</span>
          <span>✓ Source Traceability</span>

        </div>

      </section>

      {/* =================================================
          ACTIVITY VALIDATION
      ================================================= */}

      <section className="values-section">

        <div className="section-heading values-heading">

          <div>

            <span className="section-kicker">
              ACTIVITY VALIDATION
            </span>

            <h2>
              ESG Activity Records
            </h2>

            <p>
              Review every activity before it becomes part
              of the BRSR reporting dataset.
            </p>

          </div>

          <span className="value-count">
            {filteredActivities.length} records
          </span>

        </div>

        {/* FILTER BAR */}

        <div className="validation-toolbar">

          <div className="scope-filters">

            <button
              className={
                selectedScope === "ALL"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedScope("ALL")
              }
            >
              All
            </button>

            <button
              className={
                selectedScope === "1"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedScope("1")
              }
            >
              Scope 1
            </button>

            <button
              className={
                selectedScope === "2"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedScope("2")
              }
            >
              Scope 2
            </button>

            <button
              className={
                selectedScope === "3"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedScope("3")
              }
            >
              Scope 3
            </button>

          </div>

          <input
            className="validation-search"
            type="text"
            placeholder="Search activity..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        {/* ACTIVITY CARDS */}

        <div className="values-grid">

          {filteredActivities.map((item) => {

            const config =
              STATUS_CONFIG[item.status] ||
              STATUS_CONFIG.PENDING;

            const approval =
              APPROVAL_CONFIG[
                item.approvalStatus
              ] ||
              APPROVAL_CONFIG.PENDING;

            return (
              <div
                className={`value-card ${config.className}`}
                key={item.id}
              >

                <div className="value-card-top">

                  <div className="metric-icon">

                    {item.scope === 1
                      ? "🔥"
                      : item.scope === 2
                      ? "⚡"
                      : "🌐"}

                  </div>

                  <span
                    className={`value-status ${config.className}`}
                  >
                    <span>
                      {config.icon}
                    </span>

                    {config.label}
                  </span>

                </div>

                <div className="metric-category">
                  Scope {item.scope} ·{" "}
                  {item.category}
                </div>

                <h3>
                  {item.activity}
                </h3>

                <div className="metric-number">

                  <strong>
                    {item.quantity.toLocaleString()}
                  </strong>

                  <span>
                    {item.unit}
                  </span>

                </div>

                <div className="metric-source">

                  <span>
                    CO₂e
                  </span>

                  <strong>
                    {item.co2e.toFixed(2)} tCO₂e
                  </strong>

                </div>

                <div className="validation-mini-grid">

                  <div>
                    <span>Evidence</span>

                    <strong>
                      {item.checks.evidence
                        ? "✓"
                        : "!"}
                    </strong>
                  </div>

                  <div>
                    <span>Factor</span>

                    <strong>
                      {item.checks.factor
                        ? "✓"
                        : "!"}
                    </strong>
                  </div>

                  <div>
                    <span>CO₂e</span>

                    <strong>
                      {item.checks.calculation
                        ? "✓"
                        : "!"}
                    </strong>
                  </div>

                </div>

                {/* APPROVAL STATUS */}

                <div className="activity-approval-status">

                  <span>
                    Approval
                  </span>

                  <strong
                    className={`approval-inline ${approval.className}`}
                  >
                    {approval.icon}{" "}
                    {approval.label}
                  </strong>

                </div>

                <div className="validation-card-actions">

                  <button
                    className="secondary-button"
                    onClick={() =>
                      setSelectedActivity(item)
                    }
                  >
                    Review
                  </button>

                  <button
                    className="primary-button"
                    onClick={() =>
                      validateActivity(item.id)
                    }
                  >
                    Validate
                  </button>

                </div>

              </div>
            );
          })}

        </div>

        {filteredActivities.length === 0 && (
          <div className="empty-values">

            <div>◌</div>

            <h3>
              No activities found
            </h3>

            <p>
              Try another search or scope filter.
            </p>

          </div>
        )}

      </section>

      {/* =================================================
          APPROVAL WORKSPACE
      ================================================= */}

      <section className="approval-workspace">

        <div className="approval-workspace-header">

          <div>

            <span className="section-kicker">
              APPROVAL CONTROL
            </span>

            <h2>
              Reviewer Approval Queue
            </h2>

            <p>
              Only activities that have passed validation
              should be approved for aggregation and BRSR
              reporting.
            </p>

          </div>

          <div className="approval-queue-count">
            {stats.pendingApproval} pending
          </div>

        </div>

        <div className="approval-filters">

          {[
            ["ALL", "All"],
            ["PENDING", "Pending"],
            ["APPROVED", "Approved"],
            ["REJECTED", "Rejected"],
          ].map(([value, label]) => (

            <button
              key={value}
              className={
                approvalFilter === value
                  ? "active"
                  : ""
              }
              onClick={() =>
                setApprovalFilter(value)
              }
            >
              {label}
            </button>

          ))}

        </div>

        <div className="approval-table">

          <div className="approval-table-header">

            <span>Activity</span>
            <span>Validation</span>
            <span>Evidence</span>
            <span>CO₂e</span>
            <span>Approval</span>
            <span>Action</span>

          </div>

          {approvalActivities.map((item) => {

            const approval =
              APPROVAL_CONFIG[
                item.approvalStatus
              ] ||
              APPROVAL_CONFIG.PENDING;

            return (
              <div
                className="approval-table-row"
                key={item.id}
              >

                <div className="approval-activity">

                  <strong>
                    {item.activity}
                  </strong>

                  <span>
                    {item.id} · Scope {item.scope}
                  </span>

                </div>

                <span
                  className={`approval-status-chip ${
                    item.status === "VALID"
                      ? "valid"
                      : "review"
                  }`}
                >
                  {item.status === "VALID"
                    ? "✓ Valid"
                    : "! Review"}
                </span>

                <span
                  className={`approval-evidence ${
                    item.checks.evidence
                      ? "present"
                      : "missing"
                  }`}
                >
                  {item.checks.evidence
                    ? "✓ Linked"
                    : "! Missing"}
                </span>

                <strong className="approval-emissions">
                  {item.co2e.toFixed(2)} tCO₂e
                </strong>

                <span
                  className={`approval-status-chip ${approval.className}`}
                >
                  {approval.icon}{" "}
                  {approval.label}
                </span>

                <button
                  className="approval-review-button"
                  onClick={() =>
                    setSelectedActivity(item)
                  }
                >
                  Review →
                </button>

              </div>
            );
          })}

          {approvalActivities.length === 0 && (
            <div className="approval-empty">
              No approval records match this filter.
            </div>
          )}

        </div>

      </section>

      {/* =================================================
          ISSUES
      ================================================= */}

      <section className="issues-card">

        <div className="section-heading">

          <div>

            <span className="section-kicker">
              DATA QUALITY
            </span>

            <h2>
              Items Requiring Attention
            </h2>

          </div>

          <span
            className={
              stats.review === 0
                ? "issue-count clean"
                : "issue-count"
            }
          >
            {stats.review === 0
              ? "✓ All clear"
              : `${stats.review} requiring review`}
          </span>

        </div>

        {stats.review === 0 ? (

          <div className="no-issues">

            <div className="no-issues-icon">
              ✓
            </div>

            <div>

              <strong>
                No validation issues
              </strong>

              <p>
                All activity records have passed the
                current validation checks.
              </p>

            </div>

          </div>

        ) : (

          <div className="issues-list">

            {activities
              .filter(
                (item) =>
                  item.status === "REVIEW"
              )
              .map((item) => (

                <div
                  className="issue-row"
                  key={item.id}
                >

                  <div className="issue-symbol">
                    !
                  </div>

                  <div>

                    <strong>
                      {item.activity}
                    </strong>

                    <p>
                      {item.message}
                    </p>

                  </div>

                  <span className="issue-label">
                    REVIEW
                  </span>

                </div>

              ))}

          </div>

        )}

      </section>

      {/* =================================================
          ACTION BAR
      ================================================= */}

      <section className="validation-actions">

        <div>

          <strong>
            Validation workspace
          </strong>

          <span>
            {stats.review > 0
              ? "Resolve review items before generating BRSR output."
              : stats.pendingApproval > 0
              ? "Validated records are waiting for reviewer approval."
              : "All activities are ready for the reporting workflow."}
          </span>

        </div>

        <div className="action-buttons">

          {onNavigate && (
            <button
              className="secondary-button"
              onClick={() =>
                onNavigate("reports")
              }
            >
              View BRSR Reports
              <span>→</span>
            </button>
          )}

          {onNavigate && (
            <button
              className="secondary-button"
              onClick={() =>
                onNavigate("aggregation")
              }
            >
              View Aggregation
              <span>→</span>
            </button>
          )}

          <button
            className="primary-button"
            onClick={runAllChecks}
          >
            ✓ Run All Checks
          </button>

        </div>

      </section>

      {/* =================================================
          REVIEW / APPROVAL MODAL
      ================================================= */}

      {selectedActivity && (

        <div
          className="validation-modal-overlay"
          onClick={() =>
            setSelectedActivity(null)
          }
        >

          <div
            className="validation-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="section-kicker">
                  ACTIVITY REVIEW
                </span>

                <h2>
                  {selectedActivity.activity}
                </h2>

                <p>
                  Scope {selectedActivity.scope} ·{" "}
                  {selectedActivity.id}
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedActivity(null)
                }
              >
                ×
              </button>

            </div>

            {/* ACTIVITY SUMMARY */}

            <div className="modal-summary">

              <div>
                <span>Quantity</span>

                <strong>
                  {selectedActivity.quantity.toLocaleString()}{" "}
                  {selectedActivity.unit}
                </strong>
              </div>

              <div>
                <span>Emission Factor</span>

                <strong>
                  {selectedActivity.factor}{" "}
                  {selectedActivity.factorUnit}
                </strong>
              </div>

              <div>
                <span>Calculated CO₂e</span>

                <strong>
                  {selectedActivity.co2e.toFixed(2)}{" "}
                  tCO₂e
                </strong>
              </div>

            </div>

            {/* VALIDATION CHECKS */}

            <div className="modal-checks">

              <h3>
                Validation Checks
              </h3>

              {[
                [
                  "Quantity & Unit",
                  selectedActivity.checks.quantity &&
                    selectedActivity.checks.unit,
                ],
                [
                  "Evidence Availability",
                  selectedActivity.checks.evidence,
                ],
                [
                  "Emission Factor",
                  selectedActivity.checks.factor,
                ],
                [
                  "CO₂e Calculation",
                  selectedActivity.checks.calculation,
                ],
              ].map(([label, passed]) => (

                <div
                  className="modal-check-row"
                  key={label}
                >

                  <div>

                    <span
                      className={
                        passed
                          ? "check-icon passed"
                          : "check-icon failed"
                      }
                    >
                      {passed ? "✓" : "!"}
                    </span>

                    <strong>
                      {label}
                    </strong>

                  </div>

                  <span>
                    {passed
                      ? "Passed"
                      : "Needs Attention"}
                  </span>

                </div>

              ))}

            </div>

            {/* EVIDENCE */}

            <div className="modal-evidence">

              <span>
                Evidence
              </span>

              <strong>
                {selectedActivity.evidence ||
                  "No evidence uploaded"}
              </strong>

            </div>

            {/* APPROVAL DETAILS */}

            <div className="approval-detail-panel">

              <div className="approval-detail-heading">

                <div>
                  <span>
                    APPROVAL STATUS
                  </span>

                  <strong>
                    {APPROVAL_CONFIG[
                      selectedActivity.approvalStatus
                    ]?.icon}{" "}
                    {
                      APPROVAL_CONFIG[
                        selectedActivity.approvalStatus
                      ]?.label
                    }
                  </strong>
                </div>

                <span
                  className={`approval-status-chip ${
                    selectedActivity.approvalStatus ===
                    "APPROVED"
                      ? "approved"
                      : selectedActivity.approvalStatus ===
                        "REJECTED"
                      ? "rejected"
                      : "pending"
                  }`}
                >
                  {selectedActivity.approvalStatus}
                </span>

              </div>

              <div className="approval-detail-grid">

                <div>
                  <span>Reviewer</span>

                  <strong>
                    {selectedActivity.reviewer ||
                      "Awaiting reviewer"}
                  </strong>
                </div>

                <div>
                  <span>Decision Time</span>

                  <strong>
                    {selectedActivity.approvalDate ||
                      "Not decided"}
                  </strong>
                </div>

              </div>

              {selectedActivity.approvalNote && (
                <p className="approval-detail-note">
                  {selectedActivity.approvalNote}
                </p>
              )}

            </div>

            <div className="modal-message">

              <strong>
                Validation note
              </strong>

              <p>
                {selectedActivity.message}
              </p>

            </div>

            {/* ACTIONS */}

            <div className="modal-actions">

              <button
                className="secondary-button"
                onClick={() =>
                  markForReview(
                    selectedActivity.id
                  )
                }
              >
                Mark for Review
              </button>

              <button
                className="reject-button"
                onClick={() =>
                  rejectActivity(
                    selectedActivity.id
                  )
                }
              >
                × Reject
              </button>

              <button
                className="primary-button"
                disabled={
                  selectedActivity.status !== "VALID"
                }
                onClick={() =>
                  approveActivity(
                    selectedActivity.id
                  )
                }
              >
                ✓ Approve Activity
              </button>

            </div>

            {selectedActivity.status !== "VALID" && (
              <div className="approval-blocked-message">
                Approval is disabled because this activity
                has unresolved validation issues.
              </div>
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default DataValidation;