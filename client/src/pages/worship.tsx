import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DhikrCounter } from "@/components/DhikrCounter";
import { MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PrayerTimes } from "@shared/schema";

export default function Worship() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);
  const [prayers, setPrayers] = useState({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    sunnahFajr: false,
    sunnahDhuhr: false,
    sunnahAsr: false,
    sunnahMaghrib: false,
    sunnahIsha: false,
  });

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const date = new Date();

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=2`
      );

      const data = await response.json();

      if (data.code === 200) {
        const times: PrayerTimes = {
          fajr: data.data.timings.Fajr,
          dhuhr: data.data.timings.Dhuhr,
          asr: data.data.timings.Asr,
          maghrib: data.data.timings.Maghrib,
          isha: data.data.timings.Isha,
          sunrise: data.data.timings.Sunrise,
        };

        setPrayerTimes(times);
        localStorage.setItem("prayerTimes", JSON.stringify(times));
        localStorage.setItem("prayerTimesDate", new Date().toISOString().split("T")[0]);

        toast({
          title: language === "ar" ? "تم جلب أوقات الصلاة" : "Prayer times fetched",
          description: language === "ar" ? "تم تحديث أوقات الصلاة بنجاح" : "Prayer times updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "فشل في جلب أوقات الصلاة" : "Failed to fetch prayer times",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem(`prayers_${user?.id}_${todayDate}`);
    if (stored) {
      setPrayers(JSON.parse(stored));
    }

    const storedTimes = localStorage.getItem("prayerTimes");
    const storedDate = localStorage.getItem("prayerTimesDate");

    if (storedTimes && storedDate === todayDate) {
      setPrayerTimes(JSON.parse(storedTimes));
    } else {
      fetchPrayerTimes();
    }
  }, [user]);

  const togglePrayer = (prayer: keyof typeof prayers) => {
    const newPrayers = { ...prayers, [prayer]: !prayers[prayer] };
    setPrayers(newPrayers);
    const todayDate = new Date().toISOString().split("T")[0];
    localStorage.setItem(`prayers_${user?.id}_${todayDate}`, JSON.stringify(newPrayers));
  };

  const prayerNames = [
    { key: "fajr", name: t("fajr"), time: prayerTimes?.fajr, testId: "prayer-fajr" },
    { key: "dhuhr", name: t("dhuhr"), time: prayerTimes?.dhuhr, testId: "prayer-dhuhr" },
    { key: "asr", name: t("asr"), time: prayerTimes?.asr, testId: "prayer-asr" },
    { key: "maghrib", name: t("maghrib"), time: prayerTimes?.maghrib, testId: "prayer-maghrib" },
    { key: "isha", name: t("isha"), time: prayerTimes?.isha, testId: "prayer-isha" },
  ];

  return (
    <div className="p-8 space-y-8">

      {/* العنوان والزرار — متظبط للموبايل */}
      <div className="flex flex-col gap-4 items-start justify-between md:flex-row md:items-center">
        <h1 className="text-4xl font-bold">{t("worship")}</h1>

        <Button onClick={fetchPrayerTimes} disabled={loading} data-testid="button-fetch-times">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          <span className="ml-2">
            {language === "ar" ? "جلب أوقات الصلاة" : "Fetch Prayer Times"}
          </span>
        </Button>
      </div>

      {/* كروت الصلاة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prayerNames.map((prayer) => (
          <Card key={prayer.key} className="shadow-lg" data-testid={prayer.testId}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{prayer.name}</span>
                {prayer.time && <span className="text-2xl font-mono">{prayer.time}</span>}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id={prayer.key}
                  checked={prayers[prayer.key as keyof typeof prayers]}
                  onCheckedChange={() => togglePrayer(prayer.key as keyof typeof prayers)}
                />
                <label htmlFor={prayer.key} className="text-lg font-medium cursor-pointer">
                  {language === "ar" ? "الفريضة" : "Obligatory"}
                </label>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id={`sunnah${prayer.key}`}
                  checked={
                  const key = `sunnah${prayer.key.charAt(0).toUpperCase() + prayer.key.slice(1)}` as keyof typeof prayers;

{
  prayers[key]
}

                  }
                  onCheckedChange={() =>
                    togglePrayer(
                      `sunnah${prayer.key.charAt(0).toUpperCase() + prayer.key.slice(1)}`
                      as keyof typeof prayers
                    )
                  }
                />
                <label
                  htmlFor={`sunnah${prayer.key}`}
                  className="text-lg text-muted-foreground cursor-pointer"
                >
                  {t("sunnah")}
                </label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* عداد الأذكار */}
      <div className="max-w-2xl mx-auto">
        <DhikrCounter />
      </div>
    </div>
  );
}
