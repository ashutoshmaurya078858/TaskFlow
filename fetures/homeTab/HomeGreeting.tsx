import { Zap } from "lucide-react";
import { format } from "date-fns";

interface HomeGreetingProps {
  name?:         string;
  overdueCount:  number;
  myTasksCount:  number;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getSubtitle(overdueCount: number, myTasksCount: number): string {
  if (overdueCount > 0)
    return `You have ${overdueCount} overdue task${overdueCount > 1 ? "s" : ""} — let's get on top of it.`;
  if (myTasksCount > 0)
    return `You have ${myTasksCount} open task${myTasksCount > 1 ? "s" : ""} to work through.`;
  return "You're all caught up. Nice work!";
}

export function HomeGreeting({ name, overdueCount, myTasksCount }: HomeGreetingProps) {
  const firstName = name?.split(" ")[0];

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Zap className="size-4 text-indigo-500" />
        <p className="text-sm text-gray-400">{format(new Date(), "EEEE, MMMM d")}</p>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">
        {getGreeting()}{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="text-sm text-gray-400">
        {getSubtitle(overdueCount, myTasksCount)}
      </p>
    </div>
  );
}