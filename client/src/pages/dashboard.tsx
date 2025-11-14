import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrowthTree } from "@/components/GrowthTree";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { DhikrCounter } from "@/components/DhikrCounter";
import { BookOpen, Flame, GraduationCap, CheckSquare } from "lucide-react";
import { useLocation } from "wouter";

const QURANIC_VERSES = [
  { ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease", ref: "Quran 94:6" },
  { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "Remember Me; I will remember you", ref: "Quran 2:152" },
  { ar: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", en: "And He is with you wherever you are", ref: "Quran 57:4" },
  { ar: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", en: "Indeed, Allah does not waste the reward of those who do good", ref: "Quran 9:120" },
  { ar: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", en: "Whoever fears Allah, He will make a way out for him", ref: "Quran 65:2" },
];

const WISDOM_QUOTES = [
  { ar: "العلم نور", en: "Knowledge is light" },
  { ar: "الصبر مفتاح الفرج", en: "Patience is the key to relief" },
  { ar: "من جد وجد", en: "Whoever strives shall succeed" },
  { ar: "خير الناس أنفعهم للناس", en: "The best of people are those most beneficial to others" },
  { ar: "اطلبوا العلم من المهد إلى اللحد", en: "Seek knowledge from the cradle to the grave" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [dailyVerse, setDailyVerse] = useState(QURANIC_VERSES[0]);
  const [wisdomQuote, setWisdomQuote] = useState(WISDOM_QUOTES[0]);
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    pomodoroSessions: 0,
    prayersCompleted: 0,
    readingProgress: 0,
  });

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("dailyContentDate");

    if (storedDate !== today) {
      const randomVerse = QURANIC_VERSES[Math.floor(Math.random() * QURANIC_VERSES.length)];
      const randomQuote = WISDOM_QUOTES[Math.floor(Math.random() * WISDOM_QUOTES.length)];
      setDailyVerse(randomVerse);
      setWisdomQuote(randomQuote);
      localStorage.setItem("dailyContentDate", today);
      localStorage.setItem("dailyVerse", JSON.stringify(randomVerse));
      localStorage.setItem("wisdomQuote", JSON.stringify(randomQuote));
    } else {
      const storedVerse = localStorage.getItem("dailyVerse");
      const storedWisdom = localStorage.getItem("wisdomQuote");
      if (storedVerse) setDailyVerse(JSON.parse(storedVerse));
      if (storedWisdom) setWisdomQuote(JSON.parse(storedWisdom));
    }

    const todayDate = new Date().toISOString().split("T")[0];
    const prayers = JSON.parse(localStorage.getItem(`prayers_${user?.id}_${todayDate}`) || "{}");
    const prayersCompleted = [prayers.fajr, prayers.dhuhr, prayers.asr, prayers.maghrib, prayers.isha].filter(Boolean).length;

    const tasks = JSON.parse(localStorage.getItem(`tasks_${user?.id}`) || "[]");
    const tasksCompleted = tasks.filter((t: any) => t.completed && t.createdAt?.startsWith(todayDate)).length;

    const pomodoro = JSON.parse(localStorage.getItem(`pomodoro_${user?.id}_${todayDate}`) || "{}");
    const pomodoroSessions = pomodoro.sessionsCompleted || 0;

    const reading = JSON.parse(localStorage.getItem(`reading_${user?.id}_${todayDate}`) || "{}");
    const readingProgress = reading.progress || 0;

    setStats({ tasksCompleted, pomodoroSessions, prayersCompleted, readingProgress });
  }, [user]);

  const quickAccessCards = [
    { icon: Flame, title: t("worship"), url: "/worship", color: "from-orange-500 to-red-500", testId: "card-worship" },
    { icon: GraduationCap, title: t("study"), url: "/study", color: "from-blue-500 to-indigo-500", testId: "card-study" },
    { icon: CheckSquare, title: t("tasks"), url: "/tasks", color: "from-green-500 to-emerald-500", testId: "card-tasks" },
    { icon: BookOpen, title: t("reading"), url: "/reading", color: "from-purple-500 to-pink-500", testId: "card-reading" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">
          {language === "ar" ? `${t("greeting")} ${user?.fullName}` : `${t("greeting")}, ${user?.fullName}`}
        </h1>
        <p className="text-muted-foreground">{t("today")}: {new Date().toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg" data-testid="card-verse">
          <CardHeader>
            <CardTitle className="font-quran text-2xl">{t("dailyVerse")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-quran text-center leading-relaxed" dir={language === "ar" ? "rtl" : "ltr"}>
              {language === "ar" ? dailyVerse.ar : dailyVerse.en}
            </p>
            <p className="text-sm text-muted-foreground text-center">{dailyVerse.ref}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg" data-testid="card-wisdom">
          <CardHeader>
            <CardTitle>{t("wisdomQuote")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-center leading-relaxed">
              {language === "ar" ? wisdomQuote.ar : wisdomQuote.en}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl" data-testid="card-growthtree">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t("growthTree")}</CardTitle>
        </CardHeader>
        <CardContent>
          <GrowthTree
            tasksCompleted={stats.tasksCompleted}
            pomodoroSessions={stats.pomodoroSessions}
            prayersCompleted={stats.prayersCompleted}
            readingProgress={stats.readingProgress}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{language === "ar" ? "الوصول السريع" : "Quick Access"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessCards.map((card) => (
            <Card
              key={card.url}
              className="cursor-pointer hover-elevate active-elevate-2 transition-all duration-300 shadow-lg"
              onClick={() => setLocation(card.url)}
              data-testid={card.testId}
            >
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <card.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-center">{card.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PomodoroTimer
          onSessionComplete={() => {
            const todayDate = new Date().toISOString().split("T")[0];
            const stored = JSON.parse(localStorage.getItem(`pomodoro_${user?.id}_${todayDate}`) || "{}");
            stored.sessionsCompleted = (stored.sessionsCompleted || 0) + 1;
            localStorage.setItem(`pomodoro_${user?.id}_${todayDate}`, JSON.stringify(stored));
          }}
        />
        <DhikrCounter />
      </div>
    </div>
  );
}
