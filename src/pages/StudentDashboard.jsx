import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyApplications,
  getMyProfile,
  getMyRecommendations,
} from "../api/studentApi";

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [profileData, applicationData, recommendationData] =
        await Promise.all([
          getMyProfile(),
          getMyApplications(),
          getMyRecommendations(),
        ]);

      setProfile(profileData);
      setApplications(applicationData || []);
      setRecommendations(recommendationData || []);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = applications.filter(
    (app) => app.status?.toUpperCase() === "SELECTED"
  ).length;

  const shortlistedCount = applications.filter(
    (app) => app.status?.toUpperCase() === "SHORTLISTED"
  ).length;

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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 shadow-lg">
        <p className="text-blue-100 font-medium">
          Student Placement Portal
        </p>

        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          Welcome back, {profile?.name || "Student"} 👋
        </h1>

        <p className="text-blue-100 mt-3 max-w-2xl">
          Track your applications, discover relevant jobs and prepare
          yourself for your next career opportunity.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            to="/student/jobs"
            className="px-5 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition"
          >
            Explore Jobs
          </Link>

          <Link
            to="/student/profile"
            className="px-5 py-3 rounded-xl bg-blue-500/40 border border-white/30 text-white font-semibold hover:bg-blue-500/60 transition"
          >
            View Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Applications</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">
            {applications.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Jobs you've applied to
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Shortlisted</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {shortlistedCount}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Applications progressing
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Selected</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {selectedCount}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Successful applications
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Recommendations</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {recommendations.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Jobs matching your profile
          </p>
        </div>
      </div>

      {/* Profile + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Profile Summary
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Your academic and career information
              </p>
            </div>

            <Link
              to="/student/profile"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Edit Profile →
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400 uppercase">
                Branch
              </p>
              <p className="font-bold text-slate-800 mt-1">
                {profile?.branch || "Not added"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400 uppercase">
                CGPA
              </p>
              <p className="font-bold text-slate-800 mt-1">
                {profile?.cgpa ?? "Not added"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400 uppercase">
                Backlogs
              </p>
              <p className="font-bold text-slate-800 mt-1">
                {profile?.backlogs ?? "Not added"}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs text-slate-400 uppercase">
              Skills
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
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
                <span className="text-sm text-slate-500">
                  No skills added
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-800">
            Quick Actions
          </h2>

          <div className="space-y-3 mt-5">
            <Link
              to="/student/jobs"
              className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
            >
              <span className="text-xl">💼</span>
              Browse Jobs
            </Link>

            <Link
              to="/student/applications"
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition"
            >
              <span className="text-xl">📄</span>
              My Applications
            </Link>

            <Link
              to="/student/recommendations"
              className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
            >
              <span className="text-xl">🎯</span>
              Recommendations
            </Link>

            <Link
              to="/student/skill-gap"
              className="flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition"
            >
              <span className="text-xl">📚</span>
              Skill Gap
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Applications + Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Applications
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Latest placement activity
              </p>
            </div>

            <Link
              to="/student/applications"
              className="text-sm font-semibold text-blue-600"
            >
              View All →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl">📄</div>
                <p className="font-semibold text-slate-700 mt-3">
                  No applications yet
                </p>
                <Link
                  to="/student/jobs"
                  className="text-sm text-blue-600 font-medium"
                >
                  Explore jobs
                </Link>
              </div>
            ) : (
              applications.slice(0, 3).map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {application.job?.title ||
                        application.jobTitle ||
                        "Job"}
                    </p>

                    <p className="text-sm text-slate-500 truncate">
                      {application.job?.company?.name ||
                        application.companyName ||
                        "Company"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full border text-xs font-bold ${getStatusStyle(
                      application.status
                    )}`}
                  >
                    {application.status || "APPLIED"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recommended For You
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Best matches for your profile
              </p>
            </div>

            <Link
              to="/student/recommendations"
              className="text-sm font-semibold text-blue-600"
            >
              View All →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recommendations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl">🎯</div>
                <p className="font-semibold text-slate-700 mt-3">
                  No recommendations
                </p>
                <Link
                  to="/student/profile"
                  className="text-sm text-blue-600 font-medium"
                >
                  Update profile
                </Link>
              </div>
            ) : (
              recommendations.slice(0, 3).map((job) => (
                <div
                  key={job.jobId}
                  className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {job.jobTitle}
                    </p>

                    <p className="text-sm text-slate-500 truncate">
                      {job.companyName}
                    </p>
                  </div>

                  <span className="shrink-0 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-bold">
                    {job.matchPercentage}% Match
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;