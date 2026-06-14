import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, SpellCheck, Loader2, Moon, RotateCcw, Sun, Eye, Pencil } from "lucide-react";

import type { Resume, TemplateId } from "@/types/resume";
import { resumeSchema } from "@/schemas/resumeSchema";
import { emptyResume, sampleResume, useResumeStore } from "@/store/useResumeStore";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { ColorPicker } from "@/components/shared/ColorPicker";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";

type MobileView = "editor" | "preview";

function App() {
  const { theme, toggle } = useTheme();
  const { toast } = useToast();

  const resume = useResumeStore((s) => s.resume);
  const template = useResumeStore((s) => s.template);
  const accentColor = useResumeStore((s) => s.accentColor);
  const fontFamily = useResumeStore((s) => s.fontFamily);
  const setResume = useResumeStore((s) => s.setResume);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setAccentColor = useResumeStore((s) => s.setAccentColor);
  const setFontFamily = useResumeStore((s) => s.setFontFamily);

  const previewRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [mobileView, setMobileView] = useState<MobileView>("editor");

  const form = useForm<Resume>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resume,
    mode: "onChange",
  });

  useEffect(() => {
    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: ({ values }) => setResume(values),
    });
    return unsubscribe;
  }, [form, setResume]);

  const applyResume = (data: Resume) => {
    form.reset(data);
    setResume(data);
  };

  const handleDownload = form.handleSubmit(
    async (data) => {
      const STEP_MS = 1000;
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
      setResume(data);
      setDownloading(true);
      try {
        for (const step of [5, 25, 50, 75]) {
          setDownloadProgress(step);
          await wait(STEP_MS);
        }
        const { downloadResumePdf } = await import("@/lib/pdf");
        await downloadResumePdf({
          resume: data,
          template,
          accent: accentColor,
          font: fontFamily,
        });
        setDownloadProgress(100);
        await wait(STEP_MS);
        toast({
          title: "Resume downloaded",
          description: "Your text-based PDF has been generated.",
          variant: "success",
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Download failed",
          description: "Something went wrong while generating the PDF.",
          variant: "destructive",
        });
      } finally {
        setDownloading(false);
        setDownloadProgress(0);
      }
    },
    () => {
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
    },
  );

  return (
    <FormProvider {...form}>
      <div className="flex min-h-screen flex-col bg-muted/30">
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <SpellCheck className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <h1 className="text-base font-bold">ATSify</h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Your ATS-Friendly Resume Builder
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={template} onValueChange={(v) => setTemplate(v as TemplateId)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                </SelectContent>
              </Select>

              <ColorPicker
                value={accentColor}
                onChange={setAccentColor}
                font={fontFamily}
                onFontChange={setFontFamily}
              />

              <ResetDialog
                onReset={() => applyResume(emptyResume)}
                onLoadSample={() => applyResume(sampleResume)}
              />
              
              <Button variant="outline" size="icon" onClick={toggle} aria-label="Toggle dark mode">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button onClick={handleDownload} disabled={downloading} className="sm:min-w-[140px]">
                {downloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Downloading {downloadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download PDF</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-1 border-t p-2 lg:hidden">
            <Button
              variant={mobileView === "editor" ? "default" : "ghost"}
              size="sm"
              className="flex-1"
              onClick={() => setMobileView("editor")}
            >
              <Pencil className="h-4 w-4" /> Editor
            </Button>
            <Button
              variant={mobileView === "preview" ? "default" : "ghost"}
              size="sm"
              className="flex-1"
              onClick={() => setMobileView("preview")}
            >
              <Eye className="h-4 w-4" /> Preview
            </Button>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-0 lg:grid-cols-2">
          <section className={cn("border-r bg-background", mobileView === "preview" && "hidden lg:block")}>
            <ScrollArea className="h-[calc(100vh-4rem-1px)]">
              <form className="p-4 sm:p-6" onSubmit={(e) => e.preventDefault()}>
                <ResumeForm />
              </form>
            </ScrollArea>
          </section>

          <section className={cn("bg-muted/40", mobileView === "editor" && "hidden lg:block")}>
            <ScrollArea className="h-[calc(100vh-4rem-1px)]">
              <div className="flex justify-center p-4 sm:p-8">
                <div className="w-full max-w-[794px]">
                  <ResumePreview
                    ref={previewRef}
                    resume={resume}
                    template={template}
                    accent={accentColor}
                    font={fontFamily}
                  />
                </div>
              </div>
            </ScrollArea>
          </section>
        </main>
      </div>

      <Toaster />
    </FormProvider>
  );
}

function ResetDialog({ onReset, onLoadSample }: { onReset: () => void; onLoadSample: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Resume data options">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Load Sample Data</DialogTitle>
          <DialogDescription>
            Load the sample data to explore the templates, or clear everything and start fresh. Clearing
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-between">
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="secondary" onClick={onLoadSample}>
                Load sample
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={onReset}>
                Clear everything
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default App;
