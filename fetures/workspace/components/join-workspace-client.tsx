"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useJoinWorkspace } from "@/fetures/workspace/api/use-join-workspace";

interface Props {
  workspace: string;
  inviteCode: string;
  workspaceInfo: {
    name: string;
  };
}

export default function JoinWorkspaceClient({
  workspace,
  inviteCode,
  workspaceInfo,
}: Props) {
  const router = useRouter();
  const { mutate, isPending } = useJoinWorkspace();

  const handleJoin = () => {
    mutate(
      {
        param: { workspace },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/dashboard/workspace/${data.$id}`);
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl backdrop-blur-lg bg-white/80">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900">
            Join Workspace
          </CardTitle>

          <CardDescription className="text-gray-500 text-sm">
            You’ve been invited to collaborate
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-5 rounded-xl border bg-white shadow-sm text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Workspace
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {workspaceInfo.name}
            </p>
          </div>

          <div className="text-center text-sm text-gray-500">
            Accept this invitation to start collaborating with your team.
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full h-11">
                Cancel
              </Button>
            </Link>

            <Button
              onClick={handleJoin}
              disabled={isPending}
              className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {isPending ? "Joining..." : "Join"}
            </Button>
          </div>

          <p className="text-xs text-gray-400 text-center">
            By joining, you’ll gain access to this workspace.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
