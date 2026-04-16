"use client";

import { ResponsiveModal } from "@/components/(dashboard)/responsive-model";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  message = "This action cannot be undone.",
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose} title={title}>
      <div className="p-6 flex flex-col gap-6 w-full bg-white rounded-lg">
        
        {/* Modal Header & Icon */}
        <div className="flex flex-col gap-2 items-center text-center mt-4">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{message}</p>
        </div>
        
        {/* Actions: Cancel and Confirm Buttons */}
        {/* 🔥 FIX: Removed justify-between, added gap-4 */}
        <div className="flex items-center gap-4 w-full mt-4 pb-2">
          
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading} 
            // 🔥 FIX: Changed from w-full to flex-1
            className="flex-1 h-11"
          >
            Cancel
          </Button>

          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isLoading} 
            // 🔥 FIX: Changed to flex-1 and forced explicit red colors
            className="flex-1 h-11 bg-red-600 text-white hover:bg-red-700"
          >
            {isLoading ? "Removing..." : "Confirm"}
          </Button>
          
        </div>
        
      </div>
    </ResponsiveModal>
  );
};