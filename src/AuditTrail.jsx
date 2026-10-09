import React, { useMemo, useState } from "react";
import "./AuditTrail.css";

const AUDIT_EVENTS = [
  {
    id: "AUD-001",
    type: "ACTIVITY",
    action: "Activity Created",
    entity: "S1-001",
    entityName: "Diesel Consumption",
    scope: "Scope 1",
    user: "Bidyamanjari Jena",
    role: "Data Owner",
    timestamp: "31 Mar 2026, 09:42 AM",
    status: "COMPLETED",
    description:
      "Project-level diesel consumption activity was created for the FY 2025–26 reporting period.",
    previousValue: "Not available",
    newValue: "2,500 L",
    related: "Alpha Infrastructure Project",
  },
  {
    id: "AUD-002",
    type: "EVIDENCE",
    action: "Evidence Linked",
    entity: "EV-001",
    entityName: "diesel_invoice_april.pdf",
    scope: "Scope 1",
    user: "Bidyamanjari Jena",
    role: "Data Owner",
    timestamp: "31 Mar 2026, 09:48 AM",
    status: "COMPLETED",
    description:
      "Fuel invoice evidence was linked to the diesel consumption activity.",
    previousValue: "No evidence",
    newValue: "EV-001 · VERIFIED",
    related: "S1-001 · Diesel Consumption",
  },
  {
    id: "AUD-003",
    type: "CALCULATION",
    action: "CO₂e Calculation Generated",
    entity: "CAL-001",
    entityName: "Diesel Consumption",
    scope: "Scope 1",
    user: "ESGForge Calculation Engine",
    role: "System",
    timestamp: "31 Mar 2026, 09:51 AM",
    status: "COMPLETED",
    description:
      "Emission calculation was generated using the selected demonstration emission factor.",
    previousValue: "Not calculated",
    newValue: "6.70 tCO₂e",
    related: "EF-001 · Demo Emission Factor",
  },
  {
    id: "AUD-004",
    type: "VALIDATION",
    action: "Validation Passed",
    entity: "S1-001",
    entityName: "Diesel Consumption",
    scope: "Scope 1",
    user: "Priya Sharma",
    role: "Validator",
    timestamp: "31 Mar 2026, 10:06 AM",
    status: "COMPLETED",
    description:
      "Activity data, unit, evidence linkage and calculation checks passed validation.",
    previousValue: "PENDING",
    newValue: "VALID",
    related: "CAL-001 · 6.70 tCO₂e",
  },
  {
    id: "AUD-005",
    type: "APPROVAL",
    action: "Activity Approved",
    entity: "S1-001",
    entityName: "Diesel Consumption",
    scope: "Scope 1",
    user: "Rakesh Kumar",
    role: "Reviewer",
    timestamp: "31 Mar 2026, 10:22 AM",
    status: "APPROVED",
    description:
      "Validated activity was approved for inclusion in the reporting workflow.",
    previousValue: "PENDING",
    newValue: "APPROVED",
    related: "S1-001 · Diesel Consumption",
  },
  {
    id: "AUD-006",
    type: "ACTIVITY",
    action: "Activity Created",
    entity: "S2-001",
    entityName: "Purchased Electricity",
    scope: "Scope 2",
    user: "Bidyamanjari Jena",
    role: "Data Owner",
    timestamp: "31 Mar 2026, 11:04 AM",
    status: "COMPLETED",
    description:
      "Purchased electricity activity was added for the reporting period.",
    previousValue: "Not available",
    newValue: "125,000 kWh",
    related: "Alpha Infrastructure Project",
  },
  {
    id: "AUD-007",
    type: "CALCULATION",
    action: "CO₂e Calculation Generated",
    entity: "CAL-003",
    entityName: "Purchased Electricity",
    scope: "Scope 2",
    user: "ESGForge Calculation Engine",
    role: "System",
    timestamp: "31 Mar 2026, 11:12 AM",
    status: "COMPLETED",
    description:
      "Scope 2 emissions were calculated using the selected demonstration electricity factor.",
    previousValue: "Not calculated",
    newValue: "90.00 tCO₂e",
    related: "EF-003 · Demo Emission Factor",
  },
  {
    id: "AUD-008",
    type: "VALIDATION",
    action: "Validation Passed",
    entity: "S2-001",
    entityName: "Purchased Electricity",
    scope: "Scope 2",
    user: "Priya Sharma",
    role: "Validator",
    timestamp: "31 Mar 2026, 11:25 AM",
    status: "COMPLETED",
    description:
      "Electricity activity passed data quality and calculation validation checks.",
    previousValue: "PENDING",
    newValue: "VALID",
    related: "CAL-003 · 90.00 tCO₂e",
  },
  {
    id: "AUD-009",
    type: "EVIDENCE",
    action: "Evidence Marked Pending",
    entity: "EV-004",
    entityName: "electricity_bill_february.pdf",
    scope: "Scope 2",
    user: "Priya Sharma",
    role: "Validator",
    timestamp: "31 Mar 2026, 11:38 AM",
    status: "REVIEW",
    description:
      "Evidence was retained in the register but requires reviewer confirmation before final approval.",
    previousValue: "VERIFIED",
    newValue: "PENDING",
    related: "S2-002 · Purchased Electricity",
  },
  {
    id: "AUD-010",
    type: "ACTIVITY",
    action: "Activity Created",
    entity: "S3-001",
    entityName: "Upstream Material Transportation",
    scope: "Scope 3",
    user: "Bidyamanjari Jena",
    role: "Data Owner",
    timestamp: "31 Mar 2026, 01:10 PM",
    status: "COMPLETED",
    description:
      "Upstream transportation activity was added with quantity, distance and calculation context.",
    previousValue: "Not available",
    newValue: "336,000 tonne-km",
    related: "Alpha Infrastructure Project",
  },
  {
    id: "AUD-011",
    type: "CALCULATION",
    action: "CO₂e Calculation Generated",
    entity: "CAL-005",
    entityName: "Upstream Material Transportation",
    scope: "Scope 3",
    user: "ESGForge Calculation Engine",
    role: "System",
    timestamp: "31 Mar 2026, 01:19 PM",
    status: "COMPLETED",
    description:
      "Scope 3 transportation emissions were calculated using the selected demonstration factor.",
    previousValue: "Not calculated",
    newValue: "35.28 tCO₂e",
    related: "EF-005 · Demo Emission Factor",
  },
  {
    id: "AUD-012",
    type: "VALIDATION",
    action: "Validation Passed",
    entity: "S3-001",
    entityName: "Upstream Material Transportation",
    scope: "Scope 3",
    user: "Priya Sharma",
    role: "Validator",
    timestamp: "31 Mar 2026, 01:31 PM",
    status: "COMPLETED",
    description:
      "Transportation activity passed validation and is ready for reviewer approval.",
    previousValue: "PENDING",
    newValue: "VALID",
    related: "CAL-005 · 35.28 tCO₂e",
  },
  {
    id: "AUD-013",
    type: "REPORT",
    action: "BRSR Section C Report Generated",
    entity: "RPT-001",
    entityName: "BRSR Section C",
    scope: "All Scopes",
    user: "Rakesh Kumar",
    role: "Reviewer",
    timestamp: "31 Mar 2026, 03:45 PM",
    status: "GENERATED",
    description:
      "Frontend demonstration report was generated from the current validated reporting dataset.",
    previousValue: "Not generated",
    newValue: "Draft Ready",
    related: "Reports · BRSR Section C",
  },
];

const TYPE_CONFIG = {
  ACTIVITY: {
    label: "Activity",
    icon: "＋",
    className: "activity",
  },
  EVIDENCE: {
    label: "Evidence",
    icon: "▧",
    className: "evidence",
  },
  CALCULATION: {
    label: "Calculation",
    icon: "∑",
    className: "calculation",
  },
  VALIDATION: {
    label: "Validation",
    icon: "✓",
    className: "validation",
  },
  APPROVAL: {
    label: "Approval",
    icon: "◆",
    className: "approval",
  },
  REPORT: {
    label: "Report",
    icon: "▤",
    className: "report",
  },
};

function AuditTrail({ user, setActivePage }) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return AUDIT_EVENTS.filter((event) => {
      const matchesFilter =
        activeFilter === "ALL" || event.type === activeFilter;

      const matchesSearch =
        !query ||
        event.id.toLowerCase().includes(query) ||
        event.action.toLowerCase().includes(query) ||
        event.entity.toLowerCase().includes(query) ||
        event.entityName.toLowerCase().includes(query) ||
        event.user.toLowerCase().includes(query) ||
        event.scope.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const statistics = {
    total: AUDIT_EVENTS.length,
    completed: AUDIT_EVENTS.filter(
      (event) =>
        event.status === "COMPLETED" ||
        event.status === "APPROVED" ||
        event.status === "GENERATED"
    ).length,
    validation: AUDIT_EVENTS.filter(
      (event) => event.type === "VALIDATION"
    ).length,
    approvals: AUDIT_EVENTS.filter(
      (event) => event.type === "APPROVAL"
    ).length,
  };

  const handleTrace = (event) => {
    if (setActivePage) {
      setActivePage("traceability");
    }
  };

  return (
    <div className="audit-page">
      <section className="audit-hero">
        <div className="audit-hero-copy">
          <div className="audit-eyebrow">
            <span>◉</span>
            Governance & Audit
          </div>

          <h1>Audit Trail</h1>

          <p>
            A chronological record of important ESGForge actions, showing
            who changed what, when it happened, and how the record connects
            to the reporting lineage.
          </p>

          <div className="audit-hero-tags">
            <span>Frontend Demo</span>
            <span>Immutable-style History</span>
            <span>Record Lineage</span>
          </div>
        </div>

        <div className="audit-hero-card">
          <div className="audit-hero-card-label">AUDIT COVERAGE</div>
          <div className="audit-hero-card-value">100%</div>
          <div className="audit-hero-card-text">
            Key demonstration workflow events captured
          </div>

          <div className="audit-mini-line">
            <span>Activity</span>
            <strong>3</strong>
          </div>
          <div className="audit-mini-line">
            <span>Validation</span>
            <strong>3</strong>
          </div>
          <div className="audit-mini-line">
            <span>Evidence</span>
            <strong>2</strong>
          </div>
          <div className="audit-mini-line">
            <span>Approval</span>
            <strong>1</strong>
          </div>
        </div>
      </section>

      <div className="audit-demo-banner">
        <div className="audit-demo-icon">i</div>
        <div>
          <strong>Frontend demonstration audit log</strong>
          <p>
            These records are simulated workflow events for the ESGForge
            demonstration and do not represent real MEIL audit records.
          </p>
        </div>
      </div>

      <section className="audit-stats">
        <div className="audit-stat-card">
          <div className="audit-stat-icon">◉</div>
          <div>
            <span>Total Events</span>
            <strong>{statistics.total}</strong>
            <small>Recorded workflow actions</small>
          </div>
        </div>

        <div className="audit-stat-card">
          <div className="audit-stat-icon success">✓</div>
          <div>
            <span>Completed</span>
            <strong>{statistics.completed}</strong>
            <small>Successfully processed events</small>
          </div>
        </div>

        <div className="audit-stat-card">
          <div className="audit-stat-icon validation">✓</div>
          <div>
            <span>Validations</span>
            <strong>{statistics.validation}</strong>
            <small>Validation decisions recorded</small>
          </div>
        </div>

        <div className="audit-stat-card">
          <div className="audit-stat-icon approval">◆</div>
          <div>
            <span>Approvals</span>
            <strong>{statistics.approvals}</strong>
            <small>Reviewer decisions recorded</small>
          </div>
        </div>
      </section>

      <section className="audit-workspace">
        <div className="audit-section-heading">
          <div>
            <span className="audit-section-kicker">EVENT REGISTER</span>
            <h2>Workflow History</h2>
            <p>
              Follow the reporting lifecycle from activity creation through
              validation, approval and BRSR reporting.
            </p>
          </div>

          <div className="audit-user-chip">
            <span className="audit-user-avatar">
              {(user?.name || "B").charAt(0).toUpperCase()}
            </span>
            <div>
              <strong>{user?.name || "Demo Reviewer"}</strong>
              <small>Current session</small>
            </div>
          </div>
        </div>

        <div className="audit-controls">
          <div className="audit-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search event, activity, user or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="audit-filter-row">
            {[
              ["ALL", "All Events"],
              ["ACTIVITY", "Activity"],
              ["EVIDENCE", "Evidence"],
              ["CALCULATION", "Calculation"],
              ["VALIDATION", "Validation"],
              ["APPROVAL", "Approval"],
              ["REPORT", "Report"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={`audit-filter ${
                  activeFilter === value ? "active" : ""
                }`}
                onClick={() => setActiveFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="audit-content-grid">
          <div className="audit-timeline">
            {filteredEvents.length === 0 ? (
              <div className="audit-empty">
                <div>⌕</div>
                <h3>No audit events found</h3>
                <p>Try changing the search text or selected filter.</p>
              </div>
            ) : (
              filteredEvents.map((event, index) => {
                const config = TYPE_CONFIG[event.type];

                return (
                  <div className="audit-event" key={event.id}>
                    <div className="audit-event-rail">
                      <div
                        className={`audit-event-dot ${config.className}`}
                      >
                        {config.icon}
                      </div>

                      {index !== filteredEvents.length - 1 && (
                        <div className="audit-event-line" />
                      )}
                    </div>

                    <button
                      className={`audit-event-card ${
                        selectedEvent?.id === event.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="audit-event-top">
                        <div className="audit-event-title">
                          <span
                            className={`audit-type ${config.className}`}
                          >
                            {config.label}
                          </span>
                          <h3>{event.action}</h3>
                        </div>

                        <span
                          className={`audit-status ${event.status.toLowerCase()}`}
                        >
                          {event.status}
                        </span>
                      </div>

                      <div className="audit-event-meta">
                        <span>{event.id}</span>
                        <span>•</span>
                        <span>{event.timestamp}</span>
                        <span>•</span>
                        <span>{event.user}</span>
                      </div>

                      <p>{event.description}</p>

                      <div className="audit-event-footer">
                        <span>{event.scope}</span>
                        <span>{event.entity}</span>
                        <span>View details →</span>
                      </div>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <aside className="audit-detail-panel">
            {selectedEvent ? (
              <>
                <div className="audit-detail-header">
                  <div>
                    <span className="audit-section-kicker">
                      EVENT DETAILS
                    </span>
                    <h2>{selectedEvent.action}</h2>
                  </div>

                  <button
                    className="audit-close"
                    onClick={() => setSelectedEvent(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="audit-detail-status">
                  <span
                    className={`audit-type ${
                      TYPE_CONFIG[selectedEvent.type].className
                    }`}
                  >
                    {TYPE_CONFIG[selectedEvent.type].label}
                  </span>

                  <span
                    className={`audit-status ${selectedEvent.status.toLowerCase()}`}
                  >
                    {selectedEvent.status}
                  </span>
                </div>

                <div className="audit-detail-list">
                  <div>
                    <span>Event ID</span>
                    <strong>{selectedEvent.id}</strong>
                  </div>

                  <div>
                    <span>Entity</span>
                    <strong>
                      {selectedEvent.entity} · {selectedEvent.entityName}
                    </strong>
                  </div>

                  <div>
                    <span>Scope</span>
                    <strong>{selectedEvent.scope}</strong>
                  </div>

                  <div>
                    <span>Performed By</span>
                    <strong>{selectedEvent.user}</strong>
                  </div>

                  <div>
                    <span>Role</span>
                    <strong>{selectedEvent.role}</strong>
                  </div>

                  <div>
                    <span>Timestamp</span>
                    <strong>{selectedEvent.timestamp}</strong>
                  </div>
                </div>

                <div className="audit-change-box">
                  <div className="audit-change-heading">
                    <span>STATE CHANGE</span>
                  </div>

                  <div className="audit-change-values">
                    <div>
                      <small>Previous</small>
                      <strong>{selectedEvent.previousValue}</strong>
                    </div>

                    <span>→</span>

                    <div>
                      <small>Current</small>
                      <strong>{selectedEvent.newValue}</strong>
                    </div>
                  </div>
                </div>

                <div className="audit-related">
                  <span>RELATED RECORD</span>
                  <strong>{selectedEvent.related}</strong>
                </div>

                <div className="audit-detail-description">
                  <span>DESCRIPTION</span>
                  <p>{selectedEvent.description}</p>
                </div>

                <button
                  className="audit-trace-button"
                  onClick={() => handleTrace(selectedEvent)}
                >
                  Open Traceability
                  <span>→</span>
                </button>
              </>
            ) : (
              <div className="audit-detail-empty">
                <div className="audit-detail-empty-icon">⌁</div>
                <h3>Select an event</h3>
                <p>
                  Select any audit event to inspect its user, timestamp,
                  state change and related ESG record.
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="audit-governance">
        <div>
          <span className="audit-section-kicker">AUDIT PRINCIPLE</span>
          <h2>Every important reporting action should leave a trail.</h2>
          <p>
            ESGForge connects operational actions with the reporting lineage
            so reviewers can understand how a reported number was created,
            validated and approved.
          </p>
        </div>

        <div className="audit-governance-flow">
          <span>Activity</span>
          <b>→</b>
          <span>Evidence</span>
          <b>→</b>
          <span>Calculation</span>
          <b>→</b>
          <span>Validation</span>
          <b>→</b>
          <span>Approval</span>
          <b>→</b>
          <span>BRSR</span>
        </div>
      </section>
    </div>
  );
}

export default AuditTrail;