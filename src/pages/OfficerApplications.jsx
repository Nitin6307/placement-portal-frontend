import { useEffect, useState } from "react";
import api from "../api/axios";

function OfficerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications");

      setApplications(response.data);
    } catch (err) {
      console.error("Applications API error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);
      setMessage("");
      setError("");

      const response = await api.put(
        `/applications/${applicationId}/status`,
        { status }
      );

      setApplications((prev) =>
        prev.map((application) =>
          application.id === applicationId
            ? response.data
            : application
        )
      );

      setMessage("Application status updated successfully.");
    } catch (err) {
      console.error("Update application status error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(applicationId);
      setMessage("");
      setError("");

      await api.delete(`/applications/${applicationId}`);

      setApplications((prev) =>
        prev.filter((application) => application.id !== applicationId)
      );

      setMessage("Application deleted successfully.");
    } catch (err) {
      console.error("Delete application error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete application."
      );
    } finally {
      setDeletingId(null);
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          Placement Management
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-1">
          Applications
        </h1>

        <p className="text-slate-500 mt-2">
          Review and manage student job applications.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-5xl mb-4">📄</div>

          <h2 className="text-xl font-bold text-slate-800">
            No applications found
          </h2>

          <p className="text-slate-500 mt-2">
            Student applications will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Student
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Job
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Company
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Applied Date
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {applications.map((application) => {
                  const student =
                    application.student?.name ||
                    application.studentName ||
                    "Student";

                  const job =
                    application.job?.title ||
                    application.jobTitle ||
                    "Job";

                  const company =
                    application.job?.company?.name ||
                    application.companyName ||
                    "Company";

                  return (
                    <tr
                      key={application.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-800">
                          {student}
                        </p>

                        {application.student?.email && (
                          <p className="text-sm text-slate-400 mt-1">
                            {application.student.email}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-700">
                          {job}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {company}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {application.appliedDate || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <select
                          value={application.status || "APPLIED"}
                          onChange={(e) =>
                            handleStatusChange(
                              application.id,
                              e.target.value
                            )
                          }
                          disabled={
                            updatingId === application.id ||
                            deletingId === application.id
                          }
                          className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 ${getStatusStyle(
                            application.status
                          )}`}
                        >
                          <option value="APPLIED">APPLIED</option>
                          <option value="SHORTLISTED">
                            SHORTLISTED
                          </option>
                          <option value="SELECTED">SELECTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>

                      <td className="px-6 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(application.id)
                          }
                          disabled={
                            deletingId === application.id ||
                            updatingId === application.id
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                        >
                          {deletingId === application.id
                            ? "Deleting..."
                            : "🗑️ Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfficerApplications;