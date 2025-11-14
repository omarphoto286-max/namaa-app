import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PomodoroTimerProps {
  onSessionComplete?: () => void;
}

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      if (!isBreak) {
        setSessions((prev) => prev + 1);
        onSessionComplete?.();
        setIsBreak(true);
        setTimeLeft(5 * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(isBreak ? 'Break Complete!' : 'Session Complete!', {
          body: isBreak ? 'Time to get back to work!' : 'Time for a break!',
          icon: '/favicon.png',
        });
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, isBreak, onSessionComplete]);

  const toggleTimer = () => {
    if (!isRunning && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = isBreak
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <Card className="shadow-lg" data-testid="component-pomodoro">
      <CardHeader>
        <CardTitle className="text-center">{t("pomodoroTimer")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative flex items-center justify-center">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className="transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold tabular-nums" data-testid="text-time">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {isBreak ? (t("break") || "Break") : (t("focus") || "Focus")}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            variant="default"
            size="icon"
            onClick={toggleTimer}
            className="h-12 w-12"
            data-testid="button-toggle-pomodoro"
          >
            {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="h-12 w-12"
            data-testid="button-reset-pomodoro"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t("sessions") || "Sessions"}: <span className="font-semibold text-foreground" data-testid="text-sessions">{sessions}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
