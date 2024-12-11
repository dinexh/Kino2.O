import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateMetadata() {
  const metadata = {
    metadataBase: new URL('https://chitramela.in'),
    title: "Chitramela 2025 - KL University Film Festival",
    description: "Chitramela (చిత్రమేళ) is KL University's Premier Art, Photography & Film Festival happening on January 4th, 2025 in Vijayawada. Experience art exhibitions, photography contests, and film screenings at KLEF's biggest cultural event.",
    keywords: "Chitramela 2025, చిత్రమేళ, KL University arts festival, January 2025 events Vijayawada, KLU cultural fest, KLEF events Vijayawada, art festival Andhra Pradesh, photography contest Vijayawada, student film festival AP",
    alternates: {
      canonical: 'https://chitramela.in',
    },
    openGraph: {
      title: "Chitramela 2025 - KL University Film Festival",
      description: "Chitramela (చిత్రమేళ) is KL University's Premier Art, Photography & Film Festival. Join us for exhibitions, contests & cultural celebrations at KLEF, Vijayawada.",
      url: "https://chitramela.in",
      siteName: "Chitramela 2025",
      images: [
        {
          url: "https://chitramela.in/assets/newlogo.png",
          width: 1200,
          height: 630,
          alt: "Chitramela 2025 - KL University Film Festival"
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Chitramela 2025 | Official Website",
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Chitramela 2025',
    description: 'KL University\'s Premier Art, Photography & Film Festival',
    image: 'https://chitramela.in/assets/newlogo.png',
    startDate: '2025-01-04T09:00:00+05:30',
    endDate: '2025-01-04T18:00:00+05:30',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
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
        streetAddress: 'Green Fields',
        addressLocality: 'Vaddeswaram',
        addressRegion: 'Andhra Pradesh',
        postalCode: '522302',
        addressCountry: 'IN'
      }
    },
    offers: {
      '@type': 'Offer',
      url: 'https://chitramela.in',
      availability: 'https://schema.org/InStock',
      validFrom: '2024-12-01T00:00:00+05:30'
    },
    performer: {
      '@type': 'Organization',
      name: 'KL University Student Activity Center'
    }
  };

  return {
    ...metadata,
    other: {
      'script:ld+json': JSON.stringify(jsonLd),
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
