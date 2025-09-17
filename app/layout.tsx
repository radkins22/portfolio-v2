import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Rachael Higgins | Software Engineer in Kearney, Nebraska",
  description: "Rachael Higgins - Software Engineer based in Kearney, Nebraska specializing in AI/ML, React, MERN Stack, and modern web technologies. Experienced in building robust backend logic to dynamic UI solutions, serving clients in Nebraska and nationwide.",
  keywords: [
    // Name + Location combinations
    "Rachael Higgins", "Rachael Higgins Nebraska", "Rachael Higgins Kearney", "Rachael Higgins Kearney Nebraska",
    "Rachael Higgins software engineer", "Rachael Higgins developer", "Rachael Higgins programmer",

    // Location-based keywords
    "software engineer Kearney Nebraska", "web developer Kearney NE", "full stack developer Nebraska",
    "software developer Kearney", "programmer Kearney Nebraska", "web development Nebraska",
    "tech professional Kearney", "software engineer Central Nebraska", "web developer Nebraska",

    // Technical skills + location
    "React developer Nebraska", "JavaScript developer Kearney", "MERN stack developer Nebraska",
    "AI developer Nebraska", "machine learning engineer Kearney", "Next.js developer Nebraska",
    "TypeScript developer Kearney Nebraska", "full stack engineer Nebraska",

    // Professional services + location
    "freelance developer Nebraska", "contract developer Kearney", "web development services Nebraska",
    "software consulting Kearney", "AI development services Nebraska", "tech freelancer Kearney",

    // General technical keywords
    "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "MongoDB", "MERN Stack",
    "AI/ML", "artificial intelligence", "machine learning", "web development", "software development",
    "full-stack developer", "frontend developer", "backend developer", "portfolio website"
  ].join(", "),
  authors: [{ name: "Rachael Higgins", url: "https://not-your-avg-nerd.dev" }],
  creator: "Rachael Higgins",
  publisher: "Rachael Higgins",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "https://not-your-avg-nerd.dev"
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-32x32.png",
  },
  openGraph: {
    title: "Rachael Higgins | Software Engineer in Kearney, Nebraska",
    description: "Software Engineer based in Kearney, Nebraska specializing in AI/ML, React, and modern web technologies. Building innovative solutions from concept to deployment.",
    type: "website",
    url: "https://not-your-avg-nerd.dev",
    siteName: "Rachael Higgins Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rachael Higgins - Software Engineer from Kearney, Nebraska",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rachael Higgins | Software Engineer in Kearney, Nebraska",
    description: "Software Engineer based in Kearney, Nebraska specializing in AI/ML, React, and modern web technologies.",
    images: ["/og-image.png"],
    creator: "@your_twitter_handle", // Update with your actual Twitter handle
  },
  verification: {
    google: "your-google-site-verification-code", // Add your Google Search Console verification code
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rachael Higgins",
    "jobTitle": "Software Engineer",
    "description": "Software Engineer specializing in AI/ML, React, MERN Stack, and modern web technologies",
    "url": "https://not-your-avg-nerd.dev",
    "image": "https://not-your-avg-nerd.dev/og-image.png",
    "email": "rhiggins.persevere@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kearney",
      "addressRegion": "NE",
      "addressCountry": "US"
    },
    "alumniOf": {
      "@type": "Organization",
      "name": "University of Nebraska" // Update with your actual education
    },
    "knowsAbout": [
      "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "MongoDB",
      "Artificial Intelligence", "Machine Learning", "Web Development",
      "Full Stack Development", "Software Engineering", "MERN Stack"
    ],
    "award": [
      "AI-Powered Assessment Platform Developer",
      "Chrome Extension Developer",
      "Full Stack Application Developer"
    ],
    "workLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kearney",
        "addressRegion": "Nebraska",
        "addressCountry": "United States"
      }
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance Software Development"
    },
    "owns": {
      "@type": "WebSite",
      "name": "Rachael Higgins Portfolio",
      "url": "https://not-your-avg-nerd.dev",
      "description": "Portfolio showcasing software engineering projects and skills"
    },
    "sameAs": [
      "https://github.com/radkins22",
      "https://www.linkedin.com/in/rachael-higgins"
    ]
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rachael Higgins Software Development",
    "description": "Professional software development services specializing in AI/ML, web applications, and modern technologies",
    "founder": {
      "@type": "Person",
      "name": "Rachael Higgins"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kearney",
      "addressRegion": "NE",
      "addressCountry": "US"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "Nebraska"
      },
      {
        "@type": "Country",
        "name": "United States"
      }
    ],
    "serviceType": [
      "Web Development",
      "Software Engineering",
      "AI/ML Development",
      "Full Stack Development"
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
        <meta name="geo.region" content="US-NE" />
        <meta name="geo.placename" content="Kearney" />
        <meta name="geo.position" content="40.699890;-99.081177" />
        <meta name="ICBM" content="40.699890, -99.081177" />

        {/* Explicit favicon meta tags for better browser compatibility */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/favicon-32x32.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
