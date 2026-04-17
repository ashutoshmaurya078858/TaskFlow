import {
  LayoutGrid, ListTodo, Users, BarChart2, Zap, Settings2, Puzzle,
  Timer, Target, TrendingUp, Shield, Bell, Lock,
  GitBranch, Hash, PenTool, Globe // <-- Swapped Github & Slack for GitBranch & Hash
} from "lucide-react";

export const NAV_LINKS = ["Features", "Product", "Pricing", "Integrations", "Changelog"];
export const TRUSTED = ["Stripe", "Vercel", "Linear", "Notion", "Figma", "Loom", "Clerk", "PlanetScale"];

export const FEATURES = [
  { icon: ListTodo,   title: "Issue Tracking",         desc: "Capture, triage, and resolve bugs and tasks with powerful filtering." },
  { icon: Timer,      title: "Sprint Planning",        desc: "Build and run sprints with velocity charts and burndown tracking." },
  { icon: LayoutGrid, title: "Kanban Boards",          desc: "Visualise work in progress with drag-and-drop boards your team will love." },
  { icon: Users,      title: "Real-time Collaboration", desc: "Comment, mention, and co-edit issues with your team simultaneously." },
  { icon: BarChart2,  title: "Analytics & Reporting",  desc: "Custom dashboards with cycle time, throughput and lead time metrics." },
  { icon: Zap,        title: "Automation",             desc: "No-code rules that auto-assign, transition and notify on any event." },
  { icon: Settings2,  title: "Custom Workflows",       desc: "Shape statuses, fields and transitions to match how you actually work." },
  { icon: Puzzle,     title: "250+ Integrations",      desc: "Connect Slack, GitHub, Figma and hundreds more with one click." },
];

export const VIEWS = [
  {
    id: "kanban", label: "Kanban", color: "#6366f1",
    desc: "Drag cards across columns to reflect real workflow states. Perfect for continuous delivery.",
    cols: ["To Do", "In Progress", "In Review", "Done"],
    cards: [
      { col: 0, title: "Design new onboarding", tag: "UX", priority: "high" },
      { col: 0, title: "Fix login redirect bug", tag: "Bug", priority: "urgent" },
      { col: 1, title: "API rate limiting",        tag: "BE",  priority: "medium" },
      { col: 1, title: "Dashboard redesign",       tag: "UX",  priority: "low" },
      { col: 2, title: "Billing integration",      tag: "FE",  priority: "high" },
      { col: 3, title: "Auth revamp",              tag: "BE",  priority: "medium" },
    ],
  },
  {
    id: "list", label: "List", color: "#0ea5e9",
    desc: "See every task, filter by assignee, priority or sprint. Great for planning sessions.",
    items: [
      { title: "Implement OAuth 2.0 flow",        status: "In Progress", priority: "High",   assignee: "AM" },
      { title: "Write unit tests for billing",      status: "To Do",       priority: "Medium", assignee: "JL" },
      { title: "Update design system tokens",       status: "In Review",   priority: "Low",    assignee: "SR" },
      { title: "Set up CI/CD pipeline",             status: "Done",        priority: "High",   assignee: "TP" },
      { title: "Document REST endpoints",           status: "To Do",       priority: "Medium", assignee: "AM" },
    ],
  },
  {
    id: "timeline", label: "Timeline", color: "#10b981",
    desc: "Plan sprints and track dependencies across time with a clean Gantt-style view.",
    bars: [
      { task: "Q2 Planning",       start: 0,  width: 20, color: "#6366f1" },
      { task: "Auth Module",       start: 5,  width: 35, color: "#0ea5e9" },
      { task: "Billing v2",        start: 15, width: 40, color: "#f59e0b" },
      { task: "Dashboard Refresh", start: 30, width: 30, color: "#10b981" },
      { task: "Performance Audit", start: 50, width: 25, color: "#ec4899" },
    ],
  },
];

export const STEPS = [
  { icon: Target,     step: "01", title: "Create a project",   desc: "Set up your workspace in seconds. Choose a template or start blank." },
  { icon: ListTodo,   step: "02", title: "Add tasks & issues", desc: "Break work into trackable items. Add context, files and due dates." },
  { icon: Users,      step: "03", title: "Collaborate live",   desc: "Assign work, comment and mention teammates in real time." },
  { icon: TrendingUp, step: "04", title: "Track & ship faster",desc: "Monitor progress, spot blockers early and celebrate delivery." },
];

export const TESTIMONIALS = [
  { quote: "We cut our sprint planning time by 60%. The Kanban and timeline views are genuinely best-in-class.", name: "Sarah Chen", role: "VP Engineering · Vercel", initials: "SC", color: "#6366f1" },
  { quote: "Finally a project tool the whole org actually uses. Design, eng, and product are finally in sync.", name: "Marcus Reid", role: "Co-founder · Loom", initials: "MR", color: "#0ea5e9" },
  { quote: "The automation rules alone saved us 5 hours a week. Setup took 10 minutes. Incredible.", name: "Priya Kapoor", role: "Head of Product · Stripe", initials: "PK", color: "#10b981" },
  { quote: "Linear is beautiful but this is Linear with the reporting power of Jira. Perfect combo.", name: "Tom Eriksson", role: "Engineering Manager · Figma", initials: "TE", color: "#f59e0b" },
];

export const PLANS = [
  { name: "Free", price: "$0", period: "forever", desc: "For individuals and tiny teams getting started.", cta: "Get started free", popular: false, features: ["Up to 5 members", "10 projects", "Basic kanban & list views", "2 GB storage", "Community support"] },
  { name: "Pro", price: "$12", period: "per seat / mo", desc: "For growing teams that need power and flexibility.", cta: "Start free trial", popular: true, features: ["Unlimited members", "Unlimited projects", "All views incl. Timeline", "Automations (500/mo)", "Analytics dashboard", "Priority support", "25 GB storage"] },
  { name: "Enterprise", price: "Custom", period: "tailored pricing", desc: "For orgs that need security, compliance and SLAs.", cta: "Contact sales", popular: false, features: ["Everything in Pro", "SSO / SAML", "Audit logs", "Custom roles & permissions", "SLA guarantees", "Dedicated CSM", "Unlimited storage"] },
];

export const INTEGRATIONS = [
  { name: "GitHub",  icon: GitBranch, color: "#24292e" }, // <-- Changed to GitBranch
  { name: "Slack",   icon: Hash,      color: "#4A154B" }, // <-- Changed to Hash
  { name: "Figma",   icon: PenTool,   color: "#F24E1E" }, 
  { name: "Chrome",  icon: Globe,     color: "#4285F4" }, 
  { name: "Notion",  icon: Bell,      color: "#000000" },
  { name: "GitLab",  icon: Shield,    color: "#FC6D26" },
  { name: "Linear",  icon: Zap,       color: "#5E6AD2" },
  { name: "Zapier",  icon: Lock,      color: "#FF4A00" },
];

export const PRIORITY_COLOR: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high:   "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low:    "bg-slate-100 text-slate-600",
};

export const STATUS_COLOR: Record<string, string> = {
  "In Progress": "bg-blue-100 text-blue-700",
  "To Do":       "bg-slate-100 text-slate-600",
  "In Review":   "bg-purple-100 text-purple-700",
  "Done":        "bg-green-100 text-green-700",
};

export const AVATAR_COLORS: Record<string, string> = {
   A: "bg-violet-100 text-violet-700",
   B: "bg-blue-100 text-blue-700",
   C: "bg-cyan-100 text-cyan-700",
   D: "bg-emerald-100 text-emerald-700",
   E: "bg-amber-100 text-amber-700",
   F: "bg-rose-100 text-rose-700",
   G: "bg-pink-100 text-pink-700",
   H: "bg-indigo-100 text-indigo-700",
   I: "bg-teal-100 text-teal-700",
   J: "bg-orange-100 text-orange-700",
   K: "bg-lime-100 text-lime-700",
   L: "bg-sky-100 text-sky-700",
   M: "bg-purple-100 text-purple-700",
   N: "bg-fuchsia-100 text-fuchsia-700",
   O: "bg-red-100 text-red-700",
   P: "bg-yellow-100 text-yellow-700",
   Q: "bg-green-100 text-green-700",
   R: "bg-blue-100 text-blue-700",
   S: "bg-violet-100 text-violet-700",
   T: "bg-emerald-100 text-emerald-700",
   U: "bg-cyan-100 text-cyan-700",
   V: "bg-rose-100 text-rose-700",
   W: "bg-amber-100 text-amber-700",
   X: "bg-indigo-100 text-indigo-700",
   Y: "bg-teal-100 text-teal-700",
   Z: "bg-orange-100 text-orange-700",
 };
 
 