import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PREDEFINED_DHIKR = [
  { id: "subhanallah", ar: "سبحان الله", en: "SubhanAllah", target: 33 },
  { id: "alhamdulillah", ar: "الحمد لله", en: "Alhamdulillah", target: 33 },
  { id: "allahuakbar", ar: "الله أكبر", en: "Allahu Akbar", target: 34 },
  { id: "lailahaillallah", ar: "لا إله إلا الله", en: "La ilaha illallah", target: 100 },
  { id: "astaghfirullah", ar: "أستغفر الله", en: "Astaghfirullah", target: 100 },
  { id: "salawat", ar: "اللهم صل على محمد", en: "Salawat", target: 100 },
  { id: "custom", ar: "مخصص", en: "Custom", target: 100 },
];

export function DhikrCounter() {
  const { t, language } = useLanguage();
  const [selectedDhikr, setSelectedDhikr] = useState("subhanallah");
  const [customText, setCustomText] = useState("");
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);

  const dhikr = PREDEFINED_DHIKR.find((d) => d.id === selectedDhikr);
  const displayText = selectedDhikr === "custom" ? customText : language === "ar" ? dhikr?.ar : dhikr?.en;
  const progress = (count / target) * 100;

  const increment = () => setCount((prev) => Math.min(prev + 1, target));
  const reset = () => setCount(0);

  const handleDhikrChange = (value: string) => {
    setSelectedDhikr(value);
    const newDhikr = PREDEFINED_DHIKR.find((d) => d.id === value);
    if (newDhikr) {
      setTarget(newDhikr.target);
      setCount(0);
    }
  };

  return (
    <Card className="shadow-lg" data-testid="component-dhikr">
      <CardHeader>
        <CardTitle className="text-center">{t("dhikrCounter")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>{language === "ar" ? "اختر الذكر" : "Select Dhikr"}</Label>
          <Select value={selectedDhikr} onValueChange={handleDhikrChange}>
            <SelectTrigger data-testid="select-dhikr">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_DHIKR.map((dhikr) => (
                <SelectItem key={dhikr.id} value={dhikr.id}>
                  {language === "ar" ? dhikr.ar : dhikr.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedDhikr === "custom" && (
            <Input
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={language === "ar" ? "أدخل الذكر المخصص" : "Enter custom dhikr"}
              data-testid="input-custom-dhikr"
            />
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              <Label>{t("target")}</Label>
              <Input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                min={1}
                data-testid="input-target"
              />
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="hsl(var(--primary))"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className="transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="text-7xl font-bold mb-2" data-testid="text-count">{count}</div>
            <p className="text-lg font-quran text-muted-foreground line-clamp-2">
              {displayText}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            variant="default"
            size="lg"
            onClick={increment}
            disabled={count >= target}
            className="h-16 w-16 rounded-full text-xl"
            data-testid="button-increment"
          >
            <Plus className="h-8 w-8" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={reset}
            className="h-16 w-16 rounded-full"
            data-testid="button-reset"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {count} / {target} ({Math.round(progress)}%)
          </p>
          {count >= target && (
            <p className="text-sm font-semibold text-primary mt-2 animate-pulse">
              {language === "ar" ? "ما شاء الله! اكتمل الهدف" : "MashaAllah! Target Complete"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
