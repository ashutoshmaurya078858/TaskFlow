"use client";

import { useMemo } from "react";
import { isPast, isWithinInterval, addDays } from "date-fns";

import { useWorkspaceId } from "@/fetures/workspace/hookes/use-workspace-id";
import { useCurrent } from "@/app/(auth)/api/use-corrent";
import { useGetTask } from "@/fetures/tasks/hookes/use-get-task";
import { useGetMembers } from "@/fetures/members/api/use-get-members";

import { Task, TaskStatus } from "@/fetures/tasks/types";
import { HomeStatCards, WorkspaceStats } from "@/fetures/homeTab/StatCard";
import { MemberWorkload, TeamWorkload } from "@/fetures/homeTab/Teamworkload";
import { HomeGreeting } from "@/fetures/homeTab/HomeGreeting";
import { MyTasksList } from "@/fetures/homeTab/MyTasksList";
import { UpcomingDeadlines } from "@/fetures/homeTab/UpcomingDeadlines";
import { useGetMyTasks } from "@/fetures/tasks/api/use-getmy-task";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  $id: string;
  name: string;
  email: string;
}

// ─── Pure derivation helpers ──────────────────────────────────────────────────

function deriveStats(tasks: Task[]): WorkspaceStats {
  return {
    total: tasks.length,
    done: tasks.filter((t) => t.status === TaskStatus.DONE).length,
    inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
    overdue: tasks.filter(
      (t) =>
        t.dueDate &&
        t.status !== TaskStatus.DONE &&
        isPast(new Date(t.dueDate)),
    ).length,
  };
}

function deriveUpcoming(tasks: Task[]): Task[] {
  const now = new Date();
  const week = addDays(now, 7);
  return tasks
    .filter((t) => {
      if (!t.dueDate || t.status === TaskStatus.DONE) return false;
      const d = new Date(t.dueDate);
      return isPast(d) || isWithinInterval(d, { start: now, end: week });
    })
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
    )
    .slice(0, 5);
}

function deriveWorkload(tasks: Task[], members: Member[]): MemberWorkload[] {
  return members
    .filter((m) => !!m.name)
    .map((m) => {
      const memberTasks = tasks.filter((t) => t.assigneeId === m.$id);
      return {
        id: m.$id,
        name: m.name,
        count: memberTasks.length,
        done: memberTasks.filter((t) => t.status === TaskStatus.DONE).length,
      };
    })
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function deriveMyTasks(tasks: Task[], myMemberId: string): Task[] {
  if (!myMemberId) return [];
  return tasks
    .filter((t) => t.assigneeId === myMemberId && t.status !== TaskStatus.DONE)
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 6);
}

// ─── HomeTab ──────────────────────────────────────────────────────────────────

export default function HomeTab() {
  const workspaceId = useWorkspaceId();

  const { data: membersData, isPending: tasksLoading } = useGetMembers({
    workspaceId,
  });
  const members = (membersData?.populateMembers as unknown as Member[]) ?? [];
  const { data: currentUser } = useCurrent();

  const myMember = members.find((m) => m.email === currentUser?.email);
  const myMemberId = myMember?.$id ?? "";
  // ── Query 1: ALL my tasks with no filters → drives the stats cards
  const { data: allTasksData, isLoading: isLoadingAll } = useGetMyTasks({
    workspaceId,
    assigneeId: myMemberId,
  });

  const allTasks = (allTasksData?.documents as unknown as Task[]) ?? [];

  // ── Derived data ──────────────────────────────────────────────────────────
  const stats = useMemo(() => deriveStats(allTasks), [allTasks]);
  const upcoming = useMemo(() => deriveUpcoming(allTasks), [allTasks]);
  const workload = useMemo(
    () => deriveWorkload(allTasks, members),
    [allTasks, members],
  );
  const sortedMyTasks = useMemo(
    () => deriveMyTasks(allTasks, myMemberId),
    [allTasks, myMemberId],
  );
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <HomeGreeting
        name={currentUser?.name}
        overdueCount={stats.overdue}
        myTasksCount={sortedMyTasks.length}
      />

      <HomeStatCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MyTasksList
          tasks={sortedMyTasks}
          workspaceId={workspaceId}
          isLoading={tasksLoading}
        />
        <UpcomingDeadlines
          tasks={upcoming}
          workspaceId={workspaceId}
          isLoading={tasksLoading}
        />
      </div>

      <TeamWorkload members={workload} isLoading={tasksLoading} />
    </div>
  );
}
