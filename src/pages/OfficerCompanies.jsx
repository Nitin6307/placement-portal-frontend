import { useEffect, useState } from "react";
import api from "../api/axios";

function OfficerCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    website: "",
    jobRole: "",
    description: "",
    packageLpa: "",
    minCgpa: "",
    maxBacklogs: "",
    allowedBranches: "",
    requiredSkills: "",
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/companies");
      setCompanies(response.data);
    } catch (err) {
      console.error("Companies API error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load companies.",
      );
    } finally {
      setLoading(false);
    }
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
      name: "",
      location: "",
      website: "",
      jobRole: "",
      description: "",
      packageLpa: "",
      minCgpa: "",
      maxBacklogs: "",
      allowedBranches: "",
      requiredSkills: "",
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!form.jobRole.trim()) {
      setError("Job role is required.");
      return;
    }

    if (!form.allowedBranches.trim()) {
      setError("Allowed branches are required.");
      return;
    }

    if (!form.requiredSkills.trim()) {
      setError("Required skills are required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        minCgpa: Number(form.minCgpa),
        maxBacklogs: Number(form.maxBacklogs),
        allowedBranches: form.allowedBranches.trim(),
        requiredSkills: form.requiredSkills.trim(),
        jobRole: form.jobRole.trim(),
        packageLpa: Number(form.packageLpa),
        location: form.location.trim(),
        website: form.website.trim(),
      };

      if (editingId) {
        const response = await api.put(`/companies/${editingId}`, payload);

        setCompanies((prev) =>
          prev.map((company) =>
            company.id === editingId ? response.data : company,
          ),
        );

        setMessage("Company updated successfully!");
      } else {
        const response = await api.post("/companies", payload);

        setCompanies((prev) => [...prev, response.data]);

        setMessage("Company created successfully!");
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Save company error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to save company.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (company) => {
    setForm({
      name: company.name || "",
      location: company.location || "",
      website: company.website || "",
      jobRole: company.jobRole || "",
      description: company.description || "",
      packageLpa: company.packageLpa ?? "",
      minCgpa: company.minCgpa ?? "",
      maxBacklogs: company.maxBacklogs ?? "",
      allowedBranches: company.allowedBranches || "",
      requiredSkills: company.requiredSkills || "",
    });

    setEditingId(company.id);
    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, companyName) => {
    if (!window.confirm(`Are you sure you want to delete ${companyName}?`)) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await api.delete(`/companies/${id}`);

      setCompanies((prev) => prev.filter((company) => company.id !== id));

      setMessage("Company deleted successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete company.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Placement Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">Companies</h1>

          <p className="mt-2 text-slate-500">
            Manage companies participating in the placement process.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
            setMessage("");
            setError("");
          }}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Add Company"}
        </button>
      </div>

      {/* Success */}
      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Create Company Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Add New Company
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the company placement details below.
            </p>
          </div>

          <form onSubmit={handleCreate} className="grid gap-5 md:grid-cols-2">
            {/* Company Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Company Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Infosys"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Job Role */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Role
              </label>

              <input
                type="text"
                name="jobRole"
                value={form.jobRole}
                onChange={handleChange}
                placeholder="e.g. Software Developer"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Package */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Package (LPA)
              </label>

              <input
                type="number"
                name="packageLpa"
                value={form.packageLpa}
                onChange={handleChange}
                placeholder="8"
                min="0"
                step="0.1"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Minimum CGPA */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Minimum CGPA
              </label>

              <input
                type="number"
                name="minCgpa"
                value={form.minCgpa}
                onChange={handleChange}
                placeholder="7"
                min="0"
                max="10"
                step="0.1"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Maximum Backlogs */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Maximum Backlogs
              </label>

              <input
                type="number"
                name="maxBacklogs"
                value={form.maxBacklogs}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Allowed Branches */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Allowed Branches
              </label>

              <input
                type="text"
                name="allowedBranches"
                value={form.allowedBranches}
                onChange={handleChange}
                placeholder="CSE, IT, ECE"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate branches with commas.
              </p>
            </div>

            {/* Required Skills */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Required Skills
              </label>

              <input
                type="text"
                name="requiredSkills"
                value={form.requiredSkills}
                onChange={handleChange}
                placeholder="Java, Spring Boot, MySQL"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate skills with commas.
              </p>
            </div>

            {/* Website */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Website
              </label>

              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://www.company.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the company and placement opportunity..."
                required
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2 md:col-span-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                  setError("");
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Company"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Companies */}
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : companies.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mb-4 text-5xl">🏢</div>

          <h2 className="text-xl font-bold text-slate-800">
            No companies found
          </h2>

          <p className="mt-2 text-slate-500">
            No companies are currently registered.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                  🏢
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold text-slate-800">
                    {company.name}
                  </h2>

                  {company.jobRole && (
                    <p className="mt-1 text-sm font-semibold text-blue-600">
                      {company.jobRole}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Package</span>

                  <span className="text-sm font-semibold text-slate-700">
                    ₹{company.packageLpa} LPA
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Minimum CGPA</span>

                  <span className="text-sm font-semibold text-slate-700">
                    {company.minCgpa}
                  </span>
                </div>

                {company.location && (
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-500">Location</span>

                    <span className="text-sm font-semibold text-slate-700">
                      {company.location}
                    </span>
                  </div>
                )}

                {company.allowedBranches && (
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-500">Branches</span>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {company.allowedBranches}
                    </p>
                  </div>
                )}

                {company.requiredSkills && (
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-500">Skills</span>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {company.requiredSkills}
                    </p>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-500">Website</span>

                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="max-w-[180px] truncate text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(company)}
                    className="flex-1 rounded-xl border border-blue-200 px-4 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(company.id, company.name)}
                    disabled={deletingId === company.id}
                    className="flex-1 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === company.id ? "Deleting..." : "🗑️ Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OfficerCompanies;
