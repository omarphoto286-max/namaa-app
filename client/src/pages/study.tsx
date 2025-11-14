import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { StudySessionDialog } from "@/components/StudySessionDialog";
import { Plus, Trash2, BookOpen, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Course, DailyMetric, StudySessionNotes, Settings } from "@shared/schema";

export default function Study() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetric>({
    id: "",
    userId: user?.id || "",
    courseId: "",
    date: new Date().toISOString().split("T")[0],
    metric1: 0,
    metric2: 0,
    metric3: 0,
    metric4: 0,
    metric5: 0,
  });
  const [sessionNotes, setSessionNotes] = useState<StudySessionNotes>({
    id: "",
    userId: user?.id || "",
    courseId: "",
    date: new Date().toISOString().split("T")[0],
    errorLog: "",
    reviewNotes: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseColor, setCourseColor] = useState("#D4AF37");
  const [metricNames, setMetricNames] = useState<Settings["metricNames"]>({
    metric1: { en: "Focus", ar: "التركيز", visible: true },
    metric2: { en: "Interaction", ar: "التفاعل", visible: true },
    metric3: { en: "Application", ar: "التطبيق العملي", visible: true },
    metric4: { en: "Mistake Reduction", ar: "تقليل الأخطاء", visible: true },
    metric5: { en: "Discipline", ar: "الانضباط", visible: true },
  });

  useEffect(() => {
    if (!user?.id) return;
    
    const stored = localStorage.getItem(`courses_${user.id}`);
    if (stored) {
      setCourses(JSON.parse(stored));
    }
    
    const settingsStored = localStorage.getItem(`settings_${user.id}`);
    if (settingsStored) {
      const settings: Settings = JSON.parse(settingsStored);
      if (settings.metricNames) {
        setMetricNames(settings.metricNames);
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse && user?.id) {
      const todayDate = new Date().toISOString().split("T")[0];
      
      const storedMetrics = localStorage.getItem(`metrics_${user.id}_${selectedCourse.id}_${todayDate}`);
      if (storedMetrics) {
        setDailyMetrics(JSON.parse(storedMetrics));
      } else {
        setDailyMetrics({
          id: crypto.randomUUID(),
          userId: user.id,
          courseId: selectedCourse.id,
          date: todayDate,
          metric1: 0,
          metric2: 0,
          metric3: 0,
          metric4: 0,
          metric5: 0,
        });
      }

      const storedNotes = localStorage.getItem(`notes_${user.id}_${selectedCourse.id}_${todayDate}`);
      if (storedNotes) {
        setSessionNotes(JSON.parse(storedNotes));
      } else {
        setSessionNotes({
          id: crypto.randomUUID(),
          userId: user.id,
          courseId: selectedCourse.id,
          date: todayDate,
          errorLog: "",
          reviewNotes: "",
        });
      }
    }
  }, [selectedCourse, user]);

  const addCourse = () => {
    if (!courseName.trim() || !user?.id) return;

    const newCourse: Course = {
      id: crypto.randomUUID(),
      userId: user.id,
      name: courseName,
      color: courseColor,
      createdAt: new Date().toISOString(),
    };

    const updated = [...courses, newCourse];
    setCourses(updated);
    localStorage.setItem(`courses_${user.id}`, JSON.stringify(updated));
    setCourseName("");
    setCourseColor("#D4AF37");
    setIsAddDialogOpen(false);
    toast({
      title: language === "ar" ? "تم الإضافة" : "Added",
      description: language === "ar" ? "تم إضافة المادة بنجاح" : "Course added successfully",
    });
  };

  const deleteCourse = (id: string) => {
    if (!user?.id) return;
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    localStorage.setItem(`courses_${user.id}`, JSON.stringify(updated));
    if (selectedCourse?.id === id) setSelectedCourse(null);
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف المادة" : "Course deleted",
    });
  };

  const updateMetric = (metricKey: keyof DailyMetric, value: number) => {
    if (!user?.id || !selectedCourse?.id) return;
    const updated = { ...dailyMetrics, [metricKey]: value };
    setDailyMetrics(updated);
    localStorage.setItem(`metrics_${user.id}_${selectedCourse.id}_${updated.date}`, JSON.stringify(updated));
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">{t("study")}</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-course">
              <Plus className="h-4 w-4 mr-2" />
              {language === "ar" ? "إضافة مادة" : "Add Course"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "ar" ? "إضافة مادة جديدة" : "Add New Course"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{language === "ar" ? "اسم المادة" : "Course Name"}</Label>
                <Input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder={language === "ar" ? "مثال: الرياضيات" : "e.g., Mathematics"}
                  data-testid="input-course-name"
                />
              </div>
              <div>
                <Label>{language === "ar" ? "اللون" : "Color"}</Label>
                <Input
                  type="color"
                  value={courseColor}
                  onChange={(e) => setCourseColor(e.target.value)}
                  data-testid="input-course-color"
                />
              </div>
              <Button onClick={addCourse} className="w-full" data-testid="button-save-course">
                {t("save")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t("courseManagement")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {courses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {language === "ar" ? "لا توجد مواد بعد" : "No courses yet"}
                </p>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-4 rounded-lg cursor-pointer hover-elevate active-elevate-2 transition-all ${
                      selectedCourse?.id === course.id ? "bg-accent" : "bg-card"
                    }`}
                    onClick={() => setSelectedCourse(course)}
                    data-testid={`course-${course.id}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="font-medium">{course.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCourse(course.id);
                        }}
                        data-testid={`button-delete-course-${course.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {selectedCourse && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>{language === "ar" ? `المقاييس اليومية - ${selectedCourse.name}` : `Daily Metrics - ${selectedCourse.name}`}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(['metric1', 'metric2', 'metric3', 'metric4', 'metric5'] as const).map((key) => {
                  const metricConfig = metricNames[key];
                  if (!metricConfig.visible) return null;
                  
                  return (
                    <div key={key} className="space-y-2">
                      <Label>{language === "ar" ? metricConfig.ar : metricConfig.en}</Label>
                      <Input
                        type="number"
                        value={dailyMetrics[key]}
                        onChange={(e) => updateMetric(key, Number(e.target.value))}
                        min={0}
                        max={10}
                        placeholder="0-10"
                        data-testid={`input-${key}`}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {selectedCourse && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {language === "ar" ? "سجل الأخطاء والمراجعة" : "Error Log & Review Notes"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {language === "ar" ? "الأخطاء والنقاط المربكة" : "Errors & Confusing Points"}
                  </Label>
                  <Textarea
                    value={sessionNotes.errorLog}
                    onChange={(e) => {
                      if (!user?.id || !selectedCourse?.id) return;
                      const updated = { ...sessionNotes, errorLog: e.target.value };
                      setSessionNotes(updated);
                      localStorage.setItem(`notes_${user.id}_${selectedCourse.id}_${sessionNotes.date}`, JSON.stringify(updated));
                    }}
                    rows={4}
                    placeholder={language === "ar" ? "سجل الأخطاء..." : "Log errors..."}
                    data-testid="textarea-errorlog"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === "ar" ? "ملاحظات المراجعة" : "Review Notes"}</Label>
                  <Textarea
                    value={sessionNotes.reviewNotes}
                    onChange={(e) => {
                      if (!user?.id || !selectedCourse?.id) return;
                      const updated = { ...sessionNotes, reviewNotes: e.target.value };
                      setSessionNotes(updated);
                      localStorage.setItem(`notes_${user.id}_${selectedCourse.id}_${sessionNotes.date}`, JSON.stringify(updated));
                    }}
                    rows={4}
                    placeholder={language === "ar" ? "ملاحظات للمراجعة..." : "Notes for review..."}
                    data-testid="textarea-reviewnotes"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <PomodoroTimer
            onSessionComplete={() => {
              if (!user?.id) return;
              const todayDate = new Date().toISOString().split("T")[0];
              const stored = JSON.parse(localStorage.getItem(`pomodoro_${user.id}_${todayDate}`) || "{}");
              stored.sessionsCompleted = (stored.sessionsCompleted || 0) + 1;
              localStorage.setItem(`pomodoro_${user.id}_${todayDate}`, JSON.stringify(stored));
              setIsSessionDialogOpen(true);
            }}
          />
          
          <StudySessionDialog
            open={isSessionDialogOpen}
            onClose={() => setIsSessionDialogOpen(false)}
            onSave={(courseId, metrics, notes) => {
              if (selectedCourse?.id === courseId) {
                setDailyMetrics(metrics);
                setSessionNotes(notes);
              }
            }}
            courses={courses}
          />
        </div>
      </div>
    </div>
  );
}
