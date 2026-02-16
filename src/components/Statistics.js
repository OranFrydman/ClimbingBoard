import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { getUser } from '../utils/auth';
import '../styles/statistics.css';

function Statistics() {
  const userName = getUser('name');
  const [climbs, setClimbs] = useState([]);
  const [filters, setFilters] = useState({
    DateStart: '',
    DateFinish: '',
    EasyFilter: false,
    MediumFilter: false,
    HardFilter: false,
  });

  useEffect(() => {
    // Only fetch stats once when component mounts
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/statistics', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClimbs(data.climbs || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const applyFilters = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append('DateStart', filters.DateStart || '1995-01-01');
    params.append('DateFinish', filters.DateFinish || '2099-12-31');
    if (filters.EasyFilter) params.append('EasyFilter', 'easy');
    if (filters.MediumFilter) params.append('MediumFilter', 'medium');
    if (filters.HardFilter) params.append('HardFilter', 'hard');

    try {
      const response = await fetch('/api/filterStats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: params.toString(),
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setClimbs(data.climbs || []);
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('Filter error:', errData.error || response.statusText);
      }
    } catch (error) {
      console.error('Error filtering stats:', error);
    }
  };

  const resetFilters = () => {
    setFilters({
      DateStart: '',
      DateFinish: '',
      EasyFilter: false,
      MediumFilter: false,
      HardFilter: false,
    });
    fetchStats();
  };

  const handleFilterChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="statistics-page">
      <Navigation />
      <div className="page-content">
        <h1 className="welcome">Welcome, {userName}</h1>
        <div className="statistics-container">
          <div className="table-card">
            <div className="table-section">
              <table className="history-climb">
            <thead>
              <tr>
                <th>Index</th>
                <th>When</th>
                <th>Duration</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {climbs.length > 0 ? (
                climbs.map((climb, index) => (
                  <tr key={index}>
                    <td>{climb.num}</td>
                    <td>{climb.date}</td>
                    <td>{climb.duration}</td>
                    <td>{climb.level}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No climbs recorded yet. Start a workout to see your progress!</td>
                </tr>
              )}
            </tbody>
              </table>
            </div>
          </div>

          <div className="filters-section">
          <form onSubmit={applyFilters} className="filters-form">
            <h2>Filters</h2>
            <div className="filter-block">
              <span className="filter-block-title">Date range</span>
              <div className="input-row">
                <label className="input-label">
                  <span>From</span>
                  <input
                    type="date"
                    name="DateStart"
                    value={filters.DateStart}
                    onChange={handleFilterChange}
                  />
                </label>
                <label className="input-label">
                  <span>To</span>
                  <input
                    type="date"
                    name="DateFinish"
                    value={filters.DateFinish}
                    onChange={handleFilterChange}
                  />
                </label>
              </div>
            </div>
            <div className="filter-block">
              <span className="filter-block-title">Difficulty</span>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="EasyFilter"
                    checked={filters.EasyFilter}
                    onChange={handleFilterChange}
                  />
                  Easy
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="MediumFilter"
                    checked={filters.MediumFilter}
                    onChange={handleFilterChange}
                  />
                  Medium
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="HardFilter"
                    checked={filters.HardFilter}
                    onChange={handleFilterChange}
                  />
                  Hard
                </label>
              </div>
              <p className="filter-hint">Leave all unchecked to include every level.</p>
            </div>
            <div className="filter-actions">
              <button type="submit" className="btn btn-apply">Apply filters</button>
              <button type="button" className="btn btn-reset" onClick={resetFilters}>Reset</button>
            </div>
          </form>
          </div>
        </div>

        <p className="notice">
        *Please notice, guests can see all the other guests' climbs. Register to see your own progress.
        </p>
      </div>
    </div>
  );
}

export default Statistics;
