import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "./globals.scss";
import { SnackbarProvider } from "context/SnackbarContext";
import RootProvider from "providers/RootProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <RootProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </RootProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
