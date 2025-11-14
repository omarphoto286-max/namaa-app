import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Minus, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ReadingGoal } from "@shared/schema";

export default function Reading() {
  const { user } = useAuth();
  const { t, language, dir } = useLanguage();
  const { toast } = useToast();
  const [goal, setGoal] = useState<ReadingGoal>({
    id: "",
    userId: user?.id || "",
    date: new Date().toISOString().split("T")[0],
    target: 10,
    progress: 0,
  });

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem(`reading_${user?.id}_${todayDate}`);
    if (stored) {
      setGoal(JSON.parse(stored));
    } else {
      const newGoal: ReadingGoal = {
        id: crypto.randomUUID(),
        userId: user?.id || "",
        date: todayDate,
        target: 10,
        progress: 0,
      };
      setGoal(newGoal);
    }
  }, [user]);

  const updateProgress = (delta: number) => {
    const newProgress = Math.max(0, Math.min(goal.progress + delta, goal.target));
    const updated = { ...goal, progress: newProgress };
    setGoal(updated);
    localStorage.setItem(`reading_${user?.id}_${updated.date}`, JSON.stringify(updated));

    if (newProgress === goal.target && goal.progress < goal.target) {
      toast({
        title: language === "ar" ? "ما شاء الله!" : "MashaAllah!",
        description: language === "ar" ? "لقد أكملت هدف القراءة اليومي" : "You've completed your daily reading goal",
      });
    }
  };

  const updateTarget = (newTarget: number) => {
    if (newTarget < 1) return;
    const updated = { ...goal, target: newTarget };
    setGoal(updated);
    localStorage.setItem(`reading_${user?.id}_${updated.date}`, JSON.stringify(updated));
  };

  const progressPercentage = (goal.progress / goal.target) * 100;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">{t("reading")}</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="shadow-xl" data-testid="card-reading-goal">
          <CardHeader>
            <CardTitle className="text-3xl text-center">{t("readingGoal")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center space-y-4">
              <div className="text-8xl font-bold text-primary">
                <span data-testid="text-progress">{goal.progress}</span>
                <span className="text-4xl text-muted-foreground">/{goal.target}</span>
              </div>
              <p className="text-lg text-muted-foreground">
                {language === "ar" ? "صفحات اليوم" : "Pages Today"}
              </p>
            </div>

            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-4" />
              <p className="text-center text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% {language === "ar" ? "مكتمل" : "Complete"}
              </p>
            </div>

            <div className={`flex justify-center gap-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => updateProgress(-1)}
                disabled={goal.progress === 0}
                className="h-16 w-16 rounded-full"
                data-testid="button-decrement"
              >
                <Minus className="h-8 w-8" />
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={() => updateProgress(1)}
                disabled={goal.progress >= goal.target}
                className="h-16 w-16 rounded-full"
                data-testid="button-increment"
              >
                <Plus className="h-8 w-8" />
              </Button>
            </div>

            {goal.progress >= goal.target && (
              <div className="text-center p-6 bg-primary/10 rounded-lg animate-pulse">
                <p className="text-2xl font-bold text-primary">
                  {language === "ar" ? "ما شاء الله! تم إنجاز الهدف اليومي" : "MashaAllah! Daily Goal Achieved"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              {language === "ar" ? "تعيين الهدف" : "Set Goal"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{language === "ar" ? "الهدف اليومي (صفحات)" : "Daily Target (pages)"}</Label>
              <Input
                type="number"
                value={goal.target}
                onChange={(e) => updateTarget(Number(e.target.value))}
                min={1}
                data-testid="input-target"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {language === "ar"
                ? "حدد عدد الصفحات التي تريد قراءتها يومياً"
                : "Set the number of pages you want to read daily"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>{language === "ar" ? "نصائح للقراءة" : "Reading Tips"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{language === "ar" ? "اقرأ في أوقات ثابتة يومياً" : "Read at consistent times daily"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{language === "ar" ? "ابدأ بأهداف صغيرة وزدها تدريجياً" : "Start with small goals and increase gradually"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{language === "ar" ? "خصص مكاناً هادئاً للقراءة" : "Designate a quiet reading space"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{language === "ar" ? "دون ملاحظاتك وتأملاتك" : "Take notes and reflect on what you read"}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
