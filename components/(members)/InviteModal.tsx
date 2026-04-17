"use client";

import * as React from "react";
import {
  Copy,
  Check,
  Send,
  Mail,
  Link2,
  Users,
  Info,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ResponsiveModal } from "../(dashboard)/responsive-model";

// API Hooks
import { useGetWorkspaces } from "@/fetures/workspace/api/use-get-workspaces";
import { useSendInvite } from "@/fetures/email/hooks/use-sent-invite";

// ── Types ──────────────────────────────────────────────────────────────────

interface Member {
  initials: string;
  name: string;
  color: string;
  textColor: string;
}

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceName?: string;
  members?: Member[];
  onSendInvite?: (email: string) => Promise<void>;
}

// ── Default demo members ───────────────────────────────────────────────────

const DEFAULT_MEMBERS: Member[] = [
  { initials: "AK", name: "Alice Kim", color: "bg-blue-100", textColor: "text-blue-700" },
  { initials: "RS", name: "Raj Singh", color: "bg-orange-100", textColor: "text-orange-700" },
  { initials: "MJ", name: "Maya Jones", color: "bg-emerald-100", textColor: "text-emerald-700" },
];

// ── Component ──────────────────────────────────────────────────────────────

export function InviteModal({
  open,
  onOpenChange,
  members = DEFAULT_MEMBERS,
  onSendInvite,
}: InviteModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const { data, isLoading } = useGetWorkspaces();
  
  // 🔥 Initialize the email mutation
  const { mutateAsync: sendInvite } = useSendInvite(); 

  const inviteLink = data?.documents?.[0]
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${data.documents[0].$id}/join/${data.documents[0].inviteCode}`
    : "";

    const workspaceName  = data?.documents?.[0].name

  // Focus email input when modal opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      const el = document.createElement("textarea");
      el.value = inviteLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateEmail = (val: string) => {
    if (!val) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return "Enter a valid email address.";
    return "";
  };

  // 🔥 The fully wired-up send function
  const handleSend = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      inputRef.current?.focus();
      return;
    }
    
    setEmailError("");
    setSending(true);
    
    try {
      if (onSendInvite) {
        await onSendInvite(email);
      } else {
        // 🔥 Trigger the real React Query Hook here!
        await sendInvite({
          json: {
            email: email,
            inviteLink: inviteLink,
            workspaceName: workspaceName,
          }
        });
      }
      setSent(true);
      setEmail("");
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error(err);
      setEmailError("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Invite People"
    >
      {/* ... KEEP THE REST OF YOUR BEAUTIFUL UI EXACTLY THE SAME ... */}
      <div className="flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-6 pb-5 border-b border-zinc-100">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-zinc-900 leading-tight">
              Invite people
            </h2>
            <p className="text-[13px] text-zinc-500 mt-0.5">
              Add teammates to{" "}
              <span className="font-medium text-zinc-700">{workspaceName}</span>
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Invite Link */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
              <Link2 className="w-3 h-3" />
              Invite link
            </label>

            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center h-9 px-3 rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden min-w-0">
                <span className="text-[13px] text-zinc-500 truncate select-all font-mono w-80">
                  {inviteLink}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className={cn(
                  "shrink-0 h-9 px-3 gap-1.5 text-[13px] font-medium rounded-lg border transition-all duration-200 cursor-pointer",
                  copied
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50",
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-100" />
            <span className="text-[12px] text-zinc-400">
              or invite by email
            </span>
            <div className="flex-1 h-px bg-zinc-100" />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
              <Mail className="w-3 h-3" />
              Email address
            </label>

            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="colleague@company.com"
                className={cn(
                  "flex-1 h-9 text-[13px] rounded-lg border bg-white placeholder:text-zinc-400",
                  "focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-400",
                  emailError
                    ? "border-red-300 focus-visible:ring-red-500/20 focus-visible:border-red-400"
                    : "border-zinc-200",
                )}
              />

              <Button
                size="sm"
                onClick={handleSend}
                disabled={sending}
                className={cn(
                  "shrink-0 h-9 px-3 gap-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 cursor-pointer",
                  sent
                    ? "bg-emerald-600 hover:bg-emerald-600 text-white border-transparent"
                    : "bg-zinc-900 hover:bg-zinc-800 text-white border-transparent",
                )}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending
                  </>
                ) : sent ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send invite
                  </>
                )}
              </Button>
            </div>

            {/* Error message */}
            {emailError && (
              <p className="mt-1.5 text-[12px] text-red-500 flex items-center gap-1">
                <Info className="w-3 h-3 shrink-0" />
                {emailError}
              </p>
            )}
          </div>

          {/* Members strip */}
          {members.length > 0 && (
            <div className="flex items-center gap-2.5 pt-1">
              <div className="flex items-center">
                {members.slice(0, 4).map((m, i) => (
                  <div
                    key={i}
                    title={m.name}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold",
                      m.color,
                      m.textColor,
                      i > 0 && "-ml-1.5",
                    )}
                  >
                    {m.initials}
                  </div>
                ))}
                {members.length > 4 && (
                  <div className="-ml-1.5 w-6 h-6 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-semibold text-zinc-500">
                    +{members.length - 4}
                  </div>
                )}
              </div>
              <span className="text-[12px] text-zinc-400">
                {members.length} member{members.length !== 1 ? "s" : ""} in this
                workspace
              </span>

              <Badge
                variant="secondary"
                className="ml-auto text-[11px] bg-zinc-100 text-zinc-500 border-0 font-normal px-2 py-0.5"
              >
                Free plan · 5 seats left
              </Badge>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-100 bg-zinc-50/70 flex items-center gap-2 rounded-b-xl">
          <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <p className="text-[12px] text-zinc-400">
            Invitees can access this workspace once they accept.
          </p>
        </div>
      </div>
    </ResponsiveModal>
  );
}