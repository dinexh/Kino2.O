export const metadata = {
  title: "Welcome to Chitramela",
  description: "Join Chitramela to explore art, photography, and creative cinema like never before",
  openGraph: {
    title: "Welcome to Chitramela",
    description: "Showcase and discover creativity in cinema, photography, and events with Chitramela",
    url: "https://yourwebsite.com/home",
    images: [
      {
        url: "https://yourwebsite.com/assets/hero.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function HomeLayout({ children }) {
  return children;
} 