import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ReactQueryProvider } from "@/components/(homepage)/quary-provider";
import { Toaster } from "sonner";
import { OfflineScreen } from "@/components/(homepage)/offline-screen";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Manage your tasks and workflows efficiently with TaskFlow.",
  icons: {
    icon: "/favicon.svg",
  },
  themeColor: "#2DD4BF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <OfflineScreen>{children}</OfflineScreen>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}