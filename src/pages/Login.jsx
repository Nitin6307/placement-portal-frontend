import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const getRoleFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await loginUser(username, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      const role = getRoleFromToken(data.token);
      localStorage.setItem("role", role);

      if (role === "ROLE_OFFICER") {
        navigate("/officer/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left side */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-10">
            <div className="text-3xl mb-6">🎓</div>

            <h1 className="text-4xl font-bold mb-5">Placement Portal</h1>

            <p className="text-blue-100 text-lg leading-relaxed">
              Discover placement opportunities, track applications, analyze your
              skills, and build your career.
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </span>
              <span>Find the right placement opportunities</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </span>
              <span>Track your applications</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </span>
              <span>Analyze your skills and eligibility</span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-800">Welcome back</h2>

          <p className="text-slate-500 mt-2 mb-8">
            Sign in to continue to your account.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-200"
            >
              Sign In
            </button>
          </form>

          {message && (
            <div className="mt-5 p-3 rounded-xl bg-blue-50 text-blue-600 text-sm">
              {message}
            </div>
          )}

          <p className="text-center text-sm text-slate-500 mt-7">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
