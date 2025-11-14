import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import type { PrayerTimes } from "@shared/schema";

export function PrayerTimesDisplay() {
  const { t, language } = useLanguage();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              const date = new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              const response = await fetch(
                `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`
              );
              
              const data = await response.json();
              
              if (data.code === 200 && data.data) {
                const timings = data.data.timings;
                setPrayerTimes({
                  fajr: timings.Fajr,
                  dhuhr: timings.Dhuhr,
                  asr: timings.Asr,
                  maghrib: timings.Maghrib,
                  isha: timings.Isha,
                  sunrise: timings.Sunrise,
                });
                
                const city = data.data.meta?.timezone || "Your Location";
                setLocation(city);
              }
              setLoading(false);
            },
            (error) => {
              console.error("Geolocation error:", error);
              fetchDefaultPrayerTimes();
            }
          );
        } else {
          fetchDefaultPrayerTimes();
        }
      } catch (error) {
        console.error("Error fetching prayer times:", error);
        setLoading(false);
      }
    };

    const fetchDefaultPrayerTimes = async () => {
      try {
        const date = new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${date}?city=Makkah&country=Saudi Arabia&method=4`
        );
        
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
          const timings = data.data.timings;
          setPrayerTimes({
            fajr: timings.Fajr,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha,
            sunrise: timings.Sunrise,
          });
          setLocation("Makkah");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching default prayer times:", error);
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  const prayerNames = [
    { key: "fajr" as const, name: t("fajr"), nameAr: "الفجر" },
    { key: "sunrise" as const, name: language === "ar" ? "الشروق" : "Sunrise", nameAr: "الشروق" },
    { key: "dhuhr" as const, name: t("dhuhr"), nameAr: "الظهر" },
    { key: "asr" as const, name: t("asr"), nameAr: "العصر" },
    { key: "maghrib" as const, name: t("maghrib"), nameAr: "المغرب" },
    { key: "isha" as const, name: t("isha"), nameAr: "العشاء" },
  ];

  if (loading) {
    return (
      <Card className="shadow-lg" data-testid="card-prayer-times">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {language === "ar" ? "مواقيت الصلاة" : "Prayer Times"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground">
              {language === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg" data-testid="card-prayer-times">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {language === "ar" ? "مواقيت الصلاة" : "Prayer Times"}
        </CardTitle>
        {location && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {location}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {prayerTimes ? (
          <div className="space-y-3">
            {prayerNames.map((prayer) => (
              <div
                key={prayer.key}
                className="flex justify-between items-center p-3 rounded-lg bg-accent/30 hover-elevate"
                data-testid={`prayer-time-${prayer.key}`}
              >
                <span className="font-semibold text-lg">
                  {language === "ar" ? prayer.nameAr : prayer.name}
                </span>
                <span className="text-2xl font-bold text-primary tabular-nums">
                  {prayerTimes[prayer.key]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            {language === "ar"
              ? "غير قادر على تحميل مواقيت الصلاة"
              : "Unable to load prayer times"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
