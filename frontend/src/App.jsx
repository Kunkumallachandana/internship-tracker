

import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const menu = [
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "applications", icon: "▤", label: "Applications" },
  { id: "companies", icon: "▥", label: "Companies" },
];

async function requestCompanies() {
  const response = await fetch(`${API_BASE_URL}/companies`);
  if (!response.ok) {
    throw new Error(`Backend returned an error while loading companies (${response.status}).`);
  }
  return response.json();
}

function getCompanyLoadError(err) {
  return err instanceof TypeError
    ? `Could not connect to the backend at ${API_BASE_URL}. Make sure Spring Boot is running.`
    : err.message;
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    website: "",
    location: "",
  });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeIsError, setNoticeIsError] = useState(false);

  function retryLoadingCompanies() {
    setLoading(true);
    setError("");
    requestCompanies()
      .then(setCompanies)
      .catch((err) => setError(getCompanyLoadError(err)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let active = true;
    requestCompanies()
      .then((data) => {
        if (active) setCompanies(data);
      })
      .catch((err) => {
        if (active) setError(getCompanyLoadError(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredCompanies = useMemo(() => {
    const term = search.toLowerCase();
    return companies.filter((company) =>
      `${company.name} ${company.location || ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [companies, search]);

  async function addCompany(event) {
    event.preventDefault();
    setSaving(true);
    setNotice("");

    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Company could not be saved (HTTP ${response.status}).`);
      }

      const savedCompany = await response.json();
      setCompanies((previous) => [...previous, savedCompany]);
      setForm({ name: "", website: "", location: "" });
      setShowForm(false);
      setNotice(`${savedCompany.name} was added successfully.`);
      setNoticeIsError(false);
    } catch (err) {
      setNotice(getCompanyLoadError(err));
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  const title = menu.find((item) => item.id === page)?.label || "Dashboard";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(e) => {
          e.preventDefault();
          setPage("dashboard");
        }}>
          <span className="brand-icon">I</span>
          <span>InternTrack<span className="brand-dot">.</span>
            <small>CAREER WORKSPACE</small>
          </span>
        </a>

        <div className="side-label">WORKSPACE</div>
        <nav className="navigation">
          {menu.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => {
                setPage(item.id);
                setNotice("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id === "companies" && (
                <span className="nav-count">{companies.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="tip-card">
            <div className="tip-symbol">✦</div>
            <strong>Small steps, big career.</strong>
            <p>Every application brings you closer to your next opportunity.</p>
          </div>
          <div className="profile">
            <div className="avatar">C</div>
            <div className="profile-text">
              <strong>My Workspace</strong>
              <span>Job seeker</span>
            </div>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{title}</strong>
          </div>
          <div className="topbar-right">
            <span className="connection-dot"></span>
            <span>Local workspace</span>
            <div className="top-avatar">C</div>
          </div>
        </header>

        <div className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">YOUR CAREER, ORGANIZED</div>
              <h1>
                {page === "dashboard"
                  ? "Good things are in progress."
                  : page === "applications"
                  ? "Your applications"
                  : "Your companies"}
              </h1>
              <p className="subtitle">
                {page === "dashboard"
                  ? "Keep every opportunity in one place and make your next move count."
                  : page === "applications"
                  ? "Track every application from submission to final decision."
                  : "Manage the companies you're interested in."}
              </p>
            </div>
            <button className="primary-button" onClick={() => {
              setPage("companies");
              setShowForm(true);
              setNotice("");
            }}>
              <span>＋</span> Add company
            </button>
          </div>

          {notice && (
            <div className={`notice ${noticeIsError ? "error-notice" : ""}`}>
              {notice}
            </div>
          )}
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={retryLoadingCompanies}>Retry</button>
            </div>
          )}

          {page === "dashboard" && (
            <>
              <section className="stats-grid">
                <StatCard
                  label="Companies"
                  value={loading ? "—" : companies.length}
                  note="Saved in your workspace"
                  icon="▥"
                  tone="purple"
                />
                <StatCard
                  label="Applications"
                  value="0"
                  note="Ready to start tracking"
                  icon="↗"
                  tone="blue"
                />
                <StatCard
                  label="Interviews"
                  value="0"
                  note="Your next big conversation"
                  icon="◷"
                  tone="orange"
                />
                <StatCard
                  label="Offers"
                  value="0"
                  note="Here's to good news"
                  icon="✧"
                  tone="green"
                />
              </section>

              <section className="content-grid">
                <div className="panel applications-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Recent applications</h2>
                      <p>Your latest career opportunities</p>
                    </div>
                    <button className="text-button" onClick={() => setPage("applications")}>
                      View all <span>→</span>
                    </button>
                  </div>

                  <div className="empty-state">
                    <div className="empty-illustration">
                      <span>↗</span>
                      <i></i>
                      <b></b>
                    </div>
                    <h3>Your next opportunity starts here</h3>
                    <p>
                      Add a company first. Then you can start recording roles,
                      deadlines, and application statuses.
                    </p>
                    <button className="secondary-button" onClick={() => {
                      setPage("companies");
                      setShowForm(true);
                    }}>
                      ＋ Add your first company
                    </button>
                  </div>
                </div>

                <div className="panel progress-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Application progress</h2>
                      <p>Your tracking overview</p>
                    </div>
                    <span className="mini-icon">↗</span>
                  </div>

                  <div className="progress-total">
                    <strong>0</strong>
                    <span>applications tracked</span>
                  </div>

                  <div className="progress-row">
                    <div><span className="legend applied"></span>Applied</div>
                    <strong>0</strong>
                  </div>
                  <div className="progress-track"><span className="bar-applied"></span></div>

                  <div className="progress-row">
                    <div><span className="legend interview"></span>Interview</div>
                    <strong>0</strong>
                  </div>
                  <div className="progress-track"><span className="bar-interview"></span></div>

                  <div className="progress-row">
                    <div><span className="legend offer"></span>Offer</div>
                    <strong>0</strong>
                  </div>
                  <div className="progress-track"><span className="bar-offer"></span></div>

                  <div className="progress-row">
                    <div><span className="legend rejected"></span>Rejected</div>
                    <strong>0</strong>
                  </div>
                  <div className="progress-track"><span className="bar-rejected"></span></div>

                  <div className="progress-footnote">
                    <span>✦</span> Your progress will appear here as you add applications.
                  </div>
                </div>
              </section>

              <section className="panel companies-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Companies you're tracking</h2>
                    <p>Your saved company list</p>
                  </div>
                  <button className="text-button" onClick={() => setPage("companies")}>
                    All companies <span>→</span>
                  </button>
                </div>
                <CompanyTable
                  companies={companies.slice(0, 4)}
                  loading={loading}
                  emptyText="No companies saved yet. Add your first company to get started."
                />
              </section>
            </>
          )}

          {page === "applications" && (
            <section className="panel companies-panel">
              <div className="panel-heading">
                <div>
                  <h2>Application tracker</h2>
                  <p>Your application records will appear here.</p>
                </div>
                <span className="coming-badge">NEXT MODULE</span>
              </div>
              <div className="empty-state compact">
                <div className="empty-illustration"><span>↗</span><i></i><b></b></div>
                <h3>Let's build your application tracker</h3>
                <p>
                  The company directory is connected to your backend.
                  Next we'll add job role, application date, deadline, status,
                  and notes to each application.
                </p>
                <button className="primary-button" onClick={() => setPage("companies")}>
                  Explore companies →
                </button>
              </div>
            </section>
          )}

          {page === "companies" && (
            <section className="panel companies-panel">
              <div className="panel-heading company-list-heading">
                <div>
                  <h2>Company directory</h2>
                  <p>{companies.length} saved {companies.length === 1 ? "company" : "companies"}</p>
                </div>
                <div className="company-actions">
                  <div className="search-box">
                    <span>⌕</span>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search companies..."
                    />
                  </div>
                  <button className="primary-button" onClick={() => setShowForm(!showForm)}>
                    ＋ Add company
                  </button>
                </div>
              </div>

              {showForm && (
                <form className="company-form" onSubmit={addCompany}>
                  <h3>Add a new company</h3>
                  <label>
                    Company name *
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Infosys"
                    />
                  </label>
                  <label>
                    Website
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </label>
                  <label>
                    Location
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Hyderabad"
                    />
                  </label>
                  <div className="form-actions">
                    <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="primary-button" disabled={saving}>
                      {saving ? "Saving..." : "Save company"}
                    </button>
                  </div>
                </form>
              )}

              <CompanyTable
                companies={filteredCompanies}
                loading={loading}
                emptyText={search ? "No matching companies found." : "No companies saved yet. Use Add company to create one."}
              />
            </section>
          )}

          <footer className="footer">
            <span>InternTrack <b>•</b> Your career, one step at a time.</span>
            <span>Built with React · Spring Boot · MySQL</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, note, icon, tone }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-icon ${tone}`}>{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-note"><span>✦</span> {note}</div>
    </article>
  );
}

function CompanyTable({ companies, loading, emptyText }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>COMPANY</th>
            <th>LOCATION</th>
            <th>WEBSITE</th>
            <th>COMPANY ID</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="4" className="table-message">Loading companies...</td></tr>
          ) : companies.length === 0 ? (
            <tr><td colSpan="4" className="table-message">{emptyText}</td></tr>
          ) : companies.map((company) => (
            <tr key={company.id}>
              <td>
                <div className="company-cell">
                  <span className="company-avatar">
                    {company.name?.charAt(0).toUpperCase() || "C"}
                  </span>
                  <strong>{company.name}</strong>
                </div>
              </td>
              <td>{company.location || "—"}</td>
              <td>
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noreferrer">
                    Visit website ↗
                  </a>
                ) : "—"}
              </td>
              <td><span className="id-badge">#{company.id}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
