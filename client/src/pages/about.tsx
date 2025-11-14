import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin, Globe, Heart } from "lucide-react";

export default function About() {
  const { language } = useLanguage();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">{language === "ar" ? "عن التطبيق" : "About"}</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="shadow-xl bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              {language === "ar" ? "بركة" : "Baraka"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-lg leading-relaxed">
              {language === "ar"
                ? "تطبيق إنتاجية إسلامي فاخر ثنائي اللغة مصمم لمساعدتك على تحقيق التوازن بين العبادة والعمل والنمو الشخصي. تتبع صلواتك، وأدر مهامك، وادرس بفعالية، واقرأ بانتظام - كل ذلك في مكان واحد جميل."
                : "A luxury bilingual Islamic productivity application designed to help you achieve balance between worship, work, and personal growth. Track your prayers, manage tasks, study effectively, and read consistently - all in one beautiful place."}
            </p>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span>{language === "ar" ? "صنع بـ" : "Made with"}</span>
              <Heart className="h-5 w-5 text-primary fill-primary" />
              <span>{language === "ar" ? "للمجتمع الإسلامي" : "for the Islamic community"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{language === "ar" ? "الميزات" : "Features"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <div>
                  <strong>{language === "ar" ? "تتبع الصلوات" : "Prayer Tracking"}</strong>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "تتبع صلواتك اليومية مع أوقات الصلاة المبنية على الموقع"
                      : "Track your daily prayers with location-based prayer times"}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <div>
                  <strong>{language === "ar" ? "عداد الأذكار" : "Dhikr Counter"}</strong>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "عد أذكارك مع أذكار السنة المحددة مسبقاً والعبارات المخصصة"
                      : "Count your dhikr with predefined Sunnah adhkar and custom phrases"}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <div>
                  <strong>{language === "ar" ? "مؤقت بومودورو" : "Pomodoro Timer"}</strong>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "ادرس بفعالية مع جلسات بومودورو الم focused"
                      : "Study effectively with focused Pomodoro sessions"}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <div>
                  <strong>{language === "ar" ? "إدارة المهام" : "Task Management"}</strong>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "نظم مهامك مع الأولويات والعلامات والتصفية"
                      : "Organize your tasks with priorities, tags, and filtering"}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <div>
                  <strong>{language === "ar" ? "تتبع القراءة" : "Reading Tracker"}</strong>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "حدد وحقق أهداف القراءة اليومية"
                      : "Set and achieve daily reading goals"}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <div>
                  <strong>{language === "ar" ? "ثلاثة مواضيع فاخرة" : "Three Luxury Themes"}</strong>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "اختر من مواضيع الذهب والأخضر والداكن"
                      : "Choose from Gold, Green, and Dark themes"}
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{language === "ar" ? "المطور" : "Developer"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-3xl text-primary-foreground mx-auto font-bold">
                OB
              </div>
              <div>
                <h3 className="text-2xl font-bold">Omar Basuoney</h3>
                <p className="text-muted-foreground">
                  {language === "ar" ? "مطور البرمجيات" : "Software Developer"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="lg" asChild>
                <a href="mailto:omar.basuoney@example.com" data-testid="link-email">
                  <Mail className="h-5 w-5 mr-2" />
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/omarbasuoney" target="_blank" rel="noopener noreferrer" data-testid="link-github">
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://linkedin.com/in/omarbasuoney" target="_blank" rel="noopener noreferrer" data-testid="link-linkedin">
                  <Linkedin className="h-5 w-5 mr-2" />
                  LinkedIn
                </a>
              </Button>
            </div>

            <p className="text-center text-muted-foreground text-sm">
              {language === "ar"
                ? "شكراً لاستخدام بركة. نأمل أن يساعدك هذا التطبيق في رحلتك نحو الإنتاجية والنمو الروحي."
                : "Thank you for using Baraka. May this app assist you in your journey towards productivity and spiritual growth."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
