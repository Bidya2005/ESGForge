import React, { useMemo, useState } from "react";
import "./Evidence.css";

const INITIAL_EVIDENCE = [
  {
    id: "EV-001",
    activityId: "S1-001",
    activity: "Diesel Consumption",
    scope: "Scope 1",
    type: "Fuel Invoice",
    file: "diesel_invoice_april.pdf",
    date: "12 Apr 2025",
    size: "1.8 MB",
    status: "VERIFIED",
    description: "Diesel purchase invoice for April 2025.",
    factor: "2.68 kg CO₂e/L",
    emissions: "6.70 tCO₂e",
  },
  {
    id: "EV-002",
    activityId: "S2-001",
    activity: "Purchased Electricity",
    scope: "Scope 2",
    type: "Electricity Bill",
    file: "electricity_bill_march.pdf",
    date: "05 Apr 2026",
    size: "2.4 MB",
    status: "VERIFIED",
    description: "Electricity consumption statement for reporting period.",
    factor: "0.72 kg CO₂e/kWh",
    emissions: "90.00 tCO₂e",
  },
  {
    id: "EV-003",
    activityId: "S3-001",
    activity: "Upstream Material Transportation",
    scope: "Scope 3",
    type: "Supplier Document",
    file: "supplier_transport.pdf",
    date: "18 Apr 2026",
    size: "3.1 MB",
    status: "VERIFIED",
    description: "Supplier transportation activity supporting document.",
    factor: "0.105 kg CO₂e/tonne-km",
    emissions: "35.28 tCO₂e",
  },
  {
    id: "EV-004",
    activityId: "S2-002",
    activity: "Purchased Electricity",
    scope: "Scope 2",
    type: "Electricity Bill",
    file: "electricity_bill_february.pdf",
    date: "08 Mar 2026",
    size: "1.9 MB",
    status: "PENDING",
    description: "Electricity bill awaiting reviewer confirmation.",
    factor: "0.72 kg CO₂e/kWh",
    emissions: "60.84 tCO₂e",
  },
  {
    id: "EV-005",
    activityId: "S3-002",
    activity: "Waste Generated",
    scope: "Scope 3",
    type: "Waste Manifest",
    file: "waste_manifest_q4.pdf",
    date: "22 Apr 2026",
    size: "2.2 MB",
    status: "MISSING",
    description: "Evidence reference created but supporting document is missing.",
    factor: "0.085 kg CO₂e/kg",
    emissions: "35.70 tCO₂e",
  },
];

const ACTIVITY_OPTIONS = [
  {
    id: "S1-001",
    name: "Diesel Consumption",
    scope: "Scope 1",
  },
  {
    id: "S1-002",
    name: "Diesel Generator",
    scope: "Scope 1",
  },
  {
    id: "S2-001",
    name: "Purchased Electricity",
    scope: "Scope 2",
  },
  {
    id: "S2-002",
    name: "Purchased Electricity",
    scope: "Scope 2",
  },
  {
    id: "S3-001",
    name: "Upstream Material Transportation",
    scope: "Scope 3",
  },
  {
    id: "S3-002",
    name: "Waste Generated",
    scope: "Scope 3",
  },
];

const STATUS_CONFIG = {
  VERIFIED: {
    label: "Verified",
    className: "verified",
  },
  PENDING: {
    label: "Pending Review",
    className: "pending",
  },
  MISSING: {
    label: "Missing",
    className: "missing",
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <span className={`evidence-status ${config.className}`}>
      <span className="status-dot" />
      {config.label}
    </span>
  );
}

function ScopeBadge({ scope }) {
  const scopeNumber = scope?.replace("Scope ", "");

  return (
    <span className={`scope-badge scope-${scopeNumber}`}>
      {scope}
    </span>
  );
}

function Evidence() {
  const [evidence, setEvidence] = useState(INITIAL_EVIDENCE);
  const [activeTab, setActiveTab] = useState("register");
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const [form, setForm] = useState({
    activityId: "",
    type: "Invoice",
    description: "",
    fileName: "",
  });

  const statistics = useMemo(() => {
    const total = evidence.length;
    const verified = evidence.filter(
      (item) => item.status === "VERIFIED"
    ).length;
    const pending = evidence.filter(
      (item) => item.status === "PENDING"
    ).length;
    const missing = evidence.filter(
      (item) => item.status === "MISSING"
    ).length;

    return {
      total,
      verified,
      pending,
      missing,
    };
  }, [evidence]);

  const filteredEvidence = useMemo(() => {
    return evidence.filter((item) => {
      const matchesScope =
        scopeFilter === "ALL" || item.scope === scopeFilter;

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        item.id.toLowerCase().includes(searchText) ||
        item.activity.toLowerCase().includes(searchText) ||
        item.file.toLowerCase().includes(searchText) ||
        item.type.toLowerCase().includes(searchText);

      return matchesScope && matchesStatus && matchesSearch;
    });
  }, [evidence, scopeFilter, statusFilter, search]);

  const handleFormChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    handleFormChange("fileName", file.name);
  };

  const handleAddEvidence = (event) => {
    event.preventDefault();

    if (!form.activityId) {
      alert("Please select an activity.");
      return;
    }

    if (!form.fileName) {
      alert("Please select an evidence file.");
      return;
    }

    const selectedActivity = ACTIVITY_OPTIONS.find(
      (activity) => activity.id === form.activityId
    );

    const newEvidence = {
      id: `EV-${String(evidence.length + 1).padStart(3, "0")}`,
      activityId: form.activityId,
      activity: selectedActivity?.name || "Activity",
      scope: selectedActivity?.scope || "Scope 1",
      type: form.type,
      file: form.fileName,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      size: "Local demo file",
      status: "PENDING",
      description:
        form.description || "Evidence uploaded through ESGForge.",
      factor: "Pending activity factor",
      emissions: "Pending calculation",
    };

    setEvidence((previous) => [newEvidence, ...previous]);

    setForm({
      activityId: "",
      type: "Invoice",
      description: "",
      fileName: "",
    });

    setActiveTab("register");

    alert("Evidence added successfully to the frontend demo.");
  };

  const handleVerify = (id) => {
    setEvidence((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "VERIFIED",
            }
          : item
      )
    );

    setSelectedEvidence((previous) =>
      previous
        ? {
            ...previous,
            status: "VERIFIED",
          }
        : previous
    );
  };

  const handleMarkMissing = (id) => {
    setEvidence((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "MISSING",
            }
          : item
      )
    );

    setSelectedEvidence((previous) =>
      previous
        ? {
            ...previous,
            status: "MISSING",
          }
        : previous
    );
  };

  const handleTrace = (item) => {
    setSelectedEvidence(item);
  };

  return (
    <main className="evidence-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="evidence-hero">

        <div>
          <div className="evidence-eyebrow">
            AUDIT-READY DATA FOUNDATION
          </div>

          <h1>Evidence Management</h1>

          <p>
            Capture, verify and trace supporting evidence behind
            every ESG activity and reported emission.
          </p>
        </div>

        <div className="evidence-hero-badge">
          <span>●</span>
          Frontend Demo Mode
        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="evidence-stats">

        <div className="evidence-stat-card">
          <div className="stat-icon blue">▧</div>

          <div>
            <span>Total Evidence</span>
            <strong>{statistics.total}</strong>
            <small>Evidence records</small>
          </div>
        </div>


        <div className="evidence-stat-card">
          <div className="stat-icon green">✓</div>

          <div>
            <span>Verified</span>
            <strong>{statistics.verified}</strong>
            <small>Audit-ready evidence</small>
          </div>
        </div>


        <div className="evidence-stat-card">
          <div className="stat-icon orange">◷</div>

          <div>
            <span>Pending Review</span>
            <strong>{statistics.pending}</strong>
            <small>Needs verification</small>
          </div>
        </div>


        <div className="evidence-stat-card">
          <div className="stat-icon red">!</div>

          <div>
            <span>Missing</span>
            <strong>{statistics.missing}</strong>
            <small>Evidence gaps</small>
          </div>
        </div>

      </section>


      {/* =====================================================
          WORKFLOW
      ===================================================== */}

      <section className="evidence-workflow">

        <div className="workflow-title">
          Evidence workflow
        </div>

        <div className="workflow-steps">

          <div className="workflow-step active">
            <span>01</span>
            <div>
              <strong>Activity</strong>
              <small>ESG activity recorded</small>
            </div>
          </div>

          <div className="workflow-arrow">→</div>

          <div className="workflow-step active">
            <span>02</span>
            <div>
              <strong>Evidence</strong>
              <small>Supporting document</small>
            </div>
          </div>

          <div className="workflow-arrow">→</div>

          <div className="workflow-step">
            <span>03</span>
            <div>
              <strong>Factor</strong>
              <small>Emission factor</small>
            </div>
          </div>

          <div className="workflow-arrow">→</div>

          <div className="workflow-step">
            <span>04</span>
            <div>
              <strong>Calculation</strong>
              <small>CO₂e result</small>
            </div>
          </div>

          <div className="workflow-arrow">→</div>

          <div className="workflow-step">
            <span>05</span>
            <div>
              <strong>Validation</strong>
              <small>Audit decision</small>
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          TABS
      ===================================================== */}

      <section className="evidence-tabs">

        <button
          className={activeTab === "register" ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          Evidence Register
        </button>

        <button
          className={activeTab === "upload" ? "active" : ""}
          onClick={() => setActiveTab("upload")}
        >
          + Add Evidence
        </button>

      </section>


      {/* =====================================================
          REGISTER
      ===================================================== */}

      {activeTab === "register" && (
        <section className="evidence-content">

          <div className="evidence-toolbar">

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search evidence, activity or file..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>


            <div className="filter-group">

              <select
                value={scopeFilter}
                onChange={(event) =>
                  setScopeFilter(event.target.value)
                }
              >
                <option value="ALL">All Scopes</option>
                <option value="Scope 1">Scope 1</option>
                <option value="Scope 2">Scope 2</option>
                <option value="Scope 3">Scope 3</option>
              </select>


              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="ALL">All Status</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="MISSING">Missing</option>
              </select>

            </div>

          </div>


          <div className="evidence-table-card">

            <div className="table-heading">

              <div>
                <h2>Evidence Register</h2>
                <p>
                  Supporting documents linked to ESG activities
                </p>
              </div>

              <span className="record-count">
                {filteredEvidence.length} records
              </span>

            </div>


            <div className="table-wrapper">

              <table className="evidence-table">

                <thead>
                  <tr>
                    <th>Evidence</th>
                    <th>Linked Activity</th>
                    <th>Scope</th>
                    <th>Type</th>
                    <th>Evidence File</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredEvidence.map((item) => (

                    <tr key={item.id}>

                      <td>
                        <div className="evidence-id">
                          <span className="file-icon">
                            PDF
                          </span>

                          <div>
                            <strong>{item.id}</strong>
                            <small>{item.date}</small>
                          </div>
                        </div>
                      </td>


                      <td>
                        <div className="activity-cell">
                          <strong>{item.activity}</strong>
                          <small>{item.activityId}</small>
                        </div>
                      </td>


                      <td>
                        <ScopeBadge scope={item.scope} />
                      </td>


                      <td>
                        <span className="type-text">
                          {item.type}
                        </span>
                      </td>


                      <td>
                        <div className="file-cell">
                          <span>▤</span>
                          <div>
                            <strong>{item.file}</strong>
                            <small>{item.size}</small>
                          </div>
                        </div>
                      </td>


                      <td>
                        <StatusBadge status={item.status} />
                      </td>


                      <td>
                        <button
                          className="trace-button"
                          onClick={() => handleTrace(item)}
                        >
                          Trace →
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>


              {filteredEvidence.length === 0 && (
                <div className="empty-state">
                  <div>⌕</div>
                  <h3>No evidence found</h3>
                  <p>
                    Try changing your search or filter.
                  </p>
                </div>
              )}

            </div>

          </div>

        </section>
      )}


      {/* =====================================================
          ADD EVIDENCE
      ===================================================== */}

      {activeTab === "upload" && (
        <section className="evidence-upload-layout">

          <form
            className="evidence-upload-card"
            onSubmit={handleAddEvidence}
          >

            <div className="card-header">
              <div>
                <h2>Add Supporting Evidence</h2>
                <p>
                  Link evidence directly to an ESG activity.
                </p>
              </div>

              <span className="local-badge">
                LOCAL DEMO
              </span>
            </div>


            <div className="form-grid">

              <div className="form-field full">
                <label>
                  Linked Activity
                </label>

                <select
                  value={form.activityId}
                  onChange={(event) =>
                    handleFormChange(
                      "activityId",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select an ESG activity
                  </option>

                  {ACTIVITY_OPTIONS.map((activity) => (
                    <option
                      key={activity.id}
                      value={activity.id}
                    >
                      {activity.id} — {activity.name} ({activity.scope})
                    </option>
                  ))}
                </select>
              </div>


              <div className="form-field">
                <label>
                  Evidence Type
                </label>

                <select
                  value={form.type}
                  onChange={(event) =>
                    handleFormChange(
                      "type",
                      event.target.value
                    )
                  }
                >
                  <option>Invoice</option>
                  <option>Electricity Bill</option>
                  <option>Supplier Document</option>
                  <option>Waste Manifest</option>
                  <option>Meter Reading</option>
                  <option>Contract</option>
                  <option>Other</option>
                </select>
              </div>


              <div className="form-field">
                <label>
                  Evidence File
                </label>

                <label className="file-input">

                  <span>↑</span>

                  <span>
                    {form.fileName ||
                      "Choose evidence file"}
                  </span>

                  <input
                    type="file"
                    onChange={handleFileChange}
                  />

                </label>
              </div>


              <div className="form-field full">

                <label>
                  Description
                </label>

                <textarea
                  rows="5"
                  placeholder="Describe what this evidence supports..."
                  value={form.description}
                  onChange={(event) =>
                    handleFormChange(
                      "description",
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            <div className="upload-info">

              <div className="info-icon">
                i
              </div>

              <div>
                <strong>
                  Why evidence matters
                </strong>

                <p>
                  Evidence provides audit-ready support for
                  every reported activity and enables
                  end-to-end traceability.
                </p>
              </div>

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setForm({
                    activityId: "",
                    type: "Invoice",
                    description: "",
                    fileName: "",
                  });
                }}
              >
                Clear
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Add Evidence →
              </button>

            </div>

          </form>


          {/* Evidence preview */}

          <div className="evidence-preview-card">

            <div className="preview-label">
              EVIDENCE PREVIEW
            </div>

            <div className="preview-document">

              <div className="preview-file-icon">
                PDF
              </div>

              <h3>
                {form.fileName || "No file selected"}
              </h3>

              <p>
                {form.description ||
                  "Your evidence information will appear here."}
              </p>

            </div>


            <div className="preview-checklist">

              <div>
                <span>✓</span>
                Activity linkage
              </div>

              <div>
                <span>✓</span>
                Evidence type
              </div>

              <div>
                <span>✓</span>
                File reference
              </div>

              <div>
                <span>✓</span>
                Audit trace
              </div>

            </div>

          </div>

        </section>
      )}


      {/* =====================================================
          TRACE MODAL
      ===================================================== */}

      {selectedEvidence && (
        <div
          className="evidence-modal-overlay"
          onClick={() => setSelectedEvidence(null)}
        >

          <div
            className="evidence-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <span>Evidence Trace</span>
                <h2>{selectedEvidence.id}</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedEvidence(null)}
              >
                ×
              </button>

            </div>


            <div className="modal-status-row">
              <StatusBadge status={selectedEvidence.status} />

              <span>
                {selectedEvidence.file}
              </span>
            </div>


            <div className="trace-line">

              <div className="trace-node">
                <span className="trace-number">01</span>

                <div>
                  <small>ACTIVITY</small>
                  <strong>
                    {selectedEvidence.activity}
                  </strong>
                  <span>
                    {selectedEvidence.activityId}
                  </span>
                </div>
              </div>


              <div className="trace-connector" />


              <div className="trace-node">
                <span className="trace-number">02</span>

                <div>
                  <small>EVIDENCE</small>
                  <strong>
                    {selectedEvidence.type}
                  </strong>
                  <span>
                    {selectedEvidence.file}
                  </span>
                </div>
              </div>


              <div className="trace-connector" />


              <div className="trace-node">
                <span className="trace-number">03</span>

                <div>
                  <small>EMISSION FACTOR</small>
                  <strong>
                    {selectedEvidence.factor}
                  </strong>
                  <span>
                    Demo reference factor
                  </span>
                </div>
              </div>


              <div className="trace-connector" />


              <div className="trace-node">
                <span className="trace-number">04</span>

                <div>
                  <small>CO₂e RESULT</small>
                  <strong>
                    {selectedEvidence.emissions}
                  </strong>
                  <span>
                    Calculation output
                  </span>
                </div>
              </div>

            </div>


            <div className="modal-description">

              <span>Description</span>

              <p>
                {selectedEvidence.description}
              </p>

            </div>


            <div className="modal-actions">

              {selectedEvidence.status !== "VERIFIED" && (
                <button
                  className="verify-button"
                  onClick={() =>
                    handleVerify(selectedEvidence.id)
                  }
                >
                  ✓ Verify Evidence
                </button>
              )}

              {selectedEvidence.status !== "MISSING" && (
                <button
                  className="missing-button"
                  onClick={() =>
                    handleMarkMissing(selectedEvidence.id)
                  }
                >
                  Mark Missing
                </button>
              )}

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default Evidence;