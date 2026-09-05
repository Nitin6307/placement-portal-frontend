import { useEffect, useState } from "react";
import api from "../api/axios";

function OfficerStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (err) {
      console.error("Students API error:", err);
      setError(
        err.response?.data?.error || "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-blue-600">
          Placement Management
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Students
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage registered student profiles.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Branch
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    CGPA
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Backlogs
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Graduation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Skills
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                          {student.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {student.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        {student.branch || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-700">
                      {student.cgpa ?? "-"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`font-semibold ${
                          student.backlogs > 0
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {student.backlogs ?? 0}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {student.graduationYear || "-"}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex max-w-xs flex-wrap gap-1.5">
                        {student.skills?.length > 0 ? (
                          student.skills.map((skill) => (
                            <span
                              key={skill.id || skill.name}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                              {skill.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">
                            No skills
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center text-slate-500"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
            Total students:{" "}
            <span className="font-semibold text-slate-700">
              {students.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfficerStudents;