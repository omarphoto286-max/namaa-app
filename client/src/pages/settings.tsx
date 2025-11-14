import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, RotateCcw, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const exportData = () => {
    const data = {
      user,
      tasks: localStorage.getItem(`tasks_${user?.id}`),
      courses: localStorage.getItem(`courses_${user?.id}`),
      achievements: localStorage.getItem(`achievements_${user?.id}`),
      motivation: localStorage.getItem(`motivation_${user?.id}`),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `baraka-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: language === "ar" ? "تم التصدير" : "Exported",
      description: language === "ar" ? "تم تصدير البيانات بنجاح" : "Data exported successfully",
    });
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          if (data.tasks) localStorage.setItem(`tasks_${user?.id}`, data.tasks);
          if (data.courses) localStorage.setItem(`courses_${user?.id}`, data.courses);
          if (data.achievements) localStorage.setItem(`achievements_${user?.id}`, data.achievements);
          if (data.motivation) localStorage.setItem(`motivation_${user?.id}`, data.motivation);

          toast({
            title: language === "ar" ? "تم الاستيراد" : "Imported",
            description: language === "ar" ? "تم استيراد البيانات بنجاح" : "Data imported successfully",
          });

          setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
          toast({
            title: language === "ar" ? "خطأ" : "Error",
            description: language === "ar" ? "فشل استيراد البيانات" : "Failed to import data",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const resetData = () => {
    const keys = Object.keys(localStorage).filter(
      (key) => key.includes(user?.id || "")
    );
    keys.forEach((key) => localStorage.removeItem(key));

    toast({
      title: language === "ar" ? "تم الإعادة" : "Reset",
      description: language === "ar" ? "تم إعادة تعيين جميع البيانات" : "All data has been reset",
    });

    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">{t("settings")}</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("theme")}</CardTitle>
            <CardDescription>
              {language === "ar" ? "اختر مظهر التطبيق" : "Choose your app appearance"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{language === "ar" ? "المظهر" : "Theme"}</Label>
              <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                <SelectTrigger data-testid="select-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">{t("gold")}</SelectItem>
                  <SelectItem value="green">{t("green")}</SelectItem>
                  <SelectItem value="dark">{t("dark")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  theme === "gold" ? "border-primary shadow-lg" : "border-border"
                }`}
                onClick={() => setTheme("gold")}
                data-testid="theme-preview-gold"
              >
                <div className="space-y-2">
                  <div className="w-full h-12 rounded bg-gradient-to-br from-yellow-400 to-yellow-600" />
                  <p className="text-center text-sm font-medium">{t("gold")}</p>
                </div>
              </div>
              <div
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  theme === "green" ? "border-primary shadow-lg" : "border-border"
                }`}
                onClick={() => setTheme("green")}
                data-testid="theme-preview-green"
              >
                <div className="space-y-2">
                  <div className="w-full h-12 rounded bg-gradient-to-br from-emerald-400 to-emerald-600" />
                  <p className="text-center text-sm font-medium">{t("green")}</p>
                </div>
              </div>
              <div
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  theme === "dark" ? "border-primary shadow-lg" : "border-border"
                }`}
                onClick={() => setTheme("dark")}
                data-testid="theme-preview-dark"
              >
                <div className="space-y-2">
                  <div className="w-full h-12 rounded bg-gradient-to-br from-slate-700 to-slate-900" />
                  <p className="text-center text-sm font-medium">{t("dark")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t("language")}</CardTitle>
            <CardDescription>
              {language === "ar" ? "اختر لغة التطبيق" : "Choose your app language"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{language === "ar" ? "اللغة" : "Language"}</Label>
              <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                <SelectTrigger data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{language === "ar" ? "إدارة البيانات" : "Data Management"}</CardTitle>
            <CardDescription>
              {language === "ar" ? "صدر أو استورد أو أعد تعيين بياناتك" : "Export, import, or reset your data"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button variant="outline" onClick={exportData} data-testid="button-export">
                <Download className="h-4 w-4 mr-2" />
                {t("export")}
              </Button>
              <Button variant="outline" onClick={importData} data-testid="button-import">
                <Upload className="h-4 w-4 mr-2" />
                {t("import")}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" data-testid="button-reset">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {t("resetData")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {language === "ar" ? "هل أنت متأكد؟" : "Are you sure?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {language === "ar"
                        ? "سيؤدي هذا إلى حذف جميع بياناتك بشكل دائم. لا يمكن التراجع عن هذا الإجراء."
                        : "This will permanently delete all your data. This action cannot be undone."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={resetData} data-testid="button-confirm-reset">
                      {language === "ar" ? "نعم، احذف كل شيء" : "Yes, delete everything"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
