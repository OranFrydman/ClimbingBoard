import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Navigation from './Navigation';
import { getUser } from '../utils/auth';
import { fetchBoard, getBoardList } from '../utils/boardLoader';
import { getInitialHoldState, computeNextHoldChange } from '../utils/workoutAlgorithm';
import { getHoldVisual } from '../data/holdVisuals';
import { getBoardImageUrl } from '../data/boards/boardImages';
import '../styles/workout.css';

const HOLD_CHANGE_INTERVAL_MS = 4000;
/** Seconds to wait in the "Start another session?" modal before auto-redirecting to My Climbs */
const AFTER_SESSION_REDIRECT_SECONDS = 30;
/** Placeholder value for "no board selected" – must not be a real board id */
const CHOOSE_BOARD_VALUE = '__choose_board__';

/** Options for board dropdown: placeholder first, then real boards (order ensures "Choose Board" on load) */
function getBoardOptions() {
  return [{ id: CHOOSE_BOARD_VALUE, name: 'Choose Board' }, ...getBoardList()];
}

function Workout() {
  const userName = getUser('name');
  const boardOptions = getBoardOptions();
  const [selectedBoardId, setSelectedBoardId] = useState(CHOOSE_BOARD_VALUE);
  const [board, setBoard] = useState(null);
  useEffect(() => {
    if (!selectedBoardId || selectedBoardId === CHOOSE_BOARD_VALUE) {
      setBoard(null);
      return;
    }
    let cancelled = false;
    fetchBoard(selectedBoardId).then((b) => {
      if (!cancelled) setBoard(b);
    });
    return () => { cancelled = true; };
  }, [selectedBoardId]);
  const [level, setLevel] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [visibleHolds, setVisibleHolds] = useState({});
  const timerRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const holdStateRef = useRef(null);
  const [showAfterSessionModal, setShowAfterSessionModal] = useState(false);
  const [afterSessionCountdown, setAfterSessionCountdown] = useState(AFTER_SESSION_REDIRECT_SECONDS);
  const afterSessionIntervalRef = useRef(null);

  const handleBoardChange = (e) => {
    const id = e.target.value || CHOOSE_BOARD_VALUE;
    if (!isRunning) {
      setSelectedBoardId(id);
      setVisibleHolds({});
      holdStateRef.current = null;
    }
  };

  const playBeepSound = () => {
    const audio = new Audio('/MEDIA/beep.wav');
    audio.play().catch(() => {});
  };

  const applyHoldStateToVisible = (state) => {
    if (!board) return;
    const leftHold = board.getHoldByIndex(state.leftIndex);
    const rightHold = board.getHoldByIndex(state.rightIndex);
    const ids = {};
    if (leftHold) ids[leftHold.displayId] = true;
    if (rightHold) ids[rightHold.displayId] = true;
    setVisibleHolds(ids);
  };

  const startSession = () => {
    if (!board || level < 1) return;
    const initial = getInitialHoldState(board, level);
    holdStateRef.current = initial;
    applyHoldStateToVisible(initial);
  };

  const tickHoldChange = () => {
    if (!board || level < 1 || !holdStateRef.current) return;
    const next = computeNextHoldChange(board, level, holdStateRef.current);
    holdStateRef.current = next;
    applyHoldStateToVisible(next);
    if (next.changed) playBeepSound();
  };

  const handleLevelSelect = (lvl) => {
    if (!isRunning) {
      setLevel(lvl);
      setSelectedLevel(lvl);
    }
  };

  const handleStartStop = () => {
    if (!board) {
      alert('Please select a board first');
      return;
    }
    if (level === 0) {
      alert('Please choose your level difficulty first');
      return;
    }

    if (!isRunning) {
      setIsRunning(true);
      startSession();
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 59) {
            setMinutes((m) => m + 1);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      holdIntervalRef.current = setInterval(tickHoldChange, HOLD_CHANGE_INTERVAL_MS);
    } else {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      submitWorkout();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setMinutes(0);
    setLevel(0);
    setSelectedLevel(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdStateRef.current = null;
    setVisibleHolds({});
  };

  const buildDuration = (min, sec) => {
    const m = min >= 10 ? String(min) : '0' + min;
    const s = sec >= 10 ? String(sec) : '0' + sec;
    return `00:${m}:${s}`;
  };

  const submitWorkout = async () => {
    if (!level || level === 0) {
      alert('Please select a difficulty level');
      return;
    }
    if (minutes === 0 && seconds === 0) {
      alert('Workout duration cannot be zero');
      return;
    }
    const duration = buildDuration(minutes, seconds);
    const body = new URLSearchParams({
      ChosenLevel: level.toString(),
      TimeStamp: duration,
    });
    try {
      const response = await fetch('/createNewRecords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        credentials: 'include',
      });
      if (response.ok || response.redirected) {
        setShowAfterSessionModal(true);
      } else {
        alert('Error saving workout. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting workout: ' + err.message);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showAfterSessionModal) return;
    setAfterSessionCountdown(AFTER_SESSION_REDIRECT_SECONDS);
    const id = setInterval(() => {
      setAfterSessionCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(afterSessionIntervalRef.current);
          window.location.href = '/Statistics';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    afterSessionIntervalRef.current = id;
    return () => {
      clearInterval(id);
      afterSessionIntervalRef.current = null;
    };
  }, [showAfterSessionModal]);

  const formatTime = (min, sec) => {
    const m = min < 10 ? '0' + min : min;
    const s = sec < 10 ? '0' + sec : sec;
    return `${m} : ${s}`;
  };

  const getLevelButtonClass = (btnLevel) =>
    selectedLevel === btnLevel ? 'grade-btn selected' : 'grade-btn';

  const clearAfterSessionCountdown = () => {
    if (afterSessionIntervalRef.current) {
      clearInterval(afterSessionIntervalRef.current);
      afterSessionIntervalRef.current = null;
    }
  };

  const handleStartAnotherSession = () => {
    clearAfterSessionCountdown();
    setShowAfterSessionModal(false);
    setSeconds(0);
    setMinutes(0);
  };

  const handleGoToMyClimbs = () => {
    clearAfterSessionCountdown();
    window.location.href = '/Statistics';
  };

  const deviceSectionStyle = board
    ? (() => {
        const url = getBoardImageUrl(board.id);
        const style = url ? { backgroundImage: `url(${url})` } : {};
        if (board.aspectRatio) {
          style['--aspect'] = String(board.aspectRatio);
        }
        return Object.keys(style).length ? style : undefined;
      })()
    : undefined;

  if (isRunning) {
    const climbingScreen = (
      <div className="workout-climbing-screen">
        <div className="workout-climbing-board-wrap">
          <div
            className="workout-climbing-board"
            style={deviceSectionStyle}
          >
          <div className="device-container device-container--fullscreen">
            {board?.holds?.map((hold) => {
              const showHold = board.dev || visibleHolds[hold.displayId];
              if (!showHold) return null;
              const visual = getHoldVisual(hold.type, board.id);
              const style = board.positionToPercent(hold.position);
              return (
                <div
                  key={hold.displayId}
                  id={hold.displayId}
                  className={`holds${hold.type === 'Mono' ? ' holds--mono' : ''}`}
                  style={style}
                >
                  <div className={`hold-shape hold-shape--${visual.shape}`} aria-hidden="true" />
                  {board.dev && <span className="hold-index">{hold.index}</span>}
                </div>
              );
            })}
          </div>
        </div>
        </div>
        <div className="workout-climbing-controls">
          <span className="workout-climbing-timer">{formatTime(minutes, seconds)}</span>
          <button type="button" className="start-stop-btn running" onClick={handleStartStop}>
            Stop Climbing
          </button>
          <button type="button" className="reset-btn" onClick={handleReset}>
            Reset Clock
          </button>
        </div>
      </div>
    );
    return createPortal(climbingScreen, document.body);
  }

  return (
    <div className="workout-page">
      <Navigation />
      <div className="page-content">
        <h1 className="welcome">Welcome, {userName}</h1>

        <div className="workout-controls-card">
          <div className="workout-board-select-row">
            <label htmlFor="board-select" className="board-select-label">Board</label>
            <select
              id="board-select"
              className="board-select"
              value={selectedBoardId}
              onChange={handleBoardChange}
              disabled={isRunning}
              aria-label="Select board"
            >
              {boardOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="workout-controls-row">
            <div className="grades-section">
              <button
                className={getLevelButtonClass(1)}
                onClick={() => handleLevelSelect(1)}
                disabled={isRunning}
              >
                <span>Easy</span>
              </button>
              <button
                className={getLevelButtonClass(2)}
                onClick={() => handleLevelSelect(2)}
                disabled={isRunning}
              >
                <span>Medium</span>
              </button>
              <button
                className={getLevelButtonClass(3)}
                onClick={() => handleLevelSelect(3)}
                disabled={isRunning}
              >
                <span>Hard</span>
              </button>
            </div>
            <div className="timer-section">
              <div className="main-time">{formatTime(minutes, seconds)}</div>
            </div>
            <div className="controls-section">
              <button
                type="button"
                className={`start-stop-btn ${isRunning ? 'running' : ''}`}
                onClick={handleStartStop}
                disabled={!board}
              >
                <span>{isRunning ? 'Stop Climbing' : 'Start Climbing'}</span>
              </button>
              <button
                type="button"
                className="reset-btn"
                onClick={handleReset}
                disabled={isRunning}
              >
                Reset Clock
              </button>
            </div>
          </div>
        </div>

        <div
          key={board?.id ?? 'no-board'}
          className={`device-section${!board ? ' device-section--no-board' : ''}`}
          style={deviceSectionStyle}
        >
          <div className="device-container">
            {!board ? (
              <div className="device-empty">
                <p>Choose a board from the dropdown above to load it.</p>
              </div>
            ) : (
              <>
                {board.holds.map((hold) => {
                  const showHold = board.dev || (isRunning && visibleHolds[hold.displayId]);
                  if (!showHold) return null;
                  const visual = getHoldVisual(hold.type, board.id);
                  const style = board.positionToPercent(hold.position);
                  return (
                    <div
                      key={hold.displayId}
                      id={hold.displayId}
                      className={`holds${hold.type === 'Mono' ? ' holds--mono' : ''}`}
                      style={style}
                    >
                      <div className={`hold-shape hold-shape--${visual.shape}`} aria-hidden="true" />
                      {board.dev && <span className="hold-index">{hold.index}</span>}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {showAfterSessionModal && (
        <div className="workout-after-session-overlay" onClick={() => {}}>
          <div className="workout-after-session-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Session saved</h2>
            <p>Start another session?</p>
            <div className="workout-after-session-buttons">
              <button type="button" className="btn btn-primary" onClick={handleStartAnotherSession}>
                Start another session
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleGoToMyClimbs}>
                Go to My Climbs
              </button>
            </div>
            <p className="workout-after-session-countdown">
              Redirecting to My Climbs in <strong>{afterSessionCountdown}</strong> seconds…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workout;
