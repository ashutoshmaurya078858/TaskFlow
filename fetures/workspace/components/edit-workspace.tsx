"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { ImageIcon, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateWorkspaceSchema } from "../schemas";
import Image from "next/image";
import { workspace } from "../typs";
import { useUpdateWorkspace } from "../api/use-update-workspce";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDeleteWorkspace } from "../api/use-delete-workspcs";
import { ResponsiveModal } from "@/components/(dashboard)/responsive-model";
import { useResetWorkspace } from "../api/use-reset-workspace";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: workspace;
}

export const EditWorkspaceForm = ({
  initialValues,
}: EditWorkspaceFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues.imageUrl || null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 👈 modal state
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { mutate: resetInvite, isPending: isResetting } = useResetWorkspace();

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const { mutate, isPending, isError, error } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace(); // 👈 delete hook

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      { form: finalValues, param: { workspace: initialValues.$id } },
      {
        onSuccess: () => {
          toast.success("Workspace Updated");
          form.reset();
          router.push(`/dashboard/workspace/${initialValues.$id}`);
        },
      },
    );
  };

  // 👇 Delete handler called after confirmation
  const handleDelete = () => {
    deleteWorkspace(
      { param: { workspace: initialValues.$id } },
      {
        onSuccess: () => {
          toast.success("Workspace deleted");
          setIsDeleteModalOpen(false);
          router.push("/dashboard");
        },
        onError: () => {
          toast.error("Failed to delete workspace");
          setIsDeleteModalOpen(false);
        },
      },
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      form.setValue("image", file as any);
    }
  };

  const inviteCode = `${window.location.origin}/dashboard/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleResetInvite = () => {
    resetInvite(
      { param: { workspace: initialValues.$id } },
      {
        onSuccess: () => {
          router.refresh(); // optional but recommended
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-center w-full md:mt-28 mt-20">
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="bg-white border backdrop-blur-md shadow-sm border-b border-slate-100 rounded-xl overflow-hidden">
          <CardHeader className="pb-2 px-6 pt-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Edit Workspace
            </CardTitle>
            <CardDescription className="text-gray-500 text-sm mt-1">
              Update your workspace details and logo.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pt-4 pb-6">
            {isError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                <p>
                  {error?.message ||
                    "Something went wrong while updating the workspace. Please try again."}
                </p>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* --- IMAGE UPLOAD SECTION --- */}
              <div className="flex flex-col gap-y-2">
                <Label className="text-gray-600 font-medium uppercase text-xs tracking-wide">
                  Workspace Logo
                </Label>
                <div className="flex items-center gap-x-5">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Workspace Logo"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 mb-2">
                      JPG, PNG, SVG or GIF, max 2MB
                    </p>
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png, .svg, .gif"
                      ref={inputRef}
                      onChange={handleImageChange}
                      disabled={isPending}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => inputRef.current?.click()}
                      className="w-fit h-8 text-xs font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      {imagePreview ? "Change Logo" : "Upload Logo"}
                    </Button>
                  </div>
                </div>
              </div>
              {/* --- END IMAGE UPLOAD SECTION --- */}

              <div className="flex flex-col">
                <Label
                  htmlFor="name"
                  className="mb-1 text-gray-600 font-medium uppercase text-xs tracking-wide"
                >
                  Workspace Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  disabled={isPending}
                  placeholder="e.g. Engineering, Marketing"
                  className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 h-12 text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() =>
                    router.push(`/dashboard/workspace/${initialValues.$id}`)
                  }
                  className="flex-1 border-gray-300 h-11 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-indigo-600 h-11 hover:bg-indigo-500 text-white font-semibold rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
            {/* 👇 INVITE CODE SECTION */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Invite Members
              </p>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-4">
                {/* Invite Link */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Invite Link</p>
                  <div className="flex items-center gap-2">
                    <input
                      value={inviteCode}
                      readOnly
                      className="flex-1 text-xs bg-white border rounded-md px-3 py-2 text-gray-600 truncate"
                    />

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(inviteCode);
                        toast.success("Invite link copied!");
                      }}
                      className="text-xs"
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-gray-400">
                    Anyone with this link can join this workspace
                  </p>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isResetting}
                    onClick={handleResetInvite}
                    className="text-xs"
                  >
                    {isResetting ? "Resetting..." : "Reset Code"}
                  </Button>
                </div>
              </div>
            </div>

            {/* 👇 DANGER ZONE — Delete Workspace */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Danger Zone
              </p>
              <div className="flex items-center justify-between p-4 rounded-lg border border-red-100 bg-red-50">
                <div>
                  <p className="text-sm font-medium text-red-700">
                    Delete this workspace
                  </p>
                  <p className="text-xs text-red-400 mt-0.5">
                    This action is permanent and cannot be undone.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending || isDeleting}
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="cursor-pointer h-9 px-3 text-xs font-medium border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-md flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 👇 DELETE CONFIRMATION MODAL */}
      <ResponsiveModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Workspace"
      >
        <div className="p-6 bg-white border-0">
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Delete Workspace
            </h2>
            <p className="text-sm text-gray-500 max-w-xs">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {initialValues.name}
              </span>
              ? This will permanently remove the workspace and all its data.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="flex-1 h-11 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </div>
        </div>
      </ResponsiveModal>
    </div>
  );
};
