import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations = {
  en: {
    welcome: "Welcome",
    greeting: "Peace be upon you",
    dashboard: "Dashboard",
    worship: "Worship & Dhikr",
    study: "Study & Lessons",
    tasks: "Tasks",
    reading: "Reading",
    statistics: "Statistics",
    achievements: "Achievements",
    motivation: "Motivation",
    about: "About",
    settings: "Settings",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    sunnah: "Sunnah",
    dhikrCounter: "Dhikr Counter",
    pomodoroTimer: "Pomodoro Timer",
    prayerTracking: "Prayer Tracking",
    courseManagement: "Course Management",
    taskManagement: "Task Management",
    readingGoal: "Reading Goal",
    dailyVerse: "Daily Verse",
    wisdomQuote: "Wisdom of the Day",
    growthTree: "Growth Tree",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    theme: "Theme",
    language: "Language",
    gold: "Gold",
    green: "Green",
    dark: "Dark",
    export: "Export Data",
    import: "Import Data",
    resetData: "Reset Data",
    today: "Today",
    progress: "Progress",
    target: "Target",
    completed: "Completed",
    pending: "Pending",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    title: "Title",
    description: "Description",
    tags: "Tags",
    course: "Course",
    metric: "Metric",
    developer: "Developer",
    contact: "Contact",
  },
  ar: {
    welcome: "مرحباً",
    greeting: "السلام عليكم يا",
    dashboard: "الرئيسية",
    worship: "العبادات والأذكار",
    study: "المذاكرة والدراسة",
    tasks: "المهام",
    reading: "القراءة",
    statistics: "الإحصائيات",
    achievements: "الإنجازات",
    motivation: "التحفيز",
    about: "عن التطبيق",
    settings: "الإعدادات",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signOut: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم بالكامل",
    fajr: "الفجر",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    sunnah: "السنة",
    dhikrCounter: "عداد الأذكار",
    pomodoroTimer: "مؤقت بومودورو",
    prayerTracking: "تتبع الصلوات",
    courseManagement: "إدارة المواد",
    taskManagement: "إدارة المهام",
    readingGoal: "هدف القراءة",
    dailyVerse: "آية اليوم",
    wisdomQuote: "حكمة اليوم",
    growthTree: "شجرة النمو",
    start: "ابدأ",
    pause: "إيقاف مؤقت",
    reset: "إعادة تعيين",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    theme: "المظهر",
    language: "اللغة",
    gold: "ذهبي",
    green: "أخضر",
    dark: "داكن",
    export: "تصدير البيانات",
    import: "استيراد البيانات",
    resetData: "إعادة تعيين البيانات",
    today: "اليوم",
    progress: "التقدم",
    target: "الهدف",
    completed: "مكتمل",
    pending: "قيد الانتظار",
    priority: "الأولوية",
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",
    title: "العنوان",
    description: "الوصف",
    tags: "الوسوم",
    course: "المادة",
    metric: "المقياس",
    developer: "المطور",
    contact: "التواصل",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    const root = document.documentElement;
    const dir = language === "ar" ? "rtl" : "ltr";
    root.setAttribute("dir", dir);
    root.setAttribute("lang", language);
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
