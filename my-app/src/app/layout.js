import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import "./globals.css";

export const metadata = {
  metadataBase: new URL('https://chitramela.in'),
  title: "Chitramela 2024 - KL University Arts Festival | చిత్రమేళ",
  description: "Chitramela (చిత్రమేళ) is KL University's Premier Art, Photography & Film Festival in Vijayawada. Experience art exhibitions, photography contests, and film screenings at KLEF's biggest cultural event.",
  keywords: "Chitramela, చిత్రమేళ, KL University arts festival, Chitramela 2024, KLU cultural fest, KLEF events Vijayawada, art festival Andhra Pradesh, photography contest Vijayawada, student film festival AP",
  alternates: {
    canonical: 'https://chitramela.in',
  },
  openGraph: {
    title: "Chitramela 2024 - KL University Arts Festival | చిత్రమేళ",
    description: "Chitramela (చిత్రమేళ) is KL University's Premier Art, Photography & Film Festival. Join us for exhibitions, contests & cultural celebrations at KLEF, Vijayawada.",
    url: "https://chitramela.in",
    siteName: "Chitramela 2024",
    images: [
      {
        url: "https://chitramela.in/assets/newlogo.png",
        width: 1200,
        height: 630,
        alt: "Chitramela 2024 - KL University Arts Festival"
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chitramela 2024 | Official Website",
    description: "Chitramela (చిత్రమేళ) - KL University's Premier Art, Photography & Film Festival. Sponsored by Avanflix, ZeroOne, and Corgnetrix.",
    images: ["https://chitramela.in/assets/newlogo.png"],
  },
  authors: [
    { name: "KL University Student Activity Center", url: "https://sac.kluniversity.in/" }
  ],
  publisher: "Koneru Lakshmaiah Education Foundation",
  organizationAffiliation: [
    { name: "Koneru Lakshmaiah Education Foundation", url: "https://www.kluniversity.in/" },
    { name: "KLU Student Activity Center", url: "https://sac.kluniversity.in/" }
  ],
  sponsors: [
    { name: "Avanflix", url: "https://www.youtube.com/@avanflix", type: "Title Sponsor" },
    { name: "ZeroOne", url: "https://klzeroone.vercel.app/", type: "Technical Sponsor" },
    { name: "Corgnetrix", url: "https://corgnetrix.com/", type: "Technical Sponsor" }
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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

export const generateMetadata = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Chitramela 2024',
    description: 'KL University\'s Premier Art, Photography & Film Festival',
    image: 'https://chitramela.in/assets/newlogo.png',
    organizer: {
      '@type': 'Organization',
      name: 'KL University Student Activity Center',
      url: 'https://sac.kluniversity.in/'
    },
    location: {
      '@type': 'Place',
      name: 'Koneru Lakshmaiah Education Foundation',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Vijayawada',
        addressRegion: 'Andhra Pradesh',
        addressCountry: 'IN'
      }
    },
    offers: {
      '@type': 'Offer',
      url: 'https://chitramela.in',
      availability: 'https://schema.org/InStock'
    }
  };

  return {
    ...metadata,
    other: {
      'script:ld+json': JSON.stringify(jsonLd),
    },
  };
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
