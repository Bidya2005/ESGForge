import React, { useMemo, useState } from "react";
import "./DataEntry.css";

/* =========================================================
   DEMO DATA
   ========================================================= */

const INITIAL_ACTIVITIES = [
  {
    id: "S1-001",
    scope: "Scope 1",
    activity: "Diesel Consumption",
    project: "Alpha Infrastructure Project",
    quantity: 2500,
    unit: "L",
    source: "Fuel Invoice",
    evidence: "diesel_invoice_april.pdf",
    factor: 2.68,
    emissions: 6.7,
    status: "VALID",
  },
  {
    id: "S1-002",
    scope: "Scope 1",
    activity: "Diesel Generator",
    project: "Beta Energy Project",
    quantity: 1850,
    unit: "L",
    source: "Generator Log",
    evidence: "generator_log_q4.pdf",
    factor: 2.68,
    emissions: 4.96,
    status: "VALID",
  },
  {
    id: "S2-001",
    scope: "Scope 2",
    activity: "Purchased Electricity",
    project: "Alpha Infrastructure Project",
    quantity: 125000,
    unit: "kWh",
    source: "Electricity Bill",
    evidence: "electricity_bill_march.pdf",
    factor: 0.72,
    emissions: 90,
    status: "VALID",
  },
  {
    id: "S2-002",
    scope: "Scope 2",
    activity: "Purchased Electricity",
    project: "Beta Energy Project",
    quantity: 84500,
    unit: "kWh",
    source: "Electricity Bill",
    evidence: "electricity_bill_february.pdf",
    factor: 0.72,
    emissions: 60.84,
    status: "REVIEW",
  },
  {
    id: "S3-001",
    scope: "Scope 3",
    activity: "Upstream Transportation",
    project: "Gamma Water Project",
    quantity: 336000,
    unit: "tonne-km",
    source: "Supplier Document",
    evidence: "supplier_transport.pdf",
    factor: 0.105,
    emissions: 35.28,
    status: "VALID",
  },
  {
    id: "S3-002",
    scope: "Scope 3",
    activity: "Waste Generated",
    project: "Gamma Water Project",
    quantity: 420000,
    unit: "kg",
    source: "Waste Register",
    evidence: "waste_manifest_q4.pdf",
    factor: 0.085,
    emissions: 35.7,
    status: "REVIEW",
  },
];

/* =========================================================
   SCOPE CONFIGURATION
   ========================================================= */

const SCOPE_CONFIG = {
  "Scope 1": {
    short: "S1",
    title: "Direct Emissions",
    description: "Owned or controlled sources",
    color: "blue",
    activities: [
      "Stationary Combustion",
      "Mobile Combustion",
      "Process Emissions",
      "Fugitive Emissions",
    ],
  },

  "Scope 2": {
    short: "S2",
    title: "Purchased Energy",
    description: "Indirect energy emissions",
    color: "indigo",
    activities: [
      "Purchased Electricity",
      "Purchased Steam",
      "Purchased Heating",
      "Purchased Cooling",
    ],
  },

  "Scope 3": {
    short: "S3",
    title: "Value Chain",
    description: "Other indirect emissions",
    color: "violet",
    activities: [
      "Purchased Goods & Services",
      "Capital Goods",
      "Upstream Transportation",
      "Business Travel",
      "Employee Commuting",
      "Waste Generated",
      "Downstream Transportation",
    ],
  },
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
  PENDING: {
    label: "Pending",
    className: "status-pending",
  },
};

const UNIT_OPTIONS = [
  "L",
  "kWh",
  "kg",
  "tonne",
  "tonne-km",
  "GJ",
  "m³",
];

const DEFAULT_FORM = {
  project: "Alpha Infrastructure Project",
  activity: "Diesel Consumption",
  quantity: "",
  unit: "L",
  source: "",
  evidence: "",
  factor: "2.68",
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function DataEntry() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  const [selectedScope, setSelectedScope] = useState("Scope 1");

  const [form, setForm] = useState({
    ...DEFAULT_FORM,
  });

  const [search, setSearch] = useState("");
  const [filterScope, setFilterScope] = useState("All");

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const scope = SCOPE_CONFIG[selectedScope];

  /* =======================================================
     METRICS
     ======================================================= */

  const metrics = useMemo(() => {
    const totalEmissions = activities.reduce(
      (sum, item) => sum + Number(item.emissions || 0),
      0
    );

    const valid = activities.filter(
      (item) => item.status === "VALID"
    ).length;

    const review = activities.filter(
      (item) => item.status === "REVIEW"
    ).length;

    return {
      total: activities.length,
      valid,
      review,
      emissions: totalEmissions.toFixed(2),
    };
  }, [activities]);

  /* =======================================================
     FILTERED REGISTER
     ======================================================= */

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const matchesSearch =
        item.activity
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.project
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesScope =
        filterScope === "All" || item.scope === filterScope;

      return matchesSearch && matchesScope;
    });
  }, [activities, search, filterScope]);

  /* =======================================================
     FORM HANDLING
     ======================================================= */

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScopeChange = (newScope) => {
    setSelectedScope(newScope);

    const firstActivity =
      SCOPE_CONFIG[newScope].activities[0];

    let defaultFactor = "2.68";
    let defaultUnit = "L";

    if (newScope === "Scope 2") {
      defaultFactor = "0.72";
      defaultUnit = "kWh";
    }

    if (newScope === "Scope 3") {
      defaultFactor = "0.105";
      defaultUnit = "tonne-km";
    }

    setForm((prev) => ({
      ...prev,
      activity: firstActivity,
      quantity: "",
      unit: defaultUnit,
      factor: defaultFactor,
    }));
  };

  const calculateEmission = () => {
    const quantity = Number(form.quantity || 0);
    const factor = Number(form.factor || 0);

    return (quantity * factor) / 1000;
  };

  const handleSave = () => {
    if (!form.quantity || !form.activity) {
      return;
    }

    const emission = calculateEmission();

    const newActivity = {
      id: `${selectedScope === "Scope 1"
        ? "S1"
        : selectedScope === "Scope 2"
        ? "S2"
        : "S3"}-${String(activities.length + 1).padStart(3, "0")}`,

      scope: selectedScope,
      activity: form.activity,
      project: form.project,
      quantity: Number(form.quantity),
      unit: form.unit,
      source: form.source || "Demo Source",
      evidence: form.evidence || "Pending evidence",
      factor: Number(form.factor),
      emissions: Number(emission.toFixed(2)),
      status: "PENDING",
    };

    setActivities((prev) => [newActivity, ...prev]);

    setForm((prev) => ({
      ...prev,
      quantity: "",
      source: "",
      evidence: "",
    }));

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="data-entry-page">

      {/* ===================================================
          HERO
          =================================================== */}

      <section className="data-entry-hero">

        <div className="hero-main-content">

          <div className="data-entry-eyebrow">
            ESGFORGE · ACTIVITY DATA
          </div>

          <h1>Data Entry</h1>

          <p>
            Capture project-level Scope 1, Scope 2 and Scope 3
            activity data with evidence, emission factors and
            calculation context.
          </p>

          <div className="hero-tags">
            <span>Project Level</span>
            <span>Evidence Linked</span>
            <span>CO₂e Ready</span>
          </div>

        </div>

        <div className="data-entry-hero-context">

          <div className="context-status-dot"></div>

          <div>
            <span>Reporting Period</span>
            <strong>FY 2025–26</strong>
          </div>

          <div>
            <span>Company</span>
            <strong>ESGForge Manufacturing</strong>
          </div>

          <div>
            <span>Period</span>
            <strong>01 Apr 2025 – 31 Mar 2026</strong>
          </div>

        </div>

      </section>

      {/* ===================================================
          SUCCESS
          =================================================== */}

      {showSuccess && (
        <div className="data-entry-success">
          <span className="success-icon">✓</span>
          Activity saved successfully to the frontend demo register.
        </div>
      )}

      {/* ===================================================
          SNAPSHOT
          =================================================== */}

      <section className="entry-snapshot">

        <div className="snapshot-card">
          <div className="snapshot-icon blue">⌁</div>
          <div>
            <span>Activities</span>
            <strong>{metrics.total}</strong>
            <small>Recorded activities</small>
          </div>
        </div>

        <div className="snapshot-card">
          <div className="snapshot-icon green">✓</div>
          <div>
            <span>Validated</span>
            <strong>{metrics.valid}</strong>
            <small>Ready for approval</small>
          </div>
        </div>

        <div className="snapshot-card">
          <div className="snapshot-icon orange">!</div>
          <div>
            <span>Review</span>
            <strong>{metrics.review}</strong>
            <small>Need attention</small>
          </div>
        </div>

        <div className="snapshot-card">
          <div className="snapshot-icon purple">CO₂</div>
          <div>
            <span>CO₂e Captured</span>
            <strong>{metrics.emissions}</strong>
            <small>tCO₂e demo total</small>
          </div>
        </div>

      </section>

      {/* ===================================================
          REPORTING CONTEXT
          =================================================== */}

      <section className="reporting-context-card">

        <div className="section-heading">
          <div>
            <span className="section-kicker">STEP 01</span>
            <h2>Reporting Context</h2>
          </div>

          <span className="context-ready">
            ● Context Ready
          </span>
        </div>

        <div className="reporting-context-grid">

          <div className="context-box">
            <span>Group</span>
            <strong>MEIL Group</strong>
          </div>

          <div className="context-box">
            <span>Company</span>
            <strong>Megha Engineering & Infrastructures Ltd.</strong>
          </div>

          <div className="context-box">
            <span>Business Unit</span>
            <strong>Infrastructure</strong>
          </div>

          <div className="context-box">
            <span>Financial Year</span>
            <strong>2025–26</strong>
          </div>

        </div>

      </section>

      {/* ===================================================
          SCOPE SELECTOR
          =================================================== */}

      <section className="scope-section">

        <div className="section-heading">

          <div>
            <span className="section-kicker">STEP 02</span>
            <h2>Select Emission Scope</h2>
            <p>
              Choose the emission boundary before entering activity data.
            </p>
          </div>

        </div>

        <div className="scope-selector">

          {Object.entries(SCOPE_CONFIG).map(
            ([scopeName, config]) => {

              const isActive =
                selectedScope === scopeName;

              const count = activities.filter(
                (item) => item.scope === scopeName
              ).length;

              return (
                <button
                  key={scopeName}
                  type="button"
                  className={`scope-option ${config.color} ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() =>
                    handleScopeChange(scopeName)
                  }
                >

                  <div className="scope-option-top">

                    <div className="scope-number">
                      {config.short}
                    </div>

                    <div className="scope-check">
                      {isActive ? "✓" : ""}
                    </div>

                  </div>

                  <div className="scope-title">
                    {config.title}
                  </div>

                  <div className="scope-description">
                    {config.description}
                  </div>

                  <div className="scope-footer">
                    <span>
                      {count} activities
                    </span>

                    <span>
                      →
                    </span>
                  </div>

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* ===================================================
          ACTIVITY FORM
          =================================================== */}

      <section className="activity-entry-card">

        <div className="section-heading">

          <div>
            <span className="section-kicker">STEP 03</span>

            <h2>
              Enter {selectedScope} Activity
            </h2>

            <p>
              Record the activity quantity and supporting
              evidence for the selected emission scope.
            </p>
          </div>

          <div className={`active-scope-pill ${scope.color}`}>
            {scope.short} · {scope.title}
          </div>

        </div>

        {/* Activity type chips */}

        <div className="activity-types">

          {scope.activities.map((activity) => {

            const active =
              form.activity === activity;

            return (
              <button
                key={activity}
                type="button"
                className={`activity-chip ${
                  active ? "active" : ""
                }`}
                onClick={() =>
                  handleChange("activity", activity)
                }
              >
                {activity}
              </button>
            );
          })}

        </div>

        <div className="activity-form-grid">

          <div className="form-field">

            <label>Project</label>

            <select
              value={form.project}
              onChange={(e) =>
                handleChange(
                  "project",
                  e.target.value
                )
              }
            >
              <option>
                Alpha Infrastructure Project
              </option>

              <option>
                Beta Energy Project
              </option>

              <option>
                Gamma Water Project
              </option>

              <option>
                Delta Manufacturing Project
              </option>
            </select>

          </div>

          <div className="form-field">

            <label>Activity Type</label>

            <select
              value={form.activity}
              onChange={(e) =>
                handleChange(
                  "activity",
                  e.target.value
                )
              }
            >
              {scope.activities.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>

          <div className="form-field">

            <label>Activity Quantity</label>

            <input
              type="number"
              min="0"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={(e) =>
                handleChange(
                  "quantity",
                  e.target.value
                )
              }
            />

          </div>

          <div className="form-field">

            <label>Unit</label>

            <select
              value={form.unit}
              onChange={(e) =>
                handleChange(
                  "unit",
                  e.target.value
                )
              }
            >
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit}>
                  {unit}
                </option>
              ))}
            </select>

          </div>

          <div className="form-field">

            <label>Data Source</label>

            <input
              type="text"
              placeholder="e.g. Fuel Invoice"
              value={form.source}
              onChange={(e) =>
                handleChange(
                  "source",
                  e.target.value
                )
              }
            />

          </div>

          <div className="form-field">

            <label>Evidence</label>

            <input
              type="text"
              placeholder="e.g. invoice_april.pdf"
              value={form.evidence}
              onChange={(e) =>
                handleChange(
                  "evidence",
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* =================================================
            FACTOR + CALCULATION
            ================================================= */}

        <div className="factor-calculation-grid">

          <div className="factor-input-panel">

            <div className="panel-label">
              EMISSION FACTOR
            </div>

            <div className="factor-main">

              <div>
                <span>Demo Factor</span>
                <strong>
                  {form.factor}
                </strong>
              </div>

              <span className="factor-unit">
                kg CO₂e / {form.unit}
              </span>

            </div>

            <div className="factor-meta">

              <span>
                Source
              </span>

              <strong>
                Frontend Demo Reference
              </strong>

            </div>

            <div className="factor-meta">

              <span>
                Status
              </span>

              <strong className="factor-verified">
                ✓ Reference Selected
              </strong>

            </div>

          </div>

          <div className="calculation-preview">

            <div className="calculation-top">

              <div>
                <span className="panel-label">
                  CO₂e CALCULATION
                </span>

                <small>
                  Quantity × Emission Factor
                </small>
              </div>

              <div className="calculation-icon">
                CO₂
              </div>

            </div>

            <div className="calculation-equation">

              <span>
                {form.quantity || "0"}
              </span>

              <b>×</b>

              <span>
                {form.factor || "0"}
              </span>

              <b>=</b>

              <strong>
                {calculateEmission().toFixed(2)}
              </strong>

            </div>

            <div className="calculation-result-label">
              Estimated tCO₂e
            </div>

          </div>

        </div>

        {/* =================================================
            ACTIONS
            ================================================= */}

        <div className="activity-form-footer">

          <div className="form-note">
            Demo calculation — factor/source requires verification
            before production reporting.
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setForm(DEFAULT_FORM)
            }
          >
            Clear
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleSave}
          >
            Save Activity
          </button>

        </div>

      </section>

      {/* ===================================================
          ACTIVITY REGISTER
          =================================================== */}

      <section className="activity-register-card">

        <div className="section-heading">

          <div>
            <span className="section-kicker">STEP 04</span>

            <h2>Activity Register</h2>

            <p>
              Review all captured project-level emission activities.
            </p>
          </div>

          <div className="register-count">
            {filteredActivities.length} records
          </div>

        </div>

        <div className="register-toolbar">

          <div className="search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search activity, project or ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="filter-buttons">

            {["All", "Scope 1", "Scope 2", "Scope 3"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    filterScope === item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setFilterScope(item)
                  }
                >
                  {item === "All"
                    ? "All"
                    : item.replace("Scope ", "S")}
                </button>
              )
            )}

          </div>

        </div>

        <div className="activity-table-wrapper">

          <table className="activity-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Scope</th>
                <th>Activity</th>
                <th>Project</th>
                <th>Quantity</th>
                <th>CO₂e</th>
                <th>Status</th>
                <th></th>
              </tr>

            </thead>

            <tbody>

              {filteredActivities.map((item) => {

                const status =
                  STATUS_CONFIG[item.status] ||
                  STATUS_CONFIG.PENDING;

                return (
                  <tr key={item.id}>

                    <td>
                      <strong className="activity-id">
                        {item.id}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`scope-mini ${
                          item.scope === "Scope 1"
                            ? "s1"
                            : item.scope === "Scope 2"
                            ? "s2"
                            : "s3"
                        }`}
                      >
                        {item.scope.replace(
                          "Scope ",
                          "S"
                        )}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {item.activity}
                      </strong>

                      <small>
                        {item.source}
                      </small>
                    </td>

                    <td>
                      {item.project}
                    </td>

                    <td>
                      {item.quantity.toLocaleString()}{" "}
                      {item.unit}
                    </td>

                    <td>
                      <strong>
                        {item.emissions.toFixed(2)}
                      </strong>
                      <small>
                        tCO₂e
                      </small>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="trace-button"
                        onClick={() =>
                          setSelectedActivity(item)
                        }
                      >
                        Trace
                      </button>
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </section>

      {/* ===================================================
          DEMO NOTICE
          =================================================== */}

      <div className="data-entry-demo-note">

        <strong>Frontend Demo Environment</strong>

        <span>
          This page demonstrates the ESGForge activity-data workflow.
          Emission factors and calculated values are illustrative
          frontend demo values and should be verified against the
          approved factor library before real reporting.
        </span>

      </div>

      {/* ===================================================
          TRACE MODAL
          =================================================== */}

      {selectedActivity && (

        <div
          className="trace-overlay"
          onClick={() =>
            setSelectedActivity(null)
          }
        >

          <div
            className="trace-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="trace-modal-header">

              <div>
                <span className="section-kicker">
                  ACTIVITY TRACE
                </span>

                <h2>
                  {selectedActivity.id}
                </h2>

                <p>
                  {selectedActivity.activity}
                </p>
              </div>

              <button
                type="button"
                className="trace-modal-close"
                onClick={() =>
                  setSelectedActivity(null)
                }
              >
                ×
              </button>

            </div>

            <div className="trace-flow">

              <div>
                Activity
                <strong>
                  {selectedActivity.activity}
                </strong>
              </div>

              <span>→</span>

              <div>
                Evidence
                <strong>
                  {selectedActivity.evidence}
                </strong>
              </div>

              <span>→</span>

              <div>
                Factor
                <strong>
                  {selectedActivity.factor}
                </strong>
              </div>

              <span>→</span>

              <div>
                CO₂e
                <strong>
                  {selectedActivity.emissions.toFixed(2)}
                  {" "}t
                </strong>
              </div>

            </div>

            <div className="trace-grid">

              <div className="trace-item">
                <span>Scope</span>
                <strong>
                  {selectedActivity.scope}
                </strong>
              </div>

              <div className="trace-item">
                <span>Project</span>
                <strong>
                  {selectedActivity.project}
                </strong>
              </div>

              <div className="trace-item">
                <span>Quantity</span>
                <strong>
                  {selectedActivity.quantity.toLocaleString()}{" "}
                  {selectedActivity.unit}
                </strong>
              </div>

              <div className="trace-item">
                <span>Source</span>
                <strong>
                  {selectedActivity.source}
                </strong>
              </div>

              <div className="trace-item">
                <span>Evidence</span>
                <strong>
                  {selectedActivity.evidence}
                </strong>
              </div>

              <div className="trace-item">
                <span>Validation</span>
                <strong>
                  {selectedActivity.status}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}