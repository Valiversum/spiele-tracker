import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/spiele', label: 'Spiele' },
  { to: '/wertung', label: 'Gesamtwertung' },
  { to: '/notizen', label: 'Notizen' },
]

export function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">🎲 Anja & Valentin</div>
      <div className="navbar-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            end={link.to === '/'}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
