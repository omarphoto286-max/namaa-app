import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Flame,
  GraduationCap,
  CheckSquare,
  BookOpen,
  BarChart3,
  Trophy,
  Lightbulb,
  Info,
  Settings,
} from "lucide-react";

export function BottomNav() {
  const { t, dir } = useLanguage();
  const [location, setLocation] = useLocation();

  const navItems = [
    { title: t("dashboard"), url: "/", icon: LayoutDashboard, testId: "nav-dashboard" },
    { title: t("worship"), url: "/worship", icon: Flame, testId: "nav-worship" },
    { title: t("study"), url: "/study", icon: GraduationCap, testId: "nav-study" },
    { title: t("tasks"), url: "/tasks", icon: CheckSquare, testId: "nav-tasks" },
    { title: t("reading"), url: "/reading", icon: BookOpen, testId: "nav-reading" },
    { title: t("statistics"), url: "/statistics", icon: BarChart3, testId: "nav-statistics" },
    { title: t("achievements"), url: "/achievements", icon: Trophy, testId: "nav-achievements" },
    { title: t("motivation"), url: "/motivation", icon: Lightbulb, testId: "nav-motivation" },
    { title: t("about"), url: "/about", icon: Info, testId: "nav-about" },
    { title: t("settings"), url: "/settings", icon: Settings, testId: "nav-settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div
        className={`
          flex items-center gap-4 px-3 py-2 overflow-x-auto no-scrollbar
          ${dir === "rtl" ? "flex-row-reverse" : "flex-row"}
        `}
        style={{
          direction: dir === "rtl" ? "rtl" : "ltr",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {navItems.map((item) => {
          const isActive = location === item.url;
          return (
            <button
              key={item.url}
              onClick={() => setLocation(item.url)}
              data-testid={item.testId}
              className={`
                flex flex-col items-center justify-center
                min-w-[70px] px-2 py-1.5 rounded-lg transition-all hover-elevate
                ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
              `}
            >
              <item.icon className={`h-5 w-5 mb-0.5 ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] font-medium text-center leading-tight">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
