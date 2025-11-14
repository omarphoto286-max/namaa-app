import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Quote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MotivationQuote {
  id: string;
  text: string;
  author?: string;
  isCustom: boolean;
}

const DEFAULT_QUOTES: MotivationQuote[] = [
  {
    id: "1",
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    isCustom: false,
  },
  {
    id: "2",
    text: "من جد وجد ومن زرع حصد",
    author: "مثل عربي",
    isCustom: false,
  },
  {
    id: "3",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    isCustom: false,
  },
  {
    id: "4",
    text: "العلم في الصغر كالنقش على الحجر",
    author: "حكمة عربية",
    isCustom: false,
  },
  {
    id: "5",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    isCustom: false,
  },
];

export default function Motivation() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<MotivationQuote[]>(() => {
    const stored = localStorage.getItem(`motivation_${user?.id}`);
    return stored ? JSON.parse(stored) : DEFAULT_QUOTES;
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({ text: "", author: "" });

  const addQuote = () => {
    if (!newQuote.text.trim()) return;

    const quote: MotivationQuote = {
      id: crypto.randomUUID(),
      text: newQuote.text,
      author: newQuote.author,
      isCustom: true,
    };

    const updated = [...quotes, quote];
    setQuotes(updated);
    localStorage.setItem(`motivation_${user?.id}`, JSON.stringify(updated));
    setNewQuote({ text: "", author: "" });
    setIsAddDialogOpen(false);
    toast({
      title: language === "ar" ? "تم الإضافة" : "Added",
      description: language === "ar" ? "تم إضافة الاقتباس" : "Quote added",
    });
  };

  const deleteQuote = (id: string) => {
    const updated = quotes.filter((q) => q.id !== id);
    setQuotes(updated);
    localStorage.setItem(`motivation_${user?.id}`, JSON.stringify(updated));
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف الاقتباس" : "Quote deleted",
    });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">{t("motivation")}</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-quote">
              <Plus className="h-4 w-4 mr-2" />
              {language === "ar" ? "إضافة اقتباس" : "Add Quote"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "ar" ? "إضافة اقتباس جديد" : "Add New Quote"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={newQuote.text}
                onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                placeholder={language === "ar" ? "اكتب الاقتباس هنا..." : "Enter quote text..."}
                rows={4}
                data-testid="input-quote-text"
              />
              <Input
                value={newQuote.author}
                onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                placeholder={language === "ar" ? "المؤلف (اختياري)" : "Author (optional)"}
                data-testid="input-quote-author"
              />
              <Button onClick={addQuote} className="w-full" data-testid="button-save-quote">
                {t("save")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotes.map((quote) => (
          <Card
            key={quote.id}
            className="shadow-lg hover-elevate active-elevate-2 transition-all"
            data-testid={`quote-${quote.id}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <Quote className="h-8 w-8 text-primary/30 flex-shrink-0" />
                {quote.isCustom && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteQuote(quote.id)}
                    data-testid={`button-delete-quote-${quote.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed italic">{quote.text}</p>
              {quote.author && (
                <p className="text-sm text-muted-foreground text-right">
                  — {quote.author}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {quotes.length === 0 && (
        <div className="text-center py-16">
          <Quote className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-lg">
            {language === "ar" ? "لا توجد اقتباسات بعد" : "No quotes yet"}
          </p>
        </div>
      )}
    </div>
  );
}
