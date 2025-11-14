import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface GrowthTreeProps {
  tasksCompleted: number;
  pomodoroSessions: number;
  prayersCompleted: number;
  readingProgress: number;
}

export function GrowthTree({ tasksCompleted, pomodoroSessions, prayersCompleted, readingProgress }: GrowthTreeProps) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const leafCount = Math.min(tasksCompleted + pomodoroSessions, 20);
  const hasFlower = prayersCompleted >= 5;
  const hasFruit = readingProgress >= 100;

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center" data-testid="component-growthtree">
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full max-w-md"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease-in" }}
      >
        <g transform="translate(200, 450)">
          <path
            d="M 0 0 Q -30 -80, -20 -150 T 0 -250"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="drop-shadow-md"
          />
          
          <path
            d="M 0 0 Q 30 -80, 20 -150 T 0 -250"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            className="drop-shadow-md"
          />

          {Array.from({ length: leafCount }).map((_, i) => {
            const angle = (i / leafCount) * 360;
            const radius = 60 + (i % 3) * 30;
            const y = -100 - (i % 5) * 30;
            const x = Math.sin((angle * Math.PI) / 180) * (radius - i * 2);
            
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="12"
                ry="20"
                fill={`hsl(${120 + i * 5}, 70%, ${45 + (i % 2) * 10}%)`}
                opacity={mounted ? 0.85 : 0}
                transform={`rotate(${angle + i * 20} ${x} ${y})`}
                className="drop-shadow-sm"
                style={{
                  transition: "opacity 0.5s ease-in",
                  transitionDelay: `${i * 50}ms`,
                }}
              />
            );
          })}

          {hasFlower && (
            <g transform="translate(0, -280)">
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <ellipse
                  key={i}
                  cx={Math.cos((angle * Math.PI) / 180) * 25}
                  cy={Math.sin((angle * Math.PI) / 180) * 25}
                  rx="18"
                  ry="24"
                  fill="hsl(340, 75%, 65%)"
                  opacity={mounted ? 0.9 : 0}
                  className="drop-shadow-lg"
                  style={{
                    transition: "opacity 0.6s ease-in",
                    transitionDelay: "0.8s",
                  }}
                />
              ))}
              <circle
                cx="0"
                cy="0"
                r="15"
                fill="hsl(43, 84%, 50%)"
                opacity={mounted ? 1 : 0}
                className="drop-shadow-lg"
                style={{
                  transition: "opacity 0.6s ease-in",
                  transitionDelay: "1s",
                }}
              />
            </g>
          )}

          {hasFruit && (
            <g transform="translate(40, -200)">
              <ellipse
                cx="0"
                cy="0"
                rx="20"
                ry="25"
                fill="hsl(25, 80%, 50%)"
                opacity={mounted ? 0.95 : 0}
                className="drop-shadow-xl"
                style={{
                  transition: "opacity 0.6s ease-in",
                  transitionDelay: "1.2s",
                }}
              />
              <ellipse
                cx="-3"
                cy="-5"
                rx="8"
                ry="10"
                fill="hsl(25, 80%, 65%)"
                opacity={mounted ? 0.7 : 0}
                style={{
                  transition: "opacity 0.6s ease-in",
                  transitionDelay: "1.3s",
                }}
              />
            </g>
          )}
        </g>
      </svg>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-muted-foreground">
          {language === "ar" ? "أوراق: المهام والدراسة" : "Leaves: Tasks & Study"}
        </p>
        <p className="text-sm text-muted-foreground">
          {language === "ar" ? "زهرة: ٥ صلوات" : "Flower: 5 Prayers"}
        </p>
        <p className="text-sm text-muted-foreground">
          {language === "ar" ? "ثمرة: هدف القراءة" : "Fruit: Reading Goal"}
        </p>
      </div>
    </div>
  );
}
