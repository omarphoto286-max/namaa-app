import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
  LogOut,
} from "lucide-react";
import { useLocation } from "wouter";

export function AppSidebar() {
  const { t } = useLanguage();
  const { signOut, user } = useAuth();
  const [location, setLocation] = useLocation();

  const menuItems = [
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
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sidebar-primary to-sidebar-primary/70 bg-clip-text text-transparent">
          {t("dashboard")}
        </h2>
        {user && (
          <p className="text-sm text-sidebar-foreground/70 truncate mt-1">
            {user.fullName}
          </p>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => setLocation(item.url)}
                    isActive={location === item.url}
                    data-testid={item.testId}
                    className="gap-3 py-3"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-base">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut} data-testid="button-signout" className="gap-3">
              <LogOut className="h-5 w-5" />
              <span>{t("signOut")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
