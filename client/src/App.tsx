import { useState } from "react";

import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe, LogOut } from "lucide-react";

import NotFound from "@/pages/not-found";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import Dashboard from "@/pages/dashboard";
import Worship from "@/pages/worship";
import Study from "@/pages/study";
import Tasks from "@/pages/tasks";
import Reading from "@/pages/reading";
import Statistics from "@/pages/statistics";
import Achievements from "@/pages/achievements";
import Motivation from "@/pages/motivation";
import About from "@/pages/about";
import Settings from "@/pages/settings";

// ✨ Import Splash Screen
import SplashScreen from "./components/SplashScreen";

// -----------------------------------------------------

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-2xl text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/sign-in" />;
  }

  return <Component />;
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-2xl text-primary">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function AuthenticatedLayout() {
  const { t, dir, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            نماء | Namaa
          </h1>
          {user && (
            <p className="text-sm text-muted-foreground hidden sm:block">
              {dir === "rtl" ? `السلام عليكم يا ${user.fullName}` : `Welcome, ${user.fullName}`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut} className="hidden sm:flex">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <Switch>
          <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
          <Route path="/worship" component={() => <ProtectedRoute component={Worship} />} />
          <Route path="/study" component={() => <ProtectedRoute component={Study} />} />
          <Route path="/tasks" component={() => <ProtectedRoute component={Tasks} />} />
          <Route path="/reading" component={() => <ProtectedRoute component={Reading} />} />
          <Route path="/statistics" component={() => <ProtectedRoute component={Statistics} />} />
          <Route path="/achievements" component={() => <ProtectedRoute component={Achievements} />} />
          <Route path="/motivation" component={() => <ProtectedRoute component={Motivation} />} />
          <Route path="/about" component={() => <ProtectedRoute component={About} />} />
          <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
          <Route component={NotFound} />
        </Switch>
      </main>

      <BottomNav />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/sign-in" component={() => <PublicRoute component={SignIn} />} />
      <Route path="/sign-up" component={() => <PublicRoute component={SignUp} />} />
      <Route>{() => <AuthenticatedLayout />}</Route>
    </Switch>
  );
}

// -----------------------------------------------------

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* ✨ شاشة اللوجو أول ما الأب يفتح */}
      {!loaded && <SplashScreen onFinish={() => setLoaded(true)} />}

      {/* 👇 باقي التطبيق بعد اختفاء السبلاتش */}
      {loaded && (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <TooltipProvider>
                  <Toaster />
                  <Router />
                </TooltipProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      )}
    </>
  );
}
