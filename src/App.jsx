import React, { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Organization from "./Organization";
import DataEntry from "./DataEntry";
import DataUpload from "./DataUpload";
import DataValidation from "./DataValidation";
import KPIResults from "./KPIResults";
import Analytics from "./Analytics";
import BRSRReadiness from "./BRSRReadiness";
import Evidence from "./Evidence";
import DataPassport from "./DataPassport";
import Traceability from "./Traceability";
import Reports from "./Reports";
import EmissionFactors from "./EmissionFactors";
import Aggregation from "./Aggregation";
import Calculations from "./Calculations";
import AuditTrail from "./AuditTrail";

import "./App.css";

function App() {
  /* =========================================================
     USER / AUTHENTICATION
  ========================================================= */

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("esgforge_user");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem("esgforge_user");
        return null;
      }
    }

    return null;
  });

  /* =========================================================
     ACTIVE PAGE
  ========================================================= */

  const [activePage, setActivePage] = useState(() => {
    const token = localStorage.getItem("esgforge_token");

    if (!token) {
      return "login";
    }

    return "dashboard";
  });

  /* =========================================================
     DASHBOARD REFRESH KEY
  ========================================================= */

  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);

  /* =========================================================
     AUTHENTICATION EXPIRY HANDLER
  ========================================================= */

  useEffect(() => {
    const handleAuthExpired = () => {
      localStorage.removeItem("esgforge_token");
      localStorage.removeItem("esgforge_user");
      localStorage.removeItem("esgforge_submission_id");
      localStorage.removeItem("esgforge_version_id");
      localStorage.removeItem("esgforge_validation_passed");
      localStorage.removeItem("esgforge_validated_submission_id");
      localStorage.removeItem("esgforge_validated_version_id");

      setUser(null);
      setActivePage("login");
    };

    window.addEventListener(
      "esgforge-auth-expired",
      handleAuthExpired
    );

    return () => {
      window.removeEventListener(
        "esgforge-auth-expired",
        handleAuthExpired
      );
    };
  }, []);

  /* =========================================================
     REFRESH DASHBOARD WHEN DATA CHANGES
  ========================================================= */

  useEffect(() => {
    const handleDashboardRefresh = () => {
      setDashboardRefreshKey((previous) => previous + 1);
    };

    window.addEventListener(
      "esgforge-dashboard-refresh",
      handleDashboardRefresh
    );

    return () => {
      window.removeEventListener(
        "esgforge-dashboard-refresh",
        handleDashboardRefresh
      );
    };
  }, []);

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);

    localStorage.setItem(
      "esgforge_user",
      JSON.stringify(loggedInUser)
    );

    setActivePage("dashboard");

    setDashboardRefreshKey((previous) => previous + 1);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("esgforge_token");
    localStorage.removeItem("esgforge_user");
    localStorage.removeItem("esgforge_submission_id");
    localStorage.removeItem("esgforge_version_id");
    localStorage.removeItem("esgforge_validation_passed");
    localStorage.removeItem("esgforge_validated_submission_id");
    localStorage.removeItem("esgforge_validated_version_id");

    setUser(null);
    setActivePage("login");
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleNavigation = (page) => {
    setActivePage(page);

    if (page === "dashboard") {
      setDashboardRefreshKey((previous) => previous + 1);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     LOGIN SCREEN
  ========================================================= */

  if (!user || activePage === "login") {
    return (
      <Login
        onLogin={handleLogin}
        setUser={setUser}
        setActivePage={setActivePage}
      />
    );
  }

  /* =========================================================
     DASHBOARD
  ========================================================= */

  if (activePage === "dashboard") {
    return (
      <div className="app">
        <Sidebar
          activePage={activePage}
          setActivePage={handleNavigation}
          user={user}
          onLogout={handleLogout}
        />

        <main className="main-container">
          <Dashboard
            key={dashboardRefreshKey}
            user={user}
            onNavigate={handleNavigation}
          />
        </main>
      </div>
    );
  }

  /* =========================================================
     OTHER PAGES
  ========================================================= */

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={handleNavigation}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-container">

        {/* =====================================================
            ORGANIZATION
        ===================================================== */}

        {activePage === "organization" && (
          <Organization
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            DATA ENTRY
        ===================================================== */}

        {activePage === "data-entry" && (
          <DataEntry
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            DATA UPLOAD
        ===================================================== */}

        {activePage === "data-upload" && (
          <DataUpload
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            DATA VALIDATION
        ===================================================== */}

        {activePage === "validation" && (
          <DataValidation
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            KPI RESULTS
        ===================================================== */}

        {activePage === "kpi-results" && (
          <KPIResults
            user={user}
            onNavigate={handleNavigation}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            ANALYTICS
        ===================================================== */}

        {activePage === "analytics" && (
          <Analytics
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            BRSR READINESS
        ===================================================== */}

        {activePage === "brsr-readiness" && (
          <BRSRReadiness
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            EVIDENCE MANAGEMENT
        ===================================================== */}

        {activePage === "evidence" && (
          <Evidence
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            EMISSION FACTORS
        ===================================================== */}

        {activePage === "emission-factors" && (
          <EmissionFactors
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            CALCULATIONS
        ===================================================== */}

        {activePage === "calculations" && (
          <Calculations
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            AGGREGATION
        ===================================================== */}

        {activePage === "aggregation" && (
          <Aggregation
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            DATA PASSPORT
        ===================================================== */}

        {activePage === "data-passport" && (
          <DataPassport
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            AUDIT TRAIL
        ===================================================== */}

        {activePage === "audit-trail" && (
          <AuditTrail
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            TRACEABILITY
        ===================================================== */}

        {activePage === "traceability" && (
          <Traceability
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            REPORTS
        ===================================================== */}

        {activePage === "reports" && (
          <Reports
            user={user}
            setActivePage={handleNavigation}
          />
        )}

        {/* =====================================================
            FALLBACK
        ===================================================== */}

        {![
          "organization",
          "data-entry",
          "data-upload",
          "validation",
          "kpi-results",
          "calculations",
          "analytics",
          "brsr-readiness",
          "evidence",
          "emission-factors",
          "aggregation",
          "data-passport",
          "audit-trail",
          "traceability",
          "reports",
        ].includes(activePage) && (
          <Dashboard
            key={dashboardRefreshKey}
            user={user}
            onNavigate={handleNavigation}
          />
        )}

      </main>
    </div>
  );
}

export default App;