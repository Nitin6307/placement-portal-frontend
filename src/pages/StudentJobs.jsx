import { useEffect, useState } from "react";
import api from "../api/axios";

function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsResponse, applicationsResponse] = await Promise.all([
        api.get("/jobs"),
        api.get("/applications"),
      ]);

      setJobs(jobsResponse.data);
      setApplications(applicationsResponse.data);
    } catch (err) {
      console.error("Student jobs API error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatSkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills;
    }

    if (typeof skills === "string") {
      return skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
  };

  const isApplied = (jobId) => {
    return applications.some(
      (application) =>
        application.job?.id === jobId ||
        application.jobId === jobId
    );
  };

  const handleApply = async (jobId) => {
    try {
      setApplyingId(jobId);
      setMessage("");
      setError("");

      const response = await api.post(`/applications/job/${jobId}`);

      setApplications((prev) => [...prev, response.data]);

      setMessage("Application submitted successfully.");
    } catch (err) {
      console.error("Apply error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to apply for this job."
      );
    } finally {
      setApplyingId(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    const skills = formatSkills(job.requiredSkills).join(" ");

    return `${job.title || ""} ${
      job.company?.name || job.companyName || ""
    } ${job.location || ""} ${skills}`
      .toLowerCase()
      .includes(searchText);
  });

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
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Career Opportunities
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Available Jobs
          </h1>

          <p className="text-slate-500 mt-2">
            Explore placement opportunities and apply for suitable roles.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, companies, skills..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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

      {/* Empty */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-5xl mb-4">💼</div>

          <h2 className="text-xl font-bold text-slate-800">
            No jobs found
          </h2>

          <p className="text-slate-500 mt-2">
            Try a different search or check back later.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const skills = formatSkills(job.requiredSkills);
            const applied = isApplied(job.id);

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition"
              >
                {/* Job Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {job.title}
                    </h2>

                    <p className="text-blue-600 font-semibold mt-1">
                      {job.company?.name ||
                        job.companyName ||
                        "Company"}
                    </p>
                  </div>

                  <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                    💼
                  </div>
                </div>

                {/* Package + Location */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">
                      Package
                    </p>

                    <p className="font-bold text-slate-700 mt-1">
                      ₹{job.packageLpa ?? "—"} LPA
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">
                      Location
                    </p>

                    <p className="font-bold text-slate-700 mt-1">
                      {job.location || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      Minimum CGPA
                    </p>

                    <p className="font-semibold text-slate-700 mt-1">
                      {job.minCgpa ?? "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Max Backlogs
                    </p>

                    <p className="font-semibold text-slate-700 mt-1">
                      {job.maxBacklogs ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Branches */}
                <div className="mt-5">
                  <p className="text-sm text-slate-500">
                    Eligible Branches
                  </p>

                  <p className="font-semibold text-slate-700 mt-1">
                    {job.allowedBranches || "All branches"}
                  </p>
                </div>

                {/* Skills */}
                <div className="mt-5">
                  <p className="text-sm text-slate-500 mb-2">
                    Required Skills
                  </p>

                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      No specific skills listed.
                    </p>
                  )}
                </div>

                {/* Description */}
                {job.description && (
                  <p className="text-sm text-slate-500 mt-5 line-clamp-3">
                    {job.description}
                  </p>
                )}

                {/* Apply */}
                <button
                  type="button"
                  disabled={applied || applyingId === job.id}
                  onClick={() => handleApply(job.id)}
                  className={`w-full mt-6 rounded-xl px-4 py-3 font-semibold transition ${
                    applied
                      ? "bg-green-50 text-green-700 border border-green-200 cursor-default"
                      : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                  }`}
                >
                  {applyingId === job.id
                    ? "Applying..."
                    : applied
                    ? "✓ Applied"
                    : "Apply Now"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentJobs;