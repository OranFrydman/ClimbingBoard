import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import '../styles/instructions.css';

function Instructions() {
  return (
    <div className="instructions-page">
      <Navigation />
      <main className="instructions-main">
        <h1 className="instructions-title">How to use the fingerboard</h1>
        <p className="instructions-intro">
          ClimbingBoard gives you randomised in-home hangboard sessions focused on endurance and pump rather than max finger strength. Follow the steps below to set up and get the most out of your sessions.
        </p>

        <section className="instructions-section">
          <h2>1. Setup: chair and screen</h2>
          <p>
            Place a box or chair in front of your hangboard and put your laptop (or device) on it. Leave enough space for your feet in front of the chair. During the session, keep your feet on the box or floor in front of the chair as if you’re on a negative slope—this keeps tension and helps simulate climbing.
          </p>
          <div className="instructions-figures-row">
            <figure className="instructions-figure instructions-figure--chair">
              <img
                src="/MEDIA/Instructions/instructions_chair.png"
                alt="How to place the chair in front of the hangboard with space for your feet"
                className="instructions-img"
              />
              <figcaption>Place the chair in front of the board with room for your feet.</figcaption>
            </figure>
            <figure className="instructions-figure instructions-figure--climber">
              <img
                src="/MEDIA/Instructions/instructions_climber.png"
                alt="Climber position during a hangboard session"
                className="instructions-img"
              />
              <figcaption>Feet on the box, follow the on-screen holds.</figcaption>
            </figure>
          </div>
        </section>

        <section className="instructions-section">
          <h2>2. Choose your board and difficulty</h2>
          <p>
            On the <Link to="/Workout">Workout</Link> page, select your hangboard from the dropdown (e.g. BeastMaker 1000, Tavor). Then pick a difficulty:
          </p>
          <ul>
            <li><strong>Easy</strong> — longer holds, less intensity. Good for warm-ups or recovery.</li>
            <li><strong>Medium</strong> — balanced hold difficulty and timing.</li>
            <li><strong>Hard</strong> — harder holds and/or shorter rest. Builds endurance and pump.</li>
          </ul>
        </section>

        <section className="instructions-section">
          <h2>3. Run a session</h2>
          <p>
            Start the timer and follow the on-screen holds. The app will show you which hold to use for each hand. Holds change every few seconds so the session stays unpredictable and focused on endurance. Keep your feet on the box or floor as described above. When you’re done, stop the session—your climb will be saved automatically.
          </p>
        </section>

        <section className="instructions-section">
          <h2>4. Track your progress</h2>
          <p>
            Every session is saved under <Link to="/Statistics">My Climbs</Link>. You can filter by date and difficulty to see how your endurance improves over time. Sign in or register to keep your history private and synced to your account.
          </p>
        </section>

        <div className="instructions-cta">
          <Link to="/Workout" className="btn btn-primary">Go to Workout</Link>
        </div>
      </main>
    </div>
  );
}

export default Instructions;
