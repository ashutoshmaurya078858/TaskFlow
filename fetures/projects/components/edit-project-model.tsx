"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageIcon, Loader2, Trash2, AlertTriangle } from "lucide-react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveModal } from "@/components/(dashboard)/responsive-model";
import { UpdateProjectSchema } from "@/fetures/projects/schema";
import { useUpdateProject } from "../api/use-update-projects";
import { useDeleteProject } from "../api/use-delete-projects";

type EditProjectFormValues = z.infer<typeof UpdateProjectSchema>;

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  workspaceId: string;
  initialName: string;
  initialImageUrl?: string;
}

// ── Confirm Delete Dialog ──────────────────────────────────────────────────────
function ConfirmDeleteDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  projectName: string;
  onConfirm: () => void;
  isPending: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !isPending && onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative z-10 bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
        {/* Icon */}
        <div className="flex items-center justify-center size-12 rounded-full bg-red-50 border border-red-100 mx-auto">
          <AlertTriangle className="size-5 text-red-500" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-base font-semibold text-gray-900">
            Delete Project
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-800">"{projectName}"</span>?
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="flex-1 h-10 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Project Modal ─────────────────────────────────────────────────────────
export function EditProjectModal({
  open,
  onOpenChange,
  projectId,
  workspaceId,
  initialName,
  initialImageUrl,
}: EditProjectModalProps) {
  const { mutate: update, isPending: isUpdating } = useUpdateProject();
  const { mutate: remove, isPending: isDeleting } = useDeleteProject();

  const inputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl ?? null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isPending = isUpdating || isDeleting;

  const form = useForm<EditProjectFormValues>({
    resolver: zodResolver(UpdateProjectSchema),
    defaultValues: { name: initialName, image: undefined },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({ name: initialName, image: undefined });
      setImagePreview(initialImageUrl ?? null);
    }
  }, [open, initialName, initialImageUrl, form]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    form.setValue("image", file);
    setImagePreview(URL.createObjectURL(file));
  }

  function onSubmit(values: EditProjectFormValues) {
    update(
      {
        param: { projectId },
        form: {
          name: values.name,
          image: values.image instanceof File ? values.image : "",
        },
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  }

  function handleDelete() {
    remove(
      { param: { projectId } },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          onOpenChange(false);
        },
      },
    );
  }

  function handleClose(val: boolean) {
    if (!val) {
      form.reset();
      setImagePreview(initialImageUrl ?? null);
    }
    onOpenChange(val);
  }

  return (
    <>
      {/* Confirm delete dialog — rendered outside the modal so it stacks above it */}
      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        projectName={initialName}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />

      <ResponsiveModal
        open={open}
        onOpenChange={handleClose}
        title="Edit Project"
      >
        <div className="flex items-center justify-center w-full">
          <div className="relative z-10 w-full">
            <Card className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="pb-2 px-6 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Edit Project
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-sm mt-1">
                      Update your project details.
                    </CardDescription>
                  </div>

                  {/* Delete button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => {
                      onOpenChange(false);
                      setConfirmOpen(true);
                    }}
                    className="flex items-center gap-1.5 h-8 px-3 text-xs border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 rounded-lg transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="px-6 pt-4 pb-6">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Project Icon */}
                  <div className="flex flex-col gap-y-2">
                    <Label className="text-gray-600 font-medium uppercase text-xs tracking-wide">
                      Project Icon
                    </Label>
                    <div className="flex items-center gap-x-5">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Project icon"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-500 mb-2">
                          JPG, PNG or SVG, max 1 MB
                        </p>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.svg"
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
                          {imagePreview ? "Change Icon" : "Upload Icon"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Project Name */}
                  <div className="flex flex-col">
                    <Label
                      htmlFor="name"
                      className="mb-1 text-gray-600 font-medium uppercase text-xs tracking-wide"
                    >
                      Project Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      disabled={isPending}
                      placeholder="e.g. Marketing Website"
                      className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 h-12 text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => onOpenChange(false)}
                      className="flex-1 border-gray-300 h-11 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition disabled:opacity-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 bg-indigo-600 h-11 hover:bg-indigo-500 text-white font-semibold rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </ResponsiveModal>
    </>
  );
}
