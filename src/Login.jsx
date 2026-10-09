import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");

  const roles = [
    {
      id: "group_admin",
      title: "Group Admin",
      description: "Manage group-level ESG reporting and users",
      icon: "◈",
    },
    {
      id: "subsidiary_management",
      title: "Subsidiary Management",
      description: "Manage subsidiary ESG data and reporting",
      icon: "▣",
    },
    {
      id: "project_contributor",
      title: "Project Contributor",
      description: "Submit and manage project ESG data",
      icon: "◉",
    },
    {
      id: "reviewer",
      title: "Reviewer",
      description: "Review and approve ESG submissions",
      icon: "✓",
    },
    {
      id: "auditor",
      title: "Auditor",
      description: "Audit ESG data, evidence and reports",
      icon: "⌕",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Frontend-only demo validation
    if (!email.trim() || !password.trim() || !selectedRole) {
      setError("Please enter your credentials and select a role.");
      return;
    }

    const role = roles.find((item) => item.id === selectedRole);

    // Create a local demo user
    const demoUser = {
      id: "demo-user",
      email: email.trim(),
      name: email
        .trim()
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      role: role.title,
      roleId: role.id,
      organization: "ESGForge Demo Organization",
      company: "ESGForge Manufacturing & Infrastructure",
      demo: true,
    };

    // Save login locally so refresh does not log the user out
    localStorage.setItem("esgforge_user", JSON.stringify(demoUser));

    // Send user to App.jsx
    onLogin(demoUser);
  };

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <div className="login-container">

        {/* LEFT BRANDING */}
        <div className="login-brand-panel">
          <div className="brand-logo">
            <span>ESG</span>
            <span>Forge</span>
          </div>

          <div className="brand-content">
            <p className="brand-tag">
              ESG INTELLIGENCE PLATFORM
            </p>

            <h1>
              Smarter ESG.
              <br />
              <span>Stronger Decisions.</span>
            </h1>

            <p className="brand-description">
              A unified platform for ESG data collection, validation,
              analytics, reporting and responsible decision-making.
            </p>
          </div>

          <div className="brand-footer">
            <span className="status-dot"></span>
            Frontend Demo Environment
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="login-form-panel">
          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to ESGForge</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="form-group">
              <label>Email or Username</label>

              <input
                type="text"
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* ROLE */}
            <div className="role-heading">
              <div>
                <label>Select your role</label>
                <p>Choose your ESGForge workspace</p>
              </div>
            </div>

            <div className="role-grid">
              {roles.map((role) => (
                <button
                  type="button"
                  key={role.id}
                  className={`role-card ${
                    selectedRole === role.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="role-icon">
                    {role.icon}
                  </div>

                  <div className="role-info">
                    <h3>{role.title}</h3>
                    <p>{role.description}</p>
                  </div>

                  <div className="role-radio">
                    {selectedRole === role.id ? "✓" : ""}
                  </div>
                </button>
              ))}
            </div>

            {/* ERROR */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* LOGIN */}
            <button
              type="submit"
              className="login-button"
            >
              Continue to ESGForge
              <span>→</span>
            </button>

          </form>

          <div className="login-security">
            <span>🔒</span>
            Frontend demonstration environment
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;