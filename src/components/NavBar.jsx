import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close menu whenever route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="nav">
      <div className="nav__container">
        <NavLink to="/" className="nav__brand" aria-label="LoLFinder Home">
          <LoLFinderIcon className="nav__logo" />
          <span className="nav__brandText">LOLFINDER</span>
        </NavLink>

        {/* Desktop links */}
        <nav className="nav__links nav__links--desktop" aria-label="Primary navigation">
          <NavItem to="/champions">Browse</NavItem>
          <NavItem to="/about">About</NavItem>
          <NavItem to="/contact">Contact</NavItem>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="nav__burger"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__burgerLine" />
          <span className="nav__burgerLine" />
          <span className="nav__burgerLine" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="nav__mobile" role="menu" aria-label="Mobile navigation">
          <NavItem to="/champions" mobile>
            Browse
          </NavItem>
          <NavItem to="/about" mobile>
            About
          </NavItem>
          <NavItem to="/contact" mobile>
            Contact
          </NavItem>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, children, mobile }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        mobile
          ? isActive
            ? "nav__mobileLink nav__mobileLink--active"
            : "nav__mobileLink"
          : isActive
          ? "nav__link nav__link--active"
          : "nav__link"
      }
    >
      {children}
    </NavLink>
  );
}

function LoLFinderIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 64 64"
      role="img"
      aria-label="LoLFinder icon"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC400" />
          <stop offset="0.55" stopColor="#FF9900" />
          <stop offset="1" stopColor="#FF5A1F" />
        </linearGradient>
      </defs>

      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="14"
        fill="rgba(0,0,0,0.55)"
        stroke="url(#gold)"
        strokeWidth="2"
      />
      <circle cx="30" cy="30" r="12" fill="none" stroke="url(#gold)" strokeWidth="4" />
      <path d="M39 39 L49 49" stroke="url(#gold)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}