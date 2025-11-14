import { z } from "zod";

// Authentication Schemas
export const userSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  passwordHash: z.string(),
  createdAt: z.string(),
});

export const signUpSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type User = z.infer<typeof userSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;

// Prayer Schemas
export const prayerSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  fajr: z.boolean().default(false),
  dhuhr: z.boolean().default(false),
  asr: z.boolean().default(false),
  maghrib: z.boolean().default(false),
  isha: z.boolean().default(false),
  sunnahFajr: z.boolean().default(false),
  sunnahDhuhr: z.boolean().default(false),
  sunnahAsr: z.boolean().default(false),
  sunnahMaghrib: z.boolean().default(false),
  sunnahIsha: z.boolean().default(false),
});

export type Prayer = z.infer<typeof prayerSchema>;

export const prayerTimesSchema = z.object({
  fajr: z.string(),
  dhuhr: z.string(),
  asr: z.string(),
  maghrib: z.string(),
  isha: z.string(),
  sunrise: z.string(),
});

export type PrayerTimes = z.infer<typeof prayerTimesSchema>;

// Dhikr Schemas
export const dhikrSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  dhikrText: z.string(),
  count: z.number(),
  target: z.number(),
  date: z.string(),
  completed: z.boolean().default(false),
});

export type DhikrSession = z.infer<typeof dhikrSessionSchema>;

// Task Schemas
export const taskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  tags: z.array(z.string()).default([]),
  completed: z.boolean().default(false),
  createdAt: z.string(),
});

export const insertTaskSchema = taskSchema.omit({ id: true, userId: true, createdAt: true });

export type Task = z.infer<typeof taskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// Course Schemas
export const courseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, "Course name is required"),
  color: z.string().default("#D4AF37"),
  createdAt: z.string(),
});

export const dailyMetricSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  date: z.string(),
  metric1: z.number().default(0),
  metric2: z.number().default(0),
  metric3: z.number().default(0),
  metric4: z.number().default(0),
  metric5: z.number().default(0),
});

export const insertCourseSchema = courseSchema.omit({ id: true, userId: true, createdAt: true });
export const insertDailyMetricSchema = dailyMetricSchema.omit({ id: true, userId: true });

export type Course = z.infer<typeof courseSchema>;
export type DailyMetric = z.infer<typeof dailyMetricSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertDailyMetric = z.infer<typeof insertDailyMetricSchema>;

// Reading Goal (Wird) Schemas
export const readingGoalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  target: z.number().default(10),
  progress: z.number().default(0),
});

export type ReadingGoal = z.infer<typeof readingGoalSchema>;

// Achievement Schemas
export const achievementSchema = z.object({
  id: z.string(),
  titleEn: z.string(),
  titleAr: z.string(),
  descriptionEn: z.string(),
  descriptionAr: z.string(),
  icon: z.string(),
  condition: z.string(),
});

export type Achievement = z.infer<typeof achievementSchema>;

export const userAchievementSchema = z.object({
  userId: z.string(),
  achievementId: z.string(),
  unlockedAt: z.string(),
});

export type UserAchievement = z.infer<typeof userAchievementSchema>;

// Settings Schemas
export const settingsSchema = z.object({
  userId: z.string(),
  theme: z.enum(["gold", "green", "dark"]).default("gold"),
  language: z.enum(["en", "ar"]).default("en"),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  metricNames: z.object({
    metric1: z.object({ en: z.string(), ar: z.string(), visible: z.boolean() }).default({ en: "Focus", ar: "التركيز", visible: true }),
    metric2: z.object({ en: z.string(), ar: z.string(), visible: z.boolean() }).default({ en: "Interaction", ar: "التفاعل", visible: true }),
    metric3: z.object({ en: z.string(), ar: z.string(), visible: z.boolean() }).default({ en: "Application", ar: "التطبيق العملي", visible: true }),
    metric4: z.object({ en: z.string(), ar: z.string(), visible: z.boolean() }).default({ en: "Mistake Reduction", ar: "تقليل الأخطاء", visible: true }),
    metric5: z.object({ en: z.string(), ar: z.string(), visible: z.boolean() }).default({ en: "Discipline", ar: "الانضباط", visible: true }),
  }).default({
    metric1: { en: "Focus", ar: "التركيز", visible: true },
    metric2: { en: "Interaction", ar: "التفاعل", visible: true },
    metric3: { en: "Application", ar: "التطبيق العملي", visible: true },
    metric4: { en: "Mistake Reduction", ar: "تقليل الأخطاء", visible: true },
    metric5: { en: "Discipline", ar: "الانضباط", visible: true },
  }),
});

export type Settings = z.infer<typeof settingsSchema>;

// Pomodoro Session Schema
export const pomodoroSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  sessionsCompleted: z.number().default(0),
});

export type PomodoroSession = z.infer<typeof pomodoroSessionSchema>;

// Study Session Notes Schema
export const studySessionNotesSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  date: z.string(),
  errorLog: z.string().default(""),
  reviewNotes: z.string().default(""),
});

export type StudySessionNotes = z.infer<typeof studySessionNotesSchema>;
