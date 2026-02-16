import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { getUser } from '../utils/auth';
import '../styles/homepage.css';

function HomePage() {
  const userName = getUser('name');
  const isGuest = userName === 'Guest';

  return (
    <div className="home-page">
      <Navigation />
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>{isGuest ? 'Welcome to ClimbingBoard' : `Welcome back, ${userName}`}</h1>
          <p>Endurance-focused hangboard training with randomised holds. Build pump and stamina at home.</p>
          <div className="home-ctas">
            <Link to="/Workout" className="btn btn-primary">Start workout</Link>
            <Link to="/Statistics" className="btn btn-secondary">My climbs</Link>
          </div>
        </div>
      </section>
      <main className="home-main">
        <div className="home-cards">
          <div className="home-card">
            <h2 className="card-title">How it works</h2>
            <p>Choose a difficulty (Easy, Medium, Hard), start the timer, and follow the on-screen holds. They change every few seconds to keep the session unpredictable and focused on endurance.</p>
          </div>
          <div className="home-card">
            <h2 className="card-title">Setup</h2>
            <p>Place a box or chair in front of your hangboard and put your laptop on it. Leave space for your feet. During the session, keep your feet on the box as if you’re on a negative slope.</p>
          </div>
          <div className="home-card">
            <h2 className="card-title">Track progress</h2>
            <p>Every session is saved under My Climbs. Filter by date and difficulty to see how your endurance improves over time. Sign in or register to keep your history private.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
