import { useMemo } from "react";

// 1. Define your types for strictness
export interface AvatarColor {
  bg: string;
  text: string;
}

// Update this to match your actual Appwrite member interface
export interface RawMember {
  $id?: string;
  name?: string;
  email?: string;
  [key: string]: any; 
}

export interface MappedMember extends RawMember {
  name: string; // 🔥 Add this line! It forces 'name' to be a strict string.
  initials: string;
  color: string;
  textColor: string;
}

const AVATAR_COLORS: AvatarColor[] = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
];

export const useMappedMembers = (members?: RawMember[]): MappedMember[] => {
  // 2. Wrap in useMemo for performance optimization
  return useMemo(() => {
    if (!members || members.length === 0) return [];

    return members.map((member) => {
      // Safely fallback if name is somehow missing
      const safeName = member.name || "Unknown";

      const initials = safeName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U";

      const charCode = safeName.charCodeAt(0) || 0;
      const colorPair = AVATAR_COLORS[charCode % AVATAR_COLORS.length];

      return {
        ...member, // 🔥 Keep all original fields like $id and email!
        initials,
        name: safeName, // Override with the safe string
        color: colorPair.bg,
        textColor: colorPair.text,
      };
    });
  }, [members]); // Only recalculate if the raw members array actually changes
};