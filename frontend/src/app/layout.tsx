import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "InterviewAI: Technical & Behavioral Mock Interview Platform",
  description:
    "Practice engineering interviews with interactive technical challenges, real-time code execution, voice dialogue, and rubric-calibrated evaluation.",
  keywords: [
    "Technical Mock Interview",
    "Data Structures and Algorithms Practice",
    "System Design Mock Interview",
    "Engineering Interview Prep",
    "Behavioral Interview Evaluation",
    "Code Sandbox",
  ],
  authors: [{ name: "InterviewAI" }],
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className="dark h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-100 selection:bg-zinc-800 selection:text-zinc-100 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
