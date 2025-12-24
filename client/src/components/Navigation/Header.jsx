import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import logo from "../../assets/BINGEBOX.png";
import GlobalSearch from "./GlobalSearch";

function Header({ moviesData = [], seriesData = [] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // false = dark (default), true = light
  const [isLightMode, setIsLightMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved === "light") return true;
    return false; // dark is the default
  });
  const location = useLocation();
  const profileWrapperRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.admin === "yes";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileWrapperRef.current &&
        !profileWrapperRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleProfileMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsProfileDropdownOpen(true);
  };

  const handleProfileMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsProfileDropdownOpen(false);
    }, 180);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Sync the `.light` class on <html> whenever theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    if (isLightMode) {
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        id="floatingHeader"
        role="banner"
        className="fixed top-0 left-0 right-0 z-30 max-w-[1240px] w-full px-8 mx-auto rounded-b-3xl py-3 md:py-4 flex items-center justify-between bg-brand-surface/30 backdrop-blur-lg border-x border-b border-brand-border/40 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
      >
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" aria-label="BingeBox Home">
            <img
              src={logo}
              alt="BingeBox Logo"
              className="w-[120px] sm:w-[135px] md:w-[150px] drop-shadow-[0_6px_18px_rgba(0,0,0,0.5)]"
            />
          </Link>
        </div>

        <nav
          role="navigation"
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-4 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          <Link
            to="/"
            aria-current={isActive("/") ? "page" : undefined}
            className={`text-xl px-4 py-2 rounded-full border border-transparent transition duration-300 hover:text-white hover:border-white/20 hover:bg-white/10 hover:backdrop-blur-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] ${
              isActive("/") ? "text-white" : "text-white/80"
            }`}
          >
            Home
          </Link>
          <Link
            to="/overview"
            className={`text-xl px-4 py-2 rounded-full border border-transparent transition duration-300 hover:text-white hover:border-white/20 hover:bg-white/10 hover:backdrop-blur-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] ${
              isActive("/overview") ? "text-white" : "text-white/80"
            }`}
          >
            Explore
          </Link>
          <Link
            to="/support"
            className="text-xl text-white/80 px-4 py-2 rounded-full border border-transparent transition duration-300 hover:text-white hover:border-white/20 hover:bg-white/10 hover:backdrop-blur-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Support
          </Link>
          <Link
            to="/subscription"
            className="text-xl text-white/80 px-4 py-2 rounded-full border border-transparent transition duration-300 hover:text-white hover:border-white/20 hover:bg-white/10 hover:backdrop-blur-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Subscriptions
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          <GlobalSearch moviesData={moviesData} seriesData={seriesData} />

          {/* Theme toggle button */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="hidden lg:flex w-10 h-10 rounded-md bg-white/6 backdrop-blur-md border border-white/10 hover:bg-white/12 hover:shadow-[0_0_10px_rgba(79,195,247,0.12)] transition items-center justify-center"
          >
            {isLightMode ? (
              <svg
                className="w-5 h-5 text-white/90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.64 5.64L4.22 4.22M19.78 19.78l-1.42-1.42M19.78 4.22l-1.42 1.42M5.64 18.36l-1.42 1.42" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-white/90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

            {/* <button
              type="button"
              aria-label="Notifications"
              className="p-2 rounded-md bg-white/6 backdrop-blur-md border border-white/10 hover:bg-white/12 hover:shadow-[0_0_10px_rgba(79,195,247,0.12)] transition"
            >
              <svg
                className="w-5 h-5 text-white/90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button> */}

          {!user ? (
            <Link
              to="/auth"
              className="hidden lg:inline-block px-4 py-1.5 text-sm md:text-base text-white/90 border border-white/10 rounded-3xl bg-white/6 backdrop-blur-md hover:text-brand-primary hover:bg-white/12 hover:shadow-[0_0_12px_rgba(79,195,247,0.12)] transition"
            >
              Sign In
            </Link>
          ) : (
            <span className="hidden lg:inline-block text-white/90 pr-1 py-1.5">
              {user.fullName || user.email}
            </span>
          )}

          {user && (
            <div
              ref={profileWrapperRef}
              className="relative hidden lg:block"
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              <button
                onClick={handleProfileClick}
                type="button"
                aria-label="User profile menu"
                aria-haspopup="true"
                aria-expanded={isProfileDropdownOpen}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/6 backdrop-blur-md border border-white/10 hover:bg-white/12 hover:shadow-[0_0_10px_rgba(79,195,247,0.12)] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 200"
                  className="w-8 h-8"
                  fill={isLightMode ? "#3a506b" : "white"}
                  aria-hidden="true"
                >
                  <path d="M135.832 140.848h-70.9c-2.9 0-5.6-1.6-7.4-4.5-1.4-2.3-1.4-5.7 0-8.6l4-8.2c2.8-5.6 9.7-9.1 14.9-9.5 1.7-.1 5.1-.8 8.5-1.6 2.5-.6 3.9-1 4.7-1.3-.2-.7-.6-1.5-1.1-2.2-6-4.7-9.6-12.6-9.6-21.1 0-14 9.6-25.3 21.5-25.3s21.5 11.4 21.5 25.3c0 8.5-3.6 16.4-9.6 21.1-.5.7-.9 1.4-1.1 2.1.8.3 2.2.7 4.6 1.3 3 .7 6.6 1.3 8.4 1.5 5.3.5 12.1 3.8 14.9 9.4l3.9 7.9c1.5 3 1.5 6.8 0 9.1-1.6 2.9-4.4 4.6-7.2 4.6zm-35.4-78.2c-9.7 0-17.5 9.6-17.5 21.3 0 7.4 3.1 14.1 8.2 18.1.1.1.3.2.4.4 1.4 1.8 2.2 3.8 2.2 5.9 0 .6-.2 1.2-.7 1.6-.4.3-1.4 1.2-7.2 2.6-2.7.6-6.8 1.4-9.1 1.6-4.1.4-9.6 3.2-11.6 7.3l-3.9 8.2c-.8 1.7-.9 3.7-.2 4.8.8 1.3 2.3 2.6 4 2.6h70.9c1.7 0 3.2-1.3 4-2.6.6-1 .7-3.4-.2-5.2l-3.9-7.9c-2-4-7.5-6.8-11.6-7.2-2-.2-5.8-.8-9-1.6-5.8-1.4-6.8-2.3-7.2-2.5-.4-.4-.7-1-.7-1.6 0-2.1.8-4.1 2.2-5.9.1-.1.2-.3.4-.4 5.1-3.9 8.2-10.7 8.2-18-.2-11.9-8-21.5-17.7-21.5z" />
                </svg>
              </button>

              <div
                role="menu"
                aria-label="User profile menu"
                className={`absolute right-0 top-full mt-2 w-[180px] bg-brand-surface/70 backdrop-blur-md border border-brand-border/50 rounded-lg shadow-lg z-40 ${
                  isProfileDropdownOpen ? "block" : "hidden"
                }`}
              >
                <Link
                  to="/settings"
                  role="menuitem"
                  className="block px-4 py-3 text-white/80 hover:text-brand-primary hover:bg-brand-border/40 transition"
                >
                  Settings
                </Link>
                <Link
                  to="/profile"
                  role="menuitem"
                  className="block px-4 py-3 text-white/80 hover:text-brand-primary hover:bg-brand-border/40 transition"
                >
                  Profile
                </Link>
                {user.admin === "yes" && (
                  <Link
                    to="/admin"
                    role="menuitem"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-3 text-white/80 hover:text-brand-primary hover:bg-brand-border/40 transition"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/"
                  role="menuitem"
                  onClick={() => {
                    localStorage.removeItem("user"); // clear user session
                    setIsProfileDropdownOpen(false); // close dropdown
                    dispatch(logout()); // update global auth state
                  }}
                  className="block px-4 py-3 text-white/80 hover:text-brand-primary hover:bg-brand-border/40 transition"
                >
                  Sign Out
                </Link>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            aria-label="Open mobile menu"
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden w-10 h-10 ml-1 rounded-md bg-white/6 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/12 transition"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-neutral-dark/60"
            aria-hidden="true"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div
            className="absolute right-0 top-0 h-full w-72 bg-brand-background border-l border-brand-border p-4 overflow-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex items-center justify-between mb-4">
              <img src={logo} className="w-36 h-auto" alt="BingeBox logo" />
              {/* Theme toggle inside mobile menu */}
              <button
                type="button"
                aria-label="Toggle theme (visual only)"
                onClick={toggleTheme}
                className="w-10 h-10 mr-2 rounded-md bg-white/10 border border-white/20 flex items-center justify-center"
              >
                {isLightMode ? (
                  <svg
                    className="w-5 h-5 text-white/90"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.64 5.64L4.22 4.22M19.78 19.78l-1.42-1.42M19.78 4.22l-1.42 1.42M5.64 18.36l-1.42 1.42" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-white/90"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                type="button"
                aria-label="Close mobile menu"
                className="w-10 h-10 rounded-md border border-white/20 bg-white/10 hover:cursor-pointer"
              >
                X
              </button>
            </div>
            <nav
              role="navigation"
              aria-label="Mobile navigation"
              className="flex flex-col gap-3"
            >
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive("/") ? "page" : undefined}
                className={`py-3 px-3 rounded-lg ${
                  isActive("/")
                    ? "text-white bg-white/10"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                Home
              </Link>
              <Link
                to="/overview"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/80 py-3 px-3 rounded-lg hover:bg-white/10"
              >
                Explore
              </Link>
              <Link
                to="/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/80 py-3 px-3 rounded-lg hover:bg-white/10"
              >
                Support
              </Link>
              <Link
                to="/subscription"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/80 py-3 px-3 rounded-lg hover:bg-white/10"
              >
                Subscriptions
              </Link>
              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white py-3 px-3 rounded-lg bg-white/10"
                >
                  Sign In
                </Link>
              ) : (
                <>
                  {/* User name as a simple label at the top, not styled like a button */}
                  <div className="px-3 pb-2 text-white/90 font-semibold border-b border-white/10 mb-2">
                    {user.fullName || user.email}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/80 py-3 px-3 rounded-lg hover:bg-white/10"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/80 py-3 px-3 rounded-lg hover:bg-white/10"
                  >
                    Settings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white/80 py-3 px-3 rounded-lg hover:bg-white/10"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/"
                    role="menuitem"
                    onClick={() => {
                      localStorage.removeItem("user"); // clear user session
                      setIsMobileMenuOpen(false); // close mobile menu
                      dispatch(logout()); // update global auth state
                    }}
                    className="text-white py-3 px-3 rounded-lg bg-white/10"
                  >
                    Sign Out
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
