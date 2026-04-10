import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Settings,
  FolderKanban,
  Layers,
  Smartphone,
} from "lucide-react";

export const NAV_ITEMS = [
  { title: "Home", id: "home", icon: LayoutDashboard, badge: null },
  { title: "My Tasks", id: "my-tasks", icon: CheckSquare, badge: "12" },
  { title: "Members", id: "members", icon: Users, badge: null },
  { title: "Settings", id: "settings", icon: Settings, badge: null },
];

export const PROJECTS = [
  { name: "Frontend Redesign", color: "#7c3aed", icon: FolderKanban, progress: 72 },
  { name: "API Integration", color: "#0ea5e9", icon: Layers, progress: 45 },
  { name: "Mobile App v2", color: "#10b981", icon: Smartphone, progress: 88 },
];