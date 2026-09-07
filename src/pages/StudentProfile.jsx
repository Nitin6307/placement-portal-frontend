import { useEffect, useState } from "react";
import { getMyProfile, uploadResume } from "../api/studentApi";
import api from "../api/axios";

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [creating, setCreating] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [skillLoading, setSkillLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setCreating(true);
      setMessage("");

      const response = await api.post("/students", {
        name: profile.name,
        email: profile.email,
        branch: profile.branch,
        cgpa: profile.cgpa,
        backlogs: profile.backlogs,
        graduationYear: profile.graduationYear,
        phone: profile.phone,
        resumeUrl: profile.resumeUrl || null,
      });

      setProfile(response.data);
      setMessage("Profile created successfully.");
    } catch (error) {
      console.error(error);

      setMessage(error.response?.data?.error || "Unable to create profile.");
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await api.put("/students/me", {
        name: profile.name,
        email: profile.email,
        branch: profile.branch,
        cgpa: profile.cgpa,
        backlogs: profile.backlogs,
        graduationYear: profile.graduationYear,
        phone: profile.phone,
        resumeUrl: profile.resumeUrl,
      });

      setProfile(response.data);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error(error);

      setMessage(error.response?.data?.error || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setMessage("Please select a PDF first.");
      return;
    }

    try {
      setUploadingResume(true);
      setMessage("");

      const response = await uploadResume(resumeFile);

      setProfile((prev) => ({
        ...prev,
        resumeUrl: response.resumeUrl,
      }));

      setResumeFile(null);
      setMessage("Resume uploaded successfully.");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to upload resume.");
    } finally {
      setUploadingResume(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadSkills();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);

      if (error.response?.status === 404) {
        setProfile({
          name: "",
          email: "",
          branch: "",
          cgpa: "",
          backlogs: 0,
          graduationYear: "",
          phone: "",
          resumeUrl: "",
        });
        setEditing(true);
      }
    } finally {
      setLoading(false);
    }
  };
  const loadSkills = async () => {
    try {
      const response = await api.get("/skills");
      console.log("Skills response:", response.data);
      setAllSkills(response.data);
    } catch (error) {
      console.error("Skills API error:", error.response?.data || error);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkill) return;

    try {
      setSkillLoading(true);
      setMessage("");

      const response = await api.post(`/students/me/skills/${selectedSkill}`);

      setProfile(response.data);
      setSelectedSkill("");
      setMessage("Skill added successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "Unable to add skill.");
    } finally {
      setSkillLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      setSkillLoading(true);
      setMessage("");

      const response = await api.delete(`/students/me/skills/${skillId}`);

      setProfile(response.data);
      setMessage("Skill removed successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || "Unable to remove skill.");
    } finally {
      setSkillLoading(false);
    }
  };

  const handleViewResume = async () => {
    try {
      const token = localStorage.getItem("token");

      const resumePath = new URL(profile.resumeUrl).pathname.replace(
        "/api",
        "",
      );

      const response = await api.get(resumePath, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const pdfUrl = window.URL.createObjectURL(response.data);

      window.open(pdfUrl, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (error) {
      console.error("Failed to open resume:", error);
      setMessage(error.response?.data?.error || "Unable to open resume.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-blue-600">Student Profile</p>

        <h1 className="text-3xl font-bold text-slate-800 mt-1">My Profile</h1>

        <p className="text-slate-500 mt-2">
          Keep your academic and professional information up to date.
        </p>
      </div>

      {/* Profile header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl font-bold">
              {profile.name?.charAt(0)?.toUpperCase() || "S"}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>

              <p className="text-blue-100 mt-1">{profile.email}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-white/15 text-sm">
                  {profile.branch || "Branch not specified"}
                </span>

                <span className="px-3 py-1 rounded-full bg-white/15 text-sm">
                  Graduation {profile.graduationYear || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditing(!editing);
              setMessage("");
            }}
            className="px-5 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl bg-blue-50 border border-blue-200 px-5 py-4 text-blue-700 font-medium">
          {message}
        </div>
      )}

      {editing && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-800">Edit Profile</h2>

          <div className="grid md:grid-cols-2 gap-5 mt-6">
            <InputField
              label="Name"
              value={profile.name || ""}
              onChange={(value) => setProfile({ ...profile, name: value })}
            />

            <InputField
              label="Email"
              value={profile.email || ""}
              onChange={(value) => setProfile({ ...profile, email: value })}
            />

            <InputField
              label="Branch"
              value={profile.branch || ""}
              onChange={(value) => setProfile({ ...profile, branch: value })}
            />

            <InputField
              label="CGPA"
              type="number"
              step="0.01"
              value={profile.cgpa ?? ""}
              onChange={(value) =>
                setProfile({
                  ...profile,
                  cgpa: value === "" ? null : Number(value),
                })
              }
            />

            <InputField
              label="Backlogs"
              type="number"
              value={profile.backlogs ?? ""}
              onChange={(value) =>
                setProfile({
                  ...profile,
                  backlogs: value === "" ? null : Number(value),
                })
              }
            />

            <InputField
              label="Graduation Year"
              type="number"
              value={profile.graduationYear ?? ""}
              onChange={(value) =>
                setProfile({
                  ...profile,
                  graduationYear: value === "" ? null : Number(value),
                })
              }
            />

            <InputField
              label="Phone"
              value={profile.phone || ""}
              onChange={(value) => setProfile({ ...profile, phone: value })}
            />

            <InputField
              label="Resume URL"
              value={profile.resumeUrl || ""}
              onChange={(value) => setProfile({ ...profile, resumeUrl: value })}
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={profile.id ? handleSave : handleCreate}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {creating
                ? "Creating..."
                : saving
                  ? "Saving..."
                  : profile.id
                    ? "Save Changes"
                    : "Create Profile"}
            </button>
          </div>
        </section>
      )}

      {/* Academic information */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800">
          Academic Information
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <InfoCard
            label="Branch"
            value={profile.branch || "Not specified"}
            icon="🎓"
          />

          <InfoCard
            label="CGPA"
            value={profile.cgpa ?? "Not specified"}
            icon="📊"
          />

          <InfoCard
            label="Backlogs"
            value={profile.backlogs ?? "Not specified"}
            icon="📚"
          />

          <InfoCard
            label="Graduation Year"
            value={profile.graduationYear || "Not specified"}
            icon="📅"
          />
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800">
          Contact Information
        </h2>

        <div className="grid md:grid-cols-2 gap-5 mt-6">
          <InfoRow
            label="Email"
            value={profile.email || "Not specified"}
            icon="✉️"
          />

          <InfoRow
            label="Phone"
            value={profile.phone || "Not specified"}
            icon="📱"
          />
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Skills</h2>

            <p className="text-sm text-slate-500 mt-1">
              Add your technical skills for job eligibility and recommendations.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
            {profile.skills?.length || 0} skills
          </span>
        </div>

        {/* Add Skill */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Select a skill</option>

            {allSkills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAddSkill}
            disabled={!selectedSkill || skillLoading || !profile.id}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {skillLoading ? "Updating..." : "Add Skill"}
          </button>
        </div>

        {/* Current Skills */}
        <div className="flex flex-wrap gap-3 mt-6">
          {profile.skills?.length > 0 ? (
            profile.skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium"
              >
                <span>{skill.name}</span>

                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id)}
                  disabled={skillLoading}
                  className="text-slate-400 hover:text-red-600 font-bold"
                  title={`Remove ${skill.name}`}
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No skills added yet.</p>
          )}
        </div>
      </section>

      {/* Resume */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800">Resume</h2>

        <div className="mt-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50">
            <p className="font-semibold text-slate-800">📄 Upload Resume</p>

            <p className="text-sm text-slate-500 mt-1">
              Upload your latest resume in PDF format. Maximum size: 5 MB.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="block w-full text-sm text-slate-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:bg-slate-800 file:text-white
                     hover:file:bg-slate-700"
              />

              <button
                type="button"
                onClick={handleResumeUpload}
                disabled={!resumeFile || uploadingResume}
                className="px-5 py-2.5 rounded-xl bg-blue-600
                     text-white font-semibold
                     hover:bg-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingResume ? "Uploading..." : "Upload PDF"}
              </button>
            </div>
          </div>

          {profile.resumeUrl && (
            <div
              className="flex flex-col sm:flex-row sm:items-center
                      sm:justify-between gap-4 p-5 rounded-2xl
                      border border-green-200 bg-green-50"
            >
              <div>
                <p className="font-semibold text-green-800">Resume uploaded</p>

                <p className="text-sm text-green-700 mt-1">
                  Your current resume document is available.
                </p>
              </div>

              <button
                type="button"
                onClick={handleViewResume}
                className="inline-flex items-center justify-center
             px-5 py-2.5 rounded-xl
             bg-green-600 text-white font-semibold
             hover:bg-green-700 transition"
              >
                View Resume →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="text-2xl">{icon}</div>

      <p className="text-sm text-slate-500 mt-4">{label}</p>

      <p className="text-lg font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
      <div className="text-xl">{icon}</div>

      <div>
        <p className="text-xs text-slate-400">{label}</p>

        <p className="font-semibold text-slate-700 mt-1">{value}</p>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", step }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-2">
        {label}
      </label>

      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

export default StudentProfile;
