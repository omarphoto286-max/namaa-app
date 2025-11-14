import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { Course, DailyMetric, StudySessionNotes, Settings } from "@shared/schema";

interface StudySessionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (courseId: string, metrics: DailyMetric, notes: StudySessionNotes) => void;
  courses: Course[];
}

export function StudySessionDialog({ open, onClose, onSave, courses }: StudySessionDialogProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [metrics, setMetrics] = useState<DailyMetric>({
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
  const [notes, setNotes] = useState<StudySessionNotes>({
    id: "",
    userId: user?.id || "",
    courseId: "",
    date: new Date().toISOString().split("T")[0],
    errorLog: "",
    reviewNotes: "",
  });
  const [metricNames, setMetricNames] = useState<Settings["metricNames"]>({
    metric1: { en: "Focus", ar: "التركيز", visible: true },
    metric2: { en: "Interaction", ar: "التفاعل", visible: true },
    metric3: { en: "Application", ar: "التطبيق العملي", visible: true },
    metric4: { en: "Mistake Reduction", ar: "تقليل الأخطاء", visible: true },
    metric5: { en: "Discipline", ar: "الانضباط", visible: true },
  });

  useEffect(() => {
    const stored = localStorage.getItem(`settings_${user?.id}`);
    if (stored) {
      const settings: Settings = JSON.parse(stored);
      if (settings.metricNames) {
        setMetricNames(settings.metricNames);
      }
    }
  }, [user]);

  useEffect(() => {
    if (open && courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]);
    }
  }, [open, courses]);

  const handleSave = () => {
    if (!selectedCourse || !user?.id) return;

    const todayDate = new Date().toISOString().split("T")[0];

    const metricsData = {
      ...metrics,
      id: crypto.randomUUID(),
      userId: user.id,
      courseId: selectedCourse.id,
      date: todayDate,
    };

    const notesData = {
      ...notes,
      id: crypto.randomUUID(),
      userId: user.id,
      courseId: selectedCourse.id,
      date: todayDate,
    };

    localStorage.setItem(`metrics_${user.id}_${selectedCourse.id}_${todayDate}`, JSON.stringify(metricsData));
    localStorage.setItem(`notes_${user.id}_${selectedCourse.id}_${todayDate}`, JSON.stringify(notesData));

    onSave?.(selectedCourse.id, metricsData, notesData);

    setMetrics({
      id: "",
      userId: user.id,
      courseId: "",
      date: todayDate,
      metric1: 0,
      metric2: 0,
      metric3: 0,
      metric4: 0,
      metric5: 0,
    });
    setNotes({
      id: "",
      userId: user.id,
      courseId: "",
      date: todayDate,
      errorLog: "",
      reviewNotes: "",
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {language === "ar" ? "تقييم جلسة الدراسة" : "Study Session Evaluation"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {courses.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {language === "ar" ? "الرجاء إضافة مادة دراسية أولاً" : "Please add a course first"}
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <Label>{language === "ar" ? "المادة الدراسية" : "Course"}</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={selectedCourse?.id || ""}
                  onChange={(e) => {
                    const course = courses.find((c) => c.id === e.target.value);
                    setSelectedCourse(course || null);
                  }}
                  data-testid="select-course"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">
                    {language === "ar" ? "مقاييس الجودة" : "Quality Metrics"}
                  </h3>
                  {(['metric1', 'metric2', 'metric3', 'metric4', 'metric5'] as const).map((key, index) => {
                    const metricConfig = metricNames[key];
                    if (!metricConfig.visible) return null;

                    return (
                      <div key={key} className="space-y-2">
                        <Label>{language === "ar" ? metricConfig.ar : metricConfig.en}</Label>
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          value={metrics[key]}
                          onChange={(e) => setMetrics({ ...metrics, [key]: Number(e.target.value) })}
                          placeholder={language === "ar" ? "من 0 إلى 10" : "0-10"}
                          data-testid={`input-${key}`}
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">
                    {language === "ar" ? "سجل الأخطاء والمراجعة" : "Error Log & Review Notes"}
                  </h3>
                  <div className="space-y-2">
                    <Label>{language === "ar" ? "الأخطاء والنقاط المربكة" : "Errors & Confusing Points"}</Label>
                    <Textarea
                      value={notes.errorLog}
                      onChange={(e) => setNotes({ ...notes, errorLog: e.target.value })}
                      placeholder={
                        language === "ar"
                          ? "سجل الأخطاء والمفاهيم الغامضة..."
                          : "Log errors and unclear concepts..."
                      }
                      rows={4}
                      data-testid="textarea-errorlog"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === "ar" ? "ملاحظات المراجعة والواجبات" : "Review Notes & Homework"}</Label>
                    <Textarea
                      value={notes.reviewNotes}
                      onChange={(e) => setNotes({ ...notes, reviewNotes: e.target.value })}
                      placeholder={
                        language === "ar"
                          ? "سجل المواضيع التي تحتاج مراجعة..."
                          : "Note topics that need review..."
                      }
                      rows={4}
                      data-testid="textarea-reviewnotes"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} data-testid="button-cancel">
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button onClick={handleSave} data-testid="button-save-session">
                  {language === "ar" ? "حفظ" : "Save"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
