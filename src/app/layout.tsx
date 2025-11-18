import GlassmorphicNavbar from "@/components/navbar/Navbar";
import ConvexClerkProvider from "@/components/providers/ConvexClerkProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-Regular.woff2",
  variable: "--font-jetbrains-mono",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Interviewly",
  description: "All-In one for Technical Interviews",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <div className="fixed top-0 left-0 right-0 z-50">
              <GlassmorphicNavbar />
            </div>

            <main>{children}</main>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
