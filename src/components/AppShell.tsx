import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../config/env';
import { useAuth } from '../hooks/useAuth';

const LINKS = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/people', label: 'People' },
  { to: '/products', label: 'Products' },
  { to: '/finance', label: 'Finance' },
];

export function AppShell() {
  const { company, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="brand-mark brand-mark--dark">
          <span className="brand-mark__logo" aria-hidden="true">
            {APP_NAME.charAt(0)}
          </span>
          <span>{APP_NAME}</span>
        </div>
        <nav className="app-nav" aria-label="Main">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `app-nav__link${isActive ? ' is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-shell__user">
          <span className="app-shell__company">{company?.companyName}</span>
          <button type="button" className="btn btn--ghost" onClick={() => void handleLogout()}>
            Sign out
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
