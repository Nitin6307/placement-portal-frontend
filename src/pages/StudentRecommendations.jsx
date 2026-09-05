import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyRecommendations,
  getMyApplications,
} from "../api/studentApi";

function StudentRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);

      const [recommendationData, applicationData] = await Promise.all([
        getMyRecommendations(),
        getMyApplications(),
      ]);

      setRecommendations(recommendationData || []);
      setApplications(applicationData || []);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const isApplied = (jobId) => {
    return applications.some(
      (application) =>
        application.job?.id === jobId ||
        application.jobId === jobId
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-blue-600">
          Career Matching
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-1">
          Recommended Jobs
        </h1>

        <p className="text-slate-500 mt-2">
          Jobs that best match your academic profile and skills.
        </p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">

        <StatCard
          label="Recommended Jobs"
          value={recommendations.length}
          icon="🎯"
        />

        <StatCard
          label="Applied Jobs"
          value={applications.length}
          icon="📄"
        />

        <StatCard
          label="Best Match"
          value={
            recommendations.length > 0
              ? `${Math.max(
                  ...recommendations.map(
                    (job) => job.matchPercentage || 0
                  )
                )}%`
              : "0%"
          }
          icon="⭐"
        />
      </div>

      {/* Recommendations */}
      {recommendations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="text-6xl mb-5">🎯</div>

          <h2 className="text-2xl font-bold text-slate-800">
            No matching jobs yet
          </h2>

          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            We couldn't find jobs matching your current academic
            profile and skills. Keep your profile updated to improve
            your recommendations.
          </p>

          <Link
            to="/student/profile"
            className="inline-flex mt-6 px-6 py-3 rounded-xl
                       bg-blue-600 text-white font-semibold
                       hover:bg-blue-700 transition"
          >
            Update Profile
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {recommendations.map((job) => {
            const applied = isApplied(job.jobId);

            return (
              <div
                key={job.jobId}
                className="bg-white rounded-3xl border border-slate-200
                           shadow-sm p-6 hover:shadow-md transition"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-sm font-semibold text-blue-600">
                      {job.companyName}
                    </p>

                    <h2 className="text-xl font-bold text-slate-800 mt-1">
                      {job.jobTitle}
                    </h2>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50
                                    flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">
                        {job.matchPercentage}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      Match
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid sm:grid-cols-2 gap-3 mt-6">

                  <Detail
                    icon="💰"
                    label="Package"
                    value={`₹${job.packageLpa} LPA`}
                  />

                  <Detail
                    icon="📍"
                    label="Location"
                    value={job.location || "Not specified"}
                  />

                </div>

                {/* Match bar */}
                <div className="mt-6">

                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">
                      Profile Match
                    </span>

                    <span className="font-semibold text-blue-600">
                      {job.matchPercentage}%
                    </span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${Math.min(
                          Math.max(job.matchPercentage || 0, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">

                  <Link
                    to="/student/jobs"
                    className="flex-1 text-center px-5 py-3
                               rounded-xl border border-slate-300
                               text-slate-700 font-semibold
                               hover:bg-slate-50 transition"
                  >
                    View Job
                  </Link>

                  {applied ? (
                    <Link
                      to="/student/applications"
                      className="flex-1 text-center px-5 py-3
                                 rounded-xl bg-green-100
                                 text-green-700 font-semibold"
                    >
                      ✓ Applied
                    </Link>
                  ) : (
                    <Link
                      to="/student/jobs"
                      className="flex-1 text-center px-5 py-3
                                 rounded-xl bg-blue-600
                                 text-white font-semibold
                                 hover:bg-blue-700 transition"
                    >
                      View & Apply
                    </Link>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200
                    shadow-sm p-5">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="text-2xl font-bold text-slate-800 mt-1">
            {value}
          </p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="text-xl">{icon}</div>

      <p className="text-xs text-slate-400 mt-2">
        {label}
      </p>

      <p className="font-semibold text-slate-700 mt-1">
        {value}
      </p>
    </div>
  );
}

export default StudentRecommendations;