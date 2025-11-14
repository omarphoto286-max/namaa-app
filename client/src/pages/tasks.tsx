import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

export default function Tasks() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    tags: "",
  });
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    const stored = localStorage.getItem(`tasks_${user?.id}`);
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, [user]);

  const saveTask = () => {
    if (!formData.title.trim()) return;

    const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingTask) {
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? { ...t, ...formData, tags: tagsArray }
          : t
      );
      setTasks(updated);
      localStorage.setItem(`tasks_${user?.id}`, JSON.stringify(updated));
      toast({
        title: language === "ar" ? "تم التحديث" : "Updated",
        description: language === "ar" ? "تم تحديث المهمة" : "Task updated",
      });
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        userId: user?.id || "",
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        tags: tagsArray,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [...tasks, newTask];
      setTasks(updated);
      localStorage.setItem(`tasks_${user?.id}`, JSON.stringify(updated));
      toast({
        title: language === "ar" ? "تم الإضافة" : "Added",
        description: language === "ar" ? "تم إضافة المهمة" : "Task added",
      });
    }

    setFormData({ title: "", description: "", priority: "medium", tags: "" });
    setEditingTask(null);
    setIsAddDialogOpen(false);
  };

  const toggleComplete = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    localStorage.setItem(`tasks_${user?.id}`, JSON.stringify(updated));
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem(`tasks_${user?.id}`, JSON.stringify(updated));
    toast({
      title: language === "ar" ? "تم الحذف" : "Deleted",
      description: language === "ar" ? "تم حذف المهمة" : "Task deleted",
    });
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      tags: task.tags.join(", "),
    });
    setIsAddDialogOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-primary text-primary-foreground",
    low: "bg-muted text-muted-foreground",
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-4xl font-bold">{t("tasks")}</h1>
        <div className="flex gap-3 items-center">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-40" data-testid="select-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === "ar" ? "الكل" : "All"}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="completed">{t("completed")}</SelectItem>
            </SelectContent>
          </Select>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingTask(null);
                setFormData({ title: "", description: "", priority: "medium", tags: "" });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button data-testid="button-add-task">
                <Plus className="h-4 w-4 mr-2" />
                {language === "ar" ? "إضافة مهمة" : "Add Task"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTask
                    ? language === "ar" ? "تعديل المهمة" : "Edit Task"
                    : language === "ar" ? "إضافة مهمة جديدة" : "Add New Task"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t("title")}</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={language === "ar" ? "عنوان المهمة" : "Task title"}
                    data-testid="input-task-title"
                  />
                </div>
                <div>
                  <Label>{t("description")}</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={language === "ar" ? "وصف المهمة" : "Task description"}
                    data-testid="input-task-description"
                  />
                </div>
                <div>
                  <Label>{t("priority")}</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">{t("high")}</SelectItem>
                      <SelectItem value="medium">{t("medium")}</SelectItem>
                      <SelectItem value="low">{t("low")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("tags")}</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder={language === "ar" ? "مثال: عمل, شخصي" : "e.g., work, personal"}
                    data-testid="input-task-tags"
                  />
                </div>
                <Button onClick={saveTask} className="w-full" data-testid="button-save-task">
                  {t("save")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-muted-foreground text-lg">
              {language === "ar" ? "لا توجد مهام" : "No tasks found"}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`shadow-lg ${task.completed ? "opacity-60" : ""}`}
              data-testid={`task-${task.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleComplete(task.id)}
                      className="mt-1"
                      data-testid={`checkbox-task-${task.id}`}
                    />
                    <div className="flex-1">
                      <CardTitle className={`text-lg ${task.completed ? "line-through" : ""}`}>
                        {task.title}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(task)}
                      data-testid={`button-edit-task-${task.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      data-testid={`button-delete-task-${task.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {task.description && (
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={priorityColors[task.priority]}>
                    {t(task.priority)}
                  </Badge>
                  {task.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
