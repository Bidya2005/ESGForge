import React, { useMemo, useState } from "react";
import "./DataPassport.css";

const PASSPORT_DATA = {
  organization: "ESGForge Demo Organization",
  company: "ESGForge Manufacturing & Infrastructure",
  reportingYear: "2025–26",
  period: "01 Apr 2025 – 31 Mar 2026",
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

  quality: {
    evidenceVerified: 3,
    evidencePending: 1,
    evidenceMissing: 1,
    validated: 4,
    review: 2,
  },

  disclosures: [
    {
      id: "C-EN-01",
      name: "GHG Emissions",
      kpi: "Total GHG Emissions",
      value: "233.48 tCO₂e",
      source: "Scope 1 + Scope 2 + Scope 3",
      readiness: 88,
      status: "READY",
    },
    {
      id: "C-EN-02",
      name: "Scope 1 Emissions",
      kpi: "Direct GHG Emissions",
      value: "11.66 tCO₂e",
      source: "Diesel Consumption",
      readiness: 92,
      status: "READY",
    },
    {
      id: "C-EN-03",
      name: "Scope 2 Emissions",
      kpi: "Purchased Electricity",
      value: "150.84 tCO₂e",
      source: "Electricity Consumption",
      readiness: 76,
      status: "REVIEW",
    },
    {
      id: "C-EN-04",
      name: "Scope 3 Emissions",
      kpi: "Value Chain Emissions",
      value: "70.98 tCO₂e",
      source: "Transport + Waste",
      readiness: 81,
      status: "REVIEW",
    },
  ],

  activitiesList: [
    {
      id: "S1-001",
      scope: "Scope 1",
      activity: "Diesel Consumption",
      quantity: "2,500 L",
      factor: "2.68 kg CO₂e/L",
      calculation: "2,500 × 2.68",
      emissions: "6.70 tCO₂e",
      evidence: "diesel_invoice_april.pdf",
      validation: "VALID",
    },
    {
      id: "S1-002",
      scope: "Scope 1",
      activity: "Diesel Generator",
      quantity: "1,850 L",
      factor: "2.68 kg CO₂e/L",
      calculation: "1,850 × 2.68",
      emissions: "4.96 tCO₂e",
      evidence: "generator_fuel_log.pdf",
      validation: "VALID",
    },
    {
      id: "S2-001",
      scope: "Scope 2",
      activity: "Purchased Electricity",
      quantity: "125,000 kWh",
      factor: "0.72 kg CO₂e/kWh",
      calculation: "125,000 × 0.72",
      emissions: "90.00 tCO₂e",
      evidence: "electricity_bill_march.pdf",
      validation: "VALID",
    },
    {
      id: "S2-002",
      scope: "Scope 2",
      activity: "Purchased Electricity",
      quantity: "84,500 kWh",
      factor: "0.72 kg CO₂e/kWh",
      calculation: "84,500 × 0.72",
      emissions: "60.84 tCO₂e",
      evidence: "electricity_bill_february.pdf",
      validation: "REVIEW",
    },
    {
      id: "S3-001",
      scope: "Scope 3",
      activity: "Upstream Material Transportation",
      quantity: "800 tonne-km",
      factor: "0.105 kg CO₂e/tonne-km",
      calculation: "800 × 0.105",
      emissions: "35.28 tCO₂e",
      evidence: "supplier_transport.pdf",
      validation: "VALID",
    },
    {
      id: "S3-002",
      scope: "Scope 3",
      activity: "Waste Generated",
      quantity: "420 tonnes",
      factor: "0.085 kg CO₂e/kg",
      calculation: "420 × 0.085",
      emissions: "35.70 tCO₂e",
      evidence: "Missing",
      validation: "REVIEW",
    },
  ],
};

const STATUS_CONFIG = {
  VALID: {
    label: "Validated",
    className: "passport-status-valid",
  },
  REVIEW: {
    label: "Review Required",
    className: "passport-status-review",
  },
  READY: {
    label: "Ready",
    className: "passport-status-valid",
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.REVIEW;

  return (
    <span className={`passport-status ${config.className}`}>
      <span className="passport-status-dot" />
      {config.label}
    </span>
  );
}

function ScopeBadge({ scope }) {
  const scopeClass = scope.toLowerCase().replace(" ", "-");

  return (
    <span className={`passport-scope ${scopeClass}`}>
      {scope.replace("Scope ", "S")}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="passport-progress">
      <div
        className="passport-progress-fill"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export default function DataPassport({ user, setActivePage }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState("All");
  const [showChecklist, setShowChecklist] = useState(false);

  const filteredActivities = useMemo(() => {
    return PASSPORT_DATA.activitiesList.filter((item) => {
      const matchesScope =
        scopeFilter === "All" || item.scope === `Scope ${scopeFilter}`;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.activity.toLowerCase().includes(query) ||
        item.evidence.toLowerCase().includes(query);

      return matchesScope && matchesSearch;
    });
  }, [search, scopeFilter]);

  const handlePrint = () => {
    window.print();
  };

  const handleTrace = (activityId) => {
    if (setActivePage) {
      setActivePage("traceability");
    }
  };

  return (
    <div className="passport-page">
      {/* HERO */}
      <section className="passport-hero">
        <div className="passport-hero-content">
          <div className="passport-eyebrow">
            AUDIT-READY ESG DATA PASSPORT
          </div>

          <h1>Data Passport</h1>

          <p>
            A reviewer-ready view of every reported ESG figure, its evidence,
            calculation, validation status and BRSR disclosure mapping.
          </p>

          <div className="passport-hero-actions">
            <button
              className="passport-primary-btn"
              onClick={handlePrint}
            >
              🖨 Print Passport
            </button>

            <button
              className="passport-secondary-btn"
              onClick={() => setActivePage?.("traceability")}
            >
              View Traceability →
            </button>
          </div>
        </div>

        <div className="passport-readiness">
          <div className="passport-readiness-ring">
            <strong>{PASSPORT_DATA.readiness}%</strong>
            <span>READY</span>
          </div>

          <p>Overall Data Readiness</p>
        </div>
      </section>

      {/* IDENTITY */}
      <section className="passport-identity">
        <div>
          <span>ORGANIZATION</span>
          <strong>{PASSPORT_DATA.organization}</strong>
        </div>

        <div>
          <span>COMPANY / BUSINESS UNIT</span>
          <strong>{PASSPORT_DATA.company}</strong>
        </div>

        <div>
          <span>REPORTING YEAR</span>
          <strong>{PASSPORT_DATA.reportingYear}</strong>
        </div>

        <div>
          <span>REPORTING PERIOD</span>
          <strong>{PASSPORT_DATA.period}</strong>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="passport-section">
        <div className="passport-section-heading">
          <div>
            <span className="passport-section-label">01 · DATA QUALITY</span>
            <h2>Passport Summary</h2>
          </div>
        </div>

        <div className="passport-stat-grid">
          <div className="passport-stat-card">
            <span className="passport-stat-icon">◈</span>
            <small>Total Activities</small>
            <strong>{PASSPORT_DATA.activities.total}</strong>
            <p>Across Scope 1, 2 & 3</p>
          </div>

          <div className="passport-stat-card">
            <span className="passport-stat-icon">✓</span>
            <small>Validated</small>
            <strong>{PASSPORT_DATA.quality.validated}</strong>
            <p>Activity records validated</p>
          </div>

          <div className="passport-stat-card">
            <span className="passport-stat-icon">▣</span>
            <small>Evidence Verified</small>
            <strong>{PASSPORT_DATA.quality.evidenceVerified}</strong>
            <p>Evidence records verified</p>
          </div>

          <div className="passport-stat-card warning">
            <span className="passport-stat-icon">!</span>
            <small>Needs Review</small>
            <strong>{PASSPORT_DATA.quality.review}</strong>
            <p>Records require attention</p>
          </div>
        </div>
      </section>

      {/* EMISSIONS */}
      <section className="passport-section">
        <div className="passport-section-heading">
          <div>
            <span className="passport-section-label">
              02 · EMISSIONS PROFILE
            </span>
            <h2>GHG Emissions Snapshot</h2>
          </div>
        </div>

        <div className="passport-emission-grid">
          <div className="passport-emission-card scope-one">
            <span>Scope 1</span>
            <strong>{PASSPORT_DATA.emissions.scope1}</strong>
            <small>tCO₂e</small>
            <div className="passport-emission-bar">
              <span
                style={{
                  width: `${
                    (PASSPORT_DATA.emissions.scope1 /
                      PASSPORT_DATA.emissions.total) *
                    100
                  }%`,
                }}
              />
            </div>
            <p>Direct emissions</p>
          </div>

          <div className="passport-emission-card scope-two">
            <span>Scope 2</span>
            <strong>{PASSPORT_DATA.emissions.scope2}</strong>
            <small>tCO₂e</small>
            <div className="passport-emission-bar">
              <span
                style={{
                  width: `${
                    (PASSPORT_DATA.emissions.scope2 /
                      PASSPORT_DATA.emissions.total) *
                    100
                  }%`,
                }}
              />
            </div>
            <p>Purchased electricity</p>
          </div>

          <div className="passport-emission-card scope-three">
            <span>Scope 3</span>
            <strong>{PASSPORT_DATA.emissions.scope3}</strong>
            <small>tCO₂e</small>
            <div className="passport-emission-bar">
              <span
                style={{
                  width: `${
                    (PASSPORT_DATA.emissions.scope3 /
                      PASSPORT_DATA.emissions.total) *
                    100
                  }%`,
                }}
              />
            </div>
            <p>Value-chain emissions</p>
          </div>

          <div className="passport-emission-total">
            <span>TOTAL GHG EMISSIONS</span>
            <strong>{PASSPORT_DATA.emissions.total}</strong>
            <small>tCO₂e</small>
            <p>Consolidated reporting value</p>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="passport-section">
        <div className="passport-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Disclosure Passport
          </button>

          <button
            className={activeTab === "activities" ? "active" : ""}
            onClick={() => setActiveTab("activities")}
          >
            Activity Lineage
          </button>

          <button
            className={activeTab === "checklist" ? "active" : ""}
            onClick={() => setActiveTab("checklist")}
          >
            Reviewer Checklist
          </button>
        </div>

        {/* DISCLOSURE PASSPORT */}
        {activeTab === "overview" && (
          <div className="passport-panel">
            <div className="passport-panel-heading">
              <div>
                <span className="passport-section-label">
                  BRSR DISCLOSURE MAPPING
                </span>
                <h2>Disclosure Readiness</h2>
              </div>
            </div>

            <div className="disclosure-list">
              {PASSPORT_DATA.disclosures.map((item) => (
                <div className="disclosure-row" key={item.id}>
                  <div className="disclosure-code">
                    {item.id}
                  </div>

                  <div className="disclosure-main">
                    <strong>{item.name}</strong>
                    <span>{item.kpi}</span>
                  </div>

                  <div className="disclosure-value">
                    <span>Reported Value</span>
                    <strong>{item.value}</strong>
                  </div>

                  <div className="disclosure-source">
                    <span>Source</span>
                    <strong>{item.source}</strong>
                  </div>

                  <div className="disclosure-readiness">
                    <div>
                      <strong>{item.readiness}%</strong>
                      <StatusBadge status={item.status} />
                    </div>

                    <ProgressBar value={item.readiness} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITY LINEAGE */}
        {activeTab === "activities" && (
          <div className="passport-panel">
            <div className="passport-panel-heading">
              <div>
                <span className="passport-section-label">
                  ACTIVITY → EVIDENCE → FACTOR → CO₂e
                </span>
                <h2>Activity-Level Data Lineage</h2>
              </div>
            </div>

            <div className="passport-toolbar">
              <div className="passport-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search activity, ID or evidence..."
                />
              </div>

              <div className="passport-filter-group">
                {["All", "1", "2", "3"].map((scope) => (
                  <button
                    key={scope}
                    className={scopeFilter === scope ? "active" : ""}
                    onClick={() => setScopeFilter(scope)}
                  >
                    {scope === "All" ? "All" : `Scope ${scope}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="passport-table-wrap">
              <table className="passport-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Scope</th>
                    <th>Activity</th>
                    <th>Quantity</th>
                    <th>Factor</th>
                    <th>CO₂e</th>
                    <th>Evidence</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredActivities.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.id}</strong>
                      </td>

                      <td>
                        <ScopeBadge scope={item.scope} />
                      </td>

                      <td>
                        <strong>{item.activity}</strong>
                        <small>{item.calculation}</small>
                      </td>

                      <td>{item.quantity}</td>

                      <td>
                        <span className="factor-text">
                          {item.factor}
                        </span>
                      </td>

                      <td>
                        <strong className="emission-value">
                          {item.emissions}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={
                            item.evidence === "Missing"
                              ? "missing-evidence"
                              : "evidence-name"
                          }
                        >
                          {item.evidence}
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={item.validation} />
                      </td>

                      <td>
                        <button
                          className="trace-mini-btn"
                          onClick={() => handleTrace(item.id)}
                        >
                          Trace →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredActivities.length === 0 && (
              <div className="passport-empty">
                No matching activity records found.
              </div>
            )}
          </div>
        )}

        {/* CHECKLIST */}
        {activeTab === "checklist" && (
          <div className="passport-panel">
            <div className="passport-panel-heading">
              <div>
                <span className="passport-section-label">
                  AUDIT REVIEW
                </span>
                <h2>Reviewer Checklist</h2>
              </div>
            </div>

            <div className="checklist-grid">
              <div className="checklist-item complete">
                <span>✓</span>
                <div>
                  <strong>Activity data captured</strong>
                  <p>
                    Scope 1, Scope 2 and Scope 3 activity records are
                    available.
                  </p>
                </div>
              </div>

              <div className="checklist-item complete">
                <span>✓</span>
                <div>
                  <strong>Emission factors identified</strong>
                  <p>
                    Each calculated activity has an associated factor.
                  </p>
                </div>
              </div>

              <div className="checklist-item complete">
                <span>✓</span>
                <div>
                  <strong>CO₂e calculation transparent</strong>
                  <p>
                    Quantity × emission factor is visible for review.
                  </p>
                </div>
              </div>

              <div className="checklist-item complete">
                <span>✓</span>
                <div>
                  <strong>Evidence linked</strong>
                  <p>
                    Source evidence is associated with reported activities.
                  </p>
                </div>
              </div>

              <div className="checklist-item complete">
                <span>✓</span>
                <div>
                  <strong>Validation performed</strong>
                  <p>
                    Activity-level validation status is recorded.
                  </p>
                </div>
              </div>

              <div className="checklist-item review">
                <span>!</span>
                <div>
                  <strong>Review items remain</strong>
                  <p>
                    Some evidence and factor confirmations still require
                    reviewer attention.
                  </p>
                </div>
              </div>
            </div>

            <button
              className="checklist-toggle"
              onClick={() => setShowChecklist(!showChecklist)}
            >
              {showChecklist
                ? "Hide detailed reviewer guidance"
                : "Show detailed reviewer guidance"}
            </button>

            {showChecklist && (
              <div className="reviewer-guidance">
                <h3>Suggested Review Sequence</h3>

                <ol>
                  <li>Confirm the reporting period and organizational scope.</li>
                  <li>Verify source evidence for each activity.</li>
                  <li>Review emission factor source and applicability.</li>
                  <li>Recalculate selected CO₂e values.</li>
                  <li>Resolve records marked for review.</li>
                  <li>Confirm BRSR disclosure mapping.</li>
                  <li>Use Traceability to inspect the complete lineage.</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </section>

      {/* AUDIT BANNER */}
      <section className="passport-audit-banner">
        <div className="audit-icon">✓</div>

        <div>
          <span>AUDIT-READY DESIGN</span>
          <h3>Every reported number has a traceable origin.</h3>
          <p>
            Data Passport connects activity data, supporting evidence,
            emission factors, calculations, validation and BRSR disclosures
            into one reviewer-friendly chain.
          </p>
        </div>

        <button onClick={() => setActivePage?.("traceability")}>
          Explore Lineage →
        </button>
      </section>

      <div className="passport-demo-note">
        <strong>Frontend Demo:</strong> Passport values are local demonstration
        data designed to showcase the ESGForge reporting workflow. Emission
        factors are illustrative demo values and should be replaced with
        verified source factors in a production implementation.
      </div>
    </div>
  );
}