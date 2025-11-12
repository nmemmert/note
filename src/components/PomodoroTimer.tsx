'use client';

import { useState, useEffect } from 'react';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PomodoroTimer({ isOpen, onClose }: PomodoroTimerProps) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break' | 'longBreak'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const modeSettings = {
    work: 25,
    break: 5,
    longBreak: 15,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete
            setIsRunning(false);
            playSound();
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds]);

  const playSound = () => {
    // Play notification sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzKM0vPTgjMGHm7A7+OZVRE');
    audio.play().catch(() => {});
  };

  const handleTimerComplete = () => {
    if (mode === 'work') {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      
      if (newSessions % 4 === 0) {
        setMode('longBreak');
        setMinutes(modeSettings.longBreak);
      } else {
        setMode('break');
        setMinutes(modeSettings.break);
      }
    } else {
      setMode('work');
      setMinutes(modeSettings.work);
    }
    setSeconds(0);
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(modeSettings[mode]);
    setSeconds(0);
  };

  const switchMode = (newMode: 'work' | 'break' | 'longBreak') => {
    setMode(newMode);
    setMinutes(modeSettings[newMode]);
    setSeconds(0);
    setIsRunning(false);
  };

  if (!isOpen) return null;

  const progress = ((modeSettings[mode] * 60 - (minutes * 60 + seconds)) / (modeSettings[mode] * 60)) * 100;

  return (
    <div className="fixed top-4 right-4 bg-white rounded-xl shadow-2xl p-6 w-80 z-40 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Pomodoro Timer</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchMode('work')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'work'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Work
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'break'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Break
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'longBreak'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Long
        </button>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-4">
        <div className="text-6xl font-bold text-gray-900 mb-2">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              mode === 'work' ? 'bg-red-500' : mode === 'break' ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Sessions */}
      <div className="text-center text-sm text-gray-600">
        Sessions completed: <span className="font-bold">{sessionsCompleted}</span>
      </div>
    </div>
  );
}
