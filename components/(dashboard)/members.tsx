"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure you have installed this component
import {
  MoreHorizontal,
  ShieldCheck,
  UserCheck,
  UserMinus,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// API Hooks
import { useUpdateMember } from "@/fetures/members/api/use-update-member";
import { useDeleteMember } from "@/fetures/members/api/use-delete-member";
import { useGetMembers } from "@/fetures/members/api/use-get-members";
import { ConfirmModal } from "@/hooks/ConfirmModal";
import { InviteModal } from "../(members)/InviteModal";
import { useMappedMembers } from "@/hooks/useMappedMembers";
import { AVATAR_COLORS } from "@/lib/data";

// Matches your backend validation
type Role = "ADMIN" | "MEMBER";

interface Member {
  $id: string; 
  name: string;
  email: string;
  role: Role;
}

// --- Loading Placeholder Component ---
function MemberRowSkeleton({ width = "w-[40%]" }: { width?: string }) {
  return (
    <div className="relative overflow-hidden flex items-center gap-4 px-5 py-4 group">
      {/* 1. The Shimmer Layer */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

      {/* 2. Avatar Container */}
      <div className="relative shrink-0">
        <Skeleton className="w-10 h-10 rounded-full bg-slate-200 scale-95" />
      </div>

      {/* 3. Text Content */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Name Bar */}
        <Skeleton className={cn("h-3.5 rounded-md bg-slate-200", width)} />
        {/* Email Bar */}
        <Skeleton className="h-3 w-[60%] rounded-md bg-slate-100 opacity-70" />
      </div>

      {/* 4. Badge & Action - Hidden on mobile, subtle scaling */}
      <div className="hidden sm:flex items-center gap-4 shrink-0">
        <Skeleton className="h-5 w-14 rounded-full bg-slate-100 scale-90" />
        <Skeleton className="h-8 w-8 rounded-lg bg-slate-50" />
      </div>
    </div>
  );
}

function getAvatarColor(name: string) {
  const letter = name[0]?.toUpperCase() ?? "A";
  return AVATAR_COLORS[letter] ?? "bg-slate-100 text-slate-700";
}

function Avatar({ name }: { name?: string }) {
  const safeName = name || "Unknown";
  const initials = safeName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className={cn(
      "flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold shrink-0 select-none",
      getAvatarColor(safeName),
    )}>
      {initials}
    </div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-xs font-medium px-2 py-0.5 rounded-full",
        role === "ADMIN"
          ? "bg-violet-50 text-violet-700 border border-violet-200"
          : "bg-slate-100 text-slate-600 border border-slate-200",
      )}
    >
      {role === "ADMIN" ? "Admin" : "Member"}
    </Badge>
  );
}

function MemberRow({
  member,
  onSetAdmin,
  onSetMember,
  onRemove,
  isPending,
}: {
  member: Member;
  onSetAdmin: (id: string) => void;
  onSetMember: (id: string) => void;
  onRemove: (id: string) => void;
  isPending: boolean;
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <>
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          onRemove(member.$id);
          setShowConfirmModal(false);
        }}
        title="Remove Member"
        message={`Are you sure you want to remove ${member.name || "this user"}? This action cannot be undone.`}
        isLoading={isPending}
      />

      <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
        <Avatar name={member.name} />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
          <p className="text-xs text-slate-400 truncate">{member.email}</p>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <RoleBadge role={member.role} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isPending}
              className="h-8 w-8 text-slate-400 hover:text-slate-700 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 bg-white border-none">
            <DropdownMenuItem
              onClick={() => onSetAdmin(member.$id)}
              disabled={member.role === "ADMIN" || isPending}
              className="gap-2 cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-violet-500 " />
              Set as admin
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSetMember(member.$id)}
              disabled={member.role === "MEMBER" || isPending}
              className="gap-2 cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5 text-slate-500" />
              Set as member
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowConfirmModal(true)}
              disabled={isPending}
              className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <UserMinus className="h-3.5 w-3.5" />
              Remove user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export default function MembersPage({ workspaceId }: { workspaceId: string }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetMembers({ workspaceId });
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();

  const isPending = isUpdating || isDeleting;
  const members = (data?.populateMembers as unknown as Member[]) || [];
  const mappedMembers = useMappedMembers(members);

  const handleSetAdmin = (id: string) => {
    updateMember({ param: { memberId: id }, json: { role: "ADMIN" } });
  };

  const handleSetMember = (id: string) => {
    updateMember({ param: { memberId: id }, json: { role: "MEMBER" } });
  };

  const handleRemove = (id: string) => {
    deleteMember({ param: { memberId: id } });
  };

  const filtered = members.filter((m) => {
    const searchLower = search.toLowerCase();
    return (m.name || "").toLowerCase().includes(searchLower) || 
           (m.email || "").toLowerCase().includes(searchLower);
  });

  const admins = filtered.filter((m) => m.role === "ADMIN");
  const regularMembers = filtered.filter((m) => m.role === "MEMBER");

  return (
    <>
      <InviteModal open={open} onOpenChange={setOpen} members={mappedMembers} />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-5 w-5 text-violet-600" />
                <h1 className="text-xl font-semibold text-slate-900">Members</h1>
              </div>
              <p className="text-sm text-slate-400">
                {isLoading ? "Loading members..." : `${members.length} people in your workspace`}
              </p>
            </div>
            <Button
              onClick={() => setOpen(true)}
              size="sm"
              className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-10 bg-white border-slate-200 text-base focus-visible:ring-violet-500"
            />
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <div>
                <Skeleton className="h-3 w-20 mb-2 ml-1" />
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {[1, 2].map((i) => <MemberRowSkeleton key={i} />)}
                </div>
              </div>
              <div>
                <Skeleton className="h-3 w-20 mb-2 ml-1" />
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {[1, 2, 3].map((i) => <MemberRowSkeleton key={i} />)}
                </div>
              </div>
            </div>
          ) : (
            <>
              {admins.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-1">
                    Admins · {admins.length}
                  </p>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {admins.map((m) => (
                      <MemberRow
                        key={m.$id}
                        member={m}
                        onSetAdmin={handleSetAdmin}
                        onSetMember={handleSetMember}
                        onRemove={handleRemove}
                        isPending={isPending}
                      />
                    ))}
                  </div>
                </div>
              )}

              {regularMembers.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-1">
                    Members · {regularMembers.length}
                  </p>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {regularMembers.map((m) => (
                      <MemberRow
                        key={m.$id}
                        member={m}
                        onSetAdmin={handleSetAdmin}
                        onSetMember={handleSetMember}
                        onRemove={handleRemove}
                        isPending={isPending}
                      />
                    ))}
                  </div>
                </div>
              )}

              {filtered.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <Users className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No members match your search.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}