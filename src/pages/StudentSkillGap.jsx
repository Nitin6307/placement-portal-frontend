import { useEffect, useState } from "react";
import { getMyProfile, getSkillGap } from "../api/studentApi";
import api from "../api/axios";

function StudentSkillGap() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [skillGap, setSkillGap] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileData, jobsResponse] = await Promise.all([
        getMyProfile(),
        api.get("/jobs"),
      ]);

      setProfile(profileData);
      setJobs(jobsResponse.data || []);
    } catch (err) {
      console.error("Skill gap loading error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load skill gap data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedJobId || !profile?.id) {
      setError("Please select a job first.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setSkillGap(null);

      const data = await getSkillGap(profile.id, selectedJobId);

      setSkillGap(data);
    } catch (err) {
      console.error("Skill gap API error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to analyze skill gap."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const normalizeSkills = (skills) => {
    if (!skills) return [];

    if (Array.isArray(skills)) {
      return skills.map((skill) =>
        typeof skill === "string" ? skill : skill.name
      );
    }

    if (typeof skills === "string") {
      return skills
        .split(/[,;]+/)
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
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
          Career Development
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-1">
          Skill Gap Analysis
        </h1>

        <p className="text-slate-500 mt-2">
          Compare your skills with the requirements of a job.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {/* Profile skills */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          Your Skills
        </h2>

        <div className="flex flex-wrap gap-2 mt-4">
          {profile?.skills?.length > 0 ? (
            profile.skills.map((skill) => (
              <span
                key={skill.id || skill.name}
                className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium"
              >
                {skill.name}
              </span>
            ))
          ) : (
            <p className="text-slate-500">
              No skills added to your profile.
            </p>
          )}
        </div>
      </div>

      {/* Job selection */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800">
          Select a Job
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Choose a job to see which skills you already have and which ones
          you need to learn.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-5">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a job</option>

            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
                {job.company?.name ? ` — ${job.company.name}` : ""}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!selectedJobId || analyzing}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? "Analyzing..." : "Analyze Skills"}
          </button>
        </div>
      </div>

      {/* Results */}
      {skillGap && (
        <div className="mt-6 space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-800">
              Skill Gap Result
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 mt-5">
              <div className="rounded-xl bg-green-50 border border-green-100 p-5">
                <p className="text-sm text-green-700">
                  Matched Skills
                </p>
                <p className="text-3xl font-bold text-green-700 mt-1">
                  {skillGap.matchedSkills?.length || 0}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 border border-red-100 p-5">
                <p className="text-sm text-red-700">
                  Missing Skills
                </p>
                <p className="text-3xl font-bold text-red-700 mt-1">
                  {skillGap.missingSkills?.length || 0}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
                <p className="text-sm text-blue-700">
                  Match Percentage
                </p>
                <p className="text-3xl font-bold text-blue-700 mt-1">
                  {skillGap.matchPercentage ?? 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Matched / Missing */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800">
                ✅ Matched Skills
              </h3>

              <div className="flex flex-wrap gap-2 mt-4">
                {normalizeSkills(skillGap.matchedSkills).length > 0 ? (
                  normalizeSkills(skillGap.matchedSkills).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 font-medium text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500">
                    No matching skills found.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800">
                📚 Skills to Learn
              </h3>

              <div className="flex flex-wrap gap-2 mt-4">
                {normalizeSkills(skillGap.missingSkills).length > 0 ? (
                  normalizeSkills(skillGap.missingSkills).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 font-medium text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-green-600 font-medium">
                    🎉 You have all the required skills!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentSkillGap;