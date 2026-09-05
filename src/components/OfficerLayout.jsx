import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/officer/dashboard", icon: "📊" },
  { name: "Students", path: "/officer/students", icon: "👨‍🎓" },
  { name: "Companies", path: "/officer/companies", icon: "🏢" },
  { name: "Jobs", path: "/officer/jobs", icon: "💼" },
  { name: "Applications", path: "/officer/applications", icon: "📄" },
  { name: "Analytics", path: "/officer/analytics", icon: "📈" },
];

function OfficerLayout() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Officer";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col bg-slate-950 text-white md:flex">
        <div className="border-b border-slate-800 px-7 py-6">
          <h1 className="text-2xl font-bold">
            Placement<span className="text-indigo-400">Portal</span>
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Officer Panel
          </p>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            onClick={logout}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="md:ml-72">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8">
          <div>
            <p className="text-sm text-slate-500">
              Placement Management
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              Officer Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {username}
              </p>
              <p className="text-xs text-slate-500">
                Placement Officer
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default OfficerLayout;