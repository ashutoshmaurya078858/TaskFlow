"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageIcon, Loader2 } from "lucide-react";
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
import { UpdateProjectSchema } from "@/fetures/projects/schema"; // adjust path
import { useUpdateProject } from "../api/use-update-projects";

type EditProjectFormValues = z.infer<typeof UpdateProjectSchema>;

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  workspaceId: string;
  initialName: string;
  initialImageUrl?: string;
}

export function EditProjectModal({
  open,
  onOpenChange,
  projectId,
  workspaceId,
  initialName,
  initialImageUrl,
}: EditProjectModalProps) {
  const { mutate, isPending } = useUpdateProject();
  const inputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl ?? null
  );

  const form = useForm<EditProjectFormValues>({
    resolver: zodResolver(UpdateProjectSchema),
    defaultValues: { name: initialName, image: undefined },
  });

  // Reset form when modal opens
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
    mutate(
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
      }
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
    <ResponsiveModal open={open} onOpenChange={handleClose} title="Edit Project">
      <div className="flex items-center justify-center w-full">
        <div className="relative z-10 w-full">
          <Card className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="pb-2 px-6 pt-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Edit Project
              </CardTitle>
              <CardDescription className="text-gray-500 text-sm mt-1">
                Update your project details.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pt-4 pb-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    {isPending ? (
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
  );
}