import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Rachael Higgins | Software Engineer",
  description: "Portfolio of Rachael Higgins - Software Engineer specializing in React, MERN Stack, JavaScript, and modern web technologies. Building robust backend logic to dynamic UI solutions.",
  keywords: "software developer, React, MERN Stack, JavaScript, web development, portfolio, Node.js, MongoDB, full-stack",
  authors: [{ name: "Rachael Higgins" }],
  robots: "index, follow",
  openGraph: {
    title: "Rachael Higgins | Software Engineer",
    description: "Building robust backend logic to dynamic UI, turning complex requirements into real-world, maintainable code",
    type: "website",
    url: "https://not-your-avg-nerd.dev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rachael Higgins - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rachael Higgins | Software Engineer",
    description: "Building robust backend logic to dynamic UI, turning complex requirements into real-world, maintainable code",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
