import React from "react";
import { createRoot } from "react-dom/client";
import { Briefcase, Plus, Search, Trash2, CheckCircle2, Clock3, XCircle } from "lucide-react";
import "./styles.css";

type Status = "Applied" | "Interview" | "Selected" | "Rejected";
type Job = { id: number; company: string; role: string; location: string; status: Status; date: string };

const initialJobs: Job[] = [
  { id: 1, company: "The First Labs", role: "Associate Frontend Developer", location: "Mumbai", status: "Applied", date: "2026-10-05" },
  { id: 2, company: "Accenture", role: "Software Developer", location: "Bengaluru", status: "Interview", date: "2026-10-02" },
  { id: 3, company: "Deloitte", role: "Technology Analyst", location: "Hyderabad", status: "Applied", date: "2026-09-28" },
  { id: 4, company: "TCS", role: "Frontend Developer", location: "Pune", status: "Selected", date: "2026-09-20" }
];

const colors: Record<Status, string> = {
  Applied: "blue", Interview: "orange", Selected: "green", Rejected: "red"
};

function App() {
  const [jobs, setJobs] = React.useState<Job[]>(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : initialJobs;
  });
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("All");
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ company: "", role: "", location: "", status: "Applied" as Status });

  React.useEffect(() => localStorage.setItem("jobs", JSON.stringify(jobs)), [jobs]);

  const addJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.role) return;
    setJobs([{ ...form, id: Date.now(), date: new Date().toISOString().slice(0, 10) }, ...jobs]);
    setForm({ company: "", role: "", location: "", status: "Applied" });
    setShowForm(false);
  };

  const remove = (id: number) => setJobs(jobs.filter(j => j.id !== id));

  const filtered = jobs.filter(j =>
    (status === "All" || j.status === status) &&
    `${j.company} ${j.role} ${j.location}`.toLowerCase().includes(query.toLowerCase())
  );

  const count = (s: Status) => jobs.filter(j => j.status === s).length;

  return <div className="app">
    <header>
      <div className="brand"><Briefcase size={24}/><span>CareerTrack</span></div>
      <button className="primary" onClick={() => setShowForm(true)}><Plus size={18}/> Add Application</button>
    </header>

    <main>
      <section className="hero">
        <div><p className="eyebrow">APPLICATION DASHBOARD</p><h1>Track every opportunity.</h1><p>Manage applications, interviews and outcomes from one clean workspace.</p></div>
      </section>

      <section className="stats">
        <div className="stat"><Clock3/><div><b>{count("Applied")}</b><span>Applied</span></div></div>
        <div className="stat"><Clock3/><div><b>{count("Interview")}</b><span>Interviews</span></div></div>
        <div className="stat"><CheckCircle2/><div><b>{count("Selected")}</b><span>Selected</span></div></div>
        <div className="stat"><XCircle/><div><b>{count("Rejected")}</b><span>Rejected</span></div></div>
      </section>

      <section className="toolbar">
        <div className="search"><Search size={18}/><input placeholder="Search company, role or location..." value={query} onChange={e => setQuery(e.target.value)}/></div>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option>All</option><option>Applied</option><option>Interview</option><option>Selected</option><option>Rejected</option>
        </select>
      </section>

      <section className="table-card">
        <div className="table-head"><span>Company & Role</span><span>Location</span><span>Status</span><span>Applied</span><span></span></div>
        {filtered.map(job => <div className="row" key={job.id}>
          <div><strong>{job.company}</strong><small>{job.role}</small></div>
          <span>{job.location}</span>
          <span className={`badge ${colors[job.status]}`}>{job.status}</span>
          <span>{job.date}</span>
          <button className="icon" onClick={() => remove(job.id)} aria-label="Delete"><Trash2 size={17}/></button>
        </div>)}
        {!filtered.length && <div className="empty">No applications found.</div>}
      </section>

      {showForm && <div className="overlay" onClick={() => setShowForm(false)}>
        <form className="modal" onSubmit={addJob} onClick={e => e.stopPropagation()}>
          <h2>Add application</h2>
          <input required placeholder="Company" value={form.company} onChange={e => setForm({...form, company:e.target.value})}/>
          <input required placeholder="Role" value={form.role} onChange={e => setForm({...form, role:e.target.value})}/>
          <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location:e.target.value})}/>
          <select value={form.status} onChange={e => setForm({...form, status:e.target.value as Status})}><option>Applied</option><option>Interview</option><option>Selected</option><option>Rejected</option></select>
          <div className="actions"><button type="button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary">Save Application</button></div>
        </form>
      </div>}
    </main>
  </div>;
}
createRoot(document.getElementById("root")!).render(<App />);