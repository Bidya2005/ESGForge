import React, { useMemo, useState } from "react";
import "./Organization.css";

function Organization() {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSubsidiary, setSelectedSubsidiary] = useState("");
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const groups = ["MEIL Group"];

  const subsidiaries = [
    "Megha Engineering & Infrastructures Ltd.",
    "MEIL Renewables",
    "MEIL Infrastructure",
  ];

  const businessUnits = [
    "Infrastructure",
    "Energy",
    "Water & Environment",
    "Manufacturing",
  ];

  const projects = [
    "Project Alpha",
    "Project Beta",
    "Project Gamma",
    "Project Delta",
  ];

  const years = ["2025-26", "2024-25", "2023-24", "2022-23"];

  const selectedCount = [
    selectedGroup,
    selectedSubsidiary,
    selectedBusinessUnit,
    selectedProject,
    selectedYear,
  ].filter(Boolean).length;

  const hierarchyComplete = selectedCount === 5;

  const currentContext = useMemo(() => {
    return {
      group: selectedGroup || "Not selected",
      subsidiary: selectedSubsidiary || "Not selected",
      businessUnit: selectedBusinessUnit || "Not selected",
      project: selectedProject || "Not selected",
      year: selectedYear ? `FY ${selectedYear}` : "Not selected",
    };
  }, [
    selectedGroup,
    selectedSubsidiary,
    selectedBusinessUnit,
    selectedProject,
    selectedYear,
  ]);

  const clearSelection = () => {
    setSelectedGroup("");
    setSelectedSubsidiary("");
    setSelectedBusinessUnit("");
    setSelectedProject("");
    setSelectedYear("");
  };

  return (
    <div className="organization-page">

      {/* HERO */}
      <section className="organization-hero">

        <div className="organization-hero-content">

          <div className="organization-eyebrow">
            <span className="eyebrow-dot"></span>
            ORGANIZATION CONTEXT
          </div>

          <h1>Organization Structure</h1>

          <p>
            Define the organizational context for ESG data collection,
            validation, emissions reporting and BRSR disclosures.
          </p>

          <div className="organization-hero-meta">
            <div className="hero-meta-item">
              <span className="hero-meta-icon">◎</span>
              <div>
                <small>Current Group</small>
                <strong>{selectedGroup || "MEIL Group"}</strong>
              </div>
            </div>

            <div className="hero-meta-divider"></div>

            <div className="hero-meta-item">
              <span className="hero-meta-icon">◷</span>
              <div>
                <small>Reporting Year</small>
                <strong>{selectedYear || "2025-26"}</strong>
              </div>
            </div>
          </div>

        </div>

        <div className="organization-hero-status">
          <span className="status-pulse"></span>
          <div>
            <strong>Active Organization</strong>
            <small>ESG reporting workspace</small>
          </div>
        </div>

      </section>

      {/* CONTEXT SUMMARY */}
      <section className="organization-summary">

        <div className="summary-card">
          <div className="summary-icon group-icon">◎</div>
          <div>
            <span>GROUP</span>
            <strong>{selectedGroup || "MEIL Group"}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon company-icon">▣</div>
          <div>
            <span>SUBSIDIARIES</span>
            <strong>3 Entities</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon project-icon">⌂</div>
          <div>
            <span>PROJECTS</span>
            <strong>4 Projects</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon year-icon">◷</div>
          <div>
            <span>REPORTING PERIOD</span>
            <strong>{selectedYear || "2025-26"}</strong>
          </div>
        </div>

      </section>

      {/* MAIN CONTENT */}
      <section className="organization-main-grid">

        {/* HIERARCHY CARD */}
        <div className="organization-card hierarchy-card">

          <div className="card-heading">

            <div className="heading-icon">⌘</div>

            <div>
              <h2>Reporting Hierarchy</h2>
              <p>
                Select the organizational level where ESG data is being
                collected and reported.
              </p>
            </div>

            <div className="selection-counter">
              <strong>{selectedCount}</strong>
              <span>/ 5 selected</span>
            </div>

          </div>

          <div className="hierarchy-fields">

            {/* GROUP */}
            <div className="organization-field">
              <div className="field-label">
                <span className="field-number">01</span>
                <div>
                  <label>Group</label>
                  <small>Parent organization</small>
                </div>
              </div>

              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">Select Group</option>

                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBSIDIARY */}
            <div className="organization-field">
              <div className="field-label">
                <span className="field-number">02</span>
                <div>
                  <label>Subsidiary</label>
                  <small>Reporting entity</small>
                </div>
              </div>

              <select
                value={selectedSubsidiary}
                onChange={(e) => setSelectedSubsidiary(e.target.value)}
              >
                <option value="">Select Subsidiary</option>

                {subsidiaries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* BUSINESS UNIT */}
            <div className="organization-field">
              <div className="field-label">
                <span className="field-number">03</span>
                <div>
                  <label>Business Unit</label>
                  <small>Operational division</small>
                </div>
              </div>

              <select
                value={selectedBusinessUnit}
                onChange={(e) => setSelectedBusinessUnit(e.target.value)}
              >
                <option value="">Select Business Unit</option>

                {businessUnits.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* PROJECT */}
            <div className="organization-field">
              <div className="field-label">
                <span className="field-number">04</span>
                <div>
                  <label>Project</label>
                  <small>Project-level ESG boundary</small>
                </div>
              </div>

              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Select Project</option>

                {projects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* REPORTING PERIOD */}
            <div className="organization-field full-width-field">
              <div className="field-label">
                <span className="field-number">05</span>
                <div>
                  <label>Reporting Period</label>
                  <small>Financial year for ESG reporting</small>
                </div>
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Select Financial Year</option>

                {years.map((year) => (
                  <option key={year} value={year}>
                    FY {year}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="hierarchy-actions">
            <button
              className="clear-selection-btn"
              onClick={clearSelection}
              disabled={selectedCount === 0}
            >
              Clear Selection
            </button>

            <div className="selection-status">
              <span className={hierarchyComplete ? "complete-dot" : "pending-dot"}></span>

              {hierarchyComplete
                ? "Reporting context complete"
                : "Complete the hierarchy to define reporting context"}
            </div>
          </div>

        </div>

        {/* CURRENT CONTEXT */}
        <div className="context-card">

          <div className="context-card-header">
            <div>
              <span className="context-label">ACTIVE CONTEXT</span>
              <h2>Reporting Boundary</h2>
            </div>

            <div className={`context-status ${hierarchyComplete ? "complete" : "pending"}`}>
              {hierarchyComplete ? "READY" : "INCOMPLETE"}
            </div>
          </div>

          <div className="context-description">
            This context determines where activity data, evidence,
            emissions calculations and BRSR disclosures are attributed.
          </div>

          <div className="context-tree">

            <div className={`context-node ${selectedGroup ? "active" : ""}`}>
              <div className="node-icon">◎</div>
              <div>
                <small>GROUP</small>
                <strong>{currentContext.group}</strong>
              </div>
            </div>

            <div className="tree-line"></div>

            <div className={`context-node ${selectedSubsidiary ? "active" : ""}`}>
              <div className="node-icon">▣</div>
              <div>
                <small>SUBSIDIARY</small>
                <strong>{currentContext.subsidiary}</strong>
              </div>
            </div>

            <div className="tree-line"></div>

            <div className={`context-node ${selectedBusinessUnit ? "active" : ""}`}>
              <div className="node-icon">⌂</div>
              <div>
                <small>BUSINESS UNIT</small>
                <strong>{currentContext.businessUnit}</strong>
              </div>
            </div>

            <div className="tree-line"></div>

            <div className={`context-node ${selectedProject ? "active" : ""}`}>
              <div className="node-icon">◆</div>
              <div>
                <small>PROJECT</small>
                <strong>{currentContext.project}</strong>
              </div>
            </div>

            <div className="tree-line"></div>

            <div className={`context-node ${selectedYear ? "active" : ""}`}>
              <div className="node-icon">◷</div>
              <div>
                <small>REPORTING PERIOD</small>
                <strong>{currentContext.year}</strong>
              </div>
            </div>

          </div>

          <div className="context-footer">
            <span>ESG data boundary</span>
            <strong>
              {selectedProject || "Project not selected"}
            </strong>
          </div>

        </div>

      </section>

      {/* ESG REPORTING FLOW */}
      <section className="organization-card reporting-flow-card">

        <div className="card-heading flow-heading">

          <div className="heading-icon">↗</div>

          <div>
            <h2>How this context is used</h2>
            <p>
              Your organizational selection flows through the ESGForge
              reporting process.
            </p>
          </div>

        </div>

        <div className="reporting-flow">

          <div className="flow-item">
            <div className="flow-number">01</div>
            <div>
              <strong>Activity Data</strong>
              <span>Capture ESG activities</span>
            </div>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-item">
            <div className="flow-number">02</div>
            <div>
              <strong>Evidence</strong>
              <span>Attach supporting records</span>
            </div>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-item">
            <div className="flow-number">03</div>
            <div>
              <strong>Calculation</strong>
              <span>Calculate CO₂e & KPIs</span>
            </div>
          </div>

          <div className="flow-arrow">→</div>

          <div className="flow-item">
            <div className="flow-number">04</div>
            <div>
              <strong>BRSR Reporting</strong>
              <span>Generate disclosures</span>
            </div>
          </div>

        </div>

      </section>

      {/* DEMO NOTICE */}
      <div className="organization-demo-note">
        <div className="demo-note-icon">i</div>

        <div>
          <strong>Frontend demonstration mode</strong>
          <p>
            Organization selections are currently managed locally in the
            browser for demonstration purposes. No backend connection is
            required.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Organization;