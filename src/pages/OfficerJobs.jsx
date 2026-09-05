import { useEffect, useState } from "react";
import api from "../api/axios";

function OfficerJobs() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    companyId: "",
    packageLpa: "",
    location: "",
    minCgpa: "",
    maxBacklogs: "",
    allowedBranches: "",
    requiredSkills: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [jobsResponse, companiesResponse] = await Promise.all([
        api.get("/jobs"),
        api.get("/companies"),
      ]);

      setJobs(jobsResponse.data);
      setCompanies(companiesResponse.data);
    } catch (err) {
      console.error("Jobs/Companies API error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load jobs.",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      companyId: "",
      packageLpa: "",
      location: "",
      minCgpa: "",
      maxBacklogs: "",
      allowedBranches: "",
      requiredSkills: "",
      description: "",
    });

    setEditingId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!form.companyId) {
      setError("Please select a company.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        packageLpa: Number(form.packageLpa),
        location: form.location.trim(),
        minCgpa: Number(form.minCgpa),
        maxBacklogs: Number(form.maxBacklogs),
        allowedBranches: form.allowedBranches.trim(),
        requiredSkills: form.requiredSkills.trim(),
        description: form.description.trim(),
      };

      let response;

      if (editingId) {
        response = await api.put(`/jobs/${editingId}`, payload);

        setJobs((prev) =>
          prev.map((job) => (job.id === editingId ? response.data : job)),
        );

        setMessage("Job updated successfully!");
      } else {
        response = await api.post(`/jobs/company/${form.companyId}`, payload);

        setJobs((prev) => [...prev, response.data]);

        setMessage("Job created successfully!");
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Save job error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to save job.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title || "",
      companyId: job.company?.id
        ? String(job.company.id)
        : job.companyId
          ? String(job.companyId)
          : "",
      packageLpa: job.packageLpa ?? "",
      location: job.location || "",
      minCgpa: job.minCgpa ?? "",
      maxBacklogs: job.maxBacklogs ?? "",
      allowedBranches: job.allowedBranches || "",
      requiredSkills: Array.isArray(job.requiredSkills)
        ? job.requiredSkills.join(", ")
        : job.requiredSkills || "",
      description: job.description || "",
    });

    setEditingId(job.id);
    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await api.delete(`/jobs/${id}`);

      setJobs((prev) => prev.filter((job) => job.id !== id));

      setMessage("Job deleted successfully!");
    } catch (err) {
      console.error("Delete job error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete job.",
      );
    } finally {
      setDeletingId(null);
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
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Placement Management
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">Jobs</h1>

          <p className="text-slate-500 mt-2">Manage placement opportunities.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
            setError("");
            setMessage("");
          }}
          className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "+ Add Job"}
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {/* Create Job Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              {editingId ? "Edit Job" : "Create New Job"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Add a new placement opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Job Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Java Backend Developer"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Company
              </label>

              <select
                name="companyId"
                value={form.companyId}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select company</option>

                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Package */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Package (LPA)
              </label>

              <input
                type="number"
                name="packageLpa"
                value={form.packageLpa}
                onChange={handleChange}
                placeholder="9"
                min="0"
                step="0.1"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Pune"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Minimum CGPA */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Minimum CGPA
              </label>

              <input
                type="number"
                name="minCgpa"
                value={form.minCgpa}
                onChange={handleChange}
                placeholder="7.5"
                min="0"
                max="10"
                step="0.1"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Maximum Backlogs */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Maximum Backlogs
              </label>

              <input
                type="number"
                name="maxBacklogs"
                value={form.maxBacklogs}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Allowed Branches */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Allowed Branches
              </label>

              <input
                type="text"
                name="allowedBranches"
                value={form.allowedBranches}
                onChange={handleChange}
                placeholder="CSE, IT, ECE"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Required Skills
              </label>

              <input
                type="text"
                name="requiredSkills"
                value={form.requiredSkills}
                onChange={handleChange}
                placeholder="Java, Spring Boot, MySQL"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-xs text-slate-400 mt-1">
                Separate skills with commas.
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the job role and responsibilities..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
                setError("");
              }}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Job" : "Create Job"}
            </button>
          </div>
        </form>
      )}

      {/* Jobs */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-5xl mb-4">💼</div>

          <h2 className="text-xl font-bold text-slate-800">No jobs found</h2>

          <p className="text-slate-500 mt-2">
            No placement opportunities are available.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const skills = formatSkills(job.requiredSkills);

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {job.title}
                    </h2>

                    <p className="text-blue-600 font-semibold mt-1">
                      {job.company?.name || job.companyName || "Company"}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                    💼
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">Package</p>

                    <p className="font-bold text-slate-700 mt-1">
                      ₹{job.packageLpa} LPA
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">Location</p>

                    <p className="font-bold text-slate-700 mt-1">
                      {job.location || "Not specified"}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">Minimum CGPA</p>

                    <p className="font-bold text-slate-700 mt-1">
                      {job.minCgpa ?? "Not specified"}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400">Max Backlogs</p>

                    <p className="font-bold text-slate-700 mt-1">
                      {job.maxBacklogs ?? "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-slate-500">Allowed Branches</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.allowedBranches ? (
                      job.allowedBranches
                        .split(",")
                        .map((branch) => branch.trim())
                        .filter(Boolean)
                        .map((branch, index) => (
                          <span
                            key={`${branch}-${index}`}
                            className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold"
                          >
                            {branch}
                          </span>
                        ))
                    ) : (
                      <span className="text-sm text-slate-400">
                        No branches specified
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-slate-500 mb-2">Required Skills</p>

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
                    <span className="text-sm text-slate-400">
                      No skills specified
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(job)}
                    disabled={deletingId === job.id}
                    className="flex-1 rounded-xl border border-blue-200 px-4 py-3 font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(job.id, job.title)}
                    disabled={deletingId === job.id}
                    className="flex-1 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === job.id ? "Deleting..." : "🗑️ Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OfficerJobs;
