import React, { useMemo, useState } from "react";
import "./BRSRReadiness.css";

const READINESS_DATA = {
  overall: 82,

  summary: {
    total: 15,
    ready: 9,
    review: 4,
    gaps: 2,
  },

  sections: [
    {
      name: "Environmental",
      short: "ENV",
      score: 88,
      status: "READY",
      disclosures: 5,
    },
    {
      name: "Energy & Emissions",
      short: "E&E",
      score: 84,
      status: "READY",
      disclosures: 4,
    },
    {
      name: "Water Management",
      short: "WTR",
      score: 78,
      status: "REVIEW",
      disclosures: 2,
    },
    {
      name: "Waste Management",
      short: "WST",
      score: 76,
      status: "REVIEW",
      disclosures: 2,
    },
    {
      name: "Social",
      short: "SOC",
      score: 81,
      status: "READY",
      disclosures: 2,
    },
  ],

  disclosures: [
    {
      id: "C-EN-01",
      name: "GHG Emissions",
      category: "Environmental",
      completion: 92,
      evidence: "Verified",
      validation: "Valid",
      status: "READY",
    },
    {
      id: "C-EN-02",
      name: "Scope 1 Emissions",
      category: "Energy & Emissions",
      completion: 95,
      evidence: "Verified",
      validation: "Valid",
      status: "READY",
    },
    {
      id: "C-EN-03",
      name: "Scope 2 Emissions",
      category: "Energy & Emissions",
      completion: 76,
      evidence: "Pending",
      validation: "Review",
      status: "REVIEW",
    },
    {
      id: "C-EN-04",
      name: "Scope 3 Emissions",
      category: "Energy & Emissions",
      completion: 81,
      evidence: "Verified",
      validation: "Valid",
      status: "REVIEW",
    },
    {
      id: "C-EN-05",
      name: "Energy Management",
      category: "Environmental",
      completion: 76,
      evidence: "Verified",
      validation: "Valid",
      status: "REVIEW",
    },
    {
      id: "C-EN-06",
      name: "Water Management",
      category: "Water Management",
      completion: 72,
      evidence: "Verified",
      validation: "Valid",
      status: "REVIEW",
    },
    {
      id: "C-EN-07",
      name: "Waste Management",
      category: "Waste Management",
      completion: 68,
      evidence: "Missing",
      validation: "Review",
      status: "GAP",
    },
    {
      id: "C-SO-01",
      name: "Employee Wellbeing",
      category: "Social",
      completion: 84,
      evidence: "Verified",
      validation: "Valid",
      status: "READY",
    },
    {
      id: "C-SO-02",
      name: "Training & Development",
      category: "Social",
      completion: 79,
      evidence: "Verified",
      validation: "Valid",
      status: "READY",
    },
  ],

  gaps: [
    {
      priority: "HIGH",
      title: "Missing waste evidence",
      description:
        "Waste Generated activity S3-002 does not have supporting evidence attached.",
      action: "Upload evidence",
      target: "Evidence",
    },
    {
      priority: "MEDIUM",
      title: "Scope 2 factor confirmation",
      description:
        "The electricity emission factor requires source confirmation before final approval.",
      action: "Review factor",
      target: "Traceability",
    },
    {
      priority: "MEDIUM",
      title: "Water disclosure needs review",
      description:
        "Water management disclosure is below the readiness threshold.",
      action: "Review disclosure",
      target: "Data Entry",
    },
    {
      priority: "LOW",
      title: "Waste readiness below target",
      description:
        "Waste Management currently has a readiness score of 68%.",
      action: "View details",
      target: "Reports",
    },
  ],
};

const STATUS_CONFIG = {
  READY: {
    label: "READY",
    className: "ready",
  },
  REVIEW: {
    label: "REVIEW",
    className: "review",
  },
  GAP: {
    label: "GAP",
    className: "gap",
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.REVIEW;

  return (
    <span className={`readiness-status ${config.className}`}>
      <span className="status-dot" />
      {config.label}
    </span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="readiness-progress">
      <div
        className="readiness-progress-fill"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ScoreRing({ score }) {
  return (
    <div className="score-ring">
      <div className="score-ring-inner">
        <strong>{score}%</strong>
        <span>Ready</span>
      </div>
    </div>
  );
}

export default function BRSRReadiness({ setActivePage }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedDisclosure, setSelectedDisclosure] = useState(null);
  const [showChecklist, setShowChecklist] = useState(false);

  const categories = [
    "All",
    ...new Set(READINESS_DATA.disclosures.map((item) => item.category)),
  ];

  const filteredDisclosures = useMemo(() => {
    return READINESS_DATA.disclosures.filter((item) => {
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [categoryFilter, statusFilter, search]);

  const handleAction = (target) => {
    if (!setActivePage) return;

    const pageMap = {
      Evidence: "evidence",
      Traceability: "traceability",
      "Data Entry": "data-entry",
      Reports: "reports",
    };

    if (pageMap[target]) {
      setActivePage(pageMap[target]);
    }
  };

  return (
    <div className="readiness-page">
      {/* HERO */}
      <section className="readiness-hero">
        <div className="readiness-hero-content">
          <div className="readiness-eyebrow">
            BRSR DISCLOSURE READINESS
          </div>

          <h1>BRSR Readiness</h1>

          <p>
            Review disclosure completeness, evidence coverage, validation
            status and remaining reporting gaps before final submission.
          </p>

          <div className="readiness-meta">
            <span>Reporting Year: <strong>2025–26</strong></span>
            <span>Period: <strong>01 Apr 2025 – 31 Mar 2026</strong></span>
            <span>Mode: <strong>Frontend Demo</strong></span>
          </div>
        </div>

        <ScoreRing score={READINESS_DATA.overall} />
      </section>

      {/* SUMMARY */}
      <section className="readiness-summary">
        <div className="readiness-summary-card total">
          <div className="summary-icon">◈</div>
          <div>
            <span>Total Disclosures</span>
            <strong>{READINESS_DATA.summary.total}</strong>
            <small>Tracked for reporting</small>
          </div>
        </div>

        <div className="readiness-summary-card ready-card">
          <div className="summary-icon">✓</div>
          <div>
            <span>Ready</span>
            <strong>{READINESS_DATA.summary.ready}</strong>
            <small>Ready for reporting</small>
          </div>
        </div>

        <div className="readiness-summary-card review-card">
          <div className="summary-icon">!</div>
          <div>
            <span>Needs Review</span>
            <strong>{READINESS_DATA.summary.review}</strong>
            <small>Requires attention</small>
          </div>
        </div>

        <div className="readiness-summary-card gap-card">
          <div className="summary-icon">×</div>
          <div>
            <span>Critical Gaps</span>
            <strong>{READINESS_DATA.summary.gaps}</strong>
            <small>Blocking readiness</small>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="readiness-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          className={activeTab === "disclosures" ? "active" : ""}
          onClick={() => setActiveTab("disclosures")}
        >
          Disclosure Readiness
        </button>

        <button
          className={activeTab === "gaps" ? "active" : ""}
          onClick={() => setActiveTab("gaps")}
        >
          Gaps & Actions
        </button>
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <>
          <section className="readiness-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">SECTION HEALTH</span>
                <h2>Readiness by reporting area</h2>
              </div>

              <span className="section-caption">
                Based on completeness, evidence and validation
              </span>
            </div>

            <div className="section-readiness-grid">
              {READINESS_DATA.sections.map((section) => (
                <div className="section-readiness-card" key={section.name}>
                  <div className="section-card-top">
                    <div>
                      <span className="section-code">
                        {section.short}
                      </span>
                      <h3>{section.name}</h3>
                    </div>

                    <StatusBadge
                      status={
                        section.status === "READY" ? "READY" : "REVIEW"
                      }
                    />
                  </div>

                  <div className="section-score">
                    <strong>{section.score}%</strong>
                    <span>{section.disclosures} disclosures</span>
                  </div>

                  <ProgressBar value={section.score} />
                </div>
              ))}
            </div>
          </section>

          <section className="readiness-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">REPORTING PIPELINE</span>
                <h2>From activity data to BRSR disclosure</h2>
              </div>
            </div>

            <div className="readiness-pipeline">
              <div className="readiness-pipeline-step">
                <span>01</span>
                <strong>Activity Data</strong>
                <small>Capture</small>
              </div>

              <div className="pipeline-arrow">›</div>

              <div className="readiness-pipeline-step">
                <span>02</span>
                <strong>Evidence</strong>
                <small>Support</small>
              </div>

              <div className="pipeline-arrow">›</div>

              <div className="readiness-pipeline-step">
                <span>03</span>
                <strong>Calculation</strong>
                <small>CO₂e</small>
              </div>

              <div className="pipeline-arrow">›</div>

              <div className="readiness-pipeline-step">
                <span>04</span>
                <strong>Validation</strong>
                <small>Quality</small>
              </div>

              <div className="pipeline-arrow">›</div>

              <div className="readiness-pipeline-step final">
                <span>05</span>
                <strong>BRSR</strong>
                <small>Ready</small>
              </div>
            </div>
          </section>

          <section className="readiness-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">READINESS SIGNALS</span>
                <h2>What is driving the current score?</h2>
              </div>
            </div>

            <div className="signal-grid">
              <div className="signal-card positive">
                <div className="signal-icon">✓</div>
                <div>
                  <strong>Evidence coverage</strong>
                  <p>
                    Most major emissions activities have supporting evidence.
                  </p>
                </div>
              </div>

              <div className="signal-card positive">
                <div className="signal-icon">✓</div>
                <div>
                  <strong>Scope coverage</strong>
                  <p>
                    Scope 1, Scope 2 and Scope 3 activity data is captured.
                  </p>
                </div>
              </div>

              <div className="signal-card warning">
                <div className="signal-icon">!</div>
                <div>
                  <strong>Pending review</strong>
                  <p>
                    Scope 2 factor confirmation is still required.
                  </p>
                </div>
              </div>

              <div className="signal-card danger">
                <div className="signal-icon">×</div>
                <div>
                  <strong>Missing evidence</strong>
                  <p>
                    Waste activity S3-002 requires supporting documentation.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* DISCLOSURES */}
      {activeTab === "disclosures" && (
        <section className="readiness-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">DISCLOSURE REGISTER</span>
              <h2>BRSR disclosure readiness</h2>
            </div>
          </div>

          <div className="disclosure-toolbar">
            <input
              type="text"
              placeholder="Search disclosure or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="READY">Ready</option>
              <option value="REVIEW">Review</option>
              <option value="GAP">Gap</option>
            </select>
          </div>

          <div className="disclosure-table-wrap">
            <table className="disclosure-table">
              <thead>
                <tr>
                  <th>Disclosure</th>
                  <th>Category</th>
                  <th>Completion</th>
                  <th>Evidence</th>
                  <th>Validation</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredDisclosures.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="disclosure-name">
                        <strong>{item.id}</strong>
                        <span>{item.name}</span>
                      </div>
                    </td>

                    <td>{item.category}</td>

                    <td>
                      <div className="table-progress">
                        <div>
                          <ProgressBar value={item.completion} />
                        </div>
                        <strong>{item.completion}%</strong>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`mini-status ${
                          item.evidence === "Verified"
                            ? "verified"
                            : item.evidence === "Pending"
                            ? "pending"
                            : "missing"
                        }`}
                      >
                        {item.evidence}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`mini-status ${
                          item.validation === "Valid"
                            ? "verified"
                            : "pending"
                        }`}
                      >
                        {item.validation}
                      </span>
                    </td>

                    <td>
                      <StatusBadge status={item.status} />
                    </td>

                    <td>
                      <button
                        className="view-button"
                        onClick={() => setSelectedDisclosure(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* GAPS */}
      {activeTab === "gaps" && (
        <section className="readiness-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">ACTION CENTER</span>
              <h2>Readiness gaps & recommended actions</h2>
            </div>
          </div>

          <div className="gaps-list">
            {READINESS_DATA.gaps.map((gap, index) => (
              <div className="gap-item" key={index}>
                <div className={`priority ${gap.priority.toLowerCase()}`}>
                  {gap.priority}
                </div>

                <div className="gap-content">
                  <h3>{gap.title}</h3>
                  <p>{gap.description}</p>
                </div>

                <button
                  className="gap-action"
                  onClick={() => handleAction(gap.target)}
                >
                  {gap.action} →
                </button>
              </div>
            ))}
          </div>

          <div className="checklist-panel">
            <div>
              <span className="section-kicker">FINAL REVIEW</span>
              <h3>Reviewer readiness checklist</h3>
              <p>
                Confirm evidence, calculations, validation and disclosure
                completeness before final report generation.
              </p>
            </div>

            <button
              className="checklist-button"
              onClick={() => setShowChecklist(!showChecklist)}
            >
              {showChecklist ? "Hide Checklist" : "Open Checklist"}
            </button>

            {showChecklist && (
              <div className="checklist-items">
                <label>
                  <input type="checkbox" />
                  All Scope 1 activities have evidence
                </label>

                <label>
                  <input type="checkbox" />
                  Scope 2 emission factor has been confirmed
                </label>

                <label>
                  <input type="checkbox" />
                  Scope 3 activities have supporting documents
                </label>

                <label>
                  <input type="checkbox" />
                  Validation issues have been reviewed
                </label>

                <label>
                  <input type="checkbox" />
                  BRSR disclosures are ready for reporting
                </label>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FINAL BANNER */}
      <section className="audit-ready-banner">
        <div className="audit-banner-icon">✓</div>

        <div>
          <span>AUDIT-READY STATUS</span>
          <h2>ESGForge is {READINESS_DATA.overall}% ready for BRSR reporting</h2>
          <p>
            Core activity data, emissions calculations and most supporting
            evidence are available. Resolve the remaining review items before
            final submission.
          </p>
        </div>

        <button onClick={() => setActivePage && setActivePage("reports")}>
          View Reports →
        </button>
      </section>

      {/* DISCLOSURE MODAL */}
      {selectedDisclosure && (
        <div
          className="readiness-modal-overlay"
          onClick={() => setSelectedDisclosure(null)}
        >
          <div
            className="readiness-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedDisclosure(null)}
            >
              ×
            </button>

            <span className="section-kicker">DISCLOSURE DETAILS</span>

            <div className="modal-title-row">
              <div>
                <strong>{selectedDisclosure.id}</strong>
                <h2>{selectedDisclosure.name}</h2>
              </div>

              <StatusBadge status={selectedDisclosure.status} />
            </div>

            <div className="modal-score">
              <span>Completion</span>
              <strong>{selectedDisclosure.completion}%</strong>
              <ProgressBar value={selectedDisclosure.completion} />
            </div>

            <div className="modal-detail-grid">
              <div>
                <span>Category</span>
                <strong>{selectedDisclosure.category}</strong>
              </div>

              <div>
                <span>Evidence</span>
                <strong>{selectedDisclosure.evidence}</strong>
              </div>

              <div>
                <span>Validation</span>
                <strong>{selectedDisclosure.validation}</strong>
              </div>

              <div>
                <span>Reporting Year</span>
                <strong>2025–26</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setSelectedDisclosure(null);
                  handleAction("Traceability");
                }}
              >
                Trace Data
              </button>

              <button
                onClick={() => {
                  setSelectedDisclosure(null);
                  handleAction("Evidence");
                }}
              >
                View Evidence
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="readiness-demo-note">
        Frontend demo mode — readiness values are illustrative visualization
        data for the ESGForge prototype.
      </div>
    </div>
  );
}