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
import {
  MoreHorizontal,
  ShieldCheck,
  UserCheck,
  UserMinus,
  Search,
  UserPlus,
  Users,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// API Hooks
import { useUpdateMember } from "@/fetures/members/api/use-update-member";
import { useDeleteMember } from "@/fetures/members/api/use-delete-member";
import { useGetMembers } from "@/fetures/members/api/use-get-members";
import { ConfirmModal } from "@/hooks/ConfirmModal";

// Import your new ConfirmModal!

// Matches your backend validation
type Role = "ADMIN" | "MEMBER";

interface Member {
  $id: string; // Appwrite uses $id
  name: string;
  email: string;
  role: Role;
}

const AVATAR_COLORS: Record<string, string> = {
  A: "bg-violet-100 text-violet-700", B: "bg-blue-100 text-blue-700",
  C: "bg-cyan-100 text-cyan-700", D: "bg-emerald-100 text-emerald-700",
  E: "bg-amber-100 text-amber-700", F: "bg-rose-100 text-rose-700",
  G: "bg-pink-100 text-pink-700", H: "bg-indigo-100 text-indigo-700",
  I: "bg-teal-100 text-teal-700", J: "bg-orange-100 text-orange-700",
  K: "bg-lime-100 text-lime-700", L: "bg-sky-100 text-sky-700",
  M: "bg-purple-100 text-purple-700", N: "bg-fuchsia-100 text-fuchsia-700",
  O: "bg-red-100 text-red-700", P: "bg-yellow-100 text-yellow-700",
  Q: "bg-green-100 text-green-700", R: "bg-blue-100 text-blue-700",
  S: "bg-violet-100 text-violet-700", T: "bg-emerald-100 text-emerald-700",
  U: "bg-cyan-100 text-cyan-700", V: "bg-rose-100 text-rose-700",
  W: "bg-amber-100 text-amber-700", X: "bg-indigo-100 text-indigo-700",
  Y: "bg-teal-100 text-teal-700", Z: "bg-orange-100 text-orange-700",
};

function getAvatarColor(name: string) {
  const letter = name[0]?.toUpperCase() ?? "A";
  return AVATAR_COLORS[letter] ?? "bg-slate-100 text-slate-700";
}

function Avatar({ name }: { name?: string }) {
  const safeName = name || "Unknown";

  const initials = safeName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold shrink-0 select-none",
        getAvatarColor(safeName),
      )}
    >
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
  // 🔥 Add the modal state exactly here!
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmDelete = () => {
    onRemove(member.$id);
    setShowConfirmModal(false);
  };

  return (
    <>
      {/* Add the ConfirmModal to intercept the delete action */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Member"
        message={`Are you sure you want to remove ${member.name || "this user"} from the workspace? This action cannot be undone.`}
        isLoading={isPending}
      />

      <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
        <Avatar name={member.name} />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">
            {member.name}
          </p>
          <p className="text-xs text-slate-400 truncate">{member.email}</p>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <RoleBadge role={member.role} />
        </div>

        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isPending}
              className="h-8 w-8 group-hover:opacity-200 focus:opacity-100 text-slate-400 hover:text-slate-700 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
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
              // 🔥 Just open the modal here, don't use window.confirm
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
  
  // Removed showConfirmModal from here!

  const { data, isLoading } = useGetMembers({ workspaceId });
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();

  const isPending = isUpdating || isDeleting;
  const members = (data?.populateMembers as unknown as Member[]) || [];

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
    const nameMatch = (m.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const emailMatch = (m.email || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return nameMatch || emailMatch;
  });

  const admins = filtered.filter((m) => m.role === "ADMIN");
  const regularMembers = filtered.filter((m) => m.role === "MEMBER");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-violet-600" />
              <h1 className="text-xl font-semibold text-slate-900">Members</h1>
            </div>
            <p className="text-sm text-slate-400">
              {members.length} people in your workspace
            </p>
          </div>
          <Button
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
      </div>
    </div>
  );
}