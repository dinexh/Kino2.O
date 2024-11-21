import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chitremela 2k25",
  description: "A National Level Film Festival conducted by Film Technology club under KLEF SAC",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
        <body className={inter.className}>
            <Toaster position="top-right" />
            {children}
        </body>
    </html>
  );
}