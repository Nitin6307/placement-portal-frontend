import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setIsError(false);

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser(username, password);

      setMessage("Registration successful!");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.error || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-10 md:p-14 flex flex-col justify-center">
          <div className="text-4xl mb-6">🎓</div>

          <h1 className="text-4xl font-bold mb-5">
            Start Your Journey
          </h1>

          <p className="text-blue-100 text-lg leading-relaxed">
            Create your student account and discover placement
            opportunities that match your skills and profile.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </span>
              <span>Build your placement profile</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </span>
              <span>Discover suitable jobs</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </span>
              <span>Track your applications</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="p-8 md:p-14 flex flex-col justify-center">

          <h2 className="text-3xl font-bold text-slate-800">
            Create account
          </h2>

          <p className="text-slate-500 mt-2 mb-8">
            Register as a student to get started.
          </p>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-200"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {message && (
            <div
              className={`mt-5 p-3 rounded-xl text-sm ${
                isError
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {message}
            </div>
          )}

          <p className="text-center text-sm text-slate-500 mt-7">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;