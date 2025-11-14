import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, BookOpen, CheckSquare, Target, Star, Award, Medal } from "lucide-react";
import type { Achievement, UserAchievement } from "@shared/schema";

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-prayer",
    titleEn: "First Prayer",
    titleAr: "أول صلاة",
    descriptionEn: "Complete your first prayer",
    descriptionAr: "أكمل أول صلاة",
    icon: "Flame",
    condition: "prayer_count_1",
  },
  {
    id: "prayer-week",
    titleEn: "Prayer Week",
    titleAr: "أسبوع الصلاة",
    descriptionEn: "Pray 5 times daily for 7 consecutive days",
    descriptionAr: "صل 5 مرات يومياً لمدة 7 أيام متتالية",
    icon: "Award",
    condition: "prayer_streak_7",
  },
  {
    id: "first-pomodoro",
    titleEn: "Focused Start",
    titleAr: "بداية مركزة",
    descriptionEn: "Complete your first Pomodoro session",
    descriptionAr: "أكمل أول جلسة بومودورو",
    icon: "Target",
    condition: "pomodoro_count_1",
  },
  {
    id: "study-master",
    titleEn: "Study Master",
    titleAr: "سيد الدراسة",
    descriptionEn: "Complete 50 Pomodoro sessions",
    descriptionAr: "أكمل 50 جلسة بومودورو",
    icon: "Medal",
    condition: "pomodoro_count_50",
  },
  {
    id: "task-complete-10",
    titleEn: "Task Champion",
    titleAr: "بطل المهام",
    descriptionEn: "Complete 10 tasks",
    descriptionAr: "أكمل 10 مهام",
    icon: "CheckSquare",
    condition: "task_count_10",
  },
  {
    id: "reader",
    titleEn: "Avid Reader",
    titleAr: "قارئ نهم",
    descriptionEn: "Reach your reading goal 7 times",
    descriptionAr: "حقق هدف القراءة 7 مرات",
    icon: "BookOpen",
    condition: "reading_goal_7",
  },
  {
    id: "consistent",
    titleEn: "Consistency King",
    titleAr: "ملك الاستمرارية",
    descriptionEn: "Use the app for 30 consecutive days",
    descriptionAr: "استخدم التطبيق لمدة 30 يوماً متتالياً",
    icon: "Star",
    condition: "usage_streak_30",
  },
  {
    id: "perfect-day",
    titleEn: "Perfect Day",
    titleAr: "يوم مثالي",
    descriptionEn: "Complete all 5 prayers, study session, and reading goal in one day",
    descriptionAr: "أكمل جميع الصلوات الخمس وجلسة دراسة وهدف القراءة في يوم واحد",
    icon: "Trophy",
    condition: "perfect_day_1",
  },
];

const iconMap: Record<string, any> = {
  Flame,
  BookOpen,
  CheckSquare,
  Target,
  Star,
  Award,
  Medal,
  Trophy,
};

export default function Achievements() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem(`achievements_${user?.id}`);
    if (stored) {
      const achievements: UserAchievement[] = JSON.parse(stored);
      setUnlockedAchievements(new Set(achievements.map((a) => a.achievementId)));
    }

    checkAndUnlockAchievements();
  }, [user]);

  const checkAndUnlockAchievements = () => {
    if (!user?.id) return;

    const tasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || "[]");
    const completedTasks = tasks.filter((t: any) => t.completed).length;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    const prayerStreak = last7Days.filter((date) => {
      const prayers = JSON.parse(localStorage.getItem(`prayers_${user.id}_${date}`) || "{}");
      return [prayers.fajr, prayers.dhuhr, prayers.asr, prayers.maghrib, prayers.isha].filter(Boolean).length === 5;
    }).length;

    const pomodoroTotal = last7Days.reduce((acc, date) => {
      const pomodoro = JSON.parse(localStorage.getItem(`pomodoro_${user.id}_${date}`) || "{}");
      return acc + (pomodoro.sessionsCompleted || 0);
    }, 0);

    const readingGoalsHit = last7Days.filter((date) => {
      const reading = JSON.parse(localStorage.getItem(`reading_${user.id}_${date}`) || "{}");
      return reading.progress >= reading.target;
    }).length;

    if (completedTasks >= 10) unlockAchievement("task-complete-10");
    
    const anyPrayerCompleted = last7Days.some((date) => {
      const prayers = JSON.parse(localStorage.getItem(`prayers_${user.id}_${date}`) || "{}");
      return prayers.fajr || prayers.dhuhr || prayers.asr || prayers.maghrib || prayers.isha;
    });
    
    const usageStreak = last7Days.filter((date) => {
      const prayers = JSON.parse(localStorage.getItem(`prayers_${user.id}_${date}`) || "{}");
      const hasPrayers = prayers.fajr || prayers.dhuhr || prayers.asr || prayers.maghrib || prayers.isha;
      const pomodoro = JSON.parse(localStorage.getItem(`pomodoro_${user.id}_${date}`) || "{}");
      const hasPomodoro = (pomodoro.sessionsCompleted || 0) > 0;
      const tasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || "[]").filter((t: any) => 
        t.createdAt && t.createdAt.startsWith(date)
      );
      const hasTasks = tasks.length > 0;
      const reading = JSON.parse(localStorage.getItem(`reading_${user.id}_${date}`) || "{}");
      const hasReading = reading.progress > 0;
      
      return hasPrayers || hasPomodoro || hasTasks || hasReading;
    }).length;
    
    if (anyPrayerCompleted) unlockAchievement("first-prayer");
    if (prayerStreak >= 7) unlockAchievement("prayer-week");
    if (pomodoroTotal >= 1) unlockAchievement("first-pomodoro");
    if (pomodoroTotal >= 50) unlockAchievement("study-master");
    if (readingGoalsHit >= 7) unlockAchievement("reader");
    if (usageStreak >= 7) unlockAchievement("consistent");

    const todayDate = new Date().toISOString().split("T")[0];
    const todayPrayers = JSON.parse(localStorage.getItem(`prayers_${user.id}_${todayDate}`) || "{}");
    const todayPrayersComplete = [todayPrayers.fajr, todayPrayers.dhuhr, todayPrayers.asr, todayPrayers.maghrib, todayPrayers.isha].filter(Boolean).length === 5;
    const todayPomodoro = JSON.parse(localStorage.getItem(`pomodoro_${user.id}_${todayDate}`) || "{}");
    const todayStudy = (todayPomodoro.sessionsCompleted || 0) >= 1;
    const todayReading = JSON.parse(localStorage.getItem(`reading_${user.id}_${todayDate}`) || "{}");
    const todayReadingComplete = todayReading.progress >= todayReading.target;

    if (todayPrayersComplete && todayStudy && todayReadingComplete) {
      unlockAchievement("perfect-day");
    }
  };

  const unlockAchievement = (achievementId: string) => {
    if (unlockedAchievements.has(achievementId)) return;

    const newAchievement: UserAchievement = {
      userId: user?.id || "",
      achievementId,
      unlockedAt: new Date().toISOString(),
    };

    const stored = JSON.parse(localStorage.getItem(`achievements_${user?.id}`) || "[]");
    stored.push(newAchievement);
    localStorage.setItem(`achievements_${user?.id}`, JSON.stringify(stored));

    setUnlockedAchievements((prev) => new Set([...prev, achievementId]));
  };

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{language === "ar" ? "الإنجازات" : "Achievements"}</h1>
        <p className="text-muted-foreground">
          {unlockedAchievements.size} / {ACHIEVEMENTS.length} {language === "ar" ? "مفتوحة" : "Unlocked"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedAchievements.has(achievement.id);
          const Icon = iconMap[achievement.icon] || Trophy;

          return (
            <Card
              key={achievement.id}
              className={`shadow-lg transition-all ${
                isUnlocked
                  ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30"
                  : "opacity-50 grayscale"
              }`}
              data-testid={`achievement-${achievement.id}`}
            >
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      isUnlocked
                        ? "bg-primary text-primary-foreground shadow-xl"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-10 w-10" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-bold text-lg">
                      {language === "ar" ? achievement.titleAr : achievement.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" ? achievement.descriptionAr : achievement.descriptionEn}
                    </p>
                    {isUnlocked && (
                      <Badge variant="default" className="mt-2">
                        {language === "ar" ? "مفتوح" : "Unlocked"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
