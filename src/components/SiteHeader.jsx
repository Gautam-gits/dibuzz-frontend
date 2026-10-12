import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './ui';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/programs', label: 'Programs' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const linkClass = ({ isActive }) =>
  `rounded-control px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'text-brand' : 'text-muted hover:text-navy'
  }`;

export function SiteHeader({ currentUser, openAuthModal, logout }) {
  const [open, setOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin';
  const close = () => setOpen(false);

  const renderLogo = (className = '') => (
    <Link to="/" onClick={close} className={`flex items-center gap-2 ${className}`} aria-label="DIBUZZ home">
      <img src="/logo-mark.png" alt="" className="h-10 w-10 object-contain" />
      <span className="text-xl font-extrabold tracking-tight text-navy max-[379px]:hidden">DIBUZZ</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      {/* Phones and tablets: menu icon, logo, Explore Programs */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:px-6 xl:hidden">
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-navy hover:bg-soft"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        {renderLogo('min-w-0')}
        <Button as={Link} to="/programs" onClick={close} className="ml-auto min-h-10 shrink-0 px-3 text-xs sm:px-5 sm:text-sm">
          <span className="max-[359px]:hidden">Explore Programs</span>
          <span className="min-[360px]:hidden">Programs</span>
        </Button>
      </div>

      {/* Large screens */}
      <div className="mx-auto hidden h-16 max-w-7xl items-center justify-between gap-4 px-8 xl:flex">
        {renderLogo()}
        <nav className="flex items-center gap-1" aria-label="Main">
          {LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <Button as={Link} to={isAdmin ? '/admin' : '/dashboard'} variant="ghost">
                {isAdmin ? 'DIBUZZ Admin' : 'My Learning'}
              </Button>
              <Button variant="ghost" onClick={logout}>Sign out</Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => openAuthModal('login')}>Sign in</Button>
          )}
          <Button as={Link} to="/programs">Explore Programs</Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-4 pb-4 pt-2 xl:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {[...LINKS, { to: '/verify', label: 'Verify Certificate' }].map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={close} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            {currentUser ? (
              <>
                <Button as={Link} to={isAdmin ? '/admin' : '/dashboard'} variant="secondary" onClick={close}>
                  {isAdmin ? 'DIBUZZ Admin' : 'My Learning'}
                </Button>
                <Button variant="ghost" onClick={() => { close(); logout(); }}>Sign out</Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => { close(); openAuthModal('login'); }}>Sign in</Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
