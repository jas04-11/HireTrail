import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Menu, X, LogOut, User, LayoutDashboard, Bookmark } from "lucide-react";
import Logo from "../common/Logo";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />

        <div className="hidden md:flex items-center gap-1">
          <Link to="/explore" className="btn-text px-3 py-2">Explore</Link>
          <Link to="/companies" className="btn-text px-3 py-2">Companies</Link>
        </div>

        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, role, tech..."
              className="input-field !pl-9 text-sm"
            />
          </div>
        </form>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/experiences/new" className="btn-primary text-sm">
                <Plus size={15} /> Share experience
              </Link>
              <NotificationBell />
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-sm"
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-11 z-50 w-52 card p-1.5">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <MenuLink to="/dashboard" icon={<LayoutDashboard size={15} />} onClick={() => setMenuOpen(false)}>
                      Dashboard
                    </MenuLink>
                    <MenuLink to={`/profile/${user?._id}`} icon={<User size={15} />} onClick={() => setMenuOpen(false)}>
                      My profile
                    </MenuLink>
                    <MenuLink to="/bookmarks" icon={<Bookmark size={15} />} onClick={() => setMenuOpen(false)}>
                      Bookmarks
                    </MenuLink>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-text px-3 py-2">Log in</Link>
              <Link to="/register" className="btn-primary text-sm">Get started</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-700" onClick={() => setMobileOpen((o) => !o)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex flex-col gap-1 px-4 py-4">
            <form onSubmit={handleSearch} className="mb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company, role, tech..."
                className="input-field text-sm"
              />
            </form>
            <Link to="/explore" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Explore
            </Link>
            <Link to="/companies" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Companies
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/experiences/new" onClick={() => setMobileOpen(false)} className="btn-primary mt-2 w-full">
                  <Plus size={15} /> Share experience
                </Link>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-left rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  Log out
                </button>
              </>
            ) : (
              <div className="flex gap-2 mt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1">Log in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1">Get started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const MenuLink = ({ to, icon, children, onClick }) => (
  <Link to={to} onClick={onClick} className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
    {icon} {children}
  </Link>
);

export default Navbar;
