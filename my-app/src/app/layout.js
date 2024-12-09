import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import "./globals.css";

export const metadata = {
  title: "Chitramela - Your Creative Hub",
  description: "Chitramela - A celebration of art, photography, and creative cinema",
  keywords: "Chitramela, events, photography, art, cinema, creativity",
  openGraph: {
    title: "Chitramela - Your Creative Hub",
    description: "Explore creativity in events, photography, and cinema with Chitramela",
    url: "https://chitramela.in",
    siteName: "Chitramela",
    images: [
      {
        url: "https://chitramela.in/assets/newlogo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  canonical: "https://chitramela.in",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
