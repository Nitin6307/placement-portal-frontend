import { useEffect, useState } from "react";
import api from "../api/axios";

function OfficerDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
