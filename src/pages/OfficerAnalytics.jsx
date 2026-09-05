import { useEffect, useState } from "react";
import api from "../api/axios";

function OfficerAnalytics() {
  const [overview, setOverview] = useState(null);
  const [applicationStats, setApplicationStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const [overviewResponse, statsResponse] = await Promise.all([
        api.get("/analytics"),
        api.get("/analytics/applications"),
      ]);

      setOverview(overviewResponse.data);
      setApplicationStats(statsResponse.data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-slate-800">
          Analytics unavailable
        </h2>
        <p className="text-slate-500 mt-2">
          Unable to load placement analytics.
        </p>
      </div>
    );
  }

  const placementPercentage = Number(
    overview.placementPercentage || 0
  ).toFixed(1);

  const totalApplications = Number(
    applicationStats?.totalApplications ||
      overview.totalApplications ||
      0
  );

  const statuses = [
    {
      label: "Applied",
      value: Number(applicationStats?.applied || 0),
      icon: "📝",
    },
    {
      label: "Shortlisted",
      value: Number(applicationStats?.shortlisted || 0),
      icon: "⭐",
    },
    {
      label: "Selected",
      value: Number(applicationStats?.selected || 0),
      icon: "✅",
    },
    {
      label: "Rejected",
      value: Number(applicationStats?.rejected || 0),
      icon: "❌",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Placement Management
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Placement Analytics
          </h1>

          <p className="text-slate-500 mt-2">
            Monitor placement activity and application outcomes.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="px-5 py-3 rounded-xl border border-slate-300
                     bg-white text-slate-700 font-semibold
                     hover:bg-slate-50 transition"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Main statistics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          label="Total Students"
          value={overview.totalStudents}
          icon="🎓"
        />

        <StatCard
          label="Companies"
          value={overview.totalCompanies}
          icon="🏢"
        />

        <StatCard
          label="Active Jobs"
          value={overview.totalJobs}
          icon="💼"
        />

        <StatCard
          label="Applications"
          value={overview.totalApplications}
          icon="📄"
        />

        <StatCard
          label="Selected Students"
          value={overview.selectedStudents}
          icon="🎯"
        />

        <StatCard
          label="Placement Rate"
          value={`${placementPercentage}%`}
          icon="📈"
          highlight
        />
      </div>

      {/* Placement overview */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Placement Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Students selected through the placement process.
            </p>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            {placementPercentage}%
          </div>
        </div>

        <div className="mt-6">
          <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-700"
              style={{
                width: `${Math.min(
                  Math.max(Number(placementPercentage), 0),
                  100
                )}%`,
              }}
            />
          </div>

          <div className="flex justify-between mt-3 text-sm">
            <span className="text-slate-500">
              {overview.selectedStudents} selected
            </span>

            <span className="text-slate-500">
              {overview.totalStudents} total students
            </span>
          </div>
        </div>
      </section>

      {/* Application status */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Application Status
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Breakdown of student application outcomes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {statuses.map((status) => {
            const percentage =
              totalApplications > 0
                ? ((status.value / totalApplications) * 100).toFixed(1)
                : "0.0";

            return (
              <div
                key={status.label}
                className="rounded-2xl bg-slate-50 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{status.icon}</span>

                  <span className="text-xs font-semibold text-slate-400">
                    {percentage}%
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-4">
                  {status.label}
                </p>

                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {status.value}
                </p>

                <div className="h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        Number(percentage),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Application visual */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Application Distribution
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Visual comparison of application statuses.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {statuses.map((status) => {
            const percentage =
              totalApplications > 0
                ? (status.value / totalApplications) * 100
                : 0;

            return (
              <div key={status.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-700">
                    {status.icon} {status.label}
                  </span>

                  <span className="font-semibold text-slate-600">
                    {status.value}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer insight */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-7 text-white">
        <p className="text-blue-100 text-sm font-semibold">
          Placement Insight
        </p>

        <h2 className="text-2xl font-bold mt-2">
          {overview.selectedStudents > 0
            ? `${overview.selectedStudents} student${
                overview.selectedStudents === 1 ? "" : "s"
              } successfully selected`
            : "No students selected yet"}
        </h2>

        <p className="text-blue-100 mt-2">
          Keep tracking applications and outcomes to improve
          placement performance.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, highlight = false }) {
  return (
    <div
      className={`rounded-2xl border shadow-sm p-5 ${
        highlight
          ? "bg-blue-600 border-blue-600 text-white"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm ${
              highlight ? "text-blue-100" : "text-slate-500"
            }`}
          >
            {label}
          </p>

          <p
            className={`text-3xl font-bold mt-2 ${
              highlight ? "text-white" : "text-slate-800"
            }`}
          >
            {value ?? 0}
          </p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

export default OfficerAnalytics;