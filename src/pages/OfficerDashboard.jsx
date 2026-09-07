import { useEffect, useState } from "react";
import api from "../api/axios";

function OfficerDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [skillLoading, setSkillLoading] = useState(false);
  const [skillMessage, setSkillMessage] = useState("");

  // Load Analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get("/analytics/placement");

        console.log("Analytics response:", response.data);

        setAnalytics(response.data);
      } catch (error) {
        console.error("Analytics API error:", error.response?.data || error);

        setError(
          error.response?.data?.error || "Unable to load placement analytics.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  // Load Skills
  const loadSkills = async () => {
    try {
      const response = await api.get("/skills");
      setSkills(response.data);
    } catch (error) {
      console.error("Skills API error:", error);
    }
  };

  // Load skills when dashboard opens
  useEffect(() => {
    loadSkills();
  }, []);

  // Create Skill
  const handleCreateSkill = async () => {
    const skillName = newSkill.trim();

    if (!skillName) {
      setSkillMessage("Please enter a skill name.");
      return;
    }

    try {
      setSkillLoading(true);
      setSkillMessage("");

      const response = await api.post("/skills", {
        name: skillName,
      });

      setSkills((prev) => [...prev, response.data]);

      setNewSkill("");
      setSkillMessage("Skill added successfully.");
    } catch (error) {
      console.error("Create skill error:", error);

      setSkillMessage(error.response?.data?.error || "Unable to create skill.");
    } finally {
      setSkillLoading(false);
    }
  };

  // Dashboard Stats
  const stats = [
    {
      label: "Total Students",
      value: analytics?.totalStudents ?? 0,
      icon: "👨‍🎓",
    },
    {
      label: "Companies",
      value: analytics?.totalCompanies ?? 0,
      icon: "🏢",
    },
    {
      label: "Active Jobs",
      value: analytics?.totalJobs ?? 0,
      icon: "💼",
    },
    {
      label: "Applications",
      value: analytics?.totalApplications ?? 0,
      icon: "📄",
    },
  ];
  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Hero */}
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-7 text-white shadow-xl md:p-9">
        <p className="text-sm font-medium text-indigo-100">
          Placement Management
        </p>

        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
          Welcome back, Officer 👋
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 md:text-base">
          Manage students, companies, job opportunities and placement activities
          from one centralized dashboard.
        </p>
      </section>

      {/* Stats */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  {stat.icon}
                </div>

                <span className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Placement Overview */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Placement Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Current placement performance
              </p>
            </div>

            <div className="text-3xl">📈</div>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-indigo-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {analytics?.placementPercentage
                    ? analytics.placementPercentage.toFixed(1)
                    : "0.0"}
                  %
                </p>
                <p className="text-xs text-slate-500">Placed</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-500">Selected Students</p>

              <p className="mt-1 text-3xl font-bold text-slate-900">
                {analytics?.selectedStudents ?? 0}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Based on current application status
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Common placement officer tasks
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href="/officer/students"
              className="rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="text-2xl">👨‍🎓</span>
              <p className="mt-2 font-semibold text-slate-900">
                Manage Students
              </p>
            </a>

            <a
              href="/officer/companies"
              className="rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="text-2xl">🏢</span>
              <p className="mt-2 font-semibold text-slate-900">
                Manage Companies
              </p>
            </a>

            <a
              href="/officer/jobs"
              className="rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="text-2xl">💼</span>
              <p className="mt-2 font-semibold text-slate-900">Manage Jobs</p>
            </a>

            <a
              href="/officer/applications"
              className="rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="text-2xl">📄</span>
              <p className="mt-2 font-semibold text-slate-900">Applications</p>
            </a>
          </div>
        </div>
      </section>

      {/* Manage Skills */}
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Manage Skills
              </h2>
            </div>

            <div className="rounded-xl bg-indigo-50 px-4 py-2 text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {skills.length}
              </p>

              <p className="text-xs font-semibold text-indigo-700">
                Total Skills
              </p>
            </div>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Add skills that students can select for job eligibility and
            recommendations.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateSkill();
              }
            }}
            placeholder="Enter skill name, e.g. Java"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3
                 text-slate-800 outline-none
                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

          <button
            type="button"
            onClick={handleCreateSkill}
            disabled={skillLoading}
            className="rounded-xl bg-indigo-600 px-6 py-3
                 font-semibold text-white
                 hover:bg-indigo-700
                 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {skillLoading ? "Adding..." : "Add Skill"}
          </button>
        </div>

        {skillMessage && (
          <p className="mt-3 text-sm font-medium text-indigo-600">
            {skillMessage}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-xl bg-slate-100 px-4 py-2
                     text-sm font-semibold text-slate-700"
              >
                {skill.name}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">No skills available yet.</p>
          )}
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Placement activity at a glance
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Keep track of student applications and company opportunities.
            </p>
          </div>

          <div className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm">
            {analytics?.selectedStudents ?? 0} students selected
          </div>
        </div>
      </section>
    </div>
  );
}

export default OfficerDashboard;
