"use client";

import { useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/use-network-status";

export const OfflineScreen = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isOnline } = useNetworkStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted || isOnline === null) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-gray-500">
        Checking connection...
      </div>
    );
  }

  // If online → show app
  if (isOnline) return <>{children}</>;

  // If offline → show offline UI
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <svg
            className="w-9 h-9 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M8.111 8.111A7.5 7.5 0 0 0 4.5 12c0 2.25 1.008 4.26 2.596 5.596M15.889 15.889A7.5 7.5 0 0 0 19.5 12a7.5 7.5 0 0 0-7.5-7.5c-1.48 0-2.86.43-4.021 1.171M12 12v.01"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You're offline
        </h1>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          No internet connection found. Check your connection. The page will
          reload automatically when you're back online.
        </p>

        {/* Animated dots */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 mr-2">
            Waiting for connection
          </span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};