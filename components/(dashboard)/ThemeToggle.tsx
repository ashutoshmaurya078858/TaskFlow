import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8" />;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200",
        "border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground",
        "hover:bg-sidebar-accent/80"
      )}
    >
      {isDark
        ? <Sun  className="h-3.5 w-3.5 text-amber-400" />
        : <Moon className="h-3.5 w-3.5 text-violet-600" />}
    </button>
  );
}