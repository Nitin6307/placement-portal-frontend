import { NavLink, Outlet, useNavigate } from "react-router-dom";

function StudentLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/student/dashboard", icon: "🏠" },
    { name: "My Profile", path: "/student/profile", icon: "👤" },
    { name: "Jobs", path: "/student/jobs", icon: "💼" },
    { name: "Applications", path: "/student/applications", icon: "📄" },
    { name: "Recommendations", path: "/student/recommendations", icon: "🎯" },
     { name: "Skill Gap", path: "/student/skill-gap", icon: "📚" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col fixed inset-y-0 left-0">
        <div className="px-6 py-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">🎓 Placement Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Student Panel
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Welcome back</p>
            <p className="font-semibold text-slate-800">
              {localStorage.getItem("username")}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            {localStorage.getItem("username")?.charAt(0).toUpperCase()}
          </div>
        </header>

        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;