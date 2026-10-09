import React, { useMemo, useState } from "react";
import "./Aggregation.css";

const AGGREGATION_DATA = {
  projects: [
    {
      id: "PRJ-001",
      name: "Alpha Infrastructure Project",
      businessUnit: "Infrastructure",
      subsidiary: "Megha Engineering & Infrastructures Ltd.",
      activities: 3,
      scope1: 6.7,
      scope2: 90.0,
      scope3: 35.28,
      validated: 3,
    },
    {
      id: "PRJ-002",
      name: "Beta Energy Project",
      businessUnit: "Energy",
      subsidiary: "MEIL Renewables",
      activities: 1,
      scope1: 4.96,
      scope2: 60.84,
      scope3: 0,
      validated: 1,
    },
    {
      id: "PRJ-003",
      name: "Gamma Water Project",
      businessUnit: "Water & Environment",
      subsidiary: "MEIL Infrastructure",
      activities: 1,
      scope1: 0,
      scope2: 0,
      scope3: 35.7,
      validated: 0,
    },
    {
      id: "PRJ-004",
      name: "Delta Manufacturing Project",
      businessUnit: "Manufacturing",
      subsidiary: "Megha Engineering & Infrastructures Ltd.",
      activities: 1,
      scope1: 0,
      scope2: 0,
      scope3: 0,
      validated: 0,
    },
  ],
};

const LEVELS = [
  {
    id: "PROJECT",
    label: "Project",
    description: "Activity-level source records",
  },
  {
    id: "BU",
    label: "Business Unit",
    description: "Project consolidation",
  },
  {
    id: "SUBSIDIARY",
    label: "Subsidiary",
    description: "Business unit consolidation",
  },
  {
    id: "GROUP",
    label: "Group",
    description: "Enterprise-level consolidation",
  },
];

function ScopePill({ scope }) {
  return <span className={`aggregation-scope ${scope}`}>{scope}</span>;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function EmissionBar({ label, value, total, className }) {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div className="aggregation-bar-row">
      <div className="aggregation-bar-label">
        <span>{label}</span>
        <strong>{formatNumber(value)} tCO₂e</strong>
      </div>

      <div className="aggregation-bar-track">
        <div
          className={`aggregation-bar-fill ${className}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function Aggregation() {
  const [activeLevel, setActiveLevel] = useState("PROJECT");
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState(
    AGGREGATION_DATA.projects[0]
  );

  const projectTotals = useMemo(() => {
    return AGGREGATION_DATA.projects.reduce(
      (total, project) => ({
        activities: total.activities + project.activities,
        scope1: total.scope1 + project.scope1,
        scope2: total.scope2 + project.scope2,
        scope3: total.scope3 + project.scope3,
        validated: total.validated + project.validated,
      }),
      {
        activities: 0,
        scope1: 0,
        scope2: 0,
        scope3: 0,
        validated: 0,
      }
    );
  }, []);

  const totalEmissions =
    projectTotals.scope1 +
    projectTotals.scope2 +
    projectTotals.scope3;

  const selectedTotal =
    selectedProject.scope1 +
    selectedProject.scope2 +
    selectedProject.scope3;

  const businessUnits = useMemo(() => {
    return AGGREGATION_DATA.projects.reduce((result, project) => {
      const key = project.businessUnit;

      if (!result[key]) {
        result[key] = {
          name: key,
          subsidiary: project.subsidiary,
          projects: 0,
          activities: 0,
          scope1: 0,
          scope2: 0,
          scope3: 0,
          validated: 0,
        };
      }

      result[key].projects += 1;
      result[key].activities += project.activities;
      result[key].scope1 += project.scope1;
      result[key].scope2 += project.scope2;
      result[key].scope3 += project.scope3;
      result[key].validated += project.validated;

      return result;
    }, {});
  }, []);

  const subsidiaries = useMemo(() => {
    return AGGREGATION_DATA.projects.reduce((result, project) => {
      const key = project.subsidiary;

      if (!result[key]) {
        result[key] = {
          name: key,
          businessUnits: new Set(),
          projects: 0,
          activities: 0,
          scope1: 0,
          scope2: 0,
          scope3: 0,
          validated: 0,
        };
      }

      result[key].businessUnits.add(project.businessUnit);
      result[key].projects += 1;
      result[key].activities += project.activities;
      result[key].scope1 += project.scope1;
      result[key].scope2 += project.scope2;
      result[key].scope3 += project.scope3;
      result[key].validated += project.validated;

      return result;
    }, {});
  }, []);

  const getFilteredProjects = () => {
    if (scopeFilter === "ALL") return AGGREGATION_DATA.projects;

    return AGGREGATION_DATA.projects.filter((project) => {
      if (scopeFilter === "SCOPE 1") return project.scope1 > 0;
      if (scopeFilter === "SCOPE 2") return project.scope2 > 0;
      if (scopeFilter === "SCOPE 3") return project.scope3 > 0;
      return true;
    });
  };

  const filteredProjects = getFilteredProjects();

  return (
    <div className="aggregation-page">
      {/* HERO */}
      <section className="aggregation-hero">
        <div className="aggregation-hero-content">
          <span className="aggregation-eyebrow">
            ESG CONSOLIDATION ENGINE
          </span>

          <h1>Aggregation & Consolidation</h1>

          <p>
            Consolidate validated activity-level emissions from individual
            projects through business units and subsidiaries into a single
            group-level ESG view.
          </p>

          <div className="aggregation-hero-tags">
            <span>Project → BU</span>
            <span>BU → Subsidiary</span>
            <span>Subsidiary → Group</span>
            <span>Scope 1 / 2 / 3</span>
            <span>Double-counting control</span>
          </div>
        </div>

        <div className="aggregation-hero-total">
          <span>GROUP EMISSIONS</span>
          <strong>{formatNumber(totalEmissions)}</strong>
          <small>tCO₂e • FY 2025–26</small>
        </div>
      </section>

      {/* HIERARCHY */}
      <section className="aggregation-section">
        <div className="aggregation-heading">
          <div>
            <span>CONSOLIDATION HIERARCHY</span>
            <h2>One source of truth, four reporting levels</h2>
          </div>
        </div>

        <div className="aggregation-hierarchy">
          {LEVELS.map((level, index) => (
            <React.Fragment key={level.id}>
              <button
                className={`aggregation-level ${
                  activeLevel === level.id ? "active" : ""
                }`}
                onClick={() => setActiveLevel(level.id)}
              >
                <div className="aggregation-level-number">
                  0{index + 1}
                </div>

                <strong>{level.label}</strong>
                <span>{level.description}</span>
              </button>

              {index < LEVELS.length - 1 && (
                <div className="aggregation-arrow">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* SUMMARY */}
      <section className="aggregation-summary">
        <div className="aggregation-summary-card">
          <span>Source Activities</span>
          <strong>{projectTotals.activities}</strong>
          <small>Activity records</small>
        </div>

        <div className="aggregation-summary-card scope1-card">
          <span>Scope 1</span>
          <strong>{formatNumber(projectTotals.scope1)}</strong>
          <small>tCO₂e</small>
        </div>

        <div className="aggregation-summary-card scope2-card">
          <span>Scope 2</span>
          <strong>{formatNumber(projectTotals.scope2)}</strong>
          <small>tCO₂e</small>
        </div>

        <div className="aggregation-summary-card scope3-card">
          <span>Scope 3</span>
          <strong>{formatNumber(projectTotals.scope3)}</strong>
          <small>tCO₂e</small>
        </div>

        <div className="aggregation-summary-card validated-card">
          <span>Validated</span>
          <strong>
            {projectTotals.validated}/{projectTotals.activities}
          </strong>
          <small>Source records</small>
        </div>
      </section>

      {/* GROUP OVERVIEW */}
      <section className="aggregation-section">
        <div className="aggregation-heading">
          <div>
            <span>GROUP CONSOLIDATION</span>
            <h2>Emissions overview</h2>
          </div>

          <div className="aggregation-controlled">
            <span>✓</span>
            Calculated from source records
          </div>
        </div>

        <div className="aggregation-overview-grid">
          <div className="aggregation-total-card">
            <div className="aggregation-total-top">
              <span>Total Group Emissions</span>

              <span className="aggregation-ready-badge">
                READY
              </span>
            </div>

            <strong>{formatNumber(totalEmissions)}</strong>

            <small>tCO₂e</small>

            <div className="aggregation-total-breakdown">
              <div>
                <ScopePill scope="S1" />
                <strong>{formatNumber(projectTotals.scope1)}</strong>
              </div>

              <div>
                <ScopePill scope="S2" />
                <strong>{formatNumber(projectTotals.scope2)}</strong>
              </div>

              <div>
                <ScopePill scope="S3" />
                <strong>{formatNumber(projectTotals.scope3)}</strong>
              </div>
            </div>
          </div>

          <div className="aggregation-bars-card">
            <span className="aggregation-card-label">
              SCOPE CONTRIBUTION
            </span>

            <EmissionBar
              label="Scope 1"
              value={projectTotals.scope1}
              total={totalEmissions}
              className="scope1-bar"
            />

            <EmissionBar
              label="Scope 2"
              value={projectTotals.scope2}
              total={totalEmissions}
              className="scope2-bar"
            />

            <EmissionBar
              label="Scope 3"
              value={projectTotals.scope3}
              total={totalEmissions}
              className="scope3-bar"
            />
          </div>
        </div>
      </section>

      {/* LEVEL TABLE */}
      <section className="aggregation-section">
        <div className="aggregation-heading">
          <div>
            <span>{activeLevel} VIEW</span>
            <h2>
              {activeLevel === "PROJECT"
                ? "Project-level source records"
                : activeLevel === "BU"
                ? "Business unit consolidation"
                : activeLevel === "SUBSIDIARY"
                ? "Subsidiary consolidation"
                : "Group-level consolidation"}
            </h2>
          </div>

          <div className="aggregation-filter">
            {["ALL", "SCOPE 1", "SCOPE 2", "SCOPE 3"].map((scope) => (
              <button
                key={scope}
                className={scopeFilter === scope ? "active" : ""}
                onClick={() => setScopeFilter(scope)}
              >
                {scope === "ALL" ? "All" : scope.replace("SCOPE ", "S")}
              </button>
            ))}
          </div>
        </div>

        {activeLevel === "PROJECT" && (
          <div className="aggregation-table">
            <div className="aggregation-table-head project-head">
              <span>Project</span>
              <span>Business Unit</span>
              <span>S1</span>
              <span>S2</span>
              <span>S3</span>
              <span>Total</span>
              <span>Validation</span>
            </div>

            {filteredProjects.map((project) => {
              const total =
                project.scope1 +
                project.scope2 +
                project.scope3;

              return (
                <button
                  className={`aggregation-table-row project-row ${
                    selectedProject.id === project.id ? "selected" : ""
                  }`}
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                >
                  <div>
                    <strong>{project.name}</strong>
                    <small>{project.id}</small>
                  </div>

                  <div>
                    <strong>{project.businessUnit}</strong>
                    <small>{project.activities} activities</small>
                  </div>

                  <strong>{formatNumber(project.scope1)}</strong>
                  <strong>{formatNumber(project.scope2)}</strong>
                  <strong>{formatNumber(project.scope3)}</strong>

                  <strong className="project-total">
                    {formatNumber(total)}
                  </strong>

                  <span className="validation-pill">
                    {project.validated}/{project.activities} Valid
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {activeLevel === "BU" && (
          <div className="aggregation-table">
            <div className="aggregation-table-head">
              <span>Business Unit</span>
              <span>Projects</span>
              <span>S1</span>
              <span>S2</span>
              <span>S3</span>
              <span>Total</span>
              <span>Validated</span>
            </div>

            {Object.values(businessUnits).map((unit) => {
              const total =
                unit.scope1 +
                unit.scope2 +
                unit.scope3;

              return (
                <div className="aggregation-table-row" key={unit.name}>
                  <div>
                    <strong>{unit.name}</strong>
                    <small>{unit.activities} activities</small>
                  </div>

                  <strong>{unit.projects}</strong>
                  <strong>{formatNumber(unit.scope1)}</strong>
                  <strong>{formatNumber(unit.scope2)}</strong>
                  <strong>{formatNumber(unit.scope3)}</strong>

                  <strong className="project-total">
                    {formatNumber(total)}
                  </strong>

                  <span className="validation-pill">
                    {unit.validated}/{unit.activities}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {activeLevel === "SUBSIDIARY" && (
          <div className="aggregation-table">
            <div className="aggregation-table-head">
              <span>Subsidiary</span>
              <span>BU Count</span>
              <span>S1</span>
              <span>S2</span>
              <span>S3</span>
              <span>Total</span>
              <span>Validated</span>
            </div>

            {Object.values(subsidiaries).map((subsidiary) => {
              const total =
                subsidiary.scope1 +
                subsidiary.scope2 +
                subsidiary.scope3;

              return (
                <div
                  className="aggregation-table-row"
                  key={subsidiary.name}
                >
                  <div>
                    <strong>{subsidiary.name}</strong>
                    <small>{subsidiary.projects} projects</small>
                  </div>

                  <strong>{subsidiary.businessUnits.size}</strong>

                  <strong>{formatNumber(subsidiary.scope1)}</strong>
                  <strong>{formatNumber(subsidiary.scope2)}</strong>
                  <strong>{formatNumber(subsidiary.scope3)}</strong>

                  <strong className="project-total">
                    {formatNumber(total)}
                  </strong>

                  <span className="validation-pill">
                    {subsidiary.validated}/{subsidiary.activities}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {activeLevel === "GROUP" && (
          <div className="group-consolidation-card">
            <div className="group-node">
              <span>GROUP</span>
              <strong>MEIL Group</strong>
              <small>{formatNumber(totalEmissions)} tCO₂e</small>
            </div>

            <div className="group-connectors">
              <div />
              <div />
              <div />
            </div>

            <div className="group-subnodes">
              {Object.values(subsidiaries).map((subsidiary) => {
                const total =
                  subsidiary.scope1 +
                  subsidiary.scope2 +
                  subsidiary.scope3;

                return (
                  <div className="group-subnode" key={subsidiary.name}>
                    <span>SUBSIDIARY</span>

                    <strong>{subsidiary.name}</strong>

                    <b>{formatNumber(total)} tCO₂e</b>

                    <small>
                      {subsidiary.projects} projects •{" "}
                      {subsidiary.activities} activities
                    </small>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* SELECTED PROJECT DETAIL */}
      <section className="aggregation-detail-grid">
        <div className="aggregation-detail-card">
          <span className="aggregation-card-label">
            SELECTED SOURCE
          </span>

          <h3>{selectedProject.name}</h3>

          <p>
            {selectedProject.id} • {selectedProject.businessUnit}
          </p>

          <div className="aggregation-detail-metrics">
            <div>
              <span>Scope 1</span>
              <strong>
                {formatNumber(selectedProject.scope1)}
              </strong>
              <small>tCO₂e</small>
            </div>

            <div>
              <span>Scope 2</span>
              <strong>
                {formatNumber(selectedProject.scope2)}
              </strong>
              <small>tCO₂e</small>
            </div>

            <div>
              <span>Scope 3</span>
              <strong>
                {formatNumber(selectedProject.scope3)}
              </strong>
              <small>tCO₂e</small>
            </div>

            <div className="selected-total">
              <span>Project Total</span>
              <strong>{formatNumber(selectedTotal)}</strong>
              <small>tCO₂e</small>
            </div>
          </div>
        </div>

        <div className="aggregation-control-card">
          <div className="aggregation-control-icon">
            ✓
          </div>

          <div>
            <span className="aggregation-card-label">
              DOUBLE-COUNTING CONTROL
            </span>

            <h3>Source records are consolidated once.</h3>

            <p>
              Group totals are derived from project-level source records.
              Dashboard totals are not used as calculation inputs.
            </p>
          </div>

          <div className="aggregation-checks">
            <span>✓ Unique activity source</span>
            <span>✓ Scope separated</span>
            <span>✓ Validation tracked</span>
            <span>✓ Hierarchy preserved</span>
          </div>
        </div>
      </section>

      {/* LINEAGE */}
      <section className="aggregation-lineage">
        <div>
          <span>AGGREGATION LINEAGE</span>

          <h3>
            Every group-level number remains traceable to its source.
          </h3>

          <p>
            Project activity records are the calculation source. Their
            validated Scope 1, Scope 2 and Scope 3 results roll upward
            without replacing the underlying records.
          </p>
        </div>

        <div className="aggregation-lineage-flow">
          <span>Activity</span>
          <b>→</b>
          <span>Project</span>
          <b>→</b>
          <span>Business Unit</span>
          <b>→</b>
          <span>Subsidiary</span>
          <b>→</b>
          <span>Group</span>
          <b>→</b>
          <span>BRSR</span>
        </div>
      </section>

      {/* DEMO */}
      <div className="aggregation-demo-note">
        <strong>Frontend Demonstration Mode</strong>

        <span>
          Consolidation values are simulated from ESGForge demo activity
          records. Production aggregation should calculate from approved
          stored source records and maintain organization, reporting period,
          scope and hierarchy identifiers.
        </span>
      </div>
    </div>
  );
}

export default Aggregation;