import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Statistics() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [prayerData, setPrayerData] = useState<any[]>([]);
  const [studyData, setStudyData] = useState<any[]>([]);
  const [taskData, setTaskData] = useState<any[]>([]);

  useEffect(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const prayerStats = last7Days.map((date) => {
      const prayers = JSON.parse(localStorage.getItem(`prayers_${user?.id}_${date}`) || "{}");
      const completed = [prayers.fajr, prayers.dhuhr, prayers.asr, prayers.maghrib, prayers.isha].filter(Boolean).length;
      return {
        date: new Date(date).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" }),
        prayers: completed,
      };
    });

    const studyStats = last7Days.map((date) => {
      const pomodoro = JSON.parse(localStorage.getItem(`pomodoro_${user?.id}_${date}`) || "{}");
      return {
        date: new Date(date).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" }),
        sessions: pomodoro.sessionsCompleted || 0,
      };
    });

    const tasks = JSON.parse(localStorage.getItem(`tasks_${user?.id}`) || "[]");
    const taskStats = last7Days.map((date) => {
      const completed = tasks.filter(
        (t: any) => t.completed && t.createdAt?.startsWith(date)
      ).length;
      return {
        date: new Date(date).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" }),
        tasks: completed,
      };
    });

    setPrayerData(prayerStats);
    setStudyData(studyStats);
    setTaskData(taskStats);
  }, [user, language]);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">{t("statistics")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg" data-testid="card-prayer-stats">
          <CardHeader>
            <CardTitle>{language === "ar" ? "الصلوات - آخر 7 أيام" : "Prayers - Last 7 Days"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prayerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="prayers" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg" data-testid="card-study-stats">
          <CardHeader>
            <CardTitle>{language === "ar" ? "جلسات بومودورو - آخر 7 أيام" : "Pomodoro Sessions - Last 7 Days"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-2))", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg" data-testid="card-task-stats">
          <CardHeader>
            <CardTitle>{language === "ar" ? "المهام المكتملة - آخر 7 أيام" : "Completed Tasks - Last 7 Days"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="tasks" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>{language === "ar" ? "ملخص الإحصائيات" : "Statistics Summary"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
              <span className="font-medium">{language === "ar" ? "إجمالي الصلوات (7 أيام)" : "Total Prayers (7 days)"}</span>
              <span className="text-2xl font-bold text-primary">
                {prayerData.reduce((acc, day) => acc + day.prayers, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
              <span className="font-medium">{language === "ar" ? "إجمالي جلسات الدراسة" : "Total Study Sessions"}</span>
              <span className="text-2xl font-bold text-primary">
                {studyData.reduce((acc, day) => acc + day.sessions, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
              <span className="font-medium">{language === "ar" ? "إجمالي المهام المكتملة" : "Total Tasks Completed"}</span>
              <span className="text-2xl font-bold text-primary">
                {taskData.reduce((acc, day) => acc + day.tasks, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
