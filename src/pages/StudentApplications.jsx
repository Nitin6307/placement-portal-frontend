import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../api/studentApi";

function StudentApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyApplications();

      setApplications(data || []);
    } catch (err) {
      console.error("Applications API error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load your applications."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "SELECTED":
        return "bg-green-50 text-green-700 border-green-200";

      case "SHORTLISTED":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          Career Progress
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-1">
          My Applications
        </h1>

        <p className="text-slate-500 mt-2">
          Track the status of your placement applications.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}
      {applications.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {applications.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Applied</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {
                applications.filter(
                  (application) =>
                    application.status?.toUpperCase() === "APPLIED"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Shortlisted</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {
                applications.filter(
                  (application) =>
                    application.status?.toUpperCase() === "SHORTLISTED"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Selected</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {
                applications.filter(
                  (application) =>
                    application.status?.toUpperCase() === "SELECTED"
                ).length
              }
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="text-6xl mb-5">📄</div>

          <h2 className="text-2xl font-bold text-slate-800">
            No applications yet
          </h2>

          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            You haven't applied for any placement opportunities yet.
            Explore available jobs and submit your first application.
          </p>

          <button
            type="button"
            onClick={() => navigate("/student/jobs")}
            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Explore Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((application) => {
            const job = application.job;
            const company = job?.company;

            return (
              <div
                key={application.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  {/* Job */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                      💼
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        {job?.title || application.jobTitle || "Job"}
                      </h2>

                      <p className="text-blue-600 font-semibold mt-1">
                        {company?.name ||
                          application.companyName ||
                          "Company"}
                      </p>

                      {job?.location && (
                        <p className="text-sm text-slate-500 mt-1">
                          📍 {job.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`self-start md:self-center px-4 py-2 rounded-full border text-sm font-bold ${getStatusStyle(
                      application.status
                    )}`}
                  >
                    {application.status || "APPLIED"}
                  </span>
                </div>

                {/* Details */}
                <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                      Applied Date
                    </p>

                    <p className="font-semibold text-slate-700 mt-1">
                      {application.appliedDate || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                      Package
                    </p>

                    <p className="font-semibold text-slate-700 mt-1">
                      {job?.packageLpa != null
                        ? `₹${job.packageLpa} LPA`
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">
                      Application ID
                    </p>

                    <p className="font-semibold text-slate-700 mt-1">
                      #{application.id}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentApplications;