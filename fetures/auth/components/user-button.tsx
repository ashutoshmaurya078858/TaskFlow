"use client";

import { useCurrent } from "@/app/(auth)/api/use-corrent";
import { useLogout } from "@/app/(auth)/api/use-logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, LogOut, Settings, User } from "lucide-react";

const COLOR_MAP: Record<number, { bg: string; text: string; ring: string }> = {
  0: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    ring: "hover:ring-violet-200",
  },
  1: { bg: "bg-sky-100", text: "text-sky-700", ring: "hover:ring-sky-200" },
  2: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    ring: "hover:ring-emerald-200",
  },
  3: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    ring: "hover:ring-amber-200",
  },
  4: { bg: "bg-rose-100", text: "text-rose-700", ring: "hover:ring-rose-200" },
};

export const UserButton = () => {
  const { data: user, isLoading } = useCurrent();
  const { mutate } = useLogout();

  if (isLoading) {
    return (
      <div className="size-9 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200">
        <Loader2 className="size-3.5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) return null;

  const { name, email } = user;

  const fallback = name
    ? name.charAt(0).toUpperCase()
    : (email?.charAt(0).toUpperCase() ?? "U");

  const color = COLOR_MAP[fallback.charCodeAt(0) % 5];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none group">
          <Avatar
            className={`size-9 ring-2 ring-transparent transition-all duration-150 ${color.ring} group-data-[state=open]:ring-offset-1`}
          >
            <AvatarImage src={(user as any).imageUrl} />
            <AvatarFallback
              className={`text-sm font-semibold ${color.bg} ${color.text}`}
            >
              {fallback}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={10}
        className="w-60 p-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg shadow-black/5"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border-b border-gray-100">
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={(user as any).imageUrl} />
            <AvatarFallback
              className={`text-base font-semibold ${color.bg} ${color.text}`}
            >
              {fallback}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
              {name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{email}</p>
          </div>
        </div>

        {/* Items */}
        <div className="p-1.5">
          <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900">
            <span className="size-7 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
              <User className="size-3.5 text-gray-500" />
            </span>
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900">
            <span className="size-7 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
              <Settings className="size-3.5 text-gray-500" />
            </span>
            Settings
          </DropdownMenuItem>
        </div>

        <div className="px-1.5 pb-1.5" onClick={() => mutate()}>
          <DropdownMenuSeparator className="mb-1.5 bg-gray-100" />
          <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700">
            <span className="size-7 rounded-md bg-red-50 flex items-center justify-center shrink-0">
              <LogOut className="size-3.5 text-red-500" />
            </span>
            Log out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
