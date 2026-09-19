import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [["Dashboard", "/dashboard"], ["New prediction", "/predict"], ["History", "/history"]];

export default function Layout() {
  const { user, logout } = useAuth();
  return <div className="min-h-screen bg-mist text-ink">
    <header className="border-b border-ink/10 bg-mist/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5 lg:px-8">
        <Link to="/dashboard" className="font-display text-2xl font-bold tracking-tight">Fire<span className="text-ember">Guard</span></Link>
        <nav className="hidden items-center gap-6 md:flex">{links.map(([label, href]) => <NavLink key={href} to={href} className={({ isActive }) => `text-sm font-bold ${isActive ? "text-ember" : "text-ink/60 hover:text-ink"}`}>{label}</NavLink>)}</nav>
        <div className="flex items-center gap-3"><span className="hidden text-sm text-ink/60 sm:inline">{user?.name}</span><button onClick={logout} className="rounded-full border border-ink/20 px-4 py-2 text-sm font-bold hover:border-ember hover:text-ember">Log out</button></div>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-5 pb-4 md:hidden">{links.map(([label, href]) => <NavLink key={href} to={href} className={({ isActive }) => `whitespace-nowrap text-sm font-bold ${isActive ? "text-ember" : "text-ink/60"}`}>{label}</NavLink>)}</nav>
    </header>
    <main><Outlet /></main>
  </div>;
}
