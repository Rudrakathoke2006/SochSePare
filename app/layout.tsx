import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'SochSePare (सोच से परे) — AI Decision Reasoning Auditor',
  description: "SochSePare (सोच से परे) is an AI reasoning auditor that reveals unstated assumptions, overlooked factors, and internal contradictions in your decisions—without ever telling you what to choose.",
  keywords: ['SochSePare', 'decision making', 'critical thinking', 'reasoning auditor', 'epistemic audit', 'AI ethics', 'blind spots'],
  authors: [{ name: 'SochSePare Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container min-h-screen">
        {children}
      </body>
    </html>
  );
}
