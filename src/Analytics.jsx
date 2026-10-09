import React, { useMemo, useState } from "react";
import "./Analytics.css";

const ANALYTICS_DATA = {
  organization: "ESGForge Demo Organization",
  company: "ESGForge Manufacturing & Infrastructure",
  reportingYear: "2025–26",
  previousYear: "2024–25",
  readiness: 82,

  emissions: {
    scope1: 11.66,
    scope2: 150.84,
    scope3: 70.98,
    total: 233.48,
  },

  previousEmissions: {
    scope1: 10.42,
    scope2: 136.25,
    scope3: 76.41,
    total: 223.08,
  },

  kpis: [
    {
      name: "Total GHG Emissions",
      current: 233.48,
      previous: 223.08,
      unit: "tCO₂e",
      status: "ATTENTION",
      category: "Emissions",
    },
    {
      name: "Renewable Energy Share",
      current: 34.22,
      previous: 36.38,
      unit: "%",
      status: "REVIEW",
      category: "Energy",
    },
    {
      name: "Water Recycling",
      current: 24.66,
      previous: 25.20,
      unit: "%",
      status: "REVIEW",
      category: "Water",
    },
    {
      name: "Waste Recycling",
      current: 39.45,
      previous: 41.89,
      unit: "%",
      status: "REVIEW",
      category: "Waste",
    },
    {
      name: "Female Workforce",
      current: 21.81,
      previous: 20.10,
      unit: "%",
      status: "IMPROVING",
      category: "Social",
    },
    {
      name: "Training Coverage",
      current: 78.40,
      previous: 74.60,
      unit: "%",
      status: "IMPROVING",
      category: "Social",
    },
    {
      name: "Grievance Resolution",
      current: 92.00,
      previous: 88.00,
      unit: "%",
      status: "IMPROVING",
      category: "Social",
    },
  ],

  readinessSections: [
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

  activities: [
    {
      id: "S1-001",
      scope: "Scope 1",
      activity: "Diesel Consumption",
      quantity: 2500,
      unit: "L",
      emissions: 6.70,
      status: "VALID",
    },
    {
      id: "S1-002",
      scope: "Scope 1",
      activity: "Diesel Generator",
      quantity: 1850,
      unit: "L",
      emissions: 4.96,
      status: "VALID",
    },
    {
      id: "S2-001",
      scope: "Scope 2",
      activity: "Purchased Electricity",
      quantity: 125000,
      unit: "kWh",
      emissions: 90.00,
      status: "VALID",
    },
    {
      id: "S2-002",
      scope: "Scope 2",
      activity: "Purchased Electricity",
      quantity: 84500,
      unit: "kWh",
      emissions: 60.84,
      status: "REVIEW",
    },
    {
      id: "S3-001",
      scope: "Scope 3",
      activity: "Upstream Material Transportation",
      quantity: 800,
      unit: "tonnes",
      emissions: 35.28,
      status: "VALID",
    },
    {
      id: "S3-002",
      scope: "Scope 3",
      activity: "Waste Generated",
      quantity: 420,
      unit: "tonnes",
      emissions: 35.70,
      status: "REVIEW",
    },
  ],
};

const STATUS_CONFIG = {
  IMPROVING: {
    label: "Improving",
    className: "improving",
  },
  STABLE: {
    label: "Stable",
    className: "stable",
  },
  REVIEW: {
    label: "Review",
    className: "review",
  },
  ATTENTION: {
    label: "Needs Attention",
    className: "attention",
  },
  READY: {
    label: "Ready",
    className: "ready",
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: "stable",
  };

  return (
    <span className={`analytics-status ${config.className}`}>
      <span className="analytics-status-dot" />
      {config.label}
    </span>
  );
}

function MetricCard({ label, value, unit, change, changeLabel, tone }) {
  return (
    <div className={`analytics-metric-card ${tone || ""}`}>
      <div className="analytics-metric-top">
        <span>{label}</span>
        <span className="analytics-metric-icon">◆</span>
      </div>

      <div className="analytics-metric-value">
        {value}
        {unit && <small>{unit}</small>}
      </div>

      {change !== undefined && (
        <div className={`analytics-change ${change < 0 ? "negative" : "positive"}`}>
          <strong>{change > 0 ? "+" : ""}
            {change.toFixed(1)}%
          </strong>
          <span>{changeLabel}</span>
        </div>
      )}
    </div>
  );
}

function ScopeBar({ label, value, total, tone }) {
  const percentage = total ? (value / total) * 100 : 0;

  return (
    <div className="scope-bar-row">
      <div className="scope-bar-label">
        <div>
          <span className={`scope-dot ${tone}`} />
          <strong>{label}</strong>
        </div>
        <span>{value.toFixed(2)} tCO₂e</span>
      </div>

      <div className="scope-bar-track">
        <div
          className={`scope-bar-fill ${tone}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="scope-bar-percent">
        {percentage.toFixed(1)}%
      </span>
    </div>
  );
}

function Analytics() {
  const [scopeFilter, setScopeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const data = ANALYTICS_DATA;

  const totalChange =
    ((data.emissions.total - data.previousEmissions.total) /
      data.previousEmissions.total) *
    100;

  const scope1Change =
    ((data.emissions.scope1 - data.previousEmissions.scope1) /
      data.previousEmissions.scope1) *
    100;

  const scope2Change =
    ((data.emissions.scope2 - data.previousEmissions.scope2) /
      data.previousEmissions.scope2) *
    100;

  const scope3Change =
    ((data.emissions.scope3 - data.previousEmissions.scope3) /
      data.previousEmissions.scope3) *
    100;

  const filteredKPIs = useMemo(() => {
    if (categoryFilter === "ALL") {
      return data.kpis;
    }

    return data.kpis.filter(
      (item) => item.category === categoryFilter
    );
  }, [categoryFilter, data.kpis]);

  const filteredActivities = useMemo(() => {
    if (scopeFilter === "ALL") {
      return data.activities;
    }

    return data.activities.filter(
      (item) => item.scope === scopeFilter
    );
  }, [scopeFilter, data.activities]);

  const improvingCount = data.kpis.filter(
    (item) => item.status === "IMPROVING"
  ).length;

  const reviewCount = data.kpis.filter(
    (item) => item.status === "REVIEW"
  ).length;

  const attentionCount = data.kpis.filter(
    (item) => item.status === "ATTENTION"
  ).length;

  return (
    <div className="analytics-page">

      {/* HERO */}
      <section className="analytics-hero">
        <div className="analytics-hero-content">
          <span className="analytics-eyebrow">
            ESG INTELLIGENCE & ANALYTICS
          </span>

          <h1>ESG Intelligence Center</h1>

          <p>
            Understand emissions, KPI performance, reporting readiness and
            areas requiring attention across the ESG reporting lifecycle.
          </p>

          <div className="analytics-context">
            <span>{data.company}</span>
            <b>•</b>
            <span>FY {data.reportingYear}</span>
            <b>•</b>
            <span>Annual Reporting</span>
          </div>
        </div>

        <div className="analytics-hero-score">
          <div className="analytics-score-ring">
            <div>
              <strong>{data.readiness}</strong>
              <span>/100</span>
            </div>
          </div>

          <span>Reporting Readiness</span>
          <small>Good standing</small>
        </div>
      </section>

      {/* KPI SUMMARY */}
      <section className="analytics-metrics">

        <MetricCard
          label="Total GHG Emissions"
          value={data.emissions.total.toFixed(2)}
          unit="tCO₂e"
          change={totalChange}
          changeLabel="vs previous year"
          tone="dark"
        />

        <MetricCard
          label="Scope 1"
          value={data.emissions.scope1.toFixed(2)}
          unit="tCO₂e"
          change={scope1Change}
          changeLabel="year-on-year"
          tone="scope-one"
        />

        <MetricCard
          label="Scope 2"
          value={data.emissions.scope2.toFixed(2)}
          unit="tCO₂e"
          change={scope2Change}
          changeLabel="year-on-year"
          tone="scope-two"
        />

        <MetricCard
          label="Scope 3"
          value={data.emissions.scope3.toFixed(2)}
          unit="tCO₂e"
          change={scope3Change}
          changeLabel="year-on-year"
          tone="scope-three"
        />

      </section>

      {/* INTELLIGENCE SIGNALS */}
      <section className="analytics-section">
        <div className="analytics-section-heading">
          <div>
            <span className="section-eyebrow">PERFORMANCE SIGNALS</span>
            <h2>What the data is telling you</h2>
          </div>

          <span className="section-helper">
            {data.reportingYear} intelligence
          </span>
        </div>

        <div className="intelligence-grid">

          <div className="intelligence-card improving-card">
            <div className="intelligence-icon">↗</div>
            <div>
              <span>Improving</span>
              <strong>{improvingCount}</strong>
              <p>
                KPIs are showing positive movement compared with the
                previous reporting year.
              </p>
            </div>
          </div>

          <div className="intelligence-card stable-card">
            <div className="intelligence-icon">→</div>
            <div>
              <span>Stable</span>
              <strong>2</strong>
              <p>
                Performance indicators remain broadly consistent with
                previous reporting.
              </p>
            </div>
          </div>

          <div className="intelligence-card review-card">
            <div className="intelligence-icon">!</div>
            <div>
              <span>Under Review</span>
              <strong>{reviewCount}</strong>
              <p>
                KPIs require supporting evidence, validation or reviewer
                attention.
              </p>
            </div>
          </div>

          <div className="intelligence-card attention-card">
            <div className="intelligence-icon">⚠</div>
            <div>
              <span>Needs Attention</span>
              <strong>{attentionCount}</strong>
              <p>
                Performance movement indicates a potential reporting
                or sustainability concern.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* EMISSIONS */}
      <section className="analytics-section">
        <div className="analytics-section-heading">
          <div>
            <span className="section-eyebrow">CARBON INTELLIGENCE</span>
            <h2>Emissions by Scope</h2>
          </div>

          <div className="year-comparison">
            <span className="comparison-dot current" />
            {data.reportingYear}
            <span className="comparison-dot previous" />
            {data.previousYear}
          </div>
        </div>

        <div className="emissions-grid">

          <div className="emissions-chart-card">
            <div className="chart-card-header">
              <div>
                <span>Total reported emissions</span>
                <h3>{data.emissions.total.toFixed(2)} tCO₂e</h3>
              </div>

              <StatusBadge status="ATTENTION" />
            </div>

            <div className="scope-bars">

              <ScopeBar
                label="Scope 1"
                value={data.emissions.scope1}
                total={data.emissions.total}
                tone="scope-one"
              />

              <ScopeBar
                label="Scope 2"
                value={data.emissions.scope2}
                total={data.emissions.total}
                tone="scope-two"
              />

              <ScopeBar
                label="Scope 3"
                value={data.emissions.scope3}
                total={data.emissions.total}
                tone="scope-three"
              />

            </div>

            <div className="emissions-insight">
              <span>Insight</span>
              <p>
                Scope 2 represents the largest share of reported emissions,
                making purchased electricity the most significant current
                emissions driver.
              </p>
            </div>
          </div>

          <div className="comparison-card">
            <div className="chart-card-header">
              <div>
                <span>Year-over-year comparison</span>
                <h3>Emission movement</h3>
              </div>
            </div>

            <div className="comparison-columns">

              <div className="comparison-column">
                <span>{data.previousYear}</span>
                <strong>
                  {data.previousEmissions.total.toFixed(2)}
                </strong>
                <small>tCO₂e</small>
              </div>

              <div className="comparison-arrow">
                →
              </div>

              <div className="comparison-column current-column">
                <span>{data.reportingYear}</span>
                <strong>
                  {data.emissions.total.toFixed(2)}
                </strong>
                <small>tCO₂e</small>
              </div>

            </div>

            <div className="overall-change">
              <strong>
                {totalChange > 0 ? "+" : ""}
                {totalChange.toFixed(1)}%
              </strong>

              <span>
                Overall emissions change compared with previous year
              </span>
            </div>

            <div className="scope-change-list">
              <div>
                <span>Scope 1</span>
                <strong>{scope1Change > 0 ? "+" : ""}{scope1Change.toFixed(1)}%</strong>
              </div>

              <div>
                <span>Scope 2</span>
                <strong>{scope2Change > 0 ? "+" : ""}{scope2Change.toFixed(1)}%</strong>
              </div>

              <div>
                <span>Scope 3</span>
                <strong>{scope3Change > 0 ? "+" : ""}{scope3Change.toFixed(1)}%</strong>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* KPI TABLE */}
      <section className="analytics-section">
        <div className="analytics-section-heading">
          <div>
            <span className="section-eyebrow">KPI INTELLIGENCE</span>
            <h2>KPI Performance</h2>
          </div>

          <select
            className="analytics-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Emissions">Emissions</option>
            <option value="Energy">Energy</option>
            <option value="Water">Water</option>
            <option value="Waste">Waste</option>
            <option value="Social">Social</option>
          </select>
        </div>

        <div className="kpi-table-card">
          <div className="kpi-table-header">
            <span>KPI</span>
            <span>Category</span>
            <span>Previous</span>
            <span>Current</span>
            <span>Change</span>
            <span>Status</span>
          </div>

          {filteredKPIs.map((item) => {
            const change =
              ((item.current - item.previous) /
                item.previous) *
              100;

            return (
              <div className="kpi-table-row" key={item.name}>

                <strong>{item.name}</strong>

                <span className="category-pill">
                  {item.category}
                </span>

                <span>
                  {item.previous.toFixed(2)} {item.unit}
                </span>

                <strong>
                  {item.current.toFixed(2)} {item.unit}
                </strong>

                <span className={change >= 0 ? "change-up" : "change-down"}>
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </span>

                <StatusBadge status={item.status} />

              </div>
            );
          })}
        </div>
      </section>

      {/* READINESS */}
      <section className="analytics-section">
        <div className="analytics-section-heading">
          <div>
            <span className="section-eyebrow">BRSR READINESS</span>
            <h2>Reporting Readiness by Section</h2>
          </div>
        </div>

        <div className="readiness-grid">

          {data.readinessSections.map((section) => (
            <div className="readiness-card" key={section.name}>

              <div className="readiness-card-top">
                <div>
                  <span>{section.name}</span>
                  <strong>{section.score}%</strong>
                </div>

                <StatusBadge status={section.status} />
              </div>

              <div className="readiness-track">
                <div
                  className="readiness-fill"
                  style={{ width: `${section.score}%` }}
                />
              </div>

              <div className="readiness-footer">
                <span>Readiness score</span>
                <span>
                  {section.score >= 85
                    ? "Strong"
                    : section.score >= 75
                    ? "Review"
                    : "Gap"}
                </span>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* ACTIVITY INTELLIGENCE */}
      <section className="analytics-section">

        <div className="analytics-section-heading">
          <div>
            <span className="section-eyebrow">ACTIVITY INTELLIGENCE</span>
            <h2>Activity-Level Emissions</h2>
          </div>

          <div className="scope-filters">
            {["ALL", "Scope 1", "Scope 2", "Scope 3"].map((scope) => (
              <button
                key={scope}
                className={scopeFilter === scope ? "active" : ""}
                onClick={() => setScopeFilter(scope)}
              >
                {scope === "ALL" ? "All" : scope.replace("Scope ", "S")}
              </button>
            ))}
          </div>
        </div>

        <div className="activity-table-card">

          <div className="activity-table-header">
            <span>ID</span>
            <span>Scope</span>
            <span>Activity</span>
            <span>Quantity</span>
            <span>CO₂e</span>
            <span>Status</span>
          </div>

          {filteredActivities.map((activity) => (
            <div className="activity-table-row" key={activity.id}>

              <strong className="activity-id">
                {activity.id}
              </strong>

              <span className={`scope-tag ${activity.scope.toLowerCase().replace(" ", "-")}`}>
                {activity.scope}
              </span>

              <span>{activity.activity}</span>

              <span>
                {activity.quantity.toLocaleString()} {activity.unit}
              </span>

              <strong>
                {activity.emissions.toFixed(2)} tCO₂e
              </strong>

              <StatusBadge
                status={
                  activity.status === "VALID"
                    ? "READY"
                    : "REVIEW"
                }
              />

            </div>
          ))}

        </div>
      </section>

      {/* INSIGHT FOOTER */}
      <section className="analytics-insight-banner">

        <div className="insight-banner-icon">
          ✦
        </div>

        <div>
          <span>ESGForge Intelligence</span>

          <h3>
            The biggest current opportunity is improving Scope 2
            performance and completing supporting evidence for review items.
          </h3>

          <p>
            Analytics connects activity data, calculated emissions,
            KPI performance and BRSR readiness into one decision layer.
          </p>
        </div>

      </section>

      <div className="analytics-demo-note">
        <strong>Frontend Demo Mode</strong>
        <span>
          Analytics shown here are generated from ESGForge demonstration
          data. No backend or live API is connected.
        </span>
      </div>

    </div>
  );
}

export default Analytics;