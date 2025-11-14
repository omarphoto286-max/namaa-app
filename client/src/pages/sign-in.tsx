import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Globe } from "lucide-react";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const { signIn } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: t("success"),
        description: language === "ar" ? "تم تسجيل الدخول بنجاح" : "Signed in successfully",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--primary)/0.05),_transparent_50%)] pointer-events-none" />
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-6 right-6 z-10"
        onClick={() => setLanguage(language === "en" ? "ar" : "en")}
        data-testid="button-toggle-language"
      >
        <Globe className="h-5 w-5" />
      </Button>

      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-card/95 border-border relative z-10" data-testid="card-signin">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {language === "ar" ? "بركة" : "Baraka"}
          </CardTitle>
          <CardDescription className="text-lg">
            {t("signIn")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={language === "ar" ? "البريد الإلكتروني" : "your@email.com"}
                className="text-base"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={language === "ar" ? "كلمة المرور" : "Password"}
                className="text-base"
                data-testid="input-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-signin">
              {isLoading ? (language === "ar" ? "جارٍ تسجيل الدخول..." : "Signing in...") : t("signIn")}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {language === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setLocation("/sign-up")}
                className="text-primary hover:underline font-medium"
                data-testid="link-signup"
              >
                {t("signUp")}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
