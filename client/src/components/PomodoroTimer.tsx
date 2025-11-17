import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePomodoroSettings } from "@/contexts/PomodoroSettingsContext";

export function PomodoroTimer() {
  const { t } = useLanguage();
  const { settings } = usePomodoroSettings();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [timeLeft, setTimeLeft] = useState(settings.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem("pomodoro");
    if (saved) {
      const data = JSON.parse(saved);
      setTimeLeft(data.timeLeft);
      setIsRunning(data.isRunning);
      setIsBreak(data.isBreak);
      setSessions(data.sessions);
    }
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem(
      "pomodoro",
      JSON.stringify({ timeLeft, isRunning, isBreak, sessions })
    );
  }, [timeLeft, isRunning, isBreak, sessions]);

  // Always update timer length when settings change
  useEffect(() => {
    if (!isRunning) {
      if (!isBreak) setTimeLeft(settings.focus);
      else setTimeLeft(settings.shortBreak);
    }
  }, [settings]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      if (!isBreak) {
        // Completed a focus session
        const newSession = sessions + 1;
        setSessions(newSession);

        const longBreakNow =
          newSession % settings.sessionsBeforeLongBreak === 0;

        setIsBreak(true);
        setTimeLeft(longBreakNow ? settings.longBreak : settings.shortBreak);

        if (settings.notifications)
          new Notification("Session Complete!", { body: "Take a break!" });

      } else {
        // Completed a break
        setIsBreak(false);
        setTimeLeft(settings.focus);
      }

      setIsRunning(false);
    }

    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, isBreak, sessions, settings]);

  const toggleTimer = () => {
    if (!isRunning && settings.notifications && "Notification" in window) {
      if (Notification.permission === "default") Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(settings.focus);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const total = isBreak
    ? timeLeft === settings.longBreak
      ? settings.longBreak
      : settings.shortBreak
    : settings.focus;

  const progress = ((total - timeLeft) / total) * 100;

  return (
    <Card className="shadow-lg">
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
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-bold tabular-nums">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              {isBreak ? t("break") : t("focus")}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="default" size="icon" onClick={toggleTimer} className="h-12 w-12">
            {isRunning ? <Pause /> : <Play />}
          </Button>

          <Button variant="outline" size="icon" onClick={resetTimer} className="h-12 w-12">
            <RotateCcw />
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {t("sessions")}: <span className="font-semibold">{sessions}</span>
        </p>
      </CardContent>
    </Card>
  );
}
