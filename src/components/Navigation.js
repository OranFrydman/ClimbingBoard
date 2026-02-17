import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getGreeting, getUser, isLoggedIn } from '../utils/auth';
import '../styles/navigation.css';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    try {
      const response = await fetch('/LogOut', { method: 'GET', credentials: 'include' });
      if (response.ok) window.location.href = '/HomePage';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleDeleteClimbs = async (e) => {
    e.preventDefault();
    closeMenu();
    try {
      const response = await fetch('/Delete', { credentials: 'include' });
      if (response.ok) window.location.href = '/CrushView?msg=' + encodeURIComponent('All climbs deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = new URLSearchParams({
      LoginUserEmail: form.LoginUserEmail.value,
      LoginPassword: form.LoginPassword.value,
    });
    try {
      const response = await fetch('/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        credentials: 'include',
      });
      if (response.redirected) window.location.href = response.url;
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = new URLSearchParams({
      FullName: form.FullName.value,
      UserEmail: form.UserEmail.value,
      Password: form.Password.value,
    });
    try {
      const response = await fetch('/createNewClimber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        credentials: 'include',
      });
      if (response.redirected) window.location.href = response.url;
      else window.location.href = '/CrushView?msg=' + encodeURIComponent('Account created! Sign in to start.');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <>
      <nav className="nav-bar">
        <Link to="/HomePage" className="nav-brand">ClimbingBoard</Link>

        <div className="nav-links">
          <NavLink to="/HomePage" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/Instructions" className={({ isActive }) => isActive ? 'active' : ''}>Instructions</NavLink>
          <NavLink to="/Workout" className={({ isActive }) => isActive ? 'active' : ''}>Workout</NavLink>
          <NavLink to="/Statistics" className={({ isActive }) => isActive ? 'active' : ''}>My Climbs</NavLink>
          
        </div>

        <div className="nav-actions">
          <span className="greeting">
            {isLoggedIn()
              ? `${getGreeting().replace('!', '')}, ${getUser('name')}`
              : getGreeting()}
          </span>
          <div className="menu-container">
            <input
              type="checkbox"
              id="menu-toggle"
              checked={menuOpen}
              onChange={(e) => setMenuOpen(e.target.checked)}
            />
            <label htmlFor="menu-toggle" className="menu-trigger" aria-label="Menu">
              <span className="icon" />
            </label>
            <div className="dropdown">
              <div className="nav-mobile-links">
                <Link to="/HomePage" className="dropdown-item" onClick={closeMenu}>Home</Link>
                <Link to="/Instructions" className="dropdown-item" onClick={closeMenu}>Instructions</Link>
                <Link to="/Workout" className="dropdown-item" onClick={closeMenu}>Workout</Link>
                <Link to="/Statistics" className="dropdown-item" onClick={closeMenu}>My Climbs</Link>
                
                <div className="dropdown-divider" />
              </div>
              {isLoggedIn() ? (
                <>
                  <div className="dropdown-divider" />
                  <button type="button" className="dropdown-item" onClick={handleDeleteClimbs}>Delete all my climbs</button>
                  <button type="button" className="dropdown-item" onClick={handleLogout}>Log out</button>
                </>
              ) : (
                <>
                  <button type="button" className="dropdown-item" onClick={() => { setShowLogin(true); closeMenu(); }}>Sign in</button>
                  <button type="button" className="dropdown-item" onClick={() => { setShowRegister(true); closeMenu(); }}>Register</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowLogin(false)} aria-label="Close">×</button>
            <h2>Sign in</h2>
            <form onSubmit={submitLogin}>
              <label htmlFor="LoginUserEmail">Email</label>
              <input type="email" id="LoginUserEmail" name="LoginUserEmail" required />
              <label htmlFor="LoginPassword">Password</label>
              <input type="password" id="LoginPassword" name="LoginPassword" required />
              <button type="submit" className="btn btn-primary">Sign in</button>
            </form>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowRegister(false)} aria-label="Close">×</button>
            <h2>Create account</h2>
            <form onSubmit={submitRegister}>
              <label htmlFor="FullName">Full name</label>
              <input type="text" id="FullName" name="FullName" required />
              <label htmlFor="UserEmail">Email</label>
              <input type="email" id="UserEmail" name="UserEmail" required />
              <label htmlFor="Password">Password</label>
              <input type="password" id="Password" name="Password" required />
              <button type="submit" className="btn btn-primary">Register</button>
            </form>
          </div>
        </div>
      )}

      {false && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content instructions" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowAbout(false)} aria-label="Close">×</button>
            <h2>How to use ClimbingBoard</h2>
            <div className="instructions-content">
              <p>ClimbingBoard gives you randomised in-home hangboard sessions focused on endurance and pump rather than max finger strength.</p>
              <p>Set up a box or chair in front of your hangboard. Put your laptop on it and leave room for your feet. During the session, keep your feet on the box as if you’re on a negative slope.</p>
              <p>Pick a difficulty (Easy, Medium, Hard), start the timer, and follow the on-screen holds. When you’re done, stop the session and your climb will be saved to My Climbs.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;
