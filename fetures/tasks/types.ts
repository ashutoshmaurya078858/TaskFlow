export enum TaskStatus {
    BACKLOG = "BACKLOG",
    TODO= "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",
    DONE = "DONE"
 }



export interface Task {
  $id:         string;
  $createdAt:  string;
  $updatedAt:  string;
  name:        string;
  status:      TaskStatus;
  workspaceId: string;
  projectId:   string;
  assigneeId:  string;
  dueDate:     string;
  description?: string;
  position:    number;
  project?:  { $id: string; name: string; imageUrl?: string };
  assignee?: { $id: string; name: string; email?: string };
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]:     "Backlog",
  [TaskStatus.TODO]:        "To Do",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.IN_REVIEW]:   "In Review",
  [TaskStatus.DONE]:        "Done",
};

export const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; dot: string }> = {
  [TaskStatus.BACKLOG]:     { bg: "bg-slate-100",  text: "text-slate-600",  dot: "bg-slate-400"  },
  [TaskStatus.TODO]:        { bg: "bg-gray-100",   text: "text-gray-600",   dot: "bg-gray-400"   },
  [TaskStatus.IN_PROGRESS]: { bg: "bg-blue-50",    text: "text-blue-600",   dot: "bg-blue-500"   },
  [TaskStatus.IN_REVIEW]:   { bg: "bg-yellow-50",  text: "text-yellow-700", dot: "bg-yellow-400" },
  [TaskStatus.DONE]:        { bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-500"  },
};