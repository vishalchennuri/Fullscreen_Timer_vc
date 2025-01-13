import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [isStopwatch, setIsStopwatch] = useState(true); // true means stopwatch is selected
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [editing, setEditing] = useState(null); // "minutes" or "seconds" or null

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        if (isStopwatch) {
          setSeconds((prev) => {
            if (prev + 1 === 60) {
              setMinutes((m) => m + 1);
              return 0;
            }
            return prev + 1;
          });
        } else {
          setSeconds((prev) => {
            if (prev === 0) {
              if (minutes === 0) {
                setRunning(false);
                return 0;
              }
              setMinutes((m) => m - 1);
              return 59;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running, minutes, seconds, isStopwatch]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle key presses if focus is not on an editable field
      if (document.activeElement === document.body || !['minutes', 'seconds'].includes(editing)) {
        if (editing) {
          const value = parseInt(e.key, 10);
          if (!isNaN(value)) {
            if (editing === "minutes") {
              setMinutes((prev) => Math.min(prev * 10 + value, 60));
            } else if (editing === "seconds") {
              setSeconds((prev) => Math.min(prev * 10 + value, 60));
            }
          }
        } else {
          switch (e.key.toLowerCase()) {
            case " ":
              setRunning((prev) => {
                if (!prev) setEditing(null); // Deselect when starting
                return !prev;
              });
              break;
            case "r":
              handleReset();
              break;
            case "t":
              switchToTimer();
              break;
            case "s":
              switchToStopwatch();
              break;
            default:
              break;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [running, editing]);

  const handleReset = () => {
    setRunning(false);
    setMinutes(0);
    setSeconds(0);
    setEditing(null); // Deselect when resetting
  };

  const switchToTimer = () => {
    if (!running) {
      setRunning(false);
      setMinutes(0);
      setSeconds(0);
      setEditing(null); // Deselect when switching modes
      setIsStopwatch(false);
    }
  };

  const switchToStopwatch = () => {
    if (!running) {
      setRunning(false);
      setMinutes(0);
      setSeconds(0);
      setEditing(null); // Deselect when switching modes
      setIsStopwatch(true);
    }
  };

  const formatTime = (time) => String(time).padStart(2, "0");

  return (
    <div className="app-container d-flex justify-content-center align-items-center">
      <div className="timer-container text-center">
        <div className="button-group mt-4">
          <button
            className={`btn me-2 ${isStopwatch ? "btn-black" : "btn-white"}`}
            onClick={switchToTimer}
          >
            Timer
          </button>
          <button
            className={`btn me-2 ${isStopwatch ? "btn-white" : "btn-black"}`}
            onClick={switchToStopwatch}
          >
            Stopwatch
          </button>
        </div>
        <div className="large-timer mt-4">
          <span
            className={editing === "minutes" ? "editable" : ""}
            onClick={() => !running && setEditing("minutes")}
          >
            {formatTime(minutes)}
          </span>
          :
          <span
            className={editing === "seconds" ? "editable" : ""}
            onClick={() => !running && setEditing("seconds")}
          >
            {formatTime(seconds)}
          </span>
        </div>
        <div className="button-group mt-4">
          <button
            className="btn btn-primary me-2"
            onClick={() => {
              setRunning(!running);
              setEditing(null); // Deselect when starting
            }}
          >
            {running ? "Pause" : "Start"}
          </button>
          <button className="btn btn-danger me-2" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
