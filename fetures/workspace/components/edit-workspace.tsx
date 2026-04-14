"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
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
import { toast } from "sonner"; // Make sure to import toast if you want to use it
import { useRouter } from "next/navigation";
interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: workspace;
}

export const EditWorkspaceForm = ({
  
  initialValues,
}: EditWorkspaceFormProps) => {
  // FIX 1: Initialize preview with the existing image URL so it shows up immediately
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues.imageUrl || null,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const { mutate, isPending, isError, error } = useUpdateWorkspace();

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      {
        form: finalValues,
        param: { workspace: initialValues.$id },
      },
      {
        onSuccess: () => {
          toast.success("Workspace Updated");
          form.reset();
          router.push(`/dashboard/workspace/${initialValues.$id}`);
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

  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="bg-white border backdrop-blur-md shadow-sm border-b border-slate-100 rounded-xl overflow-hidden">
          <CardHeader className="pb-2 px-6 pt-6">
            {/* FIX 3: Updated text to reflect this is an Edit form */}
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
                  onClick={()=>router.push(`/dashboard/workspace/${initialValues.$id}`)}
                  className="flex-1 border-gray-300 h-11 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </Button>
                {/* FIX 4: Updated submit button text */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-indigo-600 h-11 hover:bg-indigo-500 text-white font-semibold rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
