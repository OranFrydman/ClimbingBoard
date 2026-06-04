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
            <div className="auth-divider"><span>or</span></div>
            <a href="/auth/google" className="btn-google">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </a>
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
              <p className="form-note">Email can be fake or disposable.</p>
              <label htmlFor="Password">Password</label>
              <input type="password" id="Password" name="Password" required />
              <p className="form-note">Passwords are not encrypted. Please use a non-meaningful password (e.g. only for this app).</p>
              <button type="submit" className="btn btn-primary">Register</button>
            </form>
            <div className="auth-divider"><span>or</span></div>
            <a href="/auth/google" className="btn-google">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </a>
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
