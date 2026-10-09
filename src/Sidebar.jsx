import React from "react";
import "./Sidebar.css";

function Sidebar({
  activePage,
  setActivePage,
  user,
  onLogout,
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "⌂" },
    { id: "organization", label: "Organization", icon: "▣" },
    { id: "data-entry", label: "Data Entry", icon: "✎" },
    { id: "data-upload", label: "Data Upload", icon: "↑" },
    { id: "validation", label: "Validation", icon: "✓" },
    { id: "kpi-results", label: "KPI Results", icon: "◈" },
    { id: "analytics", label: "Analytics", icon: "◔" },

    {
      id: "brsr-readiness",
      label: "BRSR Readiness",
      icon: "◎",
    },

    {
      id: "evidence",
      label: "Evidence",
      icon: "▧",
    },

    {
      id: "emission-factors",
      label: "Emission Factors",
      icon: "ƒ",
    },

    // CO₂e Calculation Engine
    {
  id: "calculations",
  label: "Calculations",
  icon: "∑",
},

{
  id: "aggregation",
  label: "Aggregation",
  icon: "▥",
},

    {
      id: "data-passport",
      label: "Data Passport",
      icon: "▤",
    },
    { id: "audit-trail", label: "Audit Trail", icon: "◌" },

    {
      id: "traceability",
      label: "Traceability",
      icon: "⌘",
    },

    {
      id: "reports",
      label: "Reports",
      icon: "▤",
    },
  ];

  const handleMenuClick = (pageId) => {
    console.log("Sidebar navigation:", pageId);
    setActivePage(pageId);
  };

  return (
    <aside className="sidebar">

      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">E</div>

        <div>
          <h2>ESGForge</h2>
          <span>ESG Intelligence</span>
        </div>
      </div>

      {/* MAIN MENU */}
      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="sidebar-menu">

        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              activePage === item.id
                ? "sidebar-item active"
                : "sidebar-item"
            }
            onClick={() => handleMenuClick(item.id)}
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </button>
        ))}

      </nav>

      {/* USER + LOGOUT */}
      <div className="sidebar-bottom">

        <div className="sidebar-user">

          <div className="sidebar-user-avatar">
            {user?.role?.charAt(0) || "U"}
          </div>

          <div className="sidebar-user-info">
            <strong>
              {user?.role || "User"}
            </strong>

            <span>
              {user?.email || ""}
            </span>
          </div>

        </div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
        >
          <span className="sidebar-logout-icon">
            ↪
          </span>

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;