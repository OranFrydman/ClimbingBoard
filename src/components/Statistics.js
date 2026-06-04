import React, { useState, useEffect, useMemo } from 'react';
import Navigation from './Navigation';
import { getUser } from '../utils/auth';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import '../styles/statistics.css';

function durationToSeconds(dur) {
  if (!dur) return 0;
  const [h, m, s] = dur.split(':').map(Number);
  return h * 3600 + m * 60 + (s || 0);
}

function secToMinLabel(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' + s : s}`;
}

function Statistics() {
  const userName = getUser('name');
  const [climbs, setClimbs] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [filters, setFilters] = useState({
    DateStart: '',
    DateFinish: '',
    EasyFilter: false,
    MediumFilter: false,
    HardFilter: false,
  });

  useEffect(() => {
    fetchStats();
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/statistics', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setClimbs(data.climbs || []);
      }
    } catch (e) { console.error('Error fetching stats:', e); }
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) setDashboardData(await res.json());
    } catch (e) { console.error('Error fetching dashboard:', e); }
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
      const res = await fetch('/api/filterStats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: params.toString(),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setClimbs(data.climbs || []);
      }
    } catch (e) { console.error('Filter error:', e); }
  };

  const resetFilters = () => {
    setFilters({ DateStart: '', DateFinish: '', EasyFilter: false, MediumFilter: false, HardFilter: false });
    fetchStats();
  };

  const handleFilterChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const barData = useMemo(() => {
    if (!dashboardData?.avgPerformance?.length) return [];
    const map = {};
    dashboardData.avgPerformance.forEach(row => {
      if (!map[row.board]) map[row.board] = { board: row.board };
      map[row.board][row.level] = Number(row.avg_seconds);
    });
    return Object.values(map);
  }, [dashboardData]);

  const timeSeriesData = useMemo(() =>
    [...climbs].reverse().map(c => ({
      date: c.date ? c.date.split(' - ')[0] : '',
      seconds: durationToSeconds(c.duration),
    })),
  [climbs]);

  const totalClimbs = dashboardData?.totalClimbs ?? '—';
  const avgPerSession = dashboardData?.avgPerSession ?? '—';

  return (
    <div className="statistics-page">
      <Navigation />
      <div className="page-content">
        <h1 className="welcome">Welcome, {userName}</h1>

        <div className="dashboard-section">
          <div className="kpi-row">
            <div className="kpi-card">
              <span className="kpi-label">Total Climbs</span>
              <span className="kpi-value">{totalClimbs}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Avg Climbs / Day</span>
              <span className="kpi-value">{avgPerSession}</span>
            </div>
          </div>

          {barData.length > 0 && (
            <div className="chart-card">
              <h3 className="chart-title">Avg Duration by Board &amp; Level</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="board" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tickFormatter={secToMinLabel} tick={{ fill: '#94a3b8', fontSize: 12 }} width={48} />
                  <Tooltip
                    formatter={(val, name) => [secToMinLabel(val), name.charAt(0).toUpperCase() + name.slice(1)]}
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 13 }} />
                  <Bar dataKey="easy" name="Easy" fill="#4ade80" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="medium" name="Medium" fill="#facc15" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="hard" name="Hard" fill="#f87171" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {timeSeriesData.length > 0 && (
            <div className="chart-card">
              <h3 className="chart-title">Duration per Workout</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={timeSeriesData} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tickFormatter={secToMinLabel} tick={{ fill: '#94a3b8', fontSize: 12 }} width={48} />
                  <Tooltip
                    formatter={(val) => [secToMinLabel(val), 'Duration']}
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line type="monotone" dataKey="seconds" stroke="#818cf8" strokeWidth={2} dot={{ r: 3, fill: '#818cf8' }} name="Duration" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

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
                    <th>Board</th>
                    <th>Mode</th>
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
                        <td>{climb.board || '—'}</td>
                        <td>{climb.mode || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No climbs recorded yet. Start a workout to see your progress!</td>
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
                    <input type="date" name="DateStart" value={filters.DateStart} onChange={handleFilterChange} />
                  </label>
                  <label className="input-label">
                    <span>To</span>
                    <input type="date" name="DateFinish" value={filters.DateFinish} onChange={handleFilterChange} />
                  </label>
                </div>
              </div>
              <div className="filter-block">
                <span className="filter-block-title">Difficulty</span>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input type="checkbox" name="EasyFilter" checked={filters.EasyFilter} onChange={handleFilterChange} />
                    Easy
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="MediumFilter" checked={filters.MediumFilter} onChange={handleFilterChange} />
                    Medium
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="HardFilter" checked={filters.HardFilter} onChange={handleFilterChange} />
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
