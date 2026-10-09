import React from "react";
import "./BRSRDashboardCard.css";

function BRSRDashboardCard({
  readiness = 40,
  reportingYear = "2025–26",
  generalReadiness = 72,
  managementReadiness = null,
  principleReadiness = null,
  onOpen,
}) {
  const getStatus = (value) => {
    if (value === null || value === undefined) {
      return "Not available";
    }

    if (value >= 80) return "Ready";
    if (value >= 60) return "In progress";
    return "Needs attention";
  };

  const readinessStatus =
    readiness >= 80
      ? "Ready for reporting"
      : readiness >= 60
      ? "Reporting preparation in progress"
      : "Action required before reporting";

  return (
    <section className="brsr-dashboard-card">

      <div className="brsr-dashboard-glow brsr-glow-one" />
      <div className="brsr-dashboard-glow brsr-glow-two" />

      <div className="brsr-dashboard-content">

        {/* LEFT SIDE */}
        <div className="brsr-dashboard-intro">

          <div className="brsr-dashboard-eyebrow">
            <span className="brsr-eyebrow-dot" />
            BRSR REPORTING READINESS
          </div>

          <h2>
            Prepare your ESG data for
            <span> BRSR reporting.</span>
          </h2>

          <p>
            Monitor reporting readiness across disclosures, management
            processes and principle-wise ESG performance from one place.
          </p>

          <div className="brsr-dashboard-year">
            <span>Reporting period</span>
            <strong>FY {reportingYear}</strong>
          </div>

          <button
            className="brsr-dashboard-button"
            onClick={onOpen}
          >
            <span>View Full BRSR Readiness</span>
            <span className="brsr-button-arrow">→</span>
          </button>

        </div>

        {/* RIGHT SIDE */}
        <div className="brsr-dashboard-readiness">

          <div className="brsr-readiness-ring-wrapper">

            <div
              className="brsr-readiness-ring"
              style={{
                "--readiness": `${readiness}%`,
              }}
            >
              <div className="brsr-readiness-ring-inner">
                <strong>{readiness}%</strong>
                <span>Ready</span>
              </div>
            </div>

            <div className="brsr-readiness-status">
              <span className="brsr-status-dot" />
              {readinessStatus}
            </div>

          </div>

          <div className="brsr-dashboard-breakdown">

            <div className="brsr-breakdown-header">
              <span>Readiness overview</span>
              <span>{readiness}% overall</span>
            </div>

            <BRSRProgress
              label="General Disclosures"
              value={generalReadiness}
            />

            <BRSRProgress
              label="Management Processes"
              value={managementReadiness}
            />

            <BRSRProgress
              label="Principle Performance"
              value={principleReadiness}
            />

          </div>

        </div>

      </div>

      <div className="brsr-dashboard-footer">

        <div className="brsr-footer-item">
          <span className="brsr-footer-icon">✓</span>
          <div>
            <strong>Live assessment</strong>
            <span>Based on current ESG submission data</span>
          </div>
        </div>

        <div className="brsr-footer-divider" />

        <div className="brsr-footer-item">
          <span className="brsr-footer-icon">◎</span>
          <div>
            <strong>Disclosure readiness</strong>
            <span>Track gaps before final reporting</span>
          </div>
        </div>

        <div className="brsr-footer-arrow">
          →
        </div>

      </div>

    </section>
  );
}

function BRSRProgress({ label, value }) {
  const available =
    value !== null &&
    value !== undefined &&
    !Number.isNaN(Number(value));

  return (
    <div className="brsr-progress-item">

      <div className="brsr-progress-label">
        <span>{label}</span>

        <strong>
          {available ? `${Math.round(value)}%` : "N/A"}
        </strong>
      </div>

      <div className="brsr-progress-track">

        {available && (
          <div
            className="brsr-progress-fill"
            style={{
              width: `${Math.min(Math.max(value, 0), 100)}%`,
            }}
          />
        )}

      </div>

      <small>
        {available
          ? value >= 80
            ? "Ready"
            : value >= 60
            ? "In progress"
            : "Needs attention"
          : "Awaiting data"}
      </small>

    </div>
  );
}

export default BRSRDashboardCard;